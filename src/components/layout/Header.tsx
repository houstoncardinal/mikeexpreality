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
  Briefcase,
  Star,
  ArrowRight,
  Sparkles,
  Crown,
  Shield,
  Clock,
  Award,
  BadgeCheck,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig, neighborhoods } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
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
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled || !isHomePage
          ? "bg-background/98 backdrop-blur-xl shadow-lg border-b border-border/50"
          : "bg-transparent"
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className={cn(
                "absolute -inset-2 rounded-xl blur-xl transition-opacity duration-500",
                isScrolled || !isHomePage 
                  ? "bg-accent/20 opacity-0 group-hover:opacity-100" 
                  : "bg-primary-foreground/10 opacity-0 group-hover:opacity-100"
              )} />
              <div className={cn(
                "relative w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300",
                isScrolled || !isHomePage
                  ? "bg-gradient-to-br from-accent to-accent/80 border-accent/30"
                  : "bg-primary-foreground/10 border-primary-foreground/20 backdrop-blur-sm"
              )}>
                <span className={cn(
                  "font-serif text-xl font-bold",
                  isScrolled || !isHomePage ? "text-accent-foreground" : "text-primary-foreground"
                )}>
                  M
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span
                className={cn(
                  "font-serif text-lg md:text-xl font-bold tracking-tight transition-colors",
                  isScrolled || !isHomePage ? "text-foreground" : "text-primary-foreground"
                )}
              >
                {siteConfig.agent.name}
              </span>
              <span
                className={cn(
                  "text-[10px] md:text-xs tracking-[0.2em] uppercase transition-colors",
                  isScrolled || !isHomePage ? "text-muted-foreground" : "text-primary-foreground/70"
                )}
              >
                {siteConfig.brokerage}
              </span>
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
                      "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                      openDropdown === item.name 
                        ? isScrolled || !isHomePage
                          ? "text-accent bg-accent/10"
                          : "text-primary-foreground bg-primary-foreground/10"
                        : isScrolled || !isHomePage
                          ? "text-foreground hover:text-accent hover:bg-secondary/50"
                          : "text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
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
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                      location.pathname === item.href
                        ? "text-accent bg-accent/10"
                        : isScrolled || !isHomePage
                          ? "text-foreground hover:text-accent hover:bg-secondary/50"
                          : "text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
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
                        "bg-card/98 backdrop-blur-2xl rounded-2xl shadow-2xl border border-border/50 overflow-hidden",
                        item.name === "Neighborhoods" ? "w-[800px]" : "w-[380px]"
                      )}>
                        {/* Header Banner */}
                        <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-transparent px-6 py-4 border-b border-border/50">
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
                        <div className="p-4">
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
                        <div className="bg-secondary/30 px-6 py-3 border-t border-border/50">
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
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                isScrolled || !isHomePage 
                  ? "text-foreground hover:bg-secondary/50" 
                  : "text-primary-foreground hover:bg-primary-foreground/10"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                isScrolled || !isHomePage 
                  ? "bg-accent/10" 
                  : "bg-primary-foreground/10"
              )}>
                <Phone className={cn(
                  "h-4 w-4",
                  isScrolled || !isHomePage ? "text-accent" : "text-primary-foreground"
                )} />
              </div>
              <span className="hidden xl:block">{siteConfig.phone}</span>
            </a>
            <Link to="/contact">
              <Button 
                variant={isScrolled || !isHomePage ? "royal" : "premium"} 
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
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors",
              isScrolled || !isHomePage ? "hover:bg-secondary" : "hover:bg-primary-foreground/10"
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X
                className={cn(
                  "h-6 w-6",
                  isScrolled || !isHomePage ? "text-foreground" : "text-primary-foreground"
                )}
              />
            ) : (
              <Menu
                className={cn(
                  "h-6 w-6",
                  isScrolled || !isHomePage ? "text-foreground" : "text-primary-foreground"
                )}
              />
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
              className="lg:hidden overflow-hidden bg-card rounded-b-2xl border-t border-border/50"
            >
              <div className="p-4 max-h-[70vh] overflow-y-auto">
                {/* Trust badges mobile */}
                <div className="flex items-center justify-center gap-4 py-3 mb-4 border-b border-border/50">
                  {trustBadges.map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <badge.icon className="h-3.5 w-3.5 text-accent" />
                      <span>{badge.label}</span>
                    </div>
                  ))}
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
    </header>
  );
}
