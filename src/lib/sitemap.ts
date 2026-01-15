import { siteConfig } from "./siteConfig";
import { allListings } from "./listingsData";

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

// Neighborhoods data for sitemap
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

/**
 * Get the current date in ISO format for lastmod
 */
const getCurrentDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

/**
 * Get a date from X days ago in ISO format
 */
const getDateDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
};

/**
 * Generate static page URLs
 */
export const getStaticPageUrls = (): SitemapUrl[] => {
  return [
    {
      loc: siteConfig.url,
      lastmod: getCurrentDate(),
      changefreq: "weekly",
      priority: 1.0,
    },
    {
      loc: `${siteConfig.url}/listings`,
      lastmod: getCurrentDate(),
      changefreq: "daily",
      priority: 0.9,
    },
    {
      loc: `${siteConfig.url}/about`,
      lastmod: getDateDaysAgo(30),
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      loc: `${siteConfig.url}/contact`,
      lastmod: getDateDaysAgo(30),
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      loc: `${siteConfig.url}/blog`,
      lastmod: getCurrentDate(),
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      loc: `${siteConfig.url}/neighborhoods`,
      lastmod: getDateDaysAgo(7),
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      loc: `${siteConfig.url}/mortgage-calculator`,
      lastmod: getDateDaysAgo(30),
      changefreq: "monthly",
      priority: 0.6,
    },
    {
      loc: `${siteConfig.url}/home-valuation`,
      lastmod: getDateDaysAgo(30),
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      loc: `${siteConfig.url}/buyer-resources`,
      lastmod: getDateDaysAgo(14),
      changefreq: "monthly",
      priority: 0.6,
    },
    {
      loc: `${siteConfig.url}/seller-resources`,
      lastmod: getDateDaysAgo(14),
      changefreq: "monthly",
      priority: 0.6,
    },
  ];
};

/**
 * Generate property listing URLs
 */
export const getPropertyUrls = (): SitemapUrl[] => {
  return allListings
    .filter((listing) => listing.status !== "Inactive" && listing.status !== "Sold")
    .map((listing) => ({
      loc: `${siteConfig.url}/property/${listing.id}`,
      lastmod: getDateDaysAgo(listing.daysOnMarket || 0),
      changefreq: "weekly" as const,
      priority: listing.featured ? 0.8 : 0.7,
    }));
};

/**
 * Generate neighborhood page URLs
 */
export const getNeighborhoodUrls = (): SitemapUrl[] => {
  return neighborhoods.map((slug) => ({
    loc: `${siteConfig.url}/neighborhoods/${slug}`,
    lastmod: getDateDaysAgo(14),
    changefreq: "monthly" as const,
    priority: 0.7,
  }));
};

/**
 * Generate all sitemap URLs
 */
export const getAllSitemapUrls = (): SitemapUrl[] => {
  return [
    ...getStaticPageUrls(),
    ...getPropertyUrls(),
    ...getNeighborhoodUrls(),
  ];
};

/**
 * Generate sitemap XML string
 */
export const generateSitemapXml = (): string => {
  const urls = getAllSitemapUrls();
  
  const urlElements = urls
    .map((url) => {
      let urlElement = `  <url>\n    <loc>${url.loc}</loc>`;
      
      if (url.lastmod) {
        urlElement += `\n    <lastmod>${url.lastmod}</lastmod>`;
      }
      
      if (url.changefreq) {
        urlElement += `\n    <changefreq>${url.changefreq}</changefreq>`;
      }
      
      if (url.priority !== undefined) {
        urlElement += `\n    <priority>${url.priority.toFixed(1)}</priority>`;
      }
      
      urlElement += `\n  </url>`;
      return urlElement;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
};

/**
 * Generate sitemap index for multiple sitemaps (future use)
 */
export const generateSitemapIndexXml = (sitemapUrls: string[]): string => {
  const sitemapElements = sitemapUrls
    .map((url) => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${getCurrentDate()}</lastmod>
  </sitemap>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapElements}
</sitemapindex>`;
};

/**
 * Get sitemap stats
 */
export const getSitemapStats = () => {
  const staticPages = getStaticPageUrls();
  const propertyPages = getPropertyUrls();
  const neighborhoodPages = getNeighborhoodUrls();

  return {
    totalUrls: staticPages.length + propertyPages.length + neighborhoodPages.length,
    staticPages: staticPages.length,
    propertyPages: propertyPages.length,
    neighborhoodPages: neighborhoodPages.length,
    lastGenerated: getCurrentDate(),
  };
};
