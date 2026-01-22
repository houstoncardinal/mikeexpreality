import { Helmet } from "react-helmet-async";
import { Star, Quote, CheckCircle, Home, Calendar, ThumbsUp, Users, ExternalLink, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { testimonials, siteConfig } from "@/lib/siteConfig";
import { useEffect, useState, useRef } from "react";
// Animated counter component
function AnimatedCounter({ value, suffix, duration = 2000 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime: number;
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * value));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

const SuccessStories = () => {
  const harSoldUrl = "https://www.har.com/idx/mls/sold/listing?sitetype=aws&cid=598724&allmls=n&mlsorgid=";

  const stats = [
    { icon: <Home className="w-6 h-6 text-accent" />, value: 150, suffix: "+", label: "Homes Sold" },
    { icon: <Calendar className="w-6 h-6 text-accent" />, value: 10, suffix: "+", label: "Years Experience" },
    { icon: <ThumbsUp className="w-6 h-6 text-accent" />, value: 99, suffix: "%", label: "Client Satisfaction" },
    { icon: <Users className="w-6 h-6 text-accent" />, value: 200, suffix: "+", label: "Happy Clients" },
  ];

  return (
    <>
      <Helmet>
        <title>Success Stories | {siteConfig.name}</title>
        <meta 
          name="description" 
          content="See our track record of successful home sales in Houston. Browse sold properties and read testimonials from satisfied clients." 
        />
        <meta property="og:title" content={`Success Stories | ${siteConfig.name}`} />
        <meta property="og:description" content="View our proven track record of successful home sales across Houston and surrounding areas." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-secondary to-background overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
        <div className="container-custom relative">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4 bg-green-100 text-green-700">
              <Award className="w-4 h-4 mr-2" />
              Proven Results
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Our Success Stories
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              We've helped hundreds of families find their dream homes across Houston. 
              Browse our track record and hear directly from our satisfied clients.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2000 + index * 200} />
                </div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sold Properties Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-custom">
          <div className="text-center mb-10">
            <p className="text-accent font-medium tracking-wider uppercase mb-2">
              Recently Sold
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Properties We've Closed
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse through our successfully closed transactions from the Houston MLS.
            </p>
          </div>

          {/* Trust Banner */}
          <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border border-green-500/20 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-700">Verified Sales Data</span>
              </div>
              <span className="text-muted-foreground hidden sm:inline">•</span>
              <p className="text-sm text-muted-foreground">
                All listings verified through the Houston Association of REALTORS®
              </p>
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                HAR MLS
              </Badge>
            </div>
          </div>

          {/* Sold Listings Embed */}
          <div 
            className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden border-2 border-green-500/30 shadow-xl bg-background"
            style={{ paddingTop: '80%' }}
          >
            {/* Sold Banner Overlay */}
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-green-600 hover:bg-green-600 text-white px-4 py-2 text-sm font-semibold shadow-lg">
                <CheckCircle className="w-4 h-4 mr-2" />
                SOLD PROPERTIES
              </Badge>
            </div>
            <iframe
              src={harSoldUrl}
              className="absolute top-0 left-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              title="HAR MLS Sold Listings"
            />
          </div>

          <p className="text-center mt-4 text-sm text-muted-foreground">
            Having trouble viewing? <a href={harSoldUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">Open Sold Listings in HAR <ExternalLink className="w-3 h-3" /></a>
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-accent font-medium tracking-wider uppercase mb-2">
              Client Testimonials
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Hear directly from the families we've helped.
            </p>

            {/* Aggregate Rating */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-accent text-accent" />
                ))}
              </div>
              <span className="text-2xl font-bold text-foreground">5.0</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">{testimonials.length}+ Reviews</span>
            </div>
          </div>

          {/* All Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="relative p-8 border-0 shadow-card hover:shadow-card-hover transition-shadow duration-300"
              >
                <Quote className="absolute top-6 right-6 h-10 w-10 text-accent/20" />

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>

                <p className="text-foreground leading-relaxed mb-6">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-border">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="font-serif text-lg font-bold text-accent">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.type}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-accent/5">
        <div className="container-custom text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Whether you're buying or selling, we're here to help you achieve your real estate goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <a href="/contact">Get Started Today</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={`tel:${siteConfig.phoneRaw}`}>
                Call {siteConfig.phone}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default SuccessStories;