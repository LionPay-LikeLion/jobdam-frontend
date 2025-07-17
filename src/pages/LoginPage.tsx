import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TopBar from "@/components/TopBar";
import { FcGoogle } from "react-icons/fc";
import { SiKakaotalk } from "react-icons/si";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function LoginPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-white font-korean">
      <TopBar />

      <main className="flex min-h-screen justify-center items-center py-24">
        <div className="w-[520px] px-10 py-16 shadow-md border rounded-xl bg-white">
          <h1 className="text-4xl font-bold text-black mb-2 text-center">로그인</h1> {/* Added text-center */}
          <p className="text-base text-black mb-6 text-center">계정에 로그인하세요.</p> {/* Added text-center */}

          <label className="text-sm text-black">이메일 주소</label>
          <Input className="h-[49px] mb-6" placeholder="이메일을 입력하세요" />

          <label className="text-sm text-black">비밀번호</label>
          <Input type="password" className="h-[49px] mb-6" placeholder="비밀번호를 입력하세요" />
          <div className="flex justify-end text-sm text-gray-500 -mt-4 mb-6">
            <Link to="/find-email" className="mr-4 hover:underline">
              이메일 찾기
            </Link>
            <Link to="/find-password" className="hover:underline">
              비밀번호 찾기
            </Link>
          </div>

          <Button
            className="w-full h-14 mb-6 bg-black text-white"
            onClick={() => {
              // ✅ 로그인 API 연동 필요 (지금은 임시로 바로 이동)
              navigate("/");
            }}
          >
            로그인
          </Button>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300" />
            <span className="px-4 text-sm text-gray-500">또는</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <Button
            variant="outline"
            className="w-full h-14 mb-3 flex items-center justify-center gap-2 border-2 border-[#0000001a]"
          >
            <FcGoogle className="w-5 h-5" />
            Google 로그인
          </Button>

          <Button
            className="w-full h-14 mb-6 bg-[#fee500] text-black flex items-center justify-center gap-2"
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