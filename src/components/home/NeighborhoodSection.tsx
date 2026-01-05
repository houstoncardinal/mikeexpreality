import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { neighborhoods } from "@/lib/siteConfig";

export function NeighborhoodSection() {
  const displayNeighborhoods = neighborhoods.slice(0, 7);
  
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-accent font-medium tracking-wider uppercase mb-2">
            Explore Communities
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Discover Your Perfect
            <span className="block text-muted-foreground">Neighborhood</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From bustling urban centers to serene suburban retreats, find the community that fits your lifestyle.
          </p>
        </div>

        {/* Neighborhoods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayNeighborhoods.map((neighborhood) => (
            <Link
              key={neighborhood.name}
              to={`/neighborhoods/${neighborhood.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] transition-all duration-500 hover:scale-[1.02]"
            >
              {/* Background Image */}
              <img
                src={neighborhood.image}
                alt={`${neighborhood.name} neighborhood`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                  {neighborhood.name}
                </h3>
                <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4 line-clamp-2">
                  {neighborhood.description}
                </p>

                <div className="flex items-center gap-2 text-accent font-medium text-sm group-hover:gap-3 transition-all">
                  <span>Explore</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
          
          {/* View All Card */}
          <Link
            to="/neighborhoods"
            className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-primary flex items-center justify-center transition-all duration-500 hover:scale-[1.02]"
          >
            <div className="text-center p-6">
              <p className="text-primary-foreground/60 text-sm uppercase tracking-wider mb-2">
                More Areas
              </p>
              <h3 className="font-serif text-2xl font-bold text-primary-foreground mb-4">
                View All<br />Neighborhoods
              </h3>
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <ArrowRight className="h-5 w-5 text-accent-foreground" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
