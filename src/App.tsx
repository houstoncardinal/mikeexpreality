import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { initGA, trackPageView } from "@/lib/analytics";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { ComparisonBar } from "@/components/comparison/ComparisonBar";
import { ComparisonModal } from "@/components/comparison/ComparisonModal";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { ScrollToTop } from "@/components/ScrollToTop";
import { GuidedTour } from "@/components/GuidedTour";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ScrollProgress } from "@/components/InteractiveEffects";
import Index from "./pages/Index";
import About from "./pages/About";
import Listings from "./pages/Listings";
import PropertyDetail from "./pages/PropertyDetail";
import Neighborhoods from "./pages/Neighborhoods";
import Blog from "./pages/Blog";
import BlogPostPage from "./pages/BlogPost";
import Contact from "./pages/Contact";
import BuyerResources from "./pages/BuyerResources";
import SellerResources from "./pages/SellerResources";
import HomeValuation from "./pages/HomeValuation";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import {
  AdminDashboard,
  AdminLeads,
  AdminPosts,
  AdminPostEditor,
  AdminCategories,
} from "./pages/admin";

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
                <AnalyticsTracker>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/listings" element={<Listings />} />
                    <Route path="/property/:id" element={<PropertyDetail />} />
                    <Route path="/neighborhoods" element={<Neighborhoods />} />
                    <Route path="/neighborhoods/:slug" element={<Neighborhoods />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPostPage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/buyer-resources" element={<BuyerResources />} />
                    <Route path="/seller-resources" element={<SellerResources />} />
                    <Route path="/home-valuation" element={<HomeValuation />} />
                    <Route path="/auth" element={<Auth />} />
                    
                    {/* Admin Routes */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/leads"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminLeads />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/posts"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminPosts />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/posts/new"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminPostEditor />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/posts/:id"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminPostEditor />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/categories"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminCategories />
                        </ProtectedRoute>
                      }
                    />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
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
