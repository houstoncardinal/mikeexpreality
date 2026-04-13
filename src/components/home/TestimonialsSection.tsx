import { Star, Quote } from "lucide-react";
import { testimonials, siteConfig } from "@/lib/siteConfig";

export function TestimonialsSection() {
  const displayTestimonials = testimonials.slice(0, 3);

  return (
    <section className="py-20 md:py-28 bg-secondary/50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-accent font-medium tracking-widest uppercase mb-3 text-xs">
            Client Reviews
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            What Our Clients Say
          </h2>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {displayTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative p-8 rounded-2xl bg-card border border-border/50"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-accent/10" />

              <div className="flex items-center gap-0.5 mb-5">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-foreground/80 leading-relaxed mb-6 text-sm">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-3 pt-5 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="font-serif text-sm font-bold text-accent">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.type}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
