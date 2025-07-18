import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useParams } from "react-router-dom";

const Community_SideBar = () => {

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: "커뮤니티 홈", path: `/community/${id}` },
    { label: "게시판", path: `/community/${id}/board` },
    { label: "멤버 목록", path: `/community/${id}/members` },
    { label: "메신저", path: `/community/${id}/messenger` },
    { label: "관리", path: `/community/${id}/management` },
  ];

  const getIsActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-[291px] border-r border-gray-200 px-6 pt-6">
      <h2 className="text-2xl font-medium mb-6">커뮤니티</h2>
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

export default Community_SideBar;
