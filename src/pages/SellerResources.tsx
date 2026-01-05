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
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const sellingSteps = [
  {
    icon: TrendingUp,
    title: "Home Valuation",
    description: "Get a comprehensive market analysis to price your home competitively.",
  },
  {
    icon: Camera,
    title: "Professional Staging",
    description: "Expert staging and professional photography to showcase your home.",
  },
  {
    icon: Megaphone,
    title: "Strategic Marketing",
    description: "Multi-channel marketing to reach qualified buyers locally and globally.",
  },
  {
    icon: Users,
    title: "Showings & Offers",
    description: "We handle all showings and present offers with expert negotiation.",
  },
  {
    icon: FileText,
    title: "Closing",
    description: "Seamless closing process with our dedicated transaction team.",
  },
];

const benefits = [
  "Professional photography and 3D virtual tours",
  "Premium placement on MLS and top real estate sites",
  "Targeted social media advertising",
  "Open houses and private showings",
  "Weekly market updates and feedback reports",
  "Expert negotiation to maximize your price",
  "Dedicated transaction coordinator",
  "Network of trusted contractors and stagers",
];

const faqs = [
  {
    question: "How do you determine my home's value?",
    answer: "We conduct a comprehensive Comparative Market Analysis (CMA) that evaluates recent sales of similar homes, current market conditions, your home's unique features, and neighborhood trends to determine the optimal listing price.",
  },
  {
    question: "How long will it take to sell my home?",
    answer: "In the current Houston market, well-priced homes typically sell within 30-60 days. Factors like price, condition, location, and market conditions all affect timing. We'll provide realistic expectations based on your specific situation.",
  },
  {
    question: "What repairs or improvements should I make before selling?",
    answer: "We'll walk through your home and recommend high-ROI improvements. Generally, fresh paint, minor repairs, decluttering, and curb appeal updates offer the best returns. Major renovations aren't always necessary.",
  },
  {
    question: "What are the costs of selling a home?",
    answer: "Typical selling costs include agent commissions (typically 5-6%), closing costs (1-3%), and any repairs or staging. We'll provide a detailed net sheet so you know exactly what to expect.",
  },
  {
    question: "Do I need to be present for showings?",
    answer: "No, in fact we recommend sellers not be present during showings. Buyers feel more comfortable exploring and can better envision themselves in the home. We'll coordinate all showings and provide feedback.",
  },
];

const SellerResources = () => {
  return (
    <>
      <Helmet>
        <title>Sell Your Houston Home | Home Valuation & Seller Resources | Houston Elite</title>
        <meta
          name="description"
          content="Sell your Houston home for top dollar. Free home valuation, professional marketing, expert negotiation. Learn about our proven selling process and get started today."
        />
        <link rel="canonical" href="https://houstonelite.com/seller-resources" />
      </Helmet>

      <Layout>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-primary">
          <div className="container-custom">
            <div className="max-w-3xl">
              <p className="text-accent font-medium tracking-wider uppercase mb-4">
                Seller Resources
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Sell Your Home for
                <span className="block text-gradient-gold">Maximum Value</span>
              </h1>
              <p className="text-xl text-primary-foreground/70 mb-8">
                Our proven marketing strategy and expert negotiation consistently deliver results above market average.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button variant="gold" size="xl">
                    Get Free Valuation
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="heroOutline" size="xl">
                  <Star className="h-5 w-5" />
                  See Our Results
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-background border-b border-border">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="font-serif text-4xl md:text-5xl font-bold text-accent mb-2">10</p>
                <p className="text-muted-foreground">Average Days on Market</p>
              </div>
              <div>
                <p className="font-serif text-4xl md:text-5xl font-bold text-accent mb-2">99%</p>
                <p className="text-muted-foreground">List-to-Sale Ratio</p>
              </div>
              <div>
                <p className="font-serif text-4xl md:text-5xl font-bold text-accent mb-2">500+</p>
                <p className="text-muted-foreground">Homes Sold</p>
              </div>
              <div>
                <p className="font-serif text-4xl md:text-5xl font-bold text-accent mb-2">$2B+</p>
                <p className="text-muted-foreground">Total Sales Volume</p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Proven Selling Process
              </h2>
              <p className="text-muted-foreground text-lg">
                From listing to closing, we handle every detail to ensure a smooth, successful sale.
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
              {sellingSteps.map((step, index) => (
                <div key={step.title} className="relative text-center">
                  {index < sellingSteps.length - 1 && (
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

        {/* Benefits Section */}
        <section className="section-padding bg-secondary">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Why Sell With Houston Elite?
                </h2>
                <p className="text-muted-foreground mb-8">
                  We combine cutting-edge marketing, local expertise, and white-glove service to get your home sold faster and for more money.
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
                <p className="text-primary-foreground/70 mb-6">
                  Find out what your home is worth in today's market with our comprehensive analysis.
                </p>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Property Address"
                    className="w-full h-12 px-4 rounded-md bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full h-12 px-4 rounded-md bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                  />
                  <Button variant="gold" size="xl" className="w-full">
                    Get My Valuation
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-8 text-center">
                Seller FAQs
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
              Ready to List Your Home?
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-2xl mx-auto">
              Schedule a no-obligation consultation to discuss your goals and learn how we can help you achieve the best possible outcome.
            </p>
            <Link to="/contact">
              <Button variant="gold" size="xl">
                Schedule a Consultation
              </Button>
            </Link>
          </div>
        </section>
      </Layout>

      {/* FAQ Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
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
        })}
      </script>
    </>
  );
};

export default SellerResources;
