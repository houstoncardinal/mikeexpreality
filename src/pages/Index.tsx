import { Helmet } from "react-helmet-async";
import {
  FeaturedListings,
  NeighborhoodSection,
  TestimonialsSection,
  ServicesSection,
  CTASection,
} from "@/components/home";
import { Hero3DSection } from "@/components/ui/3d-hero-section-boxes";
import { siteConfig, testimonials } from "@/lib/siteConfig";

const Index = () => {
  // Calculate average rating
  const avgRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

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
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteConfig.name} />
        <meta name="twitter:description" content={siteConfig.tagline} />
      </Helmet>

      <Hero3DSection />
      <FeaturedListings />
      <NeighborhoodSection />
      <ServicesSection />
      <TestimonialsSection />
      <CTASection />

      {/* Advanced Schema Markup */}
      
      {/* RealEstateAgent Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          "@id": `${siteConfig.url}#agent`,
          name: siteConfig.name,
          alternateName: siteConfig.agent.fullName,
          description: `${siteConfig.tagline}. As a dedicated real estate team serving Houston, Sugar Land, Richmond, Missouri City, Katy, and Cypress, our approach is rooted in a strong client-first philosophy.`,
          url: siteConfig.url,
          telephone: siteConfig.phone,
          email: siteConfig.email,
          image: "https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85,fit=scale-down,width=1280/https://media-production.lp-cdn.com/media/3e061cc4-19fe-4964-9802-0ef4ec5783d2",
          logo: `${siteConfig.url}/logo.png`,
          priceRange: "$$-$$$$",
          address: {
            "@type": "PostalAddress",
            streetAddress: siteConfig.address.street,
            addressLocality: siteConfig.address.city,
            addressRegion: siteConfig.address.state,
            postalCode: siteConfig.address.zip,
            addressCountry: "US",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 29.6197,
            longitude: -95.5617,
          },
          areaServed: siteConfig.serviceAreas.map((area) => ({
            "@type": "City",
            name: area,
            containedInPlace: {
              "@type": "State",
              name: "Texas",
            },
          })),
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
          sameAs: [
            siteConfig.social.instagram,
            siteConfig.social.facebook,
            siteConfig.social.linkedin,
          ],
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating,
            bestRating: 5,
            worstRating: 1,
            ratingCount: testimonials.length,
            reviewCount: testimonials.length,
          },
          review: testimonials.slice(0, 5).map((testimonial) => ({
            "@type": "Review",
            author: {
              "@type": "Person",
              name: testimonial.name,
            },
            reviewRating: {
              "@type": "Rating",
              ratingValue: testimonial.rating,
              bestRating: 5,
            },
            reviewBody: testimonial.text,
          })),
          parentOrganization: {
            "@type": "Organization",
            name: siteConfig.brokerage,
            url: "https://exprealty.com",
          },
          knowsAbout: [
            "Residential Real Estate",
            "Luxury Homes",
            "First-Time Home Buyers",
            "Investment Properties",
            "Property Valuation",
            "Real Estate Negotiation",
          ],
        })}
      </script>

      {/* Person Schema for Agent */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": `${siteConfig.url}#person`,
          name: siteConfig.agent.fullName,
          alternateName: siteConfig.agent.name,
          jobTitle: "Real Estate Agent",
          worksFor: {
            "@type": "Organization",
            name: siteConfig.brokerage,
          },
          url: siteConfig.url,
          telephone: siteConfig.phone,
          email: siteConfig.email,
          address: {
            "@type": "PostalAddress",
            addressLocality: siteConfig.address.city,
            addressRegion: siteConfig.address.state,
            addressCountry: "US",
          },
          sameAs: [
            siteConfig.social.instagram,
            siteConfig.social.facebook,
            siteConfig.social.linkedin,
          ],
        })}
      </script>

      {/* WebSite Schema with SearchAction */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${siteConfig.url}#website`,
          name: siteConfig.name,
          url: siteConfig.url,
          description: siteConfig.tagline,
          publisher: {
            "@id": `${siteConfig.url}#agent`,
          },
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteConfig.url}/listings?search={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
          inLanguage: "en-US",
        })}
      </script>

      {/* LocalBusiness Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": `${siteConfig.url}#localbusiness`,
          name: siteConfig.name,
          image: `${siteConfig.url}/logo.png`,
          telephone: siteConfig.phone,
          email: siteConfig.email,
          url: siteConfig.url,
          address: {
            "@type": "PostalAddress",
            streetAddress: siteConfig.address.street,
            addressLocality: siteConfig.address.city,
            addressRegion: siteConfig.address.state,
            postalCode: siteConfig.address.zip,
            addressCountry: "US",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 29.6197,
            longitude: -95.5617,
          },
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
          priceRange: "$$-$$$$",
        })}
      </script>

      {/* BreadcrumbList Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: siteConfig.url,
            },
          ],
        })}
      </script>

      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${siteConfig.url}#organization`,
          name: siteConfig.name,
          url: siteConfig.url,
          logo: `${siteConfig.url}/logo.png`,
          contactPoint: {
            "@type": "ContactPoint",
            telephone: siteConfig.phone,
            contactType: "customer service",
            email: siteConfig.email,
            availableLanguage: ["English"],
            areaServed: siteConfig.serviceAreas.map((area) => ({
              "@type": "City",
              name: area,
            })),
          },
          sameAs: [
            siteConfig.social.instagram,
            siteConfig.social.facebook,
            siteConfig.social.linkedin,
          ],
        })}
      </script>
    </>
  );
};

export default Index;
