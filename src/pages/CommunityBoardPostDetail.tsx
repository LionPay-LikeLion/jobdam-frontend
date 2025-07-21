import React, { useEffect, useState } from "react";
import { FiUser, FiDownload, FiEdit, FiTrash2, FiMessageCircle, FiSearch } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

interface CommunityPostDetail {
  postId: number;
  boardId: number;
  title: string;
  content: string;
  userNickname: string;
  createdAt: string;
  commentCount: number;
  viewCount: number;
  postTypeCode: string;
  userProfileImageUrl: string;
}

interface CommunityComment {
  commentId: number;
  content: string;
  userNickname: string;
  createdAt: string;
  userProfileImageUrl?: string;
}

export default function CommunityBoardPostDetail(): JSX.Element {
  const navigate = useNavigate();
  const { id, boardId, postId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [post, setPost] = useState<CommunityPostDetail | null>(null);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchPostDetail();
    fetchComments();
  }, [postId]);

  const fetchPostDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get<CommunityPostDetail>(`/communities/${id}/boards/${boardId}/posts/${postId}`);
      setPost(response.data);
    } catch (error) {
      console.error('게시글 상세 조회 실패:', error);
      toast({
        title: "오류",
        description: "게시글을 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get<CommunityComment[]>(`/communities/${id}/boards/${boardId}/posts/${postId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('댓글 조회 실패:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: "입력 오류",
        description: "댓글 내용을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmittingComment(true);
      await api.post(`/communities/${id}/boards/${boardId}/posts/${postId}/comments`, {
        content: newComment.trim()
      });
      
      setNewComment("");
      fetchComments(); // 댓글 목록 새로고침
      
      toast({
        title: "성공",
        description: "댓글이 등록되었습니다.",
      });
    } catch (error) {
      console.error('댓글 등록 실패:', error);
      toast({
        title: "오류",
        description: "댓글 등록에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleEditPost = () => {
    navigate(`/community/${id}/board/${boardId}/post/edit/${postId}`);
  };

  const handleDeletePost = async () => {
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    if (!user?.id) {
      toast({
        title: "인증 오류",
        description: "사용자 정보를 가져올 수 없습니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.delete(`/communities/${id}/boards/${boardId}/posts/${postId}?userId=${user.id}`);
      
      toast({
        title: "성공",
        description: "게시글이 삭제되었습니다.",
      });
      
      navigate(`/community/${id}/board/${boardId}`);
    } catch (error: any) {
      console.error('게시글 삭제 실패:', error);
      
      let errorMessage = "게시글 삭제에 실패했습니다.";
      if (error.response?.status === 403) {
        errorMessage = "게시글을 삭제할 권한이 없습니다.";
      } else if (error.response?.data) {
        errorMessage = error.response.data;
      }
      
      toast({
        title: "오류",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const getPostTypeDisplay = (postTypeCode: string) => {
    switch (postTypeCode) {
      case "NOTICE": return "공지";
      case "NORMAL": return "일반";
      case "QNA": return "문답";
      default: return postTypeCode;
    }
  };

  const getPostTypeColor = (postTypeCode: string) => {
    switch (postTypeCode) {
      case "NOTICE": return "bg-red-500 text-white";
      case "QNA": return "bg-sky-400 text-white";
      case "NORMAL": return "bg-teal-400 text-white";
      default: return "bg-gray-400 text-white";
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center bg-white min-h-screen">
        <div className="w-full max-w-[1000px] px-4 py-10">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">게시글을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full flex justify-center bg-white min-h-screen">
        <div className="w-full max-w-[1000px] px-4 py-10">
          <div className="text-center py-20">
            <p className="text-gray-600">게시글을 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center bg-white min-h-screen">
      <div className="w-full max-w-[1000px] px-4 py-10">
        {/* 전체 박스 */}
        <div className="bg-white shadow rounded-xl ring-1 ring-gray-100 px-8 py-10 space-y-8">
          {/* 헤더 */}
          <div className="mb-6 border-b pb-4">
            <h1 className="text-2xl font-semibold">게시글 상세</h1>
          </div>

          {/* 게시글 제목 */}
          <h2 className="text-[32px] font-medium mb-4">{post.title}</h2>

          {/* 작성자 정보 */}
          <div className="flex items-center text-sm text-gray-600 mb-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {post.userProfileImageUrl ? (
                  <img src={post.userProfileImageUrl} alt={post.userNickname} className="w-full h-full object-cover" />
                ) : (
                  <FiUser className="text-gray-600" />
                )}
              </div>
              <span className="text-base text-black font-medium">{post.userNickname}</span>
            </div>
            <span>{formatDate(post.createdAt)}</span>
            <span>조회 {post.viewCount}</span>
          </div>

          {/* 카테고리 */}
          <div className={`inline-block px-3 py-1 rounded text-sm mb-6 ${getPostTypeColor(post.postTypeCode)}`}>
            {getPostTypeDisplay(post.postTypeCode)}
          </div>

          {/* 본문 */}
          <div className="space-y-4 text-base text-black leading-6 whitespace-pre-wrap">
            {post.content}
          </div>

          {/* 댓글 */}
          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-2 text-base font-medium">
              <FiMessageCircle />
              <span>댓글 {post.commentCount}</span>
            </div>

            {/* 댓글 리스트 */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  첫 번째 댓글을 남겨보세요!
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.commentId} className="border rounded-lg p-4 w-full max-w-[1000px]">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <FiUser className="mr-2" />
                      <span className="text-black font-medium mr-2">{comment.userNickname}</span>
                      <span>{formatDate(comment.createdAt)}</span>
                    </div>
                    <div className="text-sm text-black">{comment.content}</div>
                  </div>
                ))
              )}
            </div>

            {/* 댓글 입력창 */}
            <div className="flex items-center gap-3 mt-6 max-w-[1000px]">
              <input
                type="text"
                placeholder="댓글을 입력하세요"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                className="flex-1 px-4 py-2 border rounded-md text-sm"
                disabled={submittingComment}
              />
              <button 
                className="px-4 py-2 bg-black text-white rounded-md text-sm disabled:bg-gray-400"
                onClick={handleSubmitComment}
                disabled={submittingComment}
              >
                {submittingComment ? "등록 중..." : "등록"}
              </button>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex justify-between items-center border-t pt-6 mt-12 max-w-[1000px]">
            <div className="flex gap-4">
              {user?.nickname === post.userNickname && (
                <>
                  <button 
                    className="px-4 py-2 border rounded-md text-sm flex items-center gap-1 hover:bg-gray-50"
                    onClick={handleEditPost}
                  >
                    <FiEdit />
                    수정
                  </button>
                  <button 
                    className="px-4 py-2 border rounded-md text-sm flex items-center gap-1 hover:bg-red-50 text-red-600"
                    onClick={handleDeletePost}
                  >
                    <FiTrash2 />
                    삭제
                  </button>
                </>
              )}
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-violet-600 text-white text-sm rounded-md"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
