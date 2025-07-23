// src/pages/layouts/SNSFeedLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "@/components/TopBar";
import SNS_SideBar from "@/components/SNS_SideBar";

const SNSFeedLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-korean">
      <TopBar />
      <div className="w-full flex justify-center">
        <div className="container w-full flex flex-row items-start px-4 md:px-6 pt-0 mt-0">
          <SNS_SideBar />
          <main className="flex-1 py-0 md:ml-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SNSFeedLayout;
