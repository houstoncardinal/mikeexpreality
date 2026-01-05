import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { Search, MapPin, Bed, Bath, Square, Heart, Grid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { allListings, formatPrice } from "@/lib/listingsData";
import { siteConfig } from "@/lib/siteConfig";

const Listings = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const filteredListings = allListings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || listing.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <>
      <Helmet>
        <title>Houston Homes for Sale | Luxury Properties in Sugar Land, Katy, Cypress | Houston Elite</title>
        <meta
          name="description"
          content="Browse luxury homes for sale in Houston, Sugar Land, Katy, Cypress, and Richmond. Find your dream property with Houston Elite Real Estate's extensive listings."
        />
        <link rel="canonical" href="https://houstonelite.com/listings" />
      </Helmet>

      <Layout>
        {/* Hero */}
        <section className="pt-32 pb-12 bg-primary">
          <div className="container-custom">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Find Your Dream Home
            </h1>
            <p className="text-xl text-primary-foreground/70">
              Explore our curated selection of luxury properties across greater Houston
            </p>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="py-8 bg-background border-b border-border sticky top-20 z-40">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by address, neighborhood, or keyword..."
                  className="pl-10 h-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="h-12 px-4 rounded-md border border-input bg-background text-foreground"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">All Cities</option>
                <option value="Houston">Houston</option>
                <option value="Sugar Land">Sugar Land</option>
                <option value="Katy">Katy</option>
                <option value="Cypress">Cypress</option>
                <option value="Richmond">Richmond</option>
              </select>
              <select
                className="h-12 px-4 rounded-md border border-input bg-background text-foreground"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="">Any Price</option>
                <option value="0-500000">Under $500K</option>
                <option value="500000-1000000">$500K - $1M</option>
                <option value="1000000-2000000">$1M - $2M</option>
                <option value="2000000+">$2M+</option>
              </select>
              <Button variant="outline" className="h-12">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                More Filters
              </Button>
              <div className="flex items-center gap-2 border border-input rounded-md p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-secondary" : ""}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-secondary" : ""}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="section-padding bg-secondary">
          <div className="container-custom">
            <p className="text-muted-foreground mb-8">
              Showing {filteredListings.length} properties
            </p>

            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
              {filteredListings.map((listing) => (
                <Link key={listing.id} to={`/property/${listing.id}`}>
                  <Card
                    className={`group overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-all duration-500 ${
                      viewMode === "list" ? "flex flex-col md:flex-row" : ""
                    }`}
                  >
                    <div className={`relative overflow-hidden ${viewMode === "list" ? "md:w-80 aspect-[4/3] md:aspect-auto" : "aspect-[4/3]"}`}>
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      {listing.featured && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                          Featured
                        </span>
                      )}
                      <span className="absolute bottom-4 left-4 px-3 py-1 bg-card/90 backdrop-blur-sm text-xs font-semibold rounded-full">
                        {listing.status}
                      </span>
                      <button 
                        className="absolute top-4 right-4 p-2 bg-card/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="p-6 flex-1">
                      <p className="font-serif text-2xl font-bold text-foreground mb-2">
                        {formatPrice(listing.price, listing.priceType)}
                      </p>
                      <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-accent transition-colors">
                        {listing.title}
                      </h3>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                        <MapPin className="h-4 w-4" />
                        <span>{listing.address}, {listing.city}, {listing.state}</span>
                      </div>
                      <div className="flex items-center gap-6 pt-4 border-t border-border">
                        {listing.beds > 0 && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Bed className="h-4 w-4" />
                            <span>{listing.beds} Beds</span>
                          </div>
                        )}
                        {listing.baths > 0 && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Bath className="h-4 w-4" />
                            <span>{listing.baths} Baths</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Square className="h-4 w-4" />
                          <span>{listing.sqft.toLocaleString()} Sqft</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </Layout>

      {/* Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Listings", item: `${siteConfig.url}/listings` },
          ],
        })}
      </script>
    </>
  );
};

export default Listings;
