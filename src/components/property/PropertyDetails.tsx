import { 
  Bed, 
  Bath, 
  Square, 
  Calendar, 
  Car, 
  Home, 
  Thermometer, 
  Wind,
  Layers,
  MapPin,
  Building,
  Clock
} from "lucide-react";
import { PropertyListing } from "@/lib/listingsData";

interface PropertyDetailsProps {
  property: PropertyListing;
}

export const PropertyDetails = ({ property }: PropertyDetailsProps) => {
  const details = [
    { icon: Bed, label: "Bedrooms", value: property.beds || "N/A" },
    { icon: Bath, label: "Bathrooms", value: property.baths || "N/A" },
    { icon: Square, label: "Square Feet", value: property.sqft?.toLocaleString() || "N/A" },
    { icon: Home, label: "Property Type", value: property.propertyType },
    { icon: Calendar, label: "Year Built", value: property.yearBuilt || "N/A" },
    { icon: Layers, label: "Lot Size", value: property.lotSize || "N/A" },
    { icon: Car, label: "Garage", value: property.garage ? `${property.garage} Car` : "N/A" },
    { icon: Building, label: "Stories", value: property.stories || "N/A" },
    { icon: Thermometer, label: "Heating", value: property.heating || "N/A" },
    { icon: Wind, label: "Cooling", value: property.cooling || "N/A" },
    { icon: MapPin, label: "School District", value: property.school_district || "N/A" },
    { icon: Clock, label: "Days on Market", value: property.daysOnMarket || "N/A" },
  ];

  return (
    <div className="space-y-8">
      {/* Key Details Grid */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Property Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {details.map((detail, index) => (
            <div key={index} className="p-4 bg-secondary rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <detail.icon className="h-4 w-4" />
                <span className="text-sm">{detail.label}</span>
              </div>
              <p className="font-semibold text-foreground">{detail.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-4">About This Property</h2>
        <p className="text-muted-foreground leading-relaxed">{property.description}</p>
      </div>

      {/* Features */}
      {property.features && property.features.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Features & Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {property.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flooring */}
      {property.flooring && property.flooring.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-3">Flooring</h3>
          <div className="flex flex-wrap gap-2">
            {property.flooring.map((floor, index) => (
              <span key={index} className="px-3 py-1 bg-secondary rounded-full text-sm text-muted-foreground">
                {floor}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Appliances */}
      {property.appliances && property.appliances.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-3">Appliances Included</h3>
          <div className="flex flex-wrap gap-2">
            {property.appliances.map((appliance, index) => (
              <span key={index} className="px-3 py-1 bg-secondary rounded-full text-sm text-muted-foreground">
                {appliance}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* HOA */}
      {property.hoaFee && (
        <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <p className="text-foreground">
            <span className="font-semibold">HOA Fee:</span> ${property.hoaFee}/month
          </p>
        </div>
      )}
    </div>
  );
};
