// src/components/TopBar.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Search, User, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function TopBar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // 디버깅용
  console.log('TopBar user:', user);
  console.log('memberTypeCode:', user?.memberTypeCode);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("로그아웃되었습니다.");
      navigate("/");
    } catch (error) {
      toast.error("로그아웃 중 오류가 발생했습니다.");
    }
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

          <div className="flex items-center gap-6">
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
                    onClick={() => navigate("/community")}
                >
                  커뮤니티
                </Button>

                {/* 사용자 정보 및 포인트 표시 - 분리된 클릭 영역 */}
                <div className="flex items-center gap-3">
                  {/* 사용자 정보 영역 */}
                  <div 
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${
                      user?.subscriptionLevel === 'PREMIUM' 
                        ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 hover:from-yellow-200 hover:to-orange-200' 
                        : user?.memberTypeCode === 'HUNTER'
                        ? 'bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 hover:from-blue-200 hover:to-purple-200'
                        : user?.memberTypeCode === 'EMPLOYEE'
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 hover:from-green-200 hover:to-emerald-200'
                        : 'bg-[#f8f9fa] border border-gray-200 hover:bg-[#e9ecef]'
                    }`}
                    onClick={() => navigate("/mypage")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-semibold text-gray-800">
                          {user?.nickname || user?.name || "사용자"}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user?.memberTypeCode === 'EMPLOYEE' 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : user?.memberTypeCode === 'HUNTER' 
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {user?.memberTypeCode === 'EMPLOYEE' ? '기업회원' : 
                         user?.memberTypeCode === 'HUNTER' ? '컨설턴트' : 
                         user?.memberTypeCode === 'GENERAL' ? '일반회원' : '회원'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user?.subscriptionLevel === 'PREMIUM' 
                          ? 'bg-gradient-to-r from-yellow-200 to-orange-200 text-yellow-800 border border-yellow-300' 
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {user?.subscriptionLevel === 'PREMIUM' ? 'PREMIUM' : 'BASIC'}
                      </span>
                    </div>
                  </div>

                  {/* 포인트 영역 - 독립 클릭 */}
                  <div 
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      user?.subscriptionLevel === 'PREMIUM' 
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 hover:from-yellow-100 hover:to-orange-100' 
                        : user?.memberTypeCode === 'HUNTER'
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 hover:from-blue-100 hover:to-purple-100'
                        : user?.memberTypeCode === 'EMPLOYEE'
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 hover:from-green-100 hover:to-emerald-100'
                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => navigate("/point-purchase")}
                  >
                    <Crown className={`w-5 h-5 ${
                      user?.subscriptionLevel === 'PREMIUM' ? 'text-yellow-500' : 'text-gray-500'
                    }`} />
                    <span className="text-sm text-gray-600">보유 포인트:</span>
                    <span className={`text-sm font-medium ${
                      user?.subscriptionLevel === 'PREMIUM' ? 'text-yellow-700' : 'text-gray-800'
                    }`}>
                      {user?.point?.toLocaleString() || 0}P
                    </span>
                  </div>
                </div>

                <Button
                    variant="ghost"
                    className="font-normal text-base text-red-600 hover:text-red-700"
                    onClick={handleLogout}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <Button
                  variant="ghost"
                  className="font-normal text-base"
                  onClick={() => navigate("/login")}
              >
                로그인/회원가입
              </Button>
            )}

            <div className="flex items-center w-[200px] border border-[#0000001a] rounded-md">
              <Input
                  className="border-0 text-[#00000080] text-sm"
                  placeholder="Search in site"
              />
              <Search className="w-5 h-5 mr-2 text-gray-400" />
            </div>
          </div>
        </div>
      </header>
  );
}
