import { Link } from "react-router-dom";
import { ArrowRight, Phone, Home, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/siteConfig";

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-primary" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Buy or Sell
            <span className="block text-gradient-gold">Your Houston Home?</span>
          </h2>
          <p className="text-xl text-primary-foreground/70 mb-8 max-w-2xl mx-auto">
            Join 500+ families who trusted Mike Ogunkeye to guide them through buying or selling their home. Free consultation, no obligation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            {["Free home valuation", "No obligation", "Response in 24hrs"].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-primary-foreground/80">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10 max-w-2xl mx-auto">
            <Link 
              to="/listings"
              className="group p-6 rounded-2xl bg-primary-foreground/10 hover:bg-primary-foreground/15 transition-colors text-left"
            >
              <Home className="h-8 w-8 text-accent mb-4" />
              <h3 className="font-semibold text-lg text-primary-foreground mb-2">
                I Want to Buy a Home
              </h3>
              <p className="text-primary-foreground/60 text-sm mb-4">
                Browse homes for sale in Houston, Sugar Land, Katy & more
              </p>
              <span className="text-accent text-sm font-medium group-hover:underline">
                Search Homes →
              </span>
            </Link>
            
            <Link 
              to="/home-valuation"
              className="group p-6 rounded-2xl bg-primary-foreground/10 hover:bg-primary-foreground/15 transition-colors text-left"
            >
              <TrendingUp className="h-8 w-8 text-accent mb-4" />
              <h3 className="font-semibold text-lg text-primary-foreground mb-2">
                I Want to Sell My Home
              </h3>
              <p className="text-primary-foreground/60 text-sm mb-4">
                Get a free valuation and sell for top dollar
              </p>
              <span className="text-accent text-sm font-medium group-hover:underline">
                Get Free Valuation →
              </span>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact">
              <Button variant="gold" size="xl" className="min-w-[200px]">
                Schedule FREE Consultation
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href={`tel:${siteConfig.phoneRaw}`}>
              <Button variant="heroOutline" size="xl" className="min-w-[200px]">
                <Phone className="h-5 w-5" />
                Call {siteConfig.phone}
              </Button>
            </a>
          </div>

          <p className="mt-8 text-primary-foreground/50 text-sm">
            ⭐ 5-star rated • 500+ homes sold • Serving all of Greater Houston
          </p>
        </div>
      </div>
    </section>
  );
}
