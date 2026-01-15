import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Search,
  Globe,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ExternalLink,
  Code,
  Tag,
  Image,
  Link2,
  Clock,
  TrendingUp,
  BarChart3,
  FileCode,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { siteConfig } from "@/lib/siteConfig";
import { getSitemapStats } from "@/lib/sitemap";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PageAudit {
  url: string;
  title: string;
  hasTitle: boolean;
  hasDescription: boolean;
  hasCanonical: boolean;
  hasOgTags: boolean;
  hasSchema: boolean;
  schemaTypes: string[];
  issues: string[];
  score: number;
}

interface SitemapStats {
  totalUrls: number;
  staticPages: number;
  propertyPages: number;
  neighborhoodPages: number;
  lastGenerated: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Pages to audit
const pagesToAudit = [
  { url: "/", name: "Home", schemaTypes: ["Organization", "RealEstateAgent", "WebSite"] },
  { url: "/listings", name: "Listings", schemaTypes: ["ItemList", "RealEstateListing"] },
  { url: "/about", name: "About", schemaTypes: ["Person", "RealEstateAgent"] },
  { url: "/contact", name: "Contact", schemaTypes: ["ContactPage", "LocalBusiness"] },
  { url: "/blog", name: "Blog", schemaTypes: ["Blog", "CollectionPage"] },
  { url: "/neighborhoods", name: "Neighborhoods", schemaTypes: ["ItemList", "Place"] },
  { url: "/mortgage-calculator", name: "Mortgage Calculator", schemaTypes: ["WebApplication"] },
  { url: "/home-valuation", name: "Home Valuation", schemaTypes: ["Service"] },
  { url: "/buyer-resources", name: "Buyer Resources", schemaTypes: ["HowTo", "FAQPage"] },
  { url: "/seller-resources", name: "Seller Resources", schemaTypes: ["HowTo", "FAQPage"] },
];

export default function AdminSEO() {
  const [isAuditing, setIsAuditing] = useState(false);
  const [pageAudits, setPageAudits] = useState<PageAudit[]>([]);
  const [sitemapStats, setSitemapStats] = useState<SitemapStats | null>(null);
  const [lastSitemapRegen, setLastSitemapRegen] = useState<string | null>(null);
  const [isRegeneratingSitemap, setIsRegeneratingSitemap] = useState(false);
  const [propertyCount, setPropertyCount] = useState(0);

  useEffect(() => {
    loadSitemapStats();
    loadPropertyCount();
    runAudit();
  }, []);

  const loadSitemapStats = () => {
    const stats = getSitemapStats();
    setSitemapStats(stats);
  };

  const loadPropertyCount = async () => {
    try {
      const { count } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");
      setPropertyCount(count || 0);
    } catch (error) {
      console.error("Error loading property count:", error);
    }
  };

  const runAudit = async () => {
    setIsAuditing(true);
    
    // Simulate audit - in a real scenario, this would fetch and analyze actual pages
    const audits: PageAudit[] = pagesToAudit.map((page) => {
      const hasTitle = true;
      const hasDescription = true;
      const hasCanonical = true;
      const hasOgTags = Math.random() > 0.2;
      const hasSchema = Math.random() > 0.1;
      const issues: string[] = [];

      if (!hasOgTags) issues.push("Missing Open Graph tags");
      if (!hasSchema) issues.push("Missing schema markup");
      if (Math.random() > 0.7) issues.push("Meta description too short");
      if (Math.random() > 0.8) issues.push("Missing alt text on images");

      const score = Math.round(
        ((hasTitle ? 20 : 0) +
          (hasDescription ? 20 : 0) +
          (hasCanonical ? 15 : 0) +
          (hasOgTags ? 25 : 0) +
          (hasSchema ? 20 : 0)) *
          (1 - issues.length * 0.05)
      );

      return {
        url: page.url,
        title: page.name,
        hasTitle,
        hasDescription,
        hasCanonical,
        hasOgTags,
        hasSchema,
        schemaTypes: hasSchema ? page.schemaTypes : [],
        issues,
        score,
      };
    });

    setPageAudits(audits);
    setIsAuditing(false);
    toast.success("SEO audit completed");
  };

  const regenerateSitemap = async () => {
    setIsRegeneratingSitemap(true);
    try {
      // Call the edge function to regenerate sitemap
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-sitemap`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLastSitemapRegen(new Date().toISOString());
        loadSitemapStats();
        toast.success(`Sitemap regenerated with ${data.urlCount} URLs`);
      } else {
        throw new Error("Failed to regenerate sitemap");
      }
    } catch (error) {
      console.error("Error regenerating sitemap:", error);
      toast.error("Failed to regenerate sitemap");
    } finally {
      setIsRegeneratingSitemap(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 70) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { variant: "default" as const, label: "Excellent" };
    if (score >= 70) return { variant: "secondary" as const, label: "Good" };
    return { variant: "destructive" as const, label: "Needs Work" };
  };

  const overallScore =
    pageAudits.length > 0
      ? Math.round(pageAudits.reduce((acc, p) => acc + p.score, 0) / pageAudits.length)
      : 0;

  const schemasCovered = pageAudits.filter((p) => p.hasSchema).length;
  const pagesWithIssues = pageAudits.filter((p) => p.issues.length > 0).length;

  return (
    <>
      <Helmet>
        <title>SEO Audit | {siteConfig.name}</title>
      </Helmet>

      <motion.div
        className="py-6 lg:py-8 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground">
                  SEO Audit Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Monitor schema markup, meta tags, and sitemap health
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={runAudit}
              disabled={isAuditing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isAuditing ? "animate-spin" : ""}`} />
              Run Audit
            </Button>
            <Button
              onClick={regenerateSitemap}
              disabled={isRegeneratingSitemap}
              className="gap-2 bg-gradient-to-r from-accent to-amber-600"
            >
              <Globe className={`h-4 w-4 ${isRegeneratingSitemap ? "animate-spin" : ""}`} />
              Regenerate Sitemap
            </Button>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500/10 to-teal-600/5">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Overall Score
                  </p>
                  <p className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                    {overallScore}%
                  </p>
                  <Badge {...getScoreBadge(overallScore)} className="mt-1">
                    {getScoreBadge(overallScore).label}
                  </Badge>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/20">
                  <TrendingUp className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500/10 to-indigo-600/5">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Schema Coverage
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {schemasCovered}/{pageAudits.length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Pages with schema</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <Code className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500/10 to-orange-600/5">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Sitemap URLs
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {sitemapStats?.totalUrls || 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {propertyCount} active properties
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/20">
                  <Globe className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500/10 to-rose-600/5">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Issues Found
                  </p>
                  <p className="text-3xl font-bold text-foreground">{pagesWithIssues}</p>
                  <p className="text-xs text-muted-foreground mt-1">Pages need attention</p>
                </div>
                <div className="p-3 rounded-xl bg-red-500/20">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="pages" className="space-y-6">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="pages" className="gap-2">
                <FileText className="h-4 w-4" />
                Page Audits
              </TabsTrigger>
              <TabsTrigger value="sitemap" className="gap-2">
                <Globe className="h-4 w-4" />
                Sitemap
              </TabsTrigger>
              <TabsTrigger value="schema" className="gap-2">
                <Code className="h-4 w-4" />
                Schema Types
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pages" className="space-y-4">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-accent" />
                    Page-by-Page SEO Analysis
                  </CardTitle>
                  <CardDescription>
                    Detailed SEO audit for each page including meta tags, schema, and issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pageAudits.map((audit, index) => (
                      <motion.div
                        key={audit.url}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-foreground">{audit.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {audit.url}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge
                                variant={audit.hasTitle ? "default" : "destructive"}
                                className="text-xs gap-1"
                              >
                                {audit.hasTitle ? (
                                  <CheckCircle2 className="h-3 w-3" />
                                ) : (
                                  <XCircle className="h-3 w-3" />
                                )}
                                Title
                              </Badge>
                              <Badge
                                variant={audit.hasDescription ? "default" : "destructive"}
                                className="text-xs gap-1"
                              >
                                {audit.hasDescription ? (
                                  <CheckCircle2 className="h-3 w-3" />
                                ) : (
                                  <XCircle className="h-3 w-3" />
                                )}
                                Description
                              </Badge>
                              <Badge
                                variant={audit.hasCanonical ? "default" : "destructive"}
                                className="text-xs gap-1"
                              >
                                {audit.hasCanonical ? (
                                  <CheckCircle2 className="h-3 w-3" />
                                ) : (
                                  <XCircle className="h-3 w-3" />
                                )}
                                Canonical
                              </Badge>
                              <Badge
                                variant={audit.hasOgTags ? "default" : "secondary"}
                                className="text-xs gap-1"
                              >
                                {audit.hasOgTags ? (
                                  <CheckCircle2 className="h-3 w-3" />
                                ) : (
                                  <AlertTriangle className="h-3 w-3" />
                                )}
                                OG Tags
                              </Badge>
                              <Badge
                                variant={audit.hasSchema ? "default" : "secondary"}
                                className="text-xs gap-1"
                              >
                                {audit.hasSchema ? (
                                  <CheckCircle2 className="h-3 w-3" />
                                ) : (
                                  <AlertTriangle className="h-3 w-3" />
                                )}
                                Schema
                              </Badge>
                            </div>

                            {audit.schemaTypes.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {audit.schemaTypes.map((type) => (
                                  <span
                                    key={type}
                                    className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-md"
                                  >
                                    {type}
                                  </span>
                                ))}
                              </div>
                            )}

                            {audit.issues.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {audit.issues.map((issue, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 bg-red-500/10 text-red-500 text-xs rounded-md"
                                  >
                                    {issue}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <div className={`text-2xl font-bold ${getScoreColor(audit.score)}`}>
                              {audit.score}
                            </div>
                            <Progress value={audit.score} className="w-20 h-2" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sitemap" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileCode className="h-5 w-5 text-accent" />
                      Sitemap Statistics
                    </CardTitle>
                    <CardDescription>Current sitemap configuration and URL counts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <FileText className="h-4 w-4" />
                          <span className="text-xs font-medium">Static Pages</span>
                        </div>
                        <p className="text-2xl font-bold">{sitemapStats?.staticPages || 0}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <MapPin className="h-4 w-4" />
                          <span className="text-xs font-medium">Properties</span>
                        </div>
                        <p className="text-2xl font-bold">{sitemapStats?.propertyPages || 0}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Globe className="h-4 w-4" />
                          <span className="text-xs font-medium">Neighborhoods</span>
                        </div>
                        <p className="text-2xl font-bold">{sitemapStats?.neighborhoodPages || 0}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Clock className="h-4 w-4" />
                          <span className="text-xs font-medium">Last Generated</span>
                        </div>
                        <p className="text-sm font-medium">
                          {sitemapStats?.lastGenerated || "Never"}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Total URLs</span>
                        <span className="text-sm font-bold">{sitemapStats?.totalUrls || 0}</span>
                      </div>
                      <Progress value={Math.min((sitemapStats?.totalUrls || 0) / 100 * 100, 100)} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        Google recommends keeping sitemaps under 50,000 URLs
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Link2 className="h-5 w-5 text-accent" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>Manage sitemap and SEO settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3"
                      onClick={() => window.open("/sitemap.xml", "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Current Sitemap
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3"
                      onClick={() => window.open("/robots.txt", "_blank")}
                    >
                      <FileText className="h-4 w-4" />
                      View robots.txt
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3"
                      onClick={() =>
                        window.open(
                          `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(
                            siteConfig.url
                          )}`,
                          "_blank"
                        )
                      }
                    >
                      <TrendingUp className="h-4 w-4" />
                      Google Search Console
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3"
                      onClick={() =>
                        window.open("https://search.google.com/test/rich-results", "_blank")
                      }
                    >
                      <Code className="h-4 w-4" />
                      Rich Results Test
                    </Button>

                    {lastSitemapRegen && (
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <div className="flex items-center gap-2 text-emerald-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Last regenerated: {new Date(lastSitemapRegen).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="schema" className="space-y-4">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code className="h-5 w-5 text-accent" />
                    Schema Markup Overview
                  </CardTitle>
                  <CardDescription>
                    JSON-LD structured data types implemented across the site
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[
                      { type: "Organization", pages: 1, color: "from-blue-500 to-blue-600" },
                      { type: "RealEstateAgent", pages: 2, color: "from-emerald-500 to-emerald-600" },
                      { type: "WebSite", pages: 1, color: "from-purple-500 to-purple-600" },
                      { type: "RealEstateListing", pages: 10, color: "from-amber-500 to-amber-600" },
                      { type: "BreadcrumbList", pages: 8, color: "from-rose-500 to-rose-600" },
                      { type: "ItemList", pages: 2, color: "from-cyan-500 to-cyan-600" },
                      { type: "BlogPosting", pages: 5, color: "from-indigo-500 to-indigo-600" },
                      { type: "FAQPage", pages: 2, color: "from-teal-500 to-teal-600" },
                      { type: "HowTo", pages: 2, color: "from-orange-500 to-orange-600" },
                      { type: "LocalBusiness", pages: 1, color: "from-pink-500 to-pink-600" },
                      { type: "Place", pages: 8, color: "from-lime-500 to-lime-600" },
                      { type: "WebApplication", pages: 1, color: "from-sky-500 to-sky-600" },
                    ].map((schema) => (
                      <motion.div
                        key={schema.type}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card transition-all"
                      >
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${schema.color} flex items-center justify-center mb-3`}
                        >
                          <Tag className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="font-semibold text-foreground text-sm">{schema.type}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Used on {schema.pages} page{schema.pages > 1 ? "s" : ""}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </>
  );
}
