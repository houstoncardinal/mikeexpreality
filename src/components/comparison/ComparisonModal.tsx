import { X, Bed, Bath, Square, Car, Calendar, MapPin, DollarSign, Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComparison } from "@/contexts/ComparisonContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

export function ComparisonModal() {
  const { comparisonList, isComparisonOpen, setIsComparisonOpen, clearComparison } = useComparison();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const comparisonRows = [
    { label: "Price", key: "price", format: (v: number) => formatPrice(v) },
    { label: "Bedrooms", key: "beds", icon: Bed },
    { label: "Bathrooms", key: "baths", icon: Bath },
    { label: "Square Feet", key: "sqft", icon: Square, format: (v: number) => v.toLocaleString() },
    { label: "Garage", key: "garage", icon: Car },
    { label: "Year Built", key: "yearBuilt", icon: Calendar },
    { label: "City", key: "city", icon: MapPin },
    { label: "Property Type", key: "propertyType" },
    { label: "Status", key: "status" },
    { label: "Price/SqFt", key: "pricePerSqFt", format: (_: any, p: any) => `$${Math.round(p.price / p.sqft)}` },
  ];

  const featureRows = [
    "Pool",
    "Smart Home",
    "Solar Panels",
    "Home Theater",
    "Wine Cellar",
    "Guest House",
    "Waterfront",
    "Golf Course View",
  ];

  return (
    <Dialog open={isComparisonOpen} onOpenChange={setIsComparisonOpen}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-foreground flex items-center gap-3">
            Property Comparison
            <span className="text-sm font-sans text-muted-foreground">
              ({comparisonList.length} properties)
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          {/* Property Headers */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${comparisonList.length}, 1fr)` }}>
            <div className="font-medium text-muted-foreground"></div>
            {comparisonList.map((property) => (
              <div key={property.id} className="text-center">
                <div className="relative rounded-xl overflow-hidden mb-3 aspect-[4/3]">
                  <img
                    src={property.images[0]}
                    alt={property.address}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <p className="text-white font-semibold text-sm line-clamp-1">{property.address}</p>
                    <p className="text-white/70 text-xs">{property.city}</p>
                  </div>
                </div>
                <Link to={`/property/${property.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="mt-8 border rounded-xl overflow-hidden">
            {comparisonRows.map((row, index) => (
              <div
                key={row.key}
                className={`grid items-center ${index % 2 === 0 ? "bg-muted/30" : "bg-background"}`}
                style={{ gridTemplateColumns: `200px repeat(${comparisonList.length}, 1fr)` }}
              >
                <div className="px-4 py-4 font-medium text-foreground flex items-center gap-2">
                  {row.icon && <row.icon className="w-4 h-4 text-royal" />}
                  {row.label}
                </div>
                {comparisonList.map((property) => {
                  const value = (property as any)[row.key];
                  let displayValue = value;
                  if (row.format) {
                    displayValue = row.format(value, property);
                  }
                  return (
                    <div
                      key={property.id}
                      className={`px-4 py-4 text-center font-medium ${
                        row.key === "price" ? "text-royal text-lg" : "text-foreground"
                      }`}
                    >
                      {displayValue}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Features Comparison */}
          <div className="mt-8">
            <h3 className="font-serif text-lg font-semibold mb-4 text-foreground">Features</h3>
            <div className="border rounded-xl overflow-hidden">
              {featureRows.map((feature, index) => (
                <div
                  key={feature}
                  className={`grid items-center ${index % 2 === 0 ? "bg-muted/30" : "bg-background"}`}
                  style={{ gridTemplateColumns: `200px repeat(${comparisonList.length}, 1fr)` }}
                >
                  <div className="px-4 py-3 font-medium text-foreground">{feature}</div>
                  {comparisonList.map((property) => {
                    const hasFeature = property.features?.some(
                      (f) => f.toLowerCase().includes(feature.toLowerCase())
                    );
                    return (
                      <div key={property.id} className="px-4 py-3 text-center">
                        {hasFeature ? (
                          <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                        ) : (
                          <Minus className="w-5 h-5 text-muted-foreground mx-auto" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end gap-3">
            <Button variant="outline" onClick={clearComparison}>
              Clear All
            </Button>
            <Button onClick={() => setIsComparisonOpen(false)} className="bg-royal hover:bg-royal-dark text-white">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
