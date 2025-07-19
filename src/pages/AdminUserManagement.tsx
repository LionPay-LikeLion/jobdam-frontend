import React, { useState } from "react";
import TopBar from "@/components/TopBar";
import AdminSideBar from "@/components/AdminSideBar";
import { CheckCircle, XCircle } from "lucide-react";

const mockUsers = [
    { id: 1, name: "김민수", email: "minsu.kim@email.com", status: "활성", joined: "2024-01-15", lastLogin: "2024-03-10", isBanned: false, isSeceded: false, },
    { id: 2, name: "박지영", email: "jiyoung.park@email.com", status: "비활성", joined: "2024-02-20", lastLogin: "2024-02-25", isBanned: false, isSeceded: false, },
    { id: 3, name: "이준호", email: "junho.lee@email.com", status: "활성", joined: "2024-01-08", lastLogin: "2024-03-12", isBanned: false, isSeceded: false, },
    { id: 4, name: "최수진", email: "sujin.choi@email.com", status: "정지", joined: "2023-12-10", lastLogin: "2024-01-20", isBanned: true, isSeceded: false, },
    { id: 5, name: "정태현", email: "taehyun.jung@email.com", status: "활성", joined: "2024-03-01", lastLogin: "2024-03-11", isBanned: false, isSeceded: false, },
];

const statusColors: Record<string, string> = {
    "활성": "bg-green-50 text-green-600 border border-green-200",
    "비활성": "bg-yellow-50 text-yellow-600 border border-yellow-200",
    "정지": "bg-red-50 text-red-500 border border-red-200",
};

const banColors: Record<string, string> = {
    정상: "text-green-600 font-semibold flex items-center gap-1",
    탈퇴: "text-red-500 font-semibold flex items-center gap-1",
};

const AdminUserManagement: React.FC = () => {
    const [filters, setFilters] = useState({ name: "", email: "", status: "전체", joined: "" });
    const [users, setUsers] = useState(mockUsers);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        let filtered = mockUsers.filter((user) => (
            (filters.name === "" || user.name.includes(filters.name)) &&
            (filters.email === "" || user.email.includes(filters.email)) &&
            (filters.status === "전체" || user.status === filters.status) &&
            (filters.joined === "" || user.joined === filters.joined)
        ));
        setUsers(filtered);
    };

    const handleDetail = (user: typeof mockUsers[0]) => {
        alert(`상세보기: ${user.name}`);
    };

    const handleDelete = (user: typeof mockUsers[0]) => {
        if (window.confirm(`${user.name} 회원을 탈퇴 처리하시겠습니까?`)) {
            alert("탈퇴 처리되었습니다 (목업)");
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen w-full">
            <TopBar />
            <main className="flex flex-row justify-center w-full pt-12 pb-16">
                <div className="flex w-full max-w-[1500px] gap-12">
                    {/* 사이드바 */}
                    <aside className="w-[220px] flex-shrink-0">
                        <AdminSideBar />
                    </aside>
                    {/* 메인 콘텐츠 */}
                    <section className="flex-1 min-w-0">
                        <div className="mb-2 text-left">
                            <h1 className="text-3xl font-bold mb-2">회원 관리</h1>
                            <p className="text-gray-500 text-base">모든 회원 정보를 관리하고 검색할 수 있습니다.</p>
                        </div>
                        {/* 검색 필터 한줄 */}
                        <form
                            className="bg-white rounded-2xl shadow p-6 mb-7 border flex items-end gap-5 w-full max-w-[1250px]"
                            onSubmit={handleSearch}
                        >
                            <div className="flex flex-col w-44">
                                <label className="text-xs mb-1">이름</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={filters.name}
                                    onChange={handleInputChange}
                                    placeholder="이름을 입력하세요"
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
                                    <option value="비활성">비활성</option>
                                    <option value="정지">정지</option>
                                </select>
                            </div>
                            <div className="flex flex-col w-48">
                                <label className="text-xs mb-1">가입일</label>
                                <input
                                    type="date"
                                    name="joined"
                                    value={filters.joined}
                                    onChange={handleInputChange}
                                    className="border rounded px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="flex-1" /> {/* 우측 밀어내기 */}
                            <button
                                type="submit"
                                className="bg-black text-white px-8 py-2 rounded-xl hover:bg-gray-800 h-11 text-sm font-semibold shadow mt-[22px]"
                            >
                                검색
                            </button>
                        </form>

                        {/* 회원 테이블 */}
                        <div className="w-full max-w-[1250px]">
                            <h2 className="text-xl font-semibold mb-3 text-left">회원 목록</h2>
                            <div className="bg-white rounded-2xl shadow border overflow-x-auto px-0 py-0">
                                <table className="w-full text-sm text-left whitespace-nowrap">
                                    <colgroup>
                                        <col style={{ width: "15%" }} />
                                        <col style={{ width: "23%" }} />
                                        <col style={{ width: "11%" }} />
                                        <col style={{ width: "13%" }} />
                                        <col style={{ width: "13%" }} />
                                        <col style={{ width: "11%" }} />
                                        <col style={{ width: "14%" }} />
                                    </colgroup>
                                    <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="py-3 px-4 text-sm font-medium">이름</th>
                                        <th className="px-4 text-sm font-medium">이메일</th>
                                        <th className="px-4 text-sm font-medium">상태</th>
                                        <th className="px-4 text-sm font-medium">가입일</th>
                                        <th className="px-4 text-sm font-medium">마지막 로그인</th>
                                        <th className="px-4 text-sm font-medium">탈퇴 여부</th>
                                        <th className="px-4 text-sm font-medium">관리</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-8 text-gray-400">검색 결과가 없습니다.</td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id} className="border-b last:border-b-0 hover:bg-gray-50 text-[15px]">
                                                <td className="py-3 px-4 flex items-center gap-2">
                                                    <span className="inline-block w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                                            <circle cx="12" cy="8" r="4" fill="#cbd5e1"/>
                                                            <path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" fill="#cbd5e1"/>
                                                        </svg>
                                                    </span>
                                                    <span>{user.name}</span>
                                                </td>
                                                <td className="px-4 align-middle">{user.email}</td>
                                                <td className="px-4 align-middle">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold ${statusColors[user.status]}`}>
                                                        {user.status === "활성" && <CheckCircle size={15} className="inline text-green-500" />}
                                                        {user.status === "비활성" && <XCircle size={15} className="inline text-yellow-600" />}
                                                        {user.status === "정지" && <XCircle size={15} className="inline text-red-500" />}
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 align-middle">{user.joined}</td>
                                                <td className="px-4 align-middle">{user.lastLogin}</td>
                                                <td className="px-4 align-middle">
                                                    <span className={user.isBanned ? banColors["탈퇴"] : banColors["정상"]}>
                                                        {user.isBanned ? <XCircle size={14} /> : <CheckCircle size={14} />}
                                                        {user.isBanned ? "탈퇴" : "정상"}
                                                    </span>
                                                </td>
                                                <td className="px-4 align-middle">
                                                    <div className="flex gap-1">
                                                        <button
                                                            className="px-3 h-8 rounded-lg border border-gray-300 text-xs hover:bg-gray-100 min-w-[64px]"
                                                            onClick={() => handleDetail(user)}
                                                        >
                                                            상세보기
                                                        </button>
                                                        <button
                                                            className="px-3 h-8 rounded-lg text-xs bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors min-w-[64px]"
                                                            onClick={() => handleDelete(user)}
                                                        >
                                                            탈퇴 처리
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
