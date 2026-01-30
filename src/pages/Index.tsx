import { Helmet } from "react-helmet-async";
import {
  FeaturedListings,
  NeighborhoodSection,
  TestimonialsSection,
  ServicesSection,
  CTASection,
  MLSSearchSection,
  StatsSection,
} from "@/components/home";
import { Hero3DSection } from "@/components/ui/3d-hero-section-boxes";
import CombinedFeaturedSection from "@/components/ui/combined-featured-section";
import { siteConfig } from "@/lib/siteConfig";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { getHomepageSchemas, getFAQSchema } from "@/lib/schema";
import { FloatingSideNav } from "@/components/home/FloatingSideNav";
import { LeadMagnetSection } from "@/components/home/LeadMagnetSection";

// Common real estate FAQs for homepage
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
        <title>{siteConfig.name} | Houston Luxury Real Estate | Sugar Land, Katy, Cypress Homes</title>
        <meta
          name="description"
          content="Mike Ogunkeye Real Estate - Your trusted Houston realtor with 10+ years experience. Buy or sell homes in Sugar Land, Katy, Cypress, Richmond & Missouri City. eXp Realty. 150+ homes sold. 5-star reviews."
        />
        <meta name="keywords" content="Mike Ogunkeye, Houston real estate agent, Sugar Land homes for sale, Katy realtor, Cypress homes, Richmond TX real estate, Missouri City homes, eXp Realty Houston, luxury homes Houston, first-time home buyer Houston" />
        <link rel="canonical" href={siteConfig.url} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${siteConfig.name} | Houston Luxury Real Estate Expert`} />
        <meta property="og:description" content="Your trusted Houston realtor. 10+ years experience, 150+ homes sold, 5-star reviews. Serving Sugar Land, Katy, Cypress, Richmond & Missouri City." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteConfig.url} />
        <meta property="og:site_name" content={siteConfig.name} />
        <meta property="og:image" content={`${siteConfig.url}/logo-primary.jpeg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Mike Ogunkeye Real Estate Logo" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${siteConfig.name} | Houston Real Estate`} />
        <meta name="twitter:description" content="Your trusted Houston realtor. Buy or sell homes in Sugar Land, Katy, Cypress & more. 5-star reviews." />
        <meta name="twitter:image" content={`${siteConfig.url}/logo-primary.jpeg`} />
        <meta name="twitter:image:alt" content="Mike Ogunkeye Real Estate" />
        
        {/* Additional SEO */}
        <meta name="author" content="Mike Ogunkeye" />
        <meta name="geo.region" content="US-TX" />
        <meta name="geo.placename" content="Houston" />
      </Helmet>

      {/* Floating Side Navigation */}
      <FloatingSideNav />

      <div id="hero-section">
        <Hero3DSection />
      </div>
      <div id="featured-listings">
        <FeaturedListings />
      </div>
      <div id="stats-section">
        <StatsSection />
      </div>
      <div id="mls-search">
        <MLSSearchSection />
      </div>
      <CombinedFeaturedSection />
      <div id="lead-magnet">
        <LeadMagnetSection />
      </div>
      <div id="neighborhoods">
        <NeighborhoodSection />
      </div>
      <ServicesSection />
      <TestimonialsSection />
      <div id="cta-section">
        <CTASection />
      </div>

      {/* Advanced Schema Markup - Centralized */}
      <SchemaMarkup schemas={[...getHomepageSchemas(), getFAQSchema(homepageFAQs)]} />
    </>
  );
};

export default Index;
