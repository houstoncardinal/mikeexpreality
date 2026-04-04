import { Helmet } from "react-helmet-async";
import {
  FeaturedListings,
  NeighborhoodSection,
  TestimonialsSection,
  CTASection,
  StatsSection,
} from "@/components/home";
import { Hero3DSection } from "@/components/ui/3d-hero-section-boxes";
import { siteConfig } from "@/lib/siteConfig";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { getHomepageSchemas, getFAQSchema } from "@/lib/schema";

const homepageFAQs = [
  {
    question: "How do I get started buying a home in Houston?",
    answer: "Start by getting pre-approved for a mortgage, then contact Mike Ogunkeye Real Estate for a free buyer consultation. We'll help you understand the market, identify your needs, and find properties that match your criteria in Houston, Sugar Land, Katy, Cypress, and surrounding areas.",
  },
  {
    question: "What is my home worth in today's market?",
    answer: "Home values vary based on location, condition, size, and current market conditions. Mike Ogunkeye Real Estate offers free home valuations using comprehensive market analysis. Contact us for a personalized assessment of your property's value.",
  },
  {
    question: "How long does it take to sell a home in Houston?",
    answer: "The average time to sell a home in Houston varies by neighborhood and price point. Well-priced homes in desirable areas like Sugar Land and Katy often sell within 30-60 days. Mike Ogunkeye Real Estate uses strategic marketing to help sell homes faster.",
  },
  {
    question: "What areas does Mike Ogunkeye Real Estate serve?",
    answer: "We serve Houston and surrounding areas including Sugar Land, Katy, Cypress, Richmond, Missouri City, Pearland, Rosenberg, and Rosharon. Our deep local knowledge helps clients find the perfect home or sell their property for top dollar.",
  },
  {
    question: "What makes Mike Ogunkeye Real Estate different?",
    answer: "Our client-first philosophy, deep local market knowledge, strong negotiation skills, and trusted network of industry professionals set us apart. We combine personalized service with the latest technology to deliver faster, more efficient results.",
  },
];

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Mike Ogunkeye Real Estate | Buy & Sell Homes in Houston TX | eXp Realty 2026</title>
        <meta
          name="description"
          content="Looking to buy or sell a home in Houston? Mike Ogunkeye is a top-rated Houston real estate agent with 15+ years experience and 500+ homes sold. Serving Sugar Land, Katy, Cypress, Richmond & Missouri City. Free consultation. eXp Realty."
        />
        <meta name="keywords" content="buy a home in Houston, sell your home Houston, Houston real estate agent, homes for sale Sugar Land TX, Katy homes for sale, Cypress real estate agent, Richmond TX realtor, Missouri City homes, eXp Realty Houston, first-time home buyer Houston, sell my house fast Houston" />
        <link rel="canonical" href={siteConfig.url} />
        
        <meta property="og:title" content="Mike Ogunkeye Real Estate | Buy & Sell Homes in Houston" />
        <meta property="og:description" content="Houston's top-rated realtor. 15+ years experience, 500+ homes sold. Buy or sell your home in Sugar Land, Katy, Cypress, Richmond & Missouri City." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteConfig.url} />
        <meta property="og:site_name" content={siteConfig.name} />
        <meta property="og:image" content={`${siteConfig.url}/logo-primary.jpeg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Mike Ogunkeye Real Estate" />
        <meta property="og:locale" content="en_US" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mike Ogunkeye | Houston Real Estate Agent" />
        <meta name="twitter:description" content="Buy or sell homes in Houston, Sugar Land, Katy, Cypress. 500+ homes sold. 5-star reviews." />
        <meta name="twitter:image" content={`${siteConfig.url}/logo-primary.jpeg`} />
        
        <meta name="author" content="Mike Ogunkeye" />
        <meta name="geo.region" content="US-TX" />
        <meta name="geo.placename" content="Houston" />
      </Helmet>

      <Hero3DSection />

      <section id="featured-listings">
        <FeaturedListings />
      </section>

      <section id="stats-section">
        <StatsSection />
      </section>

      <section id="neighborhoods">
        <NeighborhoodSection />
      </section>

      <TestimonialsSection />

      <section id="cta-section">
        <CTASection />
      </section>

      <SchemaMarkup schemas={[...getHomepageSchemas(), getFAQSchema(homepageFAQs)]} />
    </>
  );
};

export default Index;
