import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/siteConfig";

export function CTASection() {
  return (
    <section className="py-24 md:py-32 bg-primary">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
            Ready to Make Your Move?
          </h2>
          <p className="text-lg text-primary-foreground/60 mb-10 max-w-xl mx-auto">
            Whether buying or selling, get expert guidance from a top Houston realtor. Free consultation, no obligation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact">
              <Button size="lg" className="h-14 px-8 bg-white text-foreground hover:bg-white/90 font-semibold text-base">
                Schedule Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href={`tel:${siteConfig.phoneRaw}`}>
              <Button variant="outline" size="lg" className="h-14 px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground text-base">
                <Phone className="mr-2 h-5 w-5" />
                {siteConfig.phone}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
