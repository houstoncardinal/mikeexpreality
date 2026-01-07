import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  Home,
  Building2,
  MapPin,
  Users,
  FileText,
  BookOpen,
  Mail,
  TrendingUp,
  DollarSign,
  Calculator,
  Briefcase,
  Star,
  ArrowRight,
  Sparkles,
  Crown,
  Shield,
  Clock,
  Award,
  BadgeCheck,
  Heart,
  Facebook,
  Instagram,
  Linkedin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig, neighborhoods } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface NavChild {
  name: string;
  href: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  featured?: boolean;
}

interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  children?: NavChild[];
  megaMenu?: boolean;
}

const navigation: NavItem[] = [
  { 
    name: "Home", 
    href: "/",
    icon: Home,
    description: "Welcome to luxury living"
  },
  { 
    name: "About", 
    href: "/about",
    icon: Users,
    description: "Meet Mike Ogunkeye"
  },
  { 
    name: "Portfolio", 
    href: "/listings",
    icon: Building2,
    description: "Explore our exclusive listings"
  },
  {
    name: "Neighborhoods",
    href: "/neighborhoods",
    icon: MapPin,
    megaMenu: true,
    children: neighborhoods.map((n) => ({
      name: n.name,
      href: `/neighborhoods/${n.slug}`,
      description: n.description,
      icon: MapPin,
    })),
  },
  {
    name: "Resources",
    href: "#",
    icon: FileText,
    megaMenu: true,
    children: [
      { 
        name: "Buyer Resources", 
        href: "/buyer-resources",
        description: "Expert guidance for your home purchase journey",
        icon: Home,
        featured: true
      },
      { 
        name: "Seller Resources", 
        href: "/seller-resources",
        description: "Maximize your home's value with proven strategies",
        icon: TrendingUp,
        featured: true
      },
      { 
        name: "Home Valuation", 
        href: "/home-valuation",
        description: "Get a free, accurate estimate of your property",
        icon: DollarSign,
        featured: true
      },
      { 
        name: "Mortgage Calculator", 
        href: "/mortgage-calculator",
        description: "Advanced calculator with rate scenarios & compliance",
        icon: Calculator,
        featured: true
      },
    ],
  },
  { 
    name: "Blog", 
    href: "/blog",
    icon: BookOpen,
    description: "Insights & market updates"
  },
  { 
    name: "Contact", 
    href: "/contact",
    icon: Mail,
    description: "Let's start your journey"
  },
];

const trustBadges = [
  { icon: Crown, label: "Top 1% Realtor" },
  { icon: Shield, label: "Licensed & Insured" },
  { icon: Award, label: "500+ Happy Clients" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
      // Calculate scroll progress for glass effect (0 to 1, maxes at 300px scroll)
      setScrollProgress(Math.min(scrollY / 300, 1));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    setMobileOpenDropdown(null);
  }, [location]);

  const handleMouseEnter = (itemName: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(itemName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const isHomePage = location.pathname === "/";

  return (
    <>
      {/* Top Bar - fades out on scroll */}
      <motion.div 
        className="fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white border-b border-slate-800"
        style={{
          opacity: 1 - scrollProgress * 0.5,
          y: -scrollProgress * 40,
        }}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-10 text-xs">
            {/* Left: Contact Info */}
            <div className="hidden md:flex items-center gap-6">
              <a
                href={`tel:${siteConfig.phoneRaw}`}
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>{siteConfig.phone}</span>
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>{siteConfig.email}</span>
              </a>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="h-3.5 w-3.5" />
                <span>Mon-Fri: {siteConfig.hours.weekdays}</span>
              </div>
            </div>

            {/* Right: Social Links, Language & Trust Badge */}
            <div className="flex items-center gap-4 ml-auto">
              <div className="hidden lg:flex items-center gap-2 text-slate-300">
                <Crown className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-medium">Top 1% Houston Realtor</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <div className="h-4 w-px bg-slate-600" />
                <LanguageSwitcher variant="topbar" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Header with Glass Morphism */}
      <motion.header 
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-500 will-change-transform",
          isScrolled ? "shadow-xl" : ""
        )}
        style={{
          top: `${Math.max(40 - scrollProgress * 40, 0)}px`,
          backgroundColor: `rgba(255, 255, 255, ${0.85 + scrollProgress * 0.15})`,
          backdropFilter: `blur(${8 + scrollProgress * 16}px) saturate(${1.2 + scrollProgress * 0.6})`,
          WebkitBackdropFilter: `blur(${8 + scrollProgress * 16}px) saturate(${1.2 + scrollProgress * 0.6})`,
          borderBottom: `1px solid rgba(0, 0, 0, ${0.05 + scrollProgress * 0.05})`,
          boxShadow: scrollProgress > 0.3 
            ? `0 4px 30px rgba(0, 0, 0, ${scrollProgress * 0.08}), 0 1px 3px rgba(0, 0, 0, ${scrollProgress * 0.05})`
            : 'none',
        }}
      >
        <div className="container-custom">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <div className="absolute -inset-2 rounded-xl bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src="/logo-primary.jpeg" 
                alt="M.O.R.E. - Mike Ogunkeye Real Estate"
                className="relative h-16 md:h-20 w-auto object-contain transition-all duration-300 rounded-lg"
                style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div 
                key={item.name} 
                className="relative"
                onMouseEnter={() => item.children && handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
              >
                {item.children ? (
                  <button
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300",
                      openDropdown === item.name
                        ? "text-accent bg-accent/10"
                        : "text-slate-700 hover:text-accent hover:bg-gray-50"
                    )}
                  >
                    {item.name}
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform duration-300",
                      openDropdown === item.name && "rotate-180"
                    )} />
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300",
                      location.pathname === item.href
                        ? "text-accent bg-accent/10"
                        : "text-slate-700 hover:text-accent hover:bg-gray-50"
                    )}
                  >
                    {item.name}
                  </Link>
                )}

                {/* Mega Menu Dropdown */}
                <AnimatePresence>
                  {item.children && openDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={cn(
                        "absolute top-full pt-4",
                        item.name === "Neighborhoods" 
                          ? "left-1/2 -translate-x-1/2" 
                          : "left-0"
                      )}
                      onMouseEnter={() => handleMouseEnter(item.name)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className={cn(
                        "bg-white backdrop-blur-3xl rounded-2xl shadow-2xl border border-border/30 overflow-hidden",
                        item.name === "Neighborhoods" ? "w-[800px]" : "w-[380px]"
                      )}>
                        {/* Header Banner */}
                        <div className="bg-white px-6 py-4 border-b border-gray-200/80">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {item.icon && <item.icon className="h-5 w-5 text-accent" />}
                              <div>
                                <h3 className="font-serif text-lg font-semibold text-foreground">
                                  {item.name}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  {item.name === "Neighborhoods" 
                                    ? "Explore Houston's finest communities"
                                    : "Expert resources for your journey"
                                  }
                                </p>
                              </div>
                            </div>
                            <Link
                              to={item.href !== "#" ? item.href : "/"}
                              className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors font-medium"
                            >
                              View All
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>

                        {/* Menu Content */}
                        <div className="p-4 bg-white">
                          {item.name === "Neighborhoods" ? (
                            <div className="grid grid-cols-4 gap-2">
                              {item.children.map((child, idx) => (
                                <Link
                                  key={child.name}
                                  to={child.href}
                                  className="group/item flex flex-col p-3 rounded-xl hover:bg-secondary/50 transition-all duration-300"
                                >
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover/item:bg-accent/20 transition-colors">
                                      <MapPin className="h-4 w-4 text-accent" />
                                    </div>
                                    <span className="font-medium text-sm text-foreground group-hover/item:text-accent transition-colors">
                                      {child.name}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed pl-10">
                                    {child.description}
                                  </p>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {item.children.map((child) => (
                                <Link
                                  key={child.name}
                                  to={child.href}
                                  className="group/item flex items-start gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-all duration-300"
                                >
                                  <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
                                    child.featured 
                                      ? "bg-gradient-to-br from-accent to-accent/80 group-hover/item:shadow-lg group-hover/item:shadow-accent/25" 
                                      : "bg-secondary group-hover/item:bg-accent/10"
                                  )}>
                                    {child.icon && (
                                      <child.icon className={cn(
                                        "h-5 w-5 transition-colors",
                                        child.featured ? "text-accent-foreground" : "text-accent"
                                      )} />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-sm text-foreground group-hover/item:text-accent transition-colors">
                                        {child.name}
                                      </span>
                                      {child.featured && (
                                        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-medium">
                                          Popular
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                      {child.description}
                                    </p>
                                  </div>
                                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover/item:text-accent group-hover/item:translate-x-1 transition-all shrink-0 mt-1" />
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Footer with trust badges */}
                        <div className="bg-gray-50/50 px-6 py-3 border-t border-gray-200/80">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {trustBadges.slice(0, 2).map((badge, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <badge.icon className="h-3.5 w-3.5 text-accent" />
                                  <span>{badge.label}</span>
                                </div>
                              ))}
                            </div>
                            <a 
                              href={`tel:${siteConfig.phoneRaw}`}
                              className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
                            >
                              <Phone className="h-3.5 w-3.5" />
                              {siteConfig.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher variant="header" />
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Phone className="h-4 w-4 text-accent" />
              </div>
              <span className="hidden xl:block">{siteConfig.phone}</span>
            </a>
            <Link to="/contact">
              <Button
                variant="royal"
                size="lg"
                className="gap-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                <Sparkles className="h-4 w-4" />
                Let's Connect
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-slate-700" />
            ) : (
              <Menu className="h-6 w-6 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden bg-white rounded-b-2xl border-t border-gray-200"
            >
              <div className="p-4 max-h-[70vh] overflow-y-auto">
                {/* Language Switcher & Trust badges mobile */}
                <div className="flex items-center justify-between py-3 mb-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    {trustBadges.slice(0, 2).map((badge, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <badge.icon className="h-3.5 w-3.5 text-accent" />
                        <span>{badge.label}</span>
                      </div>
                    ))}
                  </div>
                  <LanguageSwitcher variant="mobile" />
                </div>

                <nav className="flex flex-col gap-1">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      {item.children ? (
                        <>
                          <button
                            onClick={() =>
                              setMobileOpenDropdown(
                                mobileOpenDropdown === item.name ? null : item.name
                              )
                            }
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-base font-medium transition-colors",
                              mobileOpenDropdown === item.name 
                                ? "bg-accent/10 text-accent" 
                                : "text-foreground hover:bg-secondary/50"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              {item.icon && <item.icon className="h-5 w-5 text-accent" />}
                              {item.name}
                            </div>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform duration-300",
                                mobileOpenDropdown === item.name && "rotate-180"
                              )}
                            />
                          </button>
                          <AnimatePresence>
                            {mobileOpenDropdown === item.name && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="py-2 pl-4 pr-2 space-y-1">
                                  {item.children.map((child) => (
                                    <Link
                                      key={child.name}
                                      to={child.href}
                                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                                    >
                                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                                        {child.icon ? (
                                          <child.icon className="h-4 w-4 text-accent" />
                                        ) : (
                                          <MapPin className="h-4 w-4 text-accent" />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <span className="block text-sm font-medium text-foreground">
                                          {child.name}
                                        </span>
                                        {child.description && (
                                          <span className="block text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                            {child.description}
                                          </span>
                                        )}
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          to={item.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-colors",
                            location.pathname === item.href
                              ? "text-accent bg-accent/10"
                              : "text-foreground hover:bg-secondary/50"
                          )}
                        >
                          {item.icon && <item.icon className="h-5 w-5 text-accent" />}
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>

                <div className="mt-6 pt-4 border-t border-border/50 space-y-3">
                  <a
                    href={`tel:${siteConfig.phoneRaw}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/30 text-foreground"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <span className="block text-sm font-medium">{siteConfig.phone}</span>
                      <span className="block text-xs text-muted-foreground">Tap to call</span>
                    </div>
                  </a>
                  <Link to="/contact" className="block">
                    <Button variant="royal" size="lg" className="w-full gap-2">
                      <Sparkles className="h-4 w-4" />
                      Let's Connect
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
}
