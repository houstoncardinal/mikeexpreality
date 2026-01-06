import { Link } from "react-router-dom";
import { Search, MapPin, Home, DollarSign, ArrowRight, Crown, Star, Award, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/siteConfig";
import heroImage from "@/assets/hero-home.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SearchAutocomplete } from "@/components/search";

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
    <section className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* Cinematic Background with Ken Burns effect */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="w-full h-full"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, ease: "easeOut" }}
        >
          <img
            src={heroImage}
            alt="Luxury Houston estate with pristine landscaping"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Premium cinematic overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_transparent_0%,_hsl(220_60%_5%/0.4)_50%,_hsl(220_60%_5%/0.9)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/30 to-transparent" />
        
        {/* Vignette effect */}
        <div className="absolute inset-0 shadow-[inset_0_0_200px_100px_rgba(0,0,0,0.4)]" />
      </div>

      {/* Animated ambient lighting */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {/* Floating light particles */}
        <motion.div 
          className="absolute w-[800px] h-[800px] rounded-full top-[-20%] right-[-20%]"
          style={{ background: "radial-gradient(circle, hsl(220 75% 55% / 0.15) 0%, transparent 70%)" }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full bottom-[-10%] left-[-10%]"
          style={{ background: "radial-gradient(circle, hsl(220 60% 45% / 0.12) 0%, transparent 70%)" }}
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        
        {/* Subtle moving particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Elegant grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(hsl(220 75% 55%) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(220 75% 55%) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
      </div>

      {/* Main Content */}
      <div className="container-custom relative z-10 pt-28 pb-40">
        <div className="max-w-5xl">
          {/* Prestige Badge */}
          <motion.div 
            className="inline-flex items-center gap-3 px-6 py-3 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              background: "linear-gradient(135deg, hsl(220 75% 55% / 0.2) 0%, hsl(220 60% 35% / 0.15) 100%)",
              backdropFilter: "blur(20px)",
              borderRadius: "100px",
              border: "1px solid hsl(220 75% 55% / 0.3)",
              boxShadow: "0 0 40px hsl(220 75% 55% / 0.15), inset 0 1px 0 hsl(0 0% 100% / 0.1)"
            }}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/90 text-sm font-medium tracking-widest uppercase">
              Houston's Premier Real Estate Team
            </span>
            <Award className="w-4 h-4 text-royal-light" />
          </motion.div>

          {/* Hero Headline - Cinematic Typography */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <h1 className="font-serif leading-[0.9] mb-8">
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-bold text-white tracking-tight"
                style={{ textShadow: "0 4px 60px rgba(0,0,0,0.5), 0 0 120px hsl(220 75% 55% / 0.3)" }}>
                {siteConfig.name}
              </span>
              <span className="block mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-wide"
                style={{ 
                  background: "linear-gradient(90deg, hsl(220 20% 85%) 0%, hsl(0 0% 100%) 50%, hsl(220 20% 85%) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "none"
                }}>
                Greater Houston Area
              </span>
            </h1>
          </motion.div>
          
          {/* Value Proposition */}
          <motion.p 
            className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Where <span className="text-white font-medium">legacy meets luxury</span>. 
            With over 15 years of expertise in Houston's most prestigious neighborhoods, 
            we deliver an <span className="text-royal-light">unparalleled real estate experience</span>.
          </motion.p>

          {/* Premium CTA Group */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-5 mb-14"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button 
              size="lg" 
              className="group relative h-16 px-10 text-lg font-semibold overflow-hidden rounded-2xl transition-all duration-500" 
              style={{
                background: "linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(220 20% 95%) 100%)",
                color: "hsl(220 60% 18%)",
                boxShadow: "0 10px 40px -10px rgba(0,0,0,0.3), 0 0 60px hsl(220 75% 55% / 0.2)"
              }}
              asChild
            >
              <Link to="/listings">
                <span className="relative z-10 flex items-center gap-3">
                  Explore Properties
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-royal/10 to-royal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              className="group h-16 px-10 text-lg font-semibold rounded-2xl transition-all duration-500" 
              style={{
                background: "transparent",
                border: "2px solid hsl(0 0% 100% / 0.25)",
                color: "white",
                backdropFilter: "blur(10px)",
              }}
              asChild
            >
              <Link to="/home-valuation" className="hover:bg-white/10 hover:border-white/40">
                <Crown className="mr-3 h-5 w-5 text-royal-light" />
                Get Home Valuation
              </Link>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            className="flex flex-wrap items-center gap-6 mb-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {[
              { icon: Shield, text: "Licensed & Insured" },
              { icon: Award, text: "Top 1% Realtors" },
              { icon: Users, text: "500+ Happy Clients" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white/60 text-sm">
                <item.icon className="w-4 h-4 text-royal-light" />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Premium Search Box */}
          <motion.div 
            className="relative max-w-4xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div 
              className="p-8 md:p-10 rounded-3xl"
              style={{
                background: "linear-gradient(135deg, hsl(220 60% 12% / 0.8) 0%, hsl(220 50% 18% / 0.7) 100%)",
                backdropFilter: "blur(40px)",
                border: "1px solid hsl(220 75% 55% / 0.2)",
                boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5), inset 0 1px 0 hsl(0 0% 100% / 0.05)"
              }}
            >
              {/* Search header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, hsl(220 75% 55%) 0%, hsl(220 60% 45%) 100%)" }}>
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-xl">Find Your Dream Home</h3>
                  <p className="text-white/50 text-sm">Search through our curated collection of luxury properties</p>
                </div>
              </div>

              {/* Search Autocomplete */}
              <SearchAutocomplete 
                variant="hero"
                placeholder="Search properties, neighborhoods, or cities..."
              />

              {/* Quick filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {[
                  { icon: MapPin, placeholder: "Select City", value: searchCity, onChange: setSearchCity, options: siteConfig.serviceAreas },
                  { icon: Home, placeholder: "Property Type", value: propertyType, onChange: setPropertyType, options: ["Single Family Home", "Condo", "Townhouse", "Land"] },
                  { icon: DollarSign, placeholder: "Price Range", value: priceRange, onChange: setPriceRange, options: ["Under $200K", "$200K - $300K", "$300K - $500K", "$500K - $750K", "$750K - $1M", "$1M+"] },
                ].map((field, i) => (
                  <div key={i} className="relative">
                    <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-royal-light z-10" />
                    <select 
                      className="w-full h-12 pl-12 pr-4 rounded-xl text-white border border-white/10 focus:border-royal/50 focus:ring-2 focus:ring-royal/30 appearance-none cursor-pointer font-medium transition-all duration-200 hover:border-white/20 bg-white/5 backdrop-blur-sm text-sm"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <option value="" className="bg-navy">{field.placeholder}</option>
                      {field.options.map((option) => (
                        <option key={option} value={option} className="bg-navy">{option}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Search Button */}
              <Button 
                size="lg"
                className="w-full h-14 text-base font-semibold rounded-xl transition-all duration-300 mt-6"
                style={{
                  background: "linear-gradient(135deg, hsl(220 75% 55%) 0%, hsl(220 60% 45%) 100%)",
                  boxShadow: "0 10px 40px -10px hsl(220 75% 55% / 0.5)"
                }}
                onClick={handleSearch}
              >
                <Search className="h-5 w-5 mr-2" />
                Search All Properties
              </Button>
            </div>
          </motion.div>

          {/* Quick Search Tags */}
          <motion.div 
            className="flex flex-wrap items-center gap-3 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <span className="text-white/40 text-sm font-medium">Popular:</span>
            {siteConfig.serviceAreas.slice(0, 5).map((area) => (
              <button
                key={area}
                onClick={() => handleQuickSearch(area)}
                className="px-4 py-2 text-sm rounded-full text-white/60 hover:text-white transition-all duration-300 border border-white/10 hover:border-royal/40 hover:bg-royal/20 backdrop-blur-sm"
              >
                {area}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Premium Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div 
          className="border-t border-white/10"
          style={{
            background: "linear-gradient(90deg, hsl(220 60% 8% / 0.95) 0%, hsl(220 55% 12% / 0.9) 50%, hsl(220 60% 8% / 0.95) 100%)",
            backdropFilter: "blur(20px)"
          }}
        >
          <div className="container-custom py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { value: "15+", label: "Years Excellence", icon: Crown },
                { value: "500+", label: "Properties Sold", icon: Home },
                { value: "$100M+", label: "In Sales Volume", icon: DollarSign },
                { value: "5.0★", label: "Client Rating", icon: Star },
              ].map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center gap-4 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
                >
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ 
                      background: "linear-gradient(135deg, hsl(220 75% 55% / 0.2) 0%, hsl(220 60% 35% / 0.15) 100%)",
                      border: "1px solid hsl(220 75% 55% / 0.2)"
                    }}
                  >
                    <stat.icon className="w-6 h-6 text-royal-light" />
                  </div>
                  <div>
                    <p className="font-serif text-2xl md:text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-xs md:text-sm text-white/50 mt-0.5">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-40 left-1/2 -translate-x-1/2 z-10 hidden lg:flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-white/30 text-xs uppercase tracking-widest">Scroll to explore</span>
        <motion.div 
          className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div 
            className="w-1 h-2 rounded-full bg-royal-light"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
