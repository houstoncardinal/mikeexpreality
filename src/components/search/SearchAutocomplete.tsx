import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Home, TrendingUp, Clock, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { allListings, cities, formatPrice, PropertyListing } from "@/lib/listingsData";
import { cn } from "@/lib/utils";

interface SearchResult {
  type: "property" | "neighborhood" | "city";
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  price?: number;
  priceType?: "sale" | "lease";
  url: string;
}

interface SearchAutocompleteProps {
  variant?: "hero" | "compact";
  className?: string;
  placeholder?: string;
  onClose?: () => void;
}

// Get unique neighborhoods from listings
const neighborhoods = [...new Set(allListings
  .map(l => l.neighborhood)
  .filter((n): n is string => Boolean(n))
)];

// Recent searches (in real app would be from localStorage)
const recentSearches = [
  "Luxury homes in Katy",
  "5 bedroom homes",
  "Swimming pool",
];

export function SearchAutocomplete({
  variant = "hero",
  className,
  placeholder = "Search properties, neighborhoods, or cities...",
  onClose,
}: SearchAutocompleteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Search logic
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const matchedResults: SearchResult[] = [];

    // Search properties
    const matchedProperties = allListings
      .filter(listing => 
        listing.title.toLowerCase().includes(query) ||
        listing.address.toLowerCase().includes(query) ||
        listing.city.toLowerCase().includes(query) ||
        listing.neighborhood?.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query)
      )
      .slice(0, 4)
      .map(listing => ({
        type: "property" as const,
        id: listing.id,
        title: listing.title,
        subtitle: `${listing.address}, ${listing.city}`,
        image: listing.images[0],
        price: listing.price,
        priceType: listing.priceType,
        url: `/property/${listing.id}`,
      }));

    matchedResults.push(...matchedProperties);

    // Search neighborhoods
    const matchedNeighborhoods = neighborhoods
      .filter(n => n.toLowerCase().includes(query))
      .slice(0, 3)
      .map(n => ({
        type: "neighborhood" as const,
        id: n,
        title: n,
        subtitle: `${allListings.filter(l => l.neighborhood === n).length} properties available`,
        url: `/listings?search=${encodeURIComponent(n)}`,
      }));

    matchedResults.push(...matchedNeighborhoods);

    // Search cities
    const matchedCities = cities
      .filter(c => c.toLowerCase().includes(query))
      .slice(0, 3)
      .map(c => ({
        type: "city" as const,
        id: c,
        title: c + ", TX",
        subtitle: `${allListings.filter(l => l.city === c).length} properties available`,
        url: `/listings?city=${encodeURIComponent(c)}`,
      }));

    matchedResults.push(...matchedCities);

    setResults(matchedResults);
    setActiveIndex(-1);
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      performSearch(query);
    }, 150);
    return () => clearTimeout(debounce);
  }, [query, performSearch]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        navigate(results[activeIndex].url);
        setIsOpen(false);
        onClose?.();
      } else if (query.trim()) {
        navigate(`/listings?search=${encodeURIComponent(query)}`);
        setIsOpen(false);
        onClose?.();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      onClose?.();
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setIsOpen(false);
    setQuery("");
    onClose?.();
  };

  const handleQuickSearch = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const isHero = variant === "hero";

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Search Input */}
      <div className={cn(
        "relative flex items-center",
        isHero ? "bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:border-white/30 transition-colors" : "bg-card rounded-lg border border-border"
      )}>
        <Search className={cn(
          "absolute left-4 h-5 w-5",
          isHero ? "text-white/60 left-5" : "text-muted-foreground"
        )} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full bg-transparent border-0 outline-none focus:ring-0 placeholder:text-muted-foreground",
            isHero 
              ? "pl-14 pr-12 py-4 text-lg font-medium text-white placeholder:text-white/50" 
              : "pl-12 pr-10 py-3 text-base text-foreground"
          )}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className={cn(
              "absolute right-4 p-1.5 rounded-full transition-colors",
              isHero ? "hover:bg-white/10" : "hover:bg-secondary"
            )}
          >
            <X className={cn("h-4 w-4", isHero ? "text-white/60" : "text-muted-foreground")} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute left-0 right-0 mt-2 bg-card rounded-xl shadow-2xl border border-border overflow-hidden z-50",
              isHero ? "max-h-[70vh]" : "max-h-[60vh]"
            )}
          >
            {/* Results */}
            {results.length > 0 ? (
              <div className="divide-y divide-border">
                {/* Properties */}
                {results.filter(r => r.type === "property").length > 0 && (
                  <div className="p-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                      Properties
                    </p>
                    {results.filter(r => r.type === "property").map((result, index) => {
                      const globalIndex = results.findIndex(r => r.id === result.id);
                      return (
                        <motion.button
                          key={result.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleResultClick(result)}
                          className={cn(
                            "w-full flex items-center gap-4 p-3 rounded-lg transition-all text-left group",
                            activeIndex === globalIndex 
                              ? "bg-accent/10" 
                              : "hover:bg-secondary"
                          )}
                        >
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={result.image}
                              alt={result.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                              {result.title}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{result.subtitle}</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-accent">
                              {result.price && formatPrice(result.price, result.priceType)}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* Neighborhoods */}
                {results.filter(r => r.type === "neighborhood").length > 0 && (
                  <div className="p-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                      Neighborhoods
                    </p>
                    {results.filter(r => r.type === "neighborhood").map((result, index) => {
                      const globalIndex = results.findIndex(r => r.id === result.id);
                      return (
                        <motion.button
                          key={result.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (results.filter(r => r.type === "property").length + index) * 0.05 }}
                          onClick={() => handleResultClick(result)}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left group",
                            activeIndex === globalIndex 
                              ? "bg-accent/10" 
                              : "hover:bg-secondary"
                          )}
                        >
                          <div className="w-10 h-10 rounded-lg bg-gradient-royal flex items-center justify-center flex-shrink-0">
                            <Home className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground group-hover:text-accent transition-colors">
                              {result.title}
                            </p>
                            <p className="text-sm text-muted-foreground">{result.subtitle}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* Cities */}
                {results.filter(r => r.type === "city").length > 0 && (
                  <div className="p-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                      Cities
                    </p>
                    {results.filter(r => r.type === "city").map((result, index) => {
                      const globalIndex = results.findIndex(r => r.id === result.id);
                      return (
                        <motion.button
                          key={result.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (results.filter(r => r.type !== "city").length + index) * 0.05 }}
                          onClick={() => handleResultClick(result)}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left group",
                            activeIndex === globalIndex 
                              ? "bg-accent/10" 
                              : "hover:bg-secondary"
                          )}
                        >
                          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-5 w-5 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground group-hover:text-accent transition-colors">
                              {result.title}
                            </p>
                            <p className="text-sm text-muted-foreground">{result.subtitle}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : query ? (
              /* No results */
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Search className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground mb-1">No results found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search terms
                </p>
              </div>
            ) : (
              /* Empty state with suggestions */
              <div className="p-4">
                {/* Trending */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-3 w-3" />
                    Trending
                  </p>
                  <div className="flex flex-wrap gap-2 px-3">
                    {["Luxury Estates", "Pool Homes", "New Construction", "Waterfront"].map((term) => (
                      <button
                        key={term}
                        onClick={() => handleQuickSearch(term)}
                        className="px-3 py-1.5 bg-secondary hover:bg-accent/10 rounded-full text-sm font-medium text-foreground hover:text-accent transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2 flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    Recent Searches
                  </p>
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleQuickSearch(term)}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-secondary rounded-lg transition-colors text-left group"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground group-hover:text-accent transition-colors">{term}</span>
                    </button>
                  ))}
                </div>

                {/* Popular Cities */}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2 flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    Popular Cities
                  </p>
                  <div className="grid grid-cols-2 gap-2 px-3">
                    {cities.slice(0, 6).map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          navigate(`/listings?city=${encodeURIComponent(city)}`);
                          setIsOpen(false);
                          onClose?.();
                        }}
                        className="flex items-center gap-2 p-2 bg-secondary hover:bg-accent/10 rounded-lg text-sm font-medium text-foreground hover:text-accent transition-colors"
                      >
                        <MapPin className="h-3 w-3 text-accent" />
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Search all */}
            {query && (
              <div className="p-3 bg-secondary/50 border-t border-border">
                <button
                  onClick={() => {
                    navigate(`/listings?search=${encodeURIComponent(query)}`);
                    setIsOpen(false);
                    onClose?.();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                >
                  <Search className="h-4 w-4" />
                  Search all results for "{query}"
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}