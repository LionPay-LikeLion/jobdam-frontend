import React, { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import AdminSideBar from "@/components/AdminSideBar";
import { CheckCircle, XCircle, Info } from "lucide-react";
import api from "@/lib/api";

// === 상태별 뱃지, 라벨, 아이콘 정의 (정지됨 추가) ===
const statusBadge: Record<number, string> = {
    0: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    1: "bg-green-50 text-green-600 border border-green-200",
    2: "bg-red-50 text-red-600 border border-red-200", // 정지됨
};
const statusLabel: Record<number, string> = {
    0: "대기중",
    1: "처리완료",
    2: "정지됨",
};
const statusIcon: Record<number, React.ReactNode> = {
    0: <Info size={15} className="inline mr-1 text-yellow-500" />,
    1: <CheckCircle size={15} className="inline mr-1 text-green-500" />,
    2: <XCircle size={15} className="inline mr-1 text-red-500" />,
};

// === 상태 필터 옵션 (정지됨 추가) ===
const statusMap: Record<string, number | undefined> = {
    "전체": undefined,
    "대기중": 0,
    "처리완료": 1,
    "정지됨": 2,
};

type ReportItem = {
    reportId: number;
    reason: string;
    reporterNickname: string;
    reportedNickname: string;
    createdAt: string;
    status: number;
    targetId: number;
    postType: "community" | "sns";
};

type PostDetail = {
    title: string;
    content: string;
    writerNickname: string;
    createdAt: string;
};

const AdminReport: React.FC = () => {
    const [filters, setFilters] = useState({
        status: "전체",
        reporter: "",
        date: "",
    });
    const [reportList, setReportList] = useState<ReportItem[]>([]);
    const [loading, setLoading] = useState(false);

    const [processingId, setProcessingId] = useState<number | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [showDetail, setShowDetail] = useState(false);
    const [detailPost, setDetailPost] = useState<PostDetail | null>(null);

    // === 신고 리스트 불러오기 ===
    const fetchList = async () => {
        setLoading(true);
        try {
            const params: Record<string, string | number> = {};
            // status=undefined(전체)면 쿼리 제외
            if (filters.status !== "전체") params.status = statusMap[filters.status] as number;
            if (filters.reporter) params.reporter = filters.reporter;
            if (filters.date) params.date = filters.date;
            const res = await api.get("/admin/report", { params });
            let list: ReportItem[] = [];
            if (res.data && Array.isArray(res.data.content)) {
                list = res.data.content;
            } else if (Array.isArray(res.data)) {
                list = res.data;
            }
            setReportList(list);
        } catch (e) {
            console.error("신고 목록 조회 실패", e);
            setReportList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchList(); }, []);

    // === 필터 핸들러 ===
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };
    const handleSearch = () => {
        fetchList();
    };

    // === 허용/정지 처리 ===
    const handleProcess = async (reportId: number, action: "허용" | "정지") => {
        setProcessingId(reportId);
        try {
            if (action === "허용") {
                await api.patch(`/admin/report/${reportId}/approve`);
            } else if (action === "정지") {
                await api.patch(`/admin/report/${reportId}/deactivate`);
            }
            setModalMessage(`${action} 처리 완료!`);
            setShowModal(true);
        } catch (e) {
            console.error("처리 실패", e);
            setModalMessage("처리 중 오류가 발생했습니다.");
            setShowModal(true);
        } finally {
            setProcessingId(null);
        }
    };

    // === 상세보기 ===
    const handleDetail = async (item: ReportItem) => {
        try {
            let url = "";
            if (item.postType === "community") url = `/community/post/${item.targetId}`;
            else if (item.postType === "sns") url = `/sns/post/${item.targetId}`;
            else url = `/post/${item.targetId}`;
            const res = await api.get(url);
            setDetailPost(res.data);
            setShowDetail(true);
        } catch (e) {
            console.error("상세 불러오기 실패", e);
            setDetailPost(null);
            setShowDetail(true);
        }
    };

    // === 모달 닫기 ===
    const handleCloseModal = () => {
        setShowModal(false);
        fetchList();
    };

    return (
        <div className="bg-gray-50 min-h-screen w-full">
            <TopBar />
            <main className="flex flex-row justify-center w-full pt-12 pb-16">
                <div className="flex w-full max-w-[1500px] gap-12">
                    <aside className="w-[220px] flex-shrink-0">
                        <AdminSideBar />
                    </aside>
                    <section className="flex-1 min-w-0">
                        <div className="mb-2 text-left">
                            <h1 className="text-3xl font-bold mb-2">신고 관리</h1>
                            <p className="text-gray-500 text-base">사용자가 신고한 콘텐츠를 검토하고 처리할 수 있습니다.</p>
                        </div>
                        {/* --- 검색/필터 --- */}
                        <div className="bg-white rounded-2xl shadow p-6 mb-7 border flex items-end gap-5 w-full max-w-[1250px]">
                            <div className="flex flex-col w-48">
                                <label className="text-xs mb-1">처리 상태</label>
                                <select
                                    className="border rounded px-3 py-2 text-sm"
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                >
                                    <option>전체</option>
                                    <option>대기중</option>
                                    <option>처리완료</option>
                                    <option>정지됨</option>
                                </select>
                            </div>
                            <div className="flex flex-col w-72">
                                <label className="text-xs mb-1">신고자 닉네임</label>
                                <input
                                    className="border rounded px-3 py-2 text-sm"
                                    name="reporter"
                                    value={filters.reporter}
                                    onChange={handleFilterChange}
                                    placeholder="닉네임을 입력하세요"
                                />
                            </div>
                            <div className="flex flex-col w-56">
                                <label className="text-xs mb-1">신고일</label>
                                <input
                                    type="date"
                                    className="border rounded px-3 py-2 text-sm"
                                    name="date"
                                    value={filters.date}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            <div className="flex-1" />
                            <button
                                className="bg-black text-white px-8 py-2 rounded-xl hover:bg-gray-800 h-11 text-sm font-semibold shadow mt-[22px]"
                                onClick={handleSearch}
                                disabled={loading}
                            >
                                {loading ? "검색 중..." : "검색"}
                            </button>
                        </div>
                        {/* --- 신고 목록 --- */}
                        <div className="w-full max-w-[1250px]">
                            <h2 className="text-xl font-semibold mb-3 text-left">신고 목록</h2>
                            <div className="bg-white rounded-2xl shadow border px-0 py-0 overflow-x-auto">
                                <table className="w-full text-sm text-left whitespace-nowrap">
                                    <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="py-3 px-4 text-sm font-medium">신고 사유</th>
                                        <th className="px-4 text-sm font-medium">신고자</th>
                                        <th className="px-4 text-sm font-medium">피신고자</th>
                                        <th className="px-4 text-sm font-medium">신고일</th>
                                        <th className="px-4 text-sm font-medium">처리 상태</th>
                                        <th className="px-4 text-sm font-medium">관리</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {(reportList?.length ?? 0) === 0 && !loading && (
                                        <tr>
                                            <td colSpan={6} className="py-10 text-center text-gray-400">
                                                신고 내역이 없습니다.
                                            </td>
                                        </tr>
                                    )}
                                    {Array.isArray(reportList) && reportList.map((item) => (
                                        <tr
                                            key={item.reportId}
                                            className="border-b last:border-b-0 hover:bg-gray-50 text-[15px] align-middle"
                                        >
                                            <td className="py-3 px-4 align-middle">{item.reason}</td>
                                            <td className="px-4 align-middle">{item.reporterNickname}</td>
                                            <td className="px-4 align-middle">{item.reportedNickname}</td>
                                            <td className="px-4 align-middle">
                                                {item.createdAt ? new Date(item.createdAt).toLocaleString("ko-KR", {
                                                    year: "numeric", month: "2-digit", day: "2-digit",
                                                    hour: "2-digit", minute: "2-digit"
                                                }) : ""}
                                            </td>
                                            <td className="px-4 align-middle">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold ${statusBadge[item.status]}`}>
                                                    {statusIcon[item.status]}
                                                    {statusLabel[item.status]}
                                                </span>
                                            </td>
                                            <td className="px-4 align-middle">
                                                <div className="flex flex-nowrap gap-1">
                                                    <button
                                                        className="px-3 h-8 rounded-lg border border-gray-300 text-xs hover:bg-gray-100 min-w-[64px]"
                                                        onClick={() => handleDetail(item)}
                                                    >
                                                        상세보기
                                                    </button>
                                                    <button
                                                        className="px-3 h-8 rounded-lg text-xs bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors flex items-center gap-1 min-w-[52px]"
                                                        disabled={item.status !== 0 || processingId !== null}
                                                        onClick={() => handleProcess(item.reportId, "허용")}
                                                    >
                                                        <CheckCircle size={13} className="inline" />
                                                        허용
                                                    </button>
                                                    <button
                                                        className="px-3 h-8 rounded-lg text-xs bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors flex items-center gap-1 min-w-[52px]"
                                                        disabled={item.status !== 0 || processingId !== null}
                                                        onClick={() => handleProcess(item.reportId, "정지")}
                                                    >
                                                        <XCircle size={13} className="inline" />
                                                        정지
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                {loading && (
                                    <div className="py-10 text-center text-gray-400 text-base">로딩 중...</div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            {/* --- 처리 완료 모달 --- */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
                    <div className="bg-white rounded-2xl px-10 py-8 shadow-xl text-center">
                        <div className="mb-5 text-2xl font-semibold">{modalMessage}</div>
                        <button
                            className="mt-2 px-7 py-2 bg-black text-white rounded-xl font-semibold hover:bg-gray-800"
                            onClick={handleCloseModal}
                        >확인</button>
                    </div>
                </div>
            )}
            {/* --- 상세보기 팝업 --- */}
            {showDetail && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
                    <div className="bg-white rounded-2xl px-8 py-8 shadow-xl min-w-[450px] max-w-[95vw]">
                        <div className="mb-3 text-xl font-bold">게시물 상세</div>
                        {detailPost ? (
                            <div className="text-left space-y-2">
                                <div><b>제목:</b> {detailPost.title}</div>
                                <div><b>작성자:</b> {detailPost.writerNickname}</div>
                                <div><b>작성일:</b> {detailPost.createdAt}</div>
                                <div className="pt-2"><b>내용</b><div className="mt-1 whitespace-pre-line">{detailPost.content}</div></div>
                            </div>
                        ) : (
                            <div>불러올 수 없습니다.</div>
                        )}
                        <div className="mt-7 text-right">
                            <button
                                className="px-6 py-2 border rounded-xl bg-gray-50 hover:bg-gray-100"
                                onClick={() => setShowDetail(false)}
                            >닫기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReport;
