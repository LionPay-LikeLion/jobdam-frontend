import React, { useState } from "react";
import { FiUser } from "react-icons/fi";
import TopBar from "../components/TopBar";
import { useNavigate } from "react-router-dom";

const dummyCommunities = [
  {
    id: 1,
    title: "취업 준비 개발자 모임",
    description:
      "함께 성장하는 개발자들의 취업 준비 커뮤니티입니다. 코딩테스트, 면접 준비, 포트폴리오 리뷰 등을 함께해요.",
    participants: 124,
    imageUrl: "https://placehold.co/120x120",
    joined: true,
  },
  {
    id: 2,
    title: "프론트엔드 스터디",
    description:
      "React, Vue, Angular 등 최신 프론트엔드 기술을 학습하고 프로젝트를 진행합니다.",
    participants: 89,
    imageUrl: "https://placehold.co/120x120",
    joined: true,
  },
  {
    id: 3,
    title: "UI/UX 디자이너 네트워킹",
    description:
      "디자이너들의 포트폴리오 공유와 피드백, 취업 정보를 나누는 공간입니다.",
    participants: 67,
    imageUrl: "https://placehold.co/120x120",
    joined: true,
  },
  {
    id: 4,
    title: "백엔드 개발자 모임",
    description:
      "Java, Python, Node.js 등 백엔드 기술 스택을 다루는 개발자들의 모임입니다.",
    participants: 156,
    imageUrl: "https://placehold.co/120x120",
    joined: false,
  },
  {
    id: 5,
    title: "데이터 사이언스 연구회",
    description:
      "머신러닝, 딥러닝, 데이터 분석 기술을 연구하고 실무 프로젝트를 진행합니다.",
    participants: 78,
    imageUrl: "https://placehold.co/120x120",
    joined: false,
  },
  {
    id: 6,
    title: "스타트업 창업 준비",
    description:
      "창업을 꿈꾸는 사람들이 모여 아이디어를 공유하고 팀을 구성하는 공간입니다.",
    participants: 45,
    imageUrl: "https://placehold.co/120x120",
    joined: false,
  },
  {
    id: 7,
    title: "모바일 앱 개발자",
    description:
      "iOS, Android 네이티브 및 크로스플랫폼 앱 개발 기술을 공유합니다.",
    participants: 92,
    imageUrl: "https://placehold.co/120x120",
    joined: true,
  },
  {
    id: 8,
    title: "웹 퍼블리셔 모임",
    description:
      "HTML, CSS, JavaScript를 활용한 웹 퍼블리싱 기술과 노하우를 나눕니다.",
    participants: 63,
    imageUrl: "https://placehold.co/120x120",
    joined: false,
  },
];



const CommunityPage = () => {
  const navigate = useNavigate();

  const handleCreateCommunity = () => { 
    navigate("/community/create");
  };

  const [selectedTab, setSelectedTab] = useState<"전체" | "가입한 커뮤니티">("전체");

  const filteredCommunities =
    selectedTab === "전체"
      ? dummyCommunities
      : dummyCommunities.filter((c) => c.joined);

  return (
    <div className="min-h-screen bg-white font-korean">
      <TopBar />
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center mb-2">커뮤니티 소개</h1>
        <p className="text-center text-base text-gray-700 mb-10">
          커뮤니티는 멤버들에게 다양한 정보와 소통 공간을 제공합니다. <br />
          가입 후 게시판 열람 및 글쓰기가 가능합니다.
        </p>

        {/* 검색 및 상단 필터 */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              placeholder="커뮤니티 검색"
              className="w-[280px] h-[42px] border border-gray-300 rounded-md px-4 text-sm"
            />
            <select className="h-[42px] border border-gray-300 rounded-md px-3 text-sm">
              <option>최신순</option>
              <option>인기순</option>
            </select>
          </div>

          <button
            onClick={handleCreateCommunity}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm rounded-md"
          >
            + 커뮤니티 생성
          </button>
        </div>

        {/* 탭 */}
        <div className="flex gap-4 text-sm font-medium mb-8">
          <button
            className={`pb-1 ${selectedTab === "전체" ? "border-b-2 border-black text-black" : "text-gray-400"}`}
            onClick={() => setSelectedTab("전체")}
          >
            전체
          </button>
          <button
            className={`pb-1 ${selectedTab === "가입한 커뮤니티" ? "border-b-2 border-black text-black" : "text-gray-400"}`}
            onClick={() => setSelectedTab("가입한 커뮤니티")}
          >
            내가 가입한 커뮤니티
          </button>
        </div>

        {/* 커뮤니티 카드 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCommunities.map((community) => (
            <div
              key={community.id}
              className="flex gap-4 border rounded-lg p-4 items-start bg-white shadow-sm relative"
            >
              <img
                src={community.imageUrl}
                alt="커뮤니티 이미지"
                className="w-[120px] h-[120px] object-cover rounded"
              />
              <div className="flex-1 pr-24">
                <h2 className="text-xl font-semibold">{community.title}</h2>
                <p className="text-sm text-gray-600 mt-1 leading-5">{community.description}</p>
                <div className="flex items-center gap-1 mt-4 text-sm text-gray-500">
                  <FiUser size={16} />
                  <span>{community.participants}명 참여 중</span>
                </div>
              </div>
              <button className="absolute bottom-4 right-4 px-4 py-2 bg-black text-white text-sm rounded-md">
                가입하기
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
