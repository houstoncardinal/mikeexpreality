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
        <title>{siteConfig.name} | {siteConfig.tagline} | Houston, Sugar Land, Katy, Cypress Real Estate</title>
        <meta
          name="description"
          content={`${siteConfig.name} - ${siteConfig.tagline}. As a dedicated real estate team serving Houston, Sugar Land, Richmond, Missouri City, Katy, and Cypress, our approach is rooted in a strong client-first philosophy.`}
        />
        <meta name="keywords" content="Mike Ogunkeye, Houston real estate, Sugar Land homes, Katy real estate, Cypress homes for sale, Richmond TX real estate, Missouri City realtor, eXp Realty Houston, Houston homes for sale" />
        <link rel="canonical" href={siteConfig.url} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${siteConfig.name} | ${siteConfig.tagline}`} />
        <meta property="og:description" content="As a dedicated real estate team serving Houston and surrounding areas, our approach is rooted in a strong client-first philosophy." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteConfig.url} />
        <meta property="og:site_name" content={siteConfig.name} />
        <meta property="og:image" content={`${siteConfig.url}/logo-primary.jpeg`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteConfig.name} />
        <meta name="twitter:description" content={siteConfig.tagline} />
        <meta name="twitter:image" content={`${siteConfig.url}/logo-primary.jpeg`} />
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
