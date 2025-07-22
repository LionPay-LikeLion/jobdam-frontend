import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaCamera } from "react-icons/fa";
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
    // { label: "활동 내역", path: "/mypage/activity" },   // 삭제!
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
        <div className="bg-gray-50 min-h-screen w-full flex flex-col">
            <TopBar />
            <div className="w-full flex flex-col items-center pt-16 pb-10">
                {/* 프로필 카드 */}
                <div className="w-full max-w-6xl mb-8">
                    <Card className="rounded-2xl shadow-lg border border-gray-100 bg-white">
                        <CardContent className="p-8 flex items-center gap-8">
                            <div className="relative w-28 h-28">
                                {user?.profileImageUrl ? (
                                    <img
                                        className="w-28 h-28 rounded-full object-cover bg-gray-100"
                                        src={user.profileImageUrl}
                                        alt="Profile"
                                    />
                                ) : (
                                    <div
                                        className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-500"
                                    >
                                        Profile
                                    </div>
                                )}
                                {/* 프로필 사진 수정 버튼 (카메라 아이콘) */}
                                <button
                                    type="button"
                                    onClick={handleImageClick}
                                    className="absolute bottom-2 right-2 w-9 h-9 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow transition"
                                    title="프로필 사진 변경"
                                >
                                    <FaCamera className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <div className="flex flex-col gap-2 justify-center min-w-[120px]">
                                <div className="text-2xl font-bold text-gray-900 mb-1">{user?.nickname || "닉네임"}</div>
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
                {/* 하단 레이아웃 */}
                <div className="w-full max-w-6xl flex gap-8">
                    {/* 사이드바 */}
                    <Card className="w-[220px] h-fit rounded-2xl shadow-lg border border-gray-100 bg-white">
                        <CardContent className="p-0 h-full relative flex flex-col gap-1 py-4">
                            {tabs.map((tab, i) => {
                                let label = tab.label;
                                if (tab.label === "내 계정 정보") {
                                    label = user?.name ? `내 계정 정보 (${user.name})` : "내 계정 정보";
                                }
                                return (
                                    <button
                                        key={tab.path}
                                        onClick={() => navigate(tab.path)}
                                        className={`block w-full px-6 py-3 text-left rounded-lg font-medium text-base transition-all duration-150
                                            ${location.pathname === tab.path
                                                ? "bg-blue-50 text-blue-700 font-bold shadow"
                                                : "text-gray-700 hover:bg-gray-50"}`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </CardContent>
                    </Card>
                    {/* 메인 영역 */}
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
