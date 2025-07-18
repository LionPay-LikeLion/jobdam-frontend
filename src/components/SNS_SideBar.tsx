import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";

const SNS_SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "피드 보기", path: "/sns-feed" },
    { name: "내 피드", path: "/sns-feed/mine" },
    { name: "메시지함", path: "/sns-feed/messages" },
    { name: "통계", path: "/sns-feed/stats" },
    { name: "설정", path: "/sns-feed/settings" },
  ];

  return (
    <aside className="w-[291px] border-r border-gray-200 px-6 pt-6">
      <h2 className="text-2xl font-medium mb-6">SNS 피드</h2>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/sns-feed" && location.pathname.startsWith(item.path));

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={clsx(
                "w-full text-left p-3 rounded-md text-base cursor-pointer transition",
                isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
              )}
            >
              {item.name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default SNS_SideBar;
