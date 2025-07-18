// src/pages/mypage/PointHistoryPage.tsx
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import MyPageLayout from "./MyPageLayout";

interface PointHistoryItem {
    createdAt: string;
    point: number;
    paymentStatus: "SUCCESS" | "CANCELLED" | string;
    merchantUid?: string;
    description?: string;
}

export default function PointHistoryPage() {
    const [list, setList] = useState<PointHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPoint, setCurrentPoint] = useState<number>(0);

    useEffect(() => {
        api.get("/user/profile").then(res => setCurrentPoint(res.data.remainingPoints));
        api.get<PointHistoryItem[]>("/payment/history/points")
            .then(res => setList(res.data))
            .finally(() => setLoading(false));
    }, []);

    // 최신순 정렬
    const sorted = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 누적포인트 로직 (과거부터 합산)
    let cumulative = 0;
    // 누적 리스트는 인덱스 기준 최신순
    const cumulativeArr: number[] = Array(sorted.length).fill(0);
    for (let i = sorted.length - 1; i >= 0; i--) {
        const item = sorted[i];
        if (item.paymentStatus === "CANCELLED") {
            // 환불건은 변동 X, 누적 변화 없음
        } else if (item.point && item.point !== 0 && item.paymentStatus !== "FAILED") {
            cumulative += item.point;
        }
        cumulativeArr[i] = cumulative;
    }

    // 렌더할 행 생성
    const rows: JSX.Element[] = [];
    sorted.forEach((item, idx) => {
        const bgClass = idx % 2 === 0 ? "bg-white" : "bg-gray-50";

        // 1. 환불건
        if (item.paymentStatus === "CANCELLED") {
            rows.push(
                <tr key={`refund-${idx}`} className={bgClass}>
                    <td className="py-2 px-2 font-bold text-gray-400">환불처리</td>
                    <td className="py-2 px-2">0</td>
                    <td className="py-2 px-2">{cumulativeArr[idx].toLocaleString()}P</td>
                    <td className="py-2 px-2">
                        <span className="text-red-600 font-bold">환불</span>
                    </td>
                    <td className="py-2 px-2">{item.description || "-"}</td>
                </tr>
            );
            return;
        }
        // 2. 결제 실패/변동 0(환불 제외)은 렌더 X
        if (item.paymentStatus === "FAILED" || !item.point || item.point === 0) return;

        // 3. 적립/차감(일반건)
        let statusEl = null;
        if (item.point > 0) {
            statusEl = <span className="text-green-600 font-bold">적립</span>;
        } else if (item.point < 0) {
            statusEl = <span className="text-orange-500 font-bold">차감</span>;
        }

        rows.push(
            <tr key={idx} className={bgClass}>
                <td className="py-2 px-2">{formatDate(item.createdAt)}</td>
                <td className="py-2 px-2">{item.point > 0 ? "+" : "-"}{Math.abs(item.point).toLocaleString()}P</td>
                <td className="py-2 px-2">{cumulativeArr[idx].toLocaleString()}P</td>
                <td className="py-2 px-2">{statusEl}</td>
                <td className="py-2 px-2">{item.description || "-"}</td>
            </tr>
        );
    });

    function formatDate(iso: string) {
        if (!iso) return "-";
        const d = new Date(iso);
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
    function pad(n: number) { return n < 10 ? "0" + n : n; }

    return (
        <MyPageLayout>
            <Card className="shadow-[0px_2px_8px_#00000014]">
                <CardContent className="p-8">
                    <h2 className="font-medium text-black text-[28px] mb-8">포인트 관리</h2>
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
                                <tr className="bg-gray-100">
                                    <th className="py-3 px-2">일자/구분</th>
                                    <th className="py-3 px-2">포인트변동</th>
                                    <th className="py-3 px-2">누적포인트</th>
                                    <th className="py-3 px-2">상태</th>
                                    <th className="py-3 px-2">비고</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-gray-400 py-10">내역 없음</td>
                                    </tr>
                                ) : rows}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </MyPageLayout>
    );
}
