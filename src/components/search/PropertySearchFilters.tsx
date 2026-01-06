import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, MapPin, Home, DollarSign, Bed, Bath, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cities, propertyTypes, priceRanges, bedOptions, bathOptions } from "@/lib/listingsData";
import { cn } from "@/lib/utils";

interface PropertySearchFiltersProps {
  variant?: "hero" | "sticky" | "inline";
  onSearch?: (filters: SearchFilters) => void;
  className?: string;
  showAdvanced?: boolean;
}

export interface SearchFilters {
  search: string;
  city: string;
  propertyType: string;
  priceRange: string;
  minBeds: number;
  minBaths: number;
}

const defaultFilters: SearchFilters = {
  search: "",
  city: "",
  propertyType: "",
  priceRange: "",
  minBeds: 0,
  minBaths: 0,
};

export function PropertySearchFilters({
  variant = "inline",
  onSearch,
  className,
  showAdvanced = false,
}: PropertySearchFiltersProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(showAdvanced);

  // Initialize from URL params
  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      city: searchParams.get("city") || "",
      propertyType: searchParams.get("type") || "",
      priceRange: searchParams.get("price") || "",
      minBeds: parseInt(searchParams.get("beds") || "0"),
      minBaths: parseInt(searchParams.get("baths") || "0"),
    });
  }, [searchParams]);

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch?.(newFilters);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.city) params.set("city", filters.city);
    if (filters.propertyType) params.set("type", filters.propertyType);
    if (filters.priceRange) params.set("price", filters.priceRange);
    if (filters.minBeds) params.set("beds", filters.minBeds.toString());
    if (filters.minBaths) params.set("baths", filters.minBaths.toString());
    
    navigate(`/listings?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    onSearch?.(defaultFilters);
  };

  const hasActiveFilters = 
    filters.city || 
    filters.propertyType || 
    filters.priceRange || 
    filters.minBeds > 0 || 
    filters.minBaths > 0;

  const isHero = variant === "hero";
  const isSticky = variant === "sticky";

  return (
    <div className={cn(
      "w-full",
      isHero && "bg-card/95 backdrop-blur-md rounded-2xl p-4 md:p-6 shadow-lg border border-border/50",
      isSticky && "bg-background/95 backdrop-blur-md border-b border-border py-4",
      className
    )}>
      <div className={cn(isSticky && "container-custom")}>
        {/* Main Search Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search address, neighborhood, or keyword..."
              className={cn(
                "pl-10 h-12 border-0 transition-all",
                isHero ? "bg-secondary focus:bg-background" : "bg-secondary"
              )}
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {/* City */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
            <select
              className="w-full h-12 pl-10 pr-4 rounded-md bg-secondary text-foreground border-0 focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
              value={filters.city}
              onChange={(e) => updateFilter("city", e.target.value)}
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div className="relative">
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
            <select
              className="w-full h-12 pl-10 pr-4 rounded-md bg-secondary text-foreground border-0 focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
              value={filters.propertyType}
              onChange={(e) => updateFilter("propertyType", e.target.value)}
            >
              <option value="">All Types</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <Button 
            variant="gold" 
            size="xl" 
            className="w-full h-12"
            onClick={handleSearch}
          >
            <Search className="h-5 w-5" />
            Search
          </Button>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {isAdvancedOpen ? "Hide Filters" : "More Filters"}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="h-4 w-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {isAdvancedOpen && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border animate-slide-down">
            {/* Price Range */}
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
              <select
                className="w-full h-12 pl-10 pr-4 rounded-md bg-secondary text-foreground border-0 focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                value={filters.priceRange}
                onChange={(e) => updateFilter("priceRange", e.target.value)}
              >
                {priceRanges.map((range) => (
                  <option key={range.label} value={range.label}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* Bedrooms */}
            <div className="relative">
              <Bed className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
              <select
                className="w-full h-12 pl-10 pr-4 rounded-md bg-secondary text-foreground border-0 focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                value={filters.minBeds}
                onChange={(e) => updateFilter("minBeds", parseInt(e.target.value))}
              >
                {bedOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.value === 0 ? "Beds" : `${opt.label} Beds`}
                  </option>
                ))}
              </select>
            </div>

            {/* Bathrooms */}
            <div className="relative">
              <Bath className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
              <select
                className="w-full h-12 pl-10 pr-4 rounded-md bg-secondary text-foreground border-0 focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                value={filters.minBaths}
                onChange={(e) => updateFilter("minBaths", parseInt(e.target.value))}
              >
                {bathOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.value === 0 ? "Baths" : `${opt.label} Baths`}
                  </option>
                ))}
              </select>
            </div>

            {/* Status filter placeholder for future */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1 h-12"
                onClick={handleSearch}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
