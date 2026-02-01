import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadPreferences {
  name: string;
  email: string;
  homeType: string[];
  budget: { min: string; max: string };
  areas: string[];
  bedrooms: string;
  bathrooms: string;
  mustHaves: string[];
  timeline: string;
  schoolPriority?: string;
}

interface Property {
  id: string;
  title: string;
  address_line1: string;
  city: string;
  state: string;
  zip_code: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images: string[];
  property_type: string;
}

// Parse budget string to number (e.g., "$500K" -> 500000)
const parseBudget = (budget: string): number => {
  if (!budget) return 0;
  const clean = budget.replace(/[$,]/g, "").toUpperCase();
  if (clean.includes("M")) {
    return parseFloat(clean.replace("M", "")) * 1000000;
  }
  if (clean.includes("K")) {
    return parseFloat(clean.replace("K", "")) * 1000;
  }
  return parseFloat(clean) || 0;
};

// Map home type preferences to database property types
const mapHomeType = (type: string): string | null => {
  const mapping: Record<string, string> = {
    single_family: "single_family",
    townhouse: "townhouse",
    condo: "condo",
    new_construction: "single_family",
    luxury: "single_family",
    land: "land",
  };
  return mapping[type] || null;
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Property recommendations function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const preferences: LeadPreferences = await req.json();
    console.log("Processing recommendations for:", preferences.email);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse budget range
    const minPrice = parseBudget(preferences.budget.min);
    const maxPrice = parseBudget(preferences.budget.max) || 10000000;

    // Map home types
    const propertyTypes = preferences.homeType
      .map(mapHomeType)
      .filter((t): t is string => t !== null);

    // Build query for matching properties
    let query = supabase
      .from("properties")
      .select("*")
      .eq("status", "active")
      .gte("price", minPrice * 0.85) // Allow 15% below min budget
      .lte("price", maxPrice * 1.1); // Allow 10% above max budget

    // Filter by property type if specified
    if (propertyTypes.length > 0) {
      query = query.in("property_type", propertyTypes);
    }

    // Filter by bedrooms
    const minBedrooms = parseInt(preferences.bedrooms.replace("+", "")) || 0;
    if (minBedrooms > 0) {
      query = query.gte("bedrooms", minBedrooms);
    }

    // Filter by city/area
    if (preferences.areas.length > 0) {
      query = query.in("city", preferences.areas);
    }

    // Get matching properties
    const { data: properties, error: queryError } = await query
      .order("created_at", { ascending: false })
      .limit(6);

    if (queryError) {
      console.error("Query error:", queryError);
      throw queryError;
    }

    console.log(`Found ${properties?.length || 0} matching properties`);

    // Format currency
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(price);
    };

    // Generate property cards HTML
    const generatePropertyCards = (props: Property[]) => {
      if (!props || props.length === 0) {
        return `
          <div style="text-align: center; padding: 40px; background: #f8fafc; border-radius: 12px; margin: 20px 0;">
            <h3 style="color: #1e3a5f; margin-bottom: 10px;">We're Finding Your Perfect Match!</h3>
            <p style="color: #64748b;">
              We're actively searching for properties that match your criteria. 
              Mike will personally reach out with curated options soon!
            </p>
          </div>
        `;
      }

      return props
        .map(
          (p) => `
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 16px;">
            ${
              p.images && p.images[0]
                ? `<img src="${p.images[0]}" alt="${p.title}" style="width: 100%; height: 180px; object-fit: cover;" />`
                : `<div style="width: 100%; height: 180px; background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">🏠</div>`
            }
            <div style="padding: 16px;">
              <h3 style="margin: 0 0 8px 0; color: #1e3a5f; font-size: 18px;">${formatPrice(p.price)}</h3>
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">
                ${p.bedrooms} bed • ${p.bathrooms} bath${p.sqft ? ` • ${p.sqft.toLocaleString()} sqft` : ""}
              </p>
              <p style="margin: 0; color: #1e293b; font-size: 14px;">
                ${p.address_line1}, ${p.city}, ${p.state} ${p.zip_code}
              </p>
            </div>
          </div>
        `
        )
        .join("");
    };

    // Build preference summary
    const preferenceSummary = `
      <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #1e3a5f; margin: 0 0 12px 0; font-size: 16px;">📋 Your Search Criteria</h3>
        <table style="width: 100%; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Budget:</td>
            <td style="padding: 6px 0; color: #1e293b; font-weight: 600;">${preferences.budget.min} - ${preferences.budget.max}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Areas:</td>
            <td style="padding: 6px 0; color: #1e293b; font-weight: 600;">${preferences.areas.join(", ")}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Bedrooms:</td>
            <td style="padding: 6px 0; color: #1e293b; font-weight: 600;">${preferences.bedrooms}+</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Home Type:</td>
            <td style="padding: 6px 0; color: #1e293b; font-weight: 600;">${preferences.homeType.join(", ").replace(/_/g, " ")}</td>
          </tr>
          ${preferences.mustHaves.length > 0 ? `
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Must-Haves:</td>
            <td style="padding: 6px 0; color: #1e293b; font-weight: 600;">${preferences.mustHaves.slice(0, 4).join(", ").replace(/_/g, " ")}</td>
          </tr>
          ` : ""}
        </table>
      </div>
    `;

    // Send personalized email
    const emailResponse = await resend.emails.send({
      from: "Mike Ogunkeye Real Estate <onboarding@resend.dev>",
      to: [preferences.email],
      subject: `🏠 ${preferences.name}, Here Are Homes Matching Your Criteria!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Your Personalized Home Matches</h1>
            <p style="color: #93c5fd; margin: 10px 0 0 0; font-size: 16px;">
              Curated just for you by Mike Ogunkeye
            </p>
          </div>
          
          <div style="padding: 30px;">
            <p style="color: #1e293b; font-size: 16px; line-height: 1.8; margin-top: 0;">
              Hi ${preferences.name}! 👋
            </p>
            <p style="color: #1e293b; font-size: 16px; line-height: 1.8;">
              Thank you for sharing your home preferences with me! Based on what you're looking for, 
              I've found some properties that I think you'll love.
            </p>
            
            ${preferenceSummary}
            
            <h2 style="color: #1e3a5f; margin: 30px 0 20px 0; font-size: 20px;">
              🏡 Properties You Might Love
            </h2>
            
            ${generatePropertyCards(properties || [])}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://mikeogunkeye.com/listings" 
                 style="display: inline-block; background: #2563eb; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                View All Listings
              </a>
            </div>
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">⏰ Your Timeline: ${preferences.timeline}</h3>
              <p style="color: #78350f; margin: 0; font-size: 14px;">
                I'll be reaching out within 24 hours to discuss your search in more detail 
                and schedule private showings for any homes that interest you!
              </p>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 30px; margin-top: 30px;">
              <table style="width: 100%;">
                <tr>
                  <td style="width: 70px; vertical-align: top;">
                    <img src="https://mikeogunkeye.com/logo-primary.jpeg" alt="Mike Ogunkeye" 
                         style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;" />
                  </td>
                  <td style="vertical-align: top; padding-left: 15px;">
                    <p style="margin: 0 0 5px 0; color: #1e3a5f; font-weight: 600; font-size: 16px;">Mike Ogunkeye</p>
                    <p style="margin: 0 0 5px 0; color: #64748b; font-size: 14px;">Luxury Real Estate Specialist</p>
                    <p style="margin: 0; color: #64748b; font-size: 14px;">EXP Realty | Houston, TX</p>
                    <p style="margin: 10px 0 0 0;">
                      <a href="tel:8323408787" style="color: #2563eb; text-decoration: none; font-weight: 600;">
                        📞 (832) 340-8787
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          
          <div style="background: #1e3a5f; padding: 20px; text-align: center;">
            <p style="color: #93c5fd; margin: 0; font-size: 12px;">
              © 2025 Mike Ogunkeye Real Estate | Houston, TX
            </p>
            <p style="color: #64748b; margin: 10px 0 0 0; font-size: 11px;">
              You're receiving this because you submitted your home search preferences on our website.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Recommendations email sent:", emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        propertiesFound: properties?.length || 0,
        emailResponse,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-property-recommendations:", error);
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
