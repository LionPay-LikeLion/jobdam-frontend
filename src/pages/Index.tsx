import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Bookmark, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

type UserType = "job_seeker" | "agent" | "company";

interface Post {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    type: UserType;
  };
  content: string;
  image?: string;
  likes: number;
  bookmarks: number;
  timestamp: string;
}

const mockPosts: Post[] = [
  {
    id: "1",
    user: {
      name: "김지윤",
      username: "@jiyoon.kim",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      type: "job_seeker"
    },
    content: "스타트업 프론트엔드 개발직 구직 중입니다! React와 Vue.js 경험 있어요 #리액트 #Vue #프론트엔드",
    likes: 32,
    bookmarks: 12,
    timestamp: "2시간"
  },
  {
    id: "2",
    user: {
      name: "카카오엔터프라이즈",
      username: "@kakao_enterprise",
      avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
      type: "company"
    },
    content: "AI 검색 개발팀 채용 중! 백엔드 개발자(Java/Spring) 모집합니다. 경력 3년 이상 우대 #백엔드 #자바 #채용",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop",
    likes: 178,
    bookmarks: 94,
    timestamp: "4시간"
  },
  {
    id: "3",
    user: {
      name: "박선우",
      username: "@park_consultant",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      type: "agent"
    },
    content: "면접 발표 불안 극복 세션을 열었습니다! 이번 주말까지 신청 가능해요. DM으로 문의 주세요 💪",
    likes: 67,
    bookmarks: 28,
    timestamp: "6시간"
  },
  {
    id: "4",
    user: {
      name: "이수민",
      username: "@sumin_designer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      type: "job_seeker"
    },
    content: "포트폴리오 리뷰 세션 정말 유익했어요! 피드백 주신 분들 감사합니다 🎨 #UX디자인 #포트폴리오",
    likes: 45,
    bookmarks: 18,
    timestamp: "8시간"
  },
  {
    id: "5",
    user: {
      name: "GlobalTech Japan",
      username: "@globaltech_jp",
      avatar: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop",
      type: "company"
    },
    content: "Looking for Korean-speaking Data Analysts in Tokyo 🇯🇵 Remote work available! 한국어 가능한 데이터 분석가 모집",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=200&fit=crop",
    likes: 156,
    bookmarks: 73,
    timestamp: "12시간"
  },
  {
    id: "6",
    user: {
      name: "정민호",
      username: "@jung_career_coach",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      type: "agent"
    },
    content: "이력서 첨삭 팁: 성과는 구체적인 숫자로! '매출 20% 증가'가 '매출 향상'보다 강력해요 📈",
    likes: 89,
    bookmarks: 52,
    timestamp: "1일"
  },
  {
    id: "7",
    user: {
      name: "최정아",
      username: "@jungah_dev",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
      type: "job_seeker"
    },
    content: "AWS 자격증 취득 완료! 클라우드 엔지니어 포지션 도전해봅니다 ☁️ #AWS #클라우드 #자격증",
    likes: 76,
    bookmarks: 31,
    timestamp: "1일"
  },
  {
    id: "8",
    user: {
      name: "김영수",
      username: "@kim_interview_expert",
      avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face",
      type: "agent"
    },
    content: "면접관이 가장 싫어하는 답변 TOP 3 공개! 다음주 무료 웨비나에서 자세히 알려드려요 🎯",
    likes: 124,
    bookmarks: 87,
    timestamp: "2일"
  }
];

const userTypeInfo = {
  job_seeker: { label: "구직자", emoji: "🧑‍💼", color: "bg-green-100 text-green-800" },
  agent: { label: "컨설턴트", emoji: "🕵️", color: "bg-blue-100 text-blue-800" },
  company: { label: "기업", emoji: "🏢", color: "bg-purple-100 text-purple-800" }
};

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<UserType | "all">("all");

  const filteredPosts = activeFilter === "all" 
    ? mockPosts 
    : mockPosts.filter(post => post.user.type === activeFilter);

  const filterButtons = [
    { key: "all" as const, label: "전체 피드", emoji: "📝" },
    { key: "job_seeker" as const, label: "구직자", emoji: "👤" },
    { key: "agent" as const, label: "컨설턴트", emoji: "🕵️" },
    { key: "company" as const, label: "기업", emoji: "🏢" }
  ];

  return (
    <div className="min-h-screen bg-background font-korean">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">
              Job<span className="text-foreground">談</span>
            </h1>
            <Link to="/community" className="text-sm text-muted-foreground hover:underline">
              커뮤니티
            </Link>
          </div>
          
          <Button className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            로그인
          </Button>
        </div>
      </header>

      <div className="container max-w-2xl mx-auto px-4 py-6">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterButtons.map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.key)}
              className="flex items-center gap-2"
            >
              <span>{filter.emoji}</span>
              <span className="hidden sm:inline">{filter.label}</span>
            </Button>
          ))}
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                {/* User Info */}
                <div className="flex items-start space-x-3 mb-3">
                  <img
                    src={post.user.avatar}
                    alt={post.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground truncate">
                        {post.user.name}
                      </span>
                      <span className="text-muted-foreground text-sm truncate">
                        {post.user.username}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${userTypeInfo[post.user.type].color}`}
                      >
                        {userTypeInfo[post.user.type].emoji} {userTypeInfo[post.user.type].label}
                      </Badge>
                      <span className="text-muted-foreground text-sm">
                        {post.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-3">
                  <p className="text-foreground leading-normal line-clamp-2">
                    {post.content}
                  </p>
                </div>

                {/* Post Image */}
                {post.image && (
                  <div className="mb-3">
                    <img
                      src={post.image}
                      alt="Post attachment"
                      className="w-full rounded-lg object-cover max-h-64"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-red-500 transition-colors p-2"
                    disabled
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    <span className="text-sm">{post.likes}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-blue-500 transition-colors p-2"
                    disabled
                  >
                    <Bookmark className="h-4 w-4 mr-1" />
                    <span className="text-sm">{post.bookmarks}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">
            <p>Job談:잡담은 취업을 꿈꾸는 사람들을 위한 커뮤니티입니다.</p>
            <p>고객센터: help@jobdam.com | 사업자등록번호: 123-45-67890<br />
                © 2025 돈내고사자 팀. All rights reserved.</p>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;