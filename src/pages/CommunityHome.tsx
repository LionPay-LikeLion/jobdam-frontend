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
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-10">
      {/* 커뮤니티 정보 카드 (Hero) */}
      <div className="w-full flex justify-center items-center pt-12 pb-8">
        <div className="w-full max-w-[900px] bg-gradient-to-r from-pink-200 via-blue-200 to-purple-200 rounded-3xl shadow-2xl px-10 py-10 flex flex-col md:flex-row items-center gap-10 border border-white/60">
          {/* 좌측: 커뮤니티 제목/설명 */}
          <div className="flex-1 flex flex-col items-start justify-center min-w-0">
            <h1 className="text-gray-900 text-4xl md:text-5xl font-extrabold tracking-tight mb-2 truncate drop-shadow">{communityData.name}</h1>
            {communityData.description && (
              <p className="text-gray-700 text-lg md:text-xl font-medium mb-0 truncate max-w-full">{communityData.description}</p>
            )}
          </div>
          {/* 우측: 개설자 프로필/닉네임/등급 */}
          <div className="flex flex-col items-center gap-2 min-w-[160px]">
            {/* 프로필 사진 */}
            {communityData.profileImageUrl ? (
              <img src={communityData.profileImageUrl} alt="개설자 프로필" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-400 border-2 border-white shadow">👤</div>
            )}
            {/* 닉네임 */}
            <span className="font-bold text-gray-800 text-lg mt-1">{communityData.ownerNickname}</span>
            {/* 등급 */}
            {communityData.subscriptionLevelCode === 'PREMIUM' ? (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-bold text-sm shadow border border-yellow-200"><svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.77l-4.77 2.51.91-5.32-3.87-3.77 5.34-.78L10 2z" /></svg>PREMIUM</span>
            ) : (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-500 font-bold text-sm shadow border border-gray-200">BASIC</span>
            )}
          </div>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-[900px] mx-auto">
        {statsData.map((stat, index) => {
          const pastelColors = [
            "bg-pink-100 border-pink-200",
            "bg-blue-100 border-blue-200",
            "bg-purple-100 border-purple-200"
          ];
          return (
            <Card key={index} className={`rounded-2xl shadow-lg border ${pastelColors[index % pastelColors.length]} transition-all`}>
              <CardContent className="p-8 flex flex-col items-center">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/80 mb-3 shadow">
                  {stat.icon}
                </div>
                <span className="font-semibold text-gray-700 mb-1 text-lg">{stat.label}</span>
                <p className="font-extrabold text-3xl text-gray-900 drop-shadow">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {communityData.popularBoards && communityData.popularBoards.length > 0 && (
        <div className="max-w-[900px] mx-auto">
          <h2 className="font-bold text-2xl text-gray-900 mb-6">인기 게시판</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communityData.popularBoards
              .filter((board, index, self) =>
                index === self.findIndex(b => b.communityBoardId === board.communityBoardId)
              )
              .map((board, idx) => {
                const pastelColors = [
                  "bg-pink-50 border-pink-100",
                  "bg-blue-50 border-blue-100",
                  "bg-purple-50 border-purple-100",
                  "bg-yellow-50 border-yellow-100"
                ];
                return (
                  <Card key={board.communityBoardId} className={`rounded-2xl shadow-md border ${pastelColors[idx % pastelColors.length]} transition-all`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-lg text-blue-700">{board.name}</h3>
                        <div className="flex items-center gap-1">
                          <LayoutGrid className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-500 text-sm">
                            {board.boardTypeCode}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span className="line-clamp-1 font-medium">{board.description}</span>
                        <span className="font-bold text-xs px-2 py-0.5 rounded bg-white/80 text-purple-600 ml-2 border border-purple-100 shadow-sm">{board.boardStatusCode}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      )}
      <CommunityJoinModal
        open={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        joinPoint={communityData.enterPoint}
        userPoint={userPoints}
      />
    </div>
  );
}
