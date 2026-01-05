import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";

export interface PropertyListing {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  priceType: "sale" | "lease";
  beds: number;
  baths: number;
  sqft: number;
  lotSize?: string;
  yearBuilt?: number;
  propertyType: string;
  status: string;
  featured: boolean;
  description: string;
  features: string[];
  images: string[];
  virtualTourUrl?: string;
  matterportUrl?: string;
  hoaFee?: number;
  garage?: number;
  stories?: number;
  heating?: string;
  cooling?: string;
  flooring?: string[];
  appliances?: string[];
  neighborhood?: string;
  school_district?: string;
  latitude?: number;
  longitude?: number;
  mlsNumber?: string;
  daysOnMarket?: number;
}

export const allListings: PropertyListing[] = [
  {
    id: "10507-halley-lane",
    title: "Stunning 5-Bedroom Estate in Richmond",
    address: "10507 Halley Lane",
    city: "Richmond",
    state: "TX",
    zip: "77406",
    price: 5000,
    priceType: "lease",
    beds: 5,
    baths: 5,
    sqft: 3840,
    lotSize: "0.25 acres",
    yearBuilt: 2019,
    propertyType: "Single Family Home",
    status: "For Lease",
    featured: true,
    description: "Welcome to this magnificent 5-bedroom, 5-bathroom estate located in the prestigious Aliana community of Richmond, TX. This stunning property offers over 3,800 square feet of luxurious living space, featuring high ceilings, an open floor plan, and premium finishes throughout. The gourmet kitchen boasts granite countertops, stainless steel appliances, and a large island perfect for entertaining. The primary suite is a true retreat with a spa-like bathroom and spacious walk-in closet. With a 3-car garage, covered patio, and beautifully landscaped yard, this home is perfect for families seeking the ultimate in comfort and style.",
    features: [
      "Open Floor Plan",
      "High Ceilings",
      "Granite Countertops",
      "Stainless Steel Appliances",
      "Primary Suite Retreat",
      "Spa-Like Bathroom",
      "Walk-in Closet",
      "3-Car Garage",
      "Covered Patio",
      "Smart Home Features",
      "Energy Efficient",
      "Community Pool",
    ],
    images: [
      "https://dlajgvw9htjpb.cloudfront.net/cms/0546c848-65fb-4216-bc9b-625e1eafc6bf/86221175/-2798420792025013588.jpg",
      listing1,
      listing2,
      listing3,
    ],
    virtualTourUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    matterportUrl: "https://my.matterport.com/show/?m=SxQL3iGyvWk",
    hoaFee: 150,
    garage: 3,
    stories: 2,
    heating: "Central",
    cooling: "Central Air",
    flooring: ["Hardwood", "Tile", "Carpet"],
    appliances: ["Refrigerator", "Dishwasher", "Microwave", "Oven", "Garbage Disposal"],
    neighborhood: "Aliana",
    school_district: "Fort Bend ISD",
    latitude: 29.5530,
    longitude: -95.7530,
    mlsNumber: "MLS-2024-001",
    daysOnMarket: 14,
  },
  {
    id: "7735-coburn-drive",
    title: "Charming 3-Bedroom Home in Beaumont",
    address: "7735 Coburn Drive",
    city: "Beaumont",
    state: "TX",
    zip: "77707",
    price: 175000,
    priceType: "sale",
    beds: 3,
    baths: 2,
    sqft: 2436,
    lotSize: "0.18 acres",
    yearBuilt: 1985,
    propertyType: "Single Family Home",
    status: "For Sale",
    featured: true,
    description: "This well-maintained 3-bedroom home offers exceptional value in a quiet Beaumont neighborhood. With over 2,400 square feet of living space, this property features a spacious living room, updated kitchen, and large bedrooms. The mature trees and landscaped yard provide privacy and curb appeal. Perfect for first-time buyers or investors looking for a solid property with great potential.",
    features: [
      "Updated Kitchen",
      "Large Bedrooms",
      "Mature Trees",
      "Landscaped Yard",
      "2-Car Garage",
      "Storage Space",
      "New HVAC",
      "Fresh Paint",
    ],
    images: [
      "https://dlajgvw9htjpb.cloudfront.net/cms/0546c848-65fb-4216-bc9b-625e1eafc6bf/6820929/-7189515740131590123.jpg",
      listing2,
      listing3,
      listing1,
    ],
    garage: 2,
    stories: 1,
    heating: "Central",
    cooling: "Central Air",
    flooring: ["Carpet", "Tile"],
    appliances: ["Refrigerator", "Dishwasher", "Range"],
    school_district: "Beaumont ISD",
    latitude: 30.0802,
    longitude: -94.1266,
    mlsNumber: "MLS-2024-002",
    daysOnMarket: 21,
  },
  {
    id: "8114-bassett-street",
    title: "Prime Land Opportunity in Houston",
    address: "8114 Bassett Street",
    city: "Houston",
    state: "TX",
    zip: "77061",
    price: 75000,
    priceType: "sale",
    beds: 0,
    baths: 0,
    sqft: 3001,
    lotSize: "3,001 sqft",
    propertyType: "Land",
    status: "For Sale",
    featured: false,
    description: "Exceptional opportunity to own a prime piece of land in Houston. This 3,001 square foot lot is perfect for building your dream home or investment property. Located in a growing area with easy access to major highways and amenities. Utilities available at the street. Don't miss this chance to invest in Houston's future!",
    features: [
      "Utilities Available",
      "Level Lot",
      "Easy Highway Access",
      "Growing Area",
      "Build Your Dream Home",
      "Investment Opportunity",
    ],
    images: [
      "https://dlajgvw9htjpb.cloudfront.net/cms/0546c848-65fb-4216-bc9b-625e1eafc6bf/40519433/7120993268281597033.jpg",
      listing3,
      listing1,
    ],
    latitude: 29.6750,
    longitude: -95.2990,
    mlsNumber: "MLS-2024-003",
    daysOnMarket: 45,
  },
  {
    id: "modern-estate-sugar-land",
    title: "Modern Estate in Sugar Land",
    address: "4521 Sweetwater Blvd",
    city: "Sugar Land",
    state: "TX",
    zip: "77479",
    price: 1250000,
    priceType: "sale",
    beds: 5,
    baths: 4.5,
    sqft: 4800,
    lotSize: "0.35 acres",
    yearBuilt: 2021,
    propertyType: "Single Family Home",
    status: "For Sale",
    featured: true,
    description: "Experience luxury living in this stunning modern estate in Sugar Land's most prestigious neighborhood. This architectural masterpiece features 5 bedrooms, 4.5 bathrooms, and nearly 5,000 square feet of impeccable design. The grand foyer leads to soaring ceilings and walls of windows that flood the home with natural light. The chef's kitchen features top-of-the-line appliances, custom cabinetry, and a massive island. The primary suite is a private sanctuary with a sitting area, spa bathroom, and custom closet. The outdoor living space includes a covered patio, summer kitchen, and resort-style pool.",
    features: [
      "Resort-Style Pool",
      "Summer Kitchen",
      "Smart Home Technology",
      "Wine Cellar",
      "Home Theater",
      "Custom Closets",
      "3-Car Garage",
      "Gated Community",
      "Top-Rated Schools",
      "Energy Star Certified",
    ],
    images: [
      listing1,
      listing2,
      listing3,
    ],
    virtualTourUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    matterportUrl: "https://my.matterport.com/show/?m=SxQL3iGyvWk",
    hoaFee: 350,
    garage: 3,
    stories: 2,
    heating: "Central, Zoned",
    cooling: "Central Air, Zoned",
    flooring: ["Hardwood", "Marble", "Carpet"],
    appliances: ["Built-in Refrigerator", "Double Oven", "Gas Cooktop", "Wine Cooler", "Dishwasher"],
    neighborhood: "Sweetwater",
    school_district: "Fort Bend ISD",
    latitude: 29.5827,
    longitude: -95.6345,
    mlsNumber: "MLS-2024-004",
    daysOnMarket: 7,
  },
  {
    id: "contemporary-home-katy",
    title: "Contemporary Home in Katy",
    address: "789 Grand Pkwy",
    city: "Katy",
    state: "TX",
    zip: "77494",
    price: 875000,
    priceType: "sale",
    beds: 4,
    baths: 3.5,
    sqft: 3600,
    lotSize: "0.28 acres",
    yearBuilt: 2020,
    propertyType: "Single Family Home",
    status: "For Sale",
    featured: true,
    description: "This contemporary masterpiece in Katy offers the perfect blend of modern design and family-friendly living. With 4 bedrooms, 3.5 bathrooms, and 3,600 square feet, this home is designed for both entertaining and everyday comfort. The open-concept living area features floor-to-ceiling windows, designer finishes, and seamless indoor-outdoor flow. The gourmet kitchen is a chef's dream with quartz countertops and premium appliances. Located in a top-rated school district with easy access to shopping, dining, and entertainment.",
    features: [
      "Floor-to-Ceiling Windows",
      "Open Concept",
      "Quartz Countertops",
      "Premium Appliances",
      "Covered Patio",
      "Sprinkler System",
      "2-Car Garage",
      "Home Office",
    ],
    images: [
      listing2,
      listing1,
      listing3,
    ],
    hoaFee: 200,
    garage: 2,
    stories: 2,
    heating: "Central",
    cooling: "Central Air",
    flooring: ["Engineered Hardwood", "Tile", "Carpet"],
    appliances: ["Refrigerator", "Gas Range", "Dishwasher", "Microwave"],
    neighborhood: "Cinco Ranch",
    school_district: "Katy ISD",
    latitude: 29.7353,
    longitude: -95.7477,
    mlsNumber: "MLS-2024-005",
    daysOnMarket: 12,
  },
  {
    id: "elegant-townhome-cypress",
    title: "Elegant Townhome in Cypress",
    address: "1234 Cypress Creek Dr",
    city: "Cypress",
    state: "TX",
    zip: "77429",
    price: 525000,
    priceType: "sale",
    beds: 3,
    baths: 2.5,
    sqft: 2400,
    lotSize: "0.12 acres",
    yearBuilt: 2022,
    propertyType: "Townhouse",
    status: "For Sale",
    featured: false,
    description: "This elegant townhome in Cypress offers low-maintenance luxury living at its finest. Featuring 3 bedrooms, 2.5 bathrooms, and 2,400 square feet of thoughtfully designed space. The main level boasts an open floor plan with a gourmet kitchen, dining area, and living room that opens to a private courtyard. The upper level features a spacious primary suite and two additional bedrooms. Located near the scenic Cypress Creek with easy access to trails, parks, and nature preserves.",
    features: [
      "Low Maintenance",
      "Private Courtyard",
      "Gourmet Kitchen",
      "Near Nature Trails",
      "Attached Garage",
      "Community Amenities",
      "Energy Efficient",
      "Modern Finishes",
    ],
    images: [
      listing3,
      listing2,
      listing1,
    ],
    hoaFee: 275,
    garage: 2,
    stories: 2,
    heating: "Central",
    cooling: "Central Air",
    flooring: ["Luxury Vinyl Plank", "Tile", "Carpet"],
    appliances: ["Refrigerator", "Dishwasher", "Range", "Microwave"],
    neighborhood: "Cypress Creek Lakes",
    school_district: "Cypress-Fairbanks ISD",
    latitude: 29.9691,
    longitude: -95.6970,
    mlsNumber: "MLS-2024-006",
    daysOnMarket: 28,
  },
];

export function getListingById(id: string): PropertyListing | undefined {
  return allListings.find((listing) => listing.id === id);
}

export function formatPrice(price: number, priceType: "sale" | "lease" = "sale"): string {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
  return priceType === "lease" ? `${formatted}/mo` : formatted;
}

export function getFeaturedListings(): PropertyListing[] {
  return allListings.filter((listing) => listing.featured);
}
