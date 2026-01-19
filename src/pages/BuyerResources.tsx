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
  Download
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

const buyingSteps = [
  {
    icon: Calculator,
    title: "Get Pre-Approved",
    description: "Understand your budget and get a mortgage pre-approval to strengthen your offers.",
  },
  {
    icon: Search,
    title: "Find Your Home",
    description: "Work with our agents to identify properties that match your criteria and lifestyle.",
  },
  {
    icon: FileText,
    title: "Make an Offer",
    description: "We'll help you craft a competitive offer and negotiate the best terms.",
  },
  {
    icon: Shield,
    title: "Inspection & Due Diligence",
    description: "Thorough inspections and title searches to protect your investment.",
  },
  {
    icon: Key,
    title: "Close & Move In",
    description: "Finalize paperwork, get your keys, and move into your new home!",
  },
];

const faqs = [
  {
    question: "How much do I need for a down payment?",
    answer: "Down payment requirements vary by loan type. Conventional loans typically require 5-20%, FHA loans require as little as 3.5%, and VA loans may require no down payment for eligible veterans. We can connect you with lenders who offer various options.",
  },
  {
    question: "What credit score do I need to buy a home?",
    answer: "While requirements vary, most conventional loans require a minimum score of 620. FHA loans may accept scores as low as 580 with 3.5% down, or 500 with 10% down. Higher scores typically qualify for better interest rates.",
  },
  {
    question: "How long does the home buying process take?",
    answer: "On average, the process takes 30-60 days from accepted offer to closing. This includes inspection, appraisal, loan processing, and final paperwork. Cash purchases can close faster.",
  },
  {
    question: "What are closing costs?",
    answer: "Closing costs typically range from 2-5% of the home's purchase price and include loan origination fees, title insurance, appraisal, inspections, and escrow fees. We'll provide a detailed estimate early in the process.",
  },
  {
    question: "Do I need a real estate agent to buy a home?",
    answer: "While not required, a buyer's agent provides invaluable expertise in finding properties, negotiating prices, navigating contracts, and protecting your interests—typically at no cost to you as the buyer.",
  },
];

// Convert to schema format
const buyingStepsSchema: HowToStep[] = buyingSteps.map(step => ({
  title: step.title,
  description: step.description,
}));

const faqsSchema: FAQItem[] = faqs.map(faq => ({
  question: faq.question,
  answer: faq.answer,
}));

const BuyerResources = () => {
  const schemas = getBuyerResourcesSchemas(buyingStepsSchema, faqsSchema);

  return (
    <>
      <Helmet>
        <title>First-Time Home Buyer Guide Houston | Buyer Resources | Houston Elite</title>
        <meta
          name="description"
          content="Complete guide to buying a home in Houston. Learn about the home buying process, mortgage pre-approval, closing costs, and work with Houston's top buyer's agents."
        />
        <link rel="canonical" href="https://houstonelite.com/buyer-resources" />
      </Helmet>

      {/* Centralized Schema Markup with HowTo + FAQ */}
      <SchemaMarkup schemas={schemas} />

      <Layout>
        {/* Hero */}
        <section className="pt-40 pb-20 bg-primary">
          <div className="container-custom">
            <div className="max-w-3xl">
              <p className="text-accent font-medium tracking-wider uppercase mb-4">
                Buyer Resources
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Your Complete Guide to
                <span className="block text-gradient-gold">Buying a Home</span>
              </h1>
              <p className="text-xl text-primary-foreground/70 mb-8">
                Everything you need to know about purchasing your dream home in Houston and surrounding areas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/listings">
                  <Button variant="gold" size="xl">
                    Browse Listings
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="heroOutline" size="xl">
                  <Download className="h-5 w-5" />
                  Download Buyer's Guide
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                The Home Buying Process
              </h2>
              <p className="text-muted-foreground text-lg">
                We'll guide you through every step to make your home buying experience smooth and stress-free.
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
              {buyingSteps.map((step, index) => (
                <div key={step.title} className="relative text-center">
                  {index < buyingSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                  )}
                  <div className="relative z-10 w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <step.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="section-padding bg-secondary">
          <div className="container-custom">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-12 text-center">
              Helpful Resources
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 border-0 shadow-card text-center">
                <Calculator className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                  Mortgage Calculator
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Estimate your monthly payments based on price, down payment, and interest rate.
                </p>
                <Button variant="outline">Calculate Now</Button>
              </Card>

              <Card className="p-8 border-0 shadow-card text-center">
                <Home className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                  Home Search
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Browse our listings and save your favorites for easy comparison.
                </p>
                <Link to="/listings">
                  <Button variant="outline">Search Homes</Button>
                </Link>
              </Card>

              <Card className="p-8 border-0 shadow-card text-center">
                <FileText className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                  Pre-Approval Checklist
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Documents you'll need to get pre-approved for a mortgage.
                </p>
                <Button variant="outline">Download PDF</Button>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-8 text-center">
                Frequently Asked Questions
              </h2>

              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-card rounded-lg border border-border px-6"
                  >
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
              Ready to Start Your Home Search?
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-2xl mx-auto">
              Connect with our buyer specialists for personalized guidance and access to exclusive listings.
            </p>
            <Link to="/contact">
              <Button variant="gold" size="xl">
                Schedule a Consultation
              </Button>
            </Link>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default BuyerResources;
