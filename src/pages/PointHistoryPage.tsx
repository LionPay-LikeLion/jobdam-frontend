// src/pages/mypage/PointHistoryPage.tsx
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MyPageLayout from "./MyPageLayout";
import { useNavigate } from "react-router-dom";

interface PointHistoryItem {
    paymentId: number;
    point: number;
    amount: number;
    paymentTypeCodeId: number;
    paymentStatusCodeId: number;
    paymentStatus: string;
    method: string;
    createdAt: string;
    impUid: string;
    merchantUid: string;
    cumulativePoint: number;
    statusColor: string;
    statusLabel: string;
}

// 결제 타입 코드에 따른 한글 이름
const getPaymentTypeName = (paymentTypeCodeId: number): string => {
    switch (paymentTypeCodeId) {
        case 1: return "포인트 충전";
        case 2: return "커뮤니티 구독";
        case 3: return "유저 등급 업그레이드";
        case 4: return "커뮤니티 등급 업그레이드";
        case 5: return "환불";
        default: return "기타";
    }
};

export default function PointHistoryPage() {
    const [list, setList] = useState<PointHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPoint, setCurrentPoint] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/user/profile").then(res => setCurrentPoint(res.data.remainingPoints));
        api.get<PointHistoryItem[]>("/payment/history/points")
            .then(res => setList(res.data))
            .finally(() => setLoading(false));
    }, []);

    // 최신순 정렬
    const sorted = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    function formatDate(iso: string) {
        if (!iso) return "-";
        const d = new Date(iso);
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }
    
    function pad(n: number) { 
        return n < 10 ? "0" + n : n; 
    }

    const handleChargePoints = () => {
        navigate("/point-purchase");
    };

    return (
        <MyPageLayout>
            <Card className="shadow-[0px_2px_8px_#00000014]">
                <CardContent className="p-8">
                    <h2 className="font-medium text-black text-[28px] mb-8">포인트 관리</h2>
                    
                    {/* 현재 포인트 섹션 */}
                    <div className="mb-8">
                        <div className="text-black text-lg mb-2">보유 포인트</div>
                        <div className="text-[#ff6b35] text-3xl font-bold mb-2">
                            {currentPoint?.toLocaleString() || 0} P
                        </div>
                        <div className="text-black text-sm">
                            현재 사용 가능한 포인트입니다
                        </div>
                    </div>

                    {/* 포인트 충전하기 버튼 */}
                    <div className="mb-8">
                        <Button 
                            className="h-12 bg-black hover:bg-black/90 text-white font-normal text-base px-8"
                            onClick={handleChargePoints}
                        >
                            포인트 충전하기
                        </Button>
                    </div>

                    {/* 포인트 사용 내역 */}
                    <div className="mb-6">
                        <h3 className="font-medium text-black text-lg mb-4">포인트 사용 내역</h3>
                    </div>
                    
                    {loading ? (
                        <div>로딩중...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border rounded-xl text-center">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-3 px-4">일자</th>
                                    <th className="py-3 px-4">포인트변동</th>
                                    <th className="py-3 px-4">내역</th>
                                </tr>
                                </thead>
                                <tbody>
                                {sorted.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="text-gray-400 py-10">내역 없음</td>
                                    </tr>
                                ) : (
                                    sorted.map((item, idx) => {
                                        const bgClass = idx % 2 === 0 ? "bg-white" : "bg-gray-50";
                                        const pointColor = item.point > 0 ? "text-green-600" : item.point < 0 ? "text-red-600" : "text-gray-500";
                                        
                                        return (
                                            <tr key={item.paymentId} className={bgClass}>
                                                <td className="py-3 px-4">{formatDate(item.createdAt)}</td>
                                                <td className={`py-3 px-4 font-medium ${pointColor}`}>
                                                    {item.point > 0 ? "+" : ""}{item.point.toLocaleString()} P
                                                </td>
                                                <td className="py-3 px-4">{getPaymentTypeName(item.paymentTypeCodeId)}</td>
                                            </tr>
                                        );
                                    })
                                )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </MyPageLayout>
    );
}
