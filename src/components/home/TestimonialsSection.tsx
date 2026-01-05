import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { testimonials, siteConfig } from "@/lib/siteConfig";

export function TestimonialsSection() {
  const averageRating = 5;
  const totalReviews = testimonials.length;
  const displayTestimonials = testimonials.slice(0, 3);

  return (
    <section className="section-padding bg-secondary">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-accent font-medium tracking-wider uppercase mb-2">
            Success Stories
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What Our Clients Say
            <span className="block text-muted-foreground">About Working With Us</span>
          </h2>
          
          {/* Aggregate Rating Display */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-6 w-6 fill-accent text-accent"
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-foreground">{averageRating}.0</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">{totalReviews}+ Reviews</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="relative p-8 border-0 shadow-card hover:shadow-card-hover transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 h-10 w-10 text-accent/20" />

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-accent text-accent"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="font-serif text-lg font-bold text-accent">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.type}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Aggregate Review Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AggregateRating",
          itemReviewed: {
            "@type": "RealEstateAgent",
            name: siteConfig.name,
          },
          ratingValue: averageRating,
          bestRating: 5,
          ratingCount: totalReviews,
        })}
      </script>
    </section>
  );
}
