import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import TopBar from "@/components/TopBar";
import { createCommunity } from "@/lib/communityApi";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function CommunityCreate(): JSX.Element {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, refreshUserInfo } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    enterPoint: 0
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "파일 크기 오류",
        description: "파일 크기는 5MB 이하여야 합니다.",
        variant: "destructive",
      });
      return;
    }

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      toast({
        title: "오류",
        description: "이미지 파일만 업로드 가능합니다.",
        variant: "destructive",
      });
      return;
    }

    setProfileImage(file);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleCreateCommunity = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast({
        title: "입력 오류",
        description: "커뮤니티 이름과 설명을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // 토큰 만료 체크 및 사용자 정보 갱신
      if (!user?.id) {
        try {
          await refreshUserInfo();
          if (!user?.id) {
            toast({
              title: "인증 오류",
              description: "로그인이 만료되었습니다. 다시 로그인해주세요.",
              variant: "destructive",
            });
            navigate("/login");
            return;
          }
        } catch (error) {
          toast({
            title: "인증 오류",
            description: "로그인이 만료되었습니다. 다시 로그인해주세요.",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("enterPoint", formData.enterPoint.toString());
      
      // 최신 사용자 정보 사용
      let currentUser = user;
      if (!currentUser?.id) {
        await refreshUserInfo();
        currentUser = user; // refreshUserInfo 후 다시 확인
      }
      
      if (!currentUser?.id) {
        toast({
          title: "오류",
          description: "사용자 정보를 가져올 수 없습니다. 다시 로그인해주세요.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
      
      formDataToSend.append("userId", currentUser.id);
      
      if (profileImage) {
        console.log("이미지 파일 정보:", {
          name: profileImage.name,
          size: profileImage.size,
          type: profileImage.type
        });
        formDataToSend.append("profileImage", profileImage);
      }

      await createCommunity(formDataToSend);
      toast({
        title: "성공",
        description: "커뮤니티가 성공적으로 생성되었습니다.",
      });
      navigate("/community");
    } catch (error: any) {
      console.error("커뮤니티 생성 실패:", error);
      
      // 401 에러인 경우 로그인 페이지로 리다이렉트
      if (error?.response?.status === 401) {
        toast({
          title: "인증 오류",
          description: "로그인이 만료되었습니다. 다시 로그인해주세요.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
      
      toast({
        title: "오류",
        description: error?.response?.data?.message || "커뮤니티 생성에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
                <Input 
                  placeholder="커뮤니티 이름을 입력하세요" 
                  className="h-12"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-black">커뮤니티 설명</Label>
                <Textarea 
                  className="h-[106px] resize-none"
                  placeholder="커뮤니티에 대한 설명을 입력하세요"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-black">커뮤니티 대표 이미지</Label>
                <div className="flex flex-col items-center justify-center h-[182px] w-full rounded-lg border-2 border-dashed border-[#00000033] relative">
                  {profileImage ? (
                    <>
                      <img 
                        src={URL.createObjectURL(profileImage)} 
                        alt="미리보기" 
                        className="max-w-full max-h-32 object-cover rounded"
                      />
                      <p className="text-sm text-[#00000080] text-center mt-2">
                        {profileImage.name}
                      </p>
                      <Button 
                        className="h-[37px] w-[87px] bg-red-600 text-white mt-2"
                        onClick={() => setProfileImage(null)}
                      >
                        제거
                      </Button>
                    </>
                  ) : (
                    <>
                      <Upload className="w-[38px] h-[34px] mb-4" />
                      <p className="text-sm text-[#00000080] text-center mb-3">
                        이미지를 업로드하세요 (최대 5MB)
                      </p>
                      <Button 
                        className="h-[37px] w-[87px] bg-black text-white cursor-pointer"
                        onClick={handleImageClick}
                      >
                        파일 선택
                      </Button>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-black">입장 포인트</Label>
                <Input 
                  type="number"
                  placeholder="입장에 필요한 포인트를 입력하세요" 
                  className="h-12"
                  value={formData.enterPoint}
                  onChange={(e) => handleInputChange("enterPoint", parseInt(e.target.value) || 0)}
                />
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full h-14 bg-black text-white rounded-lg shadow-md text-base font-medium mb-16"
            onClick={handleCreateCommunity}
            disabled={loading}
          >
            {loading ? "생성 중..." : "커뮤니티 생성 완료"}
          </Button>
        </div>
      </main>
    </div>
  );
}
