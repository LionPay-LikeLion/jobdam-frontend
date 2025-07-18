// src/components/TopBar.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function TopBar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

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
      <div className="w-full flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/sns-feed")}>
          <img
            className="w-[85px] h-20 object-contain"
            alt="JobDam Logo"
            src="/images/logo.png"
          />
        </div>


        <div className="flex items-center gap-10">
          <Button
            variant="ghost"
            className="font-normal text-base"
            onClick={() => navigate("/homepage")}
          >
            소개
          </Button>
          <Button
            variant="ghost"
            className="font-normal text-base"
            onClick={() => navigate("/community")}
          >
            커뮤니티
          </Button>
          {["포인트", "마이페이지"].map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="font-normal text-base"
            >
              {item}
            </Button>
          ))}

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="font-normal text-base"
                onClick={handleLogout}
              >
                로그아웃
              </Button>
            </div>
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
    </header >
  );
}
