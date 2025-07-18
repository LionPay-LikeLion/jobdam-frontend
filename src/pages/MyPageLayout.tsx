// src/pages/mypage/MyPageLayout.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import TopBar from "@/components/TopBar";

const tabs = [
    { label: "내 계정 정보", path: "/mypage" },
    { label: "결제 내역", path: "/mypage/payments" },
    { label: "포인트 관리", path: "/mypage/points" },
    { label: "활동 내역", path: "/mypage/activity" },
];

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="bg-white flex flex-row justify-center w-full min-h-screen">
            <div className="bg-white w-[1440px] relative min-h-screen">
                <TopBar />
                <div className="flex gap-6 mt-[119px] px-[60px]">
                    {/* 사이드바 */}
                    <Card className="w-[246px] h-fit">
                        <CardContent className="p-0 h-full relative">
                            {tabs.map((tab, i) => (
                                <button
                                    key={tab.path}
                                    onClick={() => navigate(tab.path)}
                                    className={`block w-full px-6 py-3 text-left rounded-md font-normal text-base ${
                                        location.pathname === tab.path
                                            ? "bg-black text-white mt-[9px] mx-[9px]"
                                            : "text-black"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </CardContent>
                    </Card>
                    {/* 메인 영역 */}
                    <div className="flex-1">{children}</div>
                </div>
            </div>
        </div>
    );
}
