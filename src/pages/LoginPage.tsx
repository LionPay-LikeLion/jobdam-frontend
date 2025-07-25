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
import { googleLogin, kakaoLogin } from "@/lib/authApi";
import { useGoogleLogin } from "@react-oauth/google";
import { setTokens } from '@/lib/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: authLogin, refreshUserInfo } = useAuth();

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

  const handleKakaoLogin = () => {
    const kakaoClientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
    const kakaoRedirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
    
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${kakaoRedirectUri}&response_type=code&scope=profile_nickname,profile_image,account_email`;
    
    window.location.href = kakaoAuthUrl;
  };

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

      if (response.accessToken) {
        await authLogin(response.accessToken); // 토큰 저장
        setTokens({ accessToken: response.accessToken, refreshToken: response.refreshToken });
        await refreshUserInfo(); // ✅ user 정보 새로고침!
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
      <main
        className="flex flex-col h-screen justify-center items-center"
        style={{
          backgroundImage: "url('/images/landing-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Mobile Layout */}
        <div className="md:hidden w-[98vw] h-[95vh] flex flex-col justify-center items-center relative">
          {/* Mobile Glass-morphism Login Overlay */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl"></div>
          <div className="relative z-10 w-full max-w-[350px] mx-auto px-6 py-8 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg">
            <div className="text-center mb-8">
              <img
                className="w-[120px] h-[120px] object-contain mb-4 mx-auto"
                alt="JobDam Logo"
                src="/images/logo.png"
              />
              <h2 className="text-xl font-bold text-white mb-2">취업은 더 이상<br />혼자 준비하는 싸움이 아닙니다.</h2>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-white mb-2 text-center">로그인</h1>
              <p className="text-base text-white/90 mb-6 text-center">계정에 로그인하세요.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-white/90 block mb-1">이메일 주소</label>
                  <Input
                    name="email"
                    type="email"
                    className="h-[49px] bg-white/90 border-white/30"
                    placeholder="이메일을 입력하세요"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="text-sm text-white/90 block mb-1">비밀번호</label>
                  <Input
                    name="password"
                    type="password"
                    className="h-[49px] bg-white/90 border-white/30"
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex justify-end text-sm text-white/80">
                  <Link to="/find-password" className="hover:underline">
                    비밀번호 찾기
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 bg-black/80 text-white hover:bg-black/90"
                  disabled={isLoading}
                >
                  {isLoading ? "로그인 중..." : "로그인"}
                </Button>
              </form>

              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-white/30" />
                <span className="px-4 text-sm text-white/80">또는</span>
                <div className="flex-grow border-t border-white/30" />
              </div>

              <Button
                variant="outline"
                className="w-full h-14 mb-3 flex items-center justify-center gap-2 bg-white/90 border-white/30 text-black"
                disabled={isLoading}
                onClick={() => googleRedirectLogin()}
              >
                <FcGoogle className="w-5 h-5" />
                Google 로그인
              </Button>

              <Button
                className="w-full h-14 mb-4 bg-[#fee500] text-black flex items-center justify-center gap-2"
                disabled={isLoading}
                onClick={handleKakaoLogin}
              >
                <SiKakaotalk className="w-5 h-5" />
                카카오 로그인
              </Button>

              <p className="text-sm text-center text-white/90">
                아직 회원이 아니신가요?{" "}
                <Link to="/signup" className="text-white font-medium cursor-pointer hover:underline">
                  회원가입
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex w-[95vw] max-w-[1100px] min-h-[500px] shadow-xl border rounded-2xl bg-white mx-auto">
          {/* 좌측 이미지 및 문구 */}
          <div
            className="flex-1 flex flex-col items-center justify-start p-10 pt-[8%] bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg m-6"
            style={{
              backgroundImage: "url('/images/landing-bg2.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <img
              className="w-[160px] h-[160px] object-contain mb-6"
              alt="JobDam Logo"
              src="/images/logo.png"
            />
            <h2 className="text-3xl font-bold text-black mb-2 text-center">취업은 더 이상<br />혼자 준비하는 싸움이 아닙니다.</h2>
          </div>

          {/* 우측 로그인 폼 */}
          <div className="flex-1 flex flex-col items-center justify-center px-10 py-8">
            <div className="w-full max-w-[320px] flex flex-col justify-center my-auto">
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
                onClick={handleKakaoLogin}
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
          </div>
        </div>

        {/* Footer (카드 하단) */}
        <footer className="py-6 text-center text-sm text-white font-bold bg-transparent w-full flex flex-col items-center gap-2">
          <div className="flex gap-4 justify-center">
            <a href="https://jobdams.online/terms" target="_blank" rel="noopener noreferrer" className="hover:underline">이용약관</a>
            <span>|</span>
            <a href="https://jobdams.online/privacy" target="_blank" rel="noopener noreferrer" className="hover:underline">개인정보처리방침</a>
          </div>
          <div>© 2025 돈내고사자 팀. All rights reserved.</div>
        </footer>
      </main>
    </div>
  );
}