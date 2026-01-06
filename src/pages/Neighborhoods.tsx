import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, MapPin, Home, TrendingUp, School, Trees, ChevronLeft, Star, Building2, Users, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/InteractiveEffects";

const neighborhoods = [
  {
    name: "Houston",
    slug: "houston",
    description: "The heart of Texas, offering diverse neighborhoods from the bustling downtown to serene suburban enclaves. Houston provides endless opportunities for every lifestyle.",
    longDescription: "Houston is the fourth-largest city in the United States and the largest in Texas. Known for its world-class cultural institutions, thriving culinary scene, and strong economy driven by energy, healthcare, and aerospace industries. From the trendy Montrose district to the upscale River Oaks, Houston offers neighborhoods for every taste and budget.",
    highlights: ["World-Class Dining", "Cultural Districts", "Medical Center", "Energy Corridor"],
    stats: { listings: "2,500+", avgPrice: "$485K", schools: "45+", parks: "100+" },
    icon: "🏙️",
    image: "https://images.unsplash.com/photo-1548519577-80d11c5f62bf?w=800",
    features: [
      { icon: Building2, title: "Business Hub", description: "Home to Fortune 500 companies and thriving startups" },
      { icon: Users, title: "Diverse Culture", description: "One of the most diverse cities in the nation" },
      { icon: Shield, title: "Strong Economy", description: "Leading industries in energy, healthcare, and tech" },
    ],
  },
  {
    name: "Sugar Land",
    slug: "sugar-land",
    description: "A master-planned community known for its excellent schools, safe neighborhoods, and family-friendly atmosphere. Sugar Land consistently ranks among the best places to live in Texas.",
    longDescription: "Sugar Land is a jewel of Fort Bend County, offering an exceptional quality of life with top-rated schools, beautiful master-planned communities, and a vibrant Town Square. The city has been recognized as one of America's best places to live, offering the perfect blend of suburban tranquility and urban amenities.",
    highlights: ["Top-Rated Schools", "Town Square", "First Colony", "Telfair"],
    stats: { listings: "800+", avgPrice: "$550K", schools: "25+", parks: "50+" },
    icon: "🏡",
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800",
    features: [
      { icon: School, title: "Excellent Education", description: "Fort Bend ISD ranked among top districts" },
      { icon: Star, title: "Award-Winning", description: "Consistently ranked as best place to live" },
      { icon: Trees, title: "Beautiful Parks", description: "Extensive trail system and green spaces" },
    ],
  },
  {
    name: "Katy",
    slug: "katy",
    description: "One of Houston's fastest-growing suburbs, Katy offers modern developments, excellent infrastructure, and a strong sense of community with small-town charm.",
    longDescription: "Katy has transformed from a small railroad town into one of Houston's most sought-after suburbs. With award-winning Katy ISD schools, world-class shopping at Katy Mills and LaCenterra, and beautiful master-planned communities, Katy offers an unparalleled suburban lifestyle. The area continues to attract families and professionals seeking quality homes and excellent amenities.",
    highlights: ["Katy Mills", "Cinco Ranch", "Grand Lakes", "Cross Creek Ranch"],
    stats: { listings: "1,200+", avgPrice: "$420K", schools: "30+", parks: "75+" },
    icon: "🌾",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    features: [
      { icon: Home, title: "Modern Living", description: "Newest communities with modern amenities" },
      { icon: Users, title: "Family Friendly", description: "Perfect for growing families" },
      { icon: TrendingUp, title: "Strong Growth", description: "Rapidly appreciating home values" },
    ],
  },
  {
    name: "Cypress",
    slug: "cypress",
    description: "Known for its scenic beauty and nature preserves, Cypress offers a perfect blend of suburban convenience and natural tranquility with excellent golf courses and parks.",
    longDescription: "Cypress offers the best of both worlds - proximity to Houston's urban amenities and the peaceful beauty of Texas nature. Home to the stunning Bridgeland and Towne Lake communities, Cypress attracts those seeking spacious homes, excellent Cy-Fair ISD schools, and a lifestyle centered around outdoor recreation and community connection.",
    highlights: ["Bridgeland", "Towne Lake", "Cypress Creek", "Black Horse Golf"],
    stats: { listings: "950+", avgPrice: "$395K", schools: "20+", parks: "60+" },
    icon: "🌲",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    features: [
      { icon: Trees, title: "Nature Focused", description: "Extensive trails and nature preserves" },
      { icon: Star, title: "Golf Paradise", description: "Premium golf courses throughout" },
      { icon: Shield, title: "Safe Communities", description: "Low crime rates and family safety" },
    ],
  },
  {
    name: "Richmond",
    slug: "richmond",
    description: "Historic Richmond combines old-world charm with modern amenities. The area offers affordable luxury and is experiencing rapid growth with new developments.",
    longDescription: "Richmond is the county seat of Fort Bend County and offers a unique blend of Texas history and modern development. The historic downtown area provides charm and character, while newer communities like Harvest Green and Long Meadow Farms offer contemporary living. Richmond is known for its value, making it an excellent choice for first-time buyers and investors alike.",
    highlights: ["Historic Downtown", "Pecan Grove", "Long Meadow Farms", "Harvest Green"],
    stats: { listings: "600+", avgPrice: "$365K", schools: "15+", parks: "40+" },
    icon: "🏛️",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    features: [
      { icon: Building2, title: "Historic Charm", description: "Rich Texas heritage and character" },
      { icon: TrendingUp, title: "Great Value", description: "Affordable luxury homes" },
      { icon: Home, title: "New Developments", description: "Modern communities emerging" },
    ],
  },
  {
    name: "Missouri City",
    slug: "missouri-city",
    description: "A diverse, family-oriented community with excellent schools and convenient access to downtown Houston and Sugar Land.",
    longDescription: "Missouri City offers the perfect balance of urban convenience and suburban comfort. Located in Fort Bend County, residents enjoy access to excellent Fort Bend ISD and Houston ISD schools, diverse dining options, and a strong sense of community. The Sienna Plantation master-planned community is a crown jewel, offering resort-style amenities.",
    highlights: ["Sienna Plantation", "Lake Olympia", "Fort Bend ISD", "Quick Commute"],
    stats: { listings: "450+", avgPrice: "$380K", schools: "18+", parks: "35+" },
    icon: "🌆",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    features: [
      { icon: Users, title: "Diverse Community", description: "Welcoming and multicultural" },
      { icon: MapPin, title: "Central Location", description: "Easy access to Houston and Sugar Land" },
      { icon: School, title: "Quality Schools", description: "Top-rated educational options" },
    ],
  },
  {
    name: "Pearland",
    slug: "pearland",
    description: "One of Houston's fastest-growing cities, Pearland offers affordable homes, excellent schools, and quick access to downtown Houston.",
    longDescription: "Pearland has experienced explosive growth while maintaining its community charm. The city offers a variety of housing options from established neighborhoods to new construction, all at attractive price points. With excellent Pearland ISD schools, a thriving retail scene, and easy access to Houston, Pearland is ideal for professionals and families.",
    highlights: ["Shadow Creek Ranch", "Silverlake", "Town Center", "Pearland ISD"],
    stats: { listings: "700+", avgPrice: "$350K", schools: "22+", parks: "45+" },
    icon: "🌊",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
    features: [
      { icon: TrendingUp, title: "Rapid Growth", description: "Thriving economy and development" },
      { icon: Home, title: "Affordable", description: "Excellent value for money" },
      { icon: MapPin, title: "Convenient", description: "Easy commute to downtown Houston" },
    ],
  },
  {
    name: "Rosenberg",
    slug: "rosenberg",
    description: "A historic railroad town experiencing modern growth while preserving its charming downtown and Texas heritage.",
    longDescription: "Rosenberg combines small-town Texas charm with modern conveniences. The historic downtown offers unique shops and restaurants, while surrounding master-planned communities provide contemporary living. With more affordable home prices and excellent Lamar CISD schools, Rosenberg attracts buyers looking for value and quality of life.",
    highlights: ["Historic Downtown", "Brazos Town Center", "Lamar CISD", "Railroad Museum"],
    stats: { listings: "400+", avgPrice: "$320K", schools: "12+", parks: "30+" },
    icon: "🚂",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
    features: [
      { icon: Building2, title: "Texas Heritage", description: "Rich railroad history" },
      { icon: Star, title: "Best Value", description: "Most affordable in the region" },
      { icon: Users, title: "Community Spirit", description: "Strong local identity" },
    ],
  },
];

const NeighborhoodDetail = ({ neighborhood }: { neighborhood: typeof neighborhoods[0] }) => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={neighborhood.image}
            alt={neighborhood.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/70 to-navy" />
        </div>
        
        <div className="container-custom relative z-10">
          <Link
            to="/neighborhoods"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Neighborhoods
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-7xl mb-6 block">{neighborhood.icon}</span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              {neighborhood.name}
            </h1>
            <p className="text-xl text-white/70 max-w-3xl leading-relaxed">
              {neighborhood.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-card border-b border-border py-8">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Listings", value: neighborhood.stats.listings },
              { label: "Average Price", value: neighborhood.stats.avgPrice },
              { label: "Schools", value: neighborhood.stats.schools },
              { label: "Parks", value: neighborhood.stats.parks },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-serif text-3xl md:text-4xl font-bold text-accent">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <RevealOnScroll>
              <p className="text-accent font-medium tracking-wider uppercase mb-2">
                About {neighborhood.name}
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose {neighborhood.name}?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {neighborhood.longDescription}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {neighborhood.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="px-4 py-2 bg-accent/10 text-accent text-sm rounded-full font-medium"
                  >
                    {highlight}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                <Link to={`/listings?city=${encodeURIComponent(neighborhood.name)}`}>
                  <Button variant="gold" size="lg">
                    View {neighborhood.name} Homes
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg">
                    Contact Expert
                  </Button>
                </Link>
              </div>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 gap-6">
              {neighborhood.features.map((feature) => (
                <StaggerItem key={feature.title}>
                  <Card className="p-6 border-0 shadow-card hover:shadow-card-hover transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                        <feature.icon className="h-7 w-7 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container-custom text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Explore {neighborhood.name}?
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-2xl mx-auto">
            Let us help you find your perfect home in {neighborhood.name}. Our local experts know every neighborhood inside and out.
          </p>
          <Link to="/contact">
            <Button variant="gold" size="xl">
              Schedule a Tour
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

const NeighborhoodsList = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-primary">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
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
          </motion.div>
        </div>
      </section>

      {/* Neighborhoods Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="space-y-12">
            {neighborhoods.map((neighborhood, index) => (
              <RevealOnScroll key={neighborhood.slug} delay={index * 0.1}>
                <Card
                  className="overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-all group"
                >
                  <div className={`grid lg:grid-cols-2 ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                    {/* Image/Visual */}
                    <div className={`relative min-h-[300px] lg:min-h-[400px] overflow-hidden ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                      <img
                        src={neighborhood.image}
                        alt={neighborhood.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
                      <div className="absolute top-6 left-6">
                        <span className="text-6xl">{neighborhood.icon}</span>
                      </div>
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
                        <Link to={`/listings?city=${encodeURIComponent(neighborhood.name)}`}>
                          <Button variant="gold">
                            View Homes
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to={`/neighborhoods/${neighborhood.slug}`}>
                          <Button variant="outline">
                            Learn More
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </RevealOnScroll>
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
  );
};

const Neighborhoods = () => {
  const { slug } = useParams();
  const neighborhood = slug ? neighborhoods.find(n => n.slug === slug) : null;

  const pageTitle = neighborhood 
    ? `${neighborhood.name} Real Estate | Homes for Sale | Mike Ogunkeye Real Estate`
    : "Houston Neighborhood Guides | Sugar Land, Katy, Cypress, Richmond | Mike Ogunkeye Real Estate";

  const pageDescription = neighborhood
    ? `Explore homes for sale in ${neighborhood.name}, TX. ${neighborhood.description}`
    : "Explore Houston's best neighborhoods. Detailed guides for Sugar Land, Katy, Cypress, Richmond with school info, home prices, and local amenities.";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`https://mikeogunkeye.com/neighborhoods${slug ? `/${slug}` : ''}`} />
      </Helmet>

      {neighborhood ? (
        <NeighborhoodDetail neighborhood={neighborhood} />
      ) : (
        <NeighborhoodsList />
      )}

      {/* Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://mikeogunkeye.com" },
            { "@type": "ListItem", position: 2, name: "Neighborhoods", item: "https://mikeogunkeye.com/neighborhoods" },
            ...(neighborhood ? [{ "@type": "ListItem", position: 3, name: neighborhood.name, item: `https://mikeogunkeye.com/neighborhoods/${neighborhood.slug}` }] : []),
          ],
        })}
      </script>
    </>
  );
};

export default Neighborhoods;
