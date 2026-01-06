import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Sparkles, Home, Search, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  action?: () => void;
  highlight?: string;
}

export function GuidedTour() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const tourSteps: TourStep[] = [
    {
      id: "welcome",
      title: "Welcome to Mike Ogunkeye Real Estate",
      description: "Let us guide you through our luxury real estate experience. Discover exceptional properties in Houston's most prestigious neighborhoods.",
      icon: Sparkles,
    },
    {
      id: "browse",
      title: "Browse Our Portfolio",
      description: "Explore our curated collection of luxury homes, from elegant estates to modern masterpieces. Each property is handpicked for quality.",
      icon: Home,
      action: () => navigate("/listings"),
    },
    {
      id: "search",
      title: "Smart Property Search",
      description: "Use our advanced filters to find exactly what you're looking for. Filter by price, location, bedrooms, and more.",
      icon: Search,
    },
    {
      id: "neighborhoods",
      title: "Discover Neighborhoods",
      description: "Learn about Houston's best communities including Sugar Land, Katy, Cypress, and more. Find your perfect match.",
      icon: MapPin,
      action: () => navigate("/neighborhoods"),
    },
    {
      id: "contact",
      title: "Let's Connect",
      description: "Ready to start your journey? Our team is here to provide personalized guidance every step of the way.",
      icon: Phone,
      action: () => navigate("/contact"),
    },
  ];

  useEffect(() => {
    const seen = localStorage.getItem("tour-completed");
    if (!seen && location.pathname === "/") {
      // Show tour after 2 seconds on homepage
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("tour-completed", "true");
    setHasSeenTour(true);
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepAction = () => {
    const step = tourSteps[currentStep];
    if (step.action) {
      step.action();
    }
    handleNext();
  };

  if (!isVisible) return null;

  const step = tourSteps[currentStep];
  const Icon = step.icon;

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
              className="text-muted-foreground leading-relaxed"
            >
              {step.description}
            </motion.p>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 pb-6">
            {tourSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentStep
                    ? "bg-accent w-8"
                    : index < currentStep
                    ? "bg-accent/50"
                    : "bg-secondary"
                }`}
              />
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
