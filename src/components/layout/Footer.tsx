import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  explore: [
    { name: "Featured Listings", href: "/listings" },
    { name: "Neighborhoods", href: "/neighborhoods" },
    { name: "Market Reports", href: "/blog" },
    { name: "Home Valuation", href: "/seller-resources" },
  ],
  resources: [
    { name: "Buyer's Guide", href: "/buyer-resources" },
    { name: "Seller's Guide", href: "/seller-resources" },
    { name: "Mortgage Calculator", href: "/buyer-resources" },
    { name: "Blog", href: "/blog" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Team", href: "/about" },
    { name: "Testimonials", href: "/about#testimonials" },
    { name: "Contact", href: "/contact" },
  ],
  neighborhoods: [
    { name: "Houston", href: "/neighborhoods" },
    { name: "Sugar Land", href: "/neighborhoods" },
    { name: "Katy", href: "/neighborhoods" },
    { name: "Cypress", href: "/neighborhoods" },
    { name: "Richmond", href: "/neighborhoods" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container-custom py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-serif text-3xl font-bold mb-4">
              Stay Ahead of the Market
            </h3>
            <p className="text-primary-foreground/70 mb-8">
              Get exclusive listings, market insights, and expert tips delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-accent"
              />
              <Button variant="gold" size="lg" type="submit">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <span className="font-serif text-2xl font-bold">HOUSTON ELITE</span>
              <span className="block text-xs tracking-[0.3em] text-primary-foreground/60">
                REAL ESTATE
              </span>
            </Link>
            <p className="text-primary-foreground/70 mb-6 max-w-sm">
              Houston's premier luxury real estate agency. We're dedicated to helping you find your dream home in the greater Houston area.
            </p>
            <div className="space-y-3">
              <a
                href="tel:+17135551234"
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors"
              >
                <Phone className="h-4 w-4" />
                (713) 555-1234
              </a>
              <a
                href="mailto:info@houstonelite.com"
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors"
              >
                <Mail className="h-4 w-4" />
                info@houstonelite.com
              </a>
              <div className="flex items-start gap-3 text-primary-foreground/70">
                <MapPin className="h-4 w-4 mt-1 shrink-0" />
                <span>
                  1234 Main Street, Suite 500<br />
                  Houston, TX 77002
                </span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm tracking-wide uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm tracking-wide uppercase mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm tracking-wide uppercase mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm tracking-wide uppercase mb-4">
              Neighborhoods
            </h4>
            <ul className="space-y-3">
              {footerLinks.neighborhoods.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4 mt-12 pt-8 border-t border-primary-foreground/10">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              className="p-2 rounded-full bg-primary-foreground/10 text-primary-foreground/70 hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label={social.name}
            >
              <social.icon className="h-5 w-5" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 pt-8 border-t border-primary-foreground/10">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} Houston Elite Real Estate. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <Link to="/privacy" className="text-primary-foreground/50 hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-primary-foreground/50 hover:text-accent transition-colors">
              Terms of Service
            </Link>
            <Link to="/accessibility" className="text-primary-foreground/50 hover:text-accent transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
