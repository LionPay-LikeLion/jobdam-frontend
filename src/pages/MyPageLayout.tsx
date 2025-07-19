// src/pages/mypage/MyPageLayout.tsx
import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

const tabs = [
    { label: "내 계정 정보", path: "/mypage" },
    { label: "결제 내역", path: "/mypage/payments" },
    { label: "포인트 관리", path: "/mypage/points" },
    { label: "활동 내역", path: "/mypage/activity" },
];

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, refreshUserInfo } = useAuth();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // 파일 크기 체크 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "오류",
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

        try {
            const formData = new FormData();
            formData.append('image', file);

            await api.put('/user/profile/image', formData);

            // 사용자 정보 새로고침
            await refreshUserInfo();

            toast({
                title: "성공",
                description: "프로필 이미지가 성공적으로 변경되었습니다.",
            });
        } catch (error: any) {
            console.error('프로필 이미지 업로드 실패:', error);
            toast({
                title: "오류",
                description: error.response?.data?.message || "프로필 이미지 변경 중 오류가 발생했습니다.",
                variant: "destructive",
            });
        } finally {
            // 파일 입력 초기화
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="bg-white flex flex-row justify-center w-full min-h-screen">
            <div className="bg-white w-[1440px] relative min-h-screen">
                <TopBar />
                
                {/* 프로필 섹션 - 상단 가로 배치 */}
                <div className="mt-[119px] px-[60px] mb-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-6">
                                {user?.profileImageUrl ? (
                                    <img 
                                        className="w-[120px] h-[120px] rounded-full object-cover bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity" 
                                        src={user.profileImageUrl} 
                                        alt="Profile"
                                        onClick={handleImageClick}
                                    />
                                ) : (
                                    <div 
                                        className="w-[120px] h-[120px] rounded-full bg-gray-200 flex items-center justify-center text-xl text-gray-500 cursor-pointer hover:bg-gray-300 transition-colors"
                                        onClick={handleImageClick}
                                    >
                                        Profile
                                    </div>
                                )}
                                <Button 
                                    className="h-12 bg-black hover:bg-black/90 text-white rounded text-base px-6" 
                                    onClick={handleImageClick}
                                >
                                    프로필 사진 수정
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 하단 레이아웃 - 사이드바와 메인 콘텐츠 좌우 배치 */}
                <div className="flex gap-6 px-[60px]">
                    {/* 왼쪽 - 사이드바 */}
                    <Card className="w-[246px] h-fit">
                        <CardContent className="p-0 h-full relative">
                            {tabs.map((tab, i) => (
                                <button
                                    key={tab.path}
                                    onClick={() => navigate(tab.path)}
                                    className={`block w-full px-6 py-3 text-left rounded-md font-normal text-base ${
                                        location.pathname === tab.path
                                            ? "bg-black text-white mt-[9px] mx-[9px]"
                                            : "text-black"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </CardContent>
                    </Card>
                    
                    {/* 오른쪽 - 메인 영역 */}
                    <div className="flex-1">{children}</div>
                </div>
            </div>
        </div>
    );
}
