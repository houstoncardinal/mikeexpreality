import { useState } from "react";
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
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/lib/siteConfig";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const quickActions = [
  {
    icon: Phone,
    label: "Call Now",
    description: "Speak directly with Mike",
    action: "phone",
    href: `tel:${siteConfig.phoneRaw}`,
  },
  {
    icon: Calendar,
    label: "Schedule Tour",
    description: "Book a property viewing",
    action: "tour",
    href: "/contact",
  },
  {
    icon: Mail,
    label: "Email Us",
    description: "Send us a message",
    action: "email",
    href: `mailto:${siteConfig.email}`,
  },
];

export function ContactFlyout() {
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    preferredTime: "morning",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("leads").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `Callback Request (Preferred: ${formData.preferredTime})\n\n${formData.message}`,
        lead_source: "contact_flyout",
      });

      if (error) throw error;

      toast.success("Request submitted! We'll contact you soon.");
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
        preferredTime: "morning",
      });
      setShowForm(false);
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3.5 rounded-full",
          "bg-gradient-royal text-primary-foreground shadow-royal",
          "hover:shadow-glow-lg transition-all duration-300 group",
          isOpen && "scale-0 opacity-0"
        )}
      >
        <MessageCircle className="h-5 w-5" />
        <span className="font-semibold">Contact Us</span>
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

            {/* Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-card shadow-2xl z-50 flex flex-col overflow-hidden"
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
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
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
                      
                      {quickActions.map((action, index) => (
                        <motion.a
                          key={action.label}
                          href={action.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4 p-4 bg-secondary hover:bg-accent/10 rounded-xl transition-all group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                            <action.icon className="h-5 w-5 text-accent" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground group-hover:text-accent transition-colors">
                              {action.label}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {action.description}
                            </p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                        </motion.a>
                      ))}

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