import { Link } from "react-router-dom";
import { ArrowRight, Bed, Bath, Square, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getFeaturedListings, formatPrice, PropertyListing } from "@/lib/listingsData";

interface PropertyCardProps {
  listing: PropertyListing;
}

function PropertyCard({ listing }: PropertyCardProps) {
  return (
    <Card className="group overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={listing.images[0]}
          alt={`${listing.title} - ${listing.city}, TX`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            listing.status === "For Sale" 
              ? "bg-green-600 text-white" 
              : listing.status === "For Lease" 
              ? "bg-blue-600 text-white"
              : "bg-gray-500 text-white"
          }`}>
            {listing.status}
          </span>
          <span className="px-3 py-1 bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium rounded-full">
            {listing.propertyType}
          </span>
        </div>
      </div>

      <div className="p-5">
        <p className="font-serif text-2xl font-bold text-foreground mb-1">
          {formatPrice(listing.price, listing.priceType)}
        </p>
        <h3 className="font-medium text-foreground mb-2 group-hover:text-accent transition-colors">
          {listing.title}
        </h3>
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
          <MapPin className="h-3.5 w-3.5" />
          <span>{listing.address}, {listing.city}, {listing.state}</span>
        </div>
        <div className="flex items-center gap-5 pt-4 border-t border-border">
          {listing.beds > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Bed className="h-4 w-4" />
              <span>{listing.beds} Beds</span>
            </div>
          )}
          {listing.baths > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Bath className="h-4 w-4" />
              <span>{listing.baths} Baths</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Square className="h-4 w-4" />
            <span>{listing.sqft.toLocaleString()} Sqft</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function FeaturedListings() {
  const featuredListings = getFeaturedListings();

  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-accent font-medium tracking-wider uppercase text-sm mb-2">
              Featured Properties
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Homes for Sale in Houston
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Browse our curated selection of homes across Sugar Land, Katy, Cypress, Richmond & more.
            </p>
          </div>
          <Link to="/listings">
            <Button variant="outline" size="lg" className="group">
              View All Listings
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.slice(0, 6).map((listing) => (
            <Link key={listing.id} to={`/property/${listing.id}`}>
              <PropertyCard listing={listing} />
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/mls-search">
            <Button variant="outline" className="gap-2">
              Search All MLS Listings
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
