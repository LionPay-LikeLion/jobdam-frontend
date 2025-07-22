import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { kakaoLogin } from '@/lib/authApi';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { setTokens } from '@/lib/auth';

const KakaoRedirectHandler = () => {
  const navigate = useNavigate();
  const { authLogin } = useAuth();
  const hasExecuted = useRef(false);

  useEffect(() => {
    // Prevent double execution completely
    if (hasExecuted.current) return;
    hasExecuted.current = true;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      toast.error("카카오 인증 코드가 없습니다.");
      navigate('/login');
      return;
    }

    const handleLogin = async () => {
      try {
        const { accessToken, refreshToken } = await kakaoLogin(code);

        if (!accessToken) {
          throw new Error("accessToken이 없습니다.");
        }

        // Step 1: Save tokens to localStorage
        setTokens({ accessToken, refreshToken });

        // Step 2: Set user in memory (e.g. context)
        await authLogin({ accessToken, refreshToken });

        toast.success("카카오 로그인 성공!");
        navigate('/'); // SNS 피드로 이동
      } catch (error) {
        console.error("Kakao login error:", error);
        toast.error("카카오 로그인 실패");
        navigate('/login');
      }
    };

    handleLogin();
  }, []);

  return <div>로그인 처리 중입니다...</div>;
};

export default KakaoRedirectHandler;