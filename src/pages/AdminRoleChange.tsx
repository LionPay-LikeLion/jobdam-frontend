import React, { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import AdminSideBar from "@/components/AdminSideBar";
import { CheckCircle, XCircle, Info } from "lucide-react";
import api from "@/lib/api";

// === 상태별 뱃지, 라벨, 아이콘 ===
const statusBadge: Record<number, string> = {
    0: "bg-yellow-50 text-yellow-700 border border-yellow-200",  // 대기중
    1: "bg-red-50 text-red-600 border border-red-200",           // 거절
    2: "bg-green-50 text-green-600 border border-green-200",     // 승인
};
const statusLabel: Record<number, string> = {
    0: "대기중",
    1: "거절됨",
    2: "승인됨",
};
const statusIcon: Record<number, React.ReactNode> = {
    0: <Info size={15} className="inline mr-1 text-yellow-500" />,
    1: <XCircle size={15} className="inline mr-1 text-red-500" />,
    2: <CheckCircle size={15} className="inline mr-1 text-green-500" />,
};

const statusMap: Record<string, number | undefined> = {
    "전체": undefined,
    "대기중": 0,
    "거절됨": 1,
    "승인됨": 2,
};

type RoleChangeItem = {
    requestId: number;
    name: string;           // 닉네임
    email: string;
    requestedRole: string;
    createdAt: string;
    fileUrl?: string;
    statusCode: number;
};

const roleOptions = [
    { label: "전체", value: "" },
    { label: "일반회원", value: "GENERAL" },
    { label: "기업회원", value: "EMPLOYEE" },
    { label: "컨설턴트", value: "HUNTER" },
];

const AdminRoleChange: React.FC = () => {
    const [filters, setFilters] = useState({
        name: "",
        email: "",
        requestedRole: "",
        status: "전체",
    });
    const [roleChangeList, setRoleChangeList] = useState<RoleChangeItem[]>([]);
    const [loading, setLoading] = useState(false);

    const [processingId, setProcessingId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    // ==== 역할 전환 요청 목록 불러오기 ====
    const fetchList = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (filters.name) params.nickname = filters.name; // 닉네임 기준
            if (filters.email) params.email = filters.email;
            if (filters.requestedRole) params.requestedRole = filters.requestedRole;
            if (filters.status !== "전체") params.statusCode = statusMap[filters.status];
            const res = await api.get("/membertype-change", { params });
            let list: RoleChangeItem[] = [];
            if (res.data && Array.isArray(res.data)) {
                list = res.data.map((item: any) => ({
                    requestId: item.requestId,
                    name: item.userNickname, // 닉네임!
                    email: item.userEmail,
                    requestedRole: item.requestedRole || item.requestedMemberTypeCode,
                    createdAt: item.requestedAt,
                    fileUrl: item.attachmentUrl,
                    statusCode: item.requestStatusCode,
                }));
            }
            setRoleChangeList(list);
        } catch (e) {
            console.error("역할 전환 요청 목록 조회 실패", e);
            setRoleChangeList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchList(); }, []);

    // ==== 필터 핸들러 ====
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };
    const handleSearch = () => {
        fetchList();
    };

    // ==== 승인/거절 처리 ====
    const handleProcess = async (item: RoleChangeItem, action: "승인" | "거절") => {
        setProcessingId(item.requestId);
        try {
            // 기존: const statusCode = action === "승인" ? 2 : 1;
            // 수정:
            const statusCode = action === "승인" ? "APPROVED" : "REJECTED";
            await api.patch(`/membertype-change/${item.requestId}`, { statusCode });
            setModalMessage(action === "승인" ? "해당 요청이 승인되었습니다." : "해당 요청이 거절되었습니다.");
            setShowModal(true);
        } catch (e) {
            setModalMessage("처리 중 오류가 발생했습니다.");
            setShowModal(true);
        } finally {
            setProcessingId(null);
        }
    };


    // ==== 모달 닫기 ====
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
                            <h1 className="text-3xl font-bold mb-2">전환 요청 관리</h1>
                            <p className="text-gray-500 text-base">
                                사용자의 역할 전환 요청을 검토하고 승인/거절할 수 있습니다.
                            </p>
                        </div>
                        {/* --- 검색/필터 --- */}
                        <div className="bg-white rounded-2xl shadow p-6 mb-7 border flex items-end gap-5 w-full max-w-[1250px]">
                            <div className="flex flex-col w-48">
                                <label className="text-xs mb-1">신청자 닉네임</label>
                                <input
                                    className="border rounded px-3 py-2 text-sm"
                                    name="name"
                                    value={filters.name}
                                    onChange={handleFilterChange}
                                    placeholder="닉네임을 입력하세요"
                                />
                            </div>
                            <div className="flex flex-col w-64">
                                <label className="text-xs mb-1">이메일</label>
                                <input
                                    className="border rounded px-3 py-2 text-sm"
                                    name="email"
                                    value={filters.email}
                                    onChange={handleFilterChange}
                                    placeholder="이메일을 입력하세요"
                                />
                            </div>
                            <div className="flex flex-col w-44">
                                <label className="text-xs mb-1">희망 역할</label>
                                <select
                                    className="border rounded px-3 py-2 text-sm"
                                    name="requestedRole"
                                    value={filters.requestedRole}
                                    onChange={handleFilterChange}
                                >
                                    {roleOptions.map(option => (
                                        <option value={option.value} key={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col w-36">
                                <label className="text-xs mb-1">상태</label>
                                <select
                                    className="border rounded px-3 py-2 text-sm"
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                >
                                    <option>전체</option>
                                    <option>대기중</option>
                                    <option>승인됨</option>
                                    <option>거절됨</option>
                                </select>
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
                        {/* --- 역할 전환 요청 목록 --- */}
                        <div className="w-full max-w-[1250px]">
                            <h2 className="text-xl font-semibold mb-3 text-left">전환 요청 목록</h2>
                            <div className="bg-white rounded-2xl shadow border px-0 py-0 overflow-x-auto">
                                <table className="w-full text-sm text-left whitespace-nowrap">
                                    <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="py-3 px-4 text-sm font-medium">닉네임</th>
                                        <th className="px-4 text-sm font-medium">이메일</th>
                                        <th className="px-4 text-sm font-medium">희망 역할</th>
                                        <th className="px-4 text-sm font-medium">신청일</th>
                                        <th className="px-4 text-sm font-medium">첨부 파일</th>
                                        <th className="px-4 text-sm font-medium">상태</th>
                                        <th className="px-4 text-sm font-medium">관리</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {(roleChangeList?.length ?? 0) === 0 && !loading && (
                                        <tr>
                                            <td colSpan={7} className="py-10 text-center text-gray-400">
                                                전환 요청 내역이 없습니다.
                                            </td>
                                        </tr>
                                    )}
                                    {Array.isArray(roleChangeList) && roleChangeList.map((item) => (
                                        <tr
                                            key={item.requestId}
                                            className="border-b last:border-b-0 hover:bg-gray-50 text-[15px] align-middle"
                                        >
                                            <td className="py-3 px-4 align-middle">{item.name}</td>
                                            <td className="px-4 align-middle">{item.email}</td>
                                            <td className="px-4 align-middle">
                                                {item.requestedRole === "EMPLOYEE"
                                                    ? "기업회원"
                                                    : item.requestedRole === "HUNTER"
                                                        ? "컨설턴트"
                                                        : "일반회원"}
                                            </td>
                                            <td className="px-4 align-middle">
                                                {item.createdAt
                                                    ? new Date(item.createdAt).toLocaleString("ko-KR", {
                                                        year: "numeric",
                                                        month: "2-digit",
                                                        day: "2-digit",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })
                                                    : ""}
                                            </td>
                                            <td className="px-4 align-middle">
                                                {item.fileUrl ? (
                                                    <a
                                                        href={item.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 text-xs font-medium hover:bg-blue-100"
                                                    >
                                                        첨부 보기
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">없음</span>
                                                )}
                                            </td>
                                            <td className="px-4 align-middle">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold ${statusBadge[item.statusCode]}`}>
                          {statusIcon[item.statusCode]}
                            {statusLabel[item.statusCode]}
                        </span>
                                            </td>
                                            <td className="px-4 align-middle">
                                                <div className="flex flex-nowrap gap-1">
                                                    <button
                                                        className="px-3 h-8 rounded-lg text-xs bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors flex items-center gap-1 min-w-[52px]"
                                                        disabled={item.statusCode !== 0 || processingId !== null}
                                                        onClick={() => handleProcess(item, "승인")}
                                                    >
                                                        <CheckCircle size={13} className="inline" />
                                                        승인
                                                    </button>
                                                    <button
                                                        className="px-3 h-8 rounded-lg text-xs bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors flex items-center gap-1 min-w-[52px]"
                                                        disabled={item.statusCode !== 0 || processingId !== null}
                                                        onClick={() => handleProcess(item, "거절")}
                                                    >
                                                        <XCircle size={13} className="inline" />
                                                        거절
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
        </div>
    );
};

export default AdminRoleChange;
