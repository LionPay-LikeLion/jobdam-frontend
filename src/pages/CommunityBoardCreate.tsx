import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

export default function CreateBoardPage(): JSX.Element {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("basic");
  const [permission, setPermission] = useState("all");
  const [sort, setSort] = useState("latest");

  const navigate = useNavigate();

  const handleCreate = () => {
    console.log("게시판 이름:", name);
    console.log("게시판 설명:", description);
    console.log("게시판 유형:", type);
    console.log("접근 권한:", permission);
    console.log("정렬 방식:", sort);
    navigate(-1);
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
              <SelectItem value="basic">일반 게시판</SelectItem>
              <SelectItem value="notice">공지사항</SelectItem>
              <SelectItem value="qna">Q&A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 접근 권한 */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">접근 권한</label>
          <Select value={permission} onValueChange={setPermission}>
            <SelectTrigger>
              <SelectValue placeholder="접근 권한 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 공개</SelectItem>
              <SelectItem value="member">멤버만 접근</SelectItem>
              <SelectItem value="admin">운영자만 작성</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 정렬 방식 */}
        <div className="mb-6">
          <label className="block font-semibold mb-1">기본 정렬 방식</label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger>
              <SelectValue placeholder="정렬 방식 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="popular">인기순</SelectItem>
              <SelectItem value="comments">댓글순</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            취소
          </Button>
          <Button onClick={handleCreate}>생성하기</Button>
        </div>
      </div>
    </div>
  );
}
