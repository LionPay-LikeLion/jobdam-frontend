// src/pages/layouts/SNSFeedLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Community_SideBar from "@/components/Community_SideBar";

const CommunityLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-korean">
      <TopBar />
      <div className="flex flex-row">
        <Community_SideBar />
        <main className="flex-1 px-12 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CommunityLayout;
