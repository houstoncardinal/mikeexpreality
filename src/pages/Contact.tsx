import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { siteConfig } from "@/lib/siteConfig";
import { trackContactForm, trackPhoneClick, trackEmailClick } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { getContactPageSchemas, getFAQSchema, getRealEstateAgentSchema } from "@/lib/schema";

const contactFAQs = [
  {
    question: "How quickly will I receive a response after contacting Mike Ogunkeye?",
    answer: "We aim to respond to all inquiries within 24 hours. For urgent matters, we recommend calling directly at (832) 340-8787 for immediate assistance.",
  },
  {
    question: "What should I prepare before my consultation?",
    answer: "For buyers, have an idea of your budget, preferred areas, and must-have features. For sellers, gather information about your property including any recent improvements. We'll guide you through the rest during our consultation.",
  },
  {
    question: "Is the initial consultation free?",
    answer: "Yes! We offer free, no-obligation consultations for both buyers and sellers. This allows us to understand your needs and explain how we can help you achieve your real estate goals.",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      trackContactForm("contact_page");
      
      const { error: dbError } = await supabase.from("leads").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: `Interest: ${formData.interest}\n\n${formData.message}`,
        lead_source: "contact_page",
      });

      if (dbError) console.error("Error saving lead:", dbError);

      const { error: emailError } = await supabase.functions.invoke("send-lead-notification", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `Interest: ${formData.interest}\n\n${formData.message}`,
          leadSource: "Contact Page",
        },
      });

      if (emailError) console.error("Error sending email notification:", emailError);

      toast.success("Message sent! We'll be in touch within 24 hours.");
      setFormData({ name: "", email: "", phone: "", interest: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact {siteConfig.agent.name} | {siteConfig.brokerage} | Houston Real Estate</title>
        <meta
          name="description"
          content={`Get in touch with ${siteConfig.agent.name} at ${siteConfig.brokerage}. Schedule a free consultation for buying, selling, or investing in Houston area real estate. Call ${siteConfig.phone}.`}
        />
        <link rel="canonical" href={`${siteConfig.url}/contact`} />
        <meta property="og:title" content={`Contact ${siteConfig.agent.name}`} />
        <meta property="og:description" content={`Schedule a free consultation with ${siteConfig.agent.name} for all your real estate needs.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteConfig.url}/contact`} />
      </Helmet>

      <Layout>
        {/* Hero */}
        <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-primary">
          <div className="container-custom">
            <div className="max-w-2xl">
              <p className="text-accent font-medium tracking-widest uppercase mb-4 text-xs">
                Contact
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-5 leading-tight">
                Let's Start Your Journey
              </h1>
              <p className="text-lg text-primary-foreground/60">
                Ready to buy, sell, or invest? We're here to help every step of the way.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container-custom">
            <div className="grid lg:grid-cols-5 gap-16">
              {/* Info */}
              <div className="lg:col-span-2">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-8">
                  Get in Touch
                </h2>

                <div className="space-y-5 mb-10">
                  {[
                    { icon: Phone, label: "Phone", value: siteConfig.phone, href: `tel:${siteConfig.phoneRaw}`, onClick: () => trackPhoneClick("contact_page") },
                    { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}`, onClick: () => trackEmailClick("contact_page") },
                  ].map(({ icon: Icon, label, value, href, onClick }) => (
                    <a key={label} href={href} onClick={onClick} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{value}</p>
                      </div>
                    </a>
                  ))}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Office</p>
                      <p className="text-sm text-foreground">
                        {siteConfig.address.street}, {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Hours</p>
                      <p className="text-sm text-foreground">Mon–Fri: {siteConfig.hours.weekdays}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-secondary/50 border border-border/50">
                  <h3 className="font-semibold text-foreground text-sm mb-3">What to Expect</h3>
                  <ul className="space-y-2">
                    {["Response within 24 hours", "Free, no-obligation consultation", "Personalized market analysis"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-muted-foreground text-sm">
                        <CheckCircle className="h-3.5 w-3.5 text-accent shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-3">
                <div className="p-8 rounded-2xl bg-card border border-border/50">
                  <h2 className="font-serif text-xl font-bold text-foreground mb-6">
                    Send a Message
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">Full Name *</label>
                        <Input required placeholder="John Smith" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">Email *</label>
                        <Input type="email" required placeholder="john@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">Phone</label>
                        <Input type="tel" placeholder="(832) 555-1234" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">Interest *</label>
                        <select
                          required
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                          value={formData.interest}
                          onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                        >
                          <option value="">Select</option>
                          <option value="buying">Buying</option>
                          <option value="selling">Selling</option>
                          <option value="selling-buying">Both</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">Message *</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us about your needs..."
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm resize-none focus:ring-2 focus:ring-ring"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <p className="text-[11px] text-muted-foreground">
                      By submitting, you agree to our Privacy Policy and consent to receiving communications.
                    </p>

                    <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : (
                        <>Send Message <Send className="ml-2 h-4 w-4" /></>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>

      <SchemaMarkup schemas={[...getContactPageSchemas(), getRealEstateAgentSchema(), getFAQSchema(contactFAQs)]} />
    </>
  );
};

export default Contact;
