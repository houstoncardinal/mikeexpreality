import React, { useEffect, useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { AuthProvider } from "@/hooks/useAuth";
import { initGA, trackPageView } from "@/lib/analytics";
import { trackUserAction } from "@/lib/adaptiveLearning";
import { preloadCriticalImages } from "@/lib/images";
import { ScrollToTop } from "@/components/ScrollToTop";
import { GuidedTour } from "@/components/GuidedTour";
import { ScrollProgress } from "@/components/InteractiveEffects";
import { ContactFlyout } from "@/components/ContactFlyout";
import { ComparisonBar } from "@/components/comparison/ComparisonBar";
import { ComparisonModal } from "@/components/comparison/ComparisonModal";
import { MobileToolbar } from "@/components/MobileToolbar";
import { Layout } from "@/components/layout";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";
import { SplashScreen } from "@/components/SplashScreen";

const queryClient = new QueryClient();

// Analytics wrapper component
const AnalyticsTracker = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    initGA();
    // Preload critical images for better performance
    preloadCriticalImages();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname);
    // Track with adaptive learning system
    trackUserAction('page_view', location.pathname, {
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });
  }, [location]);

  return <>{children}</>;
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <TranslationProvider>
            {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
            <BrowserRouter>
              <AuthProvider>
                <ComparisonProvider>
                  <ScrollToTop />
                  <ScrollProgress />
                  <Toaster />
                  <Sonner />
                  <GuidedTour />
                  
                  <ContactFlyout />
                  <AnalyticsTracker>
                    <Layout>
                      <AnimatedRoutes />
                      <ComparisonBar />
                      <ComparisonModal />
                    </Layout>
                  </AnalyticsTracker>
                  <MobileToolbar />
                </ComparisonProvider>
              </AuthProvider>
            </BrowserRouter>
          </TranslationProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
