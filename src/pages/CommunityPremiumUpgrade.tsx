import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// 커스텀 라디오버튼
const CustomRadio = ({ checked }: { checked: boolean }) => (
    <span
        className={`inline-block w-6 h-6 rounded-full border-2 mr-4 align-middle relative
      ${checked ? "border-[#ff6b35]" : "border-[#d6d6d6]"}`}>
        {checked && (
            <span className="block w-3 h-3 rounded-full bg-[#ff6b35] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
    </span>
);

const communityBenefits = [
    { emoji: "👥", title: "가입 인원 제한 100명", description: "프리미엄 커뮤니티는 최대 100명까지 가입할 수 있습니다." },
    { emoji: "🗄️", title: "게시판 무제한 생성", description: "커뮤니티 내에서 게시판을 무제한으로 생성할 수 있습니다." },
];

const CommunityPremiumUpgrade = (): JSX.Element => {
    const { id: communityId } = useParams();
    const [planType, setPlanType] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
    const [loading, setLoading] = useState(false);
    const [resultMsg, setResultMsg] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleUpgrade = async () => {
        if (!communityId) {
            setResultMsg("❌ 커뮤니티 ID를 찾을 수 없습니다.");
            return;
        }

        setLoading(true);
        setResultMsg(null);
        try {
            await api.post("/communities/upgrade", {
                communityId: Number(communityId),
                planType
            });
            setResultMsg("🎉 프리미엄 커뮤니티 업그레이드가 완료되었습니다.");
            setTimeout(() => navigate("/communities"), 1200);
        } catch (err: any) {
            setResultMsg(
                err?.response?.data?.message
                    ? `❌ ${err.response.data.message}`
                    : "❌ 업그레이드 실패. 포인트가 부족할 수 있습니다."
            );
        }
        setLoading(false);
    };

    return (
        <div className="bg-white min-h-screen w-full flex flex-col">
            {/* 중앙정렬 전체 wrapper */}
            <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col items-center pt-12 px-4">
                {/* 타이틀 */}
                <h1 className="font-bold text-black text-[2.5rem] sm:text-[2.8rem] mb-8 text-center">
                    프리미엄 커뮤니티 업그레이드
                </h1>

                {/* 프리미엄 커뮤니티 혜택 */}
                <section className="w-full flex flex-col items-center mb-20">
                    <h2 className="font-medium text-black text-2xl sm:text-[28px]">프리미엄 커뮤니티 혜택</h2>
                    <p className="font-normal text-[#000000b2] text-lg mt-2 mb-10 text-center">
                        프리미엄 커뮤니티로 업그레이드하면 다음과 같은 기능을 사용할 수 있습니다.
                    </p>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                        {communityBenefits.map((benefit, idx) => (
                            <Card
                                key={idx}
                                className="h-[126px] rounded-xl border border-solid border-[#0000001a] shadow-[0px_2px_8px_#00000014] flex-1"
                            >
                                <CardContent className="p-8 flex justify-center items-center h-full">
                                    <span className="font-normal text-black text-[32px] leading-10">{benefit.emoji}</span>
                                    <div className="flex flex-col ml-8">
                                        <h3 className="font-medium text-black text-xl">{benefit.title}</h3>
                                        <p className="font-normal text-[#000000b2] text-base mt-2">{benefit.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* 요금제 선택 */}
                <section className="w-full flex flex-col items-center mb-20">
                    <h2 className="font-medium text-black text-2xl sm:text-[28px] mb-8">요금제 선택</h2>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 월간 플랜 카드 */}
                        <div
                            className={`relative cursor-pointer transition-all flex items-stretch
                ${planType === "MONTHLY" ? "border-2 border-[#ff6b35]" : "border-2 border-[#e0e0e0]"}
                rounded-xl w-full h-[180px] bg-white`}
                            onClick={() => setPlanType("MONTHLY")}
                            tabIndex={0}
                            role="button"
                            aria-pressed={planType === "MONTHLY"}
                            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setPlanType("MONTHLY"); }}
                        >
                            <CardContent className="flex flex-col justify-center h-full pl-12">
                                <div className="flex items-center mb-4">
                                    <CustomRadio checked={planType === "MONTHLY"} />
                                    <span className="font-medium text-black text-[22px]">월간 플랜</span>
                                </div>
                                <div className="flex items-end">
                                    <span className="font-bold text-black text-[28px] mr-2">10,000P</span>
                                    <span className="font-normal text-[#000000b2] text-base mb-1">/ 월</span>
                                </div>
                            </CardContent>
                        </div>
                        {/* 연간 플랜 카드 */}
                        <div
                            className={`relative cursor-pointer transition-all flex items-stretch
                ${planType === "YEARLY" ? "border-2 border-[#ff6b35]" : "border-2 border-[#e0e0e0]"}
                rounded-xl w-full h-[180px] bg-white`}
                            onClick={() => setPlanType("YEARLY")}
                            tabIndex={0}
                            role="button"
                            aria-pressed={planType === "YEARLY"}
                            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setPlanType("YEARLY"); }}
                        >
                            <Badge className="absolute right-[22px] top-4 bg-[#ff6b35] z-10 rounded-[20px] h-6 px-2 text-white text-xs flex items-center">
                                추천
                            </Badge>
                            <CardContent className="flex flex-col justify-center h-full pl-12">
                                <div className="flex items-center mb-4">
                                    <CustomRadio checked={planType === "YEARLY"} />
                                    <span className="font-medium text-black text-[22px]">연간 플랜</span>
                                </div>
                                <div className="flex items-end">
                                    <span className="font-bold text-black text-[28px] mr-2">100,000P</span>
                                    <span className="font-normal text-[#000000b2] text-base mb-1">/ 년</span>
                                </div>
                                <span className="font-normal text-[#000000b2] text-sm mt-2">월 8,333P (17% 할인)</span>
                            </CardContent>
                        </div>
                    </div>
                </section>

                {/* 안내 및 버튼 */}
                <div className="flex flex-col items-center mt-1 mb-1 w-full">
                    <p className="font-normal text-[#000000b2] text-sm">포인트로 결제됩니다.</p>
                    <Button
                        className="w-[283px] h-14 mt-8 bg-black rounded-lg text-white text-lg"
                        onClick={handleUpgrade}
                        disabled={loading}
                    >
                        {loading ? "업그레이드 중..." : "프리미엄 커뮤니티 업그레이드"}
                    </Button>
                    {resultMsg && (
                        <div className="mt-4 text-base text-center" style={{ color: resultMsg.startsWith("🎉") ? "#2ecc40" : "#e53e3e" }}>
                            {resultMsg}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CommunityPremiumUpgrade; 