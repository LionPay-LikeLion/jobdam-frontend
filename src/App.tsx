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
import MyPage from "@/pages/MyPage";
import PremiumUpgrade from "@/pages/PremiumUpgrade"; // << 추가
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PaymentSuccess from "@/pages/PaymentSuccess.tsx";
import MembershipTypeRequest from "@/pages/MembershipTypeRequest";
import MyPageLayout from "@/pages/MyPageLayout";
import PaymentHistoryPage from "@/pages/PaymentHistoryPage";
import PointHistoryPage from "@/pages/PointHistoryPage";

const queryClient = new QueryClient();

// 루트 경로 컴포넌트 - 로그인 상태에 따라 다른 페이지 렌더링
const RootComponent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 로그인된 사용자는 SNS 피드로, 로그인되지 않은 사용자는 홈페이지로
  return isAuthenticated ? <SNSFeedLayout /> : <HomePage />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* 루트 경로 - 로그인 상태에 따라 다르게 처리 */}
      <Route path="/" element={<RootComponent />}>
        {/* 로그인된 사용자의 경우 SNS 피드 하위 라우트들 */}
        {isAuthenticated && (
          <>
            <Route index element={<SNSFeedHome />} />
            <Route path="mine" element={<SNSFeedMy />} />
            <Route path=":postId" element={<SNSFeedPost />} />
            <Route path="messages" element={<SNSMessage />} />
            <Route path="sns-post-write" element={<SNSPostWrite />} />
          </>
        )}
      </Route>

      {/* 로그인된 사용자만 접근 가능한 라우트들 */}
      {isAuthenticated && (
        <>
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/point-purchase" element={<PointPurchase />} />
          <Route path="/premium-upgrade" element={<PremiumUpgrade />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/create" element={<CommunityCreate />} />
          <Route path="/community/:id" element={<CommunityLayout />}>
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
          <Route path="/membership-type-request" element={<MembershipTypeRequest />} />
          <Route path="/mypage/payments" element={<PaymentHistoryPage />} />
          <Route path="/mypage/points" element={<PointHistoryPage />} />
        </>
      )}

      {/* 로그인되지 않은 사용자만 접근 가능한 라우트들 */}
      {!isAuthenticated && (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/find-email" element={<FindEmail />} />
          <Route path="/find-password" element={<FindPassword />} />
        </>
      )}

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
);

export default App;
