import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { ExternalLink, Crown, Home, Award, Search as SearchIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/siteConfig";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { getMLSSearchPageSchemas } from "@/lib/schema";

const MLSSearch = () => {
  const mikeListingsUrl = "https://www.har.com/idx/mls/listing?sitetype=aws&cid=598724&mlsorgid=1&allmls=n";
  const harSoldUrl = "https://www.har.com/idx/mls/sold/listing?sitetype=aws&cid=598724&allmls=n&mlsorgid=";
  const harSearchUrl = "https://www.har.com/idx/mls/search?sitetype=aws&cid=598724&mlsorgid=1&allmls=n&for_sale=1";
  const schemas = getMLSSearchPageSchemas();

  return (
    <Layout>
      <Helmet>
        <title>My Listings & Houston MLS Search | {siteConfig.name}</title>
        <meta name="description" content="Browse Mike Ogunkeye's exclusive Houston property listings, recently sold homes, and search all Houston MLS listings. Find your dream home in Sugar Land, Katy, Cypress, and more." />
        <meta name="keywords" content="Mike Ogunkeye listings, Houston MLS search, homes for sale Houston, Sugar Land homes, Katy real estate, exclusive listings eXp Realty" />
        <link rel="canonical" href={`${siteConfig.url}/mls-search`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`Exclusive Listings & MLS Search | ${siteConfig.name}`} />
        <meta property="og:description" content="Browse Mike Ogunkeye's exclusive portfolio of Houston properties. Search all Houston MLS listings." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteConfig.url}/mls-search`} />
        <meta property="og:image" content={`${siteConfig.url}/logo-primary.jpeg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`My Listings | ${siteConfig.name}`} />
        <meta name="twitter:description" content="Browse exclusive Houston property listings from Mike Ogunkeye at eXp Realty." />
      </Helmet>
      
      {/* Advanced Schema Markup */}
      <SchemaMarkup schemas={schemas} />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4 bg-accent/10 text-accent">
            <Crown className="w-4 h-4 mr-2" />
            Exclusive Portfolio
          </Badge>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Mike Ogunkeye's Properties
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse my exclusive listings, recently sold properties, and search all Houston MLS listings.
          </p>
        </div>

        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-6">
            <TabsTrigger value="listings" className="gap-2">
              <Home className="w-4 h-4" />
              My Listings
            </TabsTrigger>
            <TabsTrigger value="sold" className="gap-2">
              <Award className="w-4 h-4" />
              Sold
            </TabsTrigger>
            <TabsTrigger value="search" className="gap-2">
              <SearchIcon className="w-4 h-4" />
              MLS Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            <div 
              className="relative w-full rounded-2xl overflow-hidden border-2 border-accent/30 shadow-lg"
              style={{ paddingTop: '120%' }}
            >
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-accent hover:bg-accent text-accent-foreground px-4 py-2 text-sm font-semibold shadow-lg">
                  <Crown className="w-4 h-4 mr-2" />
                  EXCLUSIVE LISTINGS
                </Badge>
              </div>
              <iframe
                src={mikeListingsUrl}
                className="absolute top-0 left-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title="Mike Ogunkeye's Exclusive Listings"
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground flex items-center justify-center gap-2">
              Having trouble viewing?
              <a 
                href={mikeListingsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                View on HAR
                <ExternalLink className="w-4 h-4" />
              </a>
            </p>
          </TabsContent>

          <TabsContent value="sold">
            <div 
              className="relative w-full rounded-2xl overflow-hidden border-2 border-green-500/30 shadow-lg"
              style={{ paddingTop: '120%' }}
            >
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-green-600 hover:bg-green-600 text-white px-4 py-2 text-sm font-semibold shadow-lg">
                  <Award className="w-4 h-4 mr-2" />
                  SOLD BY MIKE
                </Badge>
              </div>
              <iframe
                src={harSoldUrl}
                className="absolute top-0 left-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title="Properties Sold by Mike Ogunkeye"
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground flex items-center justify-center gap-2">
              Having trouble viewing?
              <a 
                href={harSoldUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                View on HAR
                <ExternalLink className="w-4 h-4" />
              </a>
            </p>
          </TabsContent>

          <TabsContent value="search">
            <div 
              className="relative w-full rounded-2xl overflow-hidden border border-border shadow-lg"
              style={{ paddingTop: '120%' }}
            >
              <iframe
                src={harSearchUrl}
                className="absolute top-0 left-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title="Houston MLS Search"
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground flex items-center justify-center gap-2">
              Search all Houston MLS listings.
              <a 
                href={harSearchUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Open in HAR
                <ExternalLink className="w-4 h-4" />
              </a>
            </p>
          </TabsContent>
        </Tabs>
      </section>
    </Layout>
  );
};

export default MLSSearch;
