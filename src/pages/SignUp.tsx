import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Eye } from "lucide-react";
import TopBar from "@/components/TopBar";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { register, checkEmail, checkNickname, sendVerificationCode, verifyEmailCode } from "@/lib/authApi";
import { toast } from "sonner";

export default function SignUp() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // 중복 확인 상태
  const [emailChecked, setEmailChecked] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  
  // 이메일 인증 상태
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [registrationCompleted, setRegistrationCompleted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 입력값이 변경되면 중복 확인 상태 초기화
    if (name === 'email') {
      setEmailChecked(false);
      setEmailVerified(false);
      setIsVerificationSent(false);
      setVerificationCode("");
    }
    if (name === 'nickname') {
      setNicknameChecked(false);
    }
  };

  // 이메일 중복 확인
  const handleCheckEmail = async () => {
    if (!formData.email) {
      toast.error("이메일을 입력해주세요.");
      return;
    }

    setIsCheckingEmail(true);
    try {
      const exists = await checkEmail(formData.email);
      console.log('Email exists:', exists);
      
      // 백엔드에서 true = 이미 존재함, false = 사용 가능
      if (!exists) {
        toast.success("사용 가능한 이메일입니다.");
        setEmailChecked(true);
      } else {
        toast.error("이미 사용 중인 이메일입니다.");
        setEmailChecked(false);
      }
    } catch (error: any) {
      console.error("Email check error:", error);
      
      // 네트워크 오류 등
      if (error.response?.status === 404) {
        toast.error("이메일 확인 API를 찾을 수 없습니다.");
      } else if (error.response?.status === 500) {
        toast.error("서버 오류가 발생했습니다.");
      } else {
        toast.error("이메일 확인 중 오류가 발생했습니다.");
      }
      setEmailChecked(false);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    if (!formData.nickname) {
      toast.error("닉네임을 입력해주세요.");
      return;
    }

    if (formData.nickname.length < 2 || formData.nickname.length > 20) {
      toast.error("닉네임은 2자 이상 20자 이하여야 합니다.");
      return;
    }

    setIsCheckingNickname(true);
    try {
      const exists = await checkNickname(formData.nickname);
      console.log('Nickname exists:', exists);
      
      // 백엔드에서 true = 이미 존재함, false = 사용 가능
      if (!exists) {
        toast.success("사용 가능한 닉네임입니다.");
        setNicknameChecked(true);
      } else {
        toast.error("이미 사용 중인 닉네임입니다.");
        setNicknameChecked(false);
      }
    } catch (error: any) {
      console.error("Nickname check error:", error);
      
      // 네트워크 오류 등
      if (error.response?.status === 404) {
        toast.error("닉네임 확인 API를 찾을 수 없습니다.");
      } else if (error.response?.status === 500) {
        toast.error("서버 오류가 발생했습니다.");
      } else {
        toast.error("닉네임 확인 중 오류가 발생했습니다.");
      }
      setNicknameChecked(false);
    } finally {
      setIsCheckingNickname(false);
    }
  };

  // 이메일 인증코드 발송
  const handleSendVerification = async () => {
    if (!formData.email) {
      toast.error("이메일을 입력해주세요.");
      return;
    }

    if (!emailChecked) {
      toast.error("먼저 이메일 중복 확인을 해주세요.");
      return;
    }

    setIsSendingVerification(true);
    try {
      await sendVerificationCode(formData.email);
      setIsVerificationSent(true);
      toast.success("인증코드가 이메일로 발송되었습니다.");
    } catch (error: any) {
      console.error("Send verification error:", error);
      toast.error("인증코드 발송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSendingVerification(false);
    }
  };

  // 이메일 인증코드 확인
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast.error("인증코드를 입력해주세요.");
      return;
    }

    if (verificationCode.length !== 6) {
      toast.error("인증코드는 6자리 숫자입니다.");
      return;
    }

    setIsVerifyingCode(true);
    try {
      const isValid = await verifyEmailCode(formData.email, verificationCode);
      if (isValid) {
        setEmailVerified(true);
        toast.success("이메일 인증이 완료되었습니다!");
      } else {
        toast.error("인증코드가 올바르지 않습니다. 다시 확인해주세요.");
      }
    } catch (error: any) {
      console.error("Verify code error:", error);
      toast.error("인증 확인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!formData.email || !formData.password || !formData.nickname) {
      toast.error("필수 필드를 모두 입력해주세요.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    if (formData.nickname.length < 2 || formData.nickname.length > 20) {
      toast.error("닉네임은 2자 이상 20자 이하여야 합니다.");
      return;
    }

    // 중복 확인 검사
    if (!emailChecked) {
      toast.error("이메일 중복 확인을 해주세요.");
      return;
    }

    // 이메일 인증 확인
    if (!emailVerified) {
      toast.error("이메일 인증을 완료해주세요.");
      return;
    }

    if (!nicknameChecked) {
      toast.error("닉네임 중복 확인을 해주세요.");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await register({
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
        phone: formData.phone || undefined,
      });
      
      setRegistrationCompleted(true);
      toast.success("회원가입이 완료되었습니다! 이제 로그인할 수 있습니다.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Register error:", error);
      
      let errorMessage = "회원가입에 실패했습니다.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-korean">
      <TopBar />

      <main className="flex flex-1 justify-center items-start py-24">
        <div className="w-[520px] px-10 py-16 shadow-md border rounded-xl bg-white">
          <h1 className="text-4xl font-bold text-black mb-2 text-center">회원가입</h1>
          <p className="text-base text-black mb-6 text-center">새로운 계정을 만드세요.</p>

          <form onSubmit={handleSubmit}>
            {/* 이메일 + 중복 확인 */}
            <label className="text-sm text-black">이메일 주소</label>
            <div className="flex gap-2 mb-6">
              <Input 
                name="email"
                type="email"
                className="h-[49px] flex-1" 
                placeholder="이메일을 입력하세요"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <Button 
                type="button"
                className="w-[95px] h-[49px] bg-black text-white"
                onClick={handleCheckEmail}
                disabled={isCheckingEmail || isLoading}
              >
                {isCheckingEmail ? "확인 중..." : "중복 확인"}
              </Button>
            </div>

            {/* 이메일 인증 섹션 */}
            {emailChecked && !emailVerified && (
              <div className="mb-6">
                <label className="text-sm text-black">이메일 인증</label>
                <div className="flex gap-2 mb-2">
                  <Button 
                    type="button"
                    className="w-full h-[49px] bg-blue-600 text-white hover:bg-blue-700"
                    onClick={handleSendVerification}
                    disabled={isSendingVerification || isLoading}
                  >
                    {isSendingVerification ? "발송 중..." : "인증코드 발송"}
                  </Button>
                </div>
                
                {isVerificationSent && (
                  <div className="flex gap-2">
                    <Input 
                      type="text"
                      className="h-[49px] flex-1" 
                      placeholder="6자리 인증코드를 입력하세요"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      disabled={isLoading || emailVerified}
                      maxLength={6}
                    />
                    <Button 
                      type="button"
                      className="w-[95px] h-[49px] bg-green-600 text-white hover:bg-green-700"
                      onClick={handleVerifyCode}
                      disabled={isVerifyingCode || isLoading || emailVerified}
                    >
                      {isVerifyingCode ? "확인 중..." : "인증 확인"}
                    </Button>
                  </div>
                )}
                
                {isVerificationSent && (
                  <p className="text-xs text-gray-500 mt-1">
                    인증코드를 받지 못하셨나요? 스팸함도 확인해주세요.
                  </p>
                )}
              </div>
            )}

            {/* 이메일 인증 완료 표시 */}
            {emailVerified && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-700 font-medium">✓ 이메일 인증이 완료되었습니다!</p>
              </div>
            )}

            {/* 비밀번호 */}
            <label className="text-sm text-black">비밀번호</label>
            <div className="relative mb-6">
              <Input 
                name="password"
                type={showPassword ? "text" : "password"}
                className="h-[49px] w-full" 
                placeholder="비밀번호를 입력하세요 (8자 이상)"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <Eye 
                className="w-5 h-5 text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer" 
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            {/* 비밀번호 확인 */}
            <label className="text-sm text-black">비밀번호 확인</label>
            <div className="relative mb-6">
              <Input 
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="h-[49px] w-full" 
                placeholder="비밀번호를 다시 입력하세요"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <Eye 
                className="w-5 h-5 text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>

            {/* 닉네임 + 중복 확인 */}
            <label className="text-sm text-black">닉네임</label>
            <div className="flex gap-2 mb-6">
              <Input 
                name="nickname"
                className="h-[49px] flex-1" 
                placeholder="닉네임을 입력하세요 (2~20자)"
                value={formData.nickname}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <Button 
                type="button"
                className="w-[95px] h-[49px] bg-black text-white"
                onClick={handleCheckNickname}
                disabled={isCheckingNickname || isLoading}
              >
                {isCheckingNickname ? "확인 중..." : "중복 확인"}
              </Button>
            </div>

            {/* 전화번호 (선택사항) */}
            <label className="text-sm text-black">전화번호 (선택사항)</label>
            <Input 
              name="phone"
              type="tel"
              className="h-[49px] mb-8" 
              placeholder="전화번호를 입력하세요"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={isLoading}
            />

            {/* 가입하기 버튼 */}
            <Button 
              type="submit"
              className="w-full h-14 bg-black text-white mb-6"
              disabled={isLoading}
            >
              {isLoading ? "가입 중..." : "가입하기"}
            </Button>
          </form>

          {/* 로그인 링크 */}
          <p className="text-sm text-center text-gray-500">
            이미 계정이 있으신가요?{" "}
            <Link to="/login" className="[font-family:'Roboto-Medium',Helvetica] font-medium text-black text-sm text-center tracking-[0] leading-[21px] cursor-pointer">
              로그인
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
