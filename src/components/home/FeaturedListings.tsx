import { Link } from "react-router-dom";
import { ArrowRight, Bed, Bath, Square, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";

const listings = [
  {
    id: "1",
    title: "Modern Estate in Sugar Land",
    address: "4521 Sweetwater Blvd, Sugar Land, TX",
    price: 1250000,
    beds: 5,
    baths: 4.5,
    sqft: 4800,
    image: listing1,
    featured: true,
    type: "House",
  },
  {
    id: "2",
    title: "Contemporary Home in Katy",
    address: "789 Grand Pkwy, Katy, TX",
    price: 875000,
    beds: 4,
    baths: 3.5,
    sqft: 3600,
    image: listing2,
    featured: true,
    type: "House",
  },
  {
    id: "3",
    title: "Elegant Townhome in Cypress",
    address: "1234 Cypress Creek Dr, Cypress, TX",
    price: 525000,
    beds: 3,
    baths: 2.5,
    sqft: 2400,
    image: listing3,
    featured: true,
    type: "Townhouse",
  },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

interface PropertyCardProps {
  listing: (typeof listings)[0];
}

function PropertyCard({ listing }: PropertyCardProps) {
  return (
    <Card className="group overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-all duration-500">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          {listing.featured && (
            <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
              Featured
            </span>
          )}
          <span className="px-3 py-1 bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium rounded-full">
            {listing.type}
          </span>
        </div>

        {/* Favorite Button */}
        <button className="absolute top-4 right-4 p-2 bg-card/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-accent hover:text-accent-foreground">
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <p className="font-serif text-2xl font-bold text-foreground">
            {formatPrice(listing.price)}
          </p>
        </div>

        <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-accent transition-colors">
          {listing.title}
        </h3>

        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
          <MapPin className="h-4 w-4" />
          <span>{listing.address}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bed className="h-4 w-4" />
            <span>{listing.beds} Beds</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bath className="h-4 w-4" />
            <span>{listing.baths} Baths</span>
          </div>
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
          description: `${listing.beds} bedroom, ${listing.baths} bathroom ${listing.type.toLowerCase()} in ${listing.address}`,
          url: `https://houstonelite.com/listings/${listing.id}`,
          image: listing.image,
          address: {
            "@type": "PostalAddress",
            streetAddress: listing.address.split(",")[0],
            addressLocality: listing.address.split(",")[1]?.trim(),
            addressRegion: "TX",
            addressCountry: "US",
          },
          offers: {
            "@type": "Offer",
            price: listing.price,
            priceCurrency: "USD",
          },
          numberOfRooms: listing.beds,
          numberOfBathroomsTotal: listing.baths,
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
              Exceptional Homes,<br />
              <span className="text-muted-foreground">Exceptional Living</span>
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
          {listings.map((listing) => (
            <Link key={listing.id} to={`/listings/${listing.id}`}>
              <PropertyCard listing={listing} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
