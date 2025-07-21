import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

interface PostData {
  title: string;
  content: string;
  postTypeCode: string;
}

export default function CommunityPostEdit(): JSX.Element {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("NORMAL");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const navigate = useNavigate();
  const { id, boardId, postId } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();

  // 게시글 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setInitialLoading(true);
        const response = await api.get(`/communities/${id}/boards/${boardId}/posts/${postId}`);
        const postData: PostData = response.data;
        
        setTitle(postData.title);
        setContent(postData.content);
        setPostType(postData.postTypeCode);
      } catch (error: any) {
        console.error('게시글 조회 실패:', error);
        toast({
          title: "오류",
          description: "게시글을 불러올 수 없습니다.",
          variant: "destructive",
        });
        navigate(`/community/${id}/board/${boardId}`);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPost();
  }, [id, boardId, postId, navigate, toast]);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "입력 오류",
        description: "제목과 내용을 모두 입력해주세요.",
        variant: "destructive",
      });
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
      setLoading(true);
      const postData = {
        title: title.trim(),
        content: content.trim(),
        postTypeCode: postType
      };

      await api.put(`/communities/${id}/boards/${boardId}/posts/${postId}?userId=${user.id}`, postData);
      
      toast({
        title: "성공",
        description: "게시글이 수정되었습니다.",
      });
      
      navigate(`/community/${id}/board/detail/${postId}`);
    } catch (error: any) {
      console.error('게시글 수정 실패:', error);
      
      let errorMessage = "게시글 수정에 실패했습니다.";
      if (error.response?.status === 403) {
        errorMessage = "게시글을 수정할 권한이 없습니다.";
      } else if (error.response?.data) {
        errorMessage = error.response.data;
      }
      
      toast({
        title: "오류",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center bg-white font-korean">
      <div className="w-[800px] mt-16">
        <h2 className="text-2xl font-bold mb-6">게시글 수정</h2>

        {/* 게시글 유형 */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">게시글 유형</label>
          <Select value={postType} onValueChange={setPostType}>
            <SelectTrigger>
              <SelectValue placeholder="게시글 유형 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NORMAL">일반</SelectItem>
              <SelectItem value="NOTICE">공지</SelectItem>
              <SelectItem value="QNA">문답</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 제목 */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">제목</label>
          <Input
            placeholder="게시글 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 내용 */}
        <div className="mb-6">
          <label className="block font-semibold mb-1">내용</label>
          <Textarea
            placeholder="게시글 내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px] resize-none"
          />
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => navigate(`/community/${id}/board/detail/${postId}`)} disabled={loading}>
            취소
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "수정 중..." : "수정하기"}
          </Button>
        </div>
      </div>
    </div>
  );
} 