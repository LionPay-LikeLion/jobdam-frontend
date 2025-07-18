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
import CommunityLayout from "@/pages/layouts/CommunityLayout";
import CommunityHome from "@/pages/CommunityHome";
import CommunityBoardList from "@/pages/CommunityBoardList";
import CommunityBoardMain from "@/pages/CommunityBoardMain";
import CommunityBoardPostDetail from "@/pages/CommunityBoardPostDetail";
import CommunityMemberList from "@/pages/CommunityMemberList";
import CommunityMessenger from "@/pages/CommunityMessenger";
import CommunityManagement from "@/pages/CommunityManagement";
import CommunityBoardCreate from "@/pages/CommunityBoardCreate";
import PointPurchase from "@/pages/PointPurchase";


import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import PaymentSuccess from "@/pages/PaymentSuccess.tsx";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sns" element={<SNSFeedLayout />}> {/* sns-feed side bar layout */}
              <Route index element={<SNSFeedHome />} />          
              <Route path="mine" element={<SNSFeedMy />} />      
              <Route path=":postId" element={<SNSFeedPost />} />
              <Route path="messages" element={<SNSMessage />} />
              <Route path="sns-post-write" element={<SNSPostWrite />} />
            </Route>
            <Route path="/point-purchase" element={<PointPurchase />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/find-email" element={<FindEmail />} />
            <Route path="/find-password" element={<FindPassword />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/create" element={<CommunityCreate />} />
            <Route path="/community/:id" element={<CommunityLayout />}> {/* community side bar layout */}
              <Route index element={<CommunityHome />} />
              <Route path="board" element={<CommunityBoardList />} />
              <Route path="board/:boardId" element={<CommunityBoardMain />} />
              <Route path="board/detail/:postId" element={<CommunityBoardPostDetail />} />
              <Route path="members" element={<CommunityMemberList />} />
              <Route path="messenger" element={<CommunityMessenger />} />
              <Route path="management" element={<CommunityManagement />} />
              <Route path="board/create" element={<CommunityBoardCreate />} />
            </Route>
              <Route path="/payment-success" element={<PaymentSuccess />} />

              <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

