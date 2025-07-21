import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogin } from '@/lib/authApi';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { setTokens } from '@/lib/auth'; // ✅ ADD THIS

const GoogleRedirectHandler = () => {
  const navigate = useNavigate();
  const { authLogin } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      toast.error("구글 인증 코드가 없습니다.");
      navigate('/login');
      return;
    }

    const handleLogin = async () => {
      try {
        const { accessToken, refreshToken } = await googleLogin(code);

        if (!accessToken) {
          throw new Error("accessToken이 없습니다.");
        }

        // ✅ Step 1: Save tokens to localStorage
        setTokens({ accessToken, refreshToken });

        // ✅ Step 2: Set user in memory (e.g. context)
        authLogin(accessToken);

        toast.success("구글 로그인 성공!");
        navigate('/'); // SNS 피드로 이동
      } catch (error) {
        console.error("Google login error:", error);
        toast.error("구글 로그인 실패");
        navigate('/login');
      }
    };

    handleLogin();
  }, [navigate, authLogin]);

  return <div>로그인 처리 중입니다...</div>;
};

export default GoogleRedirectHandler;