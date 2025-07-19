// src/pages/AdminReport.tsx
import React, { useState } from "react";
import TopBar from "@/components/TopBar";
import AdminSideBar from "@/components/AdminSideBar";

const mockReports = [
    {
        id: 1,
        targetType: "게시글",
        summary: "부적절한 언어 사용",
        reason: "욕설/비방",
        reporter: "user123@email.com",
        reportedUser: "홍길동",
        date: "2024-01-15",
        status: "대기",
    },
    {
        id: 2,
        targetType: "댓글",
        summary: "스팸성 광고 댓글",
        reason: "스팸/광고",
        reporter: "admin@site.com",
        reportedUser: "김철수",
        date: "2024-01-14",
        status: "승인",
    },
    {
        id: 3,
        targetType: "게시글",
        summary: "허위 정보 유포 의혹",
        reason: "허위정보",
        reporter: "reporter@email.com",
        reportedUser: "이영희",
        date: "2024-01-13",
        status: "반려",
    },
    {
        id: 4,
        targetType: "댓글",
        summary: "개인정보 무단 공개",
        reason: "개인정보침해",
        reporter: "privacy@email.com",
        reportedUser: "박민수",
        date: "2024-01-12",
        status: "대기",
    },
    {
        id: 5,
        targetType: "게시글",
        summary: "저작권 침해 콘텐츠",
        reason: "저작권침해",
        reporter: "copyright@email.com",
        reportedUser: "최지훈",
        date: "2024-01-11",
        status: "대기",
    },
];

const statusStyle: Record<string, string> = {
    "대기": "bg-yellow-100 text-yellow-600",
    "승인": "bg-green-100 text-green-600",
    "반려": "bg-red-100 text-red-500",
};

const AdminReport: React.FC = () => {
    // 필터 state
    const [filters, setFilters] = useState({
        target: "전체",
        status: "전체",
        reporter: "",
        date: "",
    });
    const [reports, setReports] = useState(mockReports);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        let filtered = mockReports.filter((r) => (
            (filters.target === "전체" || r.targetType === filters.target) &&
            (filters.status === "전체" || r.status === filters.status) &&
            (filters.reporter === "" || r.reporter.includes(filters.reporter)) &&
            (filters.date === "" || r.date === filters.date)
        ));
        setReports(filtered);
    };

    return (
        <div className="bg-[#fafbfc] min-h-screen flex flex-col">
            <TopBar />

            <div className="flex flex-row justify-center w-full min-h-[calc(100vh-80px)]">
                <div className="w-[1160px] flex flex-row gap-8 pt-14">
                    {/* --- 관리자 사이드바 --- */}
                    <AdminSideBar />

                    {/* --- 메인 신고 관리 영역 --- */}
                    <div className="flex-1">
                        {/* 타이틀 */}
                        <h1 className="text-3xl font-bold mb-2 text-center">신고 관리</h1>
                        <p className="text-center text-gray-500 mb-8">사용자가 신고한 콘텐츠를 검토하고 처리할 수 있습니다.</p>

                        {/* 필터 카드 */}
                        <div className="mb-8">
                            <div className="bg-white rounded-xl shadow p-6">
                                <div className="text-xl font-semibold mb-5">검색 및 필터</div>
                                <form className="flex flex-wrap gap-4 items-end" onSubmit={handleSearch}>
                                    <div className="flex flex-col w-40">
                                        <label className="text-sm mb-1">신고 대상</label>
                                        <select
                                            name="target"
                                            value={filters.target}
                                            onChange={handleInputChange}
                                            className="border rounded px-2 py-1 text-sm"
                                        >
                                            <option value="전체">전체</option>
                                            <option value="게시글">게시글</option>
                                            <option value="댓글">댓글</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col w-40">
                                        <label className="text-sm mb-1">처리 상태</label>
                                        <select
                                            name="status"
                                            value={filters.status}
                                            onChange={handleInputChange}
                                            className="border rounded px-2 py-1 text-sm"
                                        >
                                            <option value="전체">전체</option>
                                            <option value="대기">대기</option>
                                            <option value="승인">승인</option>
                                            <option value="반려">반려</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col w-56">
                                        <label className="text-sm mb-1">신고자 이메일</label>
                                        <input
                                            type="text"
                                            name="reporter"
                                            value={filters.reporter}
                                            onChange={handleInputChange}
                                            placeholder="이메일 주소를 입력하세요"
                                            className="border rounded px-2 py-1 text-sm"
                                        />
                                    </div>
                                    <div className="flex flex-col w-40">
                                        <label className="text-sm mb-1">신고일</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={filters.date}
                                            onChange={handleInputChange}
                                            className="border rounded px-2 py-1 text-sm"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="ml-auto bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                                    >
                                        검색
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* 신고 목록 */}
                        <div className="text-xl font-semibold mb-4">신고 목록</div>
                        <div className="bg-white rounded-xl shadow p-4">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="border-b">
                                    <th className="py-2">신고 대상</th>
                                    <th>내용 요약</th>
                                    <th>신고 사유</th>
                                    <th>신고자</th>
                                    <th>피신고자</th>
                                    <th>신고일</th>
                                    <th>처리 상태</th>
                                    <th>관리</th>
                                </tr>
                                </thead>
                                <tbody>
                                {reports.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-8 text-gray-400">검색 결과가 없습니다.</td>
                                    </tr>
                                ) : (
                                    reports.map((report) => (
                                        <tr key={report.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                            <td className="py-2">{report.targetType}</td>
                                            <td>{report.summary}</td>
                                            <td>{report.reason}</td>
                                            <td>{report.reporter}</td>
                                            <td>{report.reportedUser}</td>
                                            <td>{report.date}</td>
                                            <td>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${statusStyle[report.status]}`}>
                            {report.status}
                          </span>
                                            </td>
                                            <td className="flex gap-2">
                                                <button
                                                    className="px-3 py-1 rounded border text-xs hover:bg-gray-100"
                                                    onClick={() => alert(`상세보기: ${report.summary}`)}
                                                >
                                                    상세보기
                                                </button>
                                                <button
                                                    className="px-3 py-1 rounded border text-xs text-green-700 border-green-200 hover:bg-green-50"
                                                    onClick={() => alert("승인 처리(목업)")}
                                                    disabled={report.status === "승인"}
                                                >
                                                    승인
                                                </button>
                                                <button
                                                    className="px-3 py-1 rounded border text-xs text-red-500 border-red-200 hover:bg-red-50"
                                                    onClick={() => alert("반려 처리(목업)")}
                                                    disabled={report.status === "반려"}
                                                >
                                                    거절
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReport;
