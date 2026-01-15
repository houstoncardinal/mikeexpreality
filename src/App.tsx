import React, { useEffect, useState } from "react";
import { BrowserRouter, useLocation, Routes, Route } from "react-router-dom";
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
// GuidedTour disabled - was causing blocking modal issues
// import { GuidedTour } from "@/components/GuidedTour";
import { ScrollProgress } from "@/components/InteractiveEffects";
import { ComparisonBar } from "@/components/comparison/ComparisonBar";
import { ComparisonModal } from "@/components/comparison/ComparisonModal";
import { MobileToolbar } from "@/components/MobileToolbar";
import { Layout } from "@/components/layout";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";
import Health from "@/pages/Health";
import { SplashScreen } from "@/components/SplashScreen";
import { VoiceAgentWidget } from "@/components/VoiceAgentWidget";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { PageTransition } from "@/components/PageTransition";
import { AnimatePresence } from "framer-motion";
import {
  AdminDashboard,
  AdminLeads,
  AdminPosts,
  AdminPostEditor,
  AdminCategories,
} from "@/pages/admin";
import AdminProperties from "@/pages/admin/AdminProperties";
import AdminTransactions from "@/pages/admin/AdminTransactions";
import AdminShowings from "@/pages/admin/AdminShowings";
import AdminTasks from "@/pages/admin/AdminTasks";
import AdminReports from "@/pages/admin/AdminReports";
import AdminMLS from "@/pages/admin/AdminMLS";
import AdminStaff from "@/pages/admin/AdminStaff";
import AdminMeetings from "@/pages/admin/AdminMeetings";
import AdminTrainings from "@/pages/admin/AdminTrainings";
import AdminFollowUps from "@/pages/admin/AdminFollowUps";
import AdminEmailCampaigns from "@/pages/admin/AdminEmailCampaigns";
import AdminSEO from "@/pages/admin/AdminSEO";

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

// Component to render correct layout based on route
const AppRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <ProtectedRoute requireAdmin>
        <AdminLayout>
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
              <Route path="/admin/leads" element={<PageTransition><AdminLeads /></PageTransition>} />
              <Route path="/admin/properties" element={<PageTransition><AdminProperties /></PageTransition>} />
              <Route path="/admin/transactions" element={<PageTransition><AdminTransactions /></PageTransition>} />
              <Route path="/admin/showings" element={<PageTransition><AdminShowings /></PageTransition>} />
              <Route path="/admin/tasks" element={<PageTransition><AdminTasks /></PageTransition>} />
              <Route path="/admin/reports" element={<PageTransition><AdminReports /></PageTransition>} />
              <Route path="/admin/mls" element={<PageTransition><AdminMLS /></PageTransition>} />
              <Route path="/admin/staff" element={<PageTransition><AdminStaff /></PageTransition>} />
              <Route path="/admin/meetings" element={<PageTransition><AdminMeetings /></PageTransition>} />
              <Route path="/admin/trainings" element={<PageTransition><AdminTrainings /></PageTransition>} />
              <Route path="/admin/follow-ups" element={<PageTransition><AdminFollowUps /></PageTransition>} />
              <Route path="/admin/email-campaigns" element={<PageTransition><AdminEmailCampaigns /></PageTransition>} />
              <Route path="/admin/seo" element={<PageTransition><AdminSEO /></PageTransition>} />
              <Route path="/admin/posts" element={<PageTransition><AdminPosts /></PageTransition>} />
              <Route path="/admin/posts/new" element={<PageTransition><AdminPostEditor /></PageTransition>} />
              <Route path="/admin/posts/:id" element={<PageTransition><AdminPostEditor /></PageTransition>} />
              <Route path="/admin/categories" element={<PageTransition><AdminCategories /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <Layout>
      <AnimatedRoutes />
      <ComparisonBar />
      <ComparisonModal />
    </Layout>
  );
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
                  
                  <AnalyticsTracker>
                    <AppRoutes />
                  </AnalyticsTracker>
                  <MobileToolbar />
                  <VoiceAgentWidget />
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
