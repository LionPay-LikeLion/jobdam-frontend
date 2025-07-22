import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, LayoutGrid, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { useParams } from "react-router-dom";
import CommunityJoinModal from "@/components/CommunityJoinModal";

interface CommunityDetailResponseDto {
  communityId: number;
  name: string;
  description: string;
  subscriptionLevelCode: string;
  ownerNickname: string;
  currentMember: number;
  currentBoard: number;
  enterPoint: number;
  profileImageUrl?: string;
  popularBoards: CommunityBoardListResponseDto[];
}

interface CommunityBoardListResponseDto {
  communityBoardId: number;
  name: string;
  description: string;
  boardTypeCode: string;
  boardStatusCode: string;
}

export default function CommunityHome(): JSX.Element {

  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [isMember, setIsMember] = useState(false);
  const [communityData, setCommunityData] = useState<CommunityDetailResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    checkMemberStatus();
    fetchCommunityData();
    fetchUserPoints();
  }, [id]);

  const checkMemberStatus = async () => {
    try {
      const response = await api.get(`/communities/${id}/members/${user?.userId}/exist`);
      setIsMember(response.data);
    } catch (error) {
      setIsMember(false);
    }
  };

  const fetchCommunityData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/communities/${id}`);
      setCommunityData(response.data);
    } catch (error) {
      console.error("커뮤니티 정보를 가져오는데 실패했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPoints = async () => {
    try {
      const response = await api.get('/user/profile');
      console.log('User profile response:', response.data);
      setUserPoints(response.data.remainingPoints);
    } catch (error) {
      console.error("사용자 포인트를 가져오는데 실패했습니다:", error);
      setUserPoints(0);
    }
  };

  const statsData = [
    {
      icon: <Users className="w-5 h-5" />,
      label: "멤버 수",
      value: communityData?.currentMember?.toLocaleString() || "0",
    },
    {
      icon: <LayoutGrid className="w-6 h-6" />,
      label: "게시판 수",
      value: communityData?.currentBoard?.toString() || "0",
    },
    {
      icon: <FileText className="w-5 h-6" />,
      label: "총 입장 포인트",
      value: communityData?.enterPoint?.toLocaleString() || "0",
    },
  ];

  if (loading) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-6 py-10">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!communityData) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-6 py-10">
        <div className="text-center py-20">
          <p className="text-gray-600">커뮤니티 정보를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page Title */}
      <div className="container mx-auto mt-12 mb-8 px-4 text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">커뮤니티 홈</h1>
        {communityData.description && (
          <p className="text-base text-gray-500 mt-2">{communityData.description}</p>
        )}
      </div>
      {/* Hero Banner */}
      <div className="w-full h-[280px] rounded-xl bg-gradient-to-r from-[#667eea] to-[#764ba2] relative mb-10">
        <div className="absolute inset-0 bg-black/30 rounded-xl">
          <div className="p-16 flex flex-col h-full justify-center">
            <h2 className="text-white text-5xl font-bold leading-[56px] mb-4">
              {communityData.name}
            </h2>
            <p className="text-white/90 text-xl leading-7 mb-8">
              {communityData.description}
            </p>
            {!isMember && (
              <Button className="w-[320px] h-24 bg-white text-black hover:bg-gray-100 rounded-lg shadow-md text-xl font-semibold" onClick={() => setJoinModalOpen(true)}>
                커뮤니티 가입하기
              </Button>
            )}
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

      {/* Popular Boards */}
      {communityData.popularBoards && communityData.popularBoards.length > 0 && (
        <div>
          <h2 className="font-medium text-2xl leading-8 mb-6">인기 게시판</h2>
          <div className="flex flex-col gap-4">
            {communityData.popularBoards
              .filter((board, index, self) =>
                index === self.findIndex(b => b.communityBoardId === board.communityBoardId)
              )
              .map((board) => (
                <Card key={board.communityBoardId} className="shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-lg">{board.name}</h3>
                      <div className="flex items-center gap-1">
                        <LayoutGrid className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600 text-sm">
                          {board.boardTypeCode}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{board.description}</span>
                      <span>{board.boardStatusCode}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      <CommunityJoinModal
        open={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        joinPoint={communityData.enterPoint}
        userPoint={userPoints}
      />
    </>
  );
}
