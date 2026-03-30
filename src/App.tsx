import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import SellerDashboard from "./pages/dashboards/SellerDashboard";
import BuyerDashboard from "./pages/dashboards/BuyerDashboard";
import BusinessDashboard from "./pages/dashboards/BusinessDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import AboutPage from "./pages/AboutPage";
import B2BPage from "./pages/B2BPage";
import MarketplacePage from "./pages/MarketplacePage";
import SellerOnboardingPage from "./pages/seller/SellerOnboardingPage";
import AIListingStudioPage from "./pages/seller/AIListingStudioPage";
import SellerProductsPage from "./pages/seller/SellerProductsPage";
import AddProductPage from "./pages/seller/AddProductPage";
import SellerOrdersPage from "./pages/seller/SellerOrdersPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import SellerStorefrontPage from "./pages/SellerStorefrontPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/b2b" element={<B2BPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/seller/:sellerId" element={<SellerStorefrontPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Seller routes */}
              <Route path="/seller/dashboard" element={<ProtectedRoute requiredRole="seller"><SellerDashboard /></ProtectedRoute>} />
              <Route path="/seller/onboarding" element={<ProtectedRoute requiredRole="seller"><SellerOnboardingPage /></ProtectedRoute>} />
              <Route path="/seller/listing-studio" element={<ProtectedRoute requiredRole="seller"><AIListingStudioPage /></ProtectedRoute>} />
              <Route path="/seller/products" element={<ProtectedRoute requiredRole="seller"><SellerProductsPage /></ProtectedRoute>} />
              <Route path="/seller/products/new" element={<ProtectedRoute requiredRole="seller"><AddProductPage /></ProtectedRoute>} />
              <Route path="/seller/orders" element={<ProtectedRoute requiredRole="seller"><SellerOrdersPage /></ProtectedRoute>} />

              {/* Buyer / Cart */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<ProtectedRoute requiredRole="buyer"><CheckoutPage /></ProtectedRoute>} />
              <Route path="/buyer/dashboard" element={<ProtectedRoute requiredRole="buyer"><BuyerDashboard /></ProtectedRoute>} />
              <Route path="/business/dashboard" element={<ProtectedRoute requiredRole="business_buyer"><BusinessDashboard /></ProtectedRoute>} />

              {/* Admin */}
              <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
