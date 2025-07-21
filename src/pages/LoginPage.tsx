import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TopBar from "@/components/TopBar";
import { FcGoogle } from "react-icons/fc";
import { SiKakaotalk } from "react-icons/si";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "@/lib/authApi";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useEffect } from "react";
import { googleLogin } from "@/lib/authApi";
import { useGoogleLogin } from "@react-oauth/google";
import { setTokens } from '@/lib/auth';


export default function LoginPage() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const googleRedirectLogin = useGoogleLogin({
    flow: "auth-code",
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
    onSuccess: async (codeResponse) => {
      console.log("DEBUG: Google login success", codeResponse)
      try {
        console.log("Google auth code:", codeResponse.code);

        const data = await googleLogin(codeResponse.code);
        console.log("✅ FULL BACKEND RESPONSE", JSON.stringify(data, null, 2));

        if (data.accessToken) {
          await authLogin(data.accessToken); // ✅ stores to localStorage
          setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
          console.log("✅ Token set, now navigating...");
          toast.success("Google 로그인 성공!");
          navigate("/", { replace: true });
          console.log("localStorage accessToken:", localStorage.getItem("accessToken"));
        } else {
          toast.error("Google 로그인 실패: 토큰 누락");
        }

      } catch (error) {
        console.error("Google login error:", error);
        toast.error("Google 로그인에 실패했습니다.");
      }
    },
    onError: (errorResponse) => {
      console.error("Google login failed", errorResponse);
      toast.error("Google 로그인 실패");
    },
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });
      
      // AuthContext에 사용자 정보 저장
      /*if (response.user) {
        authLogin(response.user);
      }*/
      if (response.accessToken) {
        authLogin(response.accessToken); // ✅ Same as Google login
        setTokens({ accessToken: response.accessToken, refreshToken: response.refreshToken }); // ✅ store to localStorage
      }
      
      toast.success("로그인되었습니다!");
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      
      // 에러 메시지 처리
      let errorMessage = "로그인에 실패했습니다.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white font-korean">
      <TopBar />

      <main className="flex min-h-screen justify-center items-center py-24">
        <div className="w-[520px] px-10 py-16 shadow-md border rounded-xl bg-white">
          <h1 className="text-4xl font-bold text-black mb-2 text-center">로그인</h1>
          <p className="text-base text-black mb-6 text-center">계정에 로그인하세요.</p>

          <form onSubmit={handleSubmit}>
            <label className="text-sm text-black">이메일 주소</label>
            <Input 
              name="email"
              type="email"
              className="h-[49px] mb-6" 
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
            />

            <label className="text-sm text-black">비밀번호</label>
            <Input 
              name="password"
              type="password" 
              className="h-[49px] mb-6" 
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            
            <div className="flex justify-end text-sm text-gray-500 -mt-4 mb-6">
              <Link to="/find-email" className="mr-4 hover:underline">
                이메일 찾기
              </Link>
              <Link to="/find-password" className="hover:underline">
                비밀번호 찾기
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-14 mb-6 bg-black text-white"
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300" />
            <span className="px-4 text-sm text-gray-500">또는</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <Button
            variant="outline"
            className="w-full h-14 mb-3 flex items-center justify-center gap-2 border-2 border-[#0000001a]"
            disabled={isLoading}
            onClick={() => googleRedirectLogin()}
          >
            <FcGoogle className="w-5 h-5" />
            Google 로그인
          </Button>

          <Button
            className="w-full h-14 mb-6 bg-[#fee500] text-black flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            <SiKakaotalk className="w-5 h-5" />
            카카오 로그인
          </Button>

          <p className="text-sm text-center text-gray-500">
            아직 회원이 아니신가요?{" "}
            <Link to="/signup" className="text-black font-medium cursor-pointer">
              회원가입
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}