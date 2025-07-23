// src/pages/layouts/SNSFeedLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Community_SideBar from "@/components/Community_SideBar";

const CommunityLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-korean">
      <TopBar />
      <div className="w-full flex justify-center">
        <div className="container w-full flex flex-row items-start px-4 md:px-6">
          <Community_SideBar />
          <main className="flex-1 py-10 md:ml-8 lg:ml-12">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default CommunityLayout;
