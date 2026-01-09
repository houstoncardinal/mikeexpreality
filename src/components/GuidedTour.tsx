import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronRight, ChevronLeft, Sparkles, Home, Search, Phone, MapPin,
  Heart, Star, TrendingUp, Award, Users, Calendar, DollarSign,
  Camera, Video, Calculator, MessageSquare, Target, Zap, Crown,
  Building, Compass, Shield, Clock, Gift, Lightbulb, UserCheck,
  CheckCircle, AlertCircle, Info, HelpCircle, ThumbsUp, ThumbsDown,
  Settings, User, Briefcase, GraduationCap, TrendingDown, BarChart3,
  PieChart, Activity, Globe, Navigation, Filter, Sliders, Bookmark,
  Share, Download, Upload, RefreshCw, Play, Pause, SkipForward,
  Volume2, VolumeX, Eye, EyeOff, Maximize, Minimize, RotateCcw,
  RotateCw, ZoomIn, ZoomOut, Move, Copy, Scissors, Palette, Layers,
  Grid, List, Columns, Rows, Layout, Box, Circle, Square, Triangle,
  Hexagon, Star as StarIcon, Heart as HeartIcon, Diamond, Club, Spade
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { trackCTAClick, trackFormSubmission } from "@/lib/analytics";
import { trackUserAction } from "@/lib/adaptiveLearning";
import { mikeImages, propertyImages } from "@/lib/images";
import { siteConfig } from "@/lib/siteConfig";

interface TourStep {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  icon: React.ElementType;
  action?: () => void;
  highlight?: string;
  category: 'welcome' | 'discovery' | 'search' | 'luxury' | 'personalization' | 'questionnaire' | 'action';
  priority: number; // 1-10, higher = more important
  userInterest?: string[]; // What user behaviors indicate interest
  estimatedTime: number; // seconds
  interactive?: boolean;
  smartSuggestions?: string[];
  questionnaire?: {
    type: 'single' | 'multiple' | 'scale' | 'input' | 'budget';
    question: string;
    options?: string[];
    placeholder?: string;
    required?: boolean;
    field: keyof UserProfile['tourProgress']['preferences'];
  };
  conditionalLogic?: {
    basedOn: keyof UserProfile['tourProgress']['preferences'];
    value: any;
    nextStepId?: string;
    skipToStepId?: string;
  };
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

  // Enhanced adaptive tour steps with questionnaires and interactive elements
  const generateAdaptiveSteps = useCallback((profile: UserProfile): TourStep[] => {
    const baseSteps: TourStep[] = [
      // Welcome & Personalization
      {
        id: "welcome",
        title: "Welcome to Your Personal Luxury Concierge",
        description: "I'm delighted to be your guide through Houston's most exclusive real estate opportunities.",
        detailedDescription: "As your personal luxury real estate concierge, I've been trained to understand your unique preferences and guide you toward properties that perfectly match your lifestyle, budget, and aspirations. Let's begin this personalized journey together.",
        icon: Crown,
        category: 'welcome',
        priority: 10,
        estimatedTime: 20,
        interactive: true,
        questionnaire: {
          type: 'single',
          question: 'What brings you to our luxury real estate experience today?',
          options: ['Finding my dream home', 'Making an investment', 'Exploring options', 'Just browsing'],
          required: true,
          field: 'primaryGoal'
        },
        smartSuggestions: ["Personalized recommendations", "VIP concierge service", "Expert market insights"],
      },

      // Experience Level Assessment
      {
        id: "experience-assessment",
        title: "Tell Me About Your Real Estate Journey",
        description: "Understanding your experience level helps me provide the perfect level of guidance.",
        detailedDescription: "Every client has a unique background in real estate. Whether you're a first-time buyer, seasoned investor, or somewhere in between, I'll tailor my recommendations and explanations to match your expertise level perfectly.",
        icon: GraduationCap,
        category: 'questionnaire',
        priority: 9,
        estimatedTime: 15,
        interactive: true,
        questionnaire: {
          type: 'single',
          question: 'What is your real estate experience level?',
          options: ['First-time buyer', 'Have bought before', 'Experienced investor', 'Real estate professional'],
          required: true,
          field: 'experienceLevel'
        },
        conditionalLogic: {
          basedOn: 'primaryGoal',
          value: 'Making an investment',
          nextStepId: 'investment-focus'
        }
      },

      // Timeline Assessment
      {
        id: "timeline-assessment",
        title: "When Are You Looking to Make Your Move?",
        description: "Your timeline helps me prioritize the most relevant opportunities for you.",
        detailedDescription: "Real estate decisions are often time-sensitive. Whether you're ready to move immediately or planning for the future, I'll focus on properties and strategies that align perfectly with your schedule and goals.",
        icon: Calendar,
        category: 'questionnaire',
        priority: 8,
        estimatedTime: 12,
        interactive: true,
        questionnaire: {
          type: 'single',
          question: 'When are you planning to purchase?',
          options: ['Immediately (within 3 months)', 'Soon (3-6 months)', 'Planning ahead (6-12 months)', 'Just researching'],
          required: true,
          field: 'timeline'
        }
      },

      // Budget Discovery
      {
        id: "budget-discovery",
        title: "Let's Discuss Your Investment Range",
        description: "Understanding your budget helps me curate the perfect selection of properties.",
        detailedDescription: "Every price range offers exceptional opportunities in Houston's luxury market. From elegant starter estates to palatial mansions, I'll show you properties that not only fit your budget but exceed your expectations.",
        icon: DollarSign,
        category: 'questionnaire',
        priority: 7,
        estimatedTime: 18,
        interactive: true,
        questionnaire: {
          type: 'budget',
          question: 'What is your approximate budget range for this purchase?',
          options: ['Under $500K', '$500K - $1M', '$1M - $2M', '$2M - $5M', '$5M+', 'Flexible'],
          required: true,
          field: 'budgetRange'
        }
      },

      // Property Type Preferences
      {
        id: "property-preferences",
        title: "What Type of Property Speaks to You?",
        description: "Different properties offer different lifestyles. Let's find your perfect match.",
        detailedDescription: "From modern urban lofts with city views to sprawling countryside estates with private lakes, Houston offers every conceivable luxury lifestyle. Your preferences will guide me to the properties that will become your personal sanctuary.",
        icon: Home,
        category: 'questionnaire',
        priority: 6,
        estimatedTime: 20,
        interactive: true,
        questionnaire: {
          type: 'multiple',
          question: 'Which property types interest you most? (Select all that apply)',
          options: ['Modern Contemporary', 'Traditional Estate', 'Urban Loft/Penthouse', 'Waterfront Property', 'Golf Course Community', 'Historic Home', 'Custom Build Opportunity'],
          required: true,
          field: 'propertyTypes'
        }
      },

      // Location Preferences
      {
        id: "location-preferences",
        title: "Where Would You Like to Call Home?",
        description: "Location is everything in real estate. Let's find your ideal neighborhood.",
        detailedDescription: "Houston's neighborhoods each offer their own unique character, amenities, and lifestyle. From the sophisticated elegance of River Oaks to the serene tranquility of The Woodlands, I'll help you discover the community that feels like home.",
        icon: MapPin,
        category: 'questionnaire',
        priority: 5,
        estimatedTime: 22,
        interactive: true,
        questionnaire: {
          type: 'multiple',
          question: 'Which Houston areas interest you most?',
          options: ['River Oaks', 'West University', 'The Heights', 'Montrose', 'Midtown', 'Downtown', 'Memorial', 'Sugar Land', 'Katy', 'Cypress', 'The Woodlands'],
          required: true,
          field: 'preferredAreas'
        }
      },

      // Investment Focus (Conditional)
      {
        id: "investment-focus",
        title: "Investment Strategy & Goals",
        description: "Let's align your investment objectives with the perfect opportunities.",
        detailedDescription: "Smart investors have clear objectives. Whether you're seeking appreciation potential, rental income, or a combination of both, I'll connect you with properties that align with your investment strategy and risk tolerance.",
        icon: TrendingUp,
        category: 'questionnaire',
        priority: 9,
        estimatedTime: 25,
        interactive: true,
        questionnaire: {
          type: 'multiple',
          question: 'What are your primary investment goals?',
          options: ['Long-term appreciation', 'Rental income', 'Development potential', 'Tax advantages', 'Diversification', 'Legacy planning'],
          required: true,
          field: 'investmentGoals'
        }
      },

      // Luxury Services Introduction
      {
        id: "luxury-services-intro",
        title: "Your VIP Concierge Experience",
        description: "Discover the white-glove services that make your journey extraordinary.",
        detailedDescription: "Beyond exceptional properties, we provide comprehensive concierge services to ensure every aspect of your real estate journey is handled with the utmost care. From private showings to financing guidance, we're with you every step of the way.",
        icon: Shield,
        category: 'luxury',
        priority: 8,
        estimatedTime: 20,
        interactive: false,
        smartSuggestions: ["Private showings", "Market analysis", "Financing guidance", "Move coordination"],
      },

      // Technology Showcase
      {
        id: "technology-showcase",
        title: "Cutting-Edge Property Technology",
        description: "Experience properties like never before with our immersive technology.",
        detailedDescription: "Our professional virtual tours, 3D walkthroughs, and interactive floor plans allow you to experience every property remotely. Never miss an opportunity again with our comprehensive digital property experience.",
        icon: Video,
        category: 'luxury',
        priority: 6,
        estimatedTime: 18,
        interactive: false,
        smartSuggestions: ["3D walkthroughs", "Virtual staging", "Drone footage", "Interactive floor plans"],
      },

      // Market Intelligence
      {
        id: "market-intelligence",
        title: "Proprietary Market Insights",
        description: "Access exclusive data and trends that informed buyers use to make decisions.",
        detailedDescription: "Stay ahead of the market with our proprietary analytics, neighborhood appreciation data, and expert predictions. Make confident decisions backed by comprehensive market intelligence that others don't have access to.",
        icon: BarChart3,
        category: 'personalization',
        priority: 7,
        estimatedTime: 22,
        interactive: false,
        smartSuggestions: ["Market reports", "Investment analysis", "Price trends", "Neighborhood data"],
      },

      // Personalized Recommendations
      {
        id: "personalized-recommendations",
        title: "Your Curated Luxury Experience",
        description: "Based on everything you've shared, here's what I've prepared especially for you.",
        detailedDescription: `Thank you for sharing your preferences with me. Based on your ${profile.tourProgress.preferences?.experienceLevel || 'unique'} background, ${profile.tourProgress.preferences?.timeline || 'timeline'}, and ${profile.tourProgress.preferences?.budgetRange || 'budget considerations'}, I've curated a personalized experience that showcases the perfect properties and services for you.`,
        icon: UserCheck,
        category: 'personalization',
        priority: 9,
        estimatedTime: 15,
        interactive: false,
        smartSuggestions: ["View curated properties", "Schedule private showing", "Connect with concierge"],
      },

      // Final Connection
      {
        id: "final-connection",
        title: "Ready to Begin Your Luxury Journey?",
        description: "Your personal concierge is standing by to make this extraordinary experience happen.",
        detailedDescription: "You've taken the first step toward finding your perfect property. Now let me connect you with our luxury concierge team who will handle every detail with the white-glove service you deserve. Your dream property awaits.",
        icon: MessageSquare,
        category: 'action',
        priority: 10,
        estimatedTime: 20,
        interactive: true,
        action: () => {
          const event = new CustomEvent('openConcierge');
          window.dispatchEvent(event);
        },
        smartSuggestions: ["Schedule consultation", "Request property alerts", "VIP concierge access", "View saved properties"],
      },
    ];

    // Advanced adaptive ordering based on user responses
    let orderedSteps = [...baseSteps];

    // Dynamic ordering based on questionnaire responses
    const preferences = profile.tourProgress.preferences;

    if (preferences?.primaryGoal === 'Making an investment') {
      // Prioritize investment-focused steps
      orderedSteps = orderedSteps.sort((a, b) => {
        if (a.id === 'investment-focus') return -1;
        if (b.id === 'investment-focus') return 1;
        if (a.category === 'personalization' && b.category !== 'personalization') return -1;
        if (b.category === 'personalization' && a.category !== 'personalization') return 1;
        return b.priority - a.priority;
      });
    }

    if (preferences?.timeline === 'Immediately (within 3 months)') {
      // Prioritize action-oriented steps for urgent buyers
      orderedSteps = orderedSteps.sort((a, b) => {
        if (a.category === 'action' && b.category !== 'action') return -1;
        if (b.category === 'action' && a.category !== 'action') return 1;
        return b.priority - a.priority;
      });
    }

    // Skip completed steps
    orderedSteps = orderedSteps.filter(step => !profile.tourProgress.completedSteps.includes(step.id));

    // Apply conditional logic
    orderedSteps = orderedSteps.filter(step => {
      if (!step.conditionalLogic) return true;

      const { basedOn, value, skipToStepId } = step.conditionalLogic;
      const currentValue = preferences?.[basedOn];

      if (skipToStepId && currentValue === value) {
        return false; // Skip this step
      }

      return true;
    });

    // Always include welcome and final connection
    const welcomeStep = baseSteps.find(s => s.id === 'welcome')!;
    const finalStep = baseSteps.find(s => s.id === 'final-connection')!;

    if (!orderedSteps.find(s => s.id === 'welcome')) {
      orderedSteps.unshift(welcomeStep);
    }
    if (!orderedSteps.find(s => s.id === 'final-connection')) {
      orderedSteps.push(finalStep);
    }

    // Limit to 8 steps for comprehensive experience
    return orderedSteps.slice(0, 8);
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

  // Listen for manual tour trigger (via button click, etc.)
  useEffect(() => {
    const handleOpenTour = () => {
      setIsVisible(true);
      trackInteraction('tour_started');
      trackUserAction('tour_started', location.pathname, { manualTrigger: true });
    };

    window.addEventListener('openGuidedTour', handleOpenTour);
    return () => window.removeEventListener('openGuidedTour', handleOpenTour);
  }, [location.pathname, trackInteraction]);

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

  const handleQuestionnaireResponse = (field: keyof UserProfile['tourProgress']['preferences'], value: any) => {
    if (!userProfile) return;

    const updatedProfile = { ...userProfile };
    updatedProfile.tourProgress.preferences[field] = value;

    // Learn from responses and adapt future behavior
    if (field === 'primaryGoal' && value === 'Making an investment') {
      updatedProfile.interests.push('investment', 'strategy', 'returns');
    } else if (field === 'experienceLevel') {
      if (value === 'First-time buyer') {
        updatedProfile.interests.push('guidance', 'education', 'support');
      } else if (value === 'Experienced investor') {
        updatedProfile.interests.push('advanced', 'analysis', 'opportunities');
      }
    } else if (field === 'timeline' && value === 'Immediately (within 3 months)') {
      updatedProfile.interests.push('urgent', 'available', 'quick-close');
    } else if (field === 'budgetRange') {
      if (value.includes('$5M+')) {
        updatedProfile.interests.push('luxury', 'exclusive', 'premium');
      } else if (value.includes('Under $500K')) {
        updatedProfile.interests.push('affordable', 'value', 'starter');
      }
    } else if (field === 'propertyTypes') {
      updatedProfile.interests.push(...value.map((type: string) => type.toLowerCase().replace(/\s+/g, '-')));
    } else if (field === 'preferredAreas') {
      updatedProfile.interests.push(...value.map((area: string) => area.toLowerCase().replace(/\s+/g, '-')));
    }

    // Remove duplicates
    updatedProfile.interests = [...new Set(updatedProfile.interests)];

    setUserProfile(updatedProfile);
    localStorage.setItem("user-profile", JSON.stringify(updatedProfile));

    trackInteraction('questionnaire_response', { field, value });
    trackUserAction('questionnaire_completed', location.pathname, { field, value });

    // Auto-advance to next step after response
    setTimeout(() => handleNext(), 500);
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

          {/* Header with icon or Mike's image for welcome */}
          <div className="pt-12 pb-6 px-8 text-center">
            <motion.div
              key={currentStep}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className={step.id === 'welcome' || step.id === 'final-connection'
                ? "relative inline-block w-24 h-24 mb-6"
                : "inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent to-accent/70 text-accent-foreground mb-6 shadow-lg"}
            >
              {step.id === 'welcome' || step.id === 'final-connection' ? (
                <>
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-accent shadow-2xl">
                    <img
                      src={mikeImages.profile}
                      alt={siteConfig.agent.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = mikeImages.profileAlt1;
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent flex items-center justify-center border-2 border-card">
                    <Icon className="h-4 w-4 text-accent-foreground" />
                  </div>
                </>
              ) : (
                <Icon className="h-10 w-10" />
              )}
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

            {/* Interactive Questionnaire */}
            {step.questionnaire && (
              <motion.div
                key={`questionnaire-${currentStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-accent/5 rounded-lg p-4 mb-4 border border-accent/20"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <HelpCircle className="h-4 w-4 text-accent" />
                    <p className="text-sm font-medium text-accent">
                      {step.questionnaire.question}
                    </p>
                  </div>

                  {step.questionnaire.type === 'single' && step.questionnaire.options && (
                    <RadioGroup
                      onValueChange={(value) => handleQuestionnaireResponse(step.questionnaire!.field, value)}
                      className="space-y-2"
                    >
                      {step.questionnaire.options.map((option, index) => (
                        <motion.div
                          key={option}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem value={option} id={`${step.id}-${option}`} />
                          <Label
                            htmlFor={`${step.id}-${option}`}
                            className="text-sm cursor-pointer hover:text-accent transition-colors"
                          >
                            {option}
                          </Label>
                        </motion.div>
                      ))}
                    </RadioGroup>
                  )}

                  {step.questionnaire.type === 'multiple' && step.questionnaire.options && (
                    <div className="space-y-2">
                      {step.questionnaire.options.map((option, index) => (
                        <motion.div
                          key={option}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`${step.id}-${option}`}
                            onCheckedChange={(checked) => {
                              const currentValues = userProfile?.tourProgress.preferences[step.questionnaire!.field] || [];
                              const newValues = checked
                                ? [...currentValues, option]
                                : currentValues.filter((v: string) => v !== option);
                              handleQuestionnaireResponse(step.questionnaire!.field, newValues);
                            }}
                          />
                          <Label
                            htmlFor={`${step.id}-${option}`}
                            className="text-sm cursor-pointer hover:text-accent transition-colors"
                          >
                            {option}
                          </Label>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {step.questionnaire.type === 'budget' && step.questionnaire.options && (
                    <Select onValueChange={(value) => handleQuestionnaireResponse(step.questionnaire!.field, value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        {step.questionnaire.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {step.questionnaire.type === 'input' && (
                    <Input
                      placeholder={step.questionnaire.placeholder || "Enter your response"}
                      onChange={(e) => handleQuestionnaireResponse(step.questionnaire!.field, e.target.value)}
                      className="w-full"
                    />
                  )}

                  {step.questionnaire.type === 'scale' && step.questionnaire.options && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Not interested</span>
                        <span>Very interested</span>
                      </div>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => handleQuestionnaireResponse(step.questionnaire!.field, rating)}
                            className="flex-1 h-10 rounded border border-border hover:border-accent hover:bg-accent/10 transition-colors flex items-center justify-center"
                          >
                            <Star className={`h-4 w-4 ${rating <= (userProfile?.tourProgress.preferences[step.questionnaire!.field] || 0) ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
