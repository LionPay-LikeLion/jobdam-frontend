import React, { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import AdminSideBar from "@/components/AdminSideBar";
import api from "@/lib/api";
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

type DailyStat = {
    date?: string; // 일별
    month?: string; // 월별
    cardSales: number;
    cardRefunds: number;
    netSales: number;
    totalOrders: number;
    avgAmount: number;
};

const TABS = [
    { key: "daily", label: "일별 카드 매출" },
    { key: "monthly", label: "월별 카드 매출" },
    { key: "dailyTotal", label: "일별 전체 매출" },
    { key: "monthlyTotal", label: "월별 전체 매출" }
] as const;

const ENDPOINTS: Record<string, string> = {
    daily: "/sales/daily",
    monthly: "/sales/monthly",
    dailyTotal: "/sales/daily/total",
    monthlyTotal: "/sales/monthly/total"
};

type TabKey = (typeof TABS)[number]["key"];

export default function AdminSalesStatsPage() {
    const [tab, setTab] = useState<TabKey>("daily");
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<DailyStat[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        api.get(ENDPOINTS[tab])
            .then(res => setStats(res.data))
            .catch(() => setError("데이터를 불러오지 못했습니다."))
            .finally(() => setLoading(false));
    }, [tab]);

    const xKey = tab.includes("monthly") ? "month" : "date";

    // 안전하게 number 처리
    const chartData = stats.map(row => ({
        ...row,
        cardSales: Number(row.cardSales ?? 0),
        cardRefunds: Number(row.cardRefunds ?? 0),
        netSales: Number(row.netSales ?? 0),
        totalOrders: Number(row.totalOrders ?? 0),
        avgAmount: Number(row.avgAmount ?? 0),
    }));

    // 컬러 팔레트
    const COLOR_CARD_SALES = "#2563eb";
    const COLOR_CARD_REFUNDS = "#ef4444";
    const COLOR_NET_SALES = "#14b8a6";

    return (
        <div className="min-h-screen flex flex-col bg-white font-korean">
            <TopBar />
            <main className="flex flex-row justify-center w-full pt-12 pb-16">
                <div className="flex w-full max-w-[1500px] gap-12">
                    <aside className="w-[220px] flex-shrink-0">
                        <AdminSideBar />
                    </aside>
                    <section className="flex-1 min-w-0">
                        <div className="mb-2 text-left">
                            <h1 className="text-3xl font-bold mb-2">매출 통계</h1>
                            <p className="text-gray-500 text-base">
                                일/월별 매출, 환불, 순매출 데이터를 차트와 표로 확인할 수 있습니다.
                            </p>
                        </div>
                        <div className="flex gap-2 mb-7">
                            {TABS.map((t) => (
                                <button
                                    key={t.key}
                                    className={`px-4 py-2 rounded-lg border transition
                      ${tab === t.key
                                        ? "bg-black text-white border-black"
                                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                                    onClick={() => setTab(t.key)}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                        {/* 라인 차트 */}
                        <Card className="mb-8">
                            <CardContent className="pt-6">
                                {loading && <div className="p-8 text-center text-gray-500">로딩중...</div>}
                                {error && <div className="p-8 text-center text-red-500">{error}</div>}
                                {!loading && !error && chartData.length > 0 && (
                                    <ResponsiveContainer width="100%" height={350}>
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey={xKey} />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(v: any, name: string) =>
                                                    [v?.toLocaleString?.() ?? v, {
                                                        cardSales: "카드매출",
                                                        cardRefunds: "카드환불",
                                                        netSales: "순매출"
                                                    }[name] || name
                                                    ]}
                                            />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="cardSales"
                                                name="카드매출"
                                                stroke={COLOR_CARD_SALES}
                                                strokeWidth={3}
                                                dot={{ r: 2 }}
                                                activeDot={{ r: 5, strokeWidth: 0, fill: COLOR_CARD_SALES, stroke: COLOR_CARD_SALES }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="cardRefunds"
                                                name="카드환불"
                                                stroke={COLOR_CARD_REFUNDS}
                                                strokeWidth={3}
                                                dot={{ r: 2 }}
                                                activeDot={{ r: 5, strokeWidth: 0, fill: COLOR_CARD_REFUNDS, stroke: COLOR_CARD_REFUNDS }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="netSales"
                                                name="순매출"
                                                stroke={COLOR_NET_SALES}
                                                strokeWidth={3}
                                                dot={{ r: 2 }}
                                                activeDot={{ r: 6, strokeWidth: 0, fill: COLOR_NET_SALES, stroke: COLOR_NET_SALES }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                                {!loading && !error && chartData.length === 0 && (
                                    <div className="p-8 text-center text-gray-400">데이터 없음</div>
                                )}
                            </CardContent>
                        </Card>
                        {/* 바 차트 */}
                        <Card>
                            <CardContent className="pt-6">
                                {!loading && !error && chartData.length > 0 && (
                                    <ResponsiveContainer width="100%" height={350}>
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey={xKey} />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(v: any, name: string) =>
                                                    [v?.toLocaleString?.() ?? v, {
                                                        cardSales: "카드매출",
                                                        cardRefunds: "카드환불",
                                                        netSales: "순매출"
                                                    }[name] || name
                                                    ]}
                                            />
                                            <Legend />
                                            <Bar dataKey="cardSales" name="카드매출" fill={COLOR_CARD_SALES} fillOpacity={0.95} barSize={26} />
                                            <Bar dataKey="cardRefunds" name="카드환불" fill={COLOR_CARD_REFUNDS} fillOpacity={0.88} barSize={26} />
                                            <Bar dataKey="netSales" name="순매출" fill={COLOR_NET_SALES} fillOpacity={0.88} barSize={26} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                        {/* 표 */}
                        <Card className="mt-8">
                            <CardContent className="p-0">
                                {!loading && !error && chartData.length > 0 && (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-sm">
                                            <thead>
                                            <tr className="bg-gray-100 border-b">
                                                <th className="px-3 py-2 font-bold">
                                                    {tab.includes("monthly") ? "월" : "날짜"}
                                                </th>
                                                <th className="px-3 py-2">카드 매출</th>
                                                <th className="px-3 py-2">카드 환불</th>
                                                <th className="px-3 py-2">순매출</th>
                                                <th className="px-3 py-2">결제 건수</th>
                                                <th className="px-3 py-2">평균 결제금액</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {chartData.map((s, i) => (
                                                <tr key={i} className="border-b hover:bg-gray-50">
                                                    <td className="px-3 py-2">{s.date || s.month}</td>
                                                    <td className="px-3 py-2 text-blue-700">{s.cardSales.toLocaleString()}</td>
                                                    <td className="px-3 py-2 text-red-600">{s.cardRefunds.toLocaleString()}</td>
                                                    <td className="px-3 py-2 font-bold text-teal-700">{s.netSales.toLocaleString()}</td>
                                                    <td className="px-3 py-2">{s.totalOrders.toLocaleString()}</td>
                                                    <td className="px-3 py-2">{Number(s.avgAmount).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </main>
        </div>
    );
}
