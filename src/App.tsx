import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom"; // <-- HashRouter вместо BrowserRouter
import { RequirePlan } from "@/components/RequirePlan";
import Index from "./pages/Index";
import Assessment from "./pages/Assessment";
import Results from "./pages/Results";
import UniversityDetail from "./pages/UniversityDetail";
import Apply from "./pages/Apply";
import BasicPlanPage from "./pages/BasicPlanPage";
import ExpertPlanPage from "./pages/ExpertPlanPage";
import Courses from "./pages/Courses";
import Tracking from "./pages/Tracking";
import EventLanding from "./pages/EventLanding";
import Paywall from "./pages/Paywall";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import Receipt from "./pages/Receipt";
import QRRegister from "./pages/QRRegister";
import Consultants from "./pages/Consultants";
import ConsultantDashboard from "./pages/ConsultantDashboard";
import NotFound from "./pages/NotFound";
import { ReferralDashboard } from "@/components/ReferralDashboard";
import { SubscriptionDashboard } from "@/components/SubscriptionDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/e/:eventSlug" element={<EventLanding />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/paywall" element={<Paywall />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/qr-register" element={<QRRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/consultant-dashboard" element={<ConsultantDashboard />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/receipt/:orderId" element={<Receipt />} />
          <Route path="/results" element={<Results />} />
          <Route path="/university/:id" element={<UniversityDetail />} />
          <Route path="/apply/:id" element={<Apply />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/consultants" element={<Consultants />} />
          <Route path="/plan" element={<RequirePlan requiredPlan="basic"><BasicPlanPage /></RequirePlan>} />
          <Route path="/expert-plan" element={<RequirePlan requiredPlan="expert"><ExpertPlanPage /></RequirePlan>} />
          <Route path="/tracking" element={<RequirePlan requiredPlan="basic"><Tracking /></RequirePlan>} />
          <Route path="/referrals" element={<ReferralDashboard />} />
          <Route path="/subscription" element={<SubscriptionDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;