import { ExternalLink, Search, List, Award, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export function MLSSearchSection() {
  const harSearchUrl = "https://www.har.com/idx/mls/search?sitetype=aws&cid=598724&mlsorgid=1&allmls=n&for_sale=1";
  const harListingUrl = "https://www.har.com/idx/mls/listing?sitetype=aws&cid=598724&mlsorgid=1&allmls=n";
  const harSoldUrl = "https://www.har.com/idx/mls/sold/listing?sitetype=aws&cid=598724&allmls=n&mlsorgid=";

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container-custom">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Search className="w-4 h-4" />
            HAR MLS Integration
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Search All Houston MLS Listings
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse thousands of available properties directly from the Houston Association of REALTORS® database.
          </p>
        </div>

        <Tabs defaultValue="search" className="w-full max-w-5xl mx-auto">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-6">
            <TabsTrigger value="search" className="gap-2">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span> Properties
            </TabsTrigger>
            <TabsTrigger value="listings" className="gap-2">
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Browse</span> Listings
            </TabsTrigger>
            <TabsTrigger value="sold" className="gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Sold</span> Properties
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <div 
              className="relative w-full rounded-2xl overflow-hidden border border-border shadow-xl bg-background"
              style={{ paddingTop: '100%' }}
            >
              <iframe
                src={harSearchUrl}
                className="absolute top-0 left-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title="HAR MLS Search"
              />
            </div>
            <p className="text-center mt-4 text-sm text-muted-foreground">
              Having trouble viewing? <a href={harSearchUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Open Search in HAR →</a>
            </p>
          </TabsContent>

          <TabsContent value="listings">
            <div 
              className="relative w-full rounded-2xl overflow-hidden border border-border shadow-xl bg-background"
              style={{ paddingTop: '100%' }}
            >
              <iframe
                src={harListingUrl}
                className="absolute top-0 left-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title="HAR MLS Listings"
              />
            </div>
            <p className="text-center mt-4 text-sm text-muted-foreground">
              Having trouble viewing? <a href={harListingUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Open Listings in HAR →</a>
            </p>
          </TabsContent>

          <TabsContent value="sold">
            {/* Trust Banner */}
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border border-green-500/20">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-700">Proven Track Record</span>
                </div>
                <span className="text-muted-foreground hidden sm:inline">•</span>
                <p className="text-sm text-muted-foreground">
                  Browse our successfully closed transactions and see why clients trust us with their real estate needs.
                </p>
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                  Verified Sales
                </Badge>
              </div>
            </div>

            <div 
              className="relative w-full rounded-2xl overflow-hidden border-2 border-green-500/30 shadow-xl bg-background"
              style={{ paddingTop: '100%' }}
            >
              {/* Sold Banner Overlay */}
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-green-600 hover:bg-green-600 text-white px-4 py-2 text-sm font-semibold shadow-lg">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  SOLD PROPERTIES
                </Badge>
              </div>
              <iframe
                src={harSoldUrl}
                className="absolute top-0 left-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title="HAR MLS Sold Listings"
              />
            </div>
            <p className="text-center mt-4 text-sm text-muted-foreground">
              Having trouble viewing? <a href={harSoldUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Open Sold Listings in HAR →</a>
            </p>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Button asChild size="lg" className="gap-2">
            <Link to="/mls-search">
              <Search className="w-4 h-4" />
              Full MLS Search Page
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="gap-2" asChild>
            <a href={harSearchUrl} target="_blank" rel="noopener noreferrer">
              Open in HAR
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
