import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Home, TrendingUp, CheckCircle, ArrowRight, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LeadMagnetSectionProps {
  variant?: "horizontal" | "vertical";
}

export function LeadMagnetSection({ variant = "horizontal" }: LeadMagnetSectionProps) {
  const [selectedGuide, setSelectedGuide] = useState<"buyer" | "seller" | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedGuide) return;

    setIsSubmitting(true);
    try {
      await supabase.from("leads").insert({
        name: name || "Guide Download",
        email,
        lead_source: `lead_magnet_${selectedGuide}_guide`,
        message: `Downloaded: ${selectedGuide === "buyer" ? "Houston Home Buyer's Guide" : "Home Selling Success Guide"}`,
        status: "new",
      });

      await supabase.functions.invoke("send-lead-notification", {
        body: {
          name: name || "Guide Download",
          email,
          leadSource: `Lead Magnet - ${selectedGuide === "buyer" ? "Buyer" : "Seller"} Guide`,
          message: `Downloaded: ${selectedGuide === "buyer" ? "Houston Home Buyer's Guide" : "Home Selling Success Guide"}`,
        },
      });

      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "lead_magnet_download", {
          guide_type: selectedGuide,
          source: "homepage_section",
        });
      }

      setIsSuccess(true);
      toast.success("Check your email! Your guide is on its way.");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const guides = [
    {
      id: "buyer" as const,
      title: "Houston Home Buyer's Guide",
      description: "Complete guide to buying your dream home",
      icon: Home,
      benefits: ["Best neighborhoods by budget", "First-time buyer checklist", "Negotiation strategies", "Mortgage tips"],
    },
    {
      id: "seller" as const,
      title: "Home Selling Success Guide",
      description: "Maximize your home's value and sell faster",
      icon: TrendingUp,
      benefits: ["Staging tips that sell", "Pricing strategies", "Marketing secrets", "Closing checklist"],
    },
  ];

  if (isSuccess) {
    return (
      <section className="py-16 bg-secondary/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center p-8 bg-card rounded-2xl border border-border shadow-lg"
          >
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
              Your Guide is On Its Way!
            </h3>
            <p className="text-muted-foreground">
              Check your email for your free guide. Have questions? Give us a call!
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container-custom">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-accent/10 border border-accent/20">
            <BookOpen className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Free Resources</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Download Your Free Guide
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get expert insights and actionable tips to help you succeed in the Houston real estate market.
          </p>
        </div>

        {!selectedGuide ? (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {guides.map((guide) => (
              <motion.button
                key={guide.id}
                onClick={() => setSelectedGuide(guide.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-6 rounded-2xl bg-card border-2 border-border hover:border-accent text-left transition-all shadow-sm hover:shadow-lg group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <guide.icon className="h-7 w-7 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-accent transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {guide.description}
                    </p>
                    <ul className="space-y-1.5">
                      {guide.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle className="h-3 w-3 text-accent shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="p-6 rounded-2xl bg-card border border-border shadow-lg">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full text-accent text-sm font-medium mb-3">
                  <Sparkles className="h-4 w-4" />
                  {selectedGuide === "buyer" ? "Houston Home Buyer's Guide" : "Home Selling Success Guide"}
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter your email and we'll send it right over!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12"
                />
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 pl-10"
                  />
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Get My Free Guide"}
                </Button>

                <button
                  type="button"
                  onClick={() => setSelectedGuide(null)}
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Choose a different guide
                </button>

                <p className="text-xs text-center text-muted-foreground">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
