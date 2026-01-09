import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { Award, Users, Target, Heart, CheckCircle, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { siteConfig } from "@/lib/siteConfig";
import { mikeImages, brandImages } from "@/lib/images";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { getAboutPageSchemas, getFAQSchema, getAggregateRatingSchema } from "@/lib/schema";

const stats = [
  { label: "Service Areas", value: "9+" },
  { label: "Happy Clients", value: "100+" },
  { label: "5-Star Reviews", value: "50+" },
  { label: "Years Experience", value: "10+" },
];

const values = [
  {
    icon: Users,
    title: "Client-First Philosophy",
    description: "We believe that exceptional service begins with being accessible, listening closely, and responding quickly to your needs.",
  },
  {
    icon: Target,
    title: "Local Market Knowledge",
    description: "Deep expertise in Houston, Sugar Land, Richmond, Missouri City, Katy, Cypress, and surrounding communities.",
  },
  {
    icon: Award,
    title: "Strong Negotiation Skills",
    description: "We negotiate with experience and expertise to ensure you get the best possible outcome in every transaction.",
  },
  {
    icon: Heart,
    title: "Trusted Network",
    description: "Access to a comprehensive network of industry professionals including lenders, inspectors, and contractors.",
  },
];

const aboutFAQs = [
  {
    question: "What experience does Mike Ogunkeye have in real estate?",
    answer: "Mike Ogunkeye has over 10 years of experience in the Houston real estate market, helping over 100 happy clients buy and sell homes. With deep knowledge of Sugar Land, Katy, Cypress, Richmond, and Missouri City, Mike brings expertise and dedication to every transaction.",
  },
  {
    question: "What brokerage is Mike Ogunkeye affiliated with?",
    answer: "Mike Ogunkeye is affiliated with eXp Realty, one of the fastest-growing real estate brokerages in the country. This affiliation provides access to cutting-edge technology, extensive resources, and a global network of real estate professionals.",
  },
  {
    question: "What sets Mike Ogunkeye apart from other real estate agents?",
    answer: "Mike's client-first philosophy, strong negotiation skills, deep local market knowledge, and trusted network of industry professionals set him apart. He combines personalized service with the latest technology to deliver exceptional results.",
  },
];

const About = () => {
  return (
    <>
      <Helmet>
        <title>About {siteConfig.agent.name} | {siteConfig.brokerage} | Houston Real Estate Agent</title>
        <meta
          name="description"
          content={`Meet ${siteConfig.agent.name} - a dedicated real estate professional with ${siteConfig.brokerage}. Serving Houston, Sugar Land, Katy, Cypress, Richmond, Missouri City and surrounding areas with a client-first approach.`}
        />
        <link rel="canonical" href={`${siteConfig.url}/about`} />
        <meta property="og:title" content={`About ${siteConfig.agent.name} | ${siteConfig.brokerage}`} />
        <meta property="og:description" content={`Meet ${siteConfig.agent.name} - a dedicated real estate professional serving Houston and surrounding areas.`} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={`${siteConfig.url}/about`} />
      </Helmet>

      <Layout>
        {/* Hero Section */}
        <section className="relative pt-40 pb-20 bg-primary">
          <div className="container-custom">
            <div className="max-w-3xl">
              <p className="text-accent font-medium tracking-wider uppercase mb-4">
                Meet the Team
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                {siteConfig.agent.fullName}
                <span className="block text-gradient-gold">{siteConfig.brokerage}</span>
              </h1>
              <p className="text-xl text-primary-foreground/70">
                As a dedicated real estate team serving Houston, Sugar Land, Richmond, Missouri City, Katy, and Cypress, our approach is rooted in a strong client-first philosophy.
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
                  Our Approach
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Built on Trust,
                  <span className="block text-muted-foreground">Driven by Results</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We believe that exceptional service begins with being accessible, listening closely, and responding quickly to your needs. With deep local market knowledge, strong negotiation skills, and a trusted network of industry professionals, we're here to guide you through every step of the buying or selling process.
                  </p>
                  <p>
                    By combining personalized service with the latest technology, we're able to deliver faster, more efficient results—always with your goals at the center of everything we do.
                  </p>
                  <p>
                    Every client relationship is built on a foundation of trust, clear communication, and a genuine commitment to putting your needs first.
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  {[
                    "Deep Local Market Expertise",
                    "Strong Negotiation Skills",
                    "Trusted Network of Professionals",
                    "Personalized Client Service",
                    "Latest Technology Integration",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <a href={`tel:${siteConfig.phoneRaw}`}>
                    <Button variant="gold" size="lg">
                      <Phone className="h-4 w-4" />
                      {siteConfig.phone}
                    </Button>
                  </a>
                  <a href={`mailto:${siteConfig.email}`}>
                    <Button variant="outline" size="lg">
                      <Mail className="h-4 w-4" />
                      Email Me
                    </Button>
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl bg-secondary overflow-hidden shadow-2xl">
                  <img
                    src={mikeImages.profile}
                    alt={`${siteConfig.agent.name} - Professional Real Estate Agent`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = mikeImages.profileAlt1;
                    }}
                  />
                </div>
                <div className="absolute -bottom-8 -left-8 bg-accent text-accent-foreground p-6 rounded-xl shadow-gold">
                  <p className="font-serif text-3xl font-bold">{siteConfig.brokerage}</p>
                  <p className="text-sm">Real Estate Professional</p>
                </div>
                <div className="absolute -top-4 -right-4 flex flex-col gap-2">
                  <div className="bg-white p-3 rounded-lg shadow-xl">
                    <img
                      src={brandImages.realtorLogo}
                      alt="Realtor Logo"
                      className="h-8 w-auto"
                    />
                  </div>
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
                Why Work With Us
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
              Ready to Work Together?
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

      {/* Advanced Schema Markup */}
      <SchemaMarkup schemas={[...getAboutPageSchemas(), getFAQSchema(aboutFAQs), getAggregateRatingSchema()]} />
    </>
  );
};

export default About;
