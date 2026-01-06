import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Send,
  User,
  Clock,
  ArrowRight,
  Sparkles,
  Star,
  Award,
  Shield,
  Heart,
  Zap,
  CheckCircle,
  Home,
  Building2,
  Camera,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/siteConfig";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { trackUserAction } from "@/lib/adaptiveLearning";

const quickActions = [
  {
    icon: Phone,
    label: "Call Now",
    description: "Speak directly with Mike",
    action: "phone",
    href: `tel:${siteConfig.phoneRaw}`,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
  {
    icon: Calendar,
    label: "Schedule Tour",
    description: "Book a property viewing",
    action: "tour",
    href: "/contact",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  {
    icon: Mail,
    label: "Email Us",
    description: "Send us a message",
    action: "email",
    href: `mailto:${siteConfig.email}`,
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    textColor: "text-amber-700 dark:text-amber-300",
  },
  {
    icon: Video,
    label: "Virtual Tour",
    description: "Experience properties remotely",
    action: "virtual",
    href: "/listings",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    textColor: "text-purple-700 dark:text-purple-300",
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    text: "Mike found us our dream home in just 2 weeks!",
    rating: 5,
  },
  {
    name: "David L.",
    text: "Professional, knowledgeable, and truly cares about his clients.",
    rating: 5,
  },
  {
    name: "Jennifer K.",
    text: "The best real estate experience we've ever had.",
    rating: 5,
  },
];

export function ContactFlyout() {
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [pulseEffect, setPulseEffect] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    preferredTime: "morning",
    propertyType: "any",
    budget: "",
  });

  // Auto-rotate testimonials
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Disable pulse after interaction
  useEffect(() => {
    const timer = setTimeout(() => setPulseEffect(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("leads").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `Enhanced Contact Form Submission\n\nPreferred Time: ${formData.preferredTime}\nProperty Type: ${formData.propertyType}\nBudget: ${formData.budget}\n\nMessage: ${formData.message}`,
        lead_source: "enhanced_contact_flyout",
      });

      if (error) throw error;

      toast.success("Thank you! We'll be in touch within 30 minutes.");
      trackUserAction('contact_form_submitted', window.location.pathname, {
        preferredTime: formData.preferredTime,
        propertyType: formData.propertyType,
        hasBudget: !!formData.budget,
      });

      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
        preferredTime: "morning",
        propertyType: "any",
        budget: "",
      });
      setShowForm(false);
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again.");
      trackUserAction('contact_form_failed', window.location.pathname, { error: 'submission_error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    trackUserAction('quick_action_clicked', window.location.pathname, {
      action: action.action,
      label: action.label,
    });

    if (action.href.startsWith('http') || action.href.startsWith('mailto:') || action.href.startsWith('tel:')) {
      window.open(action.href, '_blank');
    } else {
      window.location.href = action.href;
    }
  };

  return (
    <>
      {/* Floating Button - Mobile Optimized */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40",
          "flex items-center justify-center",
          "w-14 h-14 md:w-auto md:h-auto md:px-5 md:py-3.5 rounded-full",
          "bg-gradient-royal text-primary-foreground shadow-royal",
          "hover:shadow-glow-lg active:scale-95 transition-all duration-300 group",
          isOpen && "scale-0 opacity-0"
        )}
      >
        <MessageCircle className="h-6 w-6 md:h-5 md:w-5" />
        <span className="hidden md:inline font-semibold ml-2">Contact Us</span>
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full"
        />
      </motion.button>

      {/* Flyout Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsOpen(false);
                setShowForm(false);
              }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
            />

            {/* Panel - Mobile Optimized */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm sm:max-w-md md:w-[420px] bg-card shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="relative bg-gradient-navy p-6 pb-8">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowForm(false);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                >
                  <X className="h-5 w-5 text-primary-foreground" />
                </button>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-royal flex items-center justify-center shadow-royal">
                    <Sparkles className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-primary-foreground">
                      Let's Connect
                    </h3>
                    <p className="text-primary-foreground/70 text-sm">
                      We're here to help you find your dream home
                    </p>
                  </div>
                </div>

                {/* Agent Info */}
                <div className="flex items-center gap-3 bg-primary-foreground/10 rounded-xl p-3 backdrop-blur-sm">
                  <img
                    src="https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85,fit=scale-down,width=400/https://media-production.lp-cdn.com/media/3e061cc4-19fe-4964-9802-0ef4ec5783d2"
                    alt={siteConfig.agent.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gold"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-primary-foreground text-sm">
                      {siteConfig.agent.name}
                    </p>
                    <p className="text-primary-foreground/60 text-xs">
                      {siteConfig.agent.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-primary-foreground/70">
                    <Clock className="h-3 w-3" />
                    <span>Online</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {!showForm ? (
                    <motion.div
                      key="actions"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      {/* Quick Actions */}
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                        Quick Actions
                      </p>
                      
                      {/* Enhanced Quick Actions Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {quickActions.map((action, index) => (
                          <motion.button
                            key={action.label}
                            onClick={() => handleQuickAction(action)}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
                            className={cn(
                              "flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 group",
                              "hover:scale-105 active:scale-95",
                              action.bgColor,
                              "border border-border/50 hover:border-border"
                            )}
                          >
                            <div className={cn(
                              "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-all",
                              action.color,
                              "group-hover:scale-110"
                            )}>
                              <action.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-center">
                              <p className={cn(
                                "font-semibold text-sm leading-tight",
                                action.textColor
                              )}>
                                {action.label}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 leading-tight">
                                {action.description}
                              </p>
                            </div>
                          </motion.button>
                        ))}
                      </div>

                      {/* Social Proof - Rotating Testimonials */}
                      <motion.div
                        key={`testimonial-${currentTestimonial}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-gradient-to-r from-accent/5 to-accent/10 rounded-xl p-4 mb-6 border border-accent/20"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-xs font-medium text-accent">
                            {testimonials[currentTestimonial].name}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground italic leading-relaxed">
                          "{testimonials[currentTestimonial].text}"
                        </p>
                      </motion.div>

                      {/* Trust Indicators */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-4 mb-6"
                      >
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Shield className="h-3 w-3 text-green-500" />
                          <span>Licensed</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Award className="h-3 w-3 text-blue-500" />
                          <span>Top Producer</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Heart className="h-3 w-3 text-red-500" />
                          <span>5-Star Service</span>
                        </div>
                      </motion.div>

                      {/* Callback Request Button */}
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        onClick={() => setShowForm(true)}
                        className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-gradient-royal text-primary-foreground rounded-xl font-semibold hover:shadow-royal transition-all"
                      >
                        <User className="h-5 w-5" />
                        Request a Callback
                      </motion.button>

                      {/* Contact Info */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 pt-6 border-t border-border"
                      >
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                          Direct Contact
                        </p>
                        <div className="space-y-3">
                          <a
                            href={`tel:${siteConfig.phoneRaw}`}
                            className="flex items-center gap-3 text-foreground hover:text-accent transition-colors"
                          >
                            <Phone className="h-4 w-4 text-accent" />
                            <span>{siteConfig.phone}</span>
                          </a>
                          <a
                            href={`mailto:${siteConfig.email}`}
                            className="flex items-center gap-3 text-foreground hover:text-accent transition-colors"
                          >
                            <Mail className="h-4 w-4 text-accent" />
                            <span>{siteConfig.email}</span>
                          </a>
                          <div className="flex items-start gap-3 text-foreground">
                            <MapPin className="h-4 w-4 text-accent mt-0.5" />
                            <span>{siteConfig.address.full}</span>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                      >
                        <ArrowRight className="h-4 w-4 rotate-180" />
                        Back to options
                      </button>

                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Request a Callback
                      </p>

                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1.5 block">
                            Your Name
                          </label>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Smith"
                            required
                            className="h-12"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground mb-1.5 block">
                            Phone Number
                          </label>
                          <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="(555) 123-4567"
                            required
                            className="h-12"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground mb-1.5 block">
                            Email Address
                          </label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                            required
                            className="h-12"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground mb-1.5 block">
                            Preferred Time
                          </label>
                          <select
                            value={formData.preferredTime}
                            onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                            className="w-full h-12 px-4 rounded-md bg-secondary text-foreground border-0 focus:ring-2 focus:ring-ring"
                          >
                            <option value="morning">Morning (9AM - 12PM)</option>
                            <option value="afternoon">Afternoon (12PM - 5PM)</option>
                            <option value="evening">Evening (5PM - 8PM)</option>
                            <option value="anytime">Any time</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground mb-1.5 block">
                            Message (Optional)
                          </label>
                          <Textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Tell us about what you're looking for..."
                            rows={3}
                            className="resize-none"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        variant="gold"
                        size="xl"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                            />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            Submit Request
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        We typically respond within 30 minutes during business hours.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-4 bg-secondary/50 border-t border-border text-center">
                <p className="text-xs text-muted-foreground">
                  Available Mon-Sat 9AM-8PM CST
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
