import React, { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import AdminSideBar from "@/components/AdminSideBar";
import { CheckCircle, XCircle } from "lucide-react";
import api from "@/lib/api";

type UserItem = {
    userId: number;
    email: string;
    nickname: string;
    isActive: boolean;
    roleCodeId: number; // 1: 회원, 2: 관리자
};

const statusColors: Record<string, string> = {
    "활성": "bg-green-50 text-green-600 border border-green-200",
    "정지": "bg-red-50 text-red-500 border border-red-200",
};

const AdminUserManagement: React.FC = () => {
    const [filters, setFilters] = useState({ nickname: "", email: "", status: "전체" });
    const [allUsers, setAllUsers] = useState<UserItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/user");
            setAllUsers(res.data);
        } catch (e) {
            alert("회원 목록을 불러오지 못했습니다.");
            setAllUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // 프론트 필터
    const filteredUsers = allUsers.filter(user => {
        const matchesNickname = filters.nickname.trim() === "" || user.nickname.includes(filters.nickname.trim());
        const matchesEmail = filters.email.trim() === "" || user.email.includes(filters.email.trim());
        const matchesStatus =
            filters.status === "전체" ||
            (filters.status === "활성" && user.isActive) ||
            (filters.status === "정지" && !user.isActive);
        return matchesNickname && matchesEmail && matchesStatus;
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // 활성화(정지 회원 → 활성)
    const handleActivate = async (user: UserItem) => {
        if (!window.confirm(`${user.nickname} 회원을 활성화하시겠습니까?`)) return;
        await api.patch(`/admin/user/${user.userId}/activate`);
        setAllUsers(allUsers.map(u => u.userId === user.userId ? { ...u, isActive: true } : u));
        alert("회원이 활성화되었습니다.");
    };

    // 정지(활성 회원 → 정지)
    const handleDeactivate = async (user: UserItem) => {
        if (!window.confirm(`${user.nickname} 회원을 정지 처리하시겠습니까?`)) return;
        await api.patch(`/admin/user/${user.userId}/deactivate`);
        setAllUsers(allUsers.map(u => u.userId === user.userId ? { ...u, isActive: false } : u));
        alert("회원이 정지되었습니다.");
    };

    // **하나의 버튼으로 역할 토글**
    const handleToggleRole = async (user: UserItem) => {
        if (user.roleCodeId === 2) {
            // 현재 관리자 → 회원으로
            if (!window.confirm(`${user.nickname}님을 '회원'으로 변경하시겠습니까?`)) return;
            await api.patch(`/admin/user/${user.userId}/revoke-admin`);
            setAllUsers(allUsers.map(u => u.userId === user.userId ? { ...u, roleCodeId: 1 } : u));
            alert("회원으로 변경되었습니다.");
        } else {
            // 현재 회원 → 관리자로
            if (!window.confirm(`${user.nickname}님을 '관리자'로 변경하시겠습니까?`)) return;
            await api.patch(`/admin/user/${user.userId}/grant-admin`);
            setAllUsers(allUsers.map(u => u.userId === user.userId ? { ...u, roleCodeId: 2 } : u));
            alert("관리자로 변경되었습니다.");
        }
    };

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
                            <h1 className="text-3xl font-bold mb-2">회원 관리</h1>
                            <p className="text-gray-500 text-base">모든 회원 정보를 관리하고 검색할 수 있습니다.</p>
                        </div>
                        <form
                            className="bg-white rounded-2xl shadow p-6 mb-7 border flex items-end gap-5 w-full max-w-[1250px]"
                            onSubmit={e => e.preventDefault()}
                        >
                            <div className="flex flex-col w-44">
                                <label className="text-xs mb-1">닉네임</label>
                                <input
                                    type="text"
                                    name="nickname"
                                    value={filters.nickname}
                                    onChange={handleInputChange}
                                    placeholder="닉네임을 입력하세요"
                                    className="border rounded px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="flex flex-col w-60">
                                <label className="text-xs mb-1">이메일</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={filters.email}
                                    onChange={handleInputChange}
                                    placeholder="이메일을 입력하세요"
                                    className="border rounded px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="flex flex-col w-40">
                                <label className="text-xs mb-1">상태</label>
                                <select
                                    name="status"
                                    value={filters.status}
                                    onChange={handleInputChange}
                                    className="border rounded px-3 py-2 text-sm"
                                >
                                    <option value="전체">전체</option>
                                    <option value="활성">활성</option>
                                    <option value="정지">정지</option>
                                </select>
                            </div>
                            <div className="flex-1" />
                            <button
                                type="button"
                                className="bg-black text-white px-8 py-2 rounded-xl hover:bg-gray-800 h-11 text-sm font-semibold shadow mt-[22px]"
                                disabled={loading}
                                onClick={() => setFilters({ nickname: "", email: "", status: "전체" })}
                            >
                                초기화
                            </button>
                        </form>

                        <div className="w-full max-w-[1250px]">
                            <h2 className="text-xl font-semibold mb-3 text-left">회원 목록</h2>
                            <div className="bg-white rounded-2xl shadow border overflow-x-auto px-0 py-0">
                                <table className="w-full text-sm text-left whitespace-nowrap">
                                    <colgroup>
                                        <col style={{ width: "25%" }} />
                                        <col style={{ width: "35%" }} />
                                        <col style={{ width: "10%" }} />
                                        <col style={{ width: "10%" }} />
                                        <col style={{ width: "20%" }} />
                                    </colgroup>
                                    <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="py-3 px-4 text-sm font-medium">닉네임</th>
                                        <th className="px-4 text-sm font-medium">이메일</th>
                                        <th className="px-4 text-sm font-medium">상태</th>
                                        <th className="px-4 text-sm font-medium">역할</th>
                                        <th className="px-4 text-sm font-medium">관리</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-8 text-gray-400">로딩 중...</td>
                                        </tr>
                                    ) : filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-8 text-gray-400">검색 결과가 없습니다.</td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user.userId} className="border-b last:border-b-0 hover:bg-gray-50 text-[15px]">
                                                <td className="py-3 px-4 flex items-center gap-2">
                                                        <span className="inline-block w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                                                <circle cx="12" cy="8" r="4" fill="#cbd5e1" />
                                                                <path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" fill="#cbd5e1" />
                                                            </svg>
                                                        </span>
                                                    <span>{user.nickname}</span>
                                                </td>
                                                <td className="px-4 align-middle">{user.email}</td>
                                                <td className="px-4 align-middle">
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold ${statusColors[user.isActive ? "활성" : "정지"]}`}>
                                                            {user.isActive
                                                                ? <CheckCircle size={15} className="inline text-green-500" />
                                                                : <XCircle size={15} className="inline text-red-500" />}
                                                            {user.isActive ? "활성" : "정지"}
                                                        </span>
                                                </td>
                                                <td className="px-4 align-middle">
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold 
                                                            ${user.roleCodeId === 2 ? "bg-yellow-50 text-yellow-700 border border-yellow-200" : "bg-blue-50 text-blue-600 border border-blue-200"}`}>
                                                            {user.roleCodeId === 2 ? "관리자" : "회원"}
                                                        </span>
                                                </td>
                                                <td className="px-4 align-middle">
                                                    <div className="flex gap-1">
                                                        <button
                                                            className={user.roleCodeId === 2
                                                                ? "px-3 h-8 rounded-lg border border-yellow-200 text-xs bg-yellow-50 text-yellow-700 hover:bg-yellow-100 min-w-[88px]"
                                                                : "px-3 h-8 rounded-lg border border-blue-200 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 min-w-[88px]"}
                                                            onClick={() => handleToggleRole(user)}
                                                        >
                                                            {user.roleCodeId === 2 ? "회원으로 변경" : "관리자로 변경"}
                                                        </button>
                                                        <button
                                                            className="px-3 h-8 rounded-lg border border-green-300 text-xs bg-green-50 text-green-700 hover:bg-green-100 min-w-[64px]"
                                                            onClick={() => handleActivate(user)}
                                                            disabled={user.isActive}
                                                        >
                                                            활성화
                                                        </button>
                                                        <button
                                                            className="px-3 h-8 rounded-lg border border-red-200 text-xs bg-red-50 text-red-500 hover:bg-red-100 min-w-[64px]"
                                                            onClick={() => handleDeactivate(user)}
                                                            disabled={!user.isActive}
                                                        >
                                                            정지
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
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

export default AdminUserManagement;
