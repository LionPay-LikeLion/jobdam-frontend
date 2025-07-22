import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useParams } from "react-router-dom";
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
      const response = await api.get(`/communities/${id}/members/${user?.userId}/exist`);
      setIsMember(response.data);
    } catch (error) {
      setIsMember(false);
    }
  };

  const menuItems = [
    { label: "커뮤니티 홈", path: `/community/${id}`, alwaysEnabled: true },
    { label: "게시판", path: `/community/${id}/board`, alwaysEnabled: false },
    { label: "멤버 목록", path: `/community/${id}/members`, alwaysEnabled: false },
    { label: "관리", path: `/community/${id}/management`, alwaysEnabled: false },
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
    <aside className="w-[291px] border-r border-gray-200 px-6 pt-6 sticky top-0 h-screen flex flex-col">
      <h2 className="text-2xl font-medium mb-6">커뮤니티</h2>
      <nav className="space-y-2 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isEnabled = item.alwaysEnabled || isMember;
          return (
            <button
              key={item.path}
              onClick={() => handleMenuClick(item)}
              disabled={!isEnabled}
              className={clsx(
                "w-full text-left p-3 rounded-md text-base transition",
                getIsActive(item.path)
                  ? "bg-gray-200 font-bold"
                  : isEnabled
                    ? "hover:bg-gray-100"
                    : "text-gray-400 cursor-not-allowed opacity-50"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Community_SideBar;
