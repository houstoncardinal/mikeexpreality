import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { PropertyListing } from "@/lib/listingsData";
import { Link } from "react-router-dom";
import { Bed, Bath, Square } from "lucide-react";

interface PropertyMapProps {
  properties: PropertyListing[];
  onPropertySelect?: (property: PropertyListing) => void;
}

// Houston area coordinates for demo (replace with geocoded addresses in production)
const getPropertyCoordinates = (property: PropertyListing): [number, number] => {
  const cityCoords: Record<string, [number, number]> = {
    "Houston": [-95.3698, 29.7604],
    "Sugar Land": [-95.6349, 29.6197],
    "Katy": [-95.8244, 29.7858],
    "Cypress": [-95.6969, 29.9691],
    "Richmond": [-95.7608, 29.5822],
    "Missouri City": [-95.5386, 29.6186],
    "Pearland": [-95.2860, 29.5636],
    "Rosenberg": [-95.8086, 29.5572],
    "Rosharon": [-95.4600, 29.3527],
  };
  
  const baseCoords = cityCoords[property.city] || cityCoords["Houston"];
  // Add small random offset for each property so they don't stack
  const offset = [
    (Math.random() - 0.5) * 0.05,
    (Math.random() - 0.5) * 0.05,
  ];
  return [baseCoords[0] + offset[0], baseCoords[1] + offset[1]];
};

export function PropertyMap({ properties, onPropertySelect }: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [isTokenEntered, setIsTokenEntered] = useState(false);

  useEffect(() => {
    // Check if we have a token from env or stored
    const storedToken = localStorage.getItem("mapbox_token");
    if (storedToken) {
      setMapboxToken(storedToken);
      setIsTokenEntered(true);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !isTokenEntered || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-95.3698, 29.7604], // Houston center
      zoom: 9,
      pitch: 30,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add markers for each property
    properties.forEach((property) => {
      const coords = getPropertyCoordinates(property);
      
      const el = document.createElement("div");
      el.className = "property-marker";
      el.innerHTML = `
        <div class="w-8 h-8 bg-royal rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg cursor-pointer transform hover:scale-110 transition-transform border-2 border-white">
          $${Math.round(property.price / 1000)}K
        </div>
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat(coords)
        .addTo(map.current!);

      el.addEventListener("click", () => {
        setSelectedProperty(property);
        onPropertySelect?.(property);
        map.current?.flyTo({
          center: coords,
          zoom: 13,
          duration: 1500,
        });
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [properties, isTokenEntered, mapboxToken, onPropertySelect]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken) {
      localStorage.setItem("mapbox_token", mapboxToken);
      setIsTokenEntered(true);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!isTokenEntered) {
    return (
      <div className="h-[500px] bg-muted rounded-2xl flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h3 className="font-serif text-xl font-semibold mb-4 text-foreground">
            Enable Interactive Map
          </h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Enter your Mapbox public token to view properties on the map. 
            Get your free token at{" "}
            <a 
              href="https://mapbox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-royal hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <input
              type="text"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              placeholder="pk.eyJ1Ijoi..."
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-royal focus:ring-2 focus:ring-royal/20 text-foreground"
            />
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-xl bg-royal text-white font-semibold hover:bg-royal-dark transition-colors"
            >
              Enable Map
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[500px] rounded-2xl overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Selected Property Card */}
      {selectedProperty && (
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 bg-card/95 backdrop-blur-xl rounded-xl shadow-luxury border border-border overflow-hidden animate-slide-up">
          <div className="relative h-32">
            <img
              src={selectedProperty.images[0]}
              alt={selectedProperty.address}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setSelectedProperty(null)}
              className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              ×
            </button>
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-royal text-white text-xs font-semibold rounded">
              {selectedProperty.status}
            </div>
          </div>
          <div className="p-4">
            <p className="text-lg font-bold text-royal mb-1">
              {formatPrice(selectedProperty.price)}
            </p>
            <p className="text-sm font-medium text-foreground mb-1">
              {selectedProperty.address}
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              {selectedProperty.city}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Bed className="w-3 h-3" /> {selectedProperty.beds}
              </span>
              <span className="flex items-center gap-1">
                <Bath className="w-3 h-3" /> {selectedProperty.baths}
              </span>
              <span className="flex items-center gap-1">
                <Square className="w-3 h-3" /> {selectedProperty.sqft.toLocaleString()}
              </span>
            </div>
            <Link
              to={`/property/${selectedProperty.id}`}
              className="block w-full text-center py-2 bg-royal text-white text-sm font-semibold rounded-lg hover:bg-royal-dark transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
