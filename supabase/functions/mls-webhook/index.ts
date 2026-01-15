import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-mls-signature",
};

interface MLSWebhookPayload {
  event_type: "property_created" | "property_updated" | "property_deleted" | "property_status_changed";
  property_id?: string;
  mls_number?: string;
  timestamp?: string;
  data?: Record<string, unknown>;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("MLS webhook received");

  // Get source IP from headers
  const sourceIp = req.headers.get("cf-connecting-ip") || 
                   req.headers.get("x-forwarded-for")?.split(",")[0] || 
                   "unknown";

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse the webhook payload
    let payload: MLSWebhookPayload;
    try {
      payload = await req.json();
    } catch {
      payload = { event_type: "property_updated" };
    }

    console.log("Webhook payload:", JSON.stringify(payload, null, 2));

    // Validate event type
    const validEventTypes = ["property_created", "property_updated", "property_deleted", "property_status_changed"];
    if (!validEventTypes.includes(payload.event_type)) {
      console.warn("Unknown event type:", payload.event_type);
    }

    // Log the webhook event
    const { error: logError } = await supabase.from("mls_webhook_logs").insert({
      event_type: payload.event_type,
      payload: payload,
      property_id: payload.property_id || payload.mls_number || null,
      source_ip: sourceIp,
      sitemap_regenerated: false,
    });

    if (logError) {
      console.error("Failed to log webhook:", logError);
    }

    // Trigger sitemap regeneration for property-related events
    let sitemapRegenerated = false;
    if (["property_created", "property_updated", "property_deleted", "property_status_changed"].includes(payload.event_type)) {
      console.log("Triggering sitemap regeneration...");
      
      try {
        const sitemapResponse = await fetch(`${supabaseUrl}/functions/v1/generate-sitemap?format=xml`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${anonKey}`,
          },
        });

        if (sitemapResponse.ok) {
          sitemapRegenerated = true;
          console.log("Sitemap regenerated successfully");

          // Update the webhook log to mark sitemap as regenerated
          await supabase
            .from("mls_webhook_logs")
            .update({ sitemap_regenerated: true })
            .eq("property_id", payload.property_id || payload.mls_number)
            .order("created_at", { ascending: false })
            .limit(1);
        } else {
          console.error("Sitemap regeneration failed with status:", sitemapResponse.status);
        }
      } catch (sitemapError) {
        console.error("Error triggering sitemap regeneration:", sitemapError);
      }
    }

    // Trigger health check after sitemap regeneration
    try {
      await fetch(`${supabaseUrl}/functions/v1/health-monitor`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${anonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source: "mls_webhook" }),
      });
      console.log("Health check triggered");
    } catch (healthError) {
      console.error("Error triggering health check:", healthError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Webhook processed successfully",
        event_type: payload.event_type,
        property_id: payload.property_id || payload.mls_number,
        sitemap_regenerated: sitemapRegenerated,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("MLS webhook error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
