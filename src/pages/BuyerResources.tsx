import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { Link } from "react-router-dom";
import { 
  CheckCircle, 
  Search, 
  FileText, 
  Home, 
  Calculator, 
  Key, 
  Shield, 
  ArrowRight,
  Download,
  DollarSign,
  MapPin,
  School,
  Phone,
  Star,
  Users,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getBuyerResourcesSchemas, HowToStep, FAQItem } from "@/lib/schema";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { siteConfig } from "@/lib/siteConfig";

const buyingSteps = [
  {
    icon: Calculator,
    title: "Get Pre-Approved for a Mortgage",
    description: "Before you start house hunting, get pre-approved by a lender. This tells you exactly how much home you can afford and shows sellers you're a serious buyer. In Houston's competitive market, a pre-approval letter can make the difference between winning and losing a bidding war. Gather your W-2s, pay stubs, bank statements, and tax returns. Most lenders can pre-approve you within 1-3 business days.",
  },
  {
    icon: Search,
    title: "Find Your Perfect Houston Home",
    description: "Work with Mike Ogunkeye to identify neighborhoods that match your lifestyle, commute, school preferences, and budget. We'll set up customized MLS alerts so you're among the first to see new listings. We'll tour homes together, evaluating everything from foundation condition to flood zone status — critical factors in the Houston market that many buyers overlook.",
  },
  {
    icon: FileText,
    title: "Make a Competitive Offer",
    description: "We'll analyze comparable sales, days on market, and seller motivation to craft a winning offer. In multiple-offer situations — common in popular areas like Sugar Land, Katy, and Cypress — we use proven strategies to make your offer stand out without overpaying. This includes strategic escalation clauses, flexible closing timelines, and targeted seller incentives.",
  },
  {
    icon: Shield,
    title: "Inspection, Appraisal & Due Diligence",
    description: "A thorough home inspection is non-negotiable in Houston. Our trusted inspectors check foundations (Houston's clay soil is notorious for foundation issues), roofing, HVAC systems, plumbing, and electrical. We'll also review the property's flood history, MUD tax rates, and HOA restrictions. If issues arise, we negotiate repairs or credits on your behalf.",
  },
  {
    icon: Key,
    title: "Close & Get Your Keys",
    description: "Our transaction coordinator manages all closing paperwork, title searches, and lender communications. We'll do a final walk-through to ensure everything is in order, attend closing together to review all documents, and hand you the keys to your new Houston home. Average closing timeline is 30-45 days from accepted offer.",
  },
];

const faqs: FAQItem[] = [
  {
    question: "How much do I need for a down payment on a Houston home?",
    answer: "Down payment requirements vary by loan type. Conventional loans typically require 5-20% (with 20% avoiding PMI). FHA loans require as little as 3.5% down — popular among first-time Houston buyers. VA loans offer zero-down options for eligible veterans. USDA loans may also apply for properties in outer Houston suburbs. Texas also offers down payment assistance programs through TSAHC and TDHCA that can provide $5,000-$25,000 in assistance. Mike Ogunkeye can connect you with lenders who specialize in each program.",
  },
  {
    question: "What credit score do I need to buy a home in Houston?",
    answer: "Minimum credit scores vary: conventional loans typically require 620+, FHA loans accept 580+ (with 3.5% down) or 500+ (with 10% down), and VA loans generally require 620+. However, higher scores (740+) qualify for the best interest rates, potentially saving you tens of thousands over the life of your loan. If your score needs improvement, we can recommend credit repair strategies and connect you with patient lenders while you work on your credit.",
  },
  {
    question: "How long does it take to buy a home in Houston?",
    answer: "The typical timeline from first home tour to closing is 60-90 days: 2-4 weeks of house hunting, 1-2 days for offer and negotiation, and 30-45 days from contract to closing. Hot neighborhoods like Sugar Land and Katy may see homes go under contract within days of listing, so being pre-approved and having your agent ready to move quickly is essential. Cash purchases can close in as little as 14 days.",
  },
  {
    question: "What are typical closing costs when buying a Houston home?",
    answer: "Closing costs in the Houston area typically range from 2-4% of the purchase price and include: lender origination fees (0.5-1%), title insurance ($1,000-$3,000), appraisal ($400-$600), home inspection ($350-$500), survey ($400-$500), and prepaid items like insurance and taxes. On a $400K home, expect $8,000-$16,000 in closing costs. We can often negotiate seller-paid closing cost contributions to reduce your out-of-pocket expense.",
  },
  {
    question: "Should I buy in a flood zone in Houston?",
    answer: "Many excellent Houston neighborhoods include flood zone areas, but it's crucial to understand the implications. Homes in FEMA-designated flood zones require flood insurance ($500-$5,000+ annually). Always check the property's flood history, elevation certificate, and whether it flooded during Harvey (2017). Mike Ogunkeye will research every property's flood risk before you make an offer and help you understand the insurance costs involved.",
  },
  {
    question: "What is a MUD tax and how does it affect my payment?",
    answer: "Municipal Utility Districts (MUDs) are special taxing districts common in Houston suburbs that fund roads, water, sewer, and drainage infrastructure. MUD tax rates vary from 0.25% to 1.5% on top of regular property taxes, which can significantly impact your monthly payment. A $400K home in a high-MUD area could pay $3,000-$6,000 more annually than the same-priced home without MUD taxes. We always factor MUD rates into our home search analysis.",
  },
  {
    question: "Do I need a real estate agent to buy a home in Houston?",
    answer: "While not legally required, a buyer's agent provides invaluable expertise — and typically costs you nothing as the seller pays the commission. A great buyer's agent like Mike Ogunkeye will: find properties before they hit public sites, negotiate better prices, identify potential issues, navigate complex contracts, and protect your interests throughout the transaction. In Houston's diverse market, local expertise is critical.",
  },
  {
    question: "What areas does Mike Ogunkeye serve for home buyers?",
    answer: "Mike Ogunkeye and team serve the entire greater Houston area including Houston, Sugar Land, Katy, Cypress, Richmond, Missouri City, Pearland, Rosenberg, and Rosharon. Each area has unique characteristics — from Sugar Land's top-rated schools to Katy's master-planned communities to Richmond's affordability. We'll help you identify the best neighborhood based on your priorities.",
  },
];

const buyingStepsSchema: HowToStep[] = buyingSteps.map(step => ({
  title: step.title,
  description: step.description,
}));

const neighborhoodCompare = [
  { area: "Sugar Land", avgPrice: "$550K", schools: "A+", commute: "30 min", bestFor: "Families, top schools" },
  { area: "Katy", avgPrice: "$420K", schools: "A+", commute: "35 min", bestFor: "Families, new construction" },
  { area: "Cypress", avgPrice: "$395K", schools: "A", commute: "35 min", bestFor: "Nature lovers, space" },
  { area: "Richmond", avgPrice: "$365K", schools: "A", commute: "35 min", bestFor: "Value buyers, investors" },
  { area: "Missouri City", avgPrice: "$380K", schools: "A", commute: "25 min", bestFor: "Diversity, central location" },
  { area: "Pearland", avgPrice: "$350K", schools: "A", commute: "20 min", bestFor: "Medical Center workers" },
  { area: "Rosenberg", avgPrice: "$320K", schools: "B+", commute: "40 min", bestFor: "First-time buyers" },
];

const BuyerResources = () => {
  const schemas = getBuyerResourcesSchemas(buyingStepsSchema, faqs);

  return (
    <>
      <Helmet>
        <title>Houston Home Buyer Guide 2026 | First-Time Buyer Tips | {siteConfig.name}</title>
        <meta
          name="description"
          content="Complete guide to buying a home in Houston TX. Step-by-step process, mortgage pre-approval, closing costs, flood zone tips, MUD taxes & neighborhood comparison. Free buyer consultation with Mike Ogunkeye."
        />
        <meta name="keywords" content="Houston home buyer guide, first-time home buyer Houston, buy a house Houston TX, homes for sale Houston, mortgage pre-approval Texas, Houston closing costs, flood zone Houston, MUD tax Houston, best neighborhoods Houston, Sugar Land homes, Katy homes" />
        <link rel="canonical" href={`${siteConfig.url}/buyer-resources`} />
        
        <meta property="og:title" content="Houston Home Buyer Guide 2026 | Complete Step-by-Step Process" />
        <meta property="og:description" content="Everything you need to buy a home in Houston. From pre-approval to closing, expert guidance by Mike Ogunkeye. Free consultation." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${siteConfig.url}/buyer-resources`} />
        <meta property="og:image" content={`${siteConfig.url}/logo-primary.jpeg`} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Houston Home Buyer Guide 2026 | Mike Ogunkeye Real Estate" />
        <meta name="twitter:description" content="Complete guide: pre-approval, closing costs, flood zones, MUD taxes & neighborhood comparison." />
      </Helmet>

      <SchemaMarkup schemas={schemas} />

      <Layout>
        {/* Hero */}
        <section className="pt-40 pb-20 bg-primary">
          <div className="container-custom">
            <div className="max-w-3xl">
              <p className="text-accent font-medium tracking-wider uppercase mb-4">
                Houston Home Buyer Guide 2026
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Your Complete Guide to
                <span className="block text-gradient-gold">Buying a Home in Houston</span>
              </h1>
              <p className="text-xl text-primary-foreground/70 mb-4">
                Whether you're a first-time buyer or seasoned investor, this guide covers everything you need to know about purchasing a home in Houston, Sugar Land, Katy, Cypress, and surrounding areas.
              </p>
              <p className="text-primary-foreground/50 text-sm mb-8">
                By Mike Ogunkeye • Updated March 2026 • 12 min read
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/home-search">
                  <Button variant="gold" size="xl">
                    Start Your Home Search <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/listings">
                  <Button variant="heroOutline" size="xl">
                    <Home className="h-5 w-5" /> Browse Listings
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-12 bg-card border-b border-border">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <DollarSign className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="font-serif text-3xl font-bold text-accent">$385K</p>
                <p className="text-muted-foreground text-sm">Median Houston Home Price</p>
              </div>
              <div>
                <TrendingUp className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="font-serif text-3xl font-bold text-accent">4.2%</p>
                <p className="text-muted-foreground text-sm">Annual Appreciation</p>
              </div>
              <div>
                <Home className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="font-serif text-3xl font-bold text-accent">28</p>
                <p className="text-muted-foreground text-sm">Avg Days on Market</p>
              </div>
              <div>
                <Users className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="font-serif text-3xl font-bold text-accent">150+</p>
                <p className="text-muted-foreground text-sm">Families Helped by Mike</p>
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section - Expanded */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                The 5-Step Home Buying Process in Houston
              </h2>
              <p className="text-muted-foreground text-lg">
                Mike Ogunkeye guides you through every step to make your home buying experience smooth, informed, and stress-free.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {buyingSteps.map((step, index) => (
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

        {/* Houston-Specific Considerations */}
        <section className="section-padding bg-secondary">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <AlertTriangle className="h-10 w-10 text-accent mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Houston-Specific Things Every Buyer Must Know
              </h2>
              <p className="text-muted-foreground text-lg">
                Houston's real estate market has unique characteristics that out-of-state buyers and first-timers often miss.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: AlertTriangle, title: "Flood Zones Matter", description: "Always check FEMA flood maps. Properties in 100-year flood zones require flood insurance ($500-$5,000+/year). Ask about Harvey flooding history. An elevation certificate can save or cost you thousands." },
                { icon: DollarSign, title: "MUD Taxes Add Up", description: "Municipal Utility Districts can add 0.25-1.5% to your property tax rate. A $400K home in a high-MUD area pays $3K-$6K more annually. Always calculate total tax rate before buying." },
                { icon: Home, title: "Foundation Is Critical", description: "Houston's expansive clay soil causes foundation movement. Always get a structural engineer's inspection ($300-$500). Foundation repairs can cost $5,000-$30,000+. Look for signs: cracked walls, sticking doors." },
                { icon: Shield, title: "HOA Rules Vary Wildly", description: "Master-planned community HOAs can have strict rules on landscaping, parking, home color, and even holiday decorations. Fees range from $200 to $3,000+/month. Read the CC&Rs before signing." },
                { icon: MapPin, title: "Commute Test Is Essential", description: "Houston traffic is notorious. Always drive your potential commute during rush hour (7-9 AM, 4-7 PM). A home that's '30 minutes away' on paper may be 60-90 minutes in reality." },
                { icon: School, title: "School Districts Drive Value", description: "School district quality is the #1 factor in Houston home values. Fort Bend ISD and Katy ISD zones command 10-20% premiums. Even within a district, individual school zones matter." },
              ].map((item) => (
                <Card key={item.title} className="p-6 border-0 shadow-card">
                  <item.icon className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Neighborhood Comparison Table */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <MapPin className="h-10 w-10 text-accent mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Houston Neighborhood Comparison
              </h2>
              <p className="text-muted-foreground text-lg">
                Compare Houston's top suburbs at a glance to find the right fit for your family and budget.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-secondary">
                    <th className="text-left p-4 font-semibold text-foreground text-sm">Area</th>
                    <th className="text-center p-4 font-semibold text-foreground text-sm">Avg Price</th>
                    <th className="text-center p-4 font-semibold text-foreground text-sm">Schools</th>
                    <th className="text-center p-4 font-semibold text-foreground text-sm">Commute to DT</th>
                    <th className="text-left p-4 font-semibold text-foreground text-sm">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {neighborhoodCompare.map((n, i) => (
                    <tr key={n.area} className={i % 2 === 0 ? "bg-background" : "bg-secondary/50"}>
                      <td className="p-4">
                        <Link to={`/neighborhoods/${n.area.toLowerCase().replace(/ /g, "-")}`} className="text-accent font-semibold hover:underline text-sm">
                          {n.area}
                        </Link>
                      </td>
                      <td className="text-center p-4 font-bold text-foreground text-sm">{n.avgPrice}</td>
                      <td className="text-center p-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${n.schools === "A+" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : n.schools === "A" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"}`}>
                          {n.schools}
                        </span>
                      </td>
                      <td className="text-center p-4 text-muted-foreground text-sm">{n.commute}</td>
                      <td className="p-4 text-muted-foreground text-sm">{n.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-center mt-6">
              <Link to="/neighborhoods">
                <Button variant="outline" size="lg">
                  Explore All Neighborhoods <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="section-padding bg-secondary">
          <div className="container-custom">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-12 text-center">
              Free Buyer Resources & Tools
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 border-0 shadow-card text-center">
                <Calculator className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">Mortgage Calculator</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Estimate monthly payments including principal, interest, taxes, insurance, and MUD fees.
                </p>
                <Link to="/mortgage-calculator">
                  <Button variant="outline">Calculate Now</Button>
                </Link>
              </Card>
              <Card className="p-8 border-0 shadow-card text-center">
                <Home className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">Personalized Home Search</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Tell us your preferences and we'll match you with the perfect Houston neighborhood and homes.
                </p>
                <Link to="/home-search">
                  <Button variant="outline">Find My Home</Button>
                </Link>
              </Card>
              <Card className="p-8 border-0 shadow-card text-center">
                <MapPin className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">Interactive Map Search</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Search homes on a map. See neighborhood boundaries, school zones, and flood areas.
                </p>
                <Link to="/map-search">
                  <Button variant="outline">Search Map</Button>
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2 text-center">
                Houston Home Buyer FAQ
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                Common questions from Houston home buyers answered by Mike Ogunkeye
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
              Ready to Buy Your Houston Home?
            </h2>
            <p className="text-primary-foreground/70 mb-4 max-w-2xl mx-auto">
              Schedule a free, no-obligation buyer consultation with Mike Ogunkeye. We'll discuss your goals, budget, preferred neighborhoods, and create a personalized home search strategy.
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
              <Link to="/home-search">
                <Button variant="heroOutline" size="xl">
                  <Search className="h-5 w-5" /> Start Home Search Quiz
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default BuyerResources;
