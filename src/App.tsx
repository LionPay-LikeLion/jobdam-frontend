import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import GoogleRedirectHandler from "./pages/GoogleRedirectHandler";
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
import SNSPostEdit from "@/pages/SNSPostEdit";
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
import CommunityPostWrite from "@/pages/CommunityPostWrite";
import CommunityPostEdit from "@/pages/CommunityPostEdit";
import PointPurchase from "@/pages/PointPurchase";
import MyPage from "@/pages/MyPage";
import PremiumUpgrade from "@/pages/PremiumUpgrade";
import CommunityPremiumUpgrade from "@/pages/CommunityPremiumUpgrade";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PaymentSuccess from "@/pages/PaymentSuccess.tsx";
import MembershipTypeRequest from "@/pages/MembershipTypeRequest";
import PaymentHistoryPage from "@/pages/PaymentHistoryPage";
import PointHistoryPage from "@/pages/PointHistoryPage";
import AdminUserManagement from "@/pages/AdminUserManagement.tsx";
import AdminReport from "@/pages/AdminReport.tsx";
import AdminRoleChange from "@/pages/AdminRoleChange.tsx";
import ActivityHistoryPage from "@/pages/ActivityHistoryPage";
// Admin 관련 페이지 추가 시 import!

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
  return isAuthenticated ? <SNSFeedLayout /> : <HomePage />;
};

const AppRoutes = () => {
  
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* 루트 경로 - 로그인 상태에 따라 다르게 처리 */}
            <Route path="/" element={<RootComponent />}>
                {isAuthenticated && (
                    <>
                        <Route index element={<SNSFeedHome />} />
                        <Route path="mine" element={<SNSFeedMy />} />
                        <Route path=":postId" element={<SNSFeedPost />} />
                        <Route path="messages" element={<SNSMessage />} />
                        <Route path="sns-post-write" element={<SNSPostWrite />} />
                        <Route path="/sns/posts/:postId/edit" element={<SNSPostEdit /> } />
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
                        <Route path="board/:boardId/post/write" element={<CommunityPostWrite />} />
                        <Route path="board/:boardId/post/edit/:postId" element={<CommunityPostEdit />} />
                        <Route path="board/detail/:postId" element={<CommunityBoardPostDetail />} />
                        <Route path="members" element={<CommunityMemberList />} />
                        <Route path="messenger" element={<CommunityMessenger />} />
                        <Route path="management" element={<CommunityManagement />} />
                        <Route path="board/create" element={<CommunityBoardCreate />} />
                        <Route path="upgrade" element={<CommunityPremiumUpgrade />} />
                        <Route path="board/detail/:postId" element={<CommunityBoardPostDetail />} />
                    </Route>
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/membership-type-request" element={<MembershipTypeRequest />} />
                    <Route path="/mypage/payments" element={<PaymentHistoryPage />} />
                    <Route path="/mypage/points" element={<PointHistoryPage />} />

                    <Route path="/activity-history" element={<ActivityHistoryPage />} />

  return (
    <Routes>
      {/* 루트 경로 - 로그인 상태에 따라 다르게 처리 */}
      <Route path="/" element={<RootComponent />}>
        {isAuthenticated && (
          <>
            <Route index element={<SNSFeedHome />} />
            <Route path="mine" element={<SNSFeedMy />} />
            <Route path=":postId" element={<SNSFeedPost />} />
            <Route path="messages" element={<SNSMessage />} />
            <Route path="sns-post-write" element={<SNSPostWrite />} />
            <Route path="/sns/posts/:postId/edit" element={<SNSPostEdit />} />
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
            <Route path="board/:boardId/post/write" element={<CommunityPostWrite />} />
            <Route path="board/:boardId/post/edit/:postId" element={<CommunityPostEdit />} />
            <Route path="board/detail/:postId" element={<CommunityBoardPostDetail />} />
            <Route path="members" element={<CommunityMemberList />} />
            <Route path="messenger" element={<CommunityMessenger />} />
            <Route path="management" element={<CommunityManagement />} />
            <Route path="board/create" element={<CommunityBoardCreate />} />
            <Route path="upgrade" element={<CommunityPremiumUpgrade />} />
            <Route path="board/detail/:postId" element={<CommunityBoardPostDetail />} />
          </Route>
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/membership-type-request" element={<MembershipTypeRequest />} />
          <Route path="/mypage/payments" element={<PaymentHistoryPage />} />
          <Route path="/mypage/points" element={<PointHistoryPage />} />
          <Route path="/mypage/activity" element={<ActivityHistoryPage />} />

          {/* ------ 어드민 영역 ------ */}
          <Route path="/admin/users" element={<AdminUserManagement />} />
          <Route path="/admin/report" element={<AdminReport />} />
          <Route path="/admin/type-request" element={<AdminRoleChange />} />
          {/* 신고 관리, 전환요청 등은 아래처럼 확장 가능! */}
          {/* <Route path="/admin/report" element={<AdminReportManagement />} /> */}
        </>
      )}

      {!isAuthenticated && (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/find-email" element={<FindEmail />} />
          <Route path="/find-password" element={<FindPassword />} />
        </>
      )}

      {/* ✅ Add this for Google redirect */}
      <Route path="/api/oauth/google/callback" element={<GoogleRedirectHandler />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <BrowserRouter> {/* Moved up here */}
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);

export default App;
