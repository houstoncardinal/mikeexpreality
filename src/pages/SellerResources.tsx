import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { Link } from "react-router-dom";
import { 
  CheckCircle, 
  TrendingUp, 
  Camera, 
  Megaphone, 
  Users, 
  FileText,
  ArrowRight,
  Star,
  DollarSign,
  Clock,
  Home,
  BarChart3,
  Phone,
  Shield,
  Target,
  Paintbrush,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getSellerResourcesSchemas, HowToStep, FAQItem } from "@/lib/schema";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { siteConfig } from "@/lib/siteConfig";

const sellingSteps = [
  {
    icon: TrendingUp,
    title: "Free Home Valuation & Market Analysis",
    description: "We start with a comprehensive Comparative Market Analysis (CMA) that evaluates recent sales of similar homes, pending listings, expired listings, and current market trends in your specific Houston neighborhood. We'll walk through your home together, noting features that add value — upgraded kitchens, pool, lot size, school zone — and anything that might need attention. You'll receive a detailed report showing your home's estimated market value, recommended list price, and projected net proceeds after closing costs and commissions. This service is completely free and no-obligation.",
  },
  {
    icon: Paintbrush,
    title: "Strategic Preparation & Staging",
    description: "First impressions sell homes. We provide a room-by-room preparation checklist and connect you with our trusted network of stagers, painters, landscapers, and handymen. Professional staging can increase your sale price by 5-10% and reduce time on market. We focus on high-ROI improvements: fresh neutral paint ($2K-$4K investment typically returns 2-3x), kitchen/bath updates, curb appeal, and deep cleaning. Our stager will arrange furniture and décor to highlight your home's best features and create an emotional connection with buyers.",
  },
  {
    icon: Camera,
    title: "Professional Photography & Marketing",
    description: "Your home's online presence is its first showing — 97% of buyers start their search online. We invest in professional HDR photography, aerial drone shots, 3D virtual tours (Matterport), and cinematic video walkthroughs. Your listing goes live on MLS, Zillow, Realtor.com, Redfin, Trulia, and 500+ real estate websites simultaneously. We also create custom social media campaigns targeting qualified buyers in your price range, email marketing to our buyer database, and neighborhood-targeted digital ads.",
  },
  {
    icon: Target,
    title: "Showings, Open Houses & Offer Negotiation",
    description: "We coordinate all showings through our digital scheduling system — you control the times that work for your family. We host strategic open houses with professional signage, refreshments, and follow-up systems to capture every potential buyer. When offers come in, we present them with a detailed analysis comparing price, terms, contingencies, financing strength, and closing timeline. In multiple-offer situations, we use proven strategies to maximize your sale price while selecting the most qualified buyer.",
  },
  {
    icon: FileText,
    title: "Contract to Close Management",
    description: "Our dedicated transaction coordinator manages the entire closing process. We handle inspection negotiations (protecting your interests while keeping the deal together), appraisal coordination, title work, lender communications, and closing document review. We conduct a pre-closing walkthrough, attend closing with you, and ensure a seamless transfer. Average timeline: 30-45 days from accepted offer to closed sale.",
  },
];

const faqs: FAQItem[] = [
  {
    question: "How much is my Houston home worth right now?",
    answer: "Home values in Houston vary dramatically by neighborhood, condition, size, and current market conditions. We offer free, no-obligation home valuations using comprehensive market analysis. We compare your home against recent sales in your area, consider current market trends, and evaluate your home's unique features. Contact us for a personalized assessment — most valuations are completed within 24-48 hours.",
  },
  {
    question: "How long does it take to sell a home in Houston in 2026?",
    answer: "Average days on market in Houston is currently 28 days, but this varies significantly by area and price point. Well-priced homes in desirable areas like Sugar Land (22 days), Pearland (24 days), and Katy (25 days) often sell faster. Luxury homes above $750K may take 45-90 days. Our strategic pricing and marketing approach consistently outperforms market averages — many of our listings receive offers within the first week.",
  },
  {
    question: "What does it cost to sell a home in Houston?",
    answer: "Typical selling costs include: agent commissions (typically 5-6% split between listing and buyer's agent), title policy ($1,000-$3,000), closing/escrow fees ($500-$1,500), property taxes prorated to closing, any agreed repairs from inspection, and optional items like staging ($1,500-$3,000) and pre-listing inspection ($400-$600). We provide a detailed net sheet early in the process so you know exactly what to expect. On a $400K sale, total costs are typically $25,000-$30,000.",
  },
  {
    question: "Should I make repairs before listing my Houston home?",
    answer: "Not all repairs are worth the investment. We recommend focusing on high-ROI items: fresh paint (200-300% ROI), minor kitchen/bath updates (150% ROI), landscaping/curb appeal (100-200% ROI), and fixing obvious defects (prevents buyer objections). We advise against major renovations before selling — they rarely return full cost. During our walk-through, we'll identify exactly which repairs will maximize your return and which to skip.",
  },
  {
    question: "How do you determine the right listing price?",
    answer: "We use a data-driven approach combining: 1) Comparable sales from the past 3-6 months in your specific neighborhood, 2) Active and pending listings (your competition), 3) Expired listings (what didn't work), 4) Current market conditions (buyer demand, inventory levels), 5) Your home's unique features and condition, and 6) Our experience with what actually sells in your area. Pricing correctly from day one is the single most important factor in getting top dollar.",
  },
  {
    question: "What makes Mike Ogunkeye different from other Houston listing agents?",
    answer: "Our track record speaks for itself: average 10 days on market (vs. 28 market average), 99% list-to-sale ratio, and over 500 homes sold. We invest in professional photography, 3D tours, and targeted digital marketing for every listing — not just luxury homes. Our team approach means you have a dedicated listing agent, transaction coordinator, and marketing specialist working for you. We also provide weekly updates with showing feedback and market data so you're never in the dark.",
  },
  {
    question: "Do I need to be home for showings?",
    answer: "No — in fact, we strongly recommend sellers not be present during showings. Buyers feel more comfortable exploring the home, asking questions, and imagining themselves living there when the owner isn't present. We use a digital showing service that lets you approve, decline, or reschedule showings from your phone. We'll also install a secure lockbox so agents can access the home during approved times. After each showing, we follow up with the buyer's agent for feedback.",
  },
  {
    question: "Can I sell my Houston home as-is?",
    answer: "Yes, you can sell your home as-is. However, you'll typically receive 10-20% less than market value. As-is sales work best for inherited properties, homes needing significant repairs, or sellers who need to close quickly. We can also connect you with investors and cash buyers who specialize in as-is purchases. For most sellers, investing $5,000-$10,000 in strategic preparations yields a significantly higher net return.",
  },
];

const sellingStepsSchema: HowToStep[] = sellingSteps.map(step => ({
  title: step.title,
  description: step.description,
}));

const benefits = [
  "Professional HDR photography & aerial drone shots",
  "3D Matterport virtual tour for every listing",
  "Cinematic video walkthrough for social media",
  "Premium placement on MLS & 500+ real estate websites",
  "Targeted social media advertising campaigns",
  "Strategic open houses with lead capture systems",
  "Weekly market updates and showing feedback reports",
  "Expert negotiation to maximize your sale price",
  "Dedicated transaction coordinator for seamless closing",
  "Network of trusted contractors, stagers & vendors",
];

const SellerResources = () => {
  const schemas = getSellerResourcesSchemas(sellingStepsSchema, faqs);

  return (
    <>
      <Helmet>
        <title>Sell My House Houston TX | Free Home Valuation | {siteConfig.name}</title>
        <meta
          name="description"
          content="Sell your Houston home for top dollar with Mike Ogunkeye. Free home valuation, professional photography, 3D tours, strategic marketing. Average 10 days on market, 99% list-to-sale ratio. Serving Sugar Land, Katy, Cypress & more."
        />
        <meta name="keywords" content="sell my house Houston, sell my home Houston TX, home valuation Houston, list my house Sugar Land, selling a home Katy, Houston listing agent, sell house fast Houston, what is my home worth Houston, real estate agent for sellers Houston, how to sell a house in Texas" />
        <link rel="canonical" href={`${siteConfig.url}/seller-resources`} />
        
        <meta property="og:title" content="Sell My House Houston | Free Valuation | 99% List-to-Sale Ratio" />
        <meta property="og:description" content="Sell your Houston home for maximum value. Professional marketing, expert negotiation, avg 10 days on market. Free home valuation." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${siteConfig.url}/seller-resources`} />
        <meta property="og:image" content={`${siteConfig.url}/logo-primary.jpeg`} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sell Your Houston Home | Mike Ogunkeye Real Estate" />
        <meta name="twitter:description" content="Free home valuation, 3D tours, professional marketing. Average 10 days on market." />
      </Helmet>

      <SchemaMarkup schemas={schemas} />

      <Layout>
        {/* Hero */}
        <section className="pt-40 pb-20 bg-primary">
          <div className="container-custom">
            <div className="max-w-3xl">
              <p className="text-accent font-medium tracking-wider uppercase mb-4">
                Sell Your Houston Home
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Sell Your Home for
                <span className="block text-gradient-gold">Maximum Value in Houston</span>
              </h1>
              <p className="text-xl text-primary-foreground/70 mb-4">
                Our proven 5-step selling process, professional marketing, and expert negotiation consistently deliver results above market average across Houston, Sugar Land, Katy, Cypress, and surrounding areas.
              </p>
              <p className="text-primary-foreground/50 text-sm mb-8">
                By Mike Ogunkeye • eXp Realty • Updated March 2026
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/home-valuation">
                  <Button variant="gold" size="xl">
                    Get Free Home Valuation <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <a href={`tel:${siteConfig.phoneRaw}`}>
                  <Button variant="heroOutline" size="xl">
                    <Phone className="h-5 w-5" /> Call {siteConfig.phone}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-card border-b border-border">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <Clock className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="font-serif text-4xl md:text-5xl font-bold text-accent mb-2">10</p>
                <p className="text-muted-foreground text-sm">Average Days on Market</p>
              </div>
              <div>
                <BarChart3 className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="font-serif text-4xl md:text-5xl font-bold text-accent mb-2">99%</p>
                <p className="text-muted-foreground text-sm">List-to-Sale Price Ratio</p>
              </div>
              <div>
                <Home className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="font-serif text-4xl md:text-5xl font-bold text-accent mb-2">500+</p>
                <p className="text-muted-foreground text-sm">Homes Sold in Houston Area</p>
              </div>
              <div>
                <Star className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="font-serif text-4xl md:text-5xl font-bold text-accent mb-2">5.0</p>
                <p className="text-muted-foreground text-sm">Average Client Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section - Expanded */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Proven 5-Step Home Selling Process
              </h2>
              <p className="text-muted-foreground text-lg">
                From listing to closing, every detail is managed to maximize your sale price and minimize stress.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {sellingSteps.map((step, index) => (
                <Card key={step.title} className="p-8 border-0 shadow-card">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <step.icon className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-accent font-bold text-sm">STEP {index + 1}</span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-foreground mb-3">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What We Include */}
        <section className="section-padding bg-secondary">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                  What's Included When You List With Mike Ogunkeye
                </h2>
                <p className="text-muted-foreground mb-8">
                  Every listing — regardless of price point — receives our full marketing suite. We don't cut corners because we know professional marketing sells homes faster and for more money.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-foreground text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="p-8 border-0 shadow-lg bg-primary text-primary-foreground">
                <h3 className="font-serif text-2xl font-bold mb-4">
                  Get Your Free Home Valuation
                </h3>
                <p className="text-primary-foreground/70 mb-4">
                  Find out what your home is worth in today's Houston market. No obligation — just data-driven insights.
                </p>
                <ul className="space-y-3 mb-6">
                  {["Detailed comparable sales analysis", "Current market condition assessment", "Recommended listing price range", "Estimated net proceeds calculation", "Personalized marketing strategy"].map(item => (
                    <li key={item} className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                      <CheckCircle className="h-4 w-4 text-accent shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                <Link to="/home-valuation">
                  <Button variant="gold" size="xl" className="w-full">
                    Get My Free Valuation <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* Market Update */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <TrendingUp className="h-10 w-10 text-accent mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Houston Seller's Market Update — March 2026
              </h2>
              <p className="text-muted-foreground text-lg">
                Key metrics that affect your home's selling potential
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { label: "Median Sale Price (Houston Metro)", value: "$385,000", change: "+4.2% YoY" },
                { label: "Average Days on Market", value: "28 days", change: "-3 days vs last year" },
                { label: "Months of Inventory", value: "2.8 months", change: "Seller's market (<6)" },
                { label: "List-to-Sale Price Ratio", value: "97.8%", change: "Strong seller position" },
                { label: "New Listings (Monthly)", value: "8,200", change: "+6% vs last year" },
                { label: "Closed Sales (Monthly)", value: "7,100", change: "+4.5% vs last year" },
              ].map(stat => (
                <Card key={stat.label} className="p-6 border-0 shadow-card text-center">
                  <p className="font-serif text-2xl font-bold text-accent mb-1">{stat.value}</p>
                  <p className="text-foreground text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-muted-foreground text-xs">{stat.change}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding bg-secondary">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2 text-center">
                Houston Home Seller FAQ
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                Common questions from Houston home sellers answered by Mike Ogunkeye
              </p>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
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

        {/* CTA */}
        <section className="py-20 bg-primary">
          <div className="container-custom text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Sell Your Houston Home?
            </h2>
            <p className="text-primary-foreground/70 mb-4 max-w-2xl mx-auto">
              Schedule a free, no-obligation listing consultation. We'll provide a detailed home valuation, marketing plan, and estimated net proceeds — so you can make an informed decision.
            </p>
            <p className="text-primary-foreground/60 mb-8">
              Call <a href={`tel:${siteConfig.phoneRaw}`} className="text-accent hover:underline">{siteConfig.phone}</a> or book online
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="gold" size="xl">
                  Schedule Free Consultation
                </Button>
              </Link>
              <Link to="/home-valuation">
                <Button variant="heroOutline" size="xl">
                  <DollarSign className="h-5 w-5" /> Get Home Valuation
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default SellerResources;
