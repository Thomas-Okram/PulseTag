import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import UserDashboard from "./pages/UserDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import OrderPage from "./pages/OrderPage";
import ProfilePage from "./pages/ProfilePage";

import ManageUsersPage from "./pages/ManageUsersPage";
import ManageProductsPage from "./pages/ManageProductsPage";
import ManageOrdersPage from "./pages/ManageOrdersPage";
import ManageEcommercePage from "./pages/ManageEcommercePage";

import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import CheckoutPage from "./pages/CheckoutPage";
import BuyNowPage from "./pages/BuyNowPage";
import CartPage from "./pages/CartPage";

// Protect routes that require authentication
const ProtectedRoute = ({ children, requireAdmin }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Redirect to appropriate dashboards based on role
  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (
    !requireAdmin &&
    user?.role === "admin" &&
    window.location.pathname === "/"
  ) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return user?.role === "admin" ? (
      <Navigate to="/admin" replace />
    ) : (
      <Navigate to="/" replace />
    );
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#16213e] flex flex-col relative overflow-hidden">
      <FloatingShape
        color="bg-pink-200/40"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-blue-200/40"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-purple-200/40"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      <Routes>
        {/* User Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        {/* Admin Management Pages */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requireAdmin>
              <ManageUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requireAdmin>
              <ManageProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requireAdmin>
              <ManageOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ecommerce"
          element={
            <ProtectedRoute requireAdmin>
              <ManageEcommercePage />
            </ProtectedRoute>
          }
        />
        {/* Other Pages */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AboutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <ContactPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order"
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        {/* Buy Now Routes */}
        <Route
          path="/buy-now"
          element={
            <ProtectedRoute>
              <BuyNowPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-confirmation/:orderId"
          element={
            <ProtectedRoute>
              <OrderConfirmationPage />
            </ProtectedRoute>
          }
        />

        {/* Public routes */}
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <div className="min-h-screen flex items-center justify-center">
                <SignUpPage />
              </div>
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <div className="min-h-screen flex items-center justify-center">
                <LoginPage />
              </div>
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/verify-email"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <EmailVerificationPage />
            </div>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <div className="min-h-screen flex items-center justify-center">
                <ForgotPasswordPage />
              </div>
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <ResetPasswordPage />
            </div>
          }
        />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
