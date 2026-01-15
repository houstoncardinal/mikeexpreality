import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { Grid, List, ArrowUpDown, SlidersHorizontal, Home, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertySearchFilters, type SearchFilters } from "@/components/search";
import { PropertyCard } from "@/components/listings";
import { PropertyMap } from "@/components/map/PropertyMap";
import { allListings, priceRanges } from "@/lib/listingsData";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";
import { getListingsPageSchemas, PropertySchemaData } from "@/lib/schema";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";

type SortOption = "newest" | "price-asc" | "price-desc" | "sqft-desc";
type ViewMode = "grid" | "list" | "map";

const Listings = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    city: "",
    propertyType: "",
    priceRange: "",
    minBeds: 0,
    minBaths: 0,
  });

  // Initialize filters from URL
  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      city: searchParams.get("city") || "",
      propertyType: searchParams.get("type") || "",
      priceRange: searchParams.get("price") || "",
      minBeds: parseInt(searchParams.get("beds") || "0"),
      minBaths: parseInt(searchParams.get("baths") || "0"),
    });
  }, [searchParams]);

  const filteredAndSortedListings = useMemo(() => {
    let result = allListings.filter((listing) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          listing.title.toLowerCase().includes(searchLower) ||
          listing.address.toLowerCase().includes(searchLower) ||
          listing.city.toLowerCase().includes(searchLower) ||
          listing.neighborhood?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // City filter
      if (filters.city && listing.city !== filters.city) return false;

      // Property type filter
      if (filters.propertyType && listing.propertyType !== filters.propertyType) return false;

      // Price range filter
      if (filters.priceRange) {
        const range = priceRanges.find(r => r.label === filters.priceRange);
        if (range) {
          const monthlyEquivalent = listing.priceType === "lease" ? listing.price * 12 : listing.price;
          if (monthlyEquivalent < range.min || monthlyEquivalent > range.max) return false;
        }
      }

      // Beds filter
      if (filters.minBeds > 0 && listing.beds < filters.minBeds) return false;

      // Baths filter
      if (filters.minBaths > 0 && listing.baths < filters.minBaths) return false;

      return true;
    });

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "sqft-desc":
          return b.sqft - a.sqft;
        case "newest":
        default:
          return (a.daysOnMarket || 0) - (b.daysOnMarket || 0);
      }
    });

    return result;
  }, [filters, sortBy]);

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const activeFiltersCount = [
    filters.city,
    filters.propertyType,
    filters.priceRange,
    filters.minBeds > 0,
    filters.minBaths > 0,
  ].filter(Boolean).length;

  // Convert listings to PropertySchemaData format for schema
  const propertySchemaData: PropertySchemaData[] = filteredAndSortedListings.map((listing) => ({
    id: listing.id,
    title: listing.title,
    description: listing.description,
    address: listing.address,
    city: listing.city,
    state: listing.state,
    zip: listing.zip,
    price: listing.price,
    priceType: listing.priceType,
    beds: listing.beds,
    baths: listing.baths,
    sqft: listing.sqft,
    propertyType: listing.propertyType,
    status: listing.status,
    images: listing.images,
    yearBuilt: listing.yearBuilt,
    features: listing.features,
    latitude: listing.latitude,
    longitude: listing.longitude,
    daysOnMarket: listing.daysOnMarket,
    mlsNumber: listing.mlsNumber,
  }));

  // Get centralized schemas
  const schemas = getListingsPageSchemas(propertySchemaData);

  return (
    <>
      <Helmet>
        <title>Houston Homes for Sale | Luxury Properties | {siteConfig.name}</title>
        <meta
          name="description"
          content="Browse luxury homes for sale in Houston, Sugar Land, Katy, Cypress, Richmond, and Missouri City. Find your dream property with Mike Ogunkeye Real Estate."
        />
        <link rel="canonical" href={`${siteConfig.url}/listings`} />
      </Helmet>

      {/* Centralized Schema Markup */}
      <SchemaMarkup schemas={schemas} />

      <Layout>
        {/* Hero Section */}
        <section className="relative pt-36 pb-16 md:pt-40 md:pb-24 overflow-visible">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-navy" />
          <div className="absolute inset-0 noise-overlay opacity-30" />
          
          {/* Decorative Elements */}
          <div className="absolute top-20 right-0 w-96 h-96 bg-royal/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-royal/20 rounded-full blur-2xl" />

          <div className="container-custom relative z-10">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-royal/20 backdrop-blur-sm rounded-full text-royal-light text-sm font-medium mb-6 animate-fade-in border border-royal/30">
                <Home className="h-4 w-4" />
                {allListings.length} Properties Available
              </span>
              
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-slide-up text-shadow-lg">
                Find Your 
                <span className="block text-gradient-silver">Dream Home</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 mb-10 animate-slide-up stagger-1 max-w-2xl">
                Explore our curated collection of luxury properties across greater Houston. 
                From modern estates to charming family homes.
              </p>
            </div>

            {/* Search Box */}
            <div className="animate-scale-in stagger-2">
              <PropertySearchFilters 
                variant="hero" 
                onSearch={handleFilterChange}
                showAdvanced={activeFiltersCount > 0}
              />
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="section-padding bg-secondary relative z-0">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-50" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
          
          <div className="container-custom relative z-10">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-lg font-medium text-foreground">
                  <span className="text-accent font-bold">{filteredAndSortedListings.length}</span> Properties Found
                </p>
                {activeFiltersCount > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative">
                  <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <select
                    className="h-10 pl-10 pr-4 rounded-lg bg-card border border-border text-sm font-medium cursor-pointer focus:ring-2 focus:ring-ring appearance-none"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="sqft-desc">Largest First</option>
                  </select>
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-card border border-border rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded-md transition-all",
                      viewMode === "grid" 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "hover:bg-secondary"
                    )}
                    aria-label="Grid view"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded-md transition-all",
                      viewMode === "list" 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "hover:bg-secondary"
                    )}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("map")}
                    className={cn(
                      "p-2 rounded-md transition-all",
                      viewMode === "map" 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "hover:bg-secondary"
                    )}
                    aria-label="Map view"
                  >
                    <MapIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Map View */}
            {viewMode === "map" && (
              <div className="mb-8">
                <PropertyMap properties={filteredAndSortedListings} />
              </div>
            )}

            {/* Results Grid */}
            {viewMode !== "map" && filteredAndSortedListings.length > 0 ? (
              <div className={cn(
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" 
                  : "space-y-6"
              )}>
                {filteredAndSortedListings.map((listing, index) => (
                  <PropertyCard 
                    key={listing.id} 
                    listing={listing} 
                    variant={viewMode === "list" ? "list" : "grid"}
                    index={index}
                  />
                ))}
              </div>
            ) : viewMode !== "map" && (
              /* No Results */
              <div className="text-center py-16 md:py-24">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                  <SlidersHorizontal className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">
                  No Properties Found
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  We couldn't find any properties matching your criteria. Try adjusting your filters or search terms.
                </p>
                <Button 
                  variant="gold"
                  onClick={() => setFilters({
                    search: "",
                    city: "",
                    propertyType: "",
                    priceRange: "",
                    minBeds: 0,
                    minBaths: 0,
                  })}
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Load More (placeholder for future pagination) */}
            {filteredAndSortedListings.length > 0 && filteredAndSortedListings.length >= 12 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" className="px-12">
                  Load More Properties
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-navy relative overflow-hidden">
          <div className="absolute inset-0 noise-overlay opacity-20" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-royal/10 blur-3xl" />
          
          <div className="container-custom relative z-10 text-center">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 text-shadow">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Let us help you find your perfect property. Our team has access to exclusive listings and can search on your behalf.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="royal" size="xl" asChild>
                <a href="/contact">Contact Us Today</a>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <a href="/home-valuation">Get Your Home Valued</a>
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Listings;
