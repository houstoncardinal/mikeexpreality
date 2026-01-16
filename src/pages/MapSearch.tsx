import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { supabase } from "@/integrations/supabase/client";
import { 
  allListings, 
  PropertyListing, 
  cities, 
  propertyTypes, 
  priceRanges 
} from "@/lib/listingsData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Search, 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Home,
  ChevronLeft,
  ChevronRight,
  Layers,
  SatelliteIcon,
  Mountain,
  List,
  Maximize2,
  Minimize2,
  Filter,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MapFilters {
  search: string;
  city: string;
  propertyType: string;
  priceRange: string;
  minBeds: number;
}

const formatPrice = (price: number, type: "sale" | "lease") => {
  if (type === "lease") {
    return `$${price.toLocaleString()}/mo`;
  }
  return `$${price.toLocaleString()}`;
};

export default function MapSearch() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapStyle, setMapStyle] = useState<"streets" | "satellite">("streets");
  const [is3DEnabled, setIs3DEnabled] = useState(true);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<MapFilters>({
    search: searchParams.get("search") || "",
    city: searchParams.get("city") || "",
    propertyType: searchParams.get("type") || "",
    priceRange: searchParams.get("price") || "",
    minBeds: parseInt(searchParams.get("beds") || "0"),
  });

  // Filter listings
  const filteredListings = allListings.filter((listing) => {
    if (!["For Sale", "For Lease"].includes(listing.status)) return false;
    if (!listing.latitude || !listing.longitude) return false;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        listing.title.toLowerCase().includes(searchLower) ||
        listing.address.toLowerCase().includes(searchLower) ||
        listing.city.toLowerCase().includes(searchLower) ||
        listing.neighborhood?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    
    if (filters.city && listing.city !== filters.city) return false;
    if (filters.propertyType && listing.propertyType !== filters.propertyType) return false;
    if (filters.minBeds && listing.beds < filters.minBeds) return false;
    
    if (filters.priceRange) {
      const range = priceRanges.find(r => r.label === filters.priceRange);
      if (range) {
        if (listing.price < range.min || listing.price > range.max) return false;
      }
    }
    
    return true;
  });

  // Fetch Mapbox token
  useEffect(() => {
    const fetchToken = async () => {
      setIsMapLoading(true);
      try {
        const cachedToken = localStorage.getItem("mapbox_token_cache");
        const cacheTime = localStorage.getItem("mapbox_token_cache_time");
        
        if (cachedToken && cacheTime && Date.now() - parseInt(cacheTime) < 3600000) {
          setMapboxToken(cachedToken);
          setIsMapLoading(false);
          return;
        }

        const { data, error } = await supabase.functions.invoke("get-mapbox-token");
        if (error) throw new Error(error.message);

        if (data?.success && data?.token) {
          setMapboxToken(data.token);
          localStorage.setItem("mapbox_token_cache", data.token);
          localStorage.setItem("mapbox_token_cache_time", Date.now().toString());
        }
      } catch (err) {
        console.error("Error fetching Mapbox token:", err);
        const storedToken = localStorage.getItem("mapbox_token_cache");
        if (storedToken) setMapboxToken(storedToken);
      } finally {
        setIsMapLoading(false);
      }
    };
    fetchToken();
  }, []);

  // Add property markers
  const addMarkers = useCallback(() => {
    if (!map.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    filteredListings.forEach((listing) => {
      if (!listing.latitude || !listing.longitude) return;

      const el = document.createElement("div");
      el.className = "property-marker";
      const isHovered = hoveredProperty === listing.id;
      const isSelected = selectedProperty?.id === listing.id;
      
      el.innerHTML = `
        <div class="marker-content ${isHovered || isSelected ? 'active' : ''}">
          <span class="marker-price">${formatPrice(listing.price, listing.priceType)}</span>
        </div>
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([listing.longitude, listing.latitude])
        .addTo(map.current!);

      el.addEventListener("click", () => {
        setSelectedProperty(listing);
        map.current?.flyTo({
          center: [listing.longitude!, listing.latitude!],
          zoom: 14,
          duration: 800,
        });
      });

      el.addEventListener("mouseenter", () => setHoveredProperty(listing.id));
      el.addEventListener("mouseleave", () => setHoveredProperty(null));

      markersRef.current.push(marker);
    });
  }, [filteredListings, hoveredProperty, selectedProperty]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || isMapLoading) return;

    mapboxgl.accessToken = mapboxToken;

    const styleUrl = mapStyle === "satellite" 
      ? "mapbox://styles/mapbox/satellite-streets-v12"
      : "mapbox://styles/mapbox/streets-v12";

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: [-95.4, 29.75],
      zoom: 9,
      pitch: is3DEnabled ? 45 : 0,
      bearing: 0,
      antialias: true,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    map.current.on("load", () => {
      setMapLoaded(true);

      // Add terrain for 3D
      if (is3DEnabled) {
        map.current?.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });
        map.current?.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
      }

      // Add 3D buildings when in satellite/streets mode
      if (map.current?.getStyle().layers) {
        map.current.addLayer({
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 14,
          paint: {
            "fill-extrusion-color": mapStyle === "satellite" ? "#aaa" : "#ddd",
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": ["get", "min_height"],
            "fill-extrusion-opacity": 0.8,
          },
        });
      }

      // Add sky for atmosphere
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
    });

    // Add marker styles
    const style = document.createElement("style");
    style.textContent = `
      .property-marker {
        cursor: pointer;
      }
      .property-marker .marker-content {
        background: hsl(var(--background));
        border: 2px solid hsl(var(--primary));
        border-radius: 8px;
        padding: 4px 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.2s ease;
        white-space: nowrap;
      }
      .property-marker .marker-content.active {
        background: hsl(var(--primary));
        transform: scale(1.1);
      }
      .property-marker .marker-content.active .marker-price {
        color: hsl(var(--primary-foreground));
      }
      .property-marker .marker-price {
        font-size: 12px;
        font-weight: 700;
        color: hsl(var(--foreground));
      }
      .property-marker:hover .marker-content {
        background: hsl(var(--primary));
        transform: scale(1.1);
      }
      .property-marker:hover .marker-price {
        color: hsl(var(--primary-foreground));
      }
    `;
    document.head.appendChild(style);

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      map.current?.remove();
      map.current = null;
      setMapLoaded(false);
    };
  }, [mapboxToken, isMapLoading, mapStyle, is3DEnabled]);

  // Update markers when filters change
  useEffect(() => {
    if (mapLoaded) addMarkers();
  }, [mapLoaded, addMarkers]);

  // Switch map style
  const toggleMapStyle = () => {
    const newStyle = mapStyle === "streets" ? "satellite" : "streets";
    setMapStyle(newStyle);
  };

  // Toggle 3D
  const toggle3D = () => {
    setIs3DEnabled(!is3DEnabled);
    if (map.current) {
      map.current.easeTo({
        pitch: !is3DEnabled ? 45 : 0,
        duration: 500,
      });
    }
  };

  // Fly to listing from sidebar
  const flyToListing = (listing: PropertyListing) => {
    if (!listing.latitude || !listing.longitude || !map.current) return;
    setSelectedProperty(listing);
    map.current.flyTo({
      center: [listing.longitude, listing.latitude],
      zoom: 15,
      pitch: 45,
      duration: 1000,
    });
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: "",
      city: "",
      propertyType: "",
      priceRange: "",
      minBeds: 0,
    });
    setSearchParams({});
  };

  const hasActiveFilters = filters.city || filters.propertyType || filters.priceRange || filters.minBeds > 0;

  if (isMapLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Map Search | Houston Real Estate</title>
        <meta name="description" content="Explore Houston properties on an interactive map with satellite view and 3D buildings." />
      </Helmet>

      <div className="fixed inset-0 flex">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-[400px] h-full bg-background border-r border-border flex flex-col z-20"
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate("/listings")}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Listings
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search location, address..."
                    className="pl-9"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>

                {/* Filter Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => setFiltersOpen(!filtersOpen)}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-auto">
                      Active
                    </Badge>
                  )}
                </Button>

                {/* Filters Panel */}
                <AnimatePresence>
                  {filtersOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 space-y-3">
                        <Select
                          value={filters.city}
                          onValueChange={(value) => setFilters(prev => ({ ...prev, city: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All Cities" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Cities</SelectItem>
                            {cities.map(city => (
                              <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={filters.propertyType}
                          onValueChange={(value) => setFilters(prev => ({ ...prev, propertyType: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Types</SelectItem>
                            {propertyTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={filters.priceRange}
                          onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Any Price" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Any Price</SelectItem>
                            {priceRanges.map(range => (
                              <SelectItem key={range.label} value={range.label}>{range.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={String(filters.minBeds)}
                          onValueChange={(value) => setFilters(prev => ({ ...prev, minBeds: parseInt(value) }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Any Beds" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Any Beds</SelectItem>
                            <SelectItem value="1">1+ Beds</SelectItem>
                            <SelectItem value="2">2+ Beds</SelectItem>
                            <SelectItem value="3">3+ Beds</SelectItem>
                            <SelectItem value="4">4+ Beds</SelectItem>
                            <SelectItem value="5">5+ Beds</SelectItem>
                          </SelectContent>
                        </Select>

                        {hasActiveFilters && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full"
                            onClick={clearFilters}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Clear Filters
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Results Count */}
              <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
                {filteredListings.length} properties found
              </div>

              {/* Listings */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                  {filteredListings.map((listing) => (
                    <motion.div
                      key={listing.id}
                      whileHover={{ scale: 1.02 }}
                      className={cn(
                        "rounded-lg border overflow-hidden cursor-pointer transition-all",
                        selectedProperty?.id === listing.id 
                          ? "border-primary ring-2 ring-primary/20" 
                          : "border-border hover:border-primary/50",
                        hoveredProperty === listing.id && "border-primary/50"
                      )}
                      onClick={() => flyToListing(listing)}
                      onMouseEnter={() => setHoveredProperty(listing.id)}
                      onMouseLeave={() => setHoveredProperty(null)}
                    >
                      <div className="flex gap-3">
                        <div className="w-28 h-24 flex-shrink-0">
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 py-2 pr-3">
                          <p className="font-bold text-primary">
                            {formatPrice(listing.price, listing.priceType)}
                          </p>
                          <p className="text-sm font-medium truncate">
                            {listing.address}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {listing.city}, {listing.state}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Bed className="h-3 w-3" />
                              {listing.beds}
                            </span>
                            <span className="flex items-center gap-1">
                              <Bath className="h-3 w-3" />
                              {listing.baths}
                            </span>
                            <span className="flex items-center gap-1">
                              <Square className="h-3 w-3" />
                              {listing.sqft.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Sidebar Button */}
        {!sidebarOpen && (
          <Button
            variant="default"
            size="icon"
            className="absolute left-4 top-4 z-20"
            onClick={() => setSidebarOpen(true)}
          >
            <List className="h-4 w-4" />
          </Button>
        )}

        {/* Map Container */}
        <div className="flex-1 relative">
          <div ref={mapContainer} className="absolute inset-0" />

          {/* Map Controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <Button
              variant={mapStyle === "satellite" ? "default" : "secondary"}
              size="icon"
              onClick={toggleMapStyle}
              title={mapStyle === "satellite" ? "Street View" : "Satellite View"}
            >
              {mapStyle === "satellite" ? (
                <Home className="h-4 w-4" />
              ) : (
                <SatelliteIcon className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant={is3DEnabled ? "default" : "secondary"}
              size="icon"
              onClick={toggle3D}
              title={is3DEnabled ? "Disable 3D" : "Enable 3D"}
            >
              <Mountain className="h-4 w-4" />
            </Button>
          </div>

          {/* Selected Property Popup */}
          <AnimatePresence>
            {selectedProperty && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[350px] max-w-[calc(100%-2rem)]"
              >
                <div className="bg-background rounded-xl border border-border shadow-2xl overflow-hidden">
                  <div className="relative">
                    <img
                      src={selectedProperty.images[0]}
                      alt={selectedProperty.title}
                      className="w-full h-36 object-cover"
                    />
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setSelectedProperty(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Badge className="absolute bottom-2 left-2">
                      {selectedProperty.status}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <p className="text-xl font-bold text-primary">
                      {formatPrice(selectedProperty.price, selectedProperty.priceType)}
                    </p>
                    <p className="font-medium">{selectedProperty.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedProperty.city}, {selectedProperty.state} {selectedProperty.zip}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        {selectedProperty.beds} beds
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        {selectedProperty.baths} baths
                      </span>
                      <span className="flex items-center gap-1">
                        <Square className="h-4 w-4" />
                        {selectedProperty.sqft.toLocaleString()} sqft
                      </span>
                    </div>
                    <Button 
                      className="w-full mt-4"
                      onClick={() => navigate(`/property/${selectedProperty.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
