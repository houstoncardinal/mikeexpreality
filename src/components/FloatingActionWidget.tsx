import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  MessageCircle, 
  X, 
  Home, 
  Phone, 
  Mail, 
  PhoneCall, 
  Sparkles,
  Building2,
  Calendar,
  ArrowRight,
  Send,
  User,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/siteConfig";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { trackUserAction } from "@/lib/adaptiveLearning";

type WidgetView = "menu" | "callback" | "concierge" | "success";

const callbackSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  preferredTime: z.string().optional(),
});

const conciergeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  preferences: z.string().min(10, "Please describe your preferences"),
});

export function FloatingActionWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<WidgetView>("menu");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(true);
  const navigate = useNavigate();

  // Callback form state
  const [callbackName, setCallbackName] = useState("");
  const [callbackPhone, setCallbackPhone] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  // Concierge form state
  const [conciergeName, setConciergeName] = useState("");
  const [conciergeEmail, setConciergeEmail] = useState("");
  const [conciergePhone, setConciergePhone] = useState("");
  const [conciergePreferences, setConciergePreferences] = useState("");

  // Disable pulse after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setPulseEffect(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Listen for concierge open events from guided tour
  useEffect(() => {
    const handleOpenConcierge = () => {
      setIsOpen(true);
      setCurrentView('concierge');
    };

    window.addEventListener('openConcierge', handleOpenConcierge);
    return () => window.removeEventListener('openConcierge', handleOpenConcierge);
  }, []);

  const resetForms = () => {
    setCallbackName("");
    setCallbackPhone("");
    setPreferredTime("");
    setConciergeName("");
    setConciergeEmail("");
    setConciergePhone("");
    setConciergePreferences("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setCurrentView("menu");
      resetForms();
    }, 300);
  };

  const handleCallbackSubmit = async () => {
    try {
      callbackSchema.parse({ name: callbackName, phone: callbackPhone, preferredTime });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      name: callbackName,
      email: `callback-${Date.now()}@placeholder.com`,
      phone: callbackPhone,
      message: `Callback Request - Preferred time: ${preferredTime || "Any time"}`,
      lead_source: "callback_widget",
    });

    if (error) {
      toast.error("Failed to submit request");
      trackUserAction('callback_submit_failed', window.location.pathname, { error: error.message });
    } else {
      setCurrentView("success");
      trackUserAction('callback_submitted', window.location.pathname, {
        name: callbackName,
        preferredTime: preferredTime || "Any time"
      });
    }
    setIsSubmitting(false);
  };

  const handleConciergeSubmit = async () => {
    try {
      conciergeSchema.parse({
        name: conciergeName,
        email: conciergeEmail,
        phone: conciergePhone,
        preferences: conciergePreferences
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      name: conciergeName,
      email: conciergeEmail,
      phone: conciergePhone || null,
      message: `LUXURY CONCIERGE REQUEST\n\nPreferences:\n${conciergePreferences}`,
      lead_source: "concierge_widget",
    });

    if (error) {
      toast.error("Failed to submit request");
      trackUserAction('concierge_submit_failed', window.location.pathname, { error: error.message });
    } else {
      setCurrentView("success");
      trackUserAction('concierge_submitted', window.location.pathname, {
        name: conciergeName,
        email: conciergeEmail,
        preferences: conciergePreferences.substring(0, 100) + (conciergePreferences.length > 100 ? '...' : '')
      });
    }
    setIsSubmitting(false);
  };

  const menuItems = [
    {
      icon: Home,
      label: "View Properties",
      description: "Browse our exclusive listings",
      color: "from-blue-500 to-blue-600",
      action: () => {
        navigate("/listings");
        handleClose();
      },
    },
    {
      icon: Phone,
      label: "Call Us",
      description: siteConfig.phone,
      color: "from-emerald-500 to-emerald-600",
      action: () => {
        window.location.href = `tel:${siteConfig.phoneRaw}`;
      },
    },
    {
      icon: Mail,
      label: "Email Us",
      description: siteConfig.email,
      color: "from-amber-500 to-amber-600",
      action: () => {
        window.location.href = `mailto:${siteConfig.email}`;
      },
    },
    {
      icon: PhoneCall,
      label: "Request Callback",
      description: "We'll call you back",
      color: "from-purple-500 to-purple-600",
      action: () => setCurrentView("callback"),
    },
    {
      icon: Sparkles,
      label: "Luxury Concierge",
      description: "VIP property search",
      color: "from-rose-500 to-rose-600",
      action: () => setCurrentView("concierge"),
    },
  ];

  return (
    <>
      {/* Overlay when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      {/* Widget Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-36 md:bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm"
          >
            <Card className="overflow-hidden shadow-2xl border-0 bg-card">
              {/* Header */}
              <div className="bg-gradient-to-r from-accent via-accent/90 to-accent/80 p-5 text-accent-foreground relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-50" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-bold">{siteConfig.shortName}</h3>
                        <p className="text-xs text-white/80">{siteConfig.brokerage}</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleClose}
                      className="p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm text-white/90">How can we help you today?</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  {currentView === "menu" && (
                    <motion.div
                      key="menu"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-2"
                    >
                      {menuItems.map((item, index) => (
                        <motion.button
                          key={item.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={item.action}
                          className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-secondary transition-all group text-left"
                        >
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                            <item.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{item.label}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                        </motion.button>
                      ))}
                    </motion.div>
                  )}

                  {currentView === "callback" && (
                    <motion.div
                      key="callback"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <button
                        onClick={() => setCurrentView("menu")}
                        className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-1"
                      >
                        ← Back to menu
                      </button>
                      
                      <div className="text-center mb-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center mx-auto mb-3">
                          <PhoneCall className="h-6 w-6" />
                        </div>
                        <h4 className="font-serif text-lg font-bold text-foreground">Request a Callback</h4>
                        <p className="text-sm text-muted-foreground">We'll reach out at your convenience</p>
                      </div>

                      <div className="space-y-3">
                        <Input
                          placeholder="Your name"
                          value={callbackName}
                          onChange={(e) => setCallbackName(e.target.value)}
                        />
                        <Input
                          placeholder="Phone number"
                          type="tel"
                          value={callbackPhone}
                          onChange={(e) => setCallbackPhone(e.target.value)}
                        />
                        <Input
                          placeholder="Preferred time (optional)"
                          value={preferredTime}
                          onChange={(e) => setPreferredTime(e.target.value)}
                        />
                        <Button 
                          onClick={handleCallbackSubmit} 
                          disabled={isSubmitting}
                          className="w-full gap-2"
                        >
                          <Send className="h-4 w-4" />
                          {isSubmitting ? "Submitting..." : "Request Callback"}
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {currentView === "concierge" && (
                    <motion.div
                      key="concierge"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <button
                        onClick={() => setCurrentView("menu")}
                        className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-1"
                      >
                        ← Back to menu
                      </button>
                      
                      <div className="text-center mb-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-white flex items-center justify-center mx-auto mb-3">
                          <Sparkles className="h-6 w-6" />
                        </div>
                        <h4 className="font-serif text-lg font-bold text-foreground">Luxury Concierge</h4>
                        <p className="text-sm text-muted-foreground">Personalized VIP property search</p>
                      </div>

                      <div className="space-y-3">
                        <Input
                          placeholder="Your name"
                          value={conciergeName}
                          onChange={(e) => setConciergeName(e.target.value)}
                        />
                        <Input
                          placeholder="Email address"
                          type="email"
                          value={conciergeEmail}
                          onChange={(e) => setConciergeEmail(e.target.value)}
                        />
                        <Input
                          placeholder="Phone (optional)"
                          type="tel"
                          value={conciergePhone}
                          onChange={(e) => setConciergePhone(e.target.value)}
                        />
                        <Textarea
                          placeholder="Tell us about your dream property: location, style, budget, must-haves..."
                          value={conciergePreferences}
                          onChange={(e) => setConciergePreferences(e.target.value)}
                          rows={4}
                          className="resize-none"
                        />
                        <Button 
                          onClick={handleConciergeSubmit} 
                          disabled={isSubmitting}
                          className="w-full gap-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700"
                        >
                          <Sparkles className="h-4 w-4" />
                          {isSubmitting ? "Submitting..." : "Start VIP Search"}
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {currentView === "success" && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4"
                      >
                        <CheckCircle className="h-8 w-8" />
                      </motion.div>
                      <h4 className="font-serif text-xl font-bold text-foreground mb-2">Thank You!</h4>
                      <p className="text-muted-foreground mb-6">
                        We've received your request and will be in touch shortly.
                      </p>
                      <Button onClick={handleClose}>Close</Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-border bg-secondary/30 text-center">
                <p className="text-xs text-muted-foreground">
                  Available {siteConfig.hours.weekdays}
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button - positioned to avoid mobile toolbar */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.5 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? "bg-secondary text-foreground rotate-0"
            : "bg-gradient-to-br from-accent to-accent/80 text-accent-foreground hover:shadow-accent/30 hover:shadow-xl"
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-7 w-7" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="h-7 w-7" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Pulse effect */}
        {!isOpen && pulseEffect && (
          <>
            <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-25" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-background flex items-center justify-center">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            </span>
          </>
        )}
      </motion.button>
    </>
  );
}
