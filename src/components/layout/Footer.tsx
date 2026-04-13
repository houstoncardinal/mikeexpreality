import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

const footerLinks = {
  explore: [
    { name: "Browse Listings", href: "/listings" },
    { name: "Neighborhoods", href: "/neighborhoods" },
    { name: "MLS Search", href: "/mls-search" },
    { name: "Success Stories", href: "/success-stories" },
    { name: "Blog", href: "/blog" },
  ],
  resources: [
    { name: "Buyer Resources", href: "/buyer-resources" },
    { name: "Seller Resources", href: "/seller-resources" },
    { name: "Home Valuation", href: "/home-valuation" },
    { name: "Mortgage Calculator", href: "/mortgage-calculator" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container-custom py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-5">
              <span className="font-serif text-xl font-bold">{siteConfig.agent.name}</span>
              <span className="block text-[10px] tracking-[0.2em] text-primary-foreground/50 uppercase mt-1">
                {siteConfig.brokerage}
              </span>
            </Link>
            <div className="space-y-2.5 text-sm text-primary-foreground/60">
              <a
                href={`tel:${siteConfig.phoneRaw}`}
                className="flex items-center gap-2.5 hover:text-primary-foreground transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                {siteConfig.phone}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2.5 hover:text-primary-foreground transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                {siteConfig.email}
              </a>
              <div className="flex items-start gap-2.5">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>
                  {siteConfig.address.street}, {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}
                </span>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Instagram, href: siteConfig.social.instagram, label: "Instagram" },
                { icon: Facebook, href: siteConfig.social.facebook, label: "Facebook" },
                { icon: Linkedin, href: siteConfig.social.linkedin, label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-primary-foreground/8 flex items-center justify-center text-primary-foreground/50 hover:text-primary-foreground hover:bg-primary-foreground/15 transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-xs tracking-widest uppercase mb-5 text-primary-foreground/80">
              Explore
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-xs tracking-widest uppercase mb-5 text-primary-foreground/80">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="font-semibold text-xs tracking-widest uppercase mb-5 text-primary-foreground/80">
              Service Areas
            </h4>
            <ul className="space-y-2.5">
              {siteConfig.serviceAreas.slice(0, 8).map((area) => (
                <li key={area}>
                  <Link
                    to={`/neighborhoods/${area.toLowerCase().replace(' ', '-')}`}
                    className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors"
                  >
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/40">
            <div className="flex items-center gap-4">
              <img 
                src="/imgi_34_realtor-eho-logo-07232021-update-light.webp" 
                alt="Equal Housing Opportunity" 
                className="h-7 w-auto opacity-50"
                loading="lazy"
              />
              <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/privacy-policy" className="hover:text-primary-foreground/70 transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-primary-foreground/70 transition-colors">
                Terms
              </Link>
              <span>{siteConfig.agent.license}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
