import { Link } from "react-router-dom";
import { ArrowRight, Home, TrendingUp, FileText, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Home,
    title: "Buy a Home",
    description: "Expert guidance through every step of the home buying process in Houston.",
    href: "/buyer-resources",
    cta: "Start Your Search",
  },
  {
    icon: TrendingUp,
    title: "Sell Your Home",
    description: "Maximum value for your property with our proven marketing strategies.",
    href: "/seller-resources",
    cta: "Get Your Value",
  },
  {
    icon: FileText,
    title: "Market Reports",
    description: "Stay informed with our comprehensive Houston real estate market analysis.",
    href: "/blog",
    cta: "View Reports",
  },
  {
    icon: Calculator,
    title: "Investment Analysis",
    description: "Data-driven insights for smart real estate investment decisions.",
    href: "/contact",
    cta: "Learn More",
  },
];

export function ServicesSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-accent font-medium tracking-wider uppercase mb-2">
            How We Help
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Full-Service Real Estate
            <span className="block text-muted-foreground">Excellence</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Whether you're buying, selling, or investing, our team delivers exceptional results.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-card transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                <service.icon className="h-7 w-7 text-accent group-hover:text-accent-foreground transition-colors" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {service.description}
              </p>

              {/* CTA */}
              <Link to={service.href}>
                <Button variant="link" className="p-0 h-auto text-accent group/btn">
                  {service.cta}
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
