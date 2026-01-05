import { Search, MapPin, Home, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/lib/siteConfig";
import heroImage from "@/assets/hero-home.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Luxury Houston home exterior at golden hour"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 pt-20">
        <div className="max-w-3xl">
          <p className="text-accent font-medium tracking-wider uppercase mb-4 animate-fade-in">
            {siteConfig.tagline}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-tight mb-6 animate-slide-up">
            {siteConfig.name}
            <span className="block text-gradient-gold">Greater Houston Area</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl animate-slide-up stagger-1">
            As a dedicated real estate team serving {siteConfig.serviceAreas.slice(0, 5).join(", ")}, and beyond. 
            We combine deep local market knowledge with personalized service to guide you through every step of your journey.
          </p>

          {/* Search Box */}
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg animate-scale-in stagger-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="City or Neighborhood"
                  className="pl-10 h-12 border-0 bg-secondary"
                />
              </div>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <select className="w-full h-12 pl-10 pr-4 rounded-md bg-secondary text-foreground border-0 focus:ring-2 focus:ring-ring appearance-none cursor-pointer">
                  <option value="">Property Type</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="land">Land</option>
                </select>
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <select className="w-full h-12 pl-10 pr-4 rounded-md bg-secondary text-foreground border-0 focus:ring-2 focus:ring-ring appearance-none cursor-pointer">
                  <option value="">Price Range</option>
                  <option value="0-300000">Under $300K</option>
                  <option value="300000-500000">$300K - $500K</option>
                  <option value="500000-750000">$500K - $750K</option>
                  <option value="750000-1000000">$750K - $1M</option>
                  <option value="1000000+">$1M+</option>
                </select>
              </div>
              <Button variant="gold" size="xl" className="w-full">
                <Search className="h-5 w-5" />
                Search
              </Button>
            </div>
          </div>

          {/* Quick Search Locations */}
          <div className="flex flex-wrap gap-2 mt-6 animate-fade-in stagger-3">
            <span className="text-primary-foreground/60 text-sm">Quick Search:</span>
            {siteConfig.serviceAreas.slice(0, 6).map((area) => (
              <button
                key={area}
                className="px-3 py-1 text-sm rounded-full bg-primary-foreground/10 text-primary-foreground/80 hover:bg-primary-foreground/20 transition-colors"
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 rounded-full bg-primary-foreground/50" />
        </div>
      </div>
    </section>
  );
}
