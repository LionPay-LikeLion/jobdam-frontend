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
import SNSFeedLayout from "@/pages/layouts/SNSFeedLayout";
import SNSFeedHome from "@/pages/SNSFeedHome";
import SNSFeedPost from "@/pages/SNSFeedPost";
import SNSFeedMy from "@/pages/SNSFeedMy";
import SNSMessage from "@/pages/SNSMessage";
import SNSPostWrite from "@/pages/SNSPostWrite";
import CommunityPage from "@/pages/CommunityPage";
import CommunityCreate from "@/pages/CommunityCreate";

import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/info" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/find-email" element={<FindEmail />} />
          <Route path="/find-password" element={<FindPassword />} />
          
          <Route path="/" element={<SNSFeedLayout />}> {/* sns-feed side bar layout */}
            <Route index element={<SNSFeedHome />} />          
            <Route path="mine" element={<SNSFeedMy />} />      
            <Route path=":postId" element={<SNSFeedPost />} /> 
            <Route path="messages" element={<SNSMessage />} />
            <Route path="sns-post-write" element={<SNSPostWrite />} />
          </Route>

          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/create" element={<CommunityCreate />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
