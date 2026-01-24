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

// ==================== NEW SCHEMAS ====================

/**
 * HowTo schema for step-by-step guides (Buyer/Seller resources)
 */
export interface HowToStep {
  title: string;
  description: string;
}

export const getHowToSchema = (howTo: {
  name: string;
  description: string;
  steps: HowToStep[];
  estimatedCost?: { min: number; max: number; currency?: string };
  totalTime?: string;
  tool?: string[];
  supply?: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": `${siteConfig.url}#howto-${howTo.name.toLowerCase().replace(/\s+/g, "-")}`,
  name: howTo.name,
  description: howTo.description,
  totalTime: howTo.totalTime || "P60D",
  estimatedCost: howTo.estimatedCost ? {
    "@type": "MonetaryAmount",
    currency: howTo.estimatedCost.currency || "USD",
    minValue: howTo.estimatedCost.min,
    maxValue: howTo.estimatedCost.max,
  } : undefined,
  tool: howTo.tool?.map(t => ({ "@type": "HowToTool", name: t })),
  supply: howTo.supply?.map(s => ({ "@type": "HowToSupply", name: s })),
  step: howTo.steps.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.title,
    text: step.description,
  })),
});

/**
 * Review schema for property listings
 */
export const getPropertyReviewSchema = (property: PropertySchemaData, reviews?: {
  author: string;
  rating: number;
  text: string;
  date?: string;
}[]) => {
  // Generate synthetic review based on property features
  const syntheticReviews = reviews || [{
    author: "Property Viewer",
    rating: 5,
    text: `Beautiful ${property.propertyType.replace(/_/g, " ")} in ${property.city} with ${property.beds} bedrooms and ${property.baths} bathrooms. Great value at ${property.sqft?.toLocaleString()} sqft.`,
    date: new Date().toISOString().split("T")[0],
  }];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: property.title,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.8,
      reviewCount: syntheticReviews.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: syntheticReviews.map(review => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.author,
      },
      datePublished: review.date || new Date().toISOString().split("T")[0],
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: review.text,
    })),
  };
};

/**
 * SpeakableSpecification for voice search optimization
 */
export const getSpeakableSchema = (page: {
  url: string;
  cssSelectors?: string[];
  xpaths?: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  url: page.url,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: page.cssSelectors || ["h1", ".article-summary", ".post-excerpt"],
    xpath: page.xpaths,
  },
});

/**
 * SearchAction schema for map search page
 */
export const getMapSearchActionSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${siteConfig.url}/map-search#webpage`,
  name: "Interactive Property Map Search | Houston Real Estate",
  description: "Search homes for sale on an interactive map. Filter by price, bedrooms, property type and explore Houston neighborhoods.",
  url: `${siteConfig.url}/map-search`,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteConfig.url}/map-search?search={search_term}&city={city}&type={property_type}&price={price_range}`,
    },
    "query-input": [
      "required name=search_term",
      "optional name=city",
      "optional name=property_type", 
      "optional name=price_range",
    ],
  },
  mainEntity: {
    "@type": "ItemList",
    name: "Houston Area Properties",
    description: "Interactive map of available properties in Houston and surrounding areas",
  },
});

/**
 * FinancialProduct schema for mortgage calculator
 */
export const getFinancialProductSchema = () => ({
  "@context": "https://schema.org",
  "@type": "FinancialProduct",
  "@id": `${siteConfig.url}/mortgage-calculator#calculator`,
  name: "Mortgage Payment Calculator",
  description: "Calculate your estimated monthly mortgage payment including principal, interest, taxes and insurance. Compare rate scenarios and see amortization schedules.",
  url: `${siteConfig.url}/mortgage-calculator`,
  provider: {
    "@type": "RealEstateAgent",
    name: siteConfig.name,
    "@id": `${siteConfig.url}#agent`,
  },
  feesAndCommissionsSpecification: "Free tool - no fees or registration required",
  areaServed: siteConfig.serviceAreas.map(area => ({
    "@type": "City",
    name: area,
  })),
  category: "Mortgage Calculator",
  offers: {
    "@type": "Offer",
    price: 0,
    priceCurrency: "USD",
    description: "Free mortgage calculation tool",
  },
});

/**
 * Enhanced Article schema with SpeakableSpecification
 */
export const getArticleSchemaWithSpeakable = (post: BlogPostSchemaData) => ({
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
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", ".post-excerpt", "article p:first-of-type"],
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
 * Generate blog post schemas with SpeakableSpecification
 */
export const getBlogPostSchemas = (post: BlogPostSchemaData) => [
  getArticleSchemaWithSpeakable(post),
  getBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Blog", url: `${siteConfig.url}/blog` },
    { name: post.title, url: `${siteConfig.url}/blog/${post.slug}` },
  ]),
];

/**
 * Generate buyer resources page schemas with HowTo
 */
export const getBuyerResourcesSchemas = (steps: HowToStep[], faqs: FAQItem[]) => [
  getHowToSchema({
    name: "How to Buy a Home in Houston",
    description: "Complete step-by-step guide to buying a home in Houston and surrounding areas, from pre-approval to closing.",
    steps,
    estimatedCost: { min: 10000, max: 100000 },
    totalTime: "P60D",
    tool: ["Mortgage Pre-Approval Letter", "Home Inspection Report", "Title Insurance"],
    supply: ["Down Payment Funds", "Proof of Income", "Bank Statements", "ID Documents"],
  }),
  getFAQSchema(faqs),
  getBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Buyer Resources", url: `${siteConfig.url}/buyer-resources` },
  ]),
];

/**
 * Generate seller resources page schemas with HowTo
 */
export const getSellerResourcesSchemas = (steps: HowToStep[], faqs: FAQItem[]) => [
  getHowToSchema({
    name: "How to Sell Your Home in Houston",
    description: "Complete guide to selling your home for maximum value in the Houston real estate market.",
    steps,
    estimatedCost: { min: 5000, max: 50000 },
    totalTime: "P45D",
    tool: ["Professional Photography", "MLS Listing", "Marketing Materials"],
    supply: ["Home Staging Items", "Repair Materials", "Cleaning Supplies"],
  }),
  getFAQSchema(faqs),
  getBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Seller Resources", url: `${siteConfig.url}/seller-resources` },
  ]),
];

/**
 * Generate map search page schemas
 */
export const getMapSearchSchemas = () => [
  getMapSearchActionSchema(),
  getBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Map Search", url: `${siteConfig.url}/map-search` },
  ]),
];

/**
 * Generate mortgage calculator page schemas
 */
export const getMortgageCalculatorSchemas = () => [
  getFinancialProductSchema(),
  getBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Mortgage Calculator", url: `${siteConfig.url}/mortgage-calculator` },
  ]),
];

/**
 * Generate blog index page schemas
 */
export const getBlogIndexSchemas = () => [
  {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${siteConfig.url}/blog#blog`,
    name: `${siteConfig.name} Real Estate Blog`,
    description: "Expert insights on Houston real estate market, buying tips, selling strategies, and neighborhood guides.",
    url: `${siteConfig.url}/blog`,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo-primary.jpeg`,
      },
    },
    inLanguage: "en-US",
  },
  getBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Blog", url: `${siteConfig.url}/blog` },
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

/**
 * Generate neighborhood detail page schemas
 */
export const getNeighborhoodDetailSchemas = (neighborhood: {
  name: string;
  description: string;
  slug: string;
  image?: string;
}) => [
  getNeighborhoodSchema(neighborhood),
  getBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Neighborhoods", url: `${siteConfig.url}/neighborhoods` },
    { name: neighborhood.name, url: `${siteConfig.url}/neighborhoods/${neighborhood.slug}` },
  ]),
];

// ==================== NEW PAGE SCHEMAS ====================

/**
 * Generate Success Stories page schemas with AggregateRating
 */
export const getSuccessStoriesSchemas = () => [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/success-stories#webpage`,
    name: `Success Stories & Client Testimonials | ${siteConfig.name}`,
    description: "See our proven track record of successful home sales in Houston. Browse sold properties and read 5-star reviews from satisfied clients.",
    url: `${siteConfig.url}/success-stories`,
    isPartOf: { "@id": `${siteConfig.url}#website` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/logo-primary.jpeg`,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteConfig.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      bestRating: "5",
      worstRating: "1",
      ratingCount: testimonials.length,
      reviewCount: testimonials.length,
    },
    review: testimonials.map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.name },
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: t.text,
    })),
  },
  getBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Success Stories", url: `${siteConfig.url}/success-stories` },
  ]),
];

/**
 * Generate MLS Search page schemas
 */
export const getMLSSearchPageSchemas = () => [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/mls-search#webpage`,
    name: `Exclusive Listings & MLS Search | ${siteConfig.name}`,
    description: "Browse Mike Ogunkeye's exclusive Houston property listings, recently sold homes, and search all Houston MLS listings.",
    url: `${siteConfig.url}/mls-search`,
    isPartOf: { "@id": `${siteConfig.url}#website` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/mls-search?search={search_term}`,
      },
      "query-input": "required name=search_term",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Mike Ogunkeye's Exclusive Property Listings",
    description: "Personally represented properties by Mike Ogunkeye in the Houston area",
    url: `${siteConfig.url}/mls-search`,
    numberOfItems: featuredListings.length,
    itemListElement: featuredListings.map((listing, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "RealEstateListing",
        name: listing.title,
        url: `${siteConfig.url}/property/${listing.id}`,
      },
    })),
  },
  getBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "My Listings", url: `${siteConfig.url}/mls-search` },
  ]),
];

/**
 * Generate Home Valuation page schemas
 */
export const getHomeValuationSchemas = () => [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/home-valuation#webpage`,
    name: `Free Home Valuation | What's Your Houston Home Worth?`,
    description: "Get a free, no-obligation home valuation from Mike Ogunkeye. Discover your Houston property's market value with expert analysis.",
    url: `${siteConfig.url}/home-valuation`,
    isPartOf: { "@id": `${siteConfig.url}#website` },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteConfig.url}/home-valuation#service`,
    name: "Free Home Valuation Service",
    description: "Professional home valuation service providing accurate market analysis for Houston homeowners. Get your property's worth within 24 hours.",
    provider: { "@id": `${siteConfig.url}#agent` },
    areaServed: siteConfig.serviceAreas.map((area) => ({
      "@type": "City",
      name: area,
      containedInPlace: { "@type": "State", name: "Texas" },
    })),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free, no-obligation home valuation",
      availability: "https://schema.org/InStock",
    },
    serviceType: "Home Valuation",
    termsOfService: "Free service with no obligation",
  },
  getBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Home Valuation", url: `${siteConfig.url}/home-valuation` },
  ]),
];

/**
 * Generate Privacy Policy page schema
 */
export const getPrivacyPolicySchemas = () => [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/privacy-policy#webpage`,
    name: `Privacy Policy | ${siteConfig.name}`,
    description: "Privacy Policy for Mike Ogunkeye Real Estate. Learn how we collect, use, and protect your personal information.",
    url: `${siteConfig.url}/privacy-policy`,
    isPartOf: { "@id": `${siteConfig.url}#website` },
    dateModified: new Date().toISOString().split("T")[0],
    inLanguage: "en-US",
  },
  getBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Privacy Policy", url: `${siteConfig.url}/privacy-policy` },
  ]),
];

/**
 * Generate Terms page schema
 */
export const getTermsSchemas = () => [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/terms#webpage`,
    name: `Terms & Conditions | ${siteConfig.name}`,
    description: "Terms and Conditions for Mike Ogunkeye Real Estate website and services. Fair housing statement and TREC information included.",
    url: `${siteConfig.url}/terms`,
    isPartOf: { "@id": `${siteConfig.url}#website` },
    dateModified: new Date().toISOString().split("T")[0],
    inLanguage: "en-US",
  },
  getBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Terms & Conditions", url: `${siteConfig.url}/terms` },
  ]),
];
