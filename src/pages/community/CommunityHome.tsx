import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Users } from "lucide-react";
import React from "react";

export default function GeneratedDesign(): JSX.Element {
  const navItems = [
    { name: "커뮤니티", active: true },
    { name: "SNS 피드", active: false },
    { name: "포인트", active: false },
    { name: "마이페이지", active: false },
    { name: "로그아웃", active: false },
  ];

  const sidebarItems = [
    { name: "공개 그룹", active: true },
    { name: "내 그룹", active: false },
    { name: "게시판", active: false },
    { name: "멤버 목록", active: false },
    { name: "설정", active: false },
  ];

  const groups = [
    {
      id: 1,
      name: "취업 준비 개발자 모임",
      description:
        "함께 성장하는 개발자들의 취업 준비 커뮤니티입니다. 코딩테스트, 면접 준비, 포트폴리오 리뷰 등을 함께해요.",
      members: 124,
      isPublic: true,
      isJoined: false,
    },
    {
      id: 2,
      name: "프론트엔드 스터디",
      description:
        "React, Vue, Angular 등 최신 프론트엔드 기술을 학습하고 프로젝트를 진행합니다.",
      members: 89,
      isPublic: true,
      isJoined: true,
    },
    {
      id: 3,
      name: "UI/UX 디자이너 네트워킹",
      description:
        "디자이너들의 포트폴리오 공유와 피드백, 취업 정보를 나누는 공간입니다.",
      members: 67,
      isPublic: false,
      isJoined: false,
    },
    {
      id: 4,
      name: "백엔드 개발자 모임",
      description:
        "Java, Python, Node.js 등 백엔드 기술 스택을 다루는 개발자들의 모임입니다.",
      members: 156,
      isPublic: true,
      isJoined: true,
    },
    {
      id: 5,
      name: "데이터 사이언스 연구회",
      description:
        "머신러닝, 딥러닝, 데이터 분석 기술을 연구하고 실무 프로젝트를 진행합니다.",
      members: 78,
      isPublic: true,
      isJoined: false,
    },
    {
      id: 6,
      name: "스타트업 창업 준비",
      description:
        "창업을 꿈꾸는 사람들이 모여 아이디어를 공유하고 팀을 구성하는 공간입니다.",
      members: 45,
      isPublic: false,
      isJoined: false,
    },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-[1440px] min-h-screen relative">
        {/* Header */}
        <header className="flex w-full h-20 items-center justify-center gap-5 p-5 sticky top-0 left-0 bg-white shadow-md z-10">
          <div className="relative w-10 h-10 bg-[#0000001a] rounded-full" />
          <div className="relative flex-1 font-medium text-black text-[28px] leading-9">
            JobDam
          </div>
          <div className="inline-flex items-center justify-center gap-10 bg-white">
            {navItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="relative w-fit font-normal text-black text-base"
              >
                {item.name}
              </Button>
            ))}
            <div className="flex w-[200px] items-center gap-1 p-2 rounded-md border border-[#0000001a]">
              <Input
                className="border-none shadow-none font-normal text-[#00000080] text-sm"
                placeholder="Search in site"
              />
              <Search className="h-5 w-5 text-gray-500" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-[292px] h-full border-r border-[#0000001a]">
            <div className="h-[81px] flex items-center px-6 border-b border-[#0000001a]">
              <h2 className="text-2xl font-medium">커뮤니티</h2>
            </div>
            <div className="mt-4 flex flex-col gap-3 px-4">
              {sidebarItems.map((item, index) => (
                <Button
                  key={index}
                  variant={item.active ? "secondary" : "ghost"}
                  className={`w-full justify-start text-left h-12 ${
                    item.active ? "bg-[#0000000d]" : ""
                  } rounded-md`}
                >
                  <span className="font-normal text-black text-base leading-6 whitespace-nowrap">
                    {item.name}
                  </span>
                </Button>
              ))}
            </div>
          </aside>

          {/* Main Body */}
          <main className="flex-1 p-10 relative">
            <h1 className="text-[32px] font-bold mb-6">공개 그룹 리스트</h1>

            <div className="flex gap-2 mb-6">
              <Input
                className="h-[46px] rounded-md border border-[#0000001a] w-[400px]"
                placeholder="그룹명 검색"
              />
              <Button className="bg-black text-white w-[74px] h-11 rounded-md">
                검색
              </Button>
            </div>

            <Tabs defaultValue="all" className="mb-6">
              <TabsList className="bg-transparent p-0 h-auto">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none px-0 mr-6 h-[34px] rounded-none bg-transparent"
                >
                  전체
                </TabsTrigger>
                <TabsTrigger
                  value="joined"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none px-0 text-[#00000080] bg-transparent rounded-none"
                >
                  내가 가입한 그룹
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Group Cards */}
            <div className="grid grid-cols-2 gap-6">
              {groups.map((group) => (
                <Card
                  key={group.id}
                  className="w-full h-[186px] rounded-lg border border-[#0000001a]"
                >
                  <CardHeader className="pb-0 pt-6 px-6">
                    <div className="flex justify-between items-start">
                      <CardTitle className="font-medium text-black text-xl leading-7">
                        {group.name}
                      </CardTitle>
                      <Badge
                        className={`${
                          group.isPublic
                            ? "bg-[#0080001a] text-[#008000]"
                            : "bg-[#ffa5001a] text-[#ffa500]"
                        } rounded h-6 px-2 py-1 font-normal text-xs`}
                      >
                        {group.isPublic ? "공개" : "비공개"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 py-0">
                    <p className="font-normal text-[#000000b2] text-sm leading-5">
                      {group.description}
                    </p>
                  </CardContent>
                  <CardFooter className="px-6 pt-4 pb-6 flex justify-between items-center">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="ml-2 font-normal text-[#00000080] text-sm leading-5">
                        {group.members}명
                      </span>
                    </div>
                    <Button
                      className={`w-[58px] h-9 ${
                        group.isJoined
                          ? "bg-[#ff00001a] text-[#ff0000] hover:bg-[#ff00002a]"
                          : "bg-black text-white"
                      } rounded-md`}
                    >
                      {group.isJoined ? "탈퇴" : "입장"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Create Group Button */}
            <div className="mt-10 flex justify-end">
              <Button className="flex items-center gap-2 px-[19px] py-3 bg-black rounded-lg shadow-md">
                <Plus className="h-5 w-5" />
                <span className="font-medium text-white text-base leading-6">
                  새 그룹 만들기
                </span>
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
