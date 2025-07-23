import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";
import TopBar from "@/components/TopBar";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetCode, verifyPasswordResetCode, setNewPassword } from "@/lib/authApi";
import { toast } from "sonner";

const FindPassword = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Flow states
  const [step, setStep] = useState(1); // 1: 이메일 입력, 2: 인증코드 입력, 3: 새 비밀번호 설정
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  
  // Loading states
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Step 1: Send password reset code
  const handleSendCode = async () => {
    if (!email) {
      toast.error("이메일을 입력해주세요.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    setIsSendingCode(true);
    try {
      await sendPasswordResetCode(email);
      setIsCodeSent(true);
      setStep(2);
      toast.success("인증코드가 이메일로 발송되었습니다.");
    } catch (error: any) {
      console.error("Send reset code error:", error);
      let errorMessage = "인증코드 발송에 실패했습니다.";
      if (error.response?.data && typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      }
      toast.error(errorMessage);
    } finally {
      setIsSendingCode(false);
    }
  };

  // Step 2: Verify reset code
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
      const isValid = await verifyPasswordResetCode(email, verificationCode);
      if (isValid) {
        setIsCodeVerified(true);
        setStep(3);
        toast.success("인증코드가 확인되었습니다. 새 비밀번호를 설정해주세요.");
      } else {
        toast.error("인증코드가 올바르지 않습니다. 다시 확인해주세요.");
      }
    } catch (error: any) {
      console.error("Verify reset code error:", error);
      toast.error("인증 확인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsVerifyingCode(false);
    }
  };



  return (
    <div className="min-h-screen flex flex-col bg-white font-korean">
      <TopBar />
      <main className="flex flex-1 justify-center items-start py-24">
        <div className="w-[520px] px-10 py-16 shadow-md border rounded-xl bg-white">
          <h2 className="text-3xl font-bold text-center mb-2">비밀번호 찾기</h2>
          <p className="text-base text-center text-black mb-10">
            {step === 1 && "등록된 이메일로 인증코드를 받아보세요."}
            {step === 2 && "이메일로 발송된 인증코드를 입력해주세요."}
            {step === 3 && "새로운 비밀번호를 설정해주세요."}
          </p>
          

          {/* Step 1: Email Input */}
          {step === 1 && (
            <div className="mb-6">
              <label className="block text-sm text-black mb-1">이메일 주소</label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="이메일 주소를 입력하세요"
                  className="flex-1 h-[49px]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSendingCode}
                />
                <Button 
                  className="w-[121px] h-[49px] bg-black text-white"
                  onClick={handleSendCode}
                  disabled={isSendingCode}
                >
                  {isSendingCode ? "발송 중..." : "인증코드 발송"}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Verification Code Input */}
          {step === 2 && (
            <div className="mb-6">
              <label className="block text-sm text-black mb-1">인증코드 입력</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="6자리 인증코드를 입력하세요"
                  className="flex-1 h-[49px]"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  disabled={isVerifyingCode}
                  maxLength={6}
                />
                <Button 
                  className="w-[121px] h-[49px] bg-black text-white"
                  onClick={handleVerifyCode}
                  disabled={isVerifyingCode}
                >
                  {isVerifyingCode ? "확인 중..." : "확인"}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {email}로 인증코드를 발송했습니다. 스팸함도 확인해주세요.
              </p>
            </div>
          )}

          {/* Step 3: New Password Input */}
          {step === 3 && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-black mb-1">새 비밀번호</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="새 비밀번호를 입력하세요 (8자 이상)"
                    className="h-[49px] w-full"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isResetting}
                  />
                  <Eye 
                    className="w-5 h-5 text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer" 
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-black mb-1">새 비밀번호 확인</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="새 비밀번호를 다시 입력하세요"
                    className="h-[49px] w-full"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isResetting}
                  />
                  <Eye 
                    className="w-5 h-5 text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </div>
              </div>

              <Button 
                type="button"
                className="w-full h-[49px] bg-black text-white"
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  if (!newPassword || !confirmPassword) {
                    toast.error("새 비밀번호를 입력해주세요.");
                    return;
                  }

                  if (newPassword.length < 8) {
                    toast.error("비밀번호는 최소 8자 이상이어야 합니다.");
                    return;
                  }

                  if (newPassword !== confirmPassword) {
                    toast.error("비밀번호가 일치하지 않습니다.");
                    return;
                  }
                  
                  setIsResetting(true);
                  
                  try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8081/api"}/auth/password-reset/set-new-password`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        email: email,
                        code: verificationCode,
                        newPassword: newPassword
                      })
                    });
                    
                    const result = await response.text();
                    
                    if (response.ok) {
                      toast.success("비밀번호가 성공적으로 재설정되었습니다! 새 비밀번호로 로그인해주세요.");
                      setTimeout(() => {
                        navigate("/login");
                      }, 2000);
                    } else {
                      toast.error(`재설정 실패: ${result}`);
                    }
                    
                  } catch (error: any) {
                    toast.error(`네트워크 오류가 발생했습니다: ${error.message}`);
                  } finally {
                    setIsResetting(false);
                  }
                }}
                disabled={isResetting}
              >
                {isResetting ? "재설정 중..." : "비밀번호 재설정"}
              </Button>
            </div>
          )}

          <div className="text-center text-sm text-black/70">
            이미 계정이 있으신가요?{" "}
            <Link to="/login" className="font-medium text-black hover:underline">
              로그인 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FindPassword;
