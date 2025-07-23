import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import { FaHome, FaThList, FaUsers, FaCogs } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

const Community_SideBar = () => {

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    checkMemberStatus();
  }, [id]);

  const checkMemberStatus = async () => {
    try {
      const response = await api.get(`/communities/${id}/members/${user?.id}/exist`);
      setIsMember(response.data);
    } catch (error) {
      setIsMember(false);
    }
  };

  const menuItems = [
    { label: "홈", path: `/communities/${id}`, alwaysEnabled: true, icon: <FaHome /> },
    { label: "게시판", path: `/communities/${id}/board`, alwaysEnabled: false, icon: <FaThList /> },
    { label: "멤버 목록", path: `/communities/${id}/members`, alwaysEnabled: false, icon: <FaUsers /> },
    { label: "관리", path: `/communities/${id}/management`, alwaysEnabled: false, icon: <FaCogs /> },
  ];

  const getIsActive = (path: string) => {
    return location.pathname === path;
  };

  const handleMenuClick = (item: any) => {
    if (item.alwaysEnabled || isMember) {
      navigate(item.path);
    }
  };

  return (
    <aside className="hidden md:flex w-[291px] min-h-screen bg-white border border-gray-100 rounded-2xl shadow-sm px-7 pt-8 sticky top-0 flex-col">
      <h2 className="text-2xl font-extrabold mb-8 text-gray-900 tracking-tight text-center">커뮤니티</h2>
      <nav className="space-y-2 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isEnabled = item.alwaysEnabled || isMember;
          return (
            <button
              key={item.path}
              onClick={() => handleMenuClick(item)}
              disabled={!isEnabled}
              className={clsx(
                "w-full flex items-center gap-3 text-left p-3 rounded-xl text-base transition-all duration-150",
                getIsActive(item.path)
                  ? "bg-blue-50 font-bold text-blue-600 border-l-4 border-blue-400"
                  : isEnabled
                    ? "hover:bg-gray-100 text-gray-700"
                    : "text-gray-400 cursor-not-allowed opacity-50"
              )}
            >
              <span className={clsx("text-lg", getIsActive(item.path) ? "text-blue-400" : "text-gray-400")}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Community_SideBar;
