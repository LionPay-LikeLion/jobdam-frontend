import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import SignUp from "@/pages/SignUp";
import FindEmail from "@/pages/FindEmail";
import FindPassword from "@/pages/FindPassword";
import CommunityPage from "@/pages/CommunityPage";
import SNSFeedHome from "@/pages/SNSFeedHome";
import SNSFeedPost from "@/pages/SNSFeedPost";
import SNSFeedMy from "@/pages/SNSFeedMy";
import SNSFeedLayout from "@/pages/layouts/SNSFeedLayout";

import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<SNSFeedLayout />}> {/* sns-feed side bar layout */}
              <Route index element={<SNSFeedHome />} />          
              <Route path="mine" element={<SNSFeedMy />} />      
              <Route path=":postId" element={<SNSFeedPost />} /> 
            </Route>
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/find-email" element={<FindEmail />} />
            <Route path="/find-password" element={<FindPassword />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/sns-feed" element={<SNSFeedLayout />}> {/* sns-feed side bar layout */}
              <Route index element={<SNSFeedHome />} />          
              <Route path="mine" element={<SNSFeedMy />} />      
              <Route path=":postId" element={<SNSFeedPost />} /> 
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

