import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NotFound from "./pages/NotFound";

import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import SignUp from "@/pages/SignUp";
import FindEmail from "@/pages/FindEmail";
import FindPassword from "@/pages/FindPassword";
import CommunityPage from "@/pages/CommunityPage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/find-email" element={<FindEmail />} />
          <Route path="/find-password" element={<FindPassword />} />
          <Route path="/community" element={<CommunityPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
