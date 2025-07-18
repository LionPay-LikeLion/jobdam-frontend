import React from "react";
import TopBar from "@/components/TopBar";
import { Link } from "react-router-dom";

const FindEmail = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-korean">
      <TopBar />

      <main className="flex flex-1 justify-center items-start py-24">
        <div className="w-[520px] px-10 py-16 shadow-md border rounded-xl bg-white">
          <h1 className="text-4xl font-bold text-black mb-2 text-center">이메일 찾기</h1>
          <p className="text-base text-black text-center mb-8">등록된 정보로 이메일을 찾아보세요.</p>

          <div className="mb-3">
            <label className="block text-sm text-black mb-1">이름</label>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              className="w-full h-[49px] border-2 border-[#0000001a] rounded-md px-3 text-sm placeholder-[#00000080]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm text-black mb-1">전화번호</label>
            <input
              type="text"
              placeholder="전화번호를 입력하세요"
              className="w-full h-[49px] border-2 border-[#0000001a] rounded-md px-3 text-sm placeholder-[#00000080]"
            />
          </div>

          <button className="w-full h-14 bg-black text-white rounded-md text-base mb-4">이메일 찾기</button>

          <div className="flex justify-center gap-2 text-sm">
            <span className="text-[#000000b2]">비밀번호를 잊으셨나요?</span>
            <Link to="/find-password" className="hover:underline">
              비밀번호 찾기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FindEmail;
