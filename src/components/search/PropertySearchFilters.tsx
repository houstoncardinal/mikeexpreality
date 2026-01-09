import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Search, 
  MapPin, 
  Home, 
  DollarSign, 
  Bed, 
  Bath, 
  SlidersHorizontal, 
  X,
  Building2,
  TreeDeciduous,
  Users,
  Warehouse,
  Sparkles,
  TrendingUp,
  Crown,
  Palmtree,
  Mountain,
  Waves,
  Factory,
  Castle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cities, propertyTypes, priceRanges, bedOptions, bathOptions } from "@/lib/listingsData";
import { cn } from "@/lib/utils";
import { LuxurySelect, LuxurySelectOption } from "./LuxurySelect";

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

// City options with icons and descriptions
const cityOptions: LuxurySelectOption[] = [
  { value: "", label: "All Cities", icon: <MapPin className="h-4 w-4" />, description: "Browse all available locations" },
  { value: "Houston", label: "Houston", icon: <Building2 className="h-4 w-4" />, description: "Downtown & Metro Area", badge: "Popular" },
  { value: "Sugar Land", label: "Sugar Land", icon: <Palmtree className="h-4 w-4" />, description: "Master-Planned Communities" },
  { value: "Katy", label: "Katy", icon: <Crown className="h-4 w-4" />, description: "Top-Rated School Districts", badge: "Hot" },
  { value: "Cypress", label: "Cypress", icon: <TreeDeciduous className="h-4 w-4" />, description: "Nature & Modern Living" },
  { value: "Richmond", label: "Richmond", icon: <Castle className="h-4 w-4" />, description: "Historic Charm & Elegance" },
  { value: "Missouri City", label: "Missouri City", icon: <TrendingUp className="h-4 w-4" />, description: "Growing Family Community" },
  { value: "Pearland", label: "Pearland", icon: <Sparkles className="h-4 w-4" />, description: "Vibrant & Dynamic" },
  { value: "Rosenberg", label: "Rosenberg", icon: <Mountain className="h-4 w-4" />, description: "Affordable Luxury" },
  { value: "Rosharon", label: "Rosharon", icon: <Waves className="h-4 w-4" />, description: "Peaceful Countryside" },
  { value: "Beaumont", label: "Beaumont", icon: <Factory className="h-4 w-4" />, description: "Industrial Heritage" },
];

// Property type options with icons and descriptions
const propertyTypeOptions: LuxurySelectOption[] = [
  { value: "", label: "All Types", icon: <Home className="h-4 w-4" />, description: "Browse all property types" },
  { value: "Single Family Home", label: "Single Family", icon: <Home className="h-4 w-4" />, description: "Detached homes with private yards", badge: "Popular" },
  { value: "Townhouse", label: "Townhouse", icon: <Building2 className="h-4 w-4" />, description: "Multi-level attached living" },
  { value: "Condo", label: "Condominium", icon: <Warehouse className="h-4 w-4" />, description: "Low-maintenance luxury living" },
  { value: "Land", label: "Land", icon: <TreeDeciduous className="h-4 w-4" />, description: "Build your dream home" },
  { value: "Multi-Family", label: "Multi-Family", icon: <Users className="h-4 w-4" />, description: "Investment properties" },
];

// Price range options with icons
const priceRangeOptions: LuxurySelectOption[] = priceRanges.map((range, index) => ({
  value: range.label,
  label: range.label,
  icon: <DollarSign className="h-4 w-4" />,
  description: index === 0 ? "No price limit" : index === priceRanges.length - 1 ? "Luxury estates" : "Great selection available",
  badge: index === 2 || index === 3 ? "Most Popular" : undefined,
}));

// Bedroom options with visual indicators
const bedroomOptions: LuxurySelectOption[] = bedOptions.map((opt) => ({
  value: String(opt.value),
  label: opt.value === 0 ? "Any Bedrooms" : `${opt.label} Bedrooms`,
  icon: <Bed className="h-4 w-4" />,
  description: opt.value === 0 ? "No minimum" : opt.value >= 4 ? "Spacious family homes" : "Comfortable living space",
}));

// Bathroom options with visual indicators
const bathroomOptions: LuxurySelectOption[] = bathOptions.map((opt) => ({
  value: String(opt.value),
  label: opt.value === 0 ? "Any Bathrooms" : `${opt.label} Bathrooms`,
  icon: <Bath className="h-4 w-4" />,
  description: opt.value === 0 ? "No minimum" : opt.value >= 3 ? "Luxury amenities" : "Essential comfort",
}));

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
      "w-full relative z-50",
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
                "pl-10 h-12 border border-border/50 hover:border-accent/30 transition-all duration-300",
                isHero ? "bg-secondary/80 focus:bg-background" : "bg-secondary/80"
              )}
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {/* City - Luxury Select */}
          <LuxurySelect
            options={cityOptions}
            value={filters.city}
            onChange={(value) => updateFilter("city", value)}
            placeholder="All Cities"
            icon={<MapPin className="h-5 w-5" />}
          />

          {/* Property Type - Luxury Select */}
          <LuxurySelect
            options={propertyTypeOptions}
            value={filters.propertyType}
            onChange={(value) => updateFilter("propertyType", value)}
            placeholder="All Types"
            icon={<Home className="h-5 w-5" />}
          />

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
            {/* Price Range - Luxury Select */}
            <LuxurySelect
              options={priceRangeOptions}
              value={filters.priceRange}
              onChange={(value) => updateFilter("priceRange", value)}
              placeholder="Any Price"
              icon={<DollarSign className="h-5 w-5" />}
            />

            {/* Bedrooms - Luxury Select */}
            <LuxurySelect
              options={bedroomOptions}
              value={String(filters.minBeds)}
              onChange={(value) => updateFilter("minBeds", parseInt(value))}
              placeholder="Beds"
              icon={<Bed className="h-5 w-5" />}
            />

            {/* Bathrooms - Luxury Select */}
            <LuxurySelect
              options={bathroomOptions}
              value={String(filters.minBaths)}
              onChange={(value) => updateFilter("minBaths", parseInt(value))}
              placeholder="Baths"
              icon={<Bath className="h-5 w-5" />}
            />

            {/* Apply Button */}
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
