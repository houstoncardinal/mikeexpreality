import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { PageTransition } from "@/components/PageTransition";

// Pages
import Index from "@/pages/Index";
import About from "@/pages/About";
import Listings from "@/pages/Listings";
import PropertyDetail from "@/pages/PropertyDetail";
import Neighborhoods from "@/pages/Neighborhoods";
import Blog from "@/pages/Blog";
import BlogPostPage from "@/pages/BlogPost";
import Contact from "@/pages/Contact";
import BuyerResources from "@/pages/BuyerResources";
import SellerResources from "@/pages/SellerResources";
import HomeValuation from "@/pages/HomeValuation";
import MortgageCalculatorPage from "@/pages/MortgageCalculator";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import Hero3DDemo from "@/pages/Hero3DDemo";
import {
  AdminDashboard,
  AdminLeads,
  AdminPosts,
  AdminPostEditor,
  AdminCategories,
} from "@/pages/admin";

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PageTransition>
              <Index />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <About />
            </PageTransition>
          }
        />
        <Route
          path="/listings"
          element={
            <PageTransition>
              <Listings />
            </PageTransition>
          }
        />
        <Route
          path="/property/:id"
          element={
            <PageTransition>
              <PropertyDetail />
            </PageTransition>
          }
        />
        <Route
          path="/neighborhoods"
          element={
            <PageTransition>
              <Neighborhoods />
            </PageTransition>
          }
        />
        <Route
          path="/neighborhoods/:slug"
          element={
            <PageTransition>
              <Neighborhoods />
            </PageTransition>
          }
        />
        <Route
          path="/blog"
          element={
            <PageTransition>
              <Blog />
            </PageTransition>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <PageTransition>
              <BlogPostPage />
            </PageTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <PageTransition>
              <Contact />
            </PageTransition>
          }
        />
        <Route
          path="/buyer-resources"
          element={
            <PageTransition>
              <BuyerResources />
            </PageTransition>
          }
        />
        <Route
          path="/seller-resources"
          element={
            <PageTransition>
              <SellerResources />
            </PageTransition>
          }
        />
        <Route
          path="/home-valuation"
          element={
            <PageTransition>
              <HomeValuation />
            </PageTransition>
          }
        />
        <Route
          path="/auth"
          element={
            <PageTransition>
              <Auth />
            </PageTransition>
          }
        />
        <Route
          path="/3d-demo"
          element={
            <PageTransition>
              <Hero3DDemo />
            </PageTransition>
          }
        />
        <Route
          path="/mortgage-calculator"
          element={
            <PageTransition>
              <MortgageCalculatorPage />
            </PageTransition>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <PageTransition>
                <AdminDashboard />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leads"
          element={
            <ProtectedRoute requireAdmin>
              <PageTransition>
                <AdminLeads />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/posts"
          element={
            <ProtectedRoute requireAdmin>
              <PageTransition>
                <AdminPosts />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/posts/new"
          element={
            <ProtectedRoute requireAdmin>
              <PageTransition>
                <AdminPostEditor />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/posts/:id"
          element={
            <ProtectedRoute requireAdmin>
              <PageTransition>
                <AdminPostEditor />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute requireAdmin>
              <PageTransition>
                <AdminCategories />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}