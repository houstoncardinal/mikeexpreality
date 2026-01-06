import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronRight, ChevronLeft, Sparkles, Home, Search, Phone, MapPin,
  Heart, Star, TrendingUp, Award, Users, Calendar, DollarSign,
  Camera, Video, Calculator, MessageSquare, Target, Zap, Crown,
  Building, Compass, Shield, Clock, Gift, Lightbulb, UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate, useLocation } from "react-router-dom";
import { trackCTAClick, trackFormSubmission } from "@/lib/analytics";
import { trackUserAction } from "@/lib/adaptiveLearning";

interface TourStep {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  icon: React.ElementType;
  action?: () => void;
  highlight?: string;
  category: 'welcome' | 'discovery' | 'search' | 'luxury' | 'personalization' | 'action';
  priority: number; // 1-10, higher = more important
  userInterest?: string[]; // What user behaviors indicate interest
  estimatedTime: number; // seconds
  interactive?: boolean;
  smartSuggestions?: string[];
}

interface UserProfile {
  interests: string[];
  preferredPriceRange: [number, number] | null;
  preferredAreas: string[];
  propertyTypes: string[];
  timeline: 'immediate' | '3months' | '6months' | '1year' | 'browsing';
  experience: 'first-time' | 'experienced' | 'investor';
  interactions: {
    pagesViewed: string[];
    timeSpent: Record<string, number>;
    actions: string[];
    lastVisit: Date;
  };
  tourProgress: {
    completedSteps: string[];
    skippedSteps: string[];
    timeSpentPerStep: Record<string, number>;
    preferences: Record<string, any>;
  };
}

export function GuidedTour() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [tourSteps, setTourSteps] = useState<TourStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize user profile from localStorage
  const initializeUserProfile = useCallback(() => {
    const stored = localStorage.getItem("user-profile");
    if (stored) {
      try {
        const profile = JSON.parse(stored);
        profile.interactions.lastVisit = new Date(profile.interactions.lastVisit);
        setUserProfile(profile);
      } catch (error) {
        console.error("Error parsing user profile:", error);
        createNewProfile();
      }
    } else {
      createNewProfile();
    }
  }, []);

  const createNewProfile = () => {
    const newProfile: UserProfile = {
      interests: [],
      preferredPriceRange: null,
      preferredAreas: [],
      propertyTypes: [],
      timeline: 'browsing',
      experience: 'first-time',
      interactions: {
        pagesViewed: [location.pathname],
        timeSpent: {},
        actions: [],
        lastVisit: new Date(),
      },
      tourProgress: {
        completedSteps: [],
        skippedSteps: [],
        timeSpentPerStep: {},
        preferences: {},
      },
    };
    setUserProfile(newProfile);
    localStorage.setItem("user-profile", JSON.stringify(newProfile));
  };

  // Adaptive tour steps based on user profile
  const generateAdaptiveSteps = useCallback((profile: UserProfile): TourStep[] => {
    const baseSteps: TourStep[] = [
      {
        id: "welcome",
        title: "Welcome to Your Luxury Journey",
        description: "Discover exceptional properties curated just for you in Houston's most prestigious neighborhoods.",
        detailedDescription: "As your personal luxury real estate concierge, I'm here to guide you through an extraordinary property experience. Whether you're searching for your dream home or making a strategic investment, we'll tailor every recommendation to your unique preferences.",
        icon: Crown,
        category: 'welcome',
        priority: 10,
        estimatedTime: 15,
        interactive: false,
        smartSuggestions: ["Personalized recommendations", "VIP concierge service", "Expert market insights"],
      },
      {
        id: "discovery",
        title: "Explore Exclusive Properties",
        description: "Browse our hand-curated collection of luxury homes, from contemporary masterpieces to timeless estates.",
        detailedDescription: "Each property in our portfolio has been personally selected for its exceptional quality, unique character, and investment potential. Our collection features everything from modern urban lofts to sprawling countryside retreats.",
        icon: Building,
        action: () => {
          navigate("/listings");
          trackCTAClick("tour_discovery", "guided_tour", "/listings");
        },
        category: 'discovery',
        priority: 9,
        userInterest: ['properties', 'luxury', 'investment'],
        estimatedTime: 20,
        interactive: true,
        smartSuggestions: ["Featured luxury homes", "New listings", "Price range matches"],
      },
      {
        id: "smart-search",
        title: "AI-Powered Property Search",
        description: "Tell us your preferences and let our intelligent system find your perfect match.",
        detailedDescription: "Our advanced search algorithm learns from your preferences to deliver increasingly accurate recommendations. Simply describe your ideal property, and we'll handle the rest with precision and sophistication.",
        icon: Target,
        action: () => navigate("/listings"),
        category: 'search',
        priority: 8,
        userInterest: ['search', 'efficiency', 'technology'],
        estimatedTime: 25,
        interactive: true,
        smartSuggestions: ["Smart filtering", "Saved searches", "Price alerts"],
      },
      {
        id: "neighborhoods",
        title: "Premier Houston Neighborhoods",
        description: "Discover the city's most coveted communities, from River Oaks elegance to The Woodlands serenity.",
        detailedDescription: "Houston offers unparalleled diversity in its neighborhoods. Whether you seek the vibrant energy of downtown living, the tranquility of suburban enclaves, or the prestige of established communities, we know every corner of this magnificent city.",
        icon: Compass,
        action: () => {
          navigate("/neighborhoods");
          trackCTAClick("tour_neighborhoods", "guided_tour", "/neighborhoods");
        },
        category: 'discovery',
        priority: 7,
        userInterest: ['location', 'community', 'lifestyle'],
        estimatedTime: 18,
        interactive: true,
        smartSuggestions: ["School districts", "Amenity highlights", "Market trends"],
      },
      {
        id: "luxury-services",
        title: "VIP Concierge Services",
        description: "Experience white-glove service with our luxury concierge team, available 24/7 for your needs.",
        detailedDescription: "From private showings and market analysis to financing guidance and move coordination, our dedicated concierge team ensures every aspect of your real estate journey is handled with the utmost care and discretion.",
        icon: Shield,
        category: 'luxury',
        priority: 9,
        userInterest: ['service', 'luxury', 'personalized'],
        estimatedTime: 22,
        interactive: false,
        smartSuggestions: ["Private showings", "Market analysis", "Financing guidance"],
      },
      {
        id: "virtual-tours",
        title: "Immersive Virtual Experiences",
        description: "Experience properties remotely with our cutting-edge virtual tours and 3D walkthroughs.",
        detailedDescription: "Never miss a property again. Our professional virtual tours capture every detail, from architectural nuances to natural light patterns, giving you a true sense of each home before your visit.",
        icon: Video,
        category: 'luxury',
        priority: 6,
        userInterest: ['technology', 'convenience', 'remote'],
        estimatedTime: 16,
        interactive: false,
        smartSuggestions: ["3D walkthroughs", "Virtual staging", "Drone footage"],
      },
      {
        id: "market-insights",
        title: "Exclusive Market Intelligence",
        description: "Access proprietary market data and insights to make informed investment decisions.",
        detailedDescription: "Stay ahead with our comprehensive market analysis, featuring real-time pricing trends, neighborhood appreciation data, and expert predictions for Houston's luxury real estate market.",
        icon: TrendingUp,
        category: 'personalization',
        priority: 7,
        userInterest: ['investment', 'data', 'strategy'],
        estimatedTime: 20,
        interactive: false,
        smartSuggestions: ["Market reports", "Investment analysis", "Price trends"],
      },
      {
        id: "personalized-recommendations",
        title: "Your Curated Experience",
        description: "Based on your interests, we've personalized this tour to highlight what matters most to you.",
        detailedDescription: `I've noticed your interest in ${profile.interests.slice(0, 3).join(', ')}. Let me show you properties and services tailored specifically to your preferences.`,
        icon: UserCheck,
        category: 'personalization',
        priority: 8,
        estimatedTime: 12,
        interactive: false,
        smartSuggestions: profile.interests.map(interest => `More ${interest} options`),
      },
      {
        id: "connect",
        title: "Let's Begin Your Journey",
        description: "Ready to experience luxury real estate like never before? Our team awaits your call.",
        detailedDescription: "Whether you're ready to start searching immediately or prefer to learn more about our services, we're here to provide the personalized attention you deserve. Your luxury real estate journey starts now.",
        icon: MessageSquare,
        action: () => {
          // Open floating action widget
          const event = new CustomEvent('openConcierge');
          window.dispatchEvent(event);
        },
        category: 'action',
        priority: 10,
        estimatedTime: 15,
        interactive: true,
        smartSuggestions: ["Schedule consultation", "Request property alerts", "VIP concierge access"],
      },
    ];

    // Adaptive ordering based on user profile
    let orderedSteps = [...baseSteps];

    // Prioritize based on user interests
    if (profile.interests.includes('luxury') || profile.interests.includes('investment')) {
      orderedSteps = orderedSteps.sort((a, b) => {
        if (a.category === 'luxury' && b.category !== 'luxury') return -1;
        if (b.category === 'luxury' && a.category !== 'luxury') return 1;
        return b.priority - a.priority;
      });
    }

    // Skip completed steps
    orderedSteps = orderedSteps.filter(step => !profile.tourProgress.completedSteps.includes(step.id));

    // Always include welcome and connect
    const welcomeStep = baseSteps.find(s => s.id === 'welcome')!;
    const connectStep = baseSteps.find(s => s.id === 'connect')!;

    if (!orderedSteps.find(s => s.id === 'welcome')) {
      orderedSteps.unshift(welcomeStep);
    }
    if (!orderedSteps.find(s => s.id === 'connect')) {
      orderedSteps.push(connectStep);
    }

    // Limit to 6 steps for optimal UX
    return orderedSteps.slice(0, 6);
  }, []);

  // Track user interactions and learn preferences
  const trackInteraction = useCallback((action: string, data?: any) => {
    if (!userProfile) return;

    const updatedProfile = { ...userProfile };
    updatedProfile.interactions.actions.push(action);
    updatedProfile.interactions.lastVisit = new Date();

    // Learn from interactions
    if (action === 'viewed_properties') {
      updatedProfile.interests.push('properties');
    } else if (action === 'used_search') {
      updatedProfile.interests.push('search');
    } else if (action === 'viewed_neighborhoods') {
      updatedProfile.interests.push('location');
    } else if (action === 'contacted_concierge') {
      updatedProfile.interests.push('luxury');
      updatedProfile.interests.push('personalized');
    }

    // Remove duplicates
    updatedProfile.interests = [...new Set(updatedProfile.interests)];

    setUserProfile(updatedProfile);
    localStorage.setItem("user-profile", JSON.stringify(updatedProfile));
  }, [userProfile]);

  useEffect(() => {
    initializeUserProfile();
  }, [initializeUserProfile]);

  useEffect(() => {
    if (userProfile) {
      const steps = generateAdaptiveSteps(userProfile);
      setTourSteps(steps);
      setIsLoading(false);
    }
  }, [userProfile, generateAdaptiveSteps]);

  useEffect(() => {
    const seen = localStorage.getItem("tour-completed");
    const returnVisitor = userProfile?.interactions.pagesViewed.length > 1;

    if (!seen && location.pathname === "/") {
      // Personalized timing based on user profile
      const delay = returnVisitor ? 1000 : 3000; // Faster for return visitors
      const timer = setTimeout(() => {
        setIsVisible(true);
        trackInteraction('tour_started');
        trackUserAction('tour_started', location.pathname, { returnVisitor });
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, userProfile, trackInteraction]);

  // Track time spent on each step
  useEffect(() => {
    if (!isVisible || !tourSteps[currentStep]) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      if (userProfile && tourSteps[currentStep]) {
        const stepId = tourSteps[currentStep].id;
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        userProfile.tourProgress.timeSpentPerStep[stepId] = timeSpent;
        localStorage.setItem("user-profile", JSON.stringify(userProfile));
      }
    };
  }, [currentStep, isVisible, tourSteps, userProfile]);

  // Update progress
  useEffect(() => {
    if (tourSteps.length > 0) {
      setProgress(((currentStep + 1) / tourSteps.length) * 100);
    }
  }, [currentStep, tourSteps.length]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("tour-completed", "true");

    if (userProfile) {
      const updatedProfile = { ...userProfile };
      updatedProfile.tourProgress.completedSteps = [
        ...updatedProfile.tourProgress.completedSteps,
        ...tourSteps.slice(0, currentStep + 1).map(s => s.id)
      ];
      setUserProfile(updatedProfile);
      localStorage.setItem("user-profile", JSON.stringify(updatedProfile));
    }

    trackInteraction('tour_completed', { steps_completed: currentStep + 1 });
    trackUserAction('tour_completed', location.pathname, {
      steps_completed: currentStep + 1,
      total_steps: tourSteps.length,
      time_spent: timeSpent
    });
  };

  const handleSkip = () => {
    if (userProfile) {
      const updatedProfile = { ...userProfile };
      updatedProfile.tourProgress.skippedSteps.push(tourSteps[currentStep].id);
      setUserProfile(updatedProfile);
      localStorage.setItem("user-profile", JSON.stringify(updatedProfile));
    }
    handleClose();
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      trackInteraction('tour_step_next', { step: tourSteps[currentStep].id });
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      trackInteraction('tour_step_previous', { step: tourSteps[currentStep].id });
    }
  };

  const handleStepAction = () => {
    const step = tourSteps[currentStep];
    if (step.action) {
      step.action();
      trackInteraction('tour_step_action', { step: step.id });
    }
    handleNext();
  };

  const handleSmartSuggestion = (suggestion: string) => {
    trackInteraction('smart_suggestion_clicked', { suggestion, step: tourSteps[currentStep].id });
    // Handle different suggestion types
    if (suggestion.includes('consultation')) {
      const event = new CustomEvent('openConcierge');
      window.dispatchEvent(event);
    } else if (suggestion.includes('property')) {
      navigate('/listings');
    } else if (suggestion.includes('neighborhood')) {
      navigate('/neighborhoods');
    }
  };

  if (!isVisible || isLoading || tourSteps.length === 0) return null;

  const step = tourSteps[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === tourSteps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        {/* Overlay with spotlight effect */}
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
        
        {/* Tour Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl overflow-hidden border border-border"
        >
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-accent/70"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors z-10"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Header with icon */}
          <div className="pt-12 pb-6 px-8 text-center">
            <motion.div
              key={currentStep}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent to-accent/70 text-accent-foreground mb-6 shadow-lg"
            >
              <Icon className="h-10 w-10" />
            </motion.div>

            <motion.h2
              key={`title-${currentStep}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-2xl font-bold text-foreground mb-3"
            >
              {step.title}
            </motion.h2>

            <motion.p
              key={`desc-${currentStep}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground leading-relaxed mb-4"
            >
              {step.description}
            </motion.p>

            {/* Detailed description for luxury experience */}
            {step.detailedDescription && (
              <motion.div
                key={`detailed-${currentStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-secondary/30 rounded-lg p-4 mb-4 border border-border/50"
              >
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.detailedDescription}
                </p>
              </motion.div>
            )}

            {/* Smart suggestions */}
            {step.smartSuggestions && step.smartSuggestions.length > 0 && (
              <motion.div
                key={`suggestions-${currentStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-4"
              >
                <p className="text-xs font-medium text-accent mb-2 flex items-center gap-1">
                  <Lightbulb className="h-3 w-3" />
                  Smart Suggestions
                </p>
                <div className="flex flex-wrap gap-2">
                  {step.smartSuggestions.slice(0, 3).map((suggestion, index) => (
                    <motion.button
                      key={suggestion}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      onClick={() => handleSmartSuggestion(suggestion)}
                      className="text-xs bg-accent/10 hover:bg-accent/20 text-accent px-3 py-1 rounded-full border border-accent/20 transition-all hover:scale-105"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step metadata */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {step.estimatedTime}s
              </div>
              {step.interactive && (
                <Badge variant="secondary" className="text-xs">
                  Interactive
                </Badge>
              )}
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Step {currentStep + 1} of {tourSteps.length}
              </div>
            </div>
          </div>

          {/* Enhanced step indicators with progress */}
          <div className="px-8 pb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 mb-4" />
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 pb-6">
            {tourSteps.map((_, index) => (
              <motion.button
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setCurrentStep(index)}
                className={`relative w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentStep
                    ? "bg-accent w-8 shadow-lg"
                    : index < currentStep
                    ? "bg-accent/50 hover:bg-accent/70"
                    : "bg-secondary hover:bg-secondary/70"
                }`}
              >
                {index === currentStep && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-accent"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between p-6 border-t border-border bg-secondary/30">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={handleClose}>
                Skip Tour
              </Button>

              {step.action ? (
                <Button size="sm" onClick={handleStepAction} className="gap-1">
                  Explore
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button size="sm" onClick={handleNext} className="gap-1">
                  {currentStep === tourSteps.length - 1 ? "Get Started" : "Next"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function RestartTourButton() {
  const handleRestart = () => {
    localStorage.removeItem("tour-completed");
    window.location.reload();
  };

  return (
    <button
      onClick={handleRestart}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
    >
      <Sparkles className="h-4 w-4" />
      Restart Tour
    </button>
  );
}
