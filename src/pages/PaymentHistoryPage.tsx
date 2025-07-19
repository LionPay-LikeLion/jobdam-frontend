// src/pages/mypage/PaymentHistoryPage.tsx
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import MyPageLayout from "./MyPageLayout";
import { Button } from "@/components/ui/button";

interface PaymentHistoryItem {
    createdAt: string;
    amount: number;
    point: number;
    paymentStatus: "SUCCESS" | "FAILED" | "CANCELLED" | string;
    method: string;
    impUid?: string;
    merchantUid: string;
    canRefund?: boolean;
    refundReason?: string;
}

interface UserProfile {
    remainingPoints: number;
}

export default function PaymentHistoryPage() {
    const [list, setList] = useState<PaymentHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPoint, setCurrentPoint] = useState<number>(0);
    const [refundLoading, setRefundLoading] = useState<string>(""); // merchantUid

    useEffect(() => {
        api.get<UserProfile>("/user/profile").then(res => {
            setCurrentPoint(res.data.remainingPoints);
        });
    }, []);

    useEffect(() => {
        setLoading(true);
        api.get<PaymentHistoryItem[]>("/payment/history/payments")
            .then(res => {
                const sorted = [...res.data].sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setList(sorted);
            })
            .finally(() => setLoading(false));
    }, []);

    function canRefund(item: PaymentHistoryItem) {
        if (item.paymentStatus !== "SUCCESS") return false;
        if (typeof item.canRefund === "boolean") return item.canRefund;
        if (currentPoint < item.point) return false;
        return true;
    }
    function refundDisabledReason(item: PaymentHistoryItem) {
        if (item.paymentStatus === "CANCELLED") return "이미 환불";
        if (item.paymentStatus === "FAILED") return "실패";
        if (typeof item.canRefund === "boolean" && item.refundReason) return item.refundReason;
        if (currentPoint < item.point) return "포인트 부족";
        return "";
    }
    async function handleRefund(item: PaymentHistoryItem) {
        if (!window.confirm("정말 환불하시겠습니까?")) return;
        setRefundLoading(item.merchantUid);
        try {
            await api.post("/payment/cancel", {
                merchantUid: item.merchantUid,
                impUid: item.impUid,
                amount: item.amount,
                reason: "사용자 요청 환불"
            });
            alert("환불 완료!");
            const [pointRes, payRes] = await Promise.all([
                api.get<UserProfile>("/user/profile"),
                api.get<PaymentHistoryItem[]>("/payment/history/payments")
            ]);
            setCurrentPoint(pointRes.data.remainingPoints);
            setList([...payRes.data].sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ));
        } catch (e: any) {
            alert("환불 실패: " + (e?.response?.data?.message || e.message));
        }
        setRefundLoading("");
    }

    const formatDate = (iso: string) => {
        if (!iso) return "-";
        const d = new Date(iso);
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };
    const pad = (n: number) => (n < 10 ? "0" + n : n);

    const statusLabel = (s: string) => {
        switch (s) {
            case "SUCCESS":
                return <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full font-bold">성공</span>;
            case "CANCELLED":
                return <span className="text-red-500 bg-red-50 px-3 py-1 rounded-full font-bold">환불</span>;
            case "FAILED":
                return <span className="text-gray-400 bg-gray-100 px-3 py-1 rounded-full font-bold">실패</span>;
            default:
                return <span className="text-gray-400">{s}</span>;
        }
    };

    const pointCell = (item: PaymentHistoryItem) => {
        if (typeof item.point !== "number" || !item.point) return null;
        if (item.paymentStatus === "SUCCESS" && item.point > 0)
            return <span className="text-green-600 font-bold">+{item.point.toLocaleString()}P</span>;
        if (item.paymentStatus === "CANCELLED" && item.point < 0)
            return <span className="text-orange-500 font-bold">{item.point.toLocaleString()}P</span>;
        if (item.paymentStatus === "CANCELLED" && item.point > 0)
            return <span className="text-orange-500 font-bold">-{item.point.toLocaleString()}P</span>;
        if (item.paymentStatus === "SUCCESS" && item.point < 0)
            return <span className="text-orange-500 font-bold">{item.point.toLocaleString()}P</span>;
        return null;
    };

    return (
        <MyPageLayout>
            <Card className="shadow-[0px_2px_8px_#00000014]">
                <CardContent className="p-8">
                    <h2 className="font-medium text-black text-[28px] mb-8">결제 내역</h2>
                    <div className="mb-6">
                        <span className="font-bold text-[#ff6b35] text-lg">
                            현재 보유 포인트: {currentPoint?.toLocaleString() || 0} P
                        </span>
                    </div>
                    {loading ? (
                        <div>로딩중...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border rounded-xl text-center">
                                <thead>
                                <tr className="bg-gray-50">
                                    <th className="py-3 px-2">일자</th>
                                    <th className="py-3 px-2">결제금액</th>
                                    <th className="py-3 px-2">포인트변동</th>
                                    <th className="py-3 px-2">결제수단</th>
                                    <th className="py-3 px-2">상태</th>
                                    <th className="py-3 px-2">결제번호</th>
                                    <th className="py-3 px-2">환불</th>
                                </tr>
                                </thead>
                                <tbody>
                                {list.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-gray-400 py-10">내역 없음</td>
                                    </tr>
                                ) : (
                                    list.map((item, idx) => {
                                        const bgClass = idx % 2 === 0 ? "bg-white" : "bg-gray-50";
                                        return (
                                            <tr key={item.merchantUid} className={bgClass}>
                                                <td>{formatDate(item.createdAt)}</td>
                                                <td>{item.amount ? item.amount.toLocaleString() + "원" : "-"}</td>
                                                <td>
                                                    {pointCell(item)}
                                                </td>
                                                <td>{item.method || "-"}</td>
                                                <td>{statusLabel(item.paymentStatus)}</td>
                                                <td>{item.impUid || item.merchantUid}</td>
                                                <td>
                                                    <Button
                                                        size="sm"
                                                        className="rounded px-4"
                                                        variant="outline"
                                                        disabled={!canRefund(item) || refundLoading === item.merchantUid}
                                                        onClick={() => handleRefund(item)}
                                                        title={!canRefund(item) ? refundDisabledReason(item) : ""}
                                                    >
                                                        {refundLoading === item.merchantUid ? "환불중..." : "환불"}
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
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
