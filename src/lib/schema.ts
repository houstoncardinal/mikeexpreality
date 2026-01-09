import { siteConfig, testimonials, featuredListings, neighborhoods } from "./siteConfig";

// Type definitions for schema objects
export interface PropertySchemaData {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  priceType: "sale" | "lease";
  beds: number;
  baths: number;
  sqft: number;
  propertyType: string;
  status: string;
  images: string[];
  yearBuilt?: number;
  features?: string[];
  latitude?: number;
  longitude?: number;
  daysOnMarket?: number;
  mlsNumber?: string;
}

export interface BlogPostSchemaData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  featuredImage?: string;
  category?: string;
  readTime?: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// Calculate average rating from testimonials
const avgRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

// ==================== BASE SCHEMAS ====================

/**
 * RealEstateAgent schema - comprehensive agent information
 */
export const getRealEstateAgentSchema = () => ({
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
  logo: `${siteConfig.url}/logo-primary.jpeg`,
  priceRange: "$$-$$$$",
  currenciesAccepted: "USD",
  paymentAccepted: "Cash, Check, Wire Transfer, Mortgage",
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
      containedInPlace: {
        "@type": "Country",
        name: "United States",
      },
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
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Real Estate Services",
    itemListElement: [
      {
        "@type": "OfferCatalog",
        name: "Buying Services",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Buyer Representation" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Property Search" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Home Tours" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Negotiation Services" } },
        ],
      },
      {
        "@type": "OfferCatalog",
        name: "Selling Services",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Listing Services" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Home Valuation" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Marketing Services" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Staging Consultation" } },
        ],
      },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: avgRating.toFixed(1),
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
      worstRating: 1,
    },
    reviewBody: testimonial.text,
    datePublished: new Date().toISOString().split("T")[0],
  })),
  parentOrganization: {
    "@type": "Organization",
    name: siteConfig.brokerage,
    url: "https://exprealty.com",
    logo: "https://exprealty.com/wp-content/uploads/2022/02/exp-realty-logo.png",
  },
  knowsAbout: [
    "Residential Real Estate",
    "Luxury Homes",
    "First-Time Home Buyers",
    "Investment Properties",
    "Property Valuation",
    "Real Estate Negotiation",
    "Home Staging",
    "Market Analysis",
    "Property Marketing",
  ],
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Free Home Valuation",
        description: "Complimentary market analysis to determine your home's value",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Buyer Consultation",
        description: "Free consultation for home buyers",
      },
    },
  ],
});

/**
 * Person schema for the agent
 */
export const getPersonSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteConfig.url}#person`,
  name: siteConfig.agent.fullName,
  alternateName: siteConfig.agent.name,
  jobTitle: "Real Estate Agent",
  worksFor: {
    "@type": "Organization",
    name: siteConfig.brokerage,
    url: "https://exprealty.com",
  },
  url: siteConfig.url,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  image: "https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85,fit=scale-down,width=1280/https://media-production.lp-cdn.com/media/3e061cc4-19fe-4964-9802-0ef4ec5783d2",
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.state,
    postalCode: siteConfig.address.zip,
    addressCountry: "US",
  },
  sameAs: [
    siteConfig.social.instagram,
    siteConfig.social.facebook,
    siteConfig.social.linkedin,
  ],
  knowsAbout: [
    "Real Estate",
    "Home Buying",
    "Home Selling",
    "Houston Real Estate Market",
    "Property Investment",
  ],
});

/**
 * WebSite schema with SearchAction
 */
export const getWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}#website`,
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.tagline,
  publisher: {
    "@id": `${siteConfig.url}#agent`,
  },
  potentialAction: [
    {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/listings?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    {
      "@type": "ReadAction",
      target: `${siteConfig.url}/blog`,
    },
  ],
  inLanguage: "en-US",
  copyrightHolder: {
    "@id": `${siteConfig.url}#agent`,
  },
  copyrightYear: new Date().getFullYear(),
});

/**
 * LocalBusiness schema
 */
export const getLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteConfig.url}#localbusiness`,
  name: siteConfig.name,
  image: `${siteConfig.url}/logo-primary.jpeg`,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  url: siteConfig.url,
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
    ratingValue: avgRating.toFixed(1),
    bestRating: 5,
    worstRating: 1,
    ratingCount: testimonials.length,
  },
});

/**
 * Organization schema
 */
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteConfig.url}#organization`,
  name: siteConfig.name,
  url: siteConfig.url,
  logo: {
    "@type": "ImageObject",
    url: `${siteConfig.url}/logo-primary.jpeg`,
    width: 400,
    height: 400,
  },
  image: `${siteConfig.url}/logo-primary.jpeg`,
  description: siteConfig.tagline,
  foundingDate: "2015",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: siteConfig.phone,
    contactType: "customer service",
    email: siteConfig.email,
    availableLanguage: ["English", "Spanish"],
    areaServed: siteConfig.serviceAreas.map((area) => ({
      "@type": "City",
      name: area,
    })),
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  },
  sameAs: [
    siteConfig.social.instagram,
    siteConfig.social.facebook,
    siteConfig.social.linkedin,
  ],
  member: {
    "@type": "OrganizationRole",
    member: {
      "@id": `${siteConfig.url}#person`,
    },
    roleName: "Lead Agent",
  },
  parentOrganization: {
    "@type": "Organization",
    name: siteConfig.brokerage,
    url: "https://exprealty.com",
  },
});

// ==================== PAGE-SPECIFIC SCHEMAS ====================

/**
 * Breadcrumb schema generator
 */
export const getBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

/**
 * RealEstateListing schema for individual properties
 */
export const getRealEstateListingSchema = (property: PropertySchemaData) => ({
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "@id": `${siteConfig.url}/property/${property.id}#listing`,
  name: property.title,
  description: property.description,
  url: `${siteConfig.url}/property/${property.id}`,
  datePosted: new Date(Date.now() - (property.daysOnMarket || 0) * 24 * 60 * 60 * 1000).toISOString(),
  image: property.images,
  address: {
    "@type": "PostalAddress",
    streetAddress: property.address,
    addressLocality: property.city,
    addressRegion: property.state,
    postalCode: property.zip,
    addressCountry: "US",
  },
  geo: property.latitude && property.longitude ? {
    "@type": "GeoCoordinates",
    latitude: property.latitude,
    longitude: property.longitude,
  } : undefined,
  offers: {
    "@type": "Offer",
    price: property.price,
    priceCurrency: "USD",
    availability: property.status === "Sold" 
      ? "https://schema.org/SoldOut" 
      : "https://schema.org/InStock",
    priceSpecification: property.priceType === "lease" ? {
      "@type": "UnitPriceSpecification",
      price: property.price,
      priceCurrency: "USD",
      unitText: "MONTH",
    } : undefined,
    seller: {
      "@id": `${siteConfig.url}#agent`,
    },
  },
  numberOfRooms: property.beds,
  numberOfBathroomsTotal: property.baths,
  floorSize: {
    "@type": "QuantitativeValue",
    value: property.sqft,
    unitCode: "FTK",
  },
  yearBuilt: property.yearBuilt,
  amenityFeature: property.features?.map((feature) => ({
    "@type": "LocationFeatureSpecification",
    name: feature,
    value: true,
  })),
  additionalType: `https://schema.org/${property.propertyType.replace(/_/g, "")}`,
});

/**
 * Product schema for properties (for rich results)
 */
export const getPropertyProductSchema = (property: PropertySchemaData) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: property.title,
  description: property.description,
  image: property.images[0],
  sku: property.mlsNumber || property.id,
  brand: {
    "@type": "Organization",
    name: siteConfig.name,
  },
  offers: {
    "@type": "Offer",
    url: `${siteConfig.url}/property/${property.id}`,
    priceCurrency: "USD",
    price: property.price,
    availability: property.status === "Sold" 
      ? "https://schema.org/SoldOut" 
      : "https://schema.org/InStock",
    seller: {
      "@type": "RealEstateAgent",
      name: siteConfig.agent.name,
      telephone: siteConfig.phone,
      email: siteConfig.email,
    },
    validFrom: new Date().toISOString(),
  },
  additionalProperty: [
    { "@type": "PropertyValue", name: "Bedrooms", value: property.beds },
    { "@type": "PropertyValue", name: "Bathrooms", value: property.baths },
    { "@type": "PropertyValue", name: "Square Feet", value: property.sqft },
    { "@type": "PropertyValue", name: "Property Type", value: property.propertyType },
  ],
});

/**
 * ItemList schema for property listings page
 */
export const getPropertyListSchema = (properties: PropertySchemaData[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Properties for Sale",
  description: "Luxury homes and properties for sale in Houston and surrounding areas",
  url: `${siteConfig.url}/listings`,
  numberOfItems: properties.length,
  itemListElement: properties.slice(0, 20).map((listing, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "RealEstateListing",
      "@id": `${siteConfig.url}/property/${listing.id}`,
      name: listing.title,
      url: `${siteConfig.url}/property/${listing.id}`,
      description: listing.description,
      image: listing.images[0],
      offers: {
        "@type": "Offer",
        price: listing.price,
        priceCurrency: "USD",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: listing.address,
        addressLocality: listing.city,
        addressRegion: listing.state,
      },
    },
  })),
});

/**
 * Article/BlogPosting schema
 */
export const getArticleSchema = (post: BlogPostSchemaData) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${siteConfig.url}/blog/${post.slug}#article`,
  headline: post.title,
  description: post.excerpt,
  image: post.featuredImage,
  datePublished: post.publishedAt,
  dateModified: post.publishedAt,
  wordCount: post.content.split(/\s+/).length,
  author: {
    "@type": "Person",
    name: post.author,
    url: `${siteConfig.url}/about`,
  },
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/logo-primary.jpeg`,
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${siteConfig.url}/blog/${post.slug}`,
  },
  articleSection: post.category,
  timeRequired: `PT${post.readTime || 5}M`,
  inLanguage: "en-US",
});

/**
 * FAQPage schema
 */
export const getFAQSchema = (faqs: FAQItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

/**
 * Service schema for service pages
 */
export const getServiceSchema = (service: { name: string; description: string; url: string }) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.name,
  description: service.description,
  url: service.url,
  provider: {
    "@id": `${siteConfig.url}#agent`,
  },
  areaServed: siteConfig.serviceAreas.map((area) => ({
    "@type": "City",
    name: area,
  })),
  serviceType: "Real Estate Services",
});

/**
 * ContactPage schema
 */
export const getContactPageSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Contact ${siteConfig.agent.name}`,
  description: `Get in touch with ${siteConfig.agent.name} for all your real estate needs in Houston and surrounding areas.`,
  url: `${siteConfig.url}/contact`,
  mainEntity: {
    "@id": `${siteConfig.url}#agent`,
  },
});

/**
 * ProfilePage schema for About page
 */
export const getProfilePageSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: `About ${siteConfig.agent.name}`,
  description: `Learn more about ${siteConfig.agent.name}, a dedicated real estate professional serving Houston and surrounding areas.`,
  url: `${siteConfig.url}/about`,
  mainEntity: {
    "@id": `${siteConfig.url}#person`,
  },
});

/**
 * Place schema for neighborhood pages
 */
export const getNeighborhoodSchema = (neighborhood: {
  name: string;
  description: string;
  slug: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Place",
  "@id": `${siteConfig.url}/neighborhoods/${neighborhood.slug}#place`,
  name: neighborhood.name,
  description: neighborhood.description,
  image: neighborhood.image,
  url: `${siteConfig.url}/neighborhoods/${neighborhood.slug}`,
  containedInPlace: {
    "@type": "State",
    name: "Texas",
    containedInPlace: {
      "@type": "Country",
      name: "United States",
    },
  },
});

/**
 * CollectionPage schema for neighborhoods index
 */
export const getNeighborhoodsCollectionSchema = () => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Houston Area Neighborhoods",
  description: "Explore neighborhoods served by Mike Ogunkeye Real Estate in Houston, Sugar Land, Katy, Cypress, and more.",
  url: `${siteConfig.url}/neighborhoods`,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: neighborhoods.map((n, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Place",
        name: n.name,
        description: n.description,
        url: `${siteConfig.url}/neighborhoods/${n.slug}`,
      },
    })),
  },
});

/**
 * AggregateRating schema (standalone)
 */
export const getAggregateRatingSchema = () => ({
  "@context": "https://schema.org",
  "@type": "AggregateRating",
  itemReviewed: {
    "@type": "RealEstateAgent",
    name: siteConfig.name,
  },
  ratingValue: avgRating.toFixed(1),
  bestRating: 5,
  worstRating: 1,
  ratingCount: testimonials.length,
  reviewCount: testimonials.length,
});

/**
 * Event schema for open houses
 */
export const getOpenHouseSchema = (event: {
  propertyId: string;
  propertyTitle: string;
  address: string;
  startDate: string;
  endDate: string;
  description?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  name: `Open House: ${event.propertyTitle}`,
  description: event.description || `Open house event for ${event.propertyTitle}`,
  startDate: event.startDate,
  endDate: event.endDate,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: event.propertyTitle,
    address: event.address,
  },
  organizer: {
    "@id": `${siteConfig.url}#agent`,
  },
  offers: {
    "@type": "Offer",
    price: 0,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
});

/**
 * Video schema for virtual tours
 */
export const getVideoSchema = (video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  uploadDate: string;
  duration?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: video.name,
  description: video.description,
  thumbnailUrl: video.thumbnailUrl,
  contentUrl: video.contentUrl,
  uploadDate: video.uploadDate,
  duration: video.duration,
  publisher: {
    "@id": `${siteConfig.url}#organization`,
  },
});

// ==================== HELPER COMPONENTS ====================

/**
 * Generate all homepage schemas
 */
export const getHomepageSchemas = () => [
  getRealEstateAgentSchema(),
  getPersonSchema(),
  getWebSiteSchema(),
  getLocalBusinessSchema(),
  getOrganizationSchema(),
  getBreadcrumbSchema([{ name: "Home", url: siteConfig.url }]),
];

/**
 * Generate property detail page schemas
 */
export const getPropertyDetailSchemas = (property: PropertySchemaData) => [
  getRealEstateListingSchema(property),
  getPropertyProductSchema(property),
  getBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Listings", url: `${siteConfig.url}/listings` },
    { name: property.title, url: `${siteConfig.url}/property/${property.id}` },
  ]),
];

/**
 * Generate listings page schemas
 */
export const getListingsPageSchemas = (properties: PropertySchemaData[]) => [
  getPropertyListSchema(properties),
  getBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Listings", url: `${siteConfig.url}/listings` },
  ]),
];

/**
 * Generate about page schemas
 */
export const getAboutPageSchemas = () => [
  getProfilePageSchema(),
  getPersonSchema(),
  getBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "About", url: `${siteConfig.url}/about` },
  ]),
];

/**
 * Generate contact page schemas
 */
export const getContactPageSchemas = () => [
  getContactPageSchema(),
  getBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Contact", url: `${siteConfig.url}/contact` },
  ]),
];

/**
 * Generate blog post schemas
 */
export const getBlogPostSchemas = (post: BlogPostSchemaData) => [
  getArticleSchema(post),
  getBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Blog", url: `${siteConfig.url}/blog` },
    { name: post.title, url: `${siteConfig.url}/blog/${post.slug}` },
  ]),
];

/**
 * Generate neighborhoods page schemas
 */
export const getNeighborhoodsPageSchemas = () => [
  getNeighborhoodsCollectionSchema(),
  getBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Neighborhoods", url: `${siteConfig.url}/neighborhoods` },
  ]),
];
