import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-primary" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Find Your
            <span className="block text-gradient-gold">Dream Home?</span>
          </h2>
          <p className="text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto">
            Let's discuss your real estate goals. Our team of experts is ready to guide you every step of the way.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact">
              <Button variant="gold" size="xl" className="min-w-[200px]">
                Schedule Consultation
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="tel:+17135551234">
              <Button variant="heroOutline" size="xl" className="min-w-[200px]">
                <Phone className="h-5 w-5" />
                (713) 555-1234
              </Button>
            </a>
          </div>

          <p className="mt-8 text-primary-foreground/50 text-sm">
            Free, no-obligation consultation • Response within 24 hours
          </p>
        </div>
      </div>
    </section>
  );
}
