import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { 
  PropertyGallery, 
  PropertyDetails, 
  VirtualTour, 
  PropertyContactForm,
  MortgageCalculator
} from "@/components/property";
import { getListingById, formatPrice, allListings } from "@/lib/listingsData";
import { siteConfig } from "@/lib/siteConfig";
import { trackPropertyView, trackCTAClick } from "@/lib/analytics";
import { 
  getPropertyDetailSchemas,
  PropertySchemaData,
} from "@/lib/schema";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Share2, 
  Heart, 
  Printer,
  ChevronLeft,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const property = getListingById(id || "");

  if (!property) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              Property Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/listings">Browse All Listings</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const fullAddress = `${property.address}, ${property.city}, ${property.state} ${property.zip}`;
  const currentIndex = allListings.findIndex((l) => l.id === property.id);
  const prevProperty = currentIndex > 0 ? allListings[currentIndex - 1] : null;
  const nextProperty = currentIndex < allListings.length - 1 ? allListings[currentIndex + 1] : null;

  // Track property view
  useEffect(() => {
    if (property) {
      trackPropertyView({
        id: property.id,
        address: property.address,
        price: property.price,
        type: property.propertyType,
        city: property.city,
      });
    }
  }, [property]);

  const similarListings = allListings
    .filter((l) => l.id !== property.id && l.city === property.city)
    .slice(0, 3);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Convert to PropertySchemaData format
  const propertySchemaData: PropertySchemaData = {
    id: property.id,
    title: property.title,
    description: property.description,
    address: property.address,
    city: property.city,
    state: property.state,
    zip: property.zip,
    price: property.price,
    priceType: property.priceType,
    beds: property.beds,
    baths: property.baths,
    sqft: property.sqft,
    propertyType: property.propertyType,
    status: property.status,
    images: property.images,
    yearBuilt: property.yearBuilt,
    features: property.features,
    latitude: property.latitude,
    longitude: property.longitude,
    daysOnMarket: property.daysOnMarket,
    mlsNumber: property.mlsNumber,
  };

  // Get centralized schemas
  const schemas = getPropertyDetailSchemas(propertySchemaData);

  return (
    <>
      <Helmet>
        <title>{`${property.title} | ${formatPrice(property.price, property.priceType)} | ${property.city}, TX | ${siteConfig.name}`}</title>
        <meta
          name="description"
          content={`${property.beds} bed, ${property.baths} bath, ${property.sqft?.toLocaleString()} sqft ${property.propertyType.toLowerCase()} for ${property.priceType} in ${property.city}, TX. ${property.description.slice(0, 120)}...`}
        />
        <meta name="keywords" content={`${property.city} homes for ${property.priceType}, ${property.propertyType}, ${property.beds} bedroom homes, ${property.neighborhood || property.city} real estate, Mike Ogunkeye`} />
        <link rel="canonical" href={`${siteConfig.url}/property/${property.id}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${property.title} | ${formatPrice(property.price, property.priceType)}`} />
        <meta property="og:description" content={`${property.beds} bed, ${property.baths} bath, ${property.sqft?.toLocaleString()} sqft in ${property.city}, TX`} />
        <meta property="og:image" content={property.images[0]} />
        <meta property="og:url" content={`${siteConfig.url}/property/${property.id}`} />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={property.title} />
        <meta name="twitter:description" content={`${formatPrice(property.price, property.priceType)} | ${property.beds} bed, ${property.baths} bath`} />
        <meta name="twitter:image" content={property.images[0]} />
      </Helmet>

      {/* Centralized Schema Markup */}
      <SchemaMarkup schemas={schemas} />

      <Layout>
        {/* Back Navigation */}
        <div className="bg-secondary border-b border-border">
          <div className="container-custom py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Listings
              </Button>
              
              <div className="flex items-center gap-2">
                {prevProperty && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/property/${prevProperty.id}`}>
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Prev
                    </Link>
                  </Button>
                )}
                {nextProperty && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/property/${nextProperty.id}`}>
                      Next
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <section className="pt-8 pb-4">
          <div className="container-custom">
            <PropertyGallery images={property.images} title={property.title} />
          </div>
        </section>

        {/* Property Header */}
        <section className="py-6 border-b border-border">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    property.status === "For Sale" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                  }`}>
                    {property.status}
                  </span>
                  {property.mlsNumber && (
                    <span className="text-xs text-muted-foreground">
                      MLS# {property.mlsNumber}
                    </span>
                  )}
                </div>
                
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {property.title}
                </h1>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{fullAddress}</span>
                </div>
              </div>

              <div className="flex flex-col items-start lg:items-end gap-4">
                <p className="font-serif text-4xl font-bold text-accent">
                  {formatPrice(property.price, property.priceType)}
                </p>
                
                <div className="flex items-center gap-6">
                  {property.beds > 0 && (
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">{property.beds} Beds</span>
                    </div>
                  )}
                  {property.baths > 0 && (
                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">{property.baths} Baths</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Square className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold">{property.sqft?.toLocaleString()} Sqft</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => { trackCTAClick("share", "property_detail"); handleShare(); }}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => trackCTAClick("save_property", "property_detail")}>
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { trackCTAClick("print", "property_detail"); handlePrint(); }}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-12">
                <PropertyDetails property={property} />
                
                {(property.virtualTourUrl || property.matterportUrl) && (
                  <VirtualTour
                    videoUrl={property.virtualTourUrl}
                    matterportUrl={property.matterportUrl}
                    title={property.title}
                  />
                )}

                {/* Map Placeholder */}
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Location</h2>
                  <div className="aspect-[16/9] bg-secondary rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">{fullAddress}</p>
                      <Button variant="outline" className="mt-4" asChild>
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View on Google Maps
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1 space-y-8">
                <PropertyContactForm 
                  propertyTitle={property.title} 
                  propertyAddress={fullAddress}
                  propertyId={property.id}
                />
                
                {property.priceType === "sale" && (
                  <MortgageCalculator propertyPrice={property.price} />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Similar Listings */}
        {similarListings.length > 0 && (
          <section className="section-padding bg-secondary">
            <div className="container-custom">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
                Similar Properties in {property.city}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {similarListings.map((listing) => (
                  <Link key={listing.id} to={`/property/${listing.id}`}>
                    <Card className="group overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-all duration-500">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                          {listing.status}
                        </span>
                      </div>
                      <div className="p-6">
                        <p className="font-serif text-2xl font-bold text-foreground mb-2">
                          {formatPrice(listing.price, listing.priceType)}
                        </p>
                        <h3 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                          {listing.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {listing.beds > 0 && <span>{listing.beds} Beds</span>}
                          {listing.baths > 0 && <span>{listing.baths} Baths</span>}
                          <span>{listing.sqft?.toLocaleString()} Sqft</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </Layout>
    </>
  );
};

export default PropertyDetailPage;
