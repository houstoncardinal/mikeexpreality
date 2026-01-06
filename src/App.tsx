import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { initGA, trackPageView } from "@/lib/analytics";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { ComparisonBar } from "@/components/comparison/ComparisonBar";
import { ComparisonModal } from "@/components/comparison/ComparisonModal";
import { AuthProvider } from "@/hooks/useAuth";
import { ScrollToTop } from "@/components/ScrollToTop";
import { GuidedTour } from "@/components/GuidedTour";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ScrollProgress } from "@/components/InteractiveEffects";
import { ContactFlyout } from "@/components/ContactFlyout";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";

const queryClient = new QueryClient();

// Analytics wrapper component
const AnalyticsTracker = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  useEffect(() => {
    initGA();
  }, []);
  
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);
  
  return <>{children}</>;
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TranslationProvider>
          <BrowserRouter>
            <AuthProvider>
              <ComparisonProvider>
                <ScrollToTop />
                <ScrollProgress />
                <Toaster />
                <Sonner />
                <GuidedTour />
                <LanguageSwitcher variant="floating" />
                <ContactFlyout />
                <AnalyticsTracker>
                  <AnimatedRoutes />
                  <ComparisonBar />
                  <ComparisonModal />
                </AnalyticsTracker>
              </ComparisonProvider>
            </AuthProvider>
          </BrowserRouter>
        </TranslationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;