import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  filters: {
    search?: string;
    city?: string;
    propertyType?: string;
    priceRange?: string;
    minBeds?: number;
    minBaths?: number;
  };
  notify_email: boolean;
  properties_notified: string[];
}

interface Property {
  id: string;
  title: string;
  address_line1: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
}

interface UserProfile {
  email: string;
  full_name: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    // Get all saved searches with email notifications enabled
    const { data: savedSearches, error: searchError } = await supabase
      .from("saved_searches")
      .select("*")
      .eq("notify_email", true);

    if (searchError) {
      console.error("Error fetching saved searches:", searchError);
      throw searchError;
    }

    if (!savedSearches || savedSearches.length === 0) {
      console.log("No saved searches with notifications enabled");
      return new Response(
        JSON.stringify({ message: "No searches to process", notified: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get recent properties (added in last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: recentProperties, error: propError } = await supabase
      .from("properties")
      .select("id, title, address_line1, city, price, bedrooms, bathrooms, sqft")
      .gte("created_at", oneDayAgo)
      .eq("status", "active");

    if (propError) {
      console.error("Error fetching properties:", propError);
      throw propError;
    }

    if (!recentProperties || recentProperties.length === 0) {
      console.log("No new properties in the last 24 hours");
      return new Response(
        JSON.stringify({ message: "No new properties", notified: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let totalNotified = 0;

    // Process each saved search
    for (const search of savedSearches as SavedSearch[]) {
      // Filter properties matching the search criteria
      const matchingProperties = recentProperties.filter((prop: Property) => {
        // Skip already notified properties
        if (search.properties_notified?.includes(prop.id)) return false;

        const filters = search.filters;

        // City filter
        if (filters.city && prop.city !== filters.city) return false;

        // Bedrooms filter
        if (filters.minBeds && prop.bedrooms < filters.minBeds) return false;

        // Bathrooms filter
        if (filters.minBaths && prop.bathrooms < filters.minBaths) return false;

        // Search term filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const matchesSearch =
            prop.title?.toLowerCase().includes(searchLower) ||
            prop.address_line1?.toLowerCase().includes(searchLower) ||
            prop.city?.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }

        return true;
      });

      if (matchingProperties.length === 0) continue;

      // Get user email
      const { data: profile } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("id", search.user_id)
        .single();

      if (!profile?.email) {
        console.log(`No email for user ${search.user_id}`);
        continue;
      }

      // Send email notification
      const propertyList = matchingProperties
        .map(
          (p: Property) =>
            `<li style="margin-bottom: 12px;">
              <strong>${p.title}</strong><br>
              ${p.address_line1}, ${p.city}<br>
              $${p.price.toLocaleString()} • ${p.bedrooms} beds • ${p.bathrooms} baths • ${p.sqft.toLocaleString()} sqft
            </li>`
        )
        .join("");

      try {
        await resend.emails.send({
          from: "Mike Ogunkeye Real Estate <onboarding@resend.dev>",
          to: [profile.email],
          subject: `${matchingProperties.length} New Properties Match "${search.name}"`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #1a365d;">New Properties Alert</h1>
              <p>Hi ${profile.full_name || "there"},</p>
              <p>We found <strong>${matchingProperties.length} new ${matchingProperties.length === 1 ? "property" : "properties"}</strong> matching your saved search "<strong>${search.name}</strong>":</p>
              <ul style="list-style: none; padding: 0;">
                ${propertyList}
              </ul>
              <p style="margin-top: 24px;">
                <a href="https://mikeo.lovable.app/map-search" style="background: #1a365d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                  View on Map
                </a>
              </p>
              <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px;">
                You received this email because you have email notifications enabled for your saved search.
                To unsubscribe, log in and disable notifications for this search.
              </p>
            </div>
          `,
        });

        // Update the saved search with notified property IDs
        const updatedNotified = [
          ...(search.properties_notified || []),
          ...matchingProperties.map((p: Property) => p.id),
        ];

        await supabase
          .from("saved_searches")
          .update({
            properties_notified: updatedNotified,
            last_notified_at: new Date().toISOString(),
          })
          .eq("id", search.id);

        totalNotified++;
        console.log(`Notified user ${search.user_id} about ${matchingProperties.length} properties`);
      } catch (emailError) {
        console.error(`Failed to send email for search ${search.id}:`, emailError);
      }
    }

    console.log(`Total notifications sent: ${totalNotified}`);

    return new Response(
      JSON.stringify({ success: true, notified: totalNotified }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in notify-saved-searches:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
