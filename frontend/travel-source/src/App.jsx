import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// User pages
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Profile from "./pages/Profile/Profile";
import InternationalTripsPage from "./pages/InternationalTrips/InternationalTripsPage";
import IndiaTripsPage from "./pages/IndiaTrips/IndiaTripsPage";
import NorthIndiaTripsPage from "./pages/NorthIndiaTrips/NorthIndiaTripsPage";
import HimalayanTripsPage from "./pages/HimalayanTrips/HimalayanTripsPage";
import CommunityTripsPage from "./pages/CommunityTrips/CommunityTripsPage";
import FestivalTripsPage from "./pages/FestivalTrips/FestivalTripsPage";
import HoneymoonTripsPage from "./pages/HoneymoonTrips/HoneymoonTripsPage";
import AdventureTripsPage from "./pages/AdventureTripsPage/AdventureTripsPage";
import BackpackingTripsPage from "./pages/BackpackingTrips/BackpackingTripsPage";
import ContactUs from "./components/ContactUs/ContactUs";
import MyBookings from "./pages/MyBookings/MyBookings";
import BookingPage from "./pages/Booking/BookingPage";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy";
import TermsOfService from "./pages/Legal/TermsOfService";
import RefundPolicy from "./pages/Legal/RefundPolicy";
import TripDetailNew from "./components/TripDetailNew/TripDetailNew";
import PackagesPage from "./pages/Packages/PackagesPage";
import PremiumCategoryTripsPage from "./pages/CategoryTrips/PremiumCategoryTripsPage";

// Admin
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";

import AdminEnquiries from "./admin/AdminEnquiries";
import AdminTrips from "./admin/AdminTrips";
import AdminUsers from "./admin/AdminUsers";
import AdminContactMessage from "./admin/AdminContactMessage";
import AdminBookings from "./admin/AdminBookings";
import AdminBookingDetail from "./admin/AdminBookingDetail";

function App() {
  return (
    <Routes>
      {/* USER ROUTES */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />

      <Route
        path="/login"
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />

      <Route
        path="/signup"
        element={
          <Layout>
            <Signup />
          </Layout>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <Layout>
            <ForgotPassword />
          </Layout>
        }
      />

      <Route
        path="/trips/:id"
        element={
          <Layout>
            <TripDetailNew />
          </Layout>
        }
      />

      {/* NEW: JustWravel-style Trip Detail page (alias route) */}
      <Route
        path="/trip/:id"
        element={
          <Layout>
            <TripDetailNew />
          </Layout>
        }
      />

      <Route
        path="/international-trips"
        element={
          <Layout>
            <InternationalTripsPage />
          </Layout>
        }
      />

      <Route
        path="/india-trips"
        element={
          <Layout>
            <IndiaTripsPage />
          </Layout>
        }
      />

      <Route
        path="/north-india-trips"
        element={
          <Layout>
            <NorthIndiaTripsPage />
          </Layout>
        }
      />

      <Route
        path="/himalayan-trips"
        element={
          <Layout>
            <HimalayanTripsPage />
          </Layout>
        }
      />

      <Route
        path="/community-trips"
        element={
          <Layout>
            <CommunityTripsPage />
          </Layout>
        }
      />

      <Route
        path="/festival-trips"
        element={
          <Layout>
            <FestivalTripsPage />
          </Layout>
        }
      />

      <Route
        path="/honeymoon-trips"
        element={
          <Layout>
            <HoneymoonTripsPage />
          </Layout>
        }
      />

      <Route
        path="/adventure-trips"
        element={
          <Layout>
            <AdventureTripsPage />
          </Layout>
        }
      />

      <Route
        path="/backpacking-trips"
        element={
          <Layout>
            <BackpackingTripsPage />
          </Layout>
        }
      />

      <Route
        path="/packages"
        element={
          <Layout>
            <PackagesPage />
          </Layout>
        }
      />

      <Route
        path="/trips/:id/book"
        element={
          <Layout>
            <BookingPage />
          </Layout>
        }
      />

      <Route
        path="/my-enquiries"
        element={
          <ProtectedRoute allowedRole="USER">
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute allowedRole="USER">
            <Layout>
              <MyBookings />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/contact"
        element={
          <Layout>
            <ContactUs />
          </Layout>
        }
      />

      <Route
        path="/privacy"
        element={
          <Layout>
            <PrivacyPolicy />
          </Layout>
        }
      />

      <Route
        path="/terms"
        element={
          <Layout>
            <TermsOfService />
          </Layout>
        }
      />

      <Route
        path="/refund-policy"
        element={
          <Layout>
            <RefundPolicy />
          </Layout>
        }
      />

      {/* DYNAMIC CATEGORY ROUTE (Catch-all for slugs) */}
      <Route
        path="/:categorySlug"
        element={
          <Layout>
            <PremiumCategoryTripsPage />
          </Layout>
        }
      />

      {/* ADMIN ROUTES (NO USER LAYOUT) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="trips" element={<AdminTrips />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="bookings/:bookingId" element={<AdminBookingDetail />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="contact-messages" element={<AdminContactMessage />} />
      </Route>
    </Routes>
  );
}

export default App;
