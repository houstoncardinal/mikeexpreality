import { Link } from "react-router-dom";
import { ArrowRight, Home, TrendingUp, FileText, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Home,
    title: "Home Search",
    description: "Find your dream home with our comprehensive property search across Houston and surrounding areas.",
    href: "/listings",
    cta: "Search Homes",
  },
  {
    icon: TrendingUp,
    title: "Home Valuation",
    description: "Get an instant property valuation and expert advice to sell for more.",
    href: "/seller-resources",
    cta: "Get Your Value",
  },
  {
    icon: FileText,
    title: "Buyer Resources",
    description: "Everything you need to know about buying a home in the Houston market.",
    href: "/buyer-resources",
    cta: "Learn More",
  },
  {
    icon: Calculator,
    title: "Seller Resources",
    description: "Proven marketing strategies and expert guidance to maximize your home's value.",
    href: "/seller-resources",
    cta: "Selling Guide",
  },
];

export function ServicesSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-accent font-medium tracking-wider uppercase mb-2">
            Focused on What Matters to You
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Full-Service Real Estate
            <span className="block text-muted-foreground">Excellence</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            We believe that exceptional service begins with being accessible, listening closely, and responding quickly to your needs.
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
