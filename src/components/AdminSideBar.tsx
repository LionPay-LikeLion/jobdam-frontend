// src/components/admin/AdminSideBar.tsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const adminTabs = [
    { label: "회원 관리", path: "/admin/users" },
    { label: "신고 관리", path: "/admin/report" },
    { label: "전환 요청 관리", path: "/admin/type-request" },
    { label: "관리자 대시보드", path: "/admin/dashboard" },
    { label: "고객센터 관리", path: "/admin/support" },
];

const AdminSideBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Card className="w-[246px] h-fit rounded-xl shadow-none border border-[#e5e7eb] bg-white">
            <CardContent className="p-0">
                <nav className="flex flex-col">
                    {adminTabs.map(tab => (
                        <button
                            key={tab.path}
                            className={`
                                w-full px-6 py-3 text-left rounded-lg font-medium text-base transition
                                ${location.pathname === tab.path
                                ? "bg-black text-white mt-[10px] mx-[9px]"
                                : "text-[#222] hover:bg-gray-100"}
                            `}
                            onClick={() => navigate(tab.path)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </CardContent>
        </Card>
    );
};

export default AdminSideBar;
