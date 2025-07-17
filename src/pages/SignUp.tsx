import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Eye } from "lucide-react";
import TopBar from "@/components/TopBar";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-korean">
      <TopBar />

      <main className="flex flex-1 justify-center items-start py-24">
        <div className="w-[520px] px-10 py-16 shadow-md border rounded-xl bg-white">
          <h1 className="text-4xl font-bold text-black mb-2 text-center">회원가입</h1>
          <p className="text-base text-black mb-6 text-center">새로운 계정을 만드세요.</p>

          {/* 이름 */}
          <label className="text-sm text-black">이름</label>
          <Input className="h-[49px] mb-6" placeholder="이름을 입력하세요" />

          {/* 이메일 + 중복 확인 */}
          <label className="text-sm text-black">이메일 주소</label>
          <div className="flex gap-2 mb-3">
            <Input className="h-[49px] flex-1" placeholder="이메일을 입력하세요" />
            <Button className="w-[95px] h-[49px] bg-black text-white">중복 확인</Button>
          </div>

          {/* 인증코드 발송 (비활성) */}
          <Button disabled className="w-full h-[45px] bg-[#0000004c] text-white mb-6 opacity-50">
            인증코드 발송
          </Button>

          {/* 인증코드 + 확인 */}
          <label className="text-sm text-black">인증코드 입력</label>
          <div className="flex gap-2 mb-6">
            <Input className="h-[49px] flex-1" placeholder="인증코드를 입력하세요" />
            <Button className="w-[95px] h-[49px] bg-black text-white">확인</Button>
          </div>

          {/* 비밀번호 */}
          <label className="text-sm text-black">비밀번호</label>
          <div className="relative mb-6">
            <Input type="password" className="h-[49px] w-full" placeholder="비밀번호를 입력하세요" />
            <Eye className="w-5 h-5 text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
          </div>

          {/* 비밀번호 확인 */}
          <label className="text-sm text-black">비밀번호 확인</label>
          <div className="relative mb-6">
            <Input type="password" className="h-[49px] w-full" placeholder="비밀번호를 다시 입력하세요" />
            <Eye className="w-5 h-5 text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
          </div>

          {/* 닉네임 + 중복 확인 */}
          <label className="text-sm text-black">닉네임</label>
          <div className="flex gap-2 mb-8">
            <Input className="h-[49px] flex-1" placeholder="닉네임을 입력하세요" />
            <Button className="w-[95px] h-[49px] bg-black text-white">중복 확인</Button>
          </div>

          {/* 가입하기 버튼 */}
          <Button className="w-full h-14 bg-black text-white mb-6">가입하기</Button>

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
