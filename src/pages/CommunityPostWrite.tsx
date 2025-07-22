import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

export default function CommunityPostWrite(): JSX.Element {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("NORMAL");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id, boardId } = useParams();
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "입력 오류",
        description: "제목과 내용을 모두 입력해주세요.",
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

      await api.post(`/communities/${id}/boards/${boardId}/posts`, postData);
      
      toast({
        title: "성공",
        description: "게시글이 작성되었습니다.",
      });
      
      navigate(`/communities/${id}/board/${boardId}`);
    } catch (error: any) {
      console.error('게시글 작성 실패:', error);
      
      let errorMessage = "게시글 작성에 실패했습니다.";
      if (error.response?.status === 403) {
        errorMessage = "게시글을 작성할 권한이 없습니다.";
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

  return (
    <div className="min-h-screen flex justify-center bg-white font-korean">
      <div className="w-[800px] mt-16">
        <h2 className="text-2xl font-bold mb-6">게시글 작성</h2>

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
          <Button variant="outline" onClick={() => navigate(`/communities/${id}/board/${boardId}`)} disabled={loading}>
            취소
          </Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "작성 중..." : "작성하기"}
          </Button>
        </div>
      </div>
    </div>
  );
} 