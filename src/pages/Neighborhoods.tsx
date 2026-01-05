import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Home, TrendingUp, School, Trees } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const neighborhoods = [
  {
    name: "Houston",
    slug: "houston",
    description: "The heart of Texas, offering diverse neighborhoods from the bustling downtown to serene suburban enclaves. Houston provides endless opportunities for every lifestyle.",
    highlights: ["World-Class Dining", "Cultural Districts", "Medical Center", "Energy Corridor"],
    stats: { listings: "2,500+", avgPrice: "$485K", schools: "45+", parks: "100+" },
    icon: "🏙️",
  },
  {
    name: "Sugar Land",
    slug: "sugar-land",
    description: "A master-planned community known for its excellent schools, safe neighborhoods, and family-friendly atmosphere. Sugar Land consistently ranks among the best places to live in Texas.",
    highlights: ["Top-Rated Schools", "Town Square", "First Colony", "Telfair"],
    stats: { listings: "800+", avgPrice: "$550K", schools: "25+", parks: "50+" },
    icon: "🏡",
  },
  {
    name: "Katy",
    slug: "katy",
    description: "One of Houston's fastest-growing suburbs, Katy offers modern developments, excellent infrastructure, and a strong sense of community with small-town charm.",
    highlights: ["Katy Mills", "Cinco Ranch", "Grand Lakes", "Cross Creek Ranch"],
    stats: { listings: "1,200+", avgPrice: "$420K", schools: "30+", parks: "75+" },
    icon: "🌾",
  },
  {
    name: "Cypress",
    slug: "cypress",
    description: "Known for its scenic beauty and nature preserves, Cypress offers a perfect blend of suburban convenience and natural tranquility with excellent golf courses and parks.",
    highlights: ["Bridgeland", "Towne Lake", "Cypress Creek", "Black Horse Golf"],
    stats: { listings: "950+", avgPrice: "$395K", schools: "20+", parks: "60+" },
    icon: "🌲",
  },
  {
    name: "Richmond",
    slug: "richmond",
    description: "Historic Richmond combines old-world charm with modern amenities. The area offers affordable luxury and is experiencing rapid growth with new developments.",
    highlights: ["Historic Downtown", "Pecan Grove", "Long Meadow Farms", "Harvest Green"],
    stats: { listings: "600+", avgPrice: "$365K", schools: "15+", parks: "40+" },
    icon: "🏛️",
  },
];

const Neighborhoods = () => {
  return (
    <>
      <Helmet>
        <title>Houston Neighborhood Guides | Sugar Land, Katy, Cypress, Richmond | Houston Elite</title>
        <meta
          name="description"
          content="Explore Houston's best neighborhoods. Detailed guides for Sugar Land, Katy, Cypress, Richmond with school info, home prices, and local amenities."
        />
        <link rel="canonical" href="https://houstonelite.com/neighborhoods" />
      </Helmet>

      <Layout>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-primary">
          <div className="container-custom">
            <div className="max-w-3xl">
              <p className="text-accent font-medium tracking-wider uppercase mb-4">
                Neighborhood Guides
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Discover Houston's
                <span className="block text-gradient-gold">Best Communities</span>
              </h1>
              <p className="text-xl text-primary-foreground/70">
                In-depth guides to help you find the perfect neighborhood for your lifestyle, family, and future.
              </p>
            </div>
          </div>
        </section>

        {/* Neighborhoods Grid */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="space-y-12">
              {neighborhoods.map((neighborhood, index) => (
                <Card
                  key={neighborhood.slug}
                  className="overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <div className={`grid lg:grid-cols-2 ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                    {/* Image/Visual */}
                    <div className={`relative min-h-[300px] lg:min-h-[400px] bg-gradient-to-br from-charcoal to-charcoal-light flex items-center justify-center ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                      <span className="text-8xl">{neighborhood.icon}</span>
                      <div className="absolute bottom-6 left-6 right-6 flex gap-4">
                        <div className="bg-card/90 backdrop-blur-sm rounded-lg p-4 flex-1">
                          <p className="text-xs text-muted-foreground uppercase">Active Listings</p>
                          <p className="font-bold text-foreground">{neighborhood.stats.listings}</p>
                        </div>
                        <div className="bg-card/90 backdrop-blur-sm rounded-lg p-4 flex-1">
                          <p className="text-xs text-muted-foreground uppercase">Avg. Price</p>
                          <p className="font-bold text-foreground">{neighborhood.stats.avgPrice}</p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                        {neighborhood.name}
                      </h2>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {neighborhood.description}
                      </p>

                      {/* Highlights */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {neighborhood.highlights.map((highlight) => (
                          <span
                            key={highlight}
                            className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center gap-3">
                          <School className="h-5 w-5 text-accent" />
                          <div>
                            <p className="text-sm text-muted-foreground">Schools</p>
                            <p className="font-semibold text-foreground">{neighborhood.stats.schools}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Trees className="h-5 w-5 text-accent" />
                          <div>
                            <p className="text-sm text-muted-foreground">Parks</p>
                            <p className="font-semibold text-foreground">{neighborhood.stats.parks}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Link to="/listings">
                          <Button variant="gold">
                            View Homes
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-secondary">
          <div className="container-custom text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              Need Help Choosing?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our local experts can help you find the perfect neighborhood based on your lifestyle, commute, and family needs.
            </p>
            <Link to="/contact">
              <Button variant="gold" size="xl">
                Talk to an Expert
              </Button>
            </Link>
          </div>
        </section>
      </Layout>

      {/* Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://houstonelite.com" },
            { "@type": "ListItem", position: 2, name: "Neighborhoods", item: "https://houstonelite.com/neighborhoods" },
          ],
        })}
      </script>
    </>
  );
};

export default Neighborhoods;
