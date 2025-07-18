import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, LayoutGrid, Users } from "lucide-react";

export default function CommunityHome(): JSX.Element {
  const statsData = [
    {
      icon: <Users className="w-5 h-5" />,
      label: "멤버 수",
      value: "1,247",
    },
    {
      icon: <LayoutGrid className="w-6 h-6" />,
      label: "게시판 수",
      value: "8",
    },
    {
      icon: <FileText className="w-5 h-6" />,
      label: "총 게시글 수",
      value: "3,421",
    },
  ];

  const recentPosts = [
    {
      title: "React 18의 새로운 기능들에 대해 알아보자",
      author: "김개발",
      date: "2024-01-15",
      views: "23",
    },
    {
      title: "백엔드 개발자를 위한 Docker 완벽 가이드",
      author: "박서버",
      date: "2024-01-14",
      views: "15",
    },
    {
      title: "프론트엔드 성능 최적화 팁 공유",
      author: "이웹",
      date: "2024-01-13",
      views: "31",
    },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 py-10">
      {/* Page Title */}
      <h1 className="text-[32px] font-bold leading-10 mb-8">커뮤니티 홈</h1>

      {/* Hero Banner */}
      <div className="w-full h-[280px] rounded-xl bg-gradient-to-r from-[#667eea] to-[#764ba2] relative mb-10">
        <div className="absolute inset-0 bg-black/30 rounded-xl">
          <div className="p-16 flex flex-col h-full justify-center">
            <h2 className="text-white text-5xl font-bold leading-[56px] mb-4">
              개발자 커뮤니티
            </h2>
            <p className="text-white/90 text-xl leading-7 mb-8">
              함께 성장하는 개발자들의 공간입니다
            </p>
            <Button className="w-[186px] h-14 bg-white text-black hover:bg-gray-100 rounded-lg shadow-md">
              커뮤니티 가입하기
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {statsData.map((stat, index) => (
          <Card key={index} className="shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  {stat.icon}
                </div>
                <span className="font-medium text-lg">{stat.label}</span>
              </div>
              <p className="font-bold text-4xl leading-[44px]">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="font-medium text-2xl leading-8 mb-6">최근 게시글</h2>
        <div className="flex flex-col gap-4">
          {recentPosts.map((post, index) => (
            <Card key={index} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg">{post.title}</h3>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 text-sm">
                      {post.views}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
