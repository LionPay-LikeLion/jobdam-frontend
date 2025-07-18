import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx"; // tailwind에서 조건부 클래스 조합할 때 편함

const SNS_SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: "피드 보기", path: "/" },
    { label: "내 피드", path: "/mine" },
    { label: "메시지함", path: "/messages" },
    { label: "통계", path: "/stats" },
    { label: "설정", path: "/settings" },
  ];

  const getIsActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-[291px] border-r border-gray-200 px-6 pt-6">
      <h2 className="text-2xl font-medium mb-6">SNS 피드</h2>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={clsx(
              "w-full text-left p-3 rounded-md text-base transition",
              getIsActive(item.path)
                ? "bg-gray-200 font-bold"
                : "hover:bg-gray-100"
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default SNS_SideBar;
