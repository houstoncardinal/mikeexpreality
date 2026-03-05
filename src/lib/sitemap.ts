import { siteConfig } from "./siteConfig";
import { allListings } from "./listingsData";

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

const neighborhoods = [
  "houston", "sugar-land", "katy", "cypress", "richmond",
  "missouri-city", "pearland", "rosenberg",
];

const getCurrentDate = (): string => new Date().toISOString().split("T")[0];
const getDateDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
};

export const getStaticPageUrls = (): SitemapUrl[] => [
  { loc: siteConfig.url, lastmod: getCurrentDate(), changefreq: "weekly", priority: 1.0 },
  { loc: `${siteConfig.url}/listings`, lastmod: getCurrentDate(), changefreq: "daily", priority: 0.9 },
  { loc: `${siteConfig.url}/about`, lastmod: getDateDaysAgo(30), changefreq: "monthly", priority: 0.8 },
  { loc: `${siteConfig.url}/contact`, lastmod: getDateDaysAgo(30), changefreq: "monthly", priority: 0.8 },
  { loc: `${siteConfig.url}/blog`, lastmod: getCurrentDate(), changefreq: "weekly", priority: 0.8 },
  { loc: `${siteConfig.url}/neighborhoods`, lastmod: getDateDaysAgo(7), changefreq: "weekly", priority: 0.9 },
  { loc: `${siteConfig.url}/buyer-resources`, lastmod: getDateDaysAgo(7), changefreq: "weekly", priority: 0.9 },
  { loc: `${siteConfig.url}/seller-resources`, lastmod: getDateDaysAgo(7), changefreq: "weekly", priority: 0.9 },
  { loc: `${siteConfig.url}/home-search`, lastmod: getDateDaysAgo(7), changefreq: "weekly", priority: 0.8 },
  { loc: `${siteConfig.url}/home-valuation`, lastmod: getDateDaysAgo(30), changefreq: "monthly", priority: 0.8 },
  { loc: `${siteConfig.url}/mortgage-calculator`, lastmod: getDateDaysAgo(30), changefreq: "monthly", priority: 0.7 },
  { loc: `${siteConfig.url}/map-search`, lastmod: getDateDaysAgo(14), changefreq: "weekly", priority: 0.7 },
  { loc: `${siteConfig.url}/success-stories`, lastmod: getDateDaysAgo(14), changefreq: "monthly", priority: 0.6 },
  { loc: `${siteConfig.url}/privacy-policy`, lastmod: getDateDaysAgo(90), changefreq: "yearly", priority: 0.3 },
  { loc: `${siteConfig.url}/terms`, lastmod: getDateDaysAgo(90), changefreq: "yearly", priority: 0.3 },
];

export const getPropertyUrls = (): SitemapUrl[] =>
  allListings
    .filter((listing) => listing.status !== "Inactive" && listing.status !== "Sold")
    .map((listing) => ({
      loc: `${siteConfig.url}/property/${listing.id}`,
      lastmod: getDateDaysAgo(listing.daysOnMarket || 0),
      changefreq: "weekly" as const,
      priority: listing.featured ? 0.8 : 0.7,
    }));

export const getNeighborhoodUrls = (): SitemapUrl[] =>
  neighborhoods.map((slug) => ({
    loc: `${siteConfig.url}/neighborhoods/${slug}`,
    lastmod: getDateDaysAgo(7),
    changefreq: "weekly" as const,
    priority: 0.8,
  }));

export const getAllSitemapUrls = (): SitemapUrl[] => [
  ...getStaticPageUrls(),
  ...getPropertyUrls(),
  ...getNeighborhoodUrls(),
];

export const generateSitemapXml = (): string => {
  const urls = getAllSitemapUrls();
  const urlElements = urls.map((url) => {
    let el = `  <url>\n    <loc>${url.loc}</loc>`;
    if (url.lastmod) el += `\n    <lastmod>${url.lastmod}</lastmod>`;
    if (url.changefreq) el += `\n    <changefreq>${url.changefreq}</changefreq>`;
    if (url.priority !== undefined) el += `\n    <priority>${url.priority.toFixed(1)}</priority>`;
    el += `\n  </url>`;
    return el;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
};

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
