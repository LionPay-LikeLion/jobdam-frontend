// src/pages/SNSFeedPost.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchSnsPostDetail,
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
  likeSnsPost,
  unlikeSnsPost,
  addBookmark,
  removeBookmark,
  deleteSnsPost,
} from "@/lib/snsApi";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bookmark, Flag, Heart, MessageSquare, Download } from "lucide-react";
import ReportModal from "@/components/ReportModal";
import { useAuth } from "@/contexts/AuthContext";
import { FiEdit, FiTrash2, FiFlag } from "react-icons/fi";

// 간단한 커스텀 모달 컴포넌트
function ConfirmModal({ open, message, onConfirm, onCancel }: { open: boolean, message: string, onConfirm: () => void, onCancel: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 min-w-[300px]">
        <p className="mb-6 text-lg text-center">{message}</p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={onCancel}>취소</Button>
          <Button onClick={onConfirm}>확인</Button>
        </div>
      </div>
    </div>
  );
}

const postTags = ["#면접후기", "#포트폴리오", "#이직준비", "#마케팅"];

const SNSFeedPost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 댓글 관련 state
  const [comments, setComments] = useState<any[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<{ [key: number]: string }>({});

  // 신고 모달 state
  const [showReport, setShowReport] = useState(false);
  const [reportTargetId, setReportTargetId] = useState<number | null>(null);
  const [reportTypeCodeId, setReportTypeCodeId] = useState<number>(1); // 게시글=1, 댓글=2

  // 좋아요 확인 모달 state
  const [showLikeConfirm, setShowLikeConfirm] = useState(false);
  const [showBookmarkConfirm, setShowBookmarkConfirm] = useState(false);

  // 게시글 상세
  useEffect(() => {
    if (postId) {
      fetchSnsPostDetail(Number(postId))
          .then((data) => setPost(data))
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
    if (!editingContent[commentId]?.trim() || !postId) return;
    await updateComment(commentId, editingContent[commentId]);
    setEditingCommentId(null);
    setEditingContent(prev => ({ ...prev, [commentId]: "" })); // 수정 후 내용 초기화
    fetchComments(Number(postId)).then(setComments);
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!commentId) {
      alert("댓글 ID가 올바르지 않습니다.");
      return;
    }
    await deleteComment(commentId);
    fetchComments(Number(postId)).then(setComments);
  };

  // 좋아요 토글
  const handleToggleLike = async () => {
    if (!post) return;
    if (post.liked) {
      await unlikeSnsPost(post.snsPostId);
    } else {
      await likeSnsPost(post.snsPostId);
    }
    const updatedPost = await fetchSnsPostDetail(post.snsPostId);
    setPost(updatedPost);
  };

  // 북마크 토글
  const handleToggleBookmark = async () => {
    if (!post || typeof post.snsPostId !== "number") {
      console.error("post 또는 postId가 유효하지 않음:", post);
      return;
    }
    if (post.bookmarked) {
      await removeBookmark(post.snsPostId);
    } else {
      await addBookmark(post.snsPostId);
    }
    const updatedPost = await fetchSnsPostDetail(post.snsPostId);
    setPost(updatedPost);
  };

  // 게시글 수정 페이지 이동
  const handleEditPost = () => {
    navigate(`/sns/posts/${postId}/edit`);
  };

  // 게시글 삭제
  const handleDeletePost = async (postId: number) => {
    if (!window.confirm("정말 게시글을 삭제하시겠습니까?")) return;

    try {
      await deleteSnsPost(postId);
      navigate("/"); // 삭제 후 루트로 이동
    } catch (err) {
      console.error("게시글 삭제 실패:", err);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  // 첨부파일 다운로드
  const handleDownloadAttachment = async (url: string) => {
    try {
      const link = document.createElement("a");
      link.href = url;
      link.download = url.split("/").pop() || "attachment";
      link.target = "_blank";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      window.open(url, "_blank");
    }
  };

  if (loading) return <div className="text-center py-10">로딩중...</div>;
  if (!post) return <div className="text-center py-10">게시글을 찾을 수 없습니다.</div>;

  // post의 실제 PK명 자동 추론
  const snsPostId = post.snsPostId ?? post.id ?? post.postId ?? null;

  return (
      <div className="bg-white min-h-screen w-full flex">
        {/* === SNS 사이드바 영역이 따로 있다면 여기에 컴포넌트 삽입(생략) === */}

        {/* 메인 */}
        <main className="flex-1 flex flex-col items-center px-8 py-8">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-[40px] font-bold leading-[48px] text-center">피드 상세</h1>
            <p className="text-base mt-2 text-center">게시글을 자세히 보고 소통할 수 있습니다.</p>
          </div>

          {/* ===== 게시글 ===== */}
          <Card className="w-[736px] mx-auto mb-8 relative">
            {/* 오른쪽 상단 아이콘 */}
            <div className="absolute top-6 right-8 flex gap-4 z-10">
              <button onClick={() => setShowLikeConfirm(true)}>
                <Heart
                  className={post.liked ? "text-red-500 w-8 h-8" : "text-gray-300 w-8 h-8"}
                  fill={post.liked ? "red" : "none"}
                />
              </button>
              <button onClick={() => setShowBookmarkConfirm(true)}>
                <Bookmark
                  className={post.bookmarked ? "text-blue-500 w-8 h-8" : "text-gray-300 w-8 h-8"}
                  fill={post.bookmarked ? "#2563eb" : "none"}
                />
              </button>
            </div>
            <CardHeader className="px-8 pt-8 pb-4">
              <CardTitle className="text-[32px] font-bold">{post.title}</CardTitle>
              <div className="flex items-center mt-6">
                <Avatar className="h-12 w-12 bg-[#0000001a]">
                  {post.profileImageUrl ? (
                    <img
                      src={post.profileImageUrl}
                      alt={post.nickname}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-gray-400 text-2xl">👤</span>
                  )}
                </Avatar>
                <div className="ml-4">
                  <div className="flex items-center">
                    <span className="font-medium text-lg">{post.nickname}</span>
                    <span className="ml-4 text-sm text-[#00000080]">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
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
              <div className="w-full h-[373px] bg-[#d8d8d880] mb-7 flex items-center justify-center">
                {post.imageUrl && post.imageUrl !== "string" ? (
                    <img
                        src={post.imageUrl}
                        alt="썸네일"
                        className="max-h-full max-w-full object-cover rounded-md"
                    />
                ) : (
                    <span className="text-gray-400">이미지 없음</span>
                )}
              </div>
              <p className="text-lg">{post.content}</p>
              {post.attachmentUrl && post.attachmentUrl !== "string" && (
                  <div className="bg-[#fff3cd] border border-[#ffeaa7] p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#856404] text-sm">첨부파일:</span>
                        <span className="ml-2 text-sm text-[#856404]">
                      {post.attachmentUrl.split("/").pop() || "첨부파일"}
                    </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                            onClick={() => handleDownloadAttachment(post.attachmentUrl)}
                            className="bg-[#856404] text-white px-3 py-1 rounded text-sm hover:bg-[#6c5b3b] transition-colors flex items-center gap-1"
                        >
                          <Download className="w-4 h-4" />
                          다운로드
                        </Button>
                        <Button
                            onClick={() => {
                              const url = post.attachmentUrl;
                              if (url) window.open(url, "_blank");
                            }}
                            variant="outline"
                            className="px-3 py-1 rounded text-sm border-[#856404] text-[#856404] hover:bg-[#856404] hover:text-white transition-colors"
                        >
                          새 창에서 열기
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-[#856404]">
                      백엔드 서버가 실행되지 않은 경우 "새 창에서 열기" 버튼을 사용하세요.
                    </div>
                  </div>
              )}
            </CardContent>

            <CardFooter className="px-8 pt-4 pb-6 border-t border-[#0000001a]">
              <div className="flex items-center gap-4 w-full">
                <Button
                    variant="outline"
                    className="bg-[#f0f0f0] h-[43px] gap-2 rounded-md">
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-sm font-medium">{post.commentCount}</span>
                </Button>
                <div className="ml-auto flex gap-2">
                  {post.userId === user?.id && (
                    <>
                      <Button
                          variant="outline"
                          className="bg-[#f0f0f0] h-[37px] rounded-md"
                          onClick={handleEditPost}
                      >
                        수정
                      </Button>
                      <Button
                          variant="destructive"
                          className="bg-[#ff3b30] h-[37px] rounded-md"
                          onClick={() => handleDeletePost(post.snsPostId)}
                      >
                        삭제
                      </Button>
                    </>
                  )}
                  <Button
                      variant="outline"
                      className="bg-[#f0f0f0] h-[37px] gap-1 rounded-md"
                      onClick={() => {
                        setReportTargetId(snsPostId);
                        setReportTypeCodeId(1); // 게시글(커뮤니티/SNS 모두 1)
                        setShowReport(true);
                      }}
                      disabled={!snsPostId}
                  >
                    <Flag className="h-4 w-4" />
                    <span className="text-sm font-medium">신고</span>
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>

          {/* === 댓글 목록 및 입력 === */}
          <div className="w-[736px] mx-auto mb-12">
            {/* 댓글 목록 */}
            {comments.map((comment) => {
              // 삭제된 댓글 처리
              if (comment.boardStatusCode === "DELETED") {
                return (
                  <Card key={comment.commentId} className="p-6 mb-4 bg-gray-100 text-gray-400">
                    <div className="text-center py-4 text-base font-semibold">
                      삭제된 댓글입니다.
                    </div>
                  </Card>
                );
              }

              // 댓글의 실제 PK 추출
              const commentId =
                comment.snsCommentId ??
                comment.communityCommentId ??
                comment.commentId ??
                null;

              // 정상 댓글 렌더링 (기존 코드)
              return (
                <Card key={commentId} className="p-6 mb-4 relative">
                  {/* 신고 버튼: 오른쪽 위, 빨간색 */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 text-red-500"
                    onClick={() => {
                      setReportTargetId(commentId);
                      setReportTypeCodeId(2);
                      setShowReport(true);
                    }}
                    title="신고"
                  >
                    <FiFlag />
                  </Button>
                  <div className="flex">
                    <Avatar className="h-10 w-10 bg-[#0000001a]">
                      {comment.profileImageUrl ? (
                        <img
                          src={comment.profileImageUrl}
                          alt={comment.nickname}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-gray-400 text-xl">👤</span>
                      )}
                    </Avatar>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center">
                        <span className="font-medium text-base">{comment.nickname}</span>
                        <span className="ml-4 text-sm text-[#00000080]">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {String(editingCommentId) === String(commentId) ? (
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={editingContent[commentId] ?? ""}
                            onChange={e =>
                              setEditingContent(prev => ({
                                ...prev,
                                [commentId]: e.target.value,
                              }))
                            }
                            className="flex-1"
                          />
                          <Button size="sm" onClick={() => handleUpdateComment(commentId)}>
                            저장
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingCommentId(null)}
                          >
                            취소
                          </Button>
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-black">{comment.content}</p>
                      )}
                      {/* 수정/삭제 버튼: 오른쪽 아래 */}
                      <div className="flex gap-2 mt-2 justify-end">
                        {String(comment.userId) === String(user?.id) && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                setEditingCommentId(commentId);
                                setEditingContent(prev => ({
                                  ...prev,
                                  [commentId]: comment.content,
                                }));
                              }}
                              title="수정"
                            >
                              <FiEdit />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDeleteComment(commentId)}
                              title="삭제"
                            >
                              <FiTrash2 />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}

            {/* 댓글 입력창 */}
            <form
                className="flex mt-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateComment();
                }}
            >
              <Input
                  className="flex-1"
                  placeholder="댓글을 입력하세요"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  maxLength={300}
              />
              <Button type="submit" className="ml-2 px-8">
                등록
              </Button>
            </form>
          </div>
        </main>

        {/* 신고 모달 */}
        <ReportModal
            open={showReport}
            onClose={() => setShowReport(false)}
            targetId={reportTargetId}
            reportTypeCodeId={reportTypeCodeId}
        />

        {/* 좋아요 확인 모달 */}
        <ConfirmModal
          open={showLikeConfirm}
          message={post.liked ? "좋아요를 취소하시겠습니까?" : "좋아요 하시겠습니까?"}
          onCancel={() => setShowLikeConfirm(false)}
          onConfirm={async () => {
            setShowLikeConfirm(false);
            await handleToggleLike();
          }}
        />
        {/* 북마크 확인 모달 */}
        <ConfirmModal
          open={showBookmarkConfirm}
          message={post.bookmarked ? "북마크를 취소하시겠습니까?" : "북마크 하시겠습니까?"}
          onCancel={() => setShowBookmarkConfirm(false)}
          onConfirm={async () => {
            setShowBookmarkConfirm(false);
            await handleToggleBookmark();
          }}
        />
      </div>
  );
};

export default SNSFeedPost;
