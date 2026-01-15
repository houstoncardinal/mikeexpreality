import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface HealthCheckResult {
  name: string;
  status: "healthy" | "degraded" | "unhealthy";
  latency?: number;
  message?: string;
}

const ADMIN_EMAIL = "mike@mikeodigital.io";
const SITE_URL = "https://mikeo.lovable.app";

async function checkDatabase(supabase: any): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    const { error } = await supabase.from("properties").select("id").limit(1);
    const latency = Date.now() - start;
    
    if (error) {
      return { name: "Database", status: "unhealthy", latency, message: error.message };
    }
    
    return {
      name: "Database",
      status: latency > 1000 ? "degraded" : "healthy",
      latency,
      message: latency > 1000 ? "Slow response time" : "Connected and responsive",
    };
  } catch (err) {
    return { name: "Database", status: "unhealthy", latency: Date.now() - start, message: "Connection failed" };
  }
}

async function checkAuth(supabase: any): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    const { error } = await supabase.auth.getSession();
    const latency = Date.now() - start;
    
    if (error) {
      return { name: "Authentication", status: "unhealthy", latency, message: error.message };
    }
    
    return {
      name: "Authentication",
      status: "healthy",
      latency,
      message: "Auth service available",
    };
  } catch (err) {
    return { name: "Authentication", status: "unhealthy", latency: Date.now() - start, message: "Auth check failed" };
  }
}

async function checkSitemapGenerator(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    const response = await fetch(`${supabaseUrl}/functions/v1/generate-sitemap?format=xml`, {
      headers: {
        Authorization: `Bearer ${anonKey}`,
      },
    });
    
    const latency = Date.now() - start;
    
    if (response.ok) {
      const text = await response.text();
      const urlCount = (text.match(/<url>/g) || []).length;
      return {
        name: "Sitemap Generator",
        status: latency > 5000 ? "degraded" : "healthy",
        latency,
        message: `Generated ${urlCount} URLs`,
      };
    }
    
    return {
      name: "Sitemap Generator",
      status: "degraded",
      latency,
      message: `HTTP ${response.status}`,
    };
  } catch (err) {
    return {
      name: "Sitemap Generator",
      status: "unhealthy",
      latency: Date.now() - start,
      message: "Sitemap generation failed",
    };
  }
}

async function sendAlertEmail(resend: Resend, results: HealthCheckResult[], overallStatus: string) {
  const failedChecks = results.filter(r => r.status !== "healthy");
  
  const statusEmoji = overallStatus === "unhealthy" ? "🔴" : "🟡";
  const statusLabel = overallStatus === "unhealthy" ? "CRITICAL" : "WARNING";
  
  const checksHtml = results.map(check => {
    const color = check.status === "healthy" ? "#10B981" : check.status === "degraded" ? "#F59E0B" : "#EF4444";
    const icon = check.status === "healthy" ? "✅" : check.status === "degraded" ? "⚠️" : "❌";
    return `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #E5E7EB;">
          ${icon} <strong>${check.name}</strong>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; color: ${color}; font-weight: bold;">
          ${check.status.toUpperCase()}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #E5E7EB;">
          ${check.latency ? `${check.latency}ms` : "-"}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; color: #6B7280;">
          ${check.message || "-"}
        </td>
      </tr>
    `;
  }).join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Health Check Alert</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: #1F2937; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: ${overallStatus === "unhealthy" ? "#FEE2E2" : "#FEF3C7"}; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <h1 style="margin: 0; font-size: 20px; color: ${overallStatus === "unhealthy" ? "#991B1B" : "#92400E"};">
          ${statusEmoji} ${statusLabel}: Health Check Alert
        </h1>
        <p style="margin: 8px 0 0 0; color: ${overallStatus === "unhealthy" ? "#B91C1C" : "#B45309"};">
          ${failedChecks.length} service(s) need attention on ${SITE_URL}
        </p>
      </div>
      
      <h2 style="font-size: 16px; color: #374151; margin-bottom: 16px;">Service Status</h2>
      
      <table style="width: 100%; border-collapse: collapse; background: #F9FAFB; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background: #F3F4F6;">
            <th style="padding: 12px; text-align: left; color: #6B7280; font-weight: 600;">Service</th>
            <th style="padding: 12px; text-align: left; color: #6B7280; font-weight: 600;">Status</th>
            <th style="padding: 12px; text-align: left; color: #6B7280; font-weight: 600;">Latency</th>
            <th style="padding: 12px; text-align: left; color: #6B7280; font-weight: 600;">Details</th>
          </tr>
        </thead>
        <tbody>
          ${checksHtml}
        </tbody>
      </table>
      
      <div style="margin-top: 24px; padding: 16px; background: #F3F4F6; border-radius: 8px;">
        <p style="margin: 0; font-size: 14px; color: #6B7280;">
          <strong>Timestamp:</strong> ${new Date().toISOString()}<br>
          <strong>Health Dashboard:</strong> <a href="${SITE_URL}/health" style="color: #2563EB;">${SITE_URL}/health</a>
        </p>
      </div>
      
      <p style="margin-top: 24px; font-size: 12px; color: #9CA3AF; text-align: center;">
        This is an automated health check alert from Mike O Real Estate
      </p>
    </body>
    </html>
  `;

  try {
    const { error } = await resend.emails.send({
      from: "Health Monitor <onboarding@resend.dev>",
      to: [ADMIN_EMAIL],
      subject: `${statusEmoji} [${statusLabel}] Mike O Real Estate - Health Check Alert`,
      html,
    });

    if (error) {
      console.error("Failed to send alert email:", error);
      return false;
    }
    
    console.log("Alert email sent successfully to", ADMIN_EMAIL);
    return true;
  } catch (err) {
    console.error("Error sending alert email:", err);
    return false;
  }
}

async function storeHealthCheckLog(supabase: any, overallStatus: string, results: HealthCheckResult[], emailSent: boolean, triggeredBy: string) {
  try {
    // Store the health check log
    await supabase.from("health_check_logs").insert({
      overall_status: overallStatus,
      results: results,
      email_sent: emailSent,
      triggered_by: triggeredBy,
    });

    // Create incidents for non-healthy services
    const incidents = results
      .filter(r => r.status !== "healthy")
      .map(r => ({
        service_name: r.name,
        status: r.status,
        message: r.message,
        latency: r.latency,
      }));

    if (incidents.length > 0) {
      await supabase.from("health_incidents").insert(incidents);
    }

    // Auto-resolve old incidents that are now healthy
    const healthyServices = results.filter(r => r.status === "healthy").map(r => r.name);
    if (healthyServices.length > 0) {
      await supabase
        .from("health_incidents")
        .update({ resolved_at: new Date().toISOString() })
        .in("service_name", healthyServices)
        .is("resolved_at", null);
    }

    console.log("Health check log stored successfully");
  } catch (err) {
    console.error("Failed to store health check log:", err);
  }
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("Starting health check monitoring...");

  // Parse request body for triggered_by info
  let triggeredBy = "cron";
  try {
    const body = await req.json();
    triggeredBy = body?.source || "cron";
  } catch {
    // No body or invalid JSON, use default
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = resendApiKey ? new Resend(resendApiKey) : null;

    // Run all health checks in parallel
    const [dbResult, authResult, sitemapResult] = await Promise.all([
      checkDatabase(supabase),
      checkAuth(supabase),
      checkSitemapGenerator(),
    ]);

    const results: HealthCheckResult[] = [dbResult, authResult, sitemapResult];
    
    // Determine overall status
    const hasUnhealthy = results.some(r => r.status === "unhealthy");
    const hasDegraded = results.some(r => r.status === "degraded");
    const overallStatus = hasUnhealthy ? "unhealthy" : hasDegraded ? "degraded" : "healthy";
    
    console.log("Health check results:", JSON.stringify(results, null, 2));
    console.log("Overall status:", overallStatus);

    // Send email alert if any check is not healthy
    let emailSent = false;
    if (overallStatus !== "healthy" && resend) {
      emailSent = await sendAlertEmail(resend, results, overallStatus);
    }

    // Store results in database
    await storeHealthCheckLog(supabase, overallStatus, results, emailSent, triggeredBy);

    return new Response(
      JSON.stringify({
        success: true,
        overallStatus,
        results,
        emailSent,
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
    console.error("Health monitor error:", error);
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
