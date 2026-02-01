import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import {
  Home,
  MapPin,
  GraduationCap,
  Users,
  DollarSign,
  Heart,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Building2,
  TreePine,
  Car,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

// Form schema
const formSchema = z.object({
  // Step 1 - Contact
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone number is required"),
  
  // Step 2 - Home Type
  homeType: z.array(z.string()).min(1, "Select at least one home type"),
  
  // Step 3 - Budget
  budgetMin: z.string().min(1, "Select minimum budget"),
  budgetMax: z.string().min(1, "Select maximum budget"),
  
  // Step 4 - Areas
  preferredAreas: z.array(z.string()).min(1, "Select at least one area"),
  
  // Step 5 - Bedrooms & Size
  bedrooms: z.string().min(1, "Select bedrooms"),
  bathrooms: z.string().min(1, "Select bathrooms"),
  minSqft: z.string().optional(),
  
  // Step 6 - Family & Schools
  hasChildren: z.boolean(),
  childrenAges: z.string().optional(),
  schoolPriority: z.string().optional(),
  
  // Step 7 - Must-Haves
  mustHaves: z.array(z.string()),
  
  // Step 8 - Timeline & Notes
  timeline: z.string().min(1, "Select timeline"),
  additionalNotes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  { id: 1, title: "Let's Connect", icon: Phone, description: "Tell us about yourself" },
  { id: 2, title: "Home Style", icon: Home, description: "What type of home?" },
  { id: 3, title: "Your Budget", icon: DollarSign, description: "Investment range" },
  { id: 4, title: "Location", icon: MapPin, description: "Preferred areas" },
  { id: 5, title: "Space Needs", icon: Building2, description: "Size requirements" },
  { id: 6, title: "Family & Schools", icon: GraduationCap, description: "Education priorities" },
  { id: 7, title: "Must-Haves", icon: Heart, description: "Essential features" },
  { id: 8, title: "Timeline", icon: Sparkles, description: "Final details" },
];

const homeTypes = [
  { value: "single_family", label: "Single Family", icon: Home },
  { value: "townhouse", label: "Townhouse", icon: Building2 },
  { value: "condo", label: "Condo", icon: Building2 },
  { value: "new_construction", label: "New Construction", icon: Sparkles },
  { value: "luxury", label: "Luxury Estate", icon: Heart },
  { value: "land", label: "Land/Lot", icon: TreePine },
];

const budgetRanges = [
  "$150K", "$200K", "$250K", "$300K", "$350K", "$400K", 
  "$450K", "$500K", "$600K", "$750K", "$1M", "$1.5M", "$2M+"
];

const areas = [
  "Houston", "Sugar Land", "Katy", "Cypress", "Richmond",
  "Missouri City", "Pearland", "Rosenberg", "Rosharon", "Stafford"
];

const bedroomOptions = ["1", "2", "3", "4", "5", "6+"];
const bathroomOptions = ["1", "1.5", "2", "2.5", "3", "3.5", "4+"];

const schoolPriorities = [
  "Top-rated public schools",
  "Private school access",
  "Specific school district",
  "Not a priority right now"
];

const mustHaveFeatures = [
  { value: "pool", label: "Swimming Pool", icon: "🏊" },
  { value: "garage", label: "2+ Car Garage", icon: "🚗" },
  { value: "yard", label: "Large Backyard", icon: "🌳" },
  { value: "updated_kitchen", label: "Updated Kitchen", icon: "🍳" },
  { value: "home_office", label: "Home Office", icon: "💼" },
  { value: "single_story", label: "Single Story", icon: "🏠" },
  { value: "gated", label: "Gated Community", icon: "🔒" },
  { value: "hoa_low", label: "Low/No HOA", icon: "💰" },
  { value: "energy_efficient", label: "Energy Efficient", icon: "⚡" },
  { value: "smart_home", label: "Smart Home Features", icon: "📱" },
  { value: "open_floor", label: "Open Floor Plan", icon: "📐" },
  { value: "waterfront", label: "Waterfront/Lake View", icon: "🌊" },
];

const timelineOptions = [
  "Immediately (0-30 days)",
  "Soon (1-3 months)",
  "This year (3-6 months)",
  "Just exploring options",
];

export default function HomeSearch() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      homeType: [],
      budgetMin: "",
      budgetMax: "",
      preferredAreas: [],
      bedrooms: "",
      bathrooms: "",
      minSqft: "",
      hasChildren: false,
      childrenAges: "",
      schoolPriority: "",
      mustHaves: [],
      timeline: "",
      additionalNotes: "",
    },
    mode: "onChange",
  });

  const progress = (currentStep / steps.length) * 100;

  const canProceed = () => {
    const values = form.getValues();
    switch (currentStep) {
      case 1:
        return values.name.length >= 2 && values.email.includes("@") && values.phone.length >= 10;
      case 2:
        return values.homeType.length > 0;
      case 3:
        return values.budgetMin && values.budgetMax;
      case 4:
        return values.preferredAreas.length > 0;
      case 5:
        return values.bedrooms && values.bathrooms;
      case 6:
        return true; // Optional step
      case 7:
        return true; // Optional step
      case 8:
        return values.timeline !== "";
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length && canProceed()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Build comprehensive notes from form data
      const preferences = {
        homeType: data.homeType,
        budget: { min: data.budgetMin, max: data.budgetMax },
        areas: data.preferredAreas,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        minSqft: data.minSqft,
        family: {
          hasChildren: data.hasChildren,
          childrenAges: data.childrenAges,
          schoolPriority: data.schoolPriority,
        },
        mustHaves: data.mustHaves,
        timeline: data.timeline,
        additionalNotes: data.additionalNotes,
      };

      const notesText = `
HOME PREFERENCES:
- Type: ${data.homeType.join(", ")}
- Budget: ${data.budgetMin} - ${data.budgetMax}
- Areas: ${data.preferredAreas.join(", ")}
- Bedrooms: ${data.bedrooms} | Bathrooms: ${data.bathrooms}
- Min Sqft: ${data.minSqft || "Not specified"}

FAMILY & SCHOOLS:
- Has Children: ${data.hasChildren ? "Yes" : "No"}
- Children Ages: ${data.childrenAges || "N/A"}
- School Priority: ${data.schoolPriority || "Not specified"}

MUST-HAVES:
${data.mustHaves.length > 0 ? data.mustHaves.map(f => `- ${f}`).join("\n") : "None specified"}

TIMELINE: ${data.timeline}

ADDITIONAL NOTES:
${data.additionalNotes || "None"}

---
RAW DATA: ${JSON.stringify(preferences)}
      `.trim();

      // Insert lead into Supabase
      const { error } = await supabase.from("leads").insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        lead_source: "home_search_questionnaire",
        message: `Home Search Preferences - Timeline: ${data.timeline}`,
        notes: notesText,
        status: "new",
      });

      if (error) throw error;

      // Send immediate notification to agent
      try {
        await supabase.functions.invoke("send-lead-notification", {
          body: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: `🏠 New Home Search Lead!\n\nTimeline: ${data.timeline}\nBudget: ${data.budgetMin} - ${data.budgetMax}\nAreas: ${data.preferredAreas.join(", ")}\nHome Type: ${data.homeType.join(", ")}`,
            source: "Home Search Questionnaire",
          },
        });
      } catch (notifyError) {
        console.error("Notification error:", notifyError);
      }

      // Send personalized property recommendations email
      try {
        await supabase.functions.invoke("send-property-recommendations", {
          body: {
            name: data.name,
            email: data.email,
            homeType: data.homeType,
            budget: { min: data.budgetMin, max: data.budgetMax },
            areas: data.preferredAreas,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            mustHaves: data.mustHaves,
            timeline: data.timeline,
            schoolPriority: data.schoolPriority,
          },
        });
      } catch (recommendError) {
        console.error("Recommendations email error:", recommendError);
      }

      setIsComplete(true);
      toast({
        title: "Perfect! We've Got Your Preferences",
        description: "Mike will personally review your home search criteria and reach out soon!",
      });
    } catch (error) {
      console.error("Error submitting:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleArrayValue = (field: "homeType" | "preferredAreas" | "mustHaves", value: string) => {
    const current = form.getValues(field);
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    form.setValue(field, updated, { shouldValidate: true });
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
        <Helmet>
          <title>Thank You | {siteConfig.name}</title>
        </Helmet>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            {/* Success Card */}
            <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-2xl mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-24 h-24 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-12 h-12 text-primary-foreground" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-4">You're All Set!</h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Mike has received your home search preferences and will personally 
                curate properties that match your criteria.
              </p>

              {/* What Happens Next */}
              <div className="bg-primary/5 rounded-2xl p-6 mb-8 text-left">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  What Happens Next
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Check Your Email</p>
                      <p className="text-sm text-muted-foreground">
                        You'll receive personalized property recommendations based on your preferences
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Personal Call Within 24 Hours</p>
                      <p className="text-sm text-muted-foreground">
                        Mike will call to discuss your search and answer any questions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Home className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Private Showings</p>
                      <p className="text-sm text-muted-foreground">
                        We'll schedule tours of homes that match your criteria
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => navigate("/listings")}
                >
                  Browse Available Listings
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate("/")}
                >
                  Return Home
                </Button>
              </div>
            </div>

            {/* Testimonials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <TestimonialCarousel />
            </motion.div>

            {/* Quick Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-6 bg-card rounded-2xl border border-border"
            >
              <p className="text-muted-foreground mb-3">Can't wait? Call Mike directly:</p>
              <a
                href={`tel:${siteConfig.phoneRaw}`}
                className="inline-flex items-center gap-2 text-xl font-bold text-primary hover:text-primary/80 transition-colors"
              >
                <Phone className="w-5 h-5" />
                {siteConfig.phone}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Helmet>
        <title>Find Your Dream Home | {siteConfig.name}</title>
        <meta name="description" content="Tell us exactly what you're looking for in your next Houston home. Mike Ogunkeye will personally match you with perfect properties." />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate("/")} className="flex items-center gap-2">
              <img
                src="/logo-primary.jpeg"
                alt={siteConfig.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="font-semibold text-sm hidden sm:block">
                {siteConfig.shortName}
              </span>
            </button>
            <div className="flex items-center gap-4">
              <a
                href={`tel:${siteConfig.phoneRaw}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {siteConfig.phone}
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators - Mobile */}
        <div className="flex gap-1 mb-8 md:hidden overflow-x-auto pb-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                currentStep === step.id
                  ? "bg-primary text-primary-foreground"
                  : currentStep > step.id
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {currentStep > step.id ? <CheckCircle2 className="w-4 h-4" /> : step.id}
            </div>
          ))}
        </div>

        {/* Step Indicators - Desktop */}
        <div className="hidden md:grid grid-cols-8 gap-2 mb-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={cn(
                  "text-center p-3 rounded-xl transition-all",
                  currentStep === step.id
                    ? "bg-primary/10 border-2 border-primary"
                    : currentStep > step.id
                    ? "bg-primary/5"
                    : "bg-muted/50"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 mx-auto mb-1",
                    currentStep === step.id
                      ? "text-primary"
                      : currentStep > step.id
                      ? "text-primary/60"
                      : "text-muted-foreground"
                  )}
                />
                <p className="text-xs font-medium truncate">{step.title}</p>
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1 - Contact Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Let's Start Your Home Search</h2>
                    <p className="text-muted-foreground">
                      Mike will personally guide you through finding your perfect Houston home
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <Input
                        placeholder="John Smith"
                        {...form.register("name")}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <Input
                        type="email"
                        placeholder="john@email.com"
                        {...form.register("email")}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <Input
                        type="tel"
                        placeholder="(555) 123-4567"
                        {...form.register("phone")}
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 - Home Type */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">What Type of Home?</h2>
                    <p className="text-muted-foreground">Select all that interest you</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {homeTypes.map((type) => {
                      const isSelected = form.watch("homeType").includes(type.value);
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => toggleArrayValue("homeType", type.value)}
                          className={cn(
                            "p-6 rounded-2xl border-2 transition-all text-left",
                            isSelected
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <Icon className={cn("w-8 h-8 mb-3", isSelected ? "text-primary" : "text-muted-foreground")} />
                          <p className="font-medium">{type.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3 - Budget */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">What's Your Budget?</h2>
                    <p className="text-muted-foreground">Select your comfortable price range</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-3">Minimum Budget</label>
                      <div className="grid grid-cols-3 gap-2">
                        {budgetRanges.slice(0, 6).map((budget) => (
                          <button
                            key={`min-${budget}`}
                            type="button"
                            onClick={() => form.setValue("budgetMin", budget, { shouldValidate: true })}
                            className={cn(
                              "p-3 rounded-xl border-2 text-sm font-medium transition-all",
                              form.watch("budgetMin") === budget
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            {budget}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-3">Maximum Budget</label>
                      <div className="grid grid-cols-3 gap-2">
                        {budgetRanges.slice(5).map((budget) => (
                          <button
                            key={`max-${budget}`}
                            type="button"
                            onClick={() => form.setValue("budgetMax", budget, { shouldValidate: true })}
                            className={cn(
                              "p-3 rounded-xl border-2 text-sm font-medium transition-all",
                              form.watch("budgetMax") === budget
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            {budget}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4 - Areas */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Preferred Locations</h2>
                    <p className="text-muted-foreground">Select all areas you're interested in</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {areas.map((area) => {
                      const isSelected = form.watch("preferredAreas").includes(area);
                      return (
                        <button
                          key={area}
                          type="button"
                          onClick={() => toggleArrayValue("preferredAreas", area)}
                          className={cn(
                            "p-4 rounded-xl border-2 transition-all",
                            isSelected
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <MapPin className={cn("w-5 h-5 mx-auto mb-2", isSelected ? "text-primary" : "text-muted-foreground")} />
                          <p className="text-sm font-medium">{area}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 5 - Size */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Space Requirements</h2>
                    <p className="text-muted-foreground">How much room do you need?</p>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-3">Bedrooms *</label>
                      <div className="flex gap-2">
                        {bedroomOptions.map((num) => (
                          <button
                            key={`bed-${num}`}
                            type="button"
                            onClick={() => form.setValue("bedrooms", num, { shouldValidate: true })}
                            className={cn(
                              "flex-1 p-4 rounded-xl border-2 font-medium transition-all",
                              form.watch("bedrooms") === num
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-3">Bathrooms *</label>
                      <div className="flex flex-wrap gap-2">
                        {bathroomOptions.map((num) => (
                          <button
                            key={`bath-${num}`}
                            type="button"
                            onClick={() => form.setValue("bathrooms", num, { shouldValidate: true })}
                            className={cn(
                              "flex-1 min-w-[60px] p-4 rounded-xl border-2 font-medium transition-all",
                              form.watch("bathrooms") === num
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Minimum Square Feet (optional)</label>
                      <Input
                        placeholder="e.g., 2000"
                        {...form.register("minSqft")}
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6 - Family & Schools */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Family & Education</h2>
                    <p className="text-muted-foreground">Help us find the right school district</p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-border">
                      <Checkbox
                        id="hasChildren"
                        checked={form.watch("hasChildren")}
                        onCheckedChange={(checked) => 
                          form.setValue("hasChildren", checked as boolean)
                        }
                      />
                      <label htmlFor="hasChildren" className="flex items-center gap-3 cursor-pointer">
                        <Users className="w-5 h-5 text-primary" />
                        <span className="font-medium">I have children or plan to</span>
                      </label>
                    </div>

                    {form.watch("hasChildren") && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Ages of Children (optional)
                          </label>
                          <Input
                            placeholder="e.g., 5, 8, 12"
                            {...form.register("childrenAges")}
                            className="h-12"
                          />
                        </div>
                      </motion.div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-3">School Priority</label>
                      <div className="grid gap-2">
                        {schoolPriorities.map((priority) => (
                          <button
                            key={priority}
                            type="button"
                            onClick={() => form.setValue("schoolPriority", priority)}
                            className={cn(
                              "p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3",
                              form.watch("schoolPriority") === priority
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <GraduationCap className={cn(
                              "w-5 h-5",
                              form.watch("schoolPriority") === priority ? "text-primary" : "text-muted-foreground"
                            )} />
                            <span className="font-medium">{priority}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7 - Must-Haves */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Must-Have Features</h2>
                    <p className="text-muted-foreground">Select your essential home features</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {mustHaveFeatures.map((feature) => {
                      const isSelected = form.watch("mustHaves").includes(feature.value);
                      return (
                        <button
                          key={feature.value}
                          type="button"
                          onClick={() => toggleArrayValue("mustHaves", feature.value)}
                          className={cn(
                            "p-4 rounded-xl border-2 transition-all text-left",
                            isSelected
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <span className="text-2xl mb-2 block">{feature.icon}</span>
                          <p className="text-sm font-medium">{feature.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 8 - Timeline & Notes */}
              {currentStep === 8 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Almost Done!</h2>
                    <p className="text-muted-foreground">When are you looking to move?</p>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-3">Timeline *</label>
                      <div className="grid gap-2">
                        {timelineOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => form.setValue("timeline", option, { shouldValidate: true })}
                            className={cn(
                              "p-4 rounded-xl border-2 text-left transition-all",
                              form.watch("timeline") === option
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <span className="font-medium">{option}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Anything else we should know? (optional)
                      </label>
                      <Textarea
                        placeholder="Special requirements, specific neighborhoods, or any other details..."
                        {...form.register("additionalNotes")}
                        className="min-h-[120px]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {currentStep === steps.length ? (
              <Button
                size="lg"
                onClick={form.handleSubmit(onSubmit)}
                disabled={!canProceed() || isSubmitting}
                className="gap-2 bg-primary hover:bg-primary/90 px-8"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    Find My Home
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={nextStep}
                disabled={!canProceed()}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Your information is 100% confidential and never shared
          </p>
          <div className="flex items-center justify-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-xs">No Spam</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-xs">Free Service</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-xs">Personal Attention</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
