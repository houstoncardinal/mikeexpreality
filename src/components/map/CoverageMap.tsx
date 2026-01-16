import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MapPin, Maximize2, Satellite, Map as MapIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { allListings, PropertyListing } from "@/lib/listingsData";

interface NeighborhoodMarker {
  id: string;
  name: string;
  listings: number;
  avgPrice: string;
  coords: [number, number];
  color: string;
}

interface CoverageMapProps {
  neighborhoods: NeighborhoodMarker[];
  onNeighborhoodSelect?: (neighborhood: NeighborhoodMarker) => void;
  selectedNeighborhood?: NeighborhoodMarker | null;
  isLoading?: boolean;
  className?: string;
  showPropertyMarkers?: boolean;
  enableFullscreen?: boolean;
}

// Houston area neighborhood coordinates
const neighborhoodGeoCoords: Record<string, [number, number]> = {
  'Sugar Land': [-95.6349, 29.6197],
  'Katy': [-95.8244, 29.7858],
  'Cypress': [-95.6969, 29.9691],
  'Richmond': [-95.7608, 29.5822],
  'Missouri City': [-95.5386, 29.6186],
  'Pearland': [-95.2860, 29.5636],
  'Houston': [-95.3698, 29.7604],
  'Fulshear': [-95.8978, 29.6897],
  'Rosenberg': [-95.8086, 29.5572],
  'Stafford': [-95.5569, 29.6158],
  'Beaumont': [-94.1266, 30.0802],
};

const neighborhoodColors: Record<string, string> = {
  'Sugar Land': '#10b981',
  'Katy': '#3b82f6',
  'Cypress': '#8b5cf6',
  'Richmond': '#f59e0b',
  'Missouri City': '#ec4899',
  'Pearland': '#06b6d4',
  'Houston': '#1a365d',
  'Fulshear': '#eab308',
  'Rosenberg': '#14b8a6',
  'Stafford': '#6366f1',
  'Beaumont': '#ef4444',
};

const formatPrice = (price: number, type: "sale" | "lease") => {
  if (type === "lease") return `$${price.toLocaleString()}/mo`;
  return `$${(price / 1000).toFixed(0)}K`;
};

export function CoverageMap({ 
  neighborhoods, 
  onNeighborhoodSelect, 
  selectedNeighborhood,
  isLoading = false,
  className,
  showPropertyMarkers = true,
  enableFullscreen = true,
}: CoverageMapProps) {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const propertyMarkersRef = useRef<mapboxgl.Marker[]>([]);
  
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredNeighborhood, setHoveredNeighborhood] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<"outdoors" | "satellite">("outdoors");
  const [currentZoom, setCurrentZoom] = useState(8.5);

  // Get active listings with coordinates
  const activeListings = allListings.filter(
    l => ["For Sale", "For Lease"].includes(l.status) && l.latitude && l.longitude
  );

  // Fetch Mapbox token
  useEffect(() => {
    const fetchToken = async () => {
      setIsMapLoading(true);
      setError(null);

      try {
        const cachedToken = localStorage.getItem("mapbox_token_cache");
        const cacheTime = localStorage.getItem("mapbox_token_cache_time");
        
        if (cachedToken && cacheTime && Date.now() - parseInt(cacheTime) < 3600000) {
          setMapboxToken(cachedToken);
          setIsMapLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase.functions.invoke("get-mapbox-token");

        if (fetchError) throw new Error(fetchError.message);

        if (data?.success && data?.token) {
          setMapboxToken(data.token);
          localStorage.setItem("mapbox_token_cache", data.token);
          localStorage.setItem("mapbox_token_cache_time", Date.now().toString());
        } else {
          throw new Error(data?.error || "Failed to retrieve token");
        }
      } catch (err) {
        console.error("Error fetching Mapbox token:", err);
        setError("Unable to load map");
        
        const storedToken = localStorage.getItem("mapbox_token");
        if (storedToken) {
          setMapboxToken(storedToken);
          setError(null);
        }
      } finally {
        setIsMapLoading(false);
      }
    };

    fetchToken();
  }, []);

  // Add property markers
  const addPropertyMarkers = useCallback(() => {
    if (!map.current || !showPropertyMarkers) return;

    propertyMarkersRef.current.forEach((marker) => marker.remove());
    propertyMarkersRef.current = [];

    // Only show property markers when zoomed in enough
    if (currentZoom < 10) return;

    activeListings.forEach((listing) => {
      const el = document.createElement("div");
      el.className = "property-price-marker";
      el.innerHTML = `
        <div class="price-tag">
          <span>${formatPrice(listing.price, listing.priceType)}</span>
        </div>
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([listing.longitude!, listing.latitude!])
        .addTo(map.current!);

      el.addEventListener("click", () => {
        navigate(`/property/${listing.id}`);
      });

      propertyMarkersRef.current.push(marker);
    });
  }, [activeListings, currentZoom, showPropertyMarkers, navigate]);

  // Add neighborhood markers
  const addMarkers = useCallback(() => {
    if (!map.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Only show neighborhood markers when zoomed out
    if (currentZoom > 10) return;

    neighborhoods.forEach((hood) => {
      const coords = neighborhoodGeoCoords[hood.name] || [-95.3698, 29.7604];
      const color = neighborhoodColors[hood.name] || '#1a365d';
      
      const el = document.createElement("div");
      el.className = "coverage-marker";
      el.innerHTML = `
        <div class="marker-pulse" style="background: ${color}40;"></div>
        <div class="marker-dot" style="background: ${color};">
          <span class="marker-count">${hood.listings}</span>
        </div>
      `;
      
      el.style.cssText = `position: relative; cursor: pointer;`;

      const marker = new mapboxgl.Marker(el)
        .setLngLat(coords)
        .addTo(map.current!);

      el.addEventListener("click", () => {
        onNeighborhoodSelect?.(hood);
        map.current?.flyTo({
          center: coords,
          zoom: 11,
          duration: 1000,
          pitch: 45,
        });
      });

      el.addEventListener("mouseenter", () => setHoveredNeighborhood(hood.id));
      el.addEventListener("mouseleave", () => setHoveredNeighborhood(null));

      markersRef.current.push(marker);
    });
  }, [neighborhoods, onNeighborhoodSelect, currentZoom]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || isMapLoading) return;

    mapboxgl.accessToken = mapboxToken;

    const styleUrl = mapStyle === "satellite" 
      ? "mapbox://styles/mapbox/satellite-streets-v12"
      : "mapbox://styles/mapbox/outdoors-v12";

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: [-95.5, 29.7],
      zoom: 8.5,
      pitch: 40,
      bearing: 0,
      antialias: true,
      interactive: true,
    });

    map.current.scrollZoom.disable();

    map.current.on("load", () => {
      setMapLoaded(true);

      // Add terrain for 3D effect
      map.current?.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });

      map.current?.setTerrain({ source: "mapbox-dem", exaggeration: 1.2 });

      // Add 3D buildings for satellite view
      if (mapStyle === "satellite" && map.current?.getStyle().layers) {
        map.current.addLayer({
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 14,
          paint: {
            "fill-extrusion-color": "#aaa",
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": ["get", "min_height"],
            "fill-extrusion-opacity": 0.7,
          },
        });
      }

      // Add atmospheric sky
      map.current?.addLayer({
        id: "sky",
        type: "sky",
        paint: {
          "sky-type": "atmosphere",
          "sky-atmosphere-sun": [0.0, 90.0],
          "sky-atmosphere-sun-intensity": 15,
        },
      });

      addMarkers();
      addPropertyMarkers();
    });

    map.current.on("zoom", () => {
      const zoom = map.current?.getZoom() || 8.5;
      setCurrentZoom(zoom);
    });

    // Add marker styles
    const style = document.createElement("style");
    style.id = "coverage-map-styles";
    if (!document.getElementById("coverage-map-styles")) {
      style.textContent = `
        .coverage-marker .marker-pulse {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          animation: pulse 2s ease-out infinite;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        .coverage-marker .marker-dot {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transition: transform 0.2s ease;
        }
        .coverage-marker:hover .marker-dot {
          transform: scale(1.2);
        }
        .coverage-marker .marker-count {
          color: white;
          font-size: 11px;
          font-weight: 700;
        }
        .property-price-marker {
          cursor: pointer;
        }
        .property-price-marker .price-tag {
          background: hsl(var(--background));
          border: 2px solid hsl(var(--primary));
          border-radius: 6px;
          padding: 2px 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          font-size: 10px;
          font-weight: 700;
          color: hsl(var(--foreground));
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .property-price-marker:hover .price-tag {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          transform: scale(1.1);
        }
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      propertyMarkersRef.current.forEach((marker) => marker.remove());
      map.current?.remove();
      map.current = null;
      setMapLoaded(false);
    };
  }, [mapboxToken, isMapLoading, mapStyle]);

  // Update markers when zoom changes
  useEffect(() => {
    if (mapLoaded) {
      addMarkers();
      addPropertyMarkers();
    }
  }, [mapLoaded, addMarkers, addPropertyMarkers, currentZoom]);

  // Update markers when neighborhoods change
  useEffect(() => {
    if (mapLoaded) addMarkers();
  }, [neighborhoods, mapLoaded, addMarkers]);

  // Fly to selected neighborhood
  useEffect(() => {
    if (selectedNeighborhood && map.current && mapLoaded) {
      const coords = neighborhoodGeoCoords[selectedNeighborhood.name];
      if (coords) {
        map.current.flyTo({
          center: coords,
          zoom: 11,
          duration: 1000,
          pitch: 45,
        });
      }
    }
  }, [selectedNeighborhood, mapLoaded]);

  const toggleMapStyle = () => {
    setMapStyle(prev => prev === "outdoors" ? "satellite" : "outdoors");
  };

  if (isMapLoading || isLoading) {
    return (
      <div className={cn("h-[200px] bg-muted rounded-2xl flex items-center justify-center", className)}>
        <div className="text-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error && !mapboxToken) {
    return (
      <div className={cn("h-[200px] bg-muted rounded-2xl flex items-center justify-center", className)}>
        <div className="text-center p-4">
          <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative h-[200px] rounded-2xl overflow-hidden", className)}>
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Map Controls */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
        <Button
          variant="secondary"
          size="icon"
          className="h-7 w-7"
          onClick={toggleMapStyle}
          title={mapStyle === "satellite" ? "Street View" : "Satellite View"}
        >
          {mapStyle === "satellite" ? (
            <MapIcon className="h-3 w-3" />
          ) : (
            <Satellite className="h-3 w-3" />
          )}
        </Button>
        
        {enableFullscreen && (
          <Button
            variant="secondary"
            size="icon"
            className="h-7 w-7"
            onClick={() => navigate("/map-search")}
            title="Fullscreen Map"
          >
            <Maximize2 className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/20 via-transparent to-transparent" />
      
      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredNeighborhood && neighborhoods.find(n => n.id === hoveredNeighborhood) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg z-20"
          >
            {(() => {
              const hood = neighborhoods.find(n => n.id === hoveredNeighborhood);
              return hood ? (
                <>
                  <p className="text-xs font-semibold text-foreground">{hood.name}</p>
                  <p className="text-[10px] text-muted-foreground">{hood.listings} listings • {hood.avgPrice}</p>
                </>
              ) : null;
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CoverageMap;
