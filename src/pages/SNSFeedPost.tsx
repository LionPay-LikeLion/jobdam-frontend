import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bookmark, Flag, Heart, MessageSquare } from "lucide-react";
import TopBar from "@/components/TopBar";

const postTags = ["#면접후기", "#포트폴리오", "#이직준비", "#마케팅"];

const responsibilities = [
  "브랜드 마케팅 전략 수립 및 실행",
  "디지털 마케팅 캠페인 기획 및 운영",
  "소셜미디어 마케팅 및 인플루언서 협업",
  "고객 데이터 분석 및 인사이트 도출",
  "크로스 플랫폼 마케팅 통합 운영",
];

const achievements = [
  "신제품 런칭 캠페인: 목표 대비 150% 달성",
  "브랜드 인지도 35% 향상",
  "소셜미디어 팔로워 200% 증가",
  "ROI 평균 320% 달성",
];

const questions = [
  "포트폴리오에 포함해야 할 핵심 요소",
  "프로젝트별 적정한 분량",
  "수치화된 성과 표현 방법",
  "개인정보 보호를 위한 데이터 처리 방법",
];

const comments = [
  {
    name: "김개발자",
    time: "2시간 전",
    content: "정말 유용한 정보네요! 저도 비슷한 경험이 있어서 공감됩니다. 특히 포트폴리오 부분이 도움이 많이 되었어요.",
  },
  {
    name: "박마케터",
    time: "1시간 전",
    content: "면접 준비할 때 이런 글이 있었으면 좋았을 텐데요. 신입분들에게 정말 도움이 될 것 같습니다!",
  },
  {
    name: "이디자이너",
    time: "30분 전",
    content: "저도 곧 이직 준비 중인데 많은 도움이 되었습니다. 혹시 포트폴리오 피드백도 받을 수 있을까요?",
  },
];

const SnsFeedPost = () => {
  return (
    
        <main className="flex-1 px-8 py-8">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-[40px] font-bold leading-[48px] text-center">피드 상세</h1>
            <p className="text-base mt-2 text-center">게시글을 자세히 보고 소통할 수 있습니다.</p>
          </div>

          <Card className="w-[736px] mx-auto mb-8">
            <CardHeader className="px-8 pt-8 pb-4">
              <CardTitle className="text-[32px] font-bold">마케터 3년차, 이직 타이밍과 포트폴리오 방향에 대한 고민</CardTitle>
              <div className="flex items-center mt-6">
                <Avatar className="h-12 w-12 bg-[#0000001a]" />
                <div className="ml-4">
                  <div className="flex items-center">
                    <span className="font-medium text-lg">홍길동</span>
                    <span className="ml-4 text-sm text-[#00000080]">2024년 1월 15일</span>
                    <Badge className="ml-4 bg-[#0000000d] text-[#34c759]">전체 공개</Badge>
                    <Badge className="ml-2 bg-[#0000000d] text-black">게시됨</Badge>
                    <Badge className="ml-auto bg-[#0000000d] text-black">구직자</Badge>
                  </div>
                  <div className="flex mt-4 gap-2">
                    {postTags.map((tag, index) => (
                      <Badge
                        key={`tag-${index}`}
                        className="bg-[#f0f0f0] text-black rounded-[20px] px-3 py-1 text-sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-8 space-y-4">
              <div className="w-full h-[373px] bg-[#d8d8d880] mb-7"></div>
              <p>안녕하세요, B2C D2C 브랜드 마케팅 업무를 3년 넘게 해오고 있는 마케터입니다. 현재는 이직을 고려 중인데, 막상 포트폴리오를 만들려니 막막하네요.</p>
              <p>지금까지 담당했던 주요 업무는 다음과 같습니다:</p>
              <ul className="list-disc list-inside space-y-1">
                {responsibilities.map((item, index) => (
                  <li key={`res-${index}`}>{item}</li>
                ))}
              </ul>
              <p>특히 작년에 진행한 신제품 런칭 캠페인에서는 목표 대비 150%의 성과를 달성했고, 브랜드 인지도도 크게 향상시킬 수 있었습니다.</p>
              <div className="bg-[#f8f9fa] border-l-4 border-[#007aff] p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">주요 성과</h3>
                <ul className="space-y-1 text-sm">
                  {achievements.map((ach, index) => (
                    <li key={`ach-${index}`}>• {ach}</li>
                  ))}
                </ul>
              </div>
              <p>하지만 포트폴리오를 정리하면서 고민이 생겼습니다. 어떤 프로젝트를 중심으로 구성해야 할지, 어느 정도의 디테일까지 포함해야 할지 감이 잘 안 잡히네요.</p>
              <p>혹시 비슷한 경험이 있으신 분들이나 채용 담당자 분들의 조언을 듣고 싶습니다. 특히 다음과 같은 부분에 대해 궁금합니다:</p>
              <ul className="list-disc list-inside space-y-1">
                {questions.map((q, index) => (
                  <li key={`q-${index}`}>{q}</li>
                ))}
              </ul>
              <div className="bg-[#fff3cd] border border-[#ffeaa7] p-4 rounded-lg">
                <span className="font-bold text-[#856404] text-sm">첨부파일:</span>
                <span className="ml-2 text-sm text-[#856404]">포트폴리오_초안_v1.pdf (2.3MB)</span>
              </div>
              <p>많은 분들의 조언 부탁드립니다. 댓글로 남겨주시거나 개인 메시지로도 괜찮습니다. 감사합니다!</p>
            </CardContent>

            <CardFooter className="px-8 pt-4 pb-6 border-t border-[#0000001a]">
              <div className="flex items-center gap-4 w-full">
                <Button variant="outline" className="bg-[#f0f0f0] h-[43px] gap-2 rounded-md">
                  <Heart className="h-5 w-5" />
                  <span className="text-sm font-medium">47</span>
                </Button>
                <Button variant="outline" className="bg-[#f0f0f0] h-[43px] gap-2 rounded-md">
                  <Bookmark className="h-5 w-5" />
                  <span className="text-sm font-medium">북마크</span>
                </Button>
                <Button variant="outline" className="bg-[#f0f0f0] h-[43px] gap-2 rounded-md">
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-sm font-medium">12</span>
                </Button>
                <div className="ml-auto flex gap-2">
                  <Button variant="outline" className="bg-[#f0f0f0] h-[37px] rounded-md">수정</Button>
                  <Button variant="destructive" className="bg-[#ff3b30] h-[37px] rounded-md">삭제</Button>
                  <Button variant="outline" className="bg-[#f0f0f0] h-[37px] gap-1 rounded-md">
                    <Flag className="h-4 w-4" />
                    <span className="text-sm font-medium">신고</span>
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>

          {/* Comments */}
          <div className="w-[736px] mx-auto">
  <h2 className="text-2xl font-bold mb-4">댓글</h2>
  <div className="flex items-center gap-2 mb-6">
    <Input
      className="h-[55px] px-4 py-4 text-sm flex-1"
      placeholder="댓글을 입력하세요"
    />
    <Button className="h-[55px] px-6 rounded-md bg-blue-500 text-white text-sm font-medium">
      등록
    </Button>
  </div>

  <div className="space-y-4">
    {comments.map((comment, index) => (
      <Card key={`comment-${index}`} className="p-6">
        <div className="flex">
          <Avatar className="h-10 w-10 bg-[#0000001a]" />
          <div className="ml-4">
            <div className="flex items-center">
              <span className="font-medium text-base">{comment.name}</span>
              <span className="ml-4 text-sm text-[#00000080]">{comment.time}</span>
            </div>
            <p className="mt-2 text-sm text-black">{comment.content}</p>
          </div>
        </div>
      </Card>
    ))}
  </div>
</div>
        </main>
     
  );
};

export default SnsFeedPost;