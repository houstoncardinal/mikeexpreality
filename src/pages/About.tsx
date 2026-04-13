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
  { label: "Homes Sold", value: "500+" },
  { label: "Years Experience", value: "15+" },
  { label: "5-Star Reviews", value: "50+" },
  { label: "Service Areas", value: "9+" },
];

const values = [
  {
    icon: Users,
    title: "Client-First",
    description: "Exceptional service begins with listening closely and responding quickly to your needs.",
  },
  {
    icon: Target,
    title: "Local Expertise",
    description: "Deep knowledge of Houston, Sugar Land, Katy, Cypress, Richmond, and Missouri City.",
  },
  {
    icon: Award,
    title: "Strong Negotiation",
    description: "Experience and expertise to ensure the best possible outcome in every transaction.",
  },
  {
    icon: Heart,
    title: "Trusted Network",
    description: "Access to lenders, inspectors, contractors, and industry professionals.",
  },
];

const aboutFAQs = [
  {
    question: "What experience does Mike Ogunkeye have in real estate?",
    answer: "Mike Ogunkeye has over 15 years of experience in the Houston real estate market, helping over 500 clients buy and sell homes. With deep knowledge of Sugar Land, Katy, Cypress, Richmond, and Missouri City, Mike brings expertise and dedication to every transaction.",
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
        {/* Hero */}
        <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-primary">
          <div className="container-custom">
            <div className="max-w-2xl">
              <p className="text-accent font-medium tracking-widest uppercase mb-4 text-xs">
                About
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
                {siteConfig.agent.fullName}
              </h1>
              <p className="text-lg text-primary-foreground/60">
                A dedicated real estate professional serving Houston and surrounding communities with a client-first approach.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-14 bg-background border-b border-border">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-serif text-3xl md:text-4xl font-bold text-accent mb-1">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-accent font-medium tracking-widest uppercase mb-3 text-xs">
                  Our Approach
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Built on Trust, Driven by Results
                </h2>
                <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                  <p>
                    We believe that exceptional service begins with being accessible, listening closely, and responding quickly to your needs. With deep local market knowledge, strong negotiation skills, and a trusted network of industry professionals, we guide you through every step.
                  </p>
                  <p>
                    By combining personalized service with the latest technology, we deliver faster, more efficient results—always with your goals at the center.
                  </p>
                </div>

                <div className="mt-8 space-y-2.5">
                  {[
                    "Deep Local Market Expertise",
                    "Strong Negotiation Skills",
                    "Trusted Network of Professionals",
                    "Personalized Client Service",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                      <span className="text-foreground text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex gap-3">
                  <a href={`tel:${siteConfig.phoneRaw}`}>
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      <Phone className="h-4 w-4 mr-2" />
                      {siteConfig.phone}
                    </Button>
                  </a>
                  <a href={`mailto:${siteConfig.email}`}>
                    <Button variant="outline" size="lg">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                  <img
                    src={mikeImages.profile}
                    alt={`${siteConfig.agent.name} - Professional Real Estate Agent`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = mikeImages.profileAlt1;
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 md:py-28 bg-secondary/50">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-accent font-medium tracking-widest uppercase mb-3 text-xs">
                Why Work With Us
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                What Sets Us Apart
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="p-6 rounded-xl bg-card border border-border/50"
                >
                  <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center mb-5">
                    <value.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2">
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
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-5">
              Ready to Work Together?
            </h2>
            <p className="text-primary-foreground/60 mb-8 max-w-lg mx-auto">
              Let's discuss how we can help you achieve your real estate goals.
            </p>
            <Link to="/contact">
              <Button size="lg" className="h-14 px-8 bg-white text-foreground hover:bg-white/90 font-semibold text-base">
                Schedule a Consultation
              </Button>
            </Link>
          </div>
        </section>
      </Layout>

      <SchemaMarkup schemas={[...getAboutPageSchemas(), getFAQSchema(aboutFAQs), getAggregateRatingSchema()]} />
    </>
  );
};

export default About;
