// Site configuration with Mike Ogunkeye Real Estate branding
export const siteConfig = {
  name: "Mike Ogunkeye Real Estate",
  shortName: "Mike Ogunkeye",
  tagline: "Elevated Real Estate Experiences",
  brokerage: "eXp Realty",
  
  // Contact Information
  phone: "(832) 340-8787",
  phoneRaw: "+18323408787",
  email: "mike@mikeogunkeye.com",
  
  // Address
  address: {
    street: "13135 South Freeway Suite 150",
    city: "Stafford",
    state: "TX",
    zip: "77477",
    full: "13135 South Freeway Suite 150, Stafford, TX 77477",
  },
  
  // URLs
  url: "https://mikeogunkeye.com",
  
  // Social Media
  social: {
    instagram: "https://www.instagram.com/mikeogunkeye/",
    facebook: "https://www.facebook.com/mikeogunkeye",
    linkedin: "https://www.linkedin.com/in/mikeogunkeye/",
  },
  
  // Service Areas
  serviceAreas: [
    "Houston",
    "Sugar Land", 
    "Katy",
    "Cypress",
    "Richmond",
    "Missouri City",
    "Pearland",
    "Rosenberg",
    "Rosharon",
  ],
  
  // Agent Info
  agent: {
    name: "Mike Ogunkeye",
    fullName: "Mike Ogunkeye",
    title: "Real Estate Agent",
    license: "TREC #",
  },
  
  // Hours
  hours: {
    weekdays: "9:00 AM - 6:00 PM",
    saturday: "10:00 AM - 4:00 PM",
    sunday: "By Appointment",
  },
};

// Real testimonials from the website
export const testimonials = [
  {
    id: 1,
    name: "Joy B.",
    rating: 5,
    text: "Very knowledgeable, supportive, on point with his information and knows how to negotiate. The Best ever. We are very happy and satisfied.",
    type: "Buyer",
  },
  {
    id: 2,
    name: "Bola J.",
    rating: 5,
    text: "Outstanding Experience. Mike Ogunkeye and his team with EXP has done it again, this is why he kept getting returning customers and referral from me. I have had nothing but outstanding experience with Mike.",
    type: "Buyer",
  },
  {
    id: 3,
    name: "Gregory M.",
    rating: 5,
    text: "Mike is communicative and experienced. These qualities gave my wife and I great calm in a sometimes anxious process. We had owned our home for 23 years and when it was time to sell it we trusted Mike to guide us through the process.",
    type: "Seller",
  },
  {
    id: 4,
    name: "Mayz I.",
    rating: 5,
    text: "I worked with Mike for over a year looking for a new home. He was so patient, prompt and informative. There were days I worked my own nerves, he never complained about how many homes I wanted to see.",
    type: "Buyer",
  },
  {
    id: 5,
    name: "Allan M.",
    rating: 5,
    text: "Mike is the real estate agent that everyone deserves! He's very knowledgeable and always made sure that we receive all of the attention and answered all of our questions. He made this a very comfortable experience for us.",
    type: "Buyer",
  },
  {
    id: 6,
    name: "Nosa O.",
    rating: 5,
    text: "Good man and best agent ever working with. Honest and knowledgeable, keeping you informed from the beginning to end. I will use the agent again. Thanks for your good work.",
    type: "Buyer",
  },
  {
    id: 7,
    name: "Ola A.",
    rating: 5,
    text: "Mike made this home buying process very easy and simple for me would definitely be buying another home from him.",
    type: "Buyer",
  },
  {
    id: 8,
    name: "Akeem L.",
    rating: 5,
    text: "They are very reliable and trustworthy person and I promising you if you do business with them today you will be glad tomorrow. If is not Mike Ogunkeye Realtor know one else can make you happy.",
    type: "Buyer | Seller",
  },
];

// Real property listings from the portfolio
export const featuredListings = [
  {
    id: "10507-halley-lane",
    title: "10507 Halley Lane",
    address: "10507 Halley Lane, Richmond, TX 77406",
    price: 5000,
    priceType: "lease",
    beds: 5,
    baths: 5,
    sqft: 3840,
    image: "https://dlajgvw9htjpb.cloudfront.net/cms/0546c848-65fb-4216-bc9b-625e1eafc6bf/86221175/-2798420792025013588.jpg",
    status: "For Lease",
    type: "House",
  },
  {
    id: "7735-coburn-drive",
    title: "7735 Coburn Drive",
    address: "7735 Coburn Drive, Beaumont, TX 77707",
    price: 175000,
    priceType: "sale",
    beds: 3,
    baths: 2,
    sqft: 2436,
    image: "https://dlajgvw9htjpb.cloudfront.net/cms/0546c848-65fb-4216-bc9b-625e1eafc6bf/6820929/-7189515740131590123.jpg",
    status: "For Sale",
    type: "House",
  },
  {
    id: "8114-bassett-street",
    title: "8114 Bassett Street",
    address: "8114 Bassett Street, Houston, TX",
    price: 75000,
    priceType: "sale",
    beds: 0,
    baths: 0,
    sqft: 3001,
    image: "https://dlajgvw9htjpb.cloudfront.net/cms/0546c848-65fb-4216-bc9b-625e1eafc6bf/40519433/7120993268281597033.jpg",
    status: "For Sale",
    type: "Land",
  },
];

// Neighborhoods served
export const neighborhoods = [
  {
    name: "Sugar Land",
    description: "Family-friendly suburbs with top-rated schools and master-planned communities",
    image: "https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85,fit=scale-down,width=1280/https://media-production.lp-cdn.com/media/yntks2cidqklmngl6r3h",
    slug: "sugar-land",
  },
  {
    name: "Katy",
    description: "Rapidly growing community with excellent amenities and modern developments",
    image: "https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85,fit=scale-down,width=1280/https://media-production.lp-cdn.com/media/oo2eosx45dsp0uhrlrdr",
    slug: "katy",
  },
  {
    name: "Richmond",
    description: "Historic charm meets modern living in this growing Texas community",
    image: "https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85,fit=scale-down,width=1280/https://media-production.lp-cdn.com/media/e34ca078-b25c-4b97-995f-cde46f1ae2cb",
    slug: "richmond",
  },
  {
    name: "Missouri City",
    description: "Diverse community with great parks and easy access to Houston",
    image: "https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85,fit=scale-down,width=1280/https://media-production.lp-cdn.com/media/fkp7hcrx3rjlthtw8eap",
    slug: "missouri-city",
  },
  {
    name: "Cypress",
    description: "Scenic suburban living with beautiful parks and nature preserves",
    image: "https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85,fit=scale-down,width=1280/https://media-production.lp-cdn.com/media/98dec1db-cc1c-4269-bec3-8cbbccd6019b",
    slug: "cypress",
  },
  {
    name: "Houston",
    description: "The heart of Texas with diverse neighborhoods and endless opportunities",
    image: "https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85,fit=scale-down,width=1280/https://media-production.lp-cdn.com/media/mhdsqha9x2gofnfl0ls3",
    slug: "houston",
  },
  {
    name: "Rosenberg",
    description: "Charming city with rich history and growing residential communities",
    image: "https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85,fit=scale-down,width=1280/https://media-production.lp-cdn.com/media/89ffc109-1bf4-4252-aba5-95099bbe276b",
    slug: "rosenberg",
  },
  {
    name: "Pearland",
    description: "Fast-growing suburb with excellent schools and family amenities",
    image: "https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85,fit=scale-down,width=1280/https://media-production.lp-cdn.com/media/mhdsqha9x2gofnfl0ls3",
    slug: "pearland",
  },
];
