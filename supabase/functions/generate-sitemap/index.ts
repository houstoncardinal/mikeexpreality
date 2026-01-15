import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: number;
}

const siteUrl = "https://mikeo.lovable.app";

// Static pages configuration
const staticPages = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/listings", changefreq: "daily", priority: 0.9 },
  { path: "/about", changefreq: "monthly", priority: 0.8 },
  { path: "/contact", changefreq: "monthly", priority: 0.8 },
  { path: "/blog", changefreq: "weekly", priority: 0.8 },
  { path: "/neighborhoods", changefreq: "weekly", priority: 0.8 },
  { path: "/mortgage-calculator", changefreq: "monthly", priority: 0.6 },
  { path: "/home-valuation", changefreq: "monthly", priority: 0.7 },
  { path: "/buyer-resources", changefreq: "monthly", priority: 0.6 },
  { path: "/seller-resources", changefreq: "monthly", priority: 0.6 },
];

// Neighborhoods
const neighborhoods = [
  "houston",
  "sugar-land",
  "katy",
  "cypress",
  "richmond",
  "missouri-city",
  "pearland",
  "rosenberg",
];

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

function generateSitemapXml(urls: SitemapUrl[]): string {
  const urlElements = urls
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority.toFixed(1)}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Check if this is a direct sitemap.xml request (GET with Accept header for XML)
  const url = new URL(req.url);
  const wantsXml = req.headers.get("accept")?.includes("application/xml") || 
                   url.searchParams.get("format") === "xml" ||
                   url.pathname.endsWith(".xml");

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const today = formatDate(new Date());
    const urls: SitemapUrl[] = [];

    // Add static pages
    for (const page of staticPages) {
      urls.push({
        loc: `${siteUrl}${page.path}`,
        lastmod: today,
        changefreq: page.changefreq,
        priority: page.priority,
      });
    }

    // Fetch active properties from database
    const { data: properties, error: propertiesError } = await supabase
      .from("properties")
      .select("id, updated_at, status")
      .in("status", ["active", "pending", "coming_soon"]);

    if (propertiesError) {
      console.error("Error fetching properties:", propertiesError);
    } else if (properties) {
      for (const property of properties) {
        urls.push({
          loc: `${siteUrl}/property/${property.id}`,
          lastmod: formatDate(property.updated_at),
          changefreq: "weekly",
          priority: 0.7,
        });
      }
    }

    // Fetch published blog posts
    const { data: posts, error: postsError } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, is_featured")
      .eq("is_published", true);

    if (postsError) {
      console.error("Error fetching blog posts:", postsError);
    } else if (posts) {
      for (const post of posts) {
        urls.push({
          loc: `${siteUrl}/blog/${post.slug}`,
          lastmod: formatDate(post.updated_at),
          changefreq: "monthly",
          priority: post.is_featured ? 0.7 : 0.6,
        });
      }
    }

    // Add neighborhood pages
    for (const neighborhood of neighborhoods) {
      urls.push({
        loc: `${siteUrl}/neighborhoods/${neighborhood}`,
        lastmod: today,
        changefreq: "monthly",
        priority: 0.7,
      });
    }

    const sitemapXml = generateSitemapXml(urls);

    // Return XML format for sitemap requests or when format=xml
    if (wantsXml || url.searchParams.get("format") === "xml") {
      return new Response(sitemapXml, {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        },
      });
    }

    // Return JSON stats for API calls
    return new Response(
      JSON.stringify({
        success: true,
        urlCount: urls.length,
        breakdown: {
          staticPages: staticPages.length,
          properties: properties?.length || 0,
          blogPosts: posts?.length || 0,
          neighborhoods: neighborhoods.length,
        },
        generatedAt: new Date().toISOString(),
        sitemapXml: url.searchParams.get("format") === "full" ? sitemapXml : undefined,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error generating sitemap:", error);
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
