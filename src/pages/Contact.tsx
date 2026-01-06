import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { siteConfig } from "@/lib/siteConfig";
import { trackContactForm, trackPhoneClick, trackEmailClick } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";

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
      // Track the contact form submission
      trackContactForm("contact_page");
      
      // Save lead to database
      const { error: dbError } = await supabase.from("leads").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: `Interest: ${formData.interest}\n\n${formData.message}`,
        lead_source: "contact_page",
      });

      if (dbError) {
        console.error("Error saving lead:", dbError);
      }

      // Send email notification via edge function
      const { error: emailError } = await supabase.functions.invoke("send-lead-notification", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `Interest: ${formData.interest}\n\n${formData.message}`,
          leadSource: "Contact Page",
        },
      });

      if (emailError) {
        console.error("Error sending email notification:", emailError);
      }

      toast.success("Message sent successfully! We'll be in touch within 24 hours.");
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
      </Helmet>

      <Layout>
        {/* Hero */}
        <section className="pt-40 pb-20 bg-primary">
          <div className="container-custom">
            <div className="max-w-3xl">
              <p className="text-accent font-medium tracking-wider uppercase mb-4">
                Let's Connect
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Start Your Real Estate
                <span className="block text-gradient-gold">Journey Today</span>
              </h1>
              <p className="text-xl text-primary-foreground/70">
                Ready to buy, sell, or invest? We're here to help you every step of the way.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Info */}
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
                  Get in Touch
                </h2>

                <div className="space-y-6 mb-12">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                      <a 
                        href={`tel:${siteConfig.phoneRaw}`} 
                        onClick={() => trackPhoneClick("contact_page")}
                        className="text-muted-foreground hover:text-accent transition-colors"
                      >
                        {siteConfig.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <a 
                        href={`mailto:${siteConfig.email}`} 
                        onClick={() => trackEmailClick("contact_page")}
                        className="text-muted-foreground hover:text-accent transition-colors"
                      >
                        {siteConfig.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Office</h3>
                      <p className="text-muted-foreground">
                        {siteConfig.address.street}<br />
                        {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Hours</h3>
                      <p className="text-muted-foreground">
                        Mon - Fri: {siteConfig.hours.weekdays}<br />
                        Saturday: {siteConfig.hours.saturday}<br />
                        Sunday: {siteConfig.hours.sunday}
                      </p>
                    </div>
                  </div>
                </div>

                {/* What to expect */}
                <Card className="p-6 bg-secondary border-0">
                  <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                    What to Expect
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Response within 24 hours",
                      "Free, no-obligation consultation",
                      "Personalized market analysis",
                      "Expert guidance from start to finish",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Contact Form */}
              <div>
                <Card className="p-8 border-0 shadow-card">
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Send Us a Message
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Full Name *
                        </label>
                        <Input
                          required
                          placeholder="John Smith"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email *
                        </label>
                        <Input
                          type="email"
                          required
                          placeholder="john@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone
                        </label>
                        <Input
                          type="tel"
                          placeholder="(832) 555-1234"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          I'm Interested In *
                        </label>
                        <select
                          required
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                          value={formData.interest}
                          onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                        >
                          <option value="">Select an option</option>
                          <option value="selling-buying">Selling & Buying</option>
                          <option value="buying">Buying a Home</option>
                          <option value="selling">Selling a Home</option>
                          <option value="renting">Renting</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Tell us about your real estate needs..."
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground resize-none focus:ring-2 focus:ring-ring"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <p className="text-xs text-muted-foreground">
                      By submitting this form, you acknowledge and agree to our Privacy Policy and consent to receiving marketing communications.
                    </p>

                    <Button type="submit" variant="gold" size="xl" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Message
                          <Send className="h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </Layout>

      {/* Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: `Contact ${siteConfig.agent.name}`,
          url: `${siteConfig.url}/contact`,
          mainEntity: {
            "@type": "RealEstateAgent",
            name: siteConfig.name,
            telephone: siteConfig.phone,
            email: siteConfig.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: siteConfig.address.street,
              addressLocality: siteConfig.address.city,
              addressRegion: siteConfig.address.state,
              postalCode: siteConfig.address.zip,
              addressCountry: "US",
            },
          },
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Contact", item: `${siteConfig.url}/contact` },
          ],
        })}
      </script>
    </>
  );
};

export default Contact;
