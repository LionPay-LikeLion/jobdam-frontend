import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { FaListUl, FaUser, FaHistory } from "react-icons/fa";

const SNS_SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: "피드 보기", path: "/", icon: <FaListUl /> },
    { label: "내 피드", path: "/mine", icon: <FaUser /> },
    { label: "내 활동내역", path: "/activity-history", icon: <FaHistory /> },
  ];

  const getIsActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-[291px] min-h-screen bg-white border border-gray-100 rounded-2xl shadow-sm px-7 pt-8 sticky top-0 flex flex-col">
      <h2 className="text-2xl font-extrabold mb-8 text-gray-900 tracking-tight text-center">SNS 피드</h2>
      <nav className="space-y-2 flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={clsx(
              "w-full flex items-center gap-3 text-left p-3 rounded-xl text-base transition-all duration-150",
              getIsActive(item.path)
                ? "bg-blue-50 font-bold text-blue-600 border-l-4 border-blue-400"
                : "hover:bg-gray-100 text-gray-700"
            )}
          >
            <span className={clsx("text-lg", getIsActive(item.path) ? "text-blue-400" : "text-gray-400")}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default SNS_SideBar;
