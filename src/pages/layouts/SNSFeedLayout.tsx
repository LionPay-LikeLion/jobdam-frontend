// src/pages/layouts/SNSFeedLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "@/components/TopBar";
import SNS_SideBar from "@/components/SNS_SideBar";

const SNSFeedLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-korean">
      <TopBar />
      <div className="flex flex-row">
        <SNS_SideBar />
        <main className="flex-1 px-12 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SNSFeedLayout;
