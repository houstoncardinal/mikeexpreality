import { Link } from "react-router-dom";
import { ArrowRight, Bed, Bath, Square, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getFeaturedListings, formatPrice, PropertyListing } from "@/lib/listingsData";
import { siteConfig } from "@/lib/siteConfig";

interface PropertyCardProps {
  listing: PropertyListing;
}

function PropertyCard({ listing }: PropertyCardProps) {
  return (
    <Card className="group overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-all duration-500">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            listing.status === "For Sale" 
              ? "bg-green-500 text-white" 
              : listing.status === "For Lease" 
              ? "bg-blue-500 text-white"
              : "bg-gray-500 text-white"
          }`}>
            {listing.status}
          </span>
          <span className="px-3 py-1 bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium rounded-full">
            {listing.propertyType}
          </span>
        </div>

        {/* Favorite Button */}
        <button 
          className="absolute top-4 right-4 p-2 bg-card/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-accent hover:text-accent-foreground"
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <p className="font-serif text-2xl font-bold text-foreground">
            {formatPrice(listing.price, listing.priceType)}
          </p>
        </div>

        <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-accent transition-colors">
          {listing.title}
        </h3>

        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
          <MapPin className="h-4 w-4" />
          <span>{listing.address}, {listing.city}, {listing.state}</span>
        </div>

        {/* Features */}
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

      {/* JSON-LD Schema for Real Estate Listing */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateListing",
          name: listing.title,
          description: listing.beds > 0 
            ? `${listing.beds} bedroom, ${listing.baths} bathroom ${listing.propertyType.toLowerCase()} in ${listing.city}, ${listing.state}`
            : `${listing.sqft.toLocaleString()} sq ft ${listing.propertyType.toLowerCase()} in ${listing.city}, ${listing.state}`,
          url: `${siteConfig.url}/property/${listing.id}`,
          image: listing.images[0],
          address: {
            "@type": "PostalAddress",
            streetAddress: listing.address,
            addressLocality: listing.city,
            addressRegion: listing.state,
            postalCode: listing.zip,
            addressCountry: "US",
          },
          offers: {
            "@type": "Offer",
            price: listing.price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
          numberOfRooms: listing.beds || undefined,
          numberOfBathroomsTotal: listing.baths || undefined,
          floorSize: {
            "@type": "QuantitativeValue",
            value: listing.sqft,
            unitCode: "FTK",
          },
        })}
      </script>
    </Card>
  );
}

export function FeaturedListings() {
  const featuredListings = getFeaturedListings();

  return (
    <section className="section-padding bg-secondary">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-accent font-medium tracking-wider uppercase mb-2">
              Featured Properties
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Our Portfolio<br />
              <span className="text-muted-foreground">Current Listings</span>
            </h2>
          </div>
          <Link to="/listings">
            <Button variant="outline" size="lg" className="group">
              View All Listings
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredListings.slice(0, 3).map((listing) => (
            <Link key={listing.id} to={`/property/${listing.id}`}>
              <PropertyCard listing={listing} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
