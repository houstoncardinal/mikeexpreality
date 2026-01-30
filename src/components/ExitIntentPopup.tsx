import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Home, TrendingUp, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { siteConfig } from "@/lib/siteConfig";

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<"buyer" | "seller" | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Exit intent detection
  const handleMouseLeave = useCallback((e: MouseEvent) => {
    // Only trigger on desktop when mouse leaves from top of viewport
    if (e.clientY < 10 && !hasShown && !isOpen) {
      const dismissedAt = localStorage.getItem("exitPopupDismissed");
      // Don't show if dismissed in the last 24 hours
      if (dismissedAt) {
        const dismissedTime = parseInt(dismissedAt, 10);
        if (Date.now() - dismissedTime < 24 * 60 * 60 * 1000) {
          return;
        }
      }
      setIsOpen(true);
      setHasShown(true);
    }
  }, [hasShown, isOpen]);

  // Scroll-based trigger for mobile (show after 50% scroll + 10 seconds)
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      if (hasShown || isOpen) return;
      
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 50) {
        scrollTimeout = setTimeout(() => {
          const dismissedAt = localStorage.getItem("exitPopupDismissed");
          if (!dismissedAt || Date.now() - parseInt(dismissedAt, 10) > 24 * 60 * 60 * 1000) {
            setIsOpen(true);
            setHasShown(true);
          }
        }, 10000);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [hasShown, isOpen]);

  useEffect(() => {
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [handleMouseLeave]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("exitPopupDismissed", Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedOffer) return;

    setIsSubmitting(true);
    try {
      // Save to leads table
      const { error: dbError } = await supabase.from("leads").insert({
        name: name || "Lead Magnet Signup",
        email,
        lead_source: `exit_popup_${selectedOffer}_guide`,
        message: `Requested: ${selectedOffer === "buyer" ? "Houston Home Buyer's Guide" : "Home Selling Success Guide"}`,
        status: "new",
      });

      if (dbError) {
        console.error("Error saving lead:", dbError);
      }

      // Send notification email
      await supabase.functions.invoke("send-lead-notification", {
        body: {
          name: name || "Lead Magnet Signup",
          email,
          leadSource: `Exit Popup - ${selectedOffer === "buyer" ? "Buyer" : "Seller"} Guide`,
          message: `Downloaded: ${selectedOffer === "buyer" ? "Houston Home Buyer's Guide" : "Home Selling Success Guide"}`,
        },
      });

      // Track in Google Analytics
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "lead_magnet_download", {
          guide_type: selectedOffer,
          source: "exit_popup",
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[95%] max-w-lg"
          >
            <div className="relative bg-card rounded-2xl shadow-2xl overflow-hidden border border-border">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors z-10"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>

              {!isSuccess ? (
                <>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4"
                    >
                      <Gift className="h-8 w-8 text-white" />
                    </motion.div>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
                      Wait! Don't Leave Empty-Handed
                    </h2>
                    <p className="text-white/80 text-sm md:text-base">
                      Get your FREE guide to Houston real estate success
                    </p>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {!selectedOffer ? (
                      <div className="space-y-4">
                        <p className="text-center text-muted-foreground mb-6">
                          Choose your free resource:
                        </p>
                        
                        {/* Buyer Guide Option */}
                        <button
                          onClick={() => setSelectedOffer("buyer")}
                          className="w-full p-4 rounded-xl border-2 border-border hover:border-accent bg-secondary/30 hover:bg-secondary/50 transition-all group text-left"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                              <Home className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground mb-1">
                                Houston Home Buyer's Guide
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Step-by-step guide to buying your dream home in Houston
                              </p>
                              <ul className="mt-2 space-y-1">
                                {["Best neighborhoods by budget", "First-time buyer checklist", "Negotiation strategies"].map((item) => (
                                  <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <CheckCircle className="h-3 w-3 text-accent" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </button>

                        {/* Seller Guide Option */}
                        <button
                          onClick={() => setSelectedOffer("seller")}
                          className="w-full p-4 rounded-xl border-2 border-border hover:border-accent bg-secondary/30 hover:bg-secondary/50 transition-all group text-left"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                              <TrendingUp className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground mb-1">
                                Home Selling Success Guide
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Maximize your home's value and sell faster
                              </p>
                              <ul className="mt-2 space-y-1">
                                {["Staging tips that sell", "Pricing strategies", "Marketing secrets"].map((item) => (
                                  <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <CheckCircle className="h-3 w-3 text-accent" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="text-center mb-4">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full text-accent text-sm font-medium">
                            <Sparkles className="h-4 w-4" />
                            {selectedOffer === "buyer" ? "Houston Home Buyer's Guide" : "Home Selling Success Guide"}
                          </div>
                        </div>

                        <div>
                          <Input
                            placeholder="Your name (optional)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div>
                          <Input
                            type="email"
                            placeholder="Enter your email *"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-12"
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
                          onClick={() => setSelectedOffer(null)}
                          className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          ← Choose different guide
                        </button>

                        <p className="text-xs text-center text-muted-foreground">
                          We respect your privacy. Unsubscribe anytime.
                        </p>
                      </form>
                    )}
                  </div>
                </>
              ) : (
                /* Success State */
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6"
                  >
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </motion.div>
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                    You're All Set!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Check your email for your free guide. It should arrive within a few minutes.
                  </p>
                  <Button onClick={handleClose} variant="outline" className="w-full">
                    Continue Browsing
                  </Button>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Questions? Call us at{" "}
                    <a href={`tel:${siteConfig.phoneRaw}`} className="text-accent hover:underline">
                      {siteConfig.phone}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
