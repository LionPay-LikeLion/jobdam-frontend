import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Crown, MessageSquare, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { FaCrown } from "react-icons/fa";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";

export default function TopBar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "로그아웃",
        description: "로그아웃되었습니다.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "오류",
        description: "로그아웃 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 관리자: roleCodeId === 2
  const isAdmin = !!user && Number(user.roleCodeId) === 2;

  const handleNavigateAndClose = (path: string) => {
    navigate(path);
    setIsSheetOpen(false);
  };

  return (
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-20 items-center justify-between px-4">
          <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
          >
            <img
                className="w-[85px] h-20 object-contain"
                alt="JobDam Logo"
                src="/images/logo.png"
            />
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
                <>
                  <Button
                      variant="ghost"
                      className="font-normal text-base"
                      onClick={() => navigate("/")}
                  >
                    SNS 피드
                  </Button>
                  <Button
                      variant="ghost"
                      className="font-normal text-base"
                      onClick={() => navigate("/communities")}
                  >
                    커뮤니티
                  </Button>
                  <Button
                      variant="ghost"
                      className="font-normal text-base flex items-center gap-2"
                      onClick={() => navigate("/messages")}
                  >
                    <MessageSquare className="w-4 h-4" />
                    메시지
                  </Button>
                  {/* 관리자만 보임 */}
                  {isAdmin && (
                      <Button
                          variant="ghost"
                          className="font-normal text-base text-red-600"
                          onClick={() => navigate("/admin/users")}
                      >
                        관리자페이지
                      </Button>
                  )}
                  {/* 사용자 정보 및 포인트 표시 */}
                  <div className="flex items-center gap-4">
                    <div
                        className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                        onClick={() => navigate("/mypage")}
                    >
                      <User className="w-4 h-4 text-gray-600" />
                      <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 flex items-center">
                      {user?.nickname || user?.name || "사용자"}
                    </span>
                        <span className="text-xs text-gray-500">
                      {user?.memberTypeCode === 'EMPLOYEE' ? '기업회원' :
                          user?.memberTypeCode === 'HUNTER' ? '컨설턴트' :
                              user?.memberTypeCode === 'GENERAL' ? '일반회원' : '회원'}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      {user?.subscriptionLevel === "PREMIUM" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-lg shadow border border-yellow-400 bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-300 text-white text-sm font-bold mr-1 animate-pulse">
                          PREMIUM
                        </span>
                      ) : (
                        user?.subscriptionLevel
                      )}
                      {user?.subscriptionLevel === "PREMIUM" && (
                        <span className="ml-1 relative flex items-center">
                          <FaCrown
                            className="text-yellow-400 animate-bounce"
                            style={{
                              filter: "drop-shadow(0 0 6px gold) drop-shadow(0 0 12px #ffe066)",
                              fontSize: 20,
                              marginLeft: 2,
                            }}
                            title="PREMIUM"
                          />
                          {/* 빤짝이 효과: CSS 애니메이션 추가 가능 */}
                          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-yellow-200 animate-ping opacity-70"></span>
                        </span>
                      )}
                    </span>
                      </div>
                    </div>
                    {/* 포인트 섹션 */}
                    <div
                        className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                        onClick={() => navigate("/point-purchase")}
                    >
                      <Crown className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">보유 포인트:</span>
                      <span className="text-sm font-medium text-blue-700">
                    {user?.remainingPoints?.toLocaleString()} P
                  </span>
                    </div>
                    {/* 로그아웃 버튼 */}
                    <Button
                        variant="outline"
                        className="text-sm"
                        onClick={handleLogout}
                    >
                      로그아웃
                    </Button>
                  </div>
                </>
            ) : (
                <Button
                    variant="outline"
                    className="text-sm"
                    onClick={() => navigate("/login")}
                >
                  로그인
                </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-3">
            {isAuthenticated && (
              <>
                {/* Mobile User Info (Compact) */}
                <div
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                    onClick={() => navigate("/mypage")}
                >
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {user?.nickname || user?.name || "사용자"}
                  </span>
                </div>
                
                {/* Hamburger Menu */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                    <SheetHeader>
                      <SheetTitle className="text-xl font-bold text-gray-900">메뉴</SheetTitle>
                    </SheetHeader>
                    
                    <div className="flex flex-col space-y-4 mt-6">
                      {/* User Profile Section */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <User className="w-6 h-6 text-gray-600" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {user?.nickname || user?.name || "사용자"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user?.memberTypeCode === 'EMPLOYEE' ? '기업회원' :
                               user?.memberTypeCode === 'HUNTER' ? '컨설턴트' :
                               user?.memberTypeCode === 'GENERAL' ? '일반회원' : '회원'}
                            </div>
                          </div>
                        </div>
                        
                        {/* Premium Badge */}
                        {user?.subscriptionLevel === "PREMIUM" && (
                          <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg shadow border border-yellow-400 bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-300 text-white text-sm font-bold animate-pulse">
                              PREMIUM
                            </span>
                            <FaCrown
                              className="text-yellow-400 animate-bounce"
                              style={{
                                filter: "drop-shadow(0 0 6px gold) drop-shadow(0 0 12px #ffe066)",
                                fontSize: 18,
                              }}
                            />
                          </div>
                        )}
                        
                        {/* Points */}
                        <div className="flex items-center gap-2 text-sm">
                          <Crown className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-600">보유 포인트:</span>
                          <span className="font-medium text-blue-700">
                            {user?.remainingPoints?.toLocaleString()} P
                          </span>
                        </div>
                      </div>

                      {/* Navigation Items */}
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-base h-12"
                          onClick={() => handleNavigateAndClose("/")}
                        >
                          SNS 피드
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-base h-12"
                          onClick={() => handleNavigateAndClose("/communities")}
                        >
                          커뮤니티
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-base h-12 flex items-center gap-2"
                          onClick={() => handleNavigateAndClose("/messages")}
                        >
                          <MessageSquare className="w-4 h-4" />
                          메시지
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-base h-12"
                          onClick={() => handleNavigateAndClose("/mypage")}
                        >
                          <User className="w-4 h-4 mr-2" />
                          마이페이지
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-base h-12"
                          onClick={() => handleNavigateAndClose("/point-purchase")}
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          포인트 구매
                        </Button>
                        
                        {/* Admin Menu */}
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-base h-12 text-red-600"
                            onClick={() => handleNavigateAndClose("/admin/users")}
                          >
                            관리자페이지
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <SheetFooter className="mt-8 pt-4 border-t border-gray-200">
                      <div className="w-full space-y-4">
                        {/* Monitoring Links */}
                        <div>
                          <p className="text-xs text-gray-500 mb-2 leading-relaxed">
                            원래 노출되면 안되는 부분이지만 여러분에게 시연을 위해 임시적으로 공개하는 모니터링 내용입니다
                          </p>
                          <div className="space-y-1">
                            <a 
                              href="https://jobdams.online/dashboard/ec2" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block text-xs text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              서버 건강: https://jobdams.online/dashboard/ec2
                            </a>
                            <a 
                              href="https://jobdams.online/dashboard/jobdam" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block text-xs text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              앱 건강: https://jobdams.online/dashboard/jobdam
                            </a>
                          </div>
                        </div>
                        
                        {/* Legal Links */}
                        <div className="space-y-1">
                          <div className="flex space-x-3">
                            <a href="#" className="text-xs text-gray-600 hover:text-gray-800 hover:underline">
                              이용약관
                            </a>
                            <a href="#" className="text-xs text-gray-600 hover:text-gray-800 hover:underline">
                              개인정보처리방침
                            </a>
                          </div>
                        </div>
                        
                        {/* Copyright */}
                        <div className="text-xs text-gray-500">
                          © 2025 돈내고사자 팀. All rights reserved.
                        </div>
                        
                        {/* Logout Button */}
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            handleLogout();
                            setIsSheetOpen(false);
                          }}
                        >
                          로그아웃
                        </Button>
                      </div>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </>
            )}
            
            {/* Mobile Login Button */}
            {!isAuthenticated && (
              <Button
                variant="outline"
                className="text-sm"
                onClick={() => navigate("/login")}
              >
                로그인
              </Button>
            )}
          </div>
        </div>
      </header>
  );
}
