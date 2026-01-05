import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import {
  HeroSection,
  FeaturedListings,
  NeighborhoodSection,
  TestimonialsSection,
  ServicesSection,
  CTASection,
} from "@/components/home";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Houston Elite Real Estate | Luxury Homes in Houston, Sugar Land, Katy, Cypress</title>
        <meta
          name="description"
          content="Houston's premier luxury real estate agency. Find your dream home in Houston, Sugar Land, Katy, Cypress, and Richmond. Expert guidance for buyers, sellers, and investors."
        />
        <meta name="keywords" content="Houston real estate, luxury homes Houston, Sugar Land homes, Katy real estate, Cypress homes for sale, Richmond TX real estate, Houston realtor" />
        <link rel="canonical" href="https://houstonelite.com" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Houston Elite Real Estate | Luxury Homes in Greater Houston" />
        <meta property="og:description" content="Houston's premier luxury real estate agency. Expert guidance for buyers, sellers, and investors." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://houstonelite.com" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Houston Elite Real Estate" />
        <meta name="twitter:description" content="Houston's premier luxury real estate agency." />
      </Helmet>

      <Layout>
        <HeroSection />
        <FeaturedListings />
        <NeighborhoodSection />
        <ServicesSection />
        <TestimonialsSection />
        <CTASection />
      </Layout>

      {/* Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          name: "Houston Elite Real Estate",
          description: "Houston's premier luxury real estate agency serving Houston, Sugar Land, Katy, Cypress, and Richmond.",
          url: "https://houstonelite.com",
          telephone: "+1-713-555-1234",
          email: "info@houstonelite.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "1234 Main Street, Suite 500",
            addressLocality: "Houston",
            addressRegion: "TX",
            postalCode: "77002",
            addressCountry: "US",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 29.7604,
            longitude: -95.3698,
          },
          areaServed: [
            { "@type": "City", name: "Houston" },
            { "@type": "City", name: "Sugar Land" },
            { "@type": "City", name: "Katy" },
            { "@type": "City", name: "Cypress" },
            { "@type": "City", name: "Richmond" },
          ],
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "09:00",
              closes: "18:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Saturday",
              opens: "10:00",
              closes: "16:00",
            },
          ],
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: 5,
            reviewCount: 127,
          },
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Houston Elite Real Estate",
          url: "https://houstonelite.com",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://houstonelite.com/listings?search={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://houstonelite.com",
            },
          ],
        })}
      </script>
    </>
  );
};

export default Index;
