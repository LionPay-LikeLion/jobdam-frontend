// src/pages/PointPurchase.tsx

import React, { useState, useEffect } from "react";
import { AxiosError } from "axios";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import TopBar from "@/components/TopBar";

// 충전 옵션 정의 (추천/이벤트 표시용 필드 추가)
const chargeOptions = [
    { value: "BASIC_10000", display: "1만원 충전 (1만P)", amount: 10000, point: 10000 },
    { value: "BONUS_20000", display: "2만원 충전 (2.2만P)", amount: 22000, point: 20000 },
    { value: "BONUS_30000", display: "3만원 충전 (3만P)", amount: 33000, point: 30000 },
    { value: "BONUS_40000", display: "4만원 충전 (4만P)", amount: 45000, point: 40000 },
    { value: "PROMO_50000", display: "5만원 충전 (6만P)", amount: 60000, point: 50000, recommend: true },
    // 오픈이벤트 옵션
    { value: "EVENT_100", display: "오픈 기념! 100원 → 30만P", amount: 300000, point: 100, event: true }
];

const paymentTypeCodeId = 1;
const method = "CARD";

const usageGuidelines = [
    "결제는 안전한 이니시스를 통해 처리됩니다.",
    "충전된 포인트는 미사용시 환불 가능합니다.",
    "결제 관련 문의는 고객센터로 연락해 주세요.",
];

declare global {
    interface Window {
        IMP?: {
            init: (code: string) => void;
            request_pay: (
                param: {
                    pg: string;
                    pay_method: string;
                    merchant_uid: string;
                    name: string;
                    amount: number;
                    buyer_email: string;
                    buyer_name: string;
                },
                cb: (rsp: IamportResponse) => void
            ) => void;
        };
    }
}

interface IamportResponse {
    success: boolean;
    merchant_uid: string;
    imp_uid?: string;
    paid_amount?: number;
    error_msg?: string;
}
interface PaymentCreateResponse {
    merchantUid: string;
    amount: number;
}
interface PaymentConfirmResponse {
    status: string;
    point: number;
}
const IMP_CODE = "imp00213017"; // 실제 본인 imp 코드로 수정!

export default function PointPurchase(): JSX.Element {
    // 오픈이벤트 옵션 value를 찾아 초기값으로 사용
    const eventOption = chargeOptions.find(option => option.event);
    const [selectedOption, setSelectedOption] = useState<string | null>(eventOption ? eventOption.value : null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!window.IMP) {
            const script = document.createElement("script");
            script.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
            script.async = true;
            document.body.appendChild(script);
        }
        // 오픈이벤트 옵션이 있으면 자동 선택
        if (eventOption) {
            setSelectedOption(eventOption.value);
        }
    }, []);

    const handlePurchase = async () => {
        if (!selectedOption || !user) {
            setResult("로그인이 필요합니다.");
            return;
        }
        setLoading(true);
        setResult(null);

        let created: PaymentCreateResponse;
        try {
            const res = await api.post<PaymentCreateResponse>("/payment/create", {
                chargeOption: selectedOption,
                method,
                paymentTypeCodeId,
                buyerEmail: user.email,
                buyerName: user.name,
            });
            created = res.data;
        } catch (e) {
            const err = e as AxiosError<{ message?: string }>;
            setResult(`[주문생성 에러] ${err.response?.data?.message || err.message}`);
            setLoading(false);
            return;
        }

        if (!window.IMP) {
            alert("아임포트 스크립트 미로딩!");
            setLoading(false);
            return;
        }
        const IMP = window.IMP;
        IMP.init(IMP_CODE);

        IMP.request_pay(
            {
                pg: "html5_inicis",
                pay_method: "card",
                merchant_uid: created.merchantUid,
                name: "포인트 충전",
                amount: created.amount,
                buyer_email: user.email,
                buyer_name: user.name,
            },
            async (rsp: IamportResponse) => {
                setLoading(false);

                if (rsp.success && rsp.imp_uid) {
                    try {
                        await api.post<PaymentConfirmResponse>(
                            "/payment/confirm",
                            null,
                            {
                                params: {
                                    merchantUid: created.merchantUid,
                                    impUid: rsp.imp_uid,
                                    amount: rsp.paid_amount,
                                },
                            }
                        );
                        navigate("/payment-success");
                    } catch (error) {
                        const err = error as AxiosError<{ message?: string }>;
                        setResult(`[결제확인 에러] ${err.response?.data?.message || err.message}`);
                    }
                } else {
                    setResult(`[결제실패] ${rsp.error_msg}`);
                }
            }
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-white font-korean">
            <TopBar />
            <main className="flex-1 flex justify-center items-start py-24 bg-white">
                <div className="w-[900px] px-10 py-12 shadow-md border rounded-xl bg-white relative">
                    <h1 className="text-4xl font-bold text-black mb-2 text-center">포인트 충전</h1>
                    <p className="text-base text-black mb-8 text-center">
                        충전된 포인트는 유료 콘텐츠 이용에 사용됩니다.
                    </p>
                    {/* 금액 선택 */}
                    <section>
                        <h2 className="text-lg font-medium mb-4">충전할 금액을 선택하세요</h2>
                        <div className="flex flex-wrap gap-6 mb-4">
                            {chargeOptions.map((option) => (
                                <Card
                                    key={option.value}
                                    className={`w-[250px] h-14 cursor-pointer relative
                                        ${selectedOption === option.value ? "border-[#ff6b35] border-2" : "border-[#0000001a] border"}
                                    `}
                                    onClick={() => setSelectedOption(option.value)}
                                >
                                    <CardContent className="flex items-center justify-center h-full p-0 relative">
                                        <span className="font-medium text-black text-base text-center">
                                            {option.display}
                                        </span>
                                        {/* 추천/이벤트 배지 */}
                                        {option.recommend && (
                                            <span
                                                className="absolute -top-3 right-2 px-3 py-1 border-2 border-[#ff6b35] rounded-full text-[#ff6b35] text-xs font-bold bg-white"
                                                style={{
                                                    boxShadow: "0px 2px 8px #ff6b3530",
                                                    letterSpacing: "0.02em"
                                                }}
                                            >추천!</span>
                                        )}
                                        {option.event && (
                                            <span
                                                className="absolute -top-3 right-2 px-3 py-1 border-2 border-[#ff6b35] rounded-full text-[#ff6b35] text-xs font-bold bg-white"
                                                style={{
                                                    boxShadow: "0px 2px 8px #ff6b3530",
                                                    letterSpacing: "0.02em"
                                                }}
                                            >오픈이벤트</span>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                    <Button
                        className="w-full h-14 mt-8 bg-[#0000001a] text-[#00000080] rounded-lg font-medium text-base text-center"
                        disabled={!selectedOption || loading}
                        onClick={handlePurchase}
                    >
                        {loading ? "결제 중..." : "결제하기"}
                    </Button>
                    {result && (
                        <div
                            className="w-full mt-4 p-4 border border-[#eee] rounded-lg text-[15px] whitespace-pre-wrap"
                            style={{ background: "#f9fafd", color: result.startsWith("✅") ? "#2f80ed" : "#e62b29" }}
                        >
                            {result}
                        </div>
                    )}
                    <Card className="w-full h-[180px] mt-8 bg-[#00000005] rounded-lg">
                        <CardContent className="p-5">
                            <h3 className="font-medium text-black text-base mb-2">이용 안내</h3>
                            <ul className="space-y-4">
                                {usageGuidelines.map((guideline, index) => (
                                    <li
                                        key={index}
                                        className="font-normal text-[#000000b2] text-sm"
                                    >
                                        • {guideline}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <footer className="bg-gray-50 py-6 text-center text-sm text-gray-500">
                © 2025 돈내고사자 팀. All rights reserved.
            </footer>
        </div>
    );
}
