import { Link } from "react-router-dom";
import { Search, MapPin, Home, DollarSign, ArrowRight, Sparkles, Crown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      {/* Background Image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Luxury Houston home exterior"
          className="w-full h-full object-cover scale-105 transition-transform duration-[20s] hover:scale-110"
        />
        {/* Multi-layer gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy/95 via-navy/80 to-royal-dark/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/60 via-transparent to-navy/40" />
      </div>

      {/* Animated decorative elements */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <div className="hero-orb w-[500px] h-[500px] bg-royal/20 top-[10%] right-[-10%] animate-float" />
        <div className="hero-orb w-[400px] h-[400px] bg-royal-light/15 bottom-[20%] left-[-5%] animate-float-slow" style={{ animationDelay: '-4s' }} />
        <div className="hero-orb w-[300px] h-[300px] bg-silver/10 top-[40%] right-[20%] animate-glow" style={{ animationDelay: '-2s' }} />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 hero-grid opacity-40" />
        
        {/* Light rays */}
        <div className="absolute top-0 left-1/4 w-px h-[60%] bg-gradient-to-b from-royal/30 via-royal/10 to-transparent" />
        <div className="absolute top-0 left-1/2 w-px h-[80%] bg-gradient-to-b from-silver/20 via-silver/5 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-[50%] bg-gradient-to-b from-royal/20 via-royal/5 to-transparent" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 pt-24 pb-32">
        <div className="max-w-5xl">
          {/* Premium badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-royal/20 backdrop-blur-xl rounded-full text-white/90 text-sm font-medium mb-10 animate-fade-in border border-royal/30 shadow-royal">
            <Crown className="w-4 h-4 text-royal-light" />
            <span className="tracking-wide">{siteConfig.tagline}</span>
            <Sparkles className="w-4 h-4 text-royal-light animate-pulse" />
          </div>

          {/* Main headline with elegant typography */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[0.95] mb-8 animate-slide-up tracking-tight">
            <span className="block text-shadow-lg">{siteConfig.name}</span>
            <span className="block mt-3 text-gradient-silver font-light italic text-[0.65em]">
              Greater Houston Area
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/75 mb-14 max-w-2xl animate-slide-up stagger-1 leading-relaxed font-light">
            As a dedicated real estate team serving {siteConfig.serviceAreas.slice(0, 4).join(", ")}, and beyond. 
            <span className="block mt-2 text-royal-light font-medium">We combine deep market expertise with personalized service.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 mb-16 animate-slide-up stagger-2">
            <Button 
              size="lg" 
              className="group relative h-14 px-8 text-base font-semibold bg-white text-navy hover:bg-white/95 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden" 
              asChild
            >
              <Link to="/listings">
                <span className="relative z-10 flex items-center gap-2">
                  Browse Properties
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-royal-light/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              className="group h-14 px-8 text-base font-semibold bg-transparent text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10 rounded-xl backdrop-blur-sm transition-all duration-300" 
              asChild
            >
              <Link to="/home-valuation">
                <Star className="mr-2 h-5 w-5 text-royal-light" />
                Get Home Valuation
              </Link>
            </Button>
          </div>

          {/* Premium Search Box */}
          <div className="card-glass-royal p-6 md:p-8 animate-scale-in stagger-3 max-w-4xl">
            {/* Search header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-royal/30 flex items-center justify-center">
                <Search className="w-5 h-5 text-royal-light" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Find Your Dream Home</h3>
                <p className="text-white/50 text-sm">Search through our exclusive listings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-royal-light" />
                <select 
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-navy-light/80 text-white border border-white/10 focus:border-royal/50 focus:ring-2 focus:ring-royal/30 appearance-none cursor-pointer font-medium transition-all duration-200 hover:border-white/20"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                >
                  <option value="" className="bg-navy">Select City</option>
                  {siteConfig.serviceAreas.map((area) => (
                    <option key={area} value={area} className="bg-navy">{area}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Home className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-royal-light" />
                <select 
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-navy-light/80 text-white border border-white/10 focus:border-royal/50 focus:ring-2 focus:ring-royal/30 appearance-none cursor-pointer font-medium transition-all duration-200 hover:border-white/20"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="" className="bg-navy">Property Type</option>
                  <option value="Single Family Home" className="bg-navy">House</option>
                  <option value="Condo" className="bg-navy">Condo</option>
                  <option value="Townhouse" className="bg-navy">Townhouse</option>
                  <option value="Land" className="bg-navy">Land</option>
                </select>
              </div>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-royal-light" />
                <select 
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-navy-light/80 text-white border border-white/10 focus:border-royal/50 focus:ring-2 focus:ring-royal/30 appearance-none cursor-pointer font-medium transition-all duration-200 hover:border-white/20"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="" className="bg-navy">Price Range</option>
                  <option value="Under $200K" className="bg-navy">Under $200K</option>
                  <option value="$200K - $300K" className="bg-navy">$200K - $300K</option>
                  <option value="$300K - $500K" className="bg-navy">$300K - $500K</option>
                  <option value="$500K - $750K" className="bg-navy">$500K - $750K</option>
                  <option value="$750K - $1M" className="bg-navy">$750K - $1M</option>
                  <option value="$1M+" className="bg-navy">$1M+</option>
                </select>
              </div>
              <Button 
                size="lg"
                className="w-full h-14 text-base font-semibold bg-royal hover:bg-royal-dark text-white rounded-xl shadow-royal hover:shadow-glow transition-all duration-300"
                onClick={handleSearch}
              >
                <Search className="h-5 w-5 mr-2" />
                Search Now
              </Button>
            </div>
          </div>

          {/* Quick Search Locations */}
          <div className="flex flex-wrap items-center gap-3 mt-8 animate-fade-in stagger-4">
            <span className="text-white/50 text-sm font-medium">Popular Areas:</span>
            {siteConfig.serviceAreas.slice(0, 6).map((area, index) => (
              <button
                key={area}
                onClick={() => handleQuickSearch(area)}
                className="px-4 py-2 text-sm rounded-full bg-white/5 text-white/70 hover:bg-royal/30 hover:text-white transition-all duration-300 border border-white/10 hover:border-royal/40 backdrop-blur-sm"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="bg-gradient-to-r from-navy/95 via-navy-light/90 to-navy/95 backdrop-blur-xl border-t border-white/10">
          <div className="container-custom py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { value: "15+", label: "Years Experience", icon: Crown },
                { value: "500+", label: "Properties Sold", icon: Home },
                { value: "$100M+", label: "Total Sales", icon: DollarSign },
                { value: "5.0", label: "Client Rating", icon: Star },
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 group animate-fade-in"
                  style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-royal/20 flex items-center justify-center group-hover:bg-royal/30 transition-colors duration-300">
                    <stat.icon className="w-5 h-5 text-royal-light" />
                  </div>
                  <div>
                    <p className="font-serif text-2xl md:text-3xl font-semibold text-white">
                      {stat.value}
                    </p>
                    <p className="text-xs md:text-sm text-white/50 mt-0.5">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden lg:block">
        <div className="w-7 h-12 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-royal-light animate-pulse" />
        </div>
      </div>
    </section>
  );
}
