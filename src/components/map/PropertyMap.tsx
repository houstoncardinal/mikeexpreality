import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { PropertyListing } from "@/lib/listingsData";
import { Link } from "react-router-dom";
import { Bed, Bath, Square, Loader2, MapPin, Layers } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

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

type MapStyle = "streets" | "satellite" | "outdoors" | "dark";

const mapStyles: Record<MapStyle, string> = {
  streets: "mapbox://styles/mapbox/streets-v12",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  outdoors: "mapbox://styles/mapbox/outdoors-v12",
  dark: "mapbox://styles/mapbox/dark-v11",
};

export function PropertyMap({ properties, onPropertySelect }: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStyle, setCurrentStyle] = useState<MapStyle>("satellite");
  const [mapLoaded, setMapLoaded] = useState(false);

  // Fetch Mapbox token from edge function
  useEffect(() => {
    const fetchToken = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // First try from localStorage cache
        const cachedToken = localStorage.getItem("mapbox_token_cache");
        const cacheTime = localStorage.getItem("mapbox_token_cache_time");
        
        // Use cache if less than 1 hour old
        if (cachedToken && cacheTime && Date.now() - parseInt(cacheTime) < 3600000) {
          setMapboxToken(cachedToken);
          setIsLoading(false);
          return;
        }

        // Fetch from edge function
        const { data, error: fetchError } = await supabase.functions.invoke("get-mapbox-token");

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        if (data?.success && data?.token) {
          setMapboxToken(data.token);
          // Cache the token
          localStorage.setItem("mapbox_token_cache", data.token);
          localStorage.setItem("mapbox_token_cache_time", Date.now().toString());
        } else {
          throw new Error(data?.error || "Failed to retrieve token");
        }
      } catch (err) {
        console.error("Error fetching Mapbox token:", err);
        setError("Unable to load map. Please try again later.");
        
        // Fallback to any stored token
        const storedToken = localStorage.getItem("mapbox_token");
        if (storedToken) {
          setMapboxToken(storedToken);
          setError(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, []);

  // Add markers to map
  const addMarkers = useCallback(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for each property
    properties.forEach((property) => {
      const coords = getPropertyCoordinates(property);
      
      const el = document.createElement("div");
      el.className = "property-marker";
      el.style.cssText = `
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #1a365d 0%, #2d4a73 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 10px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border: 3px solid white;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      `;
      el.innerHTML = `$${Math.round(property.price / 1000)}K`;

      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.15)";
        el.style.boxShadow = "0 6px 20px rgba(0,0,0,0.4)";
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
        el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat(coords)
        .addTo(map.current!);

      el.addEventListener("click", () => {
        setSelectedProperty(property);
        onPropertySelect?.(property);
        map.current?.flyTo({
          center: coords,
          zoom: 14,
          duration: 1500,
          pitch: 60,
        });
      });

      markersRef.current.push(marker);
    });
  }, [properties, onPropertySelect]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || isLoading) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyles[currentStyle],
      center: [-95.3698, 29.7604], // Houston center
      zoom: 9,
      pitch: 45,
      bearing: -10,
      antialias: true,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      "top-right"
    );

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");

    // Add scale control
    map.current.addControl(
      new mapboxgl.ScaleControl({ maxWidth: 100 }),
      "bottom-left"
    );

    map.current.on("load", () => {
      setMapLoaded(true);

      // Add terrain if using satellite or outdoors style
      if (currentStyle === "satellite" || currentStyle === "outdoors") {
        map.current?.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });

        map.current?.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
      }

      // Add sky layer for 3D effect
      map.current?.addLayer({
        id: "sky",
        type: "sky",
        paint: {
          "sky-type": "atmosphere",
          "sky-atmosphere-sun": [0.0, 90.0],
          "sky-atmosphere-sun-intensity": 15,
        },
      });

      // Add 3D buildings for streets/dark style
      if (currentStyle === "streets" || currentStyle === "dark") {
        const layers = map.current?.getStyle().layers;
        const labelLayerId = layers?.find(
          (layer) => layer.type === "symbol" && layer.layout?.["text-field"]
        )?.id;

        map.current?.addLayer(
          {
            id: "3d-buildings",
            source: "composite",
            "source-layer": "building",
            filter: ["==", "extrude", "true"],
            type: "fill-extrusion",
            minzoom: 12,
            paint: {
              "fill-extrusion-color": currentStyle === "dark" ? "#1a1a2e" : "#aaa",
              "fill-extrusion-height": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12,
                0,
                12.5,
                ["get", "height"],
              ],
              "fill-extrusion-base": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12,
                0,
                12.5,
                ["get", "min_height"],
              ],
              "fill-extrusion-opacity": 0.7,
            },
          },
          labelLayerId
        );
      }

      addMarkers();
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      map.current?.remove();
      map.current = null;
      setMapLoaded(false);
    };
  }, [mapboxToken, isLoading, currentStyle, addMarkers]);

  // Update markers when properties change
  useEffect(() => {
    if (mapLoaded) {
      addMarkers();
    }
  }, [properties, mapLoaded, addMarkers]);

  const changeMapStyle = (style: MapStyle) => {
    setCurrentStyle(style);
    setMapLoaded(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="h-[500px] bg-muted rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error && !mapboxToken) {
    return (
      <div className="h-[500px] bg-muted rounded-2xl flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-serif text-xl font-semibold mb-2 text-foreground">
            Map Unavailable
          </h3>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Map Style Switcher */}
      <div className="absolute top-4 left-4 z-10 flex gap-1 bg-background/90 backdrop-blur-sm rounded-lg p-1 shadow-lg">
        {(Object.keys(mapStyles) as MapStyle[]).map((style) => (
          <Button
            key={style}
            variant={currentStyle === style ? "default" : "ghost"}
            size="sm"
            onClick={() => changeMapStyle(style)}
            className="capitalize text-xs"
          >
            {style === "satellite" ? (
              <Layers className="h-3 w-3 mr-1" />
            ) : null}
            {style}
          </Button>
        ))}
      </div>

      {/* Properties Count Badge */}
      <div className="absolute top-4 right-16 z-10 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs font-medium text-foreground">
          {properties.length} Properties
        </p>
      </div>
      
      {/* Selected Property Card */}
      {selectedProperty && (
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 bg-card/95 backdrop-blur-xl rounded-xl shadow-luxury border border-border overflow-hidden animate-slide-up z-10">
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
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
              {selectedProperty.status}
            </div>
          </div>
          <div className="p-4">
            <p className="text-lg font-bold text-primary mb-1">
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
              className="block w-full text-center py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              View Details
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
