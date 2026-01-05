import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const neighborhoods = [
  {
    name: "Houston",
    description: "The heart of Texas with diverse neighborhoods and endless opportunities",
    homes: "2,500+",
    avgPrice: "$485K",
    gradient: "from-charcoal via-charcoal-light to-charcoal",
  },
  {
    name: "Sugar Land",
    description: "Family-friendly suburbs with top-rated schools and master-planned communities",
    homes: "800+",
    avgPrice: "$550K",
    gradient: "from-accent via-gold-light to-accent",
  },
  {
    name: "Katy",
    description: "Rapidly growing community with excellent amenities and modern developments",
    homes: "1,200+",
    avgPrice: "$420K",
    gradient: "from-charcoal-light via-charcoal to-charcoal-light",
  },
  {
    name: "Cypress",
    description: "Scenic suburban living with beautiful parks and nature preserves",
    homes: "950+",
    avgPrice: "$395K",
    gradient: "from-accent via-gold-dark to-accent",
  },
  {
    name: "Richmond",
    description: "Historic charm meets modern living in this growing Texas community",
    homes: "600+",
    avgPrice: "$365K",
    gradient: "from-charcoal via-charcoal-light to-charcoal",
  },
];

export function NeighborhoodSection() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {neighborhoods.map((neighborhood, index) => (
            <Link
              key={neighborhood.name}
              to="/neighborhoods"
              className={cn(
                "group relative overflow-hidden rounded-2xl p-8 transition-all duration-500 hover:scale-[1.02]",
                index === 0 && "md:col-span-2 lg:col-span-1",
                index === 1 && "lg:row-span-2"
              )}
            >
              {/* Background */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-90 group-hover:opacity-100 transition-opacity",
                  neighborhood.gradient
                )}
              />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between min-h-[200px]">
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                    {neighborhood.name}
                  </h3>
                  <p className="text-primary-foreground/70 text-sm leading-relaxed">
                    {neighborhood.description}
                  </p>
                </div>

                <div className="flex items-end justify-between pt-8">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-primary-foreground/50 text-xs uppercase tracking-wide">
                        Active Listings
                      </p>
                      <p className="text-primary-foreground font-semibold text-lg">
                        {neighborhood.homes}
                      </p>
                    </div>
                    <div>
                      <p className="text-primary-foreground/50 text-xs uppercase tracking-wide">
                        Avg. Price
                      </p>
                      <p className="text-primary-foreground font-semibold text-lg">
                        {neighborhood.avgPrice}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-full bg-primary-foreground/10 group-hover:bg-primary-foreground/20 transition-colors">
                    <ArrowRight className="h-5 w-5 text-primary-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
