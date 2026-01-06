import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { initGA, trackPageView } from "@/lib/analytics";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { ComparisonBar } from "@/components/comparison/ComparisonBar";
import { ComparisonModal } from "@/components/comparison/ComparisonModal";
import Index from "./pages/Index";
import About from "./pages/About";
import Listings from "./pages/Listings";
import PropertyDetail from "./pages/PropertyDetail";
import Neighborhoods from "./pages/Neighborhoods";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import BuyerResources from "./pages/BuyerResources";
import SellerResources from "./pages/SellerResources";
import HomeValuation from "./pages/HomeValuation";
import NotFound from "./pages/NotFound";

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
        <ComparisonProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnalyticsTracker>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/neighborhoods" element={<Neighborhoods />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/buyer-resources" element={<BuyerResources />} />
                <Route path="/seller-resources" element={<SellerResources />} />
                <Route path="/home-valuation" element={<HomeValuation />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ComparisonBar />
              <ComparisonModal />
            </AnalyticsTracker>
          </BrowserRouter>
        </ComparisonProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
