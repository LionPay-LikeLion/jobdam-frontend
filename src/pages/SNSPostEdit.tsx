import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
} from "@/components/ui";
import { fetchSnsPostDetail, updateSnsPost } from "@/lib/snsApi";
import { Image as ImageIcon, Paperclip, Upload, X } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function SNSPostEditPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const editorButtons = [
    { label: "B", style: "font-bold" },
    { label: "I", style: "italic" },
    { label: "U", style: "underline" },
    { label: "링크", style: "" },
    { label: "이미지", style: "" },
  ];

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [selectedAttachment, setSelectedAttachment] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string>("");

  useEffect(() => {
    if (postId) {
      fetchSnsPostDetail(Number(postId)).then(data => {
        setTitle(data.title);
        setContent(data.content);
        if (data.imageUrl) setImagePreview(data.imageUrl);
      });
    }
  }, [postId]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttachmentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedAttachment(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveAttachment = () => {
    setSelectedAttachment(null);
    if (attachmentInputRef.current) attachmentInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (selectedImage) formData.append("image", selectedImage);
      if (selectedAttachment) formData.append("attachment", selectedAttachment);

      await updateSnsPost(Number(postId), formData);
      alert("수정 성공!");
      navigate(`/`);
    } catch (e) {
      alert("수정 실패");
      console.error(e);
    }
  };

  const handleCancel = () => navigate("/");

  return (
    <div className="w-full bg-white flex justify-center">
      <div className="w-[914px] max-w-full mt-12">
        <div className="text-center mb-16">
          <h1 className="text-[40px] font-bold leading-[48px]">피드 수정</h1>
          <p className="text-base text-black">기존에 작성했던 피드 내용을 수정합니다.</p>
        </div>

        <Card className="border border-[#0000001a] shadow-sm">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <label className="block text-base font-medium mb-2">제목</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목을 입력하세요" className="h-[50px]" />
              </div>

              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex-1 min-w-[280px]">
                  <label className="block text-base font-medium mb-2">공개 범위</label>
                  <Select defaultValue="public">
                    <SelectTrigger className="h-[50px] bg-[#d9d9d9]">
                      <SelectValue placeholder="전체 공개" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">전체 공개</SelectItem>
                      <SelectItem value="friends">친구 공개</SelectItem>
                      <SelectItem value="private">비공개</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[280px]">
                  <label className="block text-base font-medium mb-2">대표 이미지</label>
                  <div className="h-[148px] border-2 border-[#0000001a] rounded-md flex flex-col items-center justify-center text-sm text-[#00000080] cursor-pointer hover:border-gray-400 transition-colors" onClick={() => fileInputRef.current?.click()}>
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img src={imagePreview} alt="미리보기" className="w-full h-full object-cover rounded-md" />
                        <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                        클릭하여 이미지를 업로드하세요
                        <p className="text-xs text-[#0000004c] mt-1">JPG, PNG, GIF (최대 10MB)</p>
                      </>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-base font-medium mb-2">태그</label>
                <Button variant="outline" className="h-[38px] text-sm">+ 태그 추가</Button>
              </div>

              <div className="mb-8">
                <label className="block text-base font-medium mb-2">내용</label>
                <div className="border border-[#0000001a] rounded-md">
                  <div className="flex h-[53px] items-center bg-[#00000005] border-b border-[#0000001a] px-4">
                    {editorButtons.slice(0, 3).map((btn, idx) => (
                      <Button key={idx} variant="ghost" className={`px-3 text-sm ${btn.style}`}>{btn.label}</Button>
                    ))}
                    <Separator orientation="vertical" className="h-6 mx-4" />
                    {editorButtons.slice(3).map((btn, idx) => (
                      <Button key={idx} variant="ghost" className="px-3 text-sm">{btn.label}</Button>
                    ))}
                  </div>
                  <Textarea placeholder="내용을 입력하세요" className="min-h-[300px] border-none rounded-none p-4" value={content} onChange={e => setContent(e.target.value)} />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-base font-medium mb-2">첨부파일</label>
                <div className="border border-[#0000001a] rounded-md h-[88px] p-4 flex items-center">
                  {selectedAttachment ? (
                    <div className="flex items-center gap-3 w-full">
                      <Paperclip className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 flex-1">{selectedAttachment.name}</span>
                      <Button type="button" variant="outline" size="sm" onClick={handleRemoveAttachment} className="h-[30px] text-xs">제거</Button>
                    </div>
                  ) : (
                    <Button type="button" variant="outline" className="h-[38px] text-sm" onClick={() => attachmentInputRef.current?.click()}>
                      <Paperclip className="w-4 h-4 mr-2" />
                      첨부파일 추가
                    </Button>
                  )}
                  <input ref={attachmentInputRef} type="file" onChange={handleAttachmentSelect} className="hidden" />
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex justify-end gap-2 py-6 border-t border-[#0000001a]">
            <Button variant="outline" className="w-[76px] h-[46px] text-sm" onClick={handleCancel}>취소</Button>
            <Button type="submit" className="w-[74px] h-[46px] bg-black text-white text-sm" onClick={handleSubmit}>수정</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
