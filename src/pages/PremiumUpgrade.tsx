import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api"; // 반드시 axios 커스텀 인스턴스여야 함
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// 네비게이션 컴포넌트
const NavBar = () => {
    const navigate = useNavigate();
    return (
        <header className="flex w-full h-20 items-center justify-center gap-5 p-5 fixed top-0 left-0 right-0 bg-white shadow-[0px_0px_6px_#0000001f] z-10">
            <div className="flex w-[1440px] items-center justify-between">
                <div className="flex items-center gap-5">
                    <img
                        className="w-[85px] h-20 cursor-pointer"
                        alt="JobDam Logo"
                        src="/logo.png"
                        onClick={() => navigate("/homepage")}
                    />
                    <span
                        className="font-normal text-black text-[28px] cursor-pointer"
                        onClick={() => navigate("/homepage")}
                    >
            JobDam
          </span>
                </div>
                <div className="flex items-center gap-10">
                    <a href="#" className="font-normal text-black text-base">소개</a>
                    <a href="#" className="font-normal text-black text-base">커뮤니티</a>
                    <a href="#" className="font-normal text-black text-base">포인트</a>
                    <a href="/mypage" className="font-medium text-black text-base">마이페이지</a>
                    <a href="#" className="font-normal text-black text-base">로그아웃</a>
                    <div className="flex items-center border border-solid border-[#0000001a] rounded-md px-2 py-2 w-[200px]">
                        <Input className="border-0 shadow-none h-5 text-sm text-[#00000080] focus-visible:ring-0" placeholder="Search in site" />
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
            </div>
        </header>
    );
};

const benefits = [
    {
        emoji: "🏠",
        title: "전용 커뮤니티 생성",
        description: "프리미엄 회원은 전용 커뮤니티를 직접 만들 수 있습니다.",
    },
    {
        emoji: "📢",
        title: "피드 노출 우선순위",
        description: "프리미엄 회원의 글이 더 많은 사용자에게 먼저 노출됩니다.",
    },
    {
        emoji: "✏",
        title: "게시글 무제한 작성",
        description: "게시글 작성 횟수에 제한이 없습니다.",
    },
    {
        emoji: "🎁",
        title: "북마크 무제한",
        description: "북마크 횟수에 제한이 없습니다.",
    },
];

const PremiumUpgrade = (): JSX.Element => {
    const [planType, setPlanType] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
    const [loading, setLoading] = useState(false);
    const [resultMsg, setResultMsg] = useState<string | null>(null);
    const navigate = useNavigate();

    const handlePlanChange = (value: string) => {
        if (value === "monthly") setPlanType("MONTHLY");
        else if (value === "yearly") setPlanType("YEARLY");
    };

    // 프리미엄 업그레이드 API 호출
    const handleUpgrade = async () => {
        setLoading(true);
        setResultMsg(null);
        try {
            await api.post("/user/subscription/upgrade", { planType });
            setResultMsg("🎉 프리미엄 회원 업그레이드가 완료되었습니다.");
            setTimeout(() => navigate("/mypage"), 1200);
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
        <div className="bg-white flex flex-row justify-center w-full min-h-screen">
            <NavBar />
            <div className="bg-white w-full max-w-[1440px] pt-[139px] flex flex-col items-center mx-auto">
                <h1 className="font-bold text-black text-[40px] mb-8 text-center">프리미엄 회원 업그레이드</h1>

                {/* 프리미엄 혜택 */}
                <div className="w-full px-[120px]">
                    <h2 className="font-medium text-black text-[28px]">프리미엄 회원 혜택</h2>
                    <p className="font-normal text-[#000000b2] text-lg mt-[10px]">
                        프리미엄 회원으로 업그레이드하면 다음과 같은 기능을 사용할 수 있습니다.
                    </p>
                    <div className="grid grid-cols-2 gap-6 mt-[57px]">
                        {benefits.map((benefit, index) => (
                            <Card
                                key={index}
                                className="h-[126px] rounded-xl border border-solid border-[#0000001a] shadow-[0px_2px_8px_#00000014]"
                            >
                                <CardContent className="p-8 flex items-start">
                  <span className="font-normal text-black text-[32px] leading-10">
                    {benefit.emoji}
                  </span>
                                    <div className="ml-8">
                                        <h3 className="font-medium text-black text-xl">{benefit.title}</h3>
                                        <p className="font-normal text-[#000000b2] text-base mt-2">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* 요금제 선택 */}
                <div className="w-full px-[120px] mt-[80px]">
                    <h2 className="font-medium text-black text-[28px]">요금제 선택</h2>
                    <RadioGroup
                        defaultValue="monthly"
                        className="grid grid-cols-2 gap-6 mt-[25px]"
                        onValueChange={handlePlanChange}
                    >
                        <div className="relative">
                            <Card className={`w-[588px] h-[163px] rounded-xl border-2 ${planType === "MONTHLY" ? "border-[#ff6b35]" : "border-[#0000001a]"}`}>
                                <CardContent className="p-8 flex items-start">
                                    <RadioGroupItem
                                        value="monthly"
                                        id="monthly"
                                        checked={planType === "MONTHLY"}
                                        onChange={() => setPlanType("MONTHLY")}
                                        className="mt-[6px] border-2 border-solid border-[#ff6b35]"
                                    />
                                    <div className="ml-5">
                                        <h3 className="font-medium text-black text-xl">월간 플랜</h3>
                                        <div className="flex items-center mt-2">
                                            <span className="font-semibold text-black text-2xl">9,900P</span>
                                            <span className="font-normal text-[#000000b2] text-base ml-1">/ 월</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="relative">
                            <Badge className="absolute right-[22px] top-0 bg-[#ff6b35] z-10 rounded-[20px] h-6 px-2">
                                추천
                            </Badge>
                            <Card className={`w-[588px] h-[163px] rounded-xl border-2 ${planType === "YEARLY" ? "border-[#ff6b35]" : "border-[#0000001a]"}`}>
                                <CardContent className="p-8 flex items-start">
                                    <RadioGroupItem
                                        value="yearly"
                                        id="yearly"
                                        checked={planType === "YEARLY"}
                                        onChange={() => setPlanType("YEARLY")}
                                        className="mt-[6px] border-2 border-solid border-[#ff6b35]"
                                    />
                                    <div className="ml-5">
                                        <h3 className="font-medium text-black text-xl">연간 플랜</h3>
                                        <div className="flex items-center mt-2">
                                            <span className="font-semibold text-black text-2xl">99,000P</span>
                                            <span className="font-normal text-[#000000b2] text-base ml-1">/ 년</span>
                                        </div>
                                        <p className="font-normal text-[#000000b2] text-sm mt-3">
                                            월 8,250P (17% 할인)
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </RadioGroup>

                    <div className="flex flex-col items-center mt-[60px] mb-[56px]">
                        <p className="font-normal text-[#000000b2] text-sm">포인트로 결제됩니다.</p>
                        <Button
                            className="w-[283px] h-14 mt-[52px] bg-black rounded-lg text-white text-lg"
                            onClick={handleUpgrade}
                            disabled={loading}
                        >
                            {loading ? "업그레이드 중..." : "프리미엄 회원 업그레이드"}
                        </Button>
                        {resultMsg && (
                            <div className="mt-4 text-base text-center" style={{ color: resultMsg.startsWith("🎉") ? "#2ecc40" : "#e53e3e" }}>
                                {resultMsg}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumUpgrade;
