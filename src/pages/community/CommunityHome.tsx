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
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Community {
  communityId: number;
  name: string;
  description: string;
  subscriptionLevelCode: string;
  ownerNickname: string;
  maxMember: number;
  currentMember: number;
  enterPoint: number;
}

export default function CommunityHome(): JSX.Element {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8081/api/communities")
      .then((res) => setCommunities(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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
              {loading && <div>로딩 중...</div>}
              {error && <div className="text-red-500">에러 발생: {error}</div>}
              {!loading && !error && communities.length === 0 && (
                <div className="text-gray-500">커뮤니티가 없습니다.</div>
              )}
              {!loading && !error && communities.map((community) => (
                <Card
                  key={community.communityId}
                  className="w-full h-[186px] rounded-lg border border-[#0000001a]"
                >
                  <CardHeader className="pb-0 pt-6 px-6">
                    <div className="flex justify-between items-start">
                      <CardTitle className="font-medium text-black text-xl leading-7">
                        {community.name}
                      </CardTitle>
                      <Badge
                        className={`bg-[#0080001a] text-[#008000] rounded h-6 px-2 py-1 font-normal text-xs`}
                      >
                        {community.subscriptionLevelCode}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 py-0">
                    <p className="font-normal text-[#000000b2] text-sm leading-5">
                      {community.description}
                    </p>
                  </CardContent>
                  <CardFooter className="px-6 pt-4 pb-6 flex justify-between items-center">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="ml-2 font-normal text-[#00000080] text-sm leading-5">
                        {community.currentMember} / {community.maxMember}명
                      </span>
                    </div>
                    <Button
                      className="bg-black text-white w-[74px] h-9 rounded-md"
                      onClick={() => navigate(`/community/${community.communityId}`)}
                    >
                      입장
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
