import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, MapPin, Home, TrendingUp, School, Trees, ChevronLeft, Star, Building2, Users, Shield, CheckCircle, Phone, GraduationCap, DollarSign, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/InteractiveEffects";
import { siteConfig } from "@/lib/siteConfig";
import { getNeighborhoodsPageSchemas, getNeighborhoodDetailSchemas, getFAQSchema } from "@/lib/schema";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { allListings } from "@/lib/listingsData";
import { PropertyCard } from "@/components/listings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SchoolInfo {
  name: string;
  type: string;
  rating: string;
  grades: string;
}

interface MarketData {
  medianPrice: string;
  priceChange: string;
  avgDaysOnMarket: string;
  inventory: string;
  pricePerSqFt: string;
  soldLastMonth: string;
}

interface NeighborhoodFAQ {
  question: string;
  answer: string;
}

const neighborhoods = [
  {
    name: "Houston",
    slug: "houston",
    description: "The heart of Texas, offering diverse neighborhoods from the bustling downtown to serene suburban enclaves. Houston provides endless opportunities for every lifestyle.",
    longDescription: "Houston is the fourth-largest city in the United States and the largest in Texas, home to over 2.3 million residents across 640 square miles. The city's economy is powered by the energy, aerospace, healthcare, and technology industries, with the Texas Medical Center — the world's largest — and NASA's Johnson Space Center anchoring major employment corridors. Houston's 88 distinct neighborhoods range from the grand estates of River Oaks and Memorial Villages to the eclectic charm of Montrose and The Heights, the urban energy of Midtown and Downtown, and the family-oriented suburbs of Meyerland and Bellaire. The Museum District houses 19 museums, while the Theater District is one of only five U.S. cities with permanent professional companies in opera, ballet, symphony, and theater. With no state income tax, a cost of living 5% below the national average, and an international culinary scene recognized by the James Beard Foundation, Houston offers a quality of life that attracts families, professionals, and investors from around the world.",
    highlights: ["World-Class Dining", "Cultural Districts", "Medical Center", "Energy Corridor"],
    stats: { listings: "2,500+", avgPrice: "$485K", schools: "45+", parks: "100+" },
    icon: "🏙️",
    image: "https://images.unsplash.com/photo-1548519577-80d11c5f62bf?w=800",
    features: [
      { icon: Building2, title: "Business Hub", description: "Home to 24 Fortune 500 companies and thriving startups" },
      { icon: Users, title: "Diverse Culture", description: "Most ethnically diverse major city in the nation" },
      { icon: Shield, title: "Strong Economy", description: "Leading industries in energy, healthcare, aerospace, and tech" },
    ],
    schools: [
      { name: "Houston ISD", type: "Public District", rating: "B+", grades: "PK-12" },
      { name: "Carnegie Vanguard High School", type: "Public Magnet", rating: "A+", grades: "9-12" },
      { name: "DeBakey High School for Health Professions", type: "Public Magnet", rating: "A+", grades: "9-12" },
      { name: "St. John's School", type: "Private", rating: "A+", grades: "K-12" },
      { name: "The Kinkaid School", type: "Private", rating: "A+", grades: "PK-12" },
      { name: "Lamar High School", type: "Public", rating: "A", grades: "9-12" },
    ] as SchoolInfo[],
    marketData: {
      medianPrice: "$485,000",
      priceChange: "+4.2%",
      avgDaysOnMarket: "28",
      inventory: "2,847",
      pricePerSqFt: "$198",
      soldLastMonth: "1,245",
    } as MarketData,
    faqs: [
      { question: "What are the best neighborhoods in Houston for families?", answer: "Top family-friendly neighborhoods include Bellaire, Meyerland, West University Place, The Woodlands, and Memorial. These areas offer excellent schools, low crime rates, parks, and community programs. Sugar Land and Katy are also popular suburban options with top-rated school districts." },
      { question: "How is the Houston real estate market in 2026?", answer: "The Houston real estate market remains strong with steady appreciation. Median home prices have increased 4.2% year-over-year, and homes sell in an average of 28 days. The energy sector recovery, job growth, and population influx continue to drive demand, making it a great time for both buyers and sellers." },
      { question: "What is the cost of living in Houston?", answer: "Houston's cost of living is approximately 5% below the national average. Texas has no state income tax, which provides significant savings. Housing costs are considerably lower than other major metros like New York, San Francisco, or Los Angeles, while offering comparable amenities and job opportunities." },
    ] as NeighborhoodFAQ[],
    buyingTips: [
      "Research flood zones — Houston is prone to flooding, so always check FEMA flood maps before purchasing",
      "Factor in HOA fees which vary significantly between neighborhoods and can range from $200 to $3,000+ monthly",
      "Consider commute times — Houston traffic can be significant, so choose neighborhoods near your workplace",
      "Get a thorough home inspection including foundation check, as Houston's clay soil causes foundation issues",
      "Work with a local agent who knows the micro-markets — pricing varies dramatically between neighborhoods",
    ],
  },
  {
    name: "Sugar Land",
    slug: "sugar-land",
    description: "A master-planned community known for its excellent schools, safe neighborhoods, and family-friendly atmosphere. Sugar Land consistently ranks among the best places to live in Texas.",
    longDescription: "Sugar Land is the crown jewel of Fort Bend County and one of the most desirable suburbs in the greater Houston area. With a population of over 118,000, this master-planned city has been repeatedly recognized as one of America's best places to live by CNN Money, WalletHub, and Niche.com. The city's exceptional quality of life centers around Fort Bend ISD — consistently ranked among the top school districts in Texas — making it the top destination for families relocating to the Houston area. Sugar Land Town Square serves as the city's vibrant downtown, offering upscale dining, shopping, concerts, and community events year-round. Residential options range from elegant estate homes in Sweetwater and Riverstone to family-friendly neighborhoods in First Colony and Telfair, and luxury townhomes near Town Square. The University of Houston-Sugar Land campus brings educational opportunities, while Smart Financial Centre hosts world-class entertainment. With crime rates 60% below the national average, median household incomes above $110,000, and property values appreciating 5.1% annually, Sugar Land represents the gold standard of Houston suburban living.",
    highlights: ["Top-Rated Schools", "Town Square", "First Colony", "Telfair", "Sweetwater", "Riverstone"],
    stats: { listings: "800+", avgPrice: "$550K", schools: "25+", parks: "50+" },
    icon: "🏡",
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800",
    features: [
      { icon: School, title: "Excellent Education", description: "Fort Bend ISD ranked #1 large district in Houston" },
      { icon: Star, title: "Award-Winning City", description: "Named 'Best Place to Live' multiple years running" },
      { icon: Trees, title: "Beautiful Parks", description: "50+ parks with extensive hike-and-bike trail system" },
    ],
    schools: [
      { name: "Fort Bend ISD", type: "Public District", rating: "A", grades: "PK-12" },
      { name: "Clements High School", type: "Public", rating: "A+", grades: "9-12" },
      { name: "Austin High School", type: "Public", rating: "A+", grades: "9-12" },
      { name: "Dulles High School", type: "Public", rating: "A", grades: "9-12" },
      { name: "Fort Settlement Middle School", type: "Public", rating: "A+", grades: "6-8" },
      { name: "Commonwealth Elementary", type: "Public", rating: "A+", grades: "PK-5" },
    ] as SchoolInfo[],
    marketData: {
      medianPrice: "$550,000",
      priceChange: "+5.1%",
      avgDaysOnMarket: "22",
      inventory: "487",
      pricePerSqFt: "$215",
      soldLastMonth: "189",
    } as MarketData,
    faqs: [
      { question: "What are the best neighborhoods in Sugar Land for families?", answer: "The most popular family neighborhoods include First Colony, Telfair, Riverstone, Sweetwater, and New Territory. First Colony offers mature trees and established amenities, while Riverstone and Telfair feature newer construction with resort-style pools and playgrounds. Sweetwater is the luxury option with homes ranging from $500K to $2M+." },
      { question: "How are the schools in Sugar Land?", answer: "Sugar Land is served by Fort Bend ISD, consistently ranked as one of the best large school districts in Texas. Schools like Clements High School and Austin High School earn A+ ratings from Niche. The district offers strong STEM programs, International Baccalaureate, and extensive extracurricular activities." },
      { question: "Is Sugar Land a good investment for real estate?", answer: "Yes, Sugar Land has shown consistent appreciation of 4-6% annually over the past decade. Strong schools, low crime, and excellent amenities drive sustained demand. The city's planned development approach prevents oversupply, maintaining healthy property values. Rental demand is also strong due to the corporate presence." },
    ] as NeighborhoodFAQ[],
    buyingTips: [
      "Homes near Clements and Austin High School zones command a 10-15% premium — budget accordingly",
      "First Colony offers the best value for established homes with mature landscaping and lower HOA fees",
      "New construction in Riverstone starts in the mid-$400Ks — great for customization",
      "Check MUD (Municipal Utility District) tax rates which vary by subdivision and affect your total payment",
      "Sugar Land has strict deed restrictions — review HOA rules before purchasing, especially for home businesses",
    ],
  },
  {
    name: "Katy",
    slug: "katy",
    description: "One of Houston's fastest-growing suburbs, Katy offers modern developments, excellent infrastructure, and a strong sense of community with small-town charm.",
    longDescription: "Katy has evolved from a humble rice-farming community into one of the most sought-after suburbs in greater Houston, attracting over 19,000 new residents annually. The transformation is anchored by Katy ISD — one of the largest and highest-performing school districts in Texas — which consistently ranks among the state's best for academics, athletics, and facilities. The district's Legacy Stadium and Katy ISD Athletics Complex are among the finest high school sports venues in the country. Master-planned communities define Katy's residential landscape: Cinco Ranch offers lakeside living with 14 swimming pools, Cross Creek Ranch blends Texas heritage with modern amenities, and Elyson features smart-home technology in every residence. Katy Mills Mall and LaCenterra at Cinco Ranch provide world-class retail and dining, while the Katy Heritage Museum preserves the area's railroad roots. With median household incomes exceeding $95,000, home prices ranging from $250K to over $1M, and property appreciation of 4.8% annually, Katy offers exceptional value for families and professionals seeking top-tier schools, safe communities, and modern suburban living just 30 minutes west of downtown Houston.",
    highlights: ["Katy Mills", "Cinco Ranch", "Grand Lakes", "Cross Creek Ranch", "Elyson", "Cane Island"],
    stats: { listings: "1,200+", avgPrice: "$420K", schools: "30+", parks: "75+" },
    icon: "🌾",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    features: [
      { icon: Home, title: "Modern Communities", description: "Master-planned neighborhoods with resort-style amenities" },
      { icon: Users, title: "Family Friendly", description: "Top choice for families with children of all ages" },
      { icon: TrendingUp, title: "Strong Appreciation", description: "4.8% annual home value growth" },
    ],
    schools: [
      { name: "Katy ISD", type: "Public District", rating: "A", grades: "PK-12" },
      { name: "Cinco Ranch High School", type: "Public", rating: "A+", grades: "9-12" },
      { name: "Seven Lakes High School", type: "Public", rating: "A+", grades: "9-12" },
      { name: "Tompkins High School", type: "Public", rating: "A+", grades: "9-12" },
      { name: "Taylor High School", type: "Public", rating: "A", grades: "9-12" },
      { name: "Katy High School", type: "Public", rating: "A", grades: "9-12" },
    ] as SchoolInfo[],
    marketData: {
      medianPrice: "$420,000",
      priceChange: "+4.8%",
      avgDaysOnMarket: "25",
      inventory: "1,156",
      pricePerSqFt: "$172",
      soldLastMonth: "423",
    } as MarketData,
    faqs: [
      { question: "What are homes for sale in Katy TX like?", answer: "Katy offers diverse housing from starter homes in the $250Ks to luxury estates over $1M. Most homes are in master-planned communities with pools, fitness centers, and lakes. Popular subdivisions include Cinco Ranch, Cross Creek Ranch, Cane Island, and Elyson, each offering unique character and amenities." },
      { question: "How are schools in Katy ISD?", answer: "Katy ISD is one of the top-performing large districts in Texas with an overall A rating. The district has 70+ campuses serving 90,000+ students. Notable high schools include Cinco Ranch, Seven Lakes, and Tompkins, all earning A+ ratings. The district excels in academics, athletics, and fine arts." },
      { question: "Is Katy TX a good place to buy a home?", answer: "Absolutely. Katy combines excellent schools, safe neighborhoods, modern amenities, and strong property appreciation. The area's continued growth with new retail, dining, and employment centers ensures sustained demand. First-time buyers can find homes starting around $250K, while move-up buyers have abundant options." },
    ] as NeighborhoodFAQ[],
    buyingTips: [
      "Cinco Ranch homes offer the best blend of location, schools, and amenities — consider this area first",
      "Cross Creek Ranch and Cane Island have newer construction with energy-efficient features and smart home tech",
      "Budget for property taxes — Katy's MUD tax rates can bring total rates to 3.0-3.5% of assessed value",
      "I-10 and Grand Parkway access varies by subdivision — test your commute during rush hour before buying",
      "New-construction homes here often include builder incentives of $10K-$30K — always negotiate",
    ],
  },
  {
    name: "Cypress",
    slug: "cypress",
    description: "Known for its scenic beauty and nature preserves, Cypress offers a perfect blend of suburban convenience and natural tranquility with excellent schools and parks.",
    longDescription: "Cypress is one of northwest Houston's most desirable communities, offering a lifestyle centered around natural beauty, outdoor recreation, and excellent education. The area is defined by its stunning master-planned communities: Bridgeland, a 11,400-acre community by The Howard Hughes Corporation, features over 3,000 acres of parks, trails, and lakes; Towne Lake is built around a signature crystal-clear lake perfect for kayaking and paddleboarding; and Cypress Creek Lakes offers waterfront living with fishing piers and nature preserves. Cy-Fair ISD serves the area with 90+ campuses and is recognized nationally for academic excellence, earning TEA distinction designations across multiple categories. Cypress families enjoy access to some of the best youth sports programs in Texas, including the Cy-Fair Sports Association and Berry Center's world-class athletic facilities. The area's retail landscape has exploded with the development of Boardwalk at Towne Lake and Fairfield Town Center, bringing upscale dining and boutique shopping. With home prices ranging from $280K to over $800K, property appreciation of 4.5% annually, and new construction from premier builders like Toll Brothers, Perry Homes, and Taylor Morrison, Cypress attracts discerning buyers seeking space, nature, and quality schools within 35 minutes of downtown Houston.",
    highlights: ["Bridgeland", "Towne Lake", "Cypress Creek", "Black Horse Golf", "Fairfield", "Lakewood"],
    stats: { listings: "950+", avgPrice: "$395K", schools: "20+", parks: "60+" },
    icon: "🌲",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    features: [
      { icon: Trees, title: "Nature Focused", description: "3,000+ acres of parks and nature preserves in Bridgeland alone" },
      { icon: Star, title: "Golf & Recreation", description: "Black Horse Golf Club and extensive trail systems" },
      { icon: Shield, title: "Safe Communities", description: "Crime rates well below Harris County average" },
    ],
    schools: [
      { name: "Cy-Fair ISD", type: "Public District", rating: "A", grades: "PK-12" },
      { name: "Cypress Ranch High School", type: "Public", rating: "A+", grades: "9-12" },
      { name: "Cypress Woods High School", type: "Public", rating: "A", grades: "9-12" },
      { name: "Bridgeland High School", type: "Public", rating: "A+", grades: "9-12" },
      { name: "Cypress Park High School", type: "Public", rating: "A", grades: "9-12" },
      { name: "Pope Elementary", type: "Public", rating: "A+", grades: "PK-5" },
    ] as SchoolInfo[],
    marketData: {
      medianPrice: "$395,000",
      priceChange: "+4.5%",
      avgDaysOnMarket: "26",
      inventory: "892",
      pricePerSqFt: "$165",
      soldLastMonth: "312",
    } as MarketData,
    faqs: [
      { question: "What are homes for sale in Cypress TX like?", answer: "Cypress homes range from $280K to $800K+, with most in master-planned communities offering resort amenities. Bridgeland and Towne Lake are the premier communities, featuring new construction with modern floor plans, energy efficiency, and access to lakes, trails, and recreation centers." },
      { question: "How are schools in Cypress TX?", answer: "Cypress is served by Cy-Fair ISD, one of the largest and highest-rated districts in Texas. Schools like Cypress Ranch High School and Bridgeland High School earn A+ ratings. The district is known for strong STEM programs, competitive athletics, and excellent fine arts." },
      { question: "What is the commute from Cypress to downtown Houston?", answer: "The commute is typically 35-50 minutes via US-290 or the Grand Parkway (99). The new US-290 expansion has improved travel times significantly. Many residents also work in the Energy Corridor or Cy-Fair area, which are much closer at 15-25 minutes." },
    ] as NeighborhoodFAQ[],
    buyingTips: [
      "Bridgeland offers the widest range of pricing and amenities — tour this community first",
      "Towne Lake is ideal if you want waterfront living without the coastal risks",
      "Compare MUD tax rates carefully — they can add $3,000-$8,000 annually to your costs",
      "New sections of Bridgeland and Towne Lake offer the latest floor plans with competitive builder incentives",
      "The Grand Parkway (99) provides easy access to Katy, Sugar Land, and The Woodlands",
    ],
  },
  {
    name: "Richmond",
    slug: "richmond",
    description: "Historic Richmond combines old-world charm with modern amenities. The area offers affordable luxury and is experiencing rapid growth with new developments.",
    longDescription: "Richmond is the county seat of Fort Bend County and offers one of the best value propositions in the greater Houston real estate market. This historic city traces its roots to 1837 and the early days of the Republic of Texas, with a charming downtown featuring historic buildings, local restaurants, and community events like the Fort Bend County Fair — one of the largest county fairs in Texas. Modern Richmond extends beyond the historic core into master-planned communities that rival any in the Houston area: Harvest Green is a unique farm-centric community featuring a working 12-acre farm, community garden, and farm stand; Long Meadow Farms offers resort-style amenities and Fort Bend ISD schools; and Aliana provides Mediterranean-inspired architecture with extensive recreation facilities. Richmond benefits from Fort Bend ISD's excellent schools while offering home prices 20-30% below neighboring Sugar Land, making it the smart choice for value-conscious families. With median home prices around $365K, new construction starting in the low $300Ks, and property appreciation of 4.3% annually, Richmond attracts first-time buyers, growing families, and investors seeking strong returns. The Grand Parkway (99) has dramatically improved connectivity, putting downtown Houston, the Medical Center, and the Energy Corridor within 30-40 minutes.",
    highlights: ["Historic Downtown", "Pecan Grove", "Long Meadow Farms", "Harvest Green", "Aliana"],
    stats: { listings: "600+", avgPrice: "$365K", schools: "15+", parks: "40+" },
    icon: "🏛️",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    features: [
      { icon: Building2, title: "Historic Charm", description: "Rich Texas heritage since 1837 with vibrant downtown" },
      { icon: TrendingUp, title: "Best Value", description: "20-30% more affordable than neighboring Sugar Land" },
      { icon: Home, title: "Modern Communities", description: "Innovative master-planned communities with unique amenities" },
    ],
    schools: [
      { name: "Fort Bend ISD", type: "Public District", rating: "A", grades: "PK-12" },
      { name: "George Ranch High School", type: "Public", rating: "A", grades: "9-12" },
      { name: "Travis High School", type: "Public", rating: "A", grades: "9-12" },
      { name: "Baines Middle School", type: "Public", rating: "A", grades: "6-8" },
      { name: "Long Meadow Farms Elementary", type: "Public", rating: "A+", grades: "PK-5" },
      { name: "Brazos Bend Elementary", type: "Public", rating: "A", grades: "PK-5" },
    ] as SchoolInfo[],
    marketData: {
      medianPrice: "$365,000",
      priceChange: "+4.3%",
      avgDaysOnMarket: "30",
      inventory: "534",
      pricePerSqFt: "$152",
      soldLastMonth: "167",
    } as MarketData,
    faqs: [
      { question: "Is Richmond TX a good place to buy a home?", answer: "Richmond offers excellent value with Fort Bend ISD schools at prices 20-30% below Sugar Land. Communities like Harvest Green and Long Meadow Farms provide modern amenities at affordable prices. Strong appreciation of 4.3% annually makes it a solid investment." },
      { question: "What are homes for sale in Richmond TX like?", answer: "Richmond offers everything from historic homes near downtown to brand-new construction in master-planned communities. New homes start in the low $300Ks with 4-5 bedrooms. Luxury options in Aliana and Harvest Green reach $600K+. Most communities offer pools, trails, and recreation centers." },
      { question: "How far is Richmond from Houston?", answer: "Richmond is approximately 30-40 minutes southwest of downtown Houston via US-59/I-69 or the Grand Parkway. The Energy Corridor and Galleria area are 25-35 minutes away. Fort Bend County's road infrastructure continues to improve with new highway expansions." },
    ] as NeighborhoodFAQ[],
    buyingTips: [
      "Harvest Green is perfect if you value community farming, sustainability, and a unique lifestyle",
      "Long Meadow Farms offers the best schools-to-price ratio in Fort Bend County",
      "Pecan Grove is an established community with larger lots and mature trees at competitive prices",
      "New construction incentives in Richmond are among the most generous in the Houston area",
      "The area is growing fast — buying now in newer sections positions you for strong appreciation",
    ],
  },
  {
    name: "Missouri City",
    slug: "missouri-city",
    description: "A diverse, family-oriented community with excellent schools and convenient access to downtown Houston and Sugar Land.",
    longDescription: "Missouri City is a thriving, diverse suburb of 74,000 residents strategically positioned between downtown Houston and Sugar Land in Fort Bend County. The city earned national recognition for its diversity, safety, and quality of life, ranking among Money Magazine's 'Best Places to Live' and being named one of the 'Most Diverse Cities in America' by WalletHub. The jewel of Missouri City is Sienna — formerly Sienna Plantation — a 10,000-acre master-planned community by Johnson Development that features the Sienna Golf Club, a club-quality aquatic center, miles of trails, and community parks. Lake Olympia offers lakeside luxury living with waterfront homes and a private marina. Missouri City residents benefit from both Fort Bend ISD and Houston ISD school options, providing families with educational flexibility. The city's location along Highway 6 and Fort Bend Parkway Toll Road provides efficient commutes to downtown Houston (25-35 minutes), the Texas Medical Center (20-30 minutes), and Sugar Land (10-15 minutes). With median home prices around $380K, strong rental demand, and steady appreciation of 3.9% annually, Missouri City offers an exceptional blend of value, diversity, and suburban comfort.",
    highlights: ["Sienna", "Lake Olympia", "Fort Bend ISD", "Quick Commute", "Quail Valley"],
    stats: { listings: "450+", avgPrice: "$380K", schools: "18+", parks: "35+" },
    icon: "🌆",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    features: [
      { icon: Users, title: "Diverse Community", description: "One of America's most diverse and welcoming cities" },
      { icon: MapPin, title: "Central Location", description: "25 min to downtown, 10 min to Sugar Land" },
      { icon: School, title: "School Choice", description: "Access to both Fort Bend ISD and Houston ISD" },
    ],
    schools: [
      { name: "Fort Bend ISD", type: "Public District", rating: "A", grades: "PK-12" },
      { name: "Hightower High School", type: "Public", rating: "A", grades: "9-12" },
      { name: "Elkins High School", type: "Public", rating: "A", grades: "9-12" },
      { name: "Sienna Crossing Elementary", type: "Public", rating: "A+", grades: "PK-5" },
      { name: "Fort Bend Christian Academy", type: "Private", rating: "A", grades: "PK-12" },
      { name: "Sartartia Middle School", type: "Public", rating: "A", grades: "6-8" },
    ] as SchoolInfo[],
    marketData: {
      medianPrice: "$380,000",
      priceChange: "+3.9%",
      avgDaysOnMarket: "27",
      inventory: "398",
      pricePerSqFt: "$158",
      soldLastMonth: "134",
    } as MarketData,
    faqs: [
      { question: "Is Missouri City TX a good area to live?", answer: "Missouri City is excellent for families seeking diversity, good schools, and value. It's been ranked among America's best places to live by Money Magazine. Sienna is one of the top-selling master-planned communities in Texas. The central location provides easy access to Houston, Sugar Land, and Pearland." },
      { question: "What homes are for sale in Missouri City?", answer: "Missouri City offers homes from $250K starter homes to $700K+ luxury estates in Sienna and Lake Olympia. The majority of inventory falls in the $350K-$500K range with 4-5 bedrooms. New construction is available in Sienna's newer sections." },
      { question: "How are schools in Missouri City?", answer: "Missouri City is primarily served by Fort Bend ISD (A-rated) with some areas in Houston ISD. Hightower High School and Elkins High School are popular choices. Fort Bend Christian Academy and other private options are also available. The district offers strong AP and dual-credit programs." },
    ] as NeighborhoodFAQ[],
    buyingTips: [
      "Sienna is the premier community — newer sections offer the best builder incentives",
      "Lake Olympia homes hold strong value due to limited waterfront inventory",
      "Check which school district zones your target home falls in (FBISD vs HISD)",
      "Fort Bend Parkway toll road access significantly reduces commute times — factor this into location choice",
      "Missouri City offers some of the best rental ROI in Fort Bend County for investors",
    ],
  },
  {
    name: "Pearland",
    slug: "pearland",
    description: "One of Houston's fastest-growing cities, Pearland offers affordable homes, excellent schools, and quick access to downtown Houston and the Medical Center.",
    longDescription: "Pearland has experienced explosive growth over the past two decades, transforming from a small community into a city of over 130,000 residents — making it the third-largest city in the Houston metropolitan area. This southeast Houston suburb's appeal lies in its winning combination of affordability, excellent schools, and strategic location. Shadow Creek Ranch is the crown jewel of Pearland's master-planned communities, offering a Tom Fazio-designed golf course, a world-class aquatic center, and resort-style amenities. Silverlake features lakeside living with community fishing piers and paddleboard access. Pearland ISD serves the community with consistently high-performing schools, and the district's new facilities reflect the area's commitment to education. The Pearland Town Center provides upscale shopping and dining, while the Historic Old Town district offers charming restaurants, boutiques, and community events. Location is Pearland's secret weapon: downtown Houston is 20-25 minutes north, the Texas Medical Center is 15-20 minutes, and Hobby Airport is just 10 minutes away. With median home prices around $350K, new construction from the low $300Ks, and appreciation of 4.0% annually, Pearland attracts healthcare professionals, first-time buyers, and families seeking top-tier suburban living at accessible price points.",
    highlights: ["Shadow Creek Ranch", "Silverlake", "Town Center", "Pearland ISD", "Old Town"],
    stats: { listings: "700+", avgPrice: "$350K", schools: "22+", parks: "45+" },
    icon: "🌊",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
    features: [
      { icon: TrendingUp, title: "Rapid Growth", description: "One of Texas's fastest-growing cities" },
      { icon: Home, title: "Affordable Luxury", description: "New construction from the low $300Ks" },
      { icon: MapPin, title: "Prime Location", description: "15-20 min to Medical Center and Hobby Airport" },
    ],
    schools: [
      { name: "Pearland ISD", type: "Public District", rating: "A", grades: "PK-12" },
      { name: "Dawson High School", type: "Public", rating: "A+", grades: "9-12" },
      { name: "Pearland High School", type: "Public", rating: "A", grades: "9-12" },
      { name: "Shadow Creek High School", type: "Public", rating: "A+", grades: "9-12" },
      { name: "Massey Ranch Elementary", type: "Public", rating: "A+", grades: "PK-5" },
      { name: "Pearland Jr. High South", type: "Public", rating: "A", grades: "7-8" },
    ] as SchoolInfo[],
    marketData: {
      medianPrice: "$350,000",
      priceChange: "+4.0%",
      avgDaysOnMarket: "24",
      inventory: "612",
      pricePerSqFt: "$155",
      soldLastMonth: "245",
    } as MarketData,
    faqs: [
      { question: "Is Pearland a good place to buy a first home?", answer: "Pearland is one of the best options for first-time buyers in the Houston area. New construction starts in the low $300Ks with 3-4 bedrooms. Excellent Pearland ISD schools, low crime, and proximity to the Medical Center and downtown make it ideal for young professionals and growing families." },
      { question: "What are homes for sale in Pearland TX like?", answer: "Pearland offers a wide range from $250K starter homes to $600K+ luxury homes in Shadow Creek Ranch. Most communities feature pools, fitness centers, and trail systems. The mix of established and new-construction neighborhoods gives buyers plenty of options." },
      { question: "How close is Pearland to Houston?", answer: "Pearland is one of the closest suburbs to downtown Houston at just 20-25 minutes via Highway 288. The Texas Medical Center is only 15-20 minutes away, and Hobby Airport is a quick 10-minute drive. This proximity makes it extremely popular with medical professionals." },
    ] as NeighborhoodFAQ[],
    buyingTips: [
      "Shadow Creek Ranch is the premium community — homes near the golf course command the highest values",
      "Medical Center workers love Pearland for the short 15-20 minute commute via Highway 288",
      "Silverlake offers waterfront lots at prices well below coastal areas — great for outdoor enthusiasts",
      "Compare Pearland ISD school zones carefully — Dawson and Shadow Creek High School zones are most desirable",
      "New construction in Pearland's newer sections includes covered patios and upgraded finishes as standard",
    ],
  },
  {
    name: "Rosenberg",
    slug: "rosenberg",
    description: "A historic railroad town experiencing modern growth while preserving its charming downtown and Texas heritage.",
    longDescription: "Rosenberg is Fort Bend County's hidden gem — a city with authentic Texas character, a thriving downtown, and some of the most affordable new-construction homes in the greater Houston area. Founded in 1883 as a railroad hub, Rosenberg's historic downtown features the Rosenberg Railroad Museum, locally owned restaurants, and charming storefronts that give the city a genuine small-town feel. But make no mistake: Rosenberg is growing fast. The Brazos Town Center development has brought major retailers, restaurants, and services, while new master-planned communities offer modern living at prices that make first-time homeownership achievable. Lamar CISD serves Rosenberg with schools that have shown dramatic improvement in recent years, with multiple campuses earning A and B ratings from the Texas Education Agency. Housing options range from renovated historic homes near downtown starting in the $200Ks to new construction in communities like Briscoe Falls and Sunset Ranch from the mid-$200Ks. With median prices around $320K and appreciation of 3.8% annually, Rosenberg offers the lowest entry point into Fort Bend County real estate while still benefiting from the county's excellent infrastructure, low crime rates, and family-friendly culture. The Grand Parkway has transformed Rosenberg's connectivity, putting Sugar Land 15 minutes away and downtown Houston within 40 minutes.",
    highlights: ["Historic Downtown", "Brazos Town Center", "Lamar CISD", "Railroad Museum", "Briscoe Falls"],
    stats: { listings: "400+", avgPrice: "$320K", schools: "12+", parks: "30+" },
    icon: "🚂",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
    features: [
      { icon: Building2, title: "Texas Heritage", description: "140+ years of railroad history and Texas culture" },
      { icon: Star, title: "Most Affordable", description: "Lowest entry point into Fort Bend County real estate" },
      { icon: Users, title: "Community Spirit", description: "Strong local identity with festivals and events" },
    ],
    schools: [
      { name: "Lamar CISD", type: "Public District", rating: "B+", grades: "PK-12" },
      { name: "George Ranch High School", type: "Public", rating: "A", grades: "9-12" },
      { name: "Foster High School", type: "Public", rating: "B+", grades: "9-12" },
      { name: "Lamar Junior High", type: "Public", rating: "B+", grades: "7-8" },
      { name: "Beasley Elementary", type: "Public", rating: "A", grades: "PK-5" },
      { name: "Reading Junior High", type: "Public", rating: "B+", grades: "7-8" },
    ] as SchoolInfo[],
    marketData: {
      medianPrice: "$320,000",
      priceChange: "+3.8%",
      avgDaysOnMarket: "32",
      inventory: "367",
      pricePerSqFt: "$138",
      soldLastMonth: "98",
    } as MarketData,
    faqs: [
      { question: "Is Rosenberg TX a good place to buy a home?", answer: "Rosenberg is the best value in Fort Bend County. New construction starts in the mid-$200Ks — among the most affordable in the Houston area. The city is growing rapidly with new retail, restaurants, and infrastructure improvements. Appreciation of 3.8% makes it a strong investment." },
      { question: "How are schools in Rosenberg?", answer: "Rosenberg is served by Lamar CISD, which has improved significantly in recent years. George Ranch High School earns an A rating and is the top choice in the district. New school facilities are being built to accommodate the area's growth." },
      { question: "How far is Rosenberg from Houston?", answer: "Rosenberg is about 35-40 minutes southwest of downtown Houston via US-59/I-69. Sugar Land is just 15 minutes away via the Grand Parkway. The improved highway infrastructure has made Rosenberg increasingly accessible for commuters." },
    ] as NeighborhoodFAQ[],
    buyingTips: [
      "New construction in Rosenberg offers the best price-per-square-foot in Fort Bend County",
      "George Ranch High School zone homes are most desirable — focus your search here",
      "Briscoe Falls and Sunset Ranch offer the newest communities with builder incentives",
      "Historic homes near downtown can be renovated for excellent equity building",
      "Rosenberg is an excellent market for real estate investors — strong rental demand and low entry costs",
    ],
  },
];

// Get filtered listings for a neighborhood
const getNeighborhoodListings = (neighborhoodName: string) => {
  return allListings.filter(listing => {
    const city = listing.city?.toLowerCase() || "";
    const address = listing.address?.toLowerCase() || "";
    const name = neighborhoodName.toLowerCase();
    return city.includes(name) || address.includes(name);
  }).slice(0, 6);
};

const NeighborhoodDetail = ({ neighborhood }: { neighborhood: typeof neighborhoods[0] }) => {
  const schemas = getNeighborhoodDetailSchemas({
    name: neighborhood.name,
    description: neighborhood.longDescription,
    slug: neighborhood.slug,
    image: neighborhood.image,
  });

  const localListings = getNeighborhoodListings(neighborhood.name);
  const faqSchemas = neighborhood.faqs ? getFAQSchema(neighborhood.faqs) : null;

  return (
    <>
      <Helmet>
        <title>Homes for Sale in {neighborhood.name} TX | {neighborhood.stats.avgPrice} Avg | {siteConfig.name}</title>
        <meta
          name="description"
          content={`Browse ${neighborhood.stats.listings} homes for sale in ${neighborhood.name}, TX. Average price ${neighborhood.stats.avgPrice}. Top schools, market data & neighborhood guide. Contact Mike Ogunkeye, your ${neighborhood.name} real estate expert.`}
        />
        <meta name="keywords" content={`homes for sale ${neighborhood.name} TX, ${neighborhood.name} real estate, ${neighborhood.name} homes, buy house ${neighborhood.name}, ${neighborhood.name} TX realtor, ${neighborhood.name} school district, ${neighborhood.name} neighborhoods`} />
        <link rel="canonical" href={`${siteConfig.url}/neighborhoods/${neighborhood.slug}`} />
        
        <meta property="og:title" content={`Homes for Sale in ${neighborhood.name} TX | ${siteConfig.name}`} />
        <meta property="og:description" content={`${neighborhood.stats.listings} homes for sale in ${neighborhood.name}. Average price ${neighborhood.stats.avgPrice}. Expert guidance from Mike Ogunkeye.`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${siteConfig.url}/neighborhoods/${neighborhood.slug}`} />
        <meta property="og:image" content={neighborhood.image} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${neighborhood.name} TX Homes for Sale | Mike Ogunkeye`} />
        <meta name="twitter:description" content={`Find your dream home in ${neighborhood.name}. ${neighborhood.stats.listings} listings, avg ${neighborhood.stats.avgPrice}.`} />
      </Helmet>

      <SchemaMarkup schemas={faqSchemas ? [...schemas, faqSchemas] : schemas} />

      <Layout>
        {/* Hero Section */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <img src={neighborhood.image} alt={`Homes for sale in ${neighborhood.name} Texas`} className="w-full h-full object-cover" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary" />
          </div>
          <div className="container-custom relative z-10">
            <Link to="/neighborhoods" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors mb-8">
              <ChevronLeft className="h-4 w-4" /> Back to Neighborhoods
            </Link>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="text-7xl mb-6 block">{neighborhood.icon}</span>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6">
                Homes for Sale in {neighborhood.name}, TX
              </h1>
              <p className="text-xl text-primary-foreground/70 max-w-3xl leading-relaxed">
                {neighborhood.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Market Stats Bar */}
        <section className="bg-card border-b border-border py-8">
          <div className="container-custom">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6 text-center">
              {neighborhood.name} Real Estate Market Data — Updated March 2026
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
              {[
                { label: "Median Price", value: neighborhood.marketData.medianPrice, icon: DollarSign },
                { label: "YoY Change", value: neighborhood.marketData.priceChange, icon: TrendingUp },
                { label: "Avg Days on Market", value: neighborhood.marketData.avgDaysOnMarket, icon: Calendar },
                { label: "Active Listings", value: neighborhood.marketData.inventory, icon: Home },
                { label: "Price/SqFt", value: neighborhood.marketData.pricePerSqFt, icon: MapPin },
                { label: "Sold Last Month", value: neighborhood.marketData.soldLastMonth, icon: CheckCircle },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="text-center">
                  <stat.icon className="h-5 w-5 text-accent mx-auto mb-2" />
                  <p className="font-serif text-2xl md:text-3xl font-bold text-accent">{stat.value}</p>
                  <p className="text-muted-foreground text-xs mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <RevealOnScroll>
                <p className="text-accent font-medium tracking-wider uppercase mb-2">About {neighborhood.name}</p>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Why Choose {neighborhood.name}?
                </h2>
                <div className="text-muted-foreground leading-relaxed mb-8 space-y-4">
                  <p>{neighborhood.longDescription}</p>
                </div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {neighborhood.highlights.map((highlight) => (
                    <span key={highlight} className="px-4 py-2 bg-accent/10 text-accent text-sm rounded-full font-medium">
                      {highlight}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <Link to={`/listings?city=${encodeURIComponent(neighborhood.name)}`}>
                    <Button variant="gold" size="lg">
                      View {neighborhood.name} Homes <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline" size="lg">Contact Expert</Button>
                  </Link>
                </div>
              </RevealOnScroll>

              <StaggerContainer className="grid grid-cols-1 gap-6">
                {neighborhood.features.map((feature) => (
                  <StaggerItem key={feature.title}>
                    <Card className="p-6 border-0 shadow-card hover:shadow-card-hover transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                          <feature.icon className="h-7 w-7 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                          <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </div>
                      </div>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </section>

        {/* Schools Section */}
        <section className="section-padding bg-secondary">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <GraduationCap className="h-10 w-10 text-accent mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                {neighborhood.name} Schools & Education
              </h2>
              <p className="text-muted-foreground text-lg">
                Top-rated schools serving the {neighborhood.name} area. School quality is one of the biggest factors in home values and family satisfaction.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {neighborhood.schools.map((school) => (
                <Card key={school.name} className="p-6 border-0 shadow-card">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-foreground text-sm">{school.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      school.rating.includes("+") ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : 
                      school.rating.startsWith("A") ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" : 
                      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}>
                      {school.rating}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">{school.type} • Grades {school.grades}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Buying Tips */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
                Tips for Buying a Home in {neighborhood.name}
              </h2>
              <p className="text-muted-foreground text-center mb-10 text-lg">
                Insider advice from Mike Ogunkeye based on years of experience in the {neighborhood.name} market
              </p>
              <div className="space-y-4">
                {neighborhood.buyingTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
                    <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 text-accent font-bold text-sm">
                      {index + 1}
                    </span>
                    <p className="text-foreground text-sm leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Local Listings */}
        {localListings.length > 0 && (
          <section className="section-padding bg-secondary">
            <div className="container-custom">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
                Featured Homes for Sale in {neighborhood.name}
              </h2>
              <p className="text-muted-foreground text-center mb-10">
                Current listings in the {neighborhood.name} area
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {localListings.map((listing) => (
                  <PropertyCard key={listing.id} listing={listing} />
                ))}
              </div>
              <div className="text-center mt-10">
                <Link to={`/listings?city=${encodeURIComponent(neighborhood.name)}`}>
                  <Button variant="gold" size="lg">
                    View All {neighborhood.name} Listings <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {neighborhood.faqs && (
          <section className="section-padding bg-background">
            <div className="container-custom">
              <div className="max-w-3xl mx-auto">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-8 text-center">
                  {neighborhood.name} Real Estate FAQ
                </h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {neighborhood.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-lg border border-border px-6">
                      <AccordionTrigger className="text-left font-semibold text-foreground hover:text-accent">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="container-custom text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Buy a Home in {neighborhood.name}?
            </h2>
            <p className="text-primary-foreground/70 mb-4 max-w-2xl mx-auto">
              As your {neighborhood.name} real estate expert, Mike Ogunkeye will help you find the perfect home, negotiate the best price, and guide you through every step of the buying process.
            </p>
            <p className="text-primary-foreground/60 mb-8">
              Call <a href={`tel:${siteConfig.phoneRaw}`} className="text-accent hover:underline">{siteConfig.phone}</a> or schedule a free consultation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/home-search">
                <Button variant="gold" size="xl">Find Your Dream Home</Button>
              </Link>
              <Link to="/contact">
                <Button variant="heroOutline" size="xl">
                  <Phone className="h-5 w-5" /> Free Consultation
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

const NeighborhoodsList = () => {
  const schemas = getNeighborhoodsPageSchemas();

  return (
    <>
      <Helmet>
        <title>Houston Area Neighborhoods | Homes for Sale by City | {siteConfig.name}</title>
        <meta
          name="description"
          content="Explore homes for sale in Houston, Sugar Land, Katy, Cypress, Richmond, Missouri City, Pearland & Rosenberg. School ratings, market data & neighborhood guides by Mike Ogunkeye."
        />
        <meta name="keywords" content="Houston neighborhoods, homes for sale Sugar Land, Katy real estate, Cypress TX homes, Richmond TX, Missouri City homes, Pearland real estate, Houston suburbs" />
        <link rel="canonical" href={`${siteConfig.url}/neighborhoods`} />

        <meta property="og:title" content="Houston Area Neighborhoods | Homes for Sale by City" />
        <meta property="og:description" content="Find homes in Houston's best neighborhoods. Market data, school ratings & expert guidance." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${siteConfig.url}/neighborhoods`} />
      </Helmet>

      <SchemaMarkup schemas={schemas} />

      <Layout>
        <section className="pt-40 pb-20 bg-primary">
          <div className="container-custom">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <p className="text-accent font-medium tracking-wider uppercase mb-4">Neighborhood Guides</p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Find Homes for Sale in Houston's Best Neighborhoods
              </h1>
              <p className="text-xl text-primary-foreground/70">
                Explore {neighborhoods.length} communities across the Houston metro area. School ratings, market data, and expert insights to help you find the right neighborhood.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container-custom">
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {neighborhoods.map((n) => (
                <StaggerItem key={n.slug}>
                  <Link to={`/neighborhoods/${n.slug}`}>
                    <Card className="overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-all group h-full">
                      <div className="relative h-52 overflow-hidden">
                        <img src={n.image} alt={`Homes for sale in ${n.name} Texas`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-2">
                            <span className="text-3xl">{n.icon}</span>
                            <div>
                              <h3 className="font-serif text-xl font-bold text-primary-foreground">{n.name}</h3>
                              <p className="text-primary-foreground/70 text-sm">{n.stats.listings} Homes • Avg {n.stats.avgPrice}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{n.description}</p>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="text-center p-2 bg-secondary rounded">
                            <p className="text-xs text-muted-foreground">Schools</p>
                            <p className="font-bold text-sm text-foreground">{n.stats.schools}</p>
                          </div>
                          <div className="text-center p-2 bg-secondary rounded">
                            <p className="text-xs text-muted-foreground">Parks</p>
                            <p className="font-bold text-sm text-foreground">{n.stats.parks}</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-accent text-sm font-medium group-hover:gap-2 transition-all">
                          Explore {n.name} <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Card>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        <section className="py-20 bg-primary">
          <div className="container-custom text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Not Sure Which Neighborhood is Right for You?
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-2xl mx-auto">
              Take our personalized home search quiz and let us match you with the perfect Houston neighborhood based on your lifestyle, budget, and priorities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/home-search">
                <Button variant="gold" size="xl">Take the Quiz <ArrowRight className="h-5 w-5" /></Button>
              </Link>
              <Link to="/contact">
                <Button variant="heroOutline" size="xl">
                  <Phone className="h-5 w-5" /> Talk to an Expert
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

const Neighborhoods = () => {
  const { slug } = useParams<{ slug: string }>();
  
  if (slug) {
    const neighborhood = neighborhoods.find(n => n.slug === slug);
    if (neighborhood) {
      return <NeighborhoodDetail neighborhood={neighborhood} />;
    }
  }
  
  return <NeighborhoodsList />;
};

export default Neighborhoods;
