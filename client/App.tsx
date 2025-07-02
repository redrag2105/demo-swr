import "./global.css";
import React from "react";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import FloatingQAButton from "./components/FloatingQAButton";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import Consultation from "./pages/Consultation";
import CycleTracking from "./pages/CycleTracking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ConsultationSuccess from "./pages/ConsultationSuccess";
import TestingBooking from "./pages/TestingBooking";
import TestingSuccess from "./pages/TestingSuccess";
import QAPage from "./pages/QAPage";
import QASuccess from "./pages/QASuccess";
import BookingHistory from "./pages/BookingHistory";
import Profile from "./pages/Profile";
import StorageDemo from "./pages/StorageDemo";
import UserManagement from "./pages/UserManagement";
import DoctorDashboard from "./pages/DoctorDashboard";
import ConsultantDashboard from "./pages/ConsultantDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-white">
          <BrowserRouter>
            <Navigation />
            <main>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route
                path="/services/testing/book"
                element={<TestingBooking />}
              />
              <Route
                path="/services/testing/success"
                element={<TestingSuccess />}
              />
              <Route path="/blog" element={<Blog />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route
                path="/consultation/success"
                element={<ConsultationSuccess />}
              />
              <Route path="/cycle-tracking" element={<CycleTracking />} />
              <Route path="/qa" element={<QAPage />} />
              <Route path="/qa/success" element={<QASuccess />} />
              <Route path="/booking-history" element={<BookingHistory />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/storage-demo" element={<StorageDemo />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/consultant-dashboard" element={<ConsultantDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <FloatingQAButton />
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </AuthProvider>
</QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
