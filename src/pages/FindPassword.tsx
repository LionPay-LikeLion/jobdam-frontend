import React from "react";
import TopBar from "@/components/TopBar"; // 경로는 프로젝트 구조에 따라 조정

const FindPassword = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-korean">
      <TopBar />
      <main className="flex flex-1 justify-center items-start py-24">
        <div className="w-[520px] px-10 py-16 shadow-md border rounded-xl bg-white">
          <h2 className="text-3xl font-bold text-center mb-2">비밀번호 찾기</h2>
          <p className="text-base text-center text-black mb-10">
            등록된 이메일로 임시 비밀번호를 받아보세요.
          </p>

          <div className="mb-4">
            <label className="block text-sm text-black mb-1">이메일 주소</label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="이메일 주소를 입력하세요"
                className="flex-1 h-[49px] border-2 border-black/10 rounded-md px-3 text-sm placeholder:text-black/50"
              />
              <button className="w-[121px] h-[49px] bg-black text-white rounded-md text-sm">
                인증코드 발송
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-black mb-1">인증코드 입력</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="인증코드를 입력하세요"
                className="flex-1 h-[49px] border-2 border-black/10 rounded-md px-3 text-sm placeholder:text-black/50"
              />
              <button className="w-[121px] h-[49px] bg-black text-white rounded-md text-sm">
                확인
              </button>
            </div>
          </div>

          <div className="text-center text-sm text-black/70">
            이미 계정이 있으신가요?{" "}
            <a href="/login" className="font-medium text-black">
              로그인 페이지로 돌아가기
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FindPassword;
