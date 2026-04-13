import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  MapPin,
  ArrowRight,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig, neighborhoods } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

interface NavChild {
  name: string;
  href: string;
  description?: string;
}

interface NavItem {
  name: string;
  href: string;
  children?: NavChild[];
}

const navigation: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Listings", href: "/listings" },
  {
    name: "Neighborhoods",
    href: "/neighborhoods",
    children: neighborhoods.map((n) => ({
      name: n.name,
      href: `/neighborhoods/${n.slug}`,
      description: n.description,
    })),
  },
  {
    name: "Resources",
    href: "#",
    children: [
      { name: "Buyer Resources", href: "/buyer-resources", description: "Home buying guidance" },
      { name: "Seller Resources", href: "/seller-resources", description: "Selling strategies" },
      { name: "Home Valuation", href: "/home-valuation", description: "Free property estimate" },
      { name: "Mortgage Calculator", href: "/mortgage-calculator", description: "Payment calculator" },
      { name: "MLS Search", href: "/mls-search", description: "Search all listings" },
      { name: "Success Stories", href: "/success-stories", description: "Client testimonials" },
    ],
  },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    setMobileOpenDropdown(null);
  }, [location]);

  const handleMouseEnter = (itemName: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(itemName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b",
        isScrolled ? "shadow-md border-border" : "border-transparent"
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img 
              src="/logo-primary.jpeg" 
              alt={siteConfig.name}
              className="h-12 lg:h-14 w-auto object-contain rounded-lg"
            />
          </Link>

          {/* Desktop Nav */}
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
                      "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      openDropdown === item.name
                        ? "text-accent"
                        : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    {item.name}
                    <ChevronDown className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      openDropdown === item.name && "rotate-180"
                    )} />
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      location.pathname === item.href
                        ? "text-accent"
                        : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                )}

                {/* Dropdown */}
                <AnimatePresence>
                  {item.children && openDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className={cn(
                        "absolute top-full pt-2",
                        item.name === "Neighborhoods" ? "left-1/2 -translate-x-1/2" : "left-0"
                      )}
                      onMouseEnter={() => handleMouseEnter(item.name)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className={cn(
                        "bg-white rounded-xl shadow-xl border border-border/50 overflow-hidden",
                        item.name === "Neighborhoods" ? "w-[560px]" : "w-[280px]"
                      )}>
                        <div className={cn(
                          "p-2",
                          item.name === "Neighborhoods" ? "grid grid-cols-3 gap-0.5" : "space-y-0.5"
                        )}>
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.href}
                              className="group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
                            >
                              {item.name === "Neighborhoods" && (
                                <MapPin className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                              )}
                              <div className="min-w-0">
                                <span className="block text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                                  {child.name}
                                </span>
                                {child.description && item.name !== "Neighborhoods" && (
                                  <span className="block text-xs text-muted-foreground mt-0.5">
                                    {child.description}
                                  </span>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {user ? (
              <Link
                to="/client-portal"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="hidden xl:block">Portal</span>
              </Link>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="hidden xl:block">Login</span>
              </Link>
            )}
            
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              <Phone className="h-4 w-4" />
              {siteConfig.phone}
            </a>

            <Link to="/contact">
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium px-5">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-accent"
              aria-label="Call us"
            >
              <Phone className="h-5 w-5" />
            </a>
            <button
              className="w-10 h-10 rounded-lg flex items-center justify-center text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden bg-white border-t border-border"
          >
            <div className="p-4 max-h-[75vh] overflow-y-auto">
              <nav className="space-y-1">
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
                            "flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                            mobileOpenDropdown === item.name 
                              ? "text-accent bg-accent/5" 
                              : "text-foreground"
                          )}
                        >
                          {item.name}
                          <ChevronDown className={cn(
                            "h-4 w-4 transition-transform",
                            mobileOpenDropdown === item.name && "rotate-180"
                          )} />
                        </button>
                        <AnimatePresence>
                          {mobileOpenDropdown === item.name && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="py-1 pl-4 space-y-0.5">
                                {item.children.map((child) => (
                                  <Link
                                    key={child.name}
                                    to={child.href}
                                    className="block px-4 py-2.5 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:bg-secondary/50 transition-colors"
                                  >
                                    {child.name}
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
                          "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                          location.pathname === item.href
                            ? "text-accent bg-accent/5"
                            : "text-foreground"
                        )}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <Link to="/contact" className="block">
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
