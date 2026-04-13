import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { Grid, List, ArrowUpDown, SlidersHorizontal, Map as MapIcon } from "lucide-react";
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

const ITEMS_PER_PAGE = 9;

const Listings = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    city: "",
    propertyType: "",
    priceRange: "",
    minBeds: 0,
    minBaths: 0,
  });

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
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          listing.title.toLowerCase().includes(searchLower) ||
          listing.address.toLowerCase().includes(searchLower) ||
          listing.city.toLowerCase().includes(searchLower) ||
          listing.neighborhood?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      if (filters.city && listing.city !== filters.city) return false;
      if (filters.propertyType && listing.propertyType !== filters.propertyType) return false;
      if (filters.priceRange) {
        const range = priceRanges.find(r => r.label === filters.priceRange);
        if (range) {
          const monthlyEquivalent = listing.priceType === "lease" ? listing.price * 12 : listing.price;
          if (monthlyEquivalent < range.min || monthlyEquivalent > range.max) return false;
        }
      }
      if (filters.minBeds > 0 && listing.beds < filters.minBeds) return false;
      if (filters.minBaths > 0 && listing.baths < filters.minBaths) return false;
      return true;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "sqft-desc": return b.sqft - a.sqft;
        default: return (a.daysOnMarket || 0) - (b.daysOnMarket || 0);
      }
    });

    return result;
  }, [filters, sortBy]);

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const visibleListings = filteredAndSortedListings.slice(0, visibleCount);
  const hasMoreListings = visibleCount < filteredAndSortedListings.length;

  const activeFiltersCount = [
    filters.city, filters.propertyType, filters.priceRange,
    filters.minBeds > 0, filters.minBaths > 0,
  ].filter(Boolean).length;

  const propertySchemaData: PropertySchemaData[] = filteredAndSortedListings.map((listing) => ({
    id: listing.id, title: listing.title, description: listing.description,
    address: listing.address, city: listing.city, state: listing.state, zip: listing.zip,
    price: listing.price, priceType: listing.priceType, beds: listing.beds, baths: listing.baths,
    sqft: listing.sqft, propertyType: listing.propertyType, status: listing.status,
    images: listing.images, yearBuilt: listing.yearBuilt, features: listing.features,
    latitude: listing.latitude, longitude: listing.longitude, daysOnMarket: listing.daysOnMarket,
    mlsNumber: listing.mlsNumber,
  }));

  const schemas = getListingsPageSchemas(propertySchemaData);

  return (
    <>
      <Helmet>
        <title>Houston Homes for Sale | Sugar Land, Katy, Cypress | {siteConfig.name}</title>
        <meta name="description" content={`Browse ${filteredAndSortedListings.length}+ homes for sale in Houston, Sugar Land, Katy, Cypress, Richmond & Missouri City. Find your dream property with Mike Ogunkeye at eXp Realty.`} />
        <meta name="keywords" content="Houston homes for sale, Sugar Land real estate, Katy homes, Cypress houses, Richmond TX homes, Missouri City properties" />
        <link rel="canonical" href={`${siteConfig.url}/listings`} />
        <meta property="og:title" content="Houston Homes for Sale | Mike Ogunkeye Real Estate" />
        <meta property="og:description" content="Browse homes in Houston, Sugar Land, Katy, Cypress & more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteConfig.url}/listings`} />
      </Helmet>

      <SchemaMarkup schemas={schemas} />

      <Layout>
        {/* Hero */}
        <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-primary">
          <div className="container-custom">
            <div className="max-w-2xl mb-10">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
                Find Your Dream Home
              </h1>
              <p className="text-lg text-primary-foreground/60">
                Explore our collection of properties across greater Houston.
              </p>
            </div>
            <PropertySearchFilters 
              variant="hero" 
              onSearch={handleFilterChange}
              showAdvanced={activeFiltersCount > 0}
            />
          </div>
        </section>

        {/* Results */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container-custom">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">{filteredAndSortedListings.length}</span> properties found
                {activeFiltersCount > 0 && ` · ${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''}`}
              </p>

              <div className="flex items-center gap-2">
                <select
                  className="h-9 px-3 rounded-lg bg-card border border-border text-xs font-medium cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price ↑</option>
                  <option value="price-desc">Price ↓</option>
                  <option value="sqft-desc">Largest</option>
                </select>

                <div className="flex items-center bg-card border border-border rounded-lg p-0.5">
                  {[
                    { mode: "grid" as ViewMode, icon: Grid },
                    { mode: "list" as ViewMode, icon: List },
                    { mode: "map" as ViewMode, icon: MapIcon },
                  ].map(({ mode, icon: Icon }) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={cn(
                        "p-1.5 rounded-md transition-all",
                        viewMode === mode ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                      )}
                      aria-label={`${mode} view`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {viewMode === "map" && (
              <div className="mb-8">
                <PropertyMap properties={filteredAndSortedListings} />
              </div>
            )}

            {viewMode !== "map" && filteredAndSortedListings.length > 0 ? (
              <div className={cn(
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                  : "space-y-4"
              )}>
                {visibleListings.map((listing, index) => (
                  <PropertyCard 
                    key={listing.id} 
                    listing={listing} 
                    variant={viewMode === "list" ? "list" : "grid"}
                    index={index}
                  />
                ))}
              </div>
            ) : viewMode !== "map" && (
              <div className="text-center py-20">
                <SlidersHorizontal className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">No Properties Found</h3>
                <p className="text-muted-foreground text-sm mb-6">Try adjusting your filters.</p>
                <Button 
                  variant="outline"
                  onClick={() => setFilters({ search: "", city: "", propertyType: "", priceRange: "", minBeds: 0, minBaths: 0 })}
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {hasMoreListings && (
              <div className="text-center mt-10">
                <Button variant="outline" size="lg" onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}>
                  Load More ({filteredAndSortedListings.length - visibleCount} remaining)
                </Button>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Listings;
