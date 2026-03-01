import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom"; // <-- HashRouter вместо BrowserRouter
import Index from "./pages/Index";
import Assessment from "./pages/Assessment";
import Results from "./pages/Results";
import UniversityDetail from "./pages/UniversityDetail";
import Apply from "./pages/Apply";
import Courses from "./pages/Courses";
import Tracking from "./pages/Tracking";
import EventLanding from "./pages/EventLanding";
import Paywall from "./pages/Paywall";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import Receipt from "./pages/Receipt";
import NotFound from "./pages/NotFound";

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
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/receipt/:orderId" element={<Receipt />} />
          <Route path="/results" element={<Results />} />
          <Route path="/university/:id" element={<UniversityDetail />} />
          <Route path="/apply/:id" element={<Apply />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;