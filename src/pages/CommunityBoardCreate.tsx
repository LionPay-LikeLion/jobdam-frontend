import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

export default function CreateBoardPage(): JSX.Element {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("GENERAL");
  const [permission, setPermission] = useState("all");
  const [sort, setSort] = useState("latest");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!name.trim() || !description.trim()) {
      toast({
        title: "입력 오류",
        description: "게시판 이름과 설명을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const boardData = {
        name: name.trim(),
        description: description.trim(),
        boardTypeCode: type.toUpperCase() // "basic" -> "BASIC"
      };

      await api.post(`/communities/${id}/boards`, boardData);
      
      toast({
        title: "성공",
        description: "게시판이 생성되었습니다.",
      });
      
      navigate(-1);
    } catch (error: any) {
      console.error('게시판 생성 실패:', error);
      
      let errorMessage = "게시판 생성에 실패했습니다.";
      if (error.response?.status === 403) {
        errorMessage = "게시판을 생성할 권한이 없습니다.";
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
      <div className="w-[600px] mt-16">
        <h2 className="text-2xl font-bold mb-6">게시판 생성</h2>

        {/* 게시판 이름 */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">게시판 이름</label>
          <Input
            placeholder="예: 자유게시판"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* 게시판 설명 */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">설명</label>
          <Textarea
            placeholder="게시판에 대한 간단한 설명을 입력하세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* 게시판 유형 */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">게시판 유형</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="게시판 유형 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GENERAL">자유 게시판</SelectItem>
              <SelectItem value="NOTICE">공지사항</SelectItem>
              <SelectItem value="QNA">Q&A</SelectItem>
              <SelectItem value="ANNOUNCEMENT">자료 공유</SelectItem>
              <SelectItem value="FEEDBACK">스터디 모집</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => navigate(-1)} disabled={loading}>
            취소
          </Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "생성 중..." : "생성하기"}
          </Button>
        </div>
      </div>
    </div>
  );
}
