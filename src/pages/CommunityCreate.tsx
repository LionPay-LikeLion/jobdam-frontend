import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import TopBar from "@/components/TopBar";

export default function CommunityCreate(): JSX.Element {
  return (
    <div className="bg-white flex flex-col min-h-screen font-sans">
      <TopBar />

      <main className="flex justify-center pt-[120px] px-6">
        <div className="w-full max-w-[800px]">
          <h1 className="text-[32px] font-bold text-black mb-8">커뮤니티 생성</h1>

          {/* 커뮤니티 정보 */}
          <Card className="mb-6 border border-[#0000001a]">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl font-medium">커뮤니티 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-black">커뮤니티 이름</Label>
                <Input placeholder="커뮤니티 이름을 입력하세요" className="h-12" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-black">커뮤니티 설명</Label>
                <Textarea className="h-[106px] resize-none" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-black">커뮤니티 대표 이미지</Label>
                <div className="flex flex-col items-center justify-center h-[182px] w-full rounded-lg border-2 border-dashed border-[#00000033]">
                  <Upload className="w-[38px] h-[34px] mb-4" />
                  <p className="text-sm text-[#00000080] text-center mb-3">이미지를 업로드하세요</p>
                  <Button className="h-[37px] w-[87px] bg-black text-white">파일 선택</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-black">커뮤니티 카테고리</Label>
                <Select>
                  <SelectTrigger className="h-12 bg-[#d9d9d9]">
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* 옵션 추가 가능 */}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full h-14 bg-black text-white rounded-lg shadow-md text-base font-medium mb-16">
            커뮤니티 생성 완료
          </Button>
        </div>
      </main>
    </div>
  );
}
