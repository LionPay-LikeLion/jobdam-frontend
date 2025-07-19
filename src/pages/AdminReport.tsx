import React from "react";
import TopBar from "@/components/TopBar";
import AdminSideBar from "@/components/AdminSideBar";
import { CheckCircle, XCircle, Info } from "lucide-react";

const reportList = [
    {
        type: "게시글",
        summary: "부적절한 언어 사용",
        reason: "욕설/비방",
        reporter: "user123@email.com",
        reported: "홍길동",
        date: "2024-01-15",
        status: "대기",
    },
    {
        type: "댓글",
        summary: "스팸성 광고 댓글",
        reason: "스팸/광고",
        reporter: "admin@site.com",
        reported: "김철수",
        date: "2024-01-14",
        status: "승인",
    },
    {
        type: "게시글",
        summary: "허위 정보 유포 의혹",
        reason: "허위정보",
        reporter: "reporter@email.com",
        reported: "이영희",
        date: "2024-01-13",
        status: "반려",
    },
    {
        type: "댓글",
        summary: "개인정보 무단 공개",
        reason: "개인정보침해",
        reporter: "privacy@email.com",
        reported: "박민수",
        date: "2024-01-12",
        status: "대기",
    },
    {
        type: "게시글",
        summary: "저작권 침해 콘텐츠",
        reason: "저작권침해",
        reporter: "copyright@email.com",
        reported: "최지훈",
        date: "2024-01-11",
        status: "대기",
    },
];

const statusBadge: Record<string, string> = {
    "대기": "bg-yellow-50 text-yellow-700 border border-yellow-200",
    "승인": "bg-green-50 text-green-600 border border-green-200",
    "반려": "bg-red-50 text-red-500 border border-red-200",
};

const AdminReport: React.FC = () => {
    return (
        <div className="bg-gray-50 min-h-screen w-full">
            <TopBar />
            <main className="flex flex-row justify-center w-full pt-12 pb-16">
                <div className="flex w-full max-w-[1500px] gap-12">
                    {/* 사이드바 */}
                    <aside className="w-[220px] flex-shrink-0">
                        <AdminSideBar />
                    </aside>
                    {/* 본문 */}
                    <section className="flex-1 min-w-0">
                        <div className="mb-2 text-left">
                            <h1 className="text-3xl font-bold mb-2">신고 관리</h1>
                            <p className="text-gray-500 text-base">사용자가 신고한 콘텐츠를 검토하고 처리할 수 있습니다.</p>
                        </div>
                        {/* 검색/필터: 항상 한 줄, 버튼 개행 없음 */}
                        <div className="bg-white rounded-2xl shadow p-6 mb-7 border flex items-end gap-5 w-full max-w-[1250px]">
                            <div className="flex flex-col w-48">
                                <label className="text-xs mb-1">신고 대상</label>
                                <select className="border rounded px-3 py-2 text-sm">
                                    <option>전체</option>
                                    <option>게시글</option>
                                    <option>댓글</option>
                                </select>
                            </div>
                            <div className="flex flex-col w-48">
                                <label className="text-xs mb-1">처리 상태</label>
                                <select className="border rounded px-3 py-2 text-sm">
                                    <option>전체</option>
                                    <option>대기</option>
                                    <option>승인</option>
                                    <option>반려</option>
                                </select>
                            </div>
                            <div className="flex flex-col w-72">
                                <label className="text-xs mb-1">신고자 이메일</label>
                                <input className="border rounded px-3 py-2 text-sm" placeholder="이메일 주소를 입력하세요" />
                            </div>
                            <div className="flex flex-col w-56">
                                <label className="text-xs mb-1">신고일</label>
                                <input type="date" className="border rounded px-3 py-2 text-sm" placeholder="연도. 월. 일." />
                            </div>
                            <div className="flex-1" /> {/* 우측 밀어내기 */}
                            <button className="bg-black text-white px-8 py-2 rounded-xl hover:bg-gray-800 h-11 text-sm font-semibold shadow mt-[22px]">
                                검색
                            </button>
                        </div>
                        {/* 신고 목록 */}
                        <div className="w-full max-w-[1250px]">
                            <h2 className="text-xl font-semibold mb-3 text-left">신고 목록</h2>
                            <div className="bg-white rounded-2xl shadow border px-0 py-0 overflow-x-auto">
                                <table className="w-full text-sm text-left whitespace-nowrap">
                                    <colgroup>
                                        <col style={{ width: "8%" }} />
                                        <col style={{ width: "18%" }} />
                                        <col style={{ width: "13%" }} />
                                        <col style={{ width: "19%" }} />
                                        <col style={{ width: "12%" }} />
                                        <col style={{ width: "13%" }} />
                                        <col style={{ width: "9%" }} />
                                        <col style={{ width: "12%" }} />
                                    </colgroup>
                                    <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="py-3 px-4 text-sm font-medium">신고 대상</th>
                                        <th className="px-4 text-sm font-medium">내용 요약</th>
                                        <th className="px-4 text-sm font-medium">신고 사유</th>
                                        <th className="px-4 text-sm font-medium">신고자</th>
                                        <th className="px-4 text-sm font-medium">피신고자</th>
                                        <th className="px-4 text-sm font-medium">신고일</th>
                                        <th className="px-4 text-sm font-medium">처리 상태</th>
                                        <th className="px-4 text-sm font-medium">관리</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {reportList.map((item, idx) => (
                                        <tr
                                            key={idx}
                                            className="border-b last:border-b-0 hover:bg-gray-50 text-[15px] align-middle"
                                        >
                                            <td className="py-3 px-4 align-middle">{item.type}</td>
                                            <td className="px-4 align-middle">{item.summary}</td>
                                            <td className="px-4 align-middle">{item.reason}</td>
                                            <td className="px-4 align-middle font-semibold">{item.reporter}</td>
                                            <td className="px-4 align-middle">{item.reported}</td>
                                            <td className="px-4 align-middle">{item.date}</td>
                                            <td className="px-4 align-middle">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold ${statusBadge[item.status]}`}>
                            {item.status === "승인" && <CheckCircle size={15} className="inline mr-1 text-green-500" />}
                              {item.status === "반려" && <XCircle size={15} className="inline mr-1 text-red-400" />}
                              {item.status === "대기" && <Info size={15} className="inline mr-1 text-yellow-500" />}
                              {item.status}
                          </span>
                                            </td>
                                            <td className="px-4 align-middle">
                                                <div className="flex flex-nowrap gap-1">
                                                    <button className="px-3 h-8 rounded-lg border border-gray-300 text-xs hover:bg-gray-100 min-w-[64px]">
                                                        상세보기
                                                    </button>
                                                    <button className="px-3 h-8 rounded-lg text-xs bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors flex items-center gap-1 min-w-[52px]">
                                                        <CheckCircle size={13} className="inline" />
                                                        승인
                                                    </button>
                                                    <button className="px-3 h-8 rounded-lg text-xs bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors flex items-center gap-1 min-w-[52px]">
                                                        <XCircle size={13} className="inline" />
                                                        거절
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default AdminReport;
