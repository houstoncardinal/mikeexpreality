import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, Calendar } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import { toast } from "sonner";
import { trackPropertyInquiry, trackPhoneClick, trackEmailClick, trackCTAClick } from "@/lib/analytics";

interface PropertyContactFormProps {
  propertyTitle: string;
  propertyAddress: string;
  propertyId?: string;
}

export const PropertyContactForm = ({ propertyTitle, propertyAddress, propertyId }: PropertyContactFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `I'm interested in ${propertyTitle} at ${propertyAddress}. Please contact me with more information.`,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Track the property inquiry
    trackPropertyInquiry(propertyId || propertyTitle, propertyAddress);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success("Your inquiry has been sent! We'll be in touch soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: `I'm interested in ${propertyTitle} at ${propertyAddress}. Please contact me with more information.`,
    });
    setIsSubmitting(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-card sticky top-24">
      <h3 className="font-serif text-xl font-bold text-foreground mb-4">
        Interested in This Property?
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <Input
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <Textarea
          placeholder="Message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          required
        />
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Request Information"}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-border space-y-4">
        <p className="text-sm text-muted-foreground text-center">Or contact directly:</p>
        
        <a
          href={`tel:${siteConfig.phoneRaw}`}
          onClick={() => trackPhoneClick("property_contact_form")}
          className="flex items-center justify-center gap-2 p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
        >
          <Phone className="h-4 w-4 text-accent" />
          <span className="font-medium text-foreground">{siteConfig.phone}</span>
        </a>
        
        <a
          href={`mailto:${siteConfig.email}?subject=Inquiry: ${propertyTitle}`}
          onClick={() => trackEmailClick("property_contact_form")}
          className="flex items-center justify-center gap-2 p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
        >
          <Mail className="h-4 w-4 text-accent" />
          <span className="font-medium text-foreground">{siteConfig.email}</span>
        </a>

        <Button 
          variant="outline" 
          className="w-full" 
          asChild
          onClick={() => trackCTAClick("schedule_showing", "property_contact_form")}
        >
          <a href={`/contact?property=${encodeURIComponent(propertyTitle)}`}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule a Showing
          </a>
        </Button>
      </div>

      {/* Agent Info */}
      <div className="mt-6 pt-6 border-t border-border text-center">
        <p className="font-semibold text-foreground">{siteConfig.agent.name}</p>
        <p className="text-sm text-muted-foreground">{siteConfig.brokerage}</p>
      </div>
    </div>
  );
};
