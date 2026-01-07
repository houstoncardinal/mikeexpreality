import { Link } from "react-router-dom";
import { Search, MapPin, Home, DollarSign, ArrowRight, Crown, Star, Award, Shield, Users, Sparkles, Gem, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/siteConfig";
import heroImage from "@/assets/hero-home.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { SearchAutocomplete } from "@/components/search";

export function HeroSection() {
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const { scrollY } = useScroll();
  
  const backgroundY = useTransform(scrollY, [0, 1200], [0, 250]);
  const contentOpacity = useTransform(scrollY, [0, 600, 900], [1, 0.85, 0]);
  const contentY = useTransform(scrollY, [0, 800], [0, -80]);
  const contentScale = useTransform(scrollY, [0, 700], [1, 0.95]);

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
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-navy-dark">
      {/* Ultra Premium Background with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <motion.div 
          className="w-full h-[120%]"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 25, ease: "easeOut" }}
        >
          <img
            src={heroImage}
            alt="Luxury Houston estate with pristine landscaping"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Sophisticated multi-layer overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_150%_100%_at_top_left,_transparent_0%,_hsl(220_65%_4%/0.3)_40%,_hsl(220_65%_4%/0.95)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_80%_20%,_hsl(220_75%_35%/0.15)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/30 via-transparent to-navy-dark" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/90 via-navy-dark/40 to-transparent" />
        
        {/* Premium vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_300px_120px_rgba(0,0,0,0.5)]" />
      </motion.div>

      {/* Luxury Animated Elements */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {/* Ethereal glow orbs */}
        <motion.div 
          className="absolute w-[1200px] h-[1200px] rounded-full top-[-40%] right-[-30%]"
          style={{ 
            background: "radial-gradient(circle, hsl(220 80% 60% / 0.12) 0%, hsl(220 75% 50% / 0.05) 40%, transparent 70%)",
            filter: "blur(60px)"
          }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
            rotate: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute w-[800px] h-[800px] rounded-full bottom-[-20%] left-[-20%]"
          style={{ 
            background: "radial-gradient(circle, hsl(220 70% 50% / 0.1) 0%, hsl(220 60% 40% / 0.05) 50%, transparent 70%)",
            filter: "blur(40px)"
          }}
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, -20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        
        {/* Golden accent glow */}
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full top-[20%] left-[30%]"
          style={{ 
            background: "radial-gradient(circle, hsl(45 80% 55% / 0.08) 0%, transparent 60%)",
            filter: "blur(80px)"
          }}
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        {/* Floating diamond particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -150 - Math.random() * 100, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-2 h-2 text-royal-light/40" />
          </motion.div>
        ))}
        
        {/* Elegant diagonal lines */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 100px,
            hsl(220 75% 60%) 100px,
            hsl(220 75% 60%) 101px
          )`
        }} />
        
        {/* Premium grid overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `linear-gradient(hsl(220 75% 60%) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(220 75% 60%) 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Main Content with Parallax */}
      <motion.div 
        className="container-custom relative z-10 pt-32 pb-44"
        style={{ opacity: contentOpacity, y: contentY, scale: contentScale }}
      >
        <div className="max-w-5xl">
          {/* Ultra Premium Badge */}
          <motion.div 
            className="inline-flex items-center gap-4 px-8 py-4 mb-12"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            style={{
              background: "linear-gradient(135deg, hsl(45 70% 50% / 0.15) 0%, hsl(220 75% 55% / 0.15) 50%, hsl(220 60% 35% / 0.1) 100%)",
              backdropFilter: "blur(30px)",
              borderRadius: "100px",
              border: "1px solid hsl(45 60% 50% / 0.25)",
              boxShadow: "0 0 60px hsl(45 70% 50% / 0.1), 0 0 100px hsl(220 75% 55% / 0.1), inset 0 1px 0 hsl(0 0% 100% / 0.15)"
            }}
          >
            <motion.div 
              className="w-3 h-3 rounded-full"
              style={{ background: "linear-gradient(135deg, hsl(150 80% 50%) 0%, hsl(120 70% 45%) 100%)" }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-white/90 text-sm font-semibold tracking-[0.25em] uppercase">
              Houston's Elite Real Estate Specialists
            </span>
            <Gem className="w-5 h-5 text-amber-400/80" />
          </motion.div>

          {/* Cinematic Hero Headline */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
          >
            <h1 className="font-serif leading-[0.85] mb-10">
              {/* Animated accent line */}
              <motion.div 
                className="h-1 w-24 mb-8 rounded-full"
                style={{ background: "linear-gradient(90deg, hsl(45 80% 55%) 0%, hsl(220 75% 55%) 100%)" }}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 96, opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              />
              
              <motion.span 
                className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[8rem] font-bold tracking-tight"
                style={{ 
                  background: "linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(220 30% 90%) 40%, hsl(45 60% 85%) 70%, hsl(0 0% 100%) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 120px hsl(220 75% 55% / 0.4)",
                  filter: "drop-shadow(0 4px 40px rgba(0,0,0,0.4))"
                }}
                initial={{ opacity: 0, letterSpacing: "0.1em" }}
                animate={{ opacity: 1, letterSpacing: "-0.02em" }}
                transition={{ duration: 1.5, delay: 0.5 }}
              >
                {siteConfig.name}
              </motion.span>
              
              <motion.span 
                className="block mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-widest uppercase"
                style={{ 
                  background: "linear-gradient(90deg, hsl(220 40% 70%) 0%, hsl(0 0% 100%) 30%, hsl(45 50% 80%) 60%, hsl(220 40% 70%) 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ 
                  opacity: { duration: 1, delay: 0.7 },
                  y: { duration: 1, delay: 0.7 },
                  backgroundPosition: { duration: 8, repeat: Infinity, ease: "linear" }
                }}
              >
                Greater Houston
              </motion.span>
            </h1>
          </motion.div>
          
          {/* Premium Value Proposition */}
          <motion.p 
            className="text-xl md:text-2xl lg:text-3xl text-white/60 mb-14 max-w-3xl leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Where <span className="text-white font-medium">legacy meets luxury</span>. 
            Over 15 years delivering <span className="text-royal-light font-medium">unparalleled excellence</span> in 
            Houston's most <span className="text-amber-300/80 font-medium">prestigious neighborhoods</span>.
          </motion.p>

          {/* Luxury CTA Group */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <Button 
              size="lg" 
              className="group relative h-18 px-12 text-lg font-bold overflow-hidden rounded-2xl transition-all duration-700 hover:scale-105" 
              style={{
                background: "linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(45 40% 95%) 50%, hsl(0 0% 100%) 100%)",
                color: "hsl(220 60% 15%)",
                boxShadow: "0 15px 50px -15px rgba(0,0,0,0.4), 0 0 80px hsl(45 70% 55% / 0.15), 0 0 120px hsl(220 75% 55% / 0.1)"
              }}
              asChild
            >
              <Link to="/listings">
                <span className="relative z-10 flex items-center gap-4">
                  <span>Explore Properties</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-6 w-6" />
                  </motion.div>
                </span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-royal/20 via-amber-500/10 to-royal/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8 }}
                />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              className="group h-18 px-12 text-lg font-semibold rounded-2xl transition-all duration-500 hover:scale-105" 
              style={{
                background: "linear-gradient(135deg, hsl(220 75% 55% / 0.15) 0%, hsl(220 60% 45% / 0.1) 100%)",
                border: "2px solid hsl(220 75% 55% / 0.4)",
                color: "white",
                backdropFilter: "blur(20px)",
                boxShadow: "0 0 40px hsl(220 75% 55% / 0.1)"
              }}
              asChild
            >
              <Link to="/home-valuation" className="hover:border-royal-light/60">
                <Crown className="mr-3 h-6 w-6 text-amber-400" />
                Get Home Valuation
              </Link>
            </Button>
          </motion.div>

          {/* Premium Trust Indicators */}
          <motion.div 
            className="flex flex-wrap items-center gap-8 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            {[
              { icon: Shield, text: "Licensed & Insured", color: "text-emerald-400" },
              { icon: Award, text: "Top 1% Nationwide", color: "text-amber-400" },
              { icon: Users, text: "500+ Happy Clients", color: "text-royal-light" },
              { icon: TrendingUp, text: "$100M+ Volume", color: "text-cyan-400" },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className="flex items-center gap-3 group cursor-default"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="text-white/70 text-sm font-medium group-hover:text-white/90 transition-colors">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Ultra Premium Search Box */}
          <motion.div 
            className="relative max-w-4xl"
            initial={{ opacity: 0, y: 50, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            {/* Glow effect behind search box */}
            <div 
              className="absolute -inset-4 rounded-[2.5rem] opacity-50"
              style={{
                background: "linear-gradient(135deg, hsl(220 75% 55% / 0.2) 0%, hsl(45 70% 50% / 0.1) 50%, hsl(220 60% 45% / 0.2) 100%)",
                filter: "blur(40px)"
              }}
            />
            
            <div 
              className="relative p-10 md:p-12 rounded-[2rem]"
              style={{
                background: "linear-gradient(135deg, hsl(220 60% 10% / 0.85) 0%, hsl(220 55% 15% / 0.75) 50%, hsl(220 50% 12% / 0.8) 100%)",
                backdropFilter: "blur(60px)",
                border: "1px solid hsl(220 75% 55% / 0.25)",
                boxShadow: "0 40px 100px -30px rgba(0,0,0,0.6), inset 0 1px 0 hsl(0 0% 100% / 0.08), inset 0 -1px 0 hsl(220 50% 20% / 0.3)"
              }}
            >
              {/* Search header with luxury styling */}
              <div className="flex items-center gap-5 mb-10">
                <motion.div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ 
                    background: "linear-gradient(135deg, hsl(220 80% 60%) 0%, hsl(220 70% 45%) 100%)",
                    boxShadow: "0 10px 30px -10px hsl(220 75% 55% / 0.5)"
                  }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Search className="w-7 h-7 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-white font-bold text-2xl mb-1">Discover Your Dream Home</h3>
                  <p className="text-white/50 text-base">Curated luxury properties across Greater Houston</p>
                </div>
              </div>

              {/* Search Autocomplete */}
              <SearchAutocomplete 
                variant="hero"
                placeholder="Search properties, neighborhoods, or cities..."
              />

              {/* Premium quick filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                {[
                  { icon: MapPin, placeholder: "Select City", value: searchCity, onChange: setSearchCity, options: siteConfig.serviceAreas },
                  { icon: Home, placeholder: "Property Type", value: propertyType, onChange: setPropertyType, options: ["Single Family Home", "Condo", "Townhouse", "Land"] },
                  { icon: DollarSign, placeholder: "Price Range", value: priceRange, onChange: setPriceRange, options: ["Under $200K", "$200K - $300K", "$300K - $500K", "$500K - $750K", "$750K - $1M", "$1M+"] },
                ].map((field, i) => (
                  <div key={i} className="relative group">
                    <field.icon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-royal-light z-10 transition-colors group-hover:text-amber-400" />
                    <select 
                      className="w-full h-14 pl-14 pr-5 rounded-xl text-white border border-white/10 focus:border-royal/50 focus:ring-2 focus:ring-royal/30 appearance-none cursor-pointer font-semibold transition-all duration-300 hover:border-white/25 bg-white/5 backdrop-blur-sm text-sm"
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

              {/* Premium Search Button */}
              <motion.div className="mt-8" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  size="lg"
                  className="w-full h-16 text-lg font-bold rounded-xl transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, hsl(220 80% 60%) 0%, hsl(220 70% 50%) 50%, hsl(220 80% 55%) 100%)",
                    boxShadow: "0 15px 50px -15px hsl(220 75% 55% / 0.6), inset 0 1px 0 hsl(0 0% 100% / 0.2)"
                  }}
                  onClick={handleSearch}
                >
                  <Search className="h-6 w-6 mr-3" />
                  Search All Properties
                  <ArrowRight className="h-5 w-5 ml-3" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Search Tags */}
          <motion.div 
            className="flex flex-wrap items-center gap-4 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
          >
            <span className="text-white/30 text-sm font-semibold tracking-wide">Popular Areas:</span>
            {siteConfig.serviceAreas.slice(0, 5).map((area, i) => (
              <motion.button
                key={area}
                onClick={() => handleQuickSearch(area)}
                className="px-5 py-2.5 text-sm rounded-full text-white/50 hover:text-white transition-all duration-300 border border-white/10 hover:border-royal/50 hover:bg-royal/20 backdrop-blur-sm font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 + i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {area}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Ultra Premium Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div 
          className="border-t border-white/10"
          style={{
            background: "linear-gradient(90deg, hsl(220 60% 6% / 0.98) 0%, hsl(220 55% 10% / 0.95) 50%, hsl(220 60% 6% / 0.98) 100%)",
            backdropFilter: "blur(30px)"
          }}
        >
          <div className="container-custom py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
              {[
                { value: "15+", label: "Years Excellence", icon: Crown, color: "from-amber-500 to-amber-600" },
                { value: "500+", label: "Properties Sold", icon: Home, color: "from-royal to-royal-dark" },
                { value: "$100M+", label: "Sales Volume", icon: DollarSign, color: "from-emerald-500 to-emerald-600" },
                { value: "5.0★", label: "Client Rating", icon: Star, color: "from-cyan-400 to-cyan-500" },
              ].map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center gap-5 group cursor-default"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.8 + index * 0.15 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${stat.color} transition-all duration-500`}
                    style={{ 
                      boxShadow: "0 10px 30px -10px rgba(0,0,0,0.3)"
                    }}
                    whileHover={{ rotate: 10 }}
                  >
                    <stat.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <div>
                    <p className="font-serif text-3xl md:text-4xl font-bold text-white tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-sm md:text-base text-white/50 mt-1 font-medium">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Premium Scroll Indicator */}
      <motion.div 
        className="absolute bottom-44 left-1/2 -translate-x-1/2 z-10 hidden lg:flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <span className="text-white/25 text-xs uppercase tracking-[0.3em] font-medium">Scroll to explore</span>
        <motion.div 
          className="w-8 h-14 rounded-full border-2 border-white/20 flex items-start justify-center p-2.5"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div 
            className="w-1.5 h-3 rounded-full"
            style={{ background: "linear-gradient(to bottom, hsl(220 75% 60%), hsl(45 70% 55%))" }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
