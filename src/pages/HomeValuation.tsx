import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { siteConfig } from "@/lib/siteConfig";
import { trackHomeValuation, trackCTAClick } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { Home, DollarSign, TrendingUp, Clock, CheckCircle, MapPin, Phone, Mail } from "lucide-react";

const HomeValuation = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "TX",
    zipCode: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    yearBuilt: "",
    propertyType: "",
    condition: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    timeframe: "",
    additionalInfo: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Track the home valuation request
      trackHomeValuation({
        address: formData.address,
        city: formData.city,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseFloat(formData.bathrooms) || 0,
      });

      const propertyAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`;
      const message = `Home Valuation Request\n\nProperty: ${propertyAddress}\nBedrooms: ${formData.bedrooms}\nBathrooms: ${formData.bathrooms}\nSqft: ${formData.squareFeet}\nYear Built: ${formData.yearBuilt}\nProperty Type: ${formData.propertyType}\nCondition: ${formData.condition}\nTimeframe: ${formData.timeframe}\n\nAdditional Info: ${formData.additionalInfo}`;

      // Save lead to database
      const { error: dbError } = await supabase.from("leads").insert({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone || null,
        message: message,
        property_address: propertyAddress,
        lead_source: "home_valuation",
      });

      if (dbError) {
        console.error("Error saving lead:", dbError);
      }

      // Send email notification via edge function
      const { error: emailError } = await supabase.functions.invoke("send-lead-notification", {
        body: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          message: message,
          propertyAddress: propertyAddress,
          leadSource: "Home Valuation Request",
        },
      });

      if (emailError) {
        console.error("Error sending email notification:", emailError);
      }

      toast({
        title: "Valuation Request Received!",
        description: "We'll analyze your property and send you a detailed valuation report within 24 hours.",
      });

      setFormData({
        address: "",
        city: "",
        state: "TX",
        zipCode: "",
        bedrooms: "",
        bathrooms: "",
        squareFeet: "",
        yearBuilt: "",
        propertyType: "",
        condition: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        timeframe: "",
        additionalInfo: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "Know Your Home's Worth",
      description: "Get an accurate market analysis based on recent comparable sales in your area.",
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      description: "Understand current market trends and how they affect your property value.",
    },
    {
      icon: Clock,
      title: "Quick & Free",
      description: "Receive your personalized valuation report within 24 hours, completely free.",
    },
    {
      icon: CheckCircle,
      title: "No Obligation",
      description: "Get valuable information with no pressure or commitment required.",
    },
  ];

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Free Home Valuation | Mike Ogunkeye Real Estate",
    description: "Get a free, no-obligation home valuation from Mike Ogunkeye. Find out what your home is worth in today's market.",
    url: `${siteConfig.url}/home-valuation`,
    mainEntity: {
      "@type": "Service",
      name: "Free Home Valuation",
      provider: {
        "@type": "RealEstateAgent",
        name: siteConfig.name,
        telephone: siteConfig.phone,
        email: siteConfig.email,
      },
      description: "Professional home valuation service providing accurate market analysis for homeowners.",
      areaServed: siteConfig.serviceAreas.map((n) => ({
        "@type": "City",
        name: n,
        containedInPlace: {
          "@type": "State",
          name: "Texas",
        },
      })),
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    },
  };

  return (
    <Layout>
      <Helmet>
        <title>Free Home Valuation | What's Your Home Worth? | Mike Ogunkeye Real Estate</title>
        <meta
          name="description"
          content="Get a free, no-obligation home valuation from Mike Ogunkeye. Find out what your Dallas-Fort Worth area home is worth in today's competitive market."
        />
        <meta name="keywords" content="home valuation, what's my home worth, free home estimate, Dallas home value, Fort Worth property value, sell my home" />
        <link rel="canonical" href={`${siteConfig.url}/home-valuation`} />
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Home className="h-4 w-4" />
              Free Home Valuation
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              What's Your Home <span className="text-primary">Really Worth?</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Get a free, no-obligation market analysis of your property. Our comprehensive valuation considers recent
              sales, market trends, and your home's unique features.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-sm bg-background">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Property Information</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll provide you with a comprehensive market analysis within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Property Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Property Address
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="address">Street Address *</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="123 Main Street"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Dallas"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="state">State</Label>
                            <Input id="state" name="state" value={formData.state} onChange={handleChange} />
                          </div>
                          <div>
                            <Label htmlFor="zipCode">ZIP Code *</Label>
                            <Input
                              id="zipCode"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleChange}
                              placeholder="75001"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Property Features */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Home className="h-5 w-5 text-primary" />
                        Property Features
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="bedrooms">Bedrooms *</Label>
                          <Select value={formData.bedrooms} onValueChange={(v) => handleSelectChange("bedrooms", v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6, "7+"].map((num) => (
                                <SelectItem key={num} value={String(num)}>
                                  {num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="bathrooms">Bathrooms *</Label>
                          <Select value={formData.bathrooms} onValueChange={(v) => handleSelectChange("bathrooms", v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {["1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5+"].map((num) => (
                                <SelectItem key={num} value={num}>
                                  {num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="squareFeet">Sq. Feet</Label>
                          <Input
                            id="squareFeet"
                            name="squareFeet"
                            type="number"
                            value={formData.squareFeet}
                            onChange={handleChange}
                            placeholder="2,500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="yearBuilt">Year Built</Label>
                          <Input
                            id="yearBuilt"
                            name="yearBuilt"
                            type="number"
                            value={formData.yearBuilt}
                            onChange={handleChange}
                            placeholder="2005"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="propertyType">Property Type *</Label>
                          <Select
                            value={formData.propertyType}
                            onValueChange={(v) => handleSelectChange("propertyType", v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single-family">Single Family Home</SelectItem>
                              <SelectItem value="townhouse">Townhouse</SelectItem>
                              <SelectItem value="condo">Condo</SelectItem>
                              <SelectItem value="multi-family">Multi-Family</SelectItem>
                              <SelectItem value="land">Land</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="condition">Property Condition</Label>
                          <Select value={formData.condition} onValueChange={(v) => handleSelectChange("condition", v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excellent">Excellent - Move-in ready</SelectItem>
                              <SelectItem value="good">Good - Minor updates needed</SelectItem>
                              <SelectItem value="fair">Fair - Some repairs needed</SelectItem>
                              <SelectItem value="needs-work">Needs Work - Major renovation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Your Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="John"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Smith"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="(555) 123-4567"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="timeframe">When are you looking to sell?</Label>
                        <Select value={formData.timeframe} onValueChange={(v) => handleSelectChange("timeframe", v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeframe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asap">As soon as possible</SelectItem>
                            <SelectItem value="1-3-months">1-3 months</SelectItem>
                            <SelectItem value="3-6-months">3-6 months</SelectItem>
                            <SelectItem value="6-12-months">6-12 months</SelectItem>
                            <SelectItem value="just-curious">Just curious about value</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="additionalInfo">Additional Information</Label>
                        <Textarea
                          id="additionalInfo"
                          name="additionalInfo"
                          value={formData.additionalInfo}
                          onChange={handleChange}
                          placeholder="Any additional details about your property or specific questions you have..."
                          rows={4}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                      onClick={() => trackCTAClick("home_valuation_submit", "valuation_form")}
                    >
                      {isSubmitting ? "Submitting..." : "Get My Free Valuation"}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      By submitting this form, you agree to receive communications from {siteConfig.name}. Your
                      information will never be shared with third parties.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg bg-primary text-primary-foreground">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">Why Choose Mike?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span>15+ years of DFW market experience</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span>Homes sell 18% faster than average</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span>97% of asking price achieved on average</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span>$200M+ in career sales</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Questions? Let's Talk</h3>
                  <div className="space-y-4">
                    <a
                      href={`tel:${siteConfig.phone}`}
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => trackCTAClick("phone_click", "valuation_sidebar")}
                    >
                      <Phone className="h-5 w-5" />
                      <span>{siteConfig.phone}</span>
                    </a>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => trackCTAClick("email_click", "valuation_sidebar")}
                    >
                      <Mail className="h-5 w-5" />
                      <span>{siteConfig.email}</span>
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-muted/50">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">What You'll Receive</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Detailed comparable sales analysis</li>
                    <li>• Current market conditions report</li>
                    <li>• Suggested listing price range</li>
                    <li>• Home preparation recommendations</li>
                    <li>• Personalized marketing strategy</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomeValuation;
