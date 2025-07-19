// src/pages/AdminUserManagement.tsx

import React, { useState } from "react";
import TopBar from "@/components/TopBar";
import AdminSideBar from "@/components/AdminSideBar.tsx";

const mockUsers = [
    { id: 1, name: "김민수", email: "minsu.kim@email.com", status: "활성", joined: "2024-01-15", lastLogin: "2024-03-10", isBanned: false, isSeceded: false, },
    { id: 2, name: "박지영", email: "jiyoung.park@email.com", status: "비활성", joined: "2024-02-20", lastLogin: "2024-02-25", isBanned: false, isSeceded: false, },
    { id: 3, name: "이준호", email: "junho.lee@email.com", status: "활성", joined: "2024-01-08", lastLogin: "2024-03-12", isBanned: false, isSeceded: false, },
    { id: 4, name: "최수진", email: "sujin.choi@email.com", status: "정지", joined: "2023-12-10", lastLogin: "2024-01-20", isBanned: true, isSeceded: false, },
    { id: 5, name: "정태현", email: "taehyun.jung@email.com", status: "활성", joined: "2024-03-01", lastLogin: "2024-03-11", isBanned: false, isSeceded: false, },
];

const statusColors: Record<string, string> = {
    "활성": "bg-green-100 text-green-600",
    "비활성": "bg-red-100 text-red-500",
    "정지": "bg-gray-200 text-gray-500",
};

const banColors: Record<string, string> = {
    정상: "text-green-600",
    탈퇴: "text-red-500",
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
        <div className="bg-[#fafbfc] min-h-screen flex flex-col">
            <TopBar />
            <div className="flex flex-row justify-center w-full min-h-[calc(100vh-80px)]">
                <div className="w-[1160px] flex flex-row gap-8 pt-14">
                    {/* --- 사이드바 --- */}
                    <AdminSideBar />
                    {/* --- 메인 콘텐츠 --- */}
                    <div className="flex-1">
                        {/* 타이틀 */}
                        <h1 className="text-3xl font-bold mb-2 text-center">회원 관리</h1>
                        <p className="text-center text-gray-500 mb-8">모든 회원 정보를 관리하고 검색할 수 있습니다.</p>
                        {/* 검색 필터 */}
                        <form
                            className="bg-white rounded-xl shadow p-6 mb-8 flex flex-wrap gap-4 items-end"
                            onSubmit={handleSearch}
                        >
                            <div className="flex flex-col w-40">
                                <label className="text-sm mb-1">이름</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={filters.name}
                                    onChange={handleInputChange}
                                    placeholder="이름을 입력하세요"
                                    className="border rounded px-2 py-1 text-sm"
                                />
                            </div>
                            <div className="flex flex-col w-56">
                                <label className="text-sm mb-1">이메일</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={filters.email}
                                    onChange={handleInputChange}
                                    placeholder="이메일을 입력하세요"
                                    className="border rounded px-2 py-1 text-sm"
                                />
                            </div>
                            <div className="flex flex-col w-32">
                                <label className="text-sm mb-1">상태</label>
                                <select
                                    name="status"
                                    value={filters.status}
                                    onChange={handleInputChange}
                                    className="border rounded px-2 py-1 text-sm"
                                >
                                    <option value="전체">전체</option>
                                    <option value="활성">활성</option>
                                    <option value="비활성">비활성</option>
                                    <option value="정지">정지</option>
                                </select>
                            </div>
                            <div className="flex flex-col w-40">
                                <label className="text-sm mb-1">가입일</label>
                                <input
                                    type="date"
                                    name="joined"
                                    value={filters.joined}
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

                        {/* 회원 테이블 */}
                        <div className="bg-white rounded-xl shadow p-4">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="border-b">
                                    <th className="py-2">이름</th>
                                    <th>이메일</th>
                                    <th>상태</th>
                                    <th>가입일</th>
                                    <th>마지막 로그인</th>
                                    <th>탈퇴 여부</th>
                                    <th>관리</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-gray-400">검색 결과가 없습니다.</td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                            <td className="py-2 flex items-center gap-2">
                                                    <span className="inline-block w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                                            <circle cx="12" cy="8" r="4" fill="#cbd5e1"/>
                                                            <path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" fill="#cbd5e1"/>
                                                        </svg>
                                                    </span>
                                                {user.name}
                                            </td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[user.status]}`}>{user.status}</span>
                                            </td>
                                            <td>{user.joined}</td>
                                            <td>{user.lastLogin}</td>
                                            <td>
                                                    <span className={user.isBanned ? banColors["탈퇴"] : banColors["정상"]}>
                                                        {user.isBanned ? "탈퇴" : "정상"}
                                                    </span>
                                            </td>
                                            <td className="flex gap-2">
                                                <button
                                                    className="px-3 py-1 rounded border text-xs hover:bg-gray-100"
                                                    onClick={() => handleDetail(user)}
                                                >
                                                    상세 보기
                                                </button>
                                                <button
                                                    className="px-3 py-1 rounded border text-xs text-red-500 border-red-200 hover:bg-red-50"
                                                    onClick={() => handleDelete(user)}
                                                >
                                                    탈퇴 처리
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

export default AdminUserManagement;
