import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSnsPostDetail, fetchComments, createComment, updateComment, deleteComment } from "@/lib/snsApi";
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

const SNSFeedPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 댓글 관련 state
  const [comments, setComments] = useState<any[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");

  // 게시글 상세
  useEffect(() => {
    if (postId) {
      fetchSnsPostDetail(Number(postId))
        .then(setPost)
        .finally(() => setLoading(false));
    }
  }, [postId]);

  // 댓글 목록
  useEffect(() => {
    if (postId) {
      fetchComments(Number(postId)).then(setComments);
    }
  }, [postId]);

  // 댓글 등록
  const handleCreateComment = async () => {
    if (!commentInput.trim() || !postId) return;
    await createComment(Number(postId), commentInput);
    setCommentInput("");
    fetchComments(Number(postId)).then(setComments);
  };

  // 댓글 수정
  const handleUpdateComment = async (commentId: number) => {
    if (!editingContent.trim() || !postId) return;
    await updateComment(commentId, Number(postId), editingContent);
    setEditingCommentId(null);
    setEditingContent("");
    fetchComments(Number(postId)).then(setComments);
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    await deleteComment(commentId);
    fetchComments(Number(postId)).then(setComments);
  };

  if (loading) return <div className="text-center py-10">로딩중...</div>;
  if (!post) return <div className="text-center py-10">게시글을 찾을 수 없습니다.</div>;

  return (
    
        <main className="flex-1 px-8 py-8">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-[40px] font-bold leading-[48px] text-center">피드 상세</h1>
            <p className="text-base mt-2 text-center">게시글을 자세히 보고 소통할 수 있습니다.</p>
          </div>

          <Card className="w-[736px] mx-auto mb-8">
            <CardHeader className="px-8 pt-8 pb-4">
              <CardTitle className="text-[32px] font-bold">{post.title}</CardTitle>
              <div className="flex items-center mt-6">
                <Avatar className="h-12 w-12 bg-[#0000001a]" />
                <div className="ml-4">
                  <div className="flex items-center">
                    <span className="font-medium text-lg">{post.nickname}</span>
                    <span className="ml-4 text-sm text-[#00000080]">{new Date(post.createdAt).toLocaleString()}</span>
                    {/* 공개범위, 상태 등은 필요시 Badge로 */}
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
              {/* 이미지 */}
              <div className="w-full h-[373px] bg-[#d8d8d880] mb-7 flex items-center justify-center">
                {post.imageUrl && post.imageUrl !== "string" ? (
                  <img src={post.imageUrl} alt="썸네일" className="max-h-full max-w-full object-cover rounded-md" />
                ) : (
                  <span className="text-gray-400">이미지 없음</span>
                )}
              </div>
              {/* 본문 */}
              <p className="text-lg">{post.content}</p>
              {/* 첨부파일 */}
              {post.attachmentUrl && post.attachmentUrl !== "string" && (
                <div className="bg-[#fff3cd] border border-[#ffeaa7] p-4 rounded-lg">
                  <span className="font-bold text-[#856404] text-sm">첨부파일:</span>
                  <a
                    href={post.attachmentUrl}
                    className="ml-2 text-sm text-[#856404] underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    첨부파일 다운로드
                  </a>
                </div>
              )}
            </CardContent>

            <CardFooter className="px-8 pt-4 pb-6 border-t border-[#0000001a]">
              <div className="flex items-center gap-4 w-full">
                <Button variant="outline" className="bg-[#f0f0f0] h-[43px] gap-2 rounded-md">
                  <Heart className={post.liked ? "text-red-500" : "text-gray-400"} />
                  <span className="text-sm font-medium">{post.likeCount}</span>
                </Button>
                <Button variant="outline" className="bg-[#f0f0f0] h-[43px] gap-2 rounded-md">
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-sm font-medium">{post.commentCount}</span>
                </Button>
                <Button variant="outline" className="bg-[#f0f0f0] h-[43px] gap-2 rounded-md">
                  <Bookmark className={post.bookmarked ? "text-blue-500" : "text-gray-400"} />
                  <span className="text-sm font-medium">북마크</span>
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
      value={commentInput}
      onChange={e => setCommentInput(e.target.value)}
      onKeyDown={e => { if (e.key === "Enter") handleCreateComment(); }}
    />
    <Button className="h-[55px] px-6 rounded-md bg-blue-500 text-white text-sm font-medium" onClick={handleCreateComment}>
      등록
    </Button>
  </div>

  <div className="space-y-4">
    {comments.map((comment) => (
      <Card key={comment.commentId} className="p-6">
        <div className="flex">
          <Avatar className="h-10 w-10 bg-[#0000001a]" />
          <div className="ml-4 flex-1">
            <div className="flex items-center">
              <span className="font-medium text-base">{comment.nickname}</span>
              <span className="ml-4 text-sm text-[#00000080]">{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
            {editingCommentId === comment.commentId ? (
              <div className="flex gap-2 mt-2">
                <Input
                  value={editingContent}
                  onChange={e => setEditingContent(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" onClick={() => handleUpdateComment(comment.commentId)}>저장</Button>
                <Button size="sm" variant="outline" onClick={() => setEditingCommentId(null)}>취소</Button>
              </div>
            ) : (
              <p className="mt-2 text-sm text-black">{comment.content}</p>
            )}
            {/* 수정/삭제 버튼 */}
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" onClick={() => {
                setEditingCommentId(comment.commentId);
                setEditingContent(comment.content);
              }}>수정</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDeleteComment(comment.commentId)}>삭제</Button>
            </div>
          </div>
        </div>
      </Card>
    ))}
  </div>
</div>
        </main>
     
  );
};

export default SNSFeedPost;