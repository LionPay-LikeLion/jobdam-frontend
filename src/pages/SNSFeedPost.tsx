import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { fetchSnsPostDetail, fetchComments, createComment, updateComment, deleteComment,
        likeSnsPost, unlikeSnsPost, addBookmark, removeBookmark, deleteSnsPost } from "@/lib/snsApi";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bookmark, Flag, Heart, MessageSquare, Download } from "lucide-react";
import TopBar from "@/components/TopBar";

const postTags = ["#면접후기", "#포트폴리오", "#이직준비", "#마케팅"];

const SNSFeedPost = () => {
  const navigate = useNavigate();

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
  }

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
      console.log('다운로드 시작:', url);
      
      // 먼저 직접 링크로 시도
      const link = document.createElement('a');
      link.href = url;
      link.download = url.split('/').pop() || 'attachment';
      link.target = '_blank';
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('다운로드 링크 클릭 완료');
      
    } catch (error) {
      console.error('다운로드 실패:', error);
      
      // 대체 방법: 새 창에서 열기
      try {
        window.open(url, '_blank');
        console.log('새 창에서 열기 완료');
      } catch (fallbackError) {
        console.error('대체 방법도 실패:', fallbackError);
        alert('다운로드에 실패했습니다. 파일 링크를 복사해서 브라우저에서 직접 열어주세요.');
      }
    }
  };

  if (loading) return <div className="text-center py-10">로딩중...</div>;
  if (!post) return <div className="text-center py-10">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="bg-white min-h-screen w-full">
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
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#856404] text-sm">첨부파일:</span>
                    <span className="ml-2 text-sm text-[#856404]">
                      {post.attachmentUrl.split('/').pop() || '첨부파일'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        console.log('다운로드 버튼 클릭됨');
                        console.log('첨부파일 URL:', post.attachmentUrl);
                        handleDownloadAttachment(post.attachmentUrl);
                      }}
                      className="bg-[#856404] text-white px-3 py-1 rounded text-sm hover:bg-[#6c5b3b] transition-colors flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      다운로드
                    </Button>
                    <Button
                      onClick={() => {
                        const url = post.attachmentUrl;
                        if (url) {
                          window.open(url, '_blank');
                        }
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
              <Button variant="outline" className="bg-[#f0f0f0] h-[43px] gap-2 rounded-md" onClick={handleToggleLike}>
                <Heart className={post.liked ? "text-red-500" : "text-gray-400"} />
                <span className="text-sm font-medium">{post.likeCount}</span>
              </Button>
              <Button variant="outline" className="bg-[#f0f0f0] h-[43px] gap-2 rounded-md">
                <MessageSquare className="h-5 w-5" />
                <span className="text-sm font-medium">{post.commentCount}</span>
              </Button>
              <Button variant="outline" className="bg-[#f0f0f0] h-[43px] gap-2 rounded-md" onClick={handleToggleBookmark}>
                <Bookmark className={post.bookmarked ? "text-blue-500" : "text-gray-400"} />
                <span className="text-sm font-medium">북마크</span>
              </Button>
              <div className="ml-auto flex gap-2">
                <Button variant="outline" className="bg-[#f0f0f0] h-[37px] rounded-md" onClick={handleEditPost}>수정</Button>
                <Button variant="destructive" className="bg-[#ff3b30] h-[37px] rounded-md" onClick={() => handleDeletePost(post.snsPostId)}>삭제</Button>
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
    </div>
  );
};

export default SNSFeedPost;