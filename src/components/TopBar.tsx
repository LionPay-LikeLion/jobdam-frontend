import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Crown, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { FaCrown } from "react-icons/fa"; // 더 화려한 왕관 원하면

export default function TopBar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { toast } = useToast();

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
        </div>
      </header>
  );
}
