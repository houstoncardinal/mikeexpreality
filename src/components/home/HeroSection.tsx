import { Link } from "react-router-dom";
import { Search, MapPin, Home, DollarSign, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/lib/siteConfig";
import heroImage from "@/assets/hero-home.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchCity) params.set("city", searchCity);
    if (propertyType) params.set("type", propertyType);
    if (priceRange) params.set("price", priceRange);
    navigate(`/listings?${params.toString()}`);
  };

  const handleQuickSearch = (city: string) => {
    navigate(`/listings?city=${encodeURIComponent(city)}`);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Luxury Houston home exterior at golden hour"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/40 to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-2xl" />

      {/* Content */}
      <div className="container-custom relative z-10 pt-20">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 backdrop-blur-sm rounded-full text-accent text-sm font-medium mb-8 animate-fade-in border border-accent/30">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            {siteConfig.tagline}
          </div>

          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-primary-foreground leading-[1.1] mb-8 animate-slide-up text-shadow-lg">
            {siteConfig.name}
            <span className="block text-gradient-gold mt-2">Greater Houston Area</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/80 mb-12 max-w-2xl animate-slide-up stagger-1 leading-relaxed">
            As a dedicated real estate team serving {siteConfig.serviceAreas.slice(0, 4).join(", ")}, and beyond. 
            We combine deep market expertise with personalized service.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up stagger-2">
            <Button variant="gold" size="xl" className="group" asChild>
              <Link to="/listings">
                Browse Properties
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" className="group" asChild>
              <Link to="/home-valuation">
                <Play className="mr-2 h-5 w-5" />
                Get Home Valuation
              </Link>
            </Button>
          </div>

          {/* Search Box */}
          <div className="bg-card/95 backdrop-blur-xl rounded-2xl p-5 md:p-8 shadow-luxury border border-border/50 animate-scale-in stagger-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                <select 
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary text-foreground border-0 focus:ring-2 focus:ring-accent appearance-none cursor-pointer font-medium"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                >
                  <option value="">Select City</option>
                  {siteConfig.serviceAreas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Home className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                <select 
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary text-foreground border-0 focus:ring-2 focus:ring-accent appearance-none cursor-pointer font-medium"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="">Property Type</option>
                  <option value="Single Family Home">House</option>
                  <option value="Condo">Condo</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Land">Land</option>
                </select>
              </div>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                <select 
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary text-foreground border-0 focus:ring-2 focus:ring-accent appearance-none cursor-pointer font-medium"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="">Price Range</option>
                  <option value="Under $200K">Under $200K</option>
                  <option value="$200K - $300K">$200K - $300K</option>
                  <option value="$300K - $500K">$300K - $500K</option>
                  <option value="$500K - $750K">$500K - $750K</option>
                  <option value="$750K - $1M">$750K - $1M</option>
                  <option value="$1M+">$1M+</option>
                </select>
              </div>
              <Button 
                variant="gold" 
                size="xl" 
                className="w-full h-14 text-base"
                onClick={handleSearch}
              >
                <Search className="h-5 w-5 mr-2" />
                Search Now
              </Button>
            </div>
          </div>

          {/* Quick Search Locations */}
          <div className="flex flex-wrap gap-3 mt-8 animate-fade-in stagger-4">
            <span className="text-primary-foreground/60 text-sm font-medium">Popular:</span>
            {siteConfig.serviceAreas.slice(0, 6).map((area) => (
              <button
                key={area}
                onClick={() => handleQuickSearch(area)}
                className="px-4 py-2 text-sm rounded-full bg-primary-foreground/10 text-primary-foreground/80 hover:bg-accent hover:text-accent-foreground transition-all duration-300 border border-primary-foreground/10 hover:border-accent backdrop-blur-sm"
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border/50 py-6 z-10">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "15+", label: "Years Experience" },
              { value: "500+", label: "Properties Sold" },
              { value: "$100M+", label: "Total Sales" },
              { value: "5.0", label: "Client Rating" },
            ].map((stat, index) => (
              <div key={index} className="text-center md:text-left">
                <p className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden lg:block">
        <div className="w-8 h-14 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-accent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
