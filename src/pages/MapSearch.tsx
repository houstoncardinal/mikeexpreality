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
import { getNeighborhoodGeoJSON, neighborhoodBoundaries } from "@/lib/neighborhoodBoundaries";
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
  Layers,
  SatelliteIcon,
  Mountain,
  List,
  Filter,
  Loader2,
  MapIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapStyle, setMapStyle] = useState<"streets" | "satellite">("streets");
  const [is3DEnabled, setIs3DEnabled] = useState(!isMobile); // Disable 3D by default on mobile
  const [showNeighborhoods, setShowNeighborhoods] = useState(true);
  
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);
  const [hoveredNeighborhood, setHoveredNeighborhood] = useState<string | null>(null);
  
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
      zoom: isMobile ? 8 : 9,
      pitch: is3DEnabled ? 45 : 0,
      bearing: 0,
      antialias: true,
    });

    // Add navigation control - position differs on mobile
    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: !isMobile }), 
      isMobile ? "top-right" : "bottom-right"
    );

    // Add geolocation control on mobile
    if (isMobile) {
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
          showUserHeading: true
        }),
        "top-right"
      );
    }

    map.current.on("load", () => {
      setMapLoaded(true);

      // Add terrain for 3D (skip on mobile for performance)
      if (is3DEnabled && !isMobile) {
        map.current?.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });
        map.current?.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
      }

      // Add 3D buildings when in satellite/streets mode
      if (map.current?.getStyle().layers && !isMobile) {
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
      if (!isMobile) {
        map.current?.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0.0, 90.0],
            "sky-atmosphere-sun-intensity": 15,
          },
        });
      }

      // Add neighborhood boundaries
      if (showNeighborhoods) {
        addNeighborhoodLayers();
      }

      addMarkers();
    });

    // Add marker styles
    const style = document.createElement("style");
    style.id = "map-marker-styles";
    // Remove existing style if present
    const existingStyle = document.getElementById("map-marker-styles");
    if (existingStyle) existingStyle.remove();
    
    style.textContent = `
      .property-marker {
        cursor: pointer;
        z-index: 10;
      }
      .property-marker .marker-content {
        background: hsl(var(--background));
        border: 2px solid hsl(var(--primary));
        border-radius: 8px;
        padding: ${isMobile ? '6px 10px' : '4px 8px'};
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
        font-size: ${isMobile ? '11px' : '12px'};
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
      .neighborhood-popup {
        background: hsl(var(--background));
        border-radius: 12px;
        padding: 12px 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        border: 1px solid hsl(var(--border));
      }
      .neighborhood-popup h3 {
        font-size: 16px;
        font-weight: 700;
        color: hsl(var(--foreground));
        margin-bottom: 4px;
      }
      .neighborhood-popup p {
        font-size: 14px;
        color: hsl(var(--muted-foreground));
      }
      .neighborhood-popup .price {
        font-size: 18px;
        font-weight: 700;
        color: hsl(var(--primary));
      }
      .mapboxgl-popup-content {
        padding: 0;
        border-radius: 12px;
        overflow: hidden;
      }
      .mapboxgl-popup-close-button {
        font-size: 18px;
        padding: 8px;
        color: hsl(var(--muted-foreground));
      }
    `;
    document.head.appendChild(style);

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      map.current?.remove();
      map.current = null;
      setMapLoaded(false);
    };
  }, [mapboxToken, isMapLoading, mapStyle, is3DEnabled, isMobile]);

  // Add neighborhood boundary layers
  const addNeighborhoodLayers = useCallback(() => {
    if (!map.current) return;

    const geojson = getNeighborhoodGeoJSON();

    // Add source
    if (!map.current.getSource("neighborhoods")) {
      map.current.addSource("neighborhoods", {
        type: "geojson",
        data: geojson,
      });
    }

    // Add fill layer
    if (!map.current.getLayer("neighborhood-fills")) {
      map.current.addLayer({
        id: "neighborhood-fills",
        type: "fill",
        source: "neighborhoods",
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.5,
            0.25,
          ],
        },
      });
    }

    // Add outline layer
    if (!map.current.getLayer("neighborhood-outlines")) {
      map.current.addLayer({
        id: "neighborhood-outlines",
        type: "line",
        source: "neighborhoods",
        paint: {
          "line-color": ["get", "color"],
          "line-width": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            3,
            2,
          ],
          "line-opacity": 0.8,
        },
      });
    }

    // Add labels layer
    if (!map.current.getLayer("neighborhood-labels")) {
      map.current.addLayer({
        id: "neighborhood-labels",
        type: "symbol",
        source: "neighborhoods",
        layout: {
          "text-field": ["get", "name"],
          "text-size": isMobile ? 12 : 14,
          "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
          "text-anchor": "center",
        },
        paint: {
          "text-color": "#1a365d",
          "text-halo-color": "#ffffff",
          "text-halo-width": 2,
        },
      });
    }

    let hoveredStateId: string | null = null;
    let popup: mapboxgl.Popup | null = null;

    // Hover effects
    map.current.on("mousemove", "neighborhood-fills", (e) => {
      if (!map.current || !e.features?.length) return;
      
      map.current.getCanvas().style.cursor = "pointer";
      
      const feature = e.features[0];
      const featureId = feature.id as string;

      if (hoveredStateId !== null) {
        map.current.setFeatureState(
          { source: "neighborhoods", id: hoveredStateId },
          { hover: false }
        );
      }
      
      hoveredStateId = featureId;
      setHoveredNeighborhood(featureId);
      
      map.current.setFeatureState(
        { source: "neighborhoods", id: featureId },
        { hover: true }
      );

      // Show popup on hover
      const props = feature.properties;
      if (props && !isMobile) {
        if (popup) popup.remove();
        popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 10,
        })
          .setLngLat(e.lngLat)
          .setHTML(`
            <div class="neighborhood-popup">
              <h3>${props.name}</h3>
              <p class="price">Avg: ${props.avgPrice}</p>
              <p>${props.listings} listings</p>
            </div>
          `)
          .addTo(map.current!);
      }
    });

    map.current.on("mouseleave", "neighborhood-fills", () => {
      if (!map.current) return;
      
      map.current.getCanvas().style.cursor = "";
      
      if (hoveredStateId !== null) {
        map.current.setFeatureState(
          { source: "neighborhoods", id: hoveredStateId },
          { hover: false }
        );
      }
      
      hoveredStateId = null;
      setHoveredNeighborhood(null);
      
      if (popup) {
        popup.remove();
        popup = null;
      }
    });

    // Click to filter by neighborhood
    map.current.on("click", "neighborhood-fills", (e) => {
      if (!e.features?.length) return;
      const props = e.features[0].properties;
      if (props?.name) {
        setFilters(prev => ({ ...prev, city: props.name }));
      }
    });

    // Touch support for mobile
    if (isMobile) {
      map.current.on("click", "neighborhood-fills", (e) => {
        if (!map.current || !e.features?.length) return;
        
        const feature = e.features[0];
        const props = feature.properties;
        
        if (props) {
          new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: true,
          })
            .setLngLat(e.lngLat)
            .setHTML(`
              <div class="neighborhood-popup">
                <h3>${props.name}</h3>
                <p class="price">Avg: ${props.avgPrice}</p>
                <p>${props.listings} listings</p>
              </div>
            `)
            .addTo(map.current);
        }
      });
    }
  }, [isMobile]);

  // Toggle neighborhood visibility
  const toggleNeighborhoods = () => {
    setShowNeighborhoods(!showNeighborhoods);
    if (map.current) {
      const visibility = !showNeighborhoods ? "visible" : "none";
      ["neighborhood-fills", "neighborhood-outlines", "neighborhood-labels"].forEach(layer => {
        if (map.current?.getLayer(layer)) {
          map.current.setLayoutProperty(layer, "visibility", visibility);
        }
      });
    }
  };

  // Update neighborhoods when toggle changes
  useEffect(() => {
    if (mapLoaded && showNeighborhoods && map.current) {
      if (!map.current.getSource("neighborhoods")) {
        addNeighborhoodLayers();
      }
    }
  }, [mapLoaded, showNeighborhoods, addNeighborhoodLayers]);

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
        <meta name="description" content="Explore Houston properties on an interactive map with satellite view, 3D buildings, and neighborhood boundaries." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Helmet>

      <div className="fixed inset-0 flex flex-col md:flex-row">
        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-background border-b border-border p-3 flex items-center justify-between z-30 safe-area-top">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/listings")}
              className="gap-1 text-sm"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <span className="font-semibold text-sm">{filteredListings.length} Properties</span>
            <div className="flex gap-1">
              <Button
                variant={sidebarOpen ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <Filter className="h-4 w-4" />
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Mobile Filters Drawer */}
        {isMobile && (
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetContent side="bottom" className="h-auto max-h-[70vh] rounded-t-2xl">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  )}
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search location, address..."
                    className="pl-9 h-12"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Select
                    value={filters.city}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, city: value }))}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="City" />
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
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Type" />
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
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Price" />
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
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Beds" />
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
                </div>

                <Button className="w-full h-12" onClick={() => setFiltersOpen(false)}>
                  Show {filteredListings.length} Results
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Desktop Sidebar */}
        <AnimatePresence>
          {sidebarOpen && !isMobile && (
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-[340px] lg:w-[400px] h-full bg-background border-r border-border flex flex-col z-20"
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
              <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border flex items-center justify-between">
                <span>{filteredListings.length} properties found</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("gap-1 text-xs", showNeighborhoods && "text-primary")}
                  onClick={toggleNeighborhoods}
                >
                  <MapIcon className="h-3 w-3" />
                  Areas
                </Button>
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
                            loading="lazy"
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

        {/* Mobile Property List (Bottom Sheet) */}
        {isMobile && (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="bottom" className="h-[60vh] rounded-t-2xl p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <span className="font-semibold">{filteredListings.length} Properties</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn("gap-1 text-xs", showNeighborhoods && "text-primary")}
                    onClick={toggleNeighborhoods}
                  >
                    <MapIcon className="h-3 w-3" />
                    {showNeighborhoods ? "Hide" : "Show"} Areas
                  </Button>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-3">
                    {filteredListings.map((listing) => (
                      <motion.div
                        key={listing.id}
                        className={cn(
                          "rounded-lg border overflow-hidden cursor-pointer transition-all active:scale-[0.98]",
                          selectedProperty?.id === listing.id 
                            ? "border-primary ring-2 ring-primary/20" 
                            : "border-border"
                        )}
                        onClick={() => {
                          flyToListing(listing);
                          setSidebarOpen(false);
                        }}
                      >
                        <div className="flex gap-3">
                          <div className="w-24 h-20 flex-shrink-0">
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1 py-2 pr-3">
                            <p className="font-bold text-primary text-sm">
                              {formatPrice(listing.price, listing.priceType)}
                            </p>
                            <p className="text-sm font-medium truncate">
                              {listing.address}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <span>{listing.beds} bd</span>
                              <span>•</span>
                              <span>{listing.baths} ba</span>
                              <span>•</span>
                              <span>{listing.sqft.toLocaleString()} sqft</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Toggle Sidebar Button (Desktop only) */}
        {!sidebarOpen && !isMobile && (
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
          <div className={cn(
            "absolute z-10 flex flex-col gap-2",
            isMobile ? "bottom-28 right-3" : "top-4 right-4"
          )}>
            <Button
              variant={mapStyle === "satellite" ? "default" : "secondary"}
              size="icon"
              className={isMobile ? "h-10 w-10 shadow-lg" : ""}
              onClick={toggleMapStyle}
              title={mapStyle === "satellite" ? "Street View" : "Satellite View"}
            >
              {mapStyle === "satellite" ? (
                <Home className="h-4 w-4" />
              ) : (
                <SatelliteIcon className="h-4 w-4" />
              )}
            </Button>

            {!isMobile && (
              <Button
                variant={is3DEnabled ? "default" : "secondary"}
                size="icon"
                onClick={toggle3D}
                title={is3DEnabled ? "Disable 3D" : "Enable 3D"}
              >
                <Mountain className="h-4 w-4" />
              </Button>
            )}

            <Button
              variant={showNeighborhoods ? "default" : "secondary"}
              size="icon"
              className={isMobile ? "h-10 w-10 shadow-lg" : ""}
              onClick={toggleNeighborhoods}
              title={showNeighborhoods ? "Hide Neighborhoods" : "Show Neighborhoods"}
            >
              <Layers className="h-4 w-4" />
            </Button>
          </div>

          {/* Selected Property Popup */}
          <AnimatePresence>
            {selectedProperty && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className={cn(
                  "absolute z-10",
                  isMobile 
                    ? "bottom-3 left-3 right-3" 
                    : "bottom-4 left-1/2 -translate-x-1/2 w-[350px] max-w-[calc(100%-2rem)]"
                )}
              >
                <div className="bg-background rounded-xl border border-border shadow-2xl overflow-hidden">
                  <div className="relative">
                    <img
                      src={selectedProperty.images[0]}
                      alt={selectedProperty.title}
                      className={cn("w-full object-cover", isMobile ? "h-28" : "h-36")}
                    />
                    <Button
                      variant="secondary"
                      size="icon"
                      className={cn("absolute top-2 right-2", isMobile && "h-8 w-8")}
                      onClick={() => setSelectedProperty(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Badge className="absolute bottom-2 left-2">
                      {selectedProperty.status}
                    </Badge>
                  </div>
                  <div className={cn("p-4", isMobile && "p-3")}>
                    <p className={cn("font-bold text-primary", isMobile ? "text-lg" : "text-xl")}>
                      {formatPrice(selectedProperty.price, selectedProperty.priceType)}
                    </p>
                    <p className="font-medium text-sm">{selectedProperty.address}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedProperty.city}, {selectedProperty.state} {selectedProperty.zip}
                    </p>
                    <div className={cn(
                      "flex items-center gap-4 mt-2 text-muted-foreground",
                      isMobile ? "text-xs" : "text-sm"
                    )}>
                      <span className="flex items-center gap-1">
                        <Bed className="h-3.5 w-3.5" />
                        {selectedProperty.beds}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="h-3.5 w-3.5" />
                        {selectedProperty.baths}
                      </span>
                      <span className="flex items-center gap-1">
                        <Square className="h-3.5 w-3.5" />
                        {selectedProperty.sqft.toLocaleString()}
                      </span>
                    </div>
                    <Button 
                      className={cn("w-full mt-3", isMobile && "h-10")}
                      onClick={() => navigate(`/property/${selectedProperty.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Neighborhood Legend (Desktop only) */}
          {showNeighborhoods && !isMobile && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute bottom-4 right-4 z-10 bg-background/95 backdrop-blur-sm rounded-lg border border-border p-3 shadow-lg max-w-[200px]"
            >
              <h4 className="font-semibold text-xs mb-2 text-muted-foreground uppercase tracking-wide">Neighborhoods</h4>
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                {neighborhoodBoundaries.slice(0, 6).map((hood) => (
                  <div 
                    key={hood.id}
                    className={cn(
                      "flex items-center gap-2 text-xs cursor-pointer rounded px-1.5 py-1 transition-colors",
                      hoveredNeighborhood === hood.id ? "bg-muted" : "hover:bg-muted/50"
                    )}
                    onClick={() => {
                      setFilters(prev => ({ ...prev, city: hood.name }));
                    }}
                  >
                    <div 
                      className="w-3 h-3 rounded-sm flex-shrink-0" 
                      style={{ backgroundColor: hood.color }}
                    />
                    <span className="truncate">{hood.name}</span>
                    <span className="ml-auto text-muted-foreground">{hood.avgPrice}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
