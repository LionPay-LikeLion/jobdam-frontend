import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiPlus } from "react-icons/fi";
import { fetchCommunities, fetchMineCommunities, fetchMyCommunities } from "@/lib/communityApi";
import TopBar from "@/components/TopBar";
import { FaCrown } from "react-icons/fa";
import { clsx } from "clsx";

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
  ownerProfileImageUrl?: string; // 생성자 프로필 이미지 URL 추가
}

const CommunityPage = () => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<"전체" | "가입한 커뮤니티" | "내 커뮤니티">("전체");

  const fetchData = async (tab: "전체" | "가입한 커뮤니티" | "내 커뮤니티") => {
    setLoading(true);
    try {
      let data;
      if (tab === "가입한 커뮤니티") {
        data = await fetchMyCommunities();
      } else if (tab === "내 커뮤니티") {
        data = await fetchMineCommunities();
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
          enterPoint: 1000,
          ownerProfileImageUrl: "https://via.placeholder.com/50" // 임시 이미지
        },
        {
          communityId: 2,
          name: "백엔드 개발자 커뮤니티",
          description: "백엔드 개발자들을 위한 커뮤니티입니다",
          subscriptionLevelCode: "BASIC",
          ownerNickname: "박서버",
          maxMember: 50,
          currentMember: 32,
          enterPoint: 500,
          ownerProfileImageUrl: "https://via.placeholder.com/50" // 임시 이미지
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedTab);
  }, [selectedTab]);

  const handleTabChange = (tab: "전체" | "가입한 커뮤니티" | "내 커뮤니티") => {
    setSelectedTab(tab);
  };

  const handleCreateCommunity = () => {
    navigate("/communities/create");
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-6 py-10">
        <div className="text-center">로딩중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-korean">
      <TopBar />
      {/* 상단 타이틀/설명 영역 (피드와 통일) */}
      <div className="w-full py-10 px-4 md:px-0 bg-white shadow-sm border-b border-gray-100 mb-10">
        <div className="max-w-[900px] mx-auto flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">커뮤니티</h1>
          <p className="text-base md:text-lg text-gray-500 font-medium">관심 있는 커뮤니티에 참여하고 소통해보세요.</p>
        </div>
      </div>
      <div className="w-full max-w-[1100px] mx-auto px-4 md:px-0">
        {/* 상단 버튼/탭 */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => handleTabChange("전체")}
              className={`px-4 py-2 rounded-md transition-colors font-medium ${selectedTab === "전체"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-blue-50"}`}
            >
              전체
            </button>
            <button
              onClick={() => handleTabChange("가입한 커뮤니티")}
              className={`px-4 py-2 rounded-md transition-colors font-medium ${selectedTab === "가입한 커뮤니티"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-blue-50"}`}
            >
              가입한 커뮤니티
            </button>
            <button
              onClick={() => handleTabChange("내 커뮤니티")}
              className={`px-4 py-2 rounded-md transition-colors font-medium ${selectedTab === "내 커뮤니티"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-blue-50"}`}
            >
              내 커뮤니티
            </button>
          </div>
          <button
            onClick={handleCreateCommunity}
            className="flex items-center gap-2 border border-blue-300 text-blue-600 bg-white hover:bg-blue-50 px-4 py-2 rounded-md font-medium transition shadow-sm"
          >
            <FiPlus className="w-4 h-4" />
            커뮤니티 생성
          </button>
        </div>
        {/* 커뮤니티 카드 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {communities.map((community) => {
            const isPremium = community.subscriptionLevelCode === 'PREMIUM';
            return (
              <div
                key={community.communityId}
                onClick={() => navigate(`/communities/${community.communityId}`)}
                className={`
                  flex gap-4 border rounded-lg p-8 items-start relative transition-all cursor-pointer hover:shadow-lg hover:scale-[1.02]
                  ${isPremium
                    ? "border-4 border-yellow-400 bg-gradient-to-br from-yellow-50 via-white to-yellow-100 shadow-[0_0_24px_#ffe066] ring-2 ring-yellow-200/80"
                    : "border bg-white shadow-sm"
                  }
                  min-h-[180px] md:min-h-[200px]
                `}
                style={isPremium ? { boxShadow: "0 0 24px #ffe066, 0 0 0 6px #fffbe6" } : {}}
              >
                {/* 오른쪽 위 왕관 */}
                {isPremium && (
                  <span className="absolute top-[-28px] right-6 animate-bounce z-20">
                    <FaCrown
                      className="text-yellow-400 drop-shadow-lg"
                      style={{
                        fontSize: 48,
                        filter: "drop-shadow(0 0 12px gold)",
                        textShadow: "0 0 8px #ffe066, 0 0 16px #ffd700"
                      }}
                    />
                  </span>
                )}
                {/* 커뮤니티 이미지 */}
                <div className="w-[120px] h-[120px] bg-gray-200 rounded flex items-center justify-center overflow-hidden relative">
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
                  ) : (
                    <span className="text-gray-500 text-sm">이미지</span>
                  )}
                </div>
                {/* 본문 */}
                <div className="flex-1 pr-24 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-bold flex items-center text-gray-900">
                      {isPremium && <FaCrown className="text-yellow-400 mr-1" />}
                      {community.name}
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 leading-5 mb-4 line-clamp-2">{community.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-1">
                    <div className="flex items-center gap-1">
                      <FiUser size={16} />
                      <span>{community.currentMember}/{community.maxMember}명 참여 중</span>
                    </div>
                  </div>
                </div>
             {/* 오른쪽 위 생성자(닉네임 + 프사, 가로 정렬, 크기 맞춤) */}
                <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
                  <span className="font-bold text-gray-700 text-base">{community.ownerNickname}</span>
                  {community.ownerProfileImageUrl ? (
                    <img
                      src={community.ownerProfileImageUrl}
                      alt={community.ownerNickname}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                    />
                  ) : (
                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-400 text-xl">👤</span>
                  )}
                </div>
                {/* 입장 포인트 박스 */}
                <div className="absolute bottom-4 right-4">
                  <div className="px-5 py-2 bg-black text-white text-base rounded-md font-bold shadow-md select-none">
                    {community.enterPoint.toLocaleString()} POINT
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
