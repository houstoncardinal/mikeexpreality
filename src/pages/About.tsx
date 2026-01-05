import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { Award, Users, Target, Heart, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const stats = [
  { label: "Years of Experience", value: "15+" },
  { label: "Homes Sold", value: "500+" },
  { label: "Happy Clients", value: "1,000+" },
  { label: "Cities Served", value: "5" },
];

const values = [
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for excellence in every transaction, ensuring our clients receive the highest level of service.",
  },
  {
    icon: Users,
    title: "Client-First",
    description: "Your goals are our priority. We listen, understand, and deliver personalized real estate solutions.",
  },
  {
    icon: Target,
    title: "Results-Driven",
    description: "Our proven strategies and market expertise consistently deliver exceptional outcomes for our clients.",
  },
  {
    icon: Heart,
    title: "Integrity",
    description: "Trust is the foundation of every relationship. We operate with complete transparency and honesty.",
  },
];

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Houston Elite Real Estate - Your Trusted Houston Realtors</title>
        <meta
          name="description"
          content="Meet Houston Elite Real Estate - a team of expert realtors with 15+ years serving Houston, Sugar Land, Katy, Cypress, and Richmond. Over 500 homes sold and $2B in sales."
        />
        <link rel="canonical" href="https://houstonelite.com/about" />
      </Helmet>

      <Layout>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-primary">
          <div className="container-custom">
            <div className="max-w-3xl">
              <p className="text-accent font-medium tracking-wider uppercase mb-4">
                About Us
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Houston's Most Trusted
                <span className="block text-gradient-gold">Real Estate Team</span>
              </h1>
              <p className="text-xl text-primary-foreground/70">
                For over 15 years, we've been helping families find their perfect homes across greater Houston. Our commitment to excellence has made us the region's premier real estate agency.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-background border-b border-border">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-serif text-4xl md:text-5xl font-bold text-accent mb-2">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-accent font-medium tracking-wider uppercase mb-2">
                  Our Story
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Built on Trust,
                  <span className="block text-muted-foreground">Driven by Results</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Houston Elite Real Estate was founded with a simple mission: to provide exceptional real estate services that put our clients first. What started as a small team has grown into one of Houston's most respected agencies.
                  </p>
                  <p>
                    Our deep knowledge of the Houston market, combined with our commitment to personalized service, has helped hundreds of families achieve their real estate dreams. From first-time homebuyers to seasoned investors, we treat every client with the same dedication and care.
                  </p>
                  <p>
                    Today, we serve communities across Houston, Sugar Land, Katy, Cypress, and Richmond, bringing the same passion and expertise that has defined our success from day one.
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  {[
                    "Certified Luxury Home Marketing Specialists",
                    "Top 1% of Houston Realtors",
                    "5-Star Rating Across All Platforms",
                    "HAR Circle of Excellence Award Winners",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl bg-secondary overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-charcoal to-charcoal-light flex items-center justify-center">
                    <span className="font-serif text-6xl font-bold text-primary-foreground/20">HE</span>
                  </div>
                </div>
                <div className="absolute -bottom-8 -left-8 bg-accent text-accent-foreground p-6 rounded-xl shadow-gold">
                  <p className="font-serif text-3xl font-bold">$2B+</p>
                  <p className="text-sm">Total Sales Volume</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-padding bg-secondary">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-accent font-medium tracking-wider uppercase mb-2">
                Our Values
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                What Sets Us Apart
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="p-8 rounded-2xl bg-card border border-border hover:shadow-card transition-shadow"
                >
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                    <value.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary">
          <div className="container-custom text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Work With the Best?
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help you achieve your real estate goals.
            </p>
            <Link to="/contact">
              <Button variant="gold" size="xl">
                Schedule a Consultation
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
            { "@type": "ListItem", position: 2, name: "About", item: "https://houstonelite.com/about" },
          ],
        })}
      </script>
    </>
  );
};

export default About;
