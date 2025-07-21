import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiPlus } from "react-icons/fi";
import { fetchCommunities, fetchMyCommunities } from "@/lib/communityApi";
import TopBar from "@/components/TopBar";
import { FaCrown } from "react-icons/fa";

interface Community {
  communityId: number;
  name: string;
  description: string;
  subscriptionLevelCode: string;
  ownerNickname: string;
  maxMember: number;
  currentMember: number;
  enterPoint: number;
  profileImageUrl?: string; // 커뮤니티 이미지 URL 추가
}

const CommunityPage = () => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<"전체" | "가입한 커뮤니티">("전체");

  const fetchData = async (tab: "전체" | "가입한 커뮤니티") => {
    setLoading(true);
    try {
      let data;
      if (tab === "가입한 커뮤니티") {
        data = await fetchMyCommunities();
      } else {
        data = await fetchCommunities();
      }
      setCommunities(data);
    } catch (error) {
      console.error('커뮤니티 데이터 로딩 실패:', error);
      // 임시 데이터로 폴백
      setCommunities([
        {
          communityId: 1,
          name: "React 개발자 커뮤니티",
          description: "React 개발자들을 위한 커뮤니티입니다",
          subscriptionLevelCode: "PREMIUM",
          ownerNickname: "김개발",
          maxMember: 100,
          currentMember: 85,
          enterPoint: 1000
        },
        {
          communityId: 2,
          name: "백엔드 개발자 커뮤니티",
          description: "백엔드 개발자들을 위한 커뮤니티입니다",
          subscriptionLevelCode: "BASIC",
          ownerNickname: "박서버",
          maxMember: 50,
          currentMember: 32,
          enterPoint: 500
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedTab);
  }, [selectedTab]);

  const handleTabChange = (tab: "전체" | "가입한 커뮤니티") => {
    setSelectedTab(tab);
  };

  const handleCreateCommunity = () => { 
    navigate("/community/create");
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-6 py-10">
        <div className="text-center">로딩중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <div className="w-full max-w-[1440px] mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[32px] font-bold leading-10">커뮤니티</h1>
        <button
          onClick={handleCreateCommunity}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          커뮤니티 생성
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => handleTabChange("전체")}
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedTab === "전체"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          전체
        </button>
        <button
          onClick={() => handleTabChange("가입한 커뮤니티")}
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedTab === "가입한 커뮤니티"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          가입한 커뮤니티
        </button>
      </div>

      {/* 커뮤니티 카드 리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {communities.map((community) => {
          const isPremium = community.subscriptionLevelCode === 'PREMIUM';
          return (
            <div
              key={community.communityId}
              className={`flex gap-4 border rounded-lg p-4 items-start bg-white shadow-sm relative transition-all
                ${isPremium ? "border-2 border-yellow-400 shadow-[0_0_16px_#ffe066]" : "border"}
              `}
              style={isPremium ? { boxShadow: "0 0 16px #ffe066, 0 0 0 4px #fffbe6" } : {}}
            >
              <div className="w-[120px] h-[120px] bg-gray-200 rounded flex items-center justify-center overflow-hidden relative">
                {isPremium && (
                  <FaCrown className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-400 text-3xl drop-shadow" />
                )}
                {community.profileImageUrl ? (
                  <img 
                    src={community.profileImageUrl} 
                    alt={community.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`absolute inset-0 flex items-center justify-center ${community.profileImageUrl ? 'hidden' : ''}`}>
                  <span className="text-gray-500 text-sm">이미지</span>
                </div>
              </div>
              <div className="flex-1 pr-24">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-semibold flex items-center">
                    {isPremium && <FaCrown className="text-yellow-400 mr-1" />}
                    {community.name}
                  </h2>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    isPremium
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-400'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {community.subscriptionLevelCode}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 leading-5 mb-4">{community.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FiUser size={16} />
                    <span>{community.currentMember}/{community.maxMember}명 참여 중</span>
                  </div>
                  <span>입장 포인트: {community.enterPoint.toLocaleString()}P</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  생성자: {community.ownerNickname}
                </div>
              </div>
              <button
                onClick={() => navigate(`/community/${community.communityId}`)}
                className="absolute bottom-4 right-4 px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors"
              >
                입장
              </button>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
};

export default CommunityPage;
