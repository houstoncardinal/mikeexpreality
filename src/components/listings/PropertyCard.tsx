import { Link, useNavigate } from "react-router-dom";
import { MapPin, Bed, Bath, Square, Heart, Eye, Scale, Map } from "lucide-react";
import { PropertyListing, formatPrice } from "@/lib/listingsData";
import { cn } from "@/lib/utils";
import { trackCTAClick } from "@/lib/analytics";
import { useComparison } from "@/contexts/ComparisonContext";

interface PropertyCardProps {
  listing: PropertyListing;
  variant?: "grid" | "list" | "featured";
  className?: string;
  index?: number;
  showMapButton?: boolean;
}

export function PropertyCard({ listing, variant = "grid", className, index = 0, showMapButton = true }: PropertyCardProps) {
  const navigate = useNavigate();
  const isList = variant === "list";
  const isFeatured = variant === "featured";
  const { addToComparison, isInComparison, removeFromComparison } = useComparison();

  const handleViewOnMap = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (listing.latitude && listing.longitude) {
      navigate(`/map-search?propertyId=${listing.id}&lat=${listing.latitude}&lng=${listing.longitude}`);
    } else {
      navigate(`/map-search?city=${listing.city}`);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    trackCTAClick("favorite_property", listing.id);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInComparison(listing.id)) {
      removeFromComparison(listing.id);
    } else {
      addToComparison(listing);
    }
  };

  return (
    <Link 
      to={`/property/${listing.id}`}
      className={cn(
        "property-card block",
        isList && "flex flex-col md:flex-row",
        isFeatured && "lg:col-span-2 lg:row-span-2",
        className
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image Container */}
      <div className={cn(
        "relative overflow-hidden",
        isList ? "md:w-80 aspect-[4/3] md:aspect-[4/3]" : "aspect-[4/3]",
        isFeatured && "lg:aspect-[16/10]"
      )}>
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        
        {/* Status Badge */}
        <span className={cn(
          "absolute top-4 left-4 px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-md transition-all duration-300",
          listing.status === "For Sale" && "bg-emerald-500/90 text-white",
          listing.status === "For Lease" && "bg-sapphire-500/90 text-white",
          listing.status === "Pending" && "bg-amber-500/90 text-white",
          listing.status === "Sold" && "bg-rose-500/90 text-white",
          !["For Sale", "For Lease", "Pending", "Sold"].includes(listing.status) && "bg-card/90 text-foreground"
        )}>
          {listing.status}
        </span>

        {/* Featured Badge */}
        {listing.featured && (
          <span className="absolute top-4 left-28 px-3 py-1.5 bg-accent/90 text-accent-foreground text-xs font-semibold rounded-full backdrop-blur-md shadow-gold">
            Featured
          </span>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button 
            onClick={handleFavorite}
            className="p-2.5 bg-card/90 backdrop-blur-md rounded-full hover:bg-accent hover:text-accent-foreground transition-colors shadow-md"
            aria-label="Save to favorites"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button 
            onClick={handleCompare}
            className={cn(
              "p-2.5 backdrop-blur-md rounded-full transition-colors shadow-md",
              isInComparison(listing.id) 
                ? "bg-royal text-white" 
                : "bg-card/90 hover:bg-royal hover:text-white"
            )}
            aria-label={isInComparison(listing.id) ? "Remove from comparison" : "Add to comparison"}
          >
            <Scale className="h-4 w-4" />
          </button>
          {showMapButton && (
            <button 
              onClick={handleViewOnMap}
              className="p-2.5 bg-card/90 backdrop-blur-md rounded-full hover:bg-accent hover:text-accent-foreground transition-colors shadow-md"
              aria-label="View on map"
            >
              <Map className="h-4 w-4" />
            </button>
          )}
          <button 
            className="p-2.5 bg-card/90 backdrop-blur-md rounded-full hover:bg-accent hover:text-accent-foreground transition-colors shadow-md"
            aria-label="Quick view"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>

        {/* Price on Image */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <p className="font-serif text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
            {formatPrice(listing.price, listing.priceType)}
          </p>
          {listing.daysOnMarket && listing.daysOnMarket <= 7 && (
            <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-bold rounded animate-pulse-slow">
              NEW
            </span>
          )}
        </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={cn(
        "p-5 md:p-6 flex-1 flex flex-col",
        isList && "justify-center"
      )}>
        <h3 className="font-serif text-lg md:text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-1">
          {listing.title}
        </h3>
        
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
          <MapPin className="h-4 w-4 flex-shrink-0 text-accent" />
          <span className="line-clamp-1">{listing.address}, {listing.city}, {listing.state}</span>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-4 md:gap-6 pt-4 border-t border-border">
          {listing.beds > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <div className="p-1.5 rounded-md bg-secondary">
                <Bed className="h-4 w-4 text-accent" />
              </div>
              <span className="font-medium">{listing.beds}</span>
              <span className="text-muted-foreground hidden sm:inline">Beds</span>
            </div>
          )}
          {listing.baths > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <div className="p-1.5 rounded-md bg-secondary">
                <Bath className="h-4 w-4 text-accent" />
              </div>
              <span className="font-medium">{listing.baths}</span>
              <span className="text-muted-foreground hidden sm:inline">Baths</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <div className="p-1.5 rounded-md bg-secondary">
              <Square className="h-4 w-4 text-accent" />
            </div>
            <span className="font-medium">{listing.sqft.toLocaleString()}</span>
            <span className="text-muted-foreground hidden sm:inline">Sqft</span>
          </div>
        </div>

        {/* Property Type */}
        {(isList || isFeatured) && (
          <div className="mt-4 flex items-center gap-2">
            <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
              {listing.propertyType}
            </span>
            {listing.neighborhood && (
              <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                {listing.neighborhood}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
