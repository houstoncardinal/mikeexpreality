import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Portfolio", href: "/listings" },
  {
    name: "Neighborhoods",
    href: "/neighborhoods",
    children: [
      { name: "Sugar Land", href: "/neighborhoods/sugar-land" },
      { name: "Katy", href: "/neighborhoods/katy" },
      { name: "Richmond", href: "/neighborhoods/richmond" },
      { name: "Missouri City", href: "/neighborhoods/missouri-city" },
      { name: "Cypress", href: "/neighborhoods/cypress" },
      { name: "Houston", href: "/neighborhoods/houston" },
      { name: "Rosenberg", href: "/neighborhoods/rosenberg" },
      { name: "Pearland", href: "/neighborhoods/pearland" },
    ],
  },
  {
    name: "Resources",
    href: "#",
    children: [
      { name: "Buyer Resources", href: "/buyer-resources" },
      { name: "Seller Resources", href: "/seller-resources" },
      { name: "Home Valuation", href: "/seller-resources" },
    ],
  },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

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
  }, [location]);

  const isHomePage = location.pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled || !isHomePage
          ? "bg-background/95 backdrop-blur-md shadow-card"
          : "bg-transparent"
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex flex-col">
              <span
                className={cn(
                  "font-serif text-xl md:text-2xl font-bold tracking-tight transition-colors",
                  isScrolled || !isHomePage ? "text-foreground" : "text-primary-foreground"
                )}
              >
                {siteConfig.agent.name}
              </span>
              <span
                className={cn(
                  "text-xs tracking-wider uppercase transition-colors",
                  isScrolled || !isHomePage ? "text-muted-foreground" : "text-primary-foreground/70"
                )}
              >
                {siteConfig.brokerage}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.children ? (
                  <button
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium transition-colors py-2",
                      isScrolled || !isHomePage
                        ? "text-foreground hover:text-accent"
                        : "text-primary-foreground hover:text-primary-foreground/80"
                    )}
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {item.name}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors py-2",
                      location.pathname === item.href
                        ? "text-accent"
                        : isScrolled || !isHomePage
                        ? "text-foreground hover:text-accent"
                        : "text-primary-foreground hover:text-primary-foreground/80"
                    )}
                  >
                    {item.name}
                  </Link>
                )}

                {/* Dropdown */}
                {item.children && (
                  <div
                    className={cn(
                      "absolute top-full left-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border overflow-hidden transition-all duration-200",
                      openDropdown === item.name
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2"
                    )}
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.href}
                        className="block px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors",
                isScrolled || !isHomePage ? "text-foreground" : "text-primary-foreground"
              )}
            >
              <Phone className="h-4 w-4" />
              {siteConfig.phone}
            </a>
            <Link to="/contact">
              <Button variant={isScrolled || !isHomePage ? "gold" : "hero"} size="lg">
                Let's Connect
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
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
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 bg-card",
            isMobileMenuOpen ? "max-h-[600px] pb-6" : "max-h-0"
          )}
        >
          <nav className="flex flex-col gap-2 pt-4">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <>
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === item.name ? null : item.name
                        )
                      }
                      className="flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-lg transition-colors text-foreground hover:bg-secondary"
                    >
                      {item.name}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openDropdown === item.name && "rotate-180"
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-200",
                        openDropdown === item.name ? "max-h-96" : "max-h-0"
                      )}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className="block px-8 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "block px-4 py-3 text-base font-medium rounded-lg transition-colors",
                      location.pathname === item.href
                        ? "text-accent bg-accent/10"
                        : "text-foreground hover:bg-secondary"
                    )}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="px-4 pt-4 space-y-3">
              <a
                href={`tel:${siteConfig.phoneRaw}`}
                className="flex items-center gap-2 text-foreground"
              >
                <Phone className="h-5 w-5 text-accent" />
                {siteConfig.phone}
              </a>
              <Link to="/contact" className="block">
                <Button variant="gold" size="lg" className="w-full">
                  Let's Connect
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
