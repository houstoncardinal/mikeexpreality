import { Link } from "react-router-dom";
import { ArrowRight, Bed, Bath, Square, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFeaturedListings, formatPrice, PropertyListing } from "@/lib/listingsData";
import { motion } from "framer-motion";

interface PropertyCardProps {
  listing: PropertyListing;
}

function PropertyCard({ listing }: PropertyCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl bg-card border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={listing.images[0]}
          alt={`${listing.title} - ${listing.city}, TX`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            listing.status === "For Sale" 
              ? "bg-emerald-600 text-white" 
              : listing.status === "For Lease" 
              ? "bg-accent text-accent-foreground"
              : "bg-muted text-muted-foreground"
          }`}>
            {listing.status}
          </span>
        </div>
      </div>

      <div className="p-5">
        <p className="font-serif text-2xl font-bold text-foreground mb-1">
          {formatPrice(listing.price, listing.priceType)}
        </p>
        <h3 className="font-medium text-foreground text-sm mb-2 group-hover:text-accent transition-colors">
          {listing.title}
        </h3>
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-4">
          <MapPin className="h-3 w-3" />
          <span>{listing.address}, {listing.city}, {listing.state}</span>
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
          {listing.beds > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="h-3.5 w-3.5" />
              <span>{listing.beds} Beds</span>
            </div>
          )}
          {listing.baths > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />
              <span>{listing.baths} Baths</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Square className="h-3.5 w-3.5" />
            <span>{listing.sqft.toLocaleString()} Sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturedListings() {
  const featuredListings = getFeaturedListings();

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <p className="text-accent font-medium tracking-widest uppercase text-xs mb-3">
              Featured Properties
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Homes for Sale in Houston
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg text-sm">
              Curated homes across Sugar Land, Katy, Cypress, Richmond & more.
            </p>
          </div>
          <Link to="/listings">
            <Button variant="outline" size="lg" className="group">
              View All Listings
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.slice(0, 6).map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link to={`/property/${listing.id}`}>
                <PropertyCard listing={listing} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
