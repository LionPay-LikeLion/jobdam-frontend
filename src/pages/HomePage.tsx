import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TopBar from "@/components/TopBar";
import {
  Users,
  MessageSquare,
  Crown,
  Briefcase,
  User,
  Building2,
  Building,
  Search,
} from "lucide-react";



const coreFeatures = [
  {
    icon: <Users className="w-6 h-6 text-white" />,
    bgColor: "bg-[#4285f4]",
    title: "SNS 기반 피드 & 커뮤니티",
    description:
      "실시간 소통과 정보 공유가 가능한 SNS 환경에서 취업 준비생들과 네트워킹하세요.",
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-white" />,
    bgColor: "bg-[#34a853]",
    title: "AI 자소서 첨삭 / 실시간 채팅",
    description:
      "AI 기반 자기소개서 첨삭 서비스와 실시간 채팅으로 즉시 피드백을 받아보세요.",
  },
  {
    icon: <Crown className="w-6 h-6 text-white" />,
    bgColor: "bg-[#fbbc04]",
    title: "프리미엄 구독 혜택",
    description:
      "구독 서비스를 통해 전문가 멘토링, 우선 매칭, 독점 콘텐츠 등 특별한 혜택을 누리세요.",
  },
  {
    icon: <Briefcase className="w-6 h-6 text-white" />,
    bgColor: "bg-[#ea4335]",
    title: "실무자 멘토링 / 기업 네트워킹",
    description:
      "현직 실무자와의 1:1 멘토링과 기업 담당자와의 직접적인 네트워킹 기회를 제공합니다.",
  },
];

const platformFlow = [
  {
    icon: <User className="w-10 h-10 text-white" />,
    bgColor: "bg-[#4285f4]",
    title: "구직자",
    description:
      "AI 첨삭, 멘토링을 통해 역량을 강화하고 맞춤형 채용 기회를 제공받습니다.",
  },
  {
    icon: <Building2 className="w-10 h-10 text-white" />,
    bgColor: "bg-[#34a853]",
    title: "실무자",
    description:
      "전문 지식을 공유하고 콘텐츠를 작성하며 업계 네트워킹을 확장합니다.",
  },
  {
    icon: <Building className="w-10 h-10 text-white" />,
    bgColor: "bg-[#fbbc04]",
    title: "기업",
    description:
      "커뮤니티를 운영하고 통계 분석을 통해 효과적인 인재 채용을 진행합니다.",
  },
];

const popularCommunities = [
  {
    title: "Frontend",
    color: "bg-[#4285f4]",
    description: "React, Vue, Angular 등 프론트엔드 기술 스택을 공유하고 개발 정보를 나누는 커뮤니티",
    count: "12,847명",
  },
  {
    title: "Backend",
    color: "bg-[#34a853]",
    description: "Java, Python, Node.js 등 서버 개발 기술과 채용 공고를 공유하는 전문 커뮤니티",
    count: "9,523명",
  },
  {
    title: "Design",
    color: "bg-[#ea4335]",
    description: "디자인 포트폴리오 피드백과 UX/UI 트렌드, 취업 정보를 나누는 디자이너 커뮤니티",
    count: "7,091명",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div className="min-h-screen flex flex-col bg-white font-korean">
      
      <TopBar />

      {/* Main */}
      <main className="flex-1">
        {/* Hero */}
        <section className="w-full bg-[#ffbc83] py-24 text-center">
          <div className="flex flex-col items-center max-w-[786px] mx-auto">
            <img
              className="w-[200px] h-[200px] object-contain mb-6"
              alt="JobDam Illustration"
              src="/images/logo.png"
            />
            <h1 className="text-4xl font-bold text-black mb-4">
              취업은 더 이상 혼자 준비하는 싸움이 아닙니다.
            </h1>
            <p className="text-lg text-[#000000b2] mb-10">
              SNS 기반 커뮤니티에서 사람과 기회, 정보를 연결하는 구독형 취업 매칭 플랫폼 – 지금 함께하세요.
            </p>
            <div className="flex gap-4">
              <Button
                className="h-[48px] px-6 bg-white text-black border border-[#0000001a] rounded-md"
                onClick={() => navigate("/login")}
              >
                로그인
              </Button>
              <Button
                className="h-[48px] px-6 bg-[#4285f4] text-white rounded-md"
                onClick={() => navigate("/signup")}
              >
                회원가입
              </Button>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="w-full py-20 bg-white">
          <div className="container">
            <h2 className="text-4xl font-bold text-black text-center mb-12 leading-[44px]">
              핵심 기능
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coreFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="border border-[#00000014] shadow-[0px_2px_8px_#00000014] rounded-xl p-6"
                >
                  <div
                    className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-6`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-4 leading-7">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#000000b2] leading-[21px]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Flow */}
        <section className="w-full py-20 bg-[#f8f9fa]">
          <div className="container">
            <h2 className="text-4xl font-bold text-black text-center mb-12 leading-[44px]">
              플랫폼 이용 흐름
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {platformFlow.map((flow, index) => (
                <div key={index} className="flex flex-col items-center text-center max-w-[280px]">
                  <div
                    className={`w-20 h-20 ${flow.bgColor} rounded-2xl flex items-center justify-center mb-6`}
                  >
                    {flow.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-4 leading-7">
                    {flow.title}
                  </h3>
                  <p className="text-sm text-[#000000b2] leading-[21px]">
                    {flow.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Communities */}
        <section className="w-full py-20 bg-white">
          <div className="container">
            <h2 className="text-4xl font-bold text-black text-center mb-12 leading-[44px]">
              인기 커뮤니티
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {popularCommunities.map((community, index) => (
                <div
                  key={index}
                  className="border border-[#00000014] shadow-[0px_2px_8px_#00000014] rounded-xl p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-12 h-12 ${community.color} rounded-lg flex items-center justify-center`}
                    >
                      <span className="text-white font-semibold">
                        {community.title.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-black">
                        {community.title}
                      </h3>
                      <p className="text-sm text-[#000000b2]">
                        {community.count}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-[#000000b2] leading-[21px]">
                    {community.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-6 text-center text-sm text-gray-500">
        © 2025 돈내고사자 팀. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
