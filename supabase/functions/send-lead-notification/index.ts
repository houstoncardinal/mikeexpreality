import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadNotificationRequest {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  propertyAddress?: string;
  leadSource?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Lead notification function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message, propertyAddress, leadSource }: LeadNotificationRequest = await req.json();
    
    console.log("Processing lead:", { name, email, propertyAddress, leadSource });

    // Send notification email to agent
    const agentEmailResponse = await resend.emails.send({
      from: "Mike Ogunkeye Real Estate <onboarding@resend.dev>",
      to: ["mike@mikeogunkeye.com"], // Replace with actual agent email
      subject: `New Lead: ${name} ${propertyAddress ? `- ${propertyAddress}` : ""}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Lead Received!</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1e3a5f; margin-top: 0;">Contact Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 120px;">Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Phone:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><a href="tel:${phone}" style="color: #2563eb;">${phone}</a></td>
              </tr>
              ` : ""}
              ${propertyAddress ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Property:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: 600;">${propertyAddress}</td>
              </tr>
              ` : ""}
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Source:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${leadSource || "Website"}</td>
              </tr>
            </table>
            ${message ? `
            <div style="margin-top: 20px;">
              <h3 style="color: #1e3a5f; margin-bottom: 10px;">Message</h3>
              <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <p style="margin: 0; color: #1e293b; line-height: 1.6;">${message}</p>
              </div>
            </div>
            ` : ""}
          </div>
          <div style="padding: 20px; background: #1e3a5f; text-align: center;">
            <p style="color: white; margin: 0; font-size: 14px;">Mike Ogunkeye Real Estate | Houston, TX</p>
          </div>
        </div>
      `,
    });

    console.log("Agent notification email sent:", agentEmailResponse);

    // Send confirmation email to lead
    const leadEmailResponse = await resend.emails.send({
      from: "Mike Ogunkeye Real Estate <onboarding@resend.dev>",
      to: [email],
      subject: "Thank you for contacting Mike Ogunkeye Real Estate",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You, ${name}!</h1>
          </div>
          <div style="padding: 40px; background: #f8fafc;">
            <p style="color: #1e293b; font-size: 16px; line-height: 1.8; margin-top: 0;">
              Thank you for reaching out to Mike Ogunkeye Real Estate. We have received your inquiry and will get back to you within 24 hours.
            </p>
            ${propertyAddress ? `
            <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 20px 0;">
              <p style="color: #64748b; margin: 0 0 5px 0; font-size: 14px;">Property of Interest:</p>
              <p style="color: #1e3a5f; margin: 0; font-size: 18px; font-weight: 600;">${propertyAddress}</p>
            </div>
            ` : ""}
            <p style="color: #1e293b; font-size: 16px; line-height: 1.8;">
              In the meantime, feel free to browse our <a href="https://mikeogunkeye.com/listings" style="color: #2563eb;">featured listings</a> or learn more about our services.
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="tel:8323408787" style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">Call Us: (832) 340-8787</a>
            </div>
          </div>
          <div style="padding: 20px; background: #1e3a5f; text-align: center;">
            <p style="color: white; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Mike Ogunkeye</p>
            <p style="color: #93c5fd; margin: 0; font-size: 14px;">EXP Realty | Houston, TX</p>
          </div>
        </div>
      `,
    });

    console.log("Lead confirmation email sent:", leadEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        agentEmail: agentEmailResponse, 
        leadEmail: leadEmailResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-lead-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
