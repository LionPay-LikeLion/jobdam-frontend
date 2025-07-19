import React, { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import MyPageLayout from "./MyPageLayout";

interface UserProfile {
    email: string;
    nickname: string;
    remainingPoints: number;
    subscriptionLevel: string;
    role: string;
    phone: string;
    profileImageUrl: string | null;
    memberTypeCode: string;
    createdAt: string;
}

export default function MyPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = () => {
        api.get<UserProfile>("/user/profile")
            .then(res => setProfile(res.data))
            .catch(() => setError("유저 정보를 불러오지 못했습니다."))
            .finally(() => setLoading(false));
    };

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

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('image', file);

            // 디버깅: 토큰 확인
            const token = localStorage.getItem('accessToken');
            console.log('프로필 이미지 업로드 시도:', {
                hasToken: !!token,
                tokenLength: token?.length,
                url: '/user/profile/image',
                method: 'PUT'
            });

            const response = await api.put('/user/profile/image', formData);
            // PUT 메서드로 변경

            // 프로필 정보 새로고침
            await fetchProfile();

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
            setIsUploading(false);
            // 파일 입력 초기화
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    // 버튼 이동
    const goToPremiumUpgrade = () => navigate("/premium-upgrade");
    const goToMembershipTypeRequest = () => navigate("/membership-type-request");

    const formatDate = (isoDate: string) => {
        if (!isoDate) return "";
        const date = new Date(isoDate);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    return (
        <MyPageLayout>
            <div className="flex flex-col items-center w-full mt-0">
                {/* 프로필 카드 */}
                <div className="w-full flex justify-center mt-8">
                    <div className="w-[1100px] bg-white rounded-xl border border-[#eee] p-0 flex flex-row items-center h-[130px] shadow-[0_1px_8px_#0001]">
                        <div className="flex items-center px-8">
                            {profile?.profileImageUrl ? (
                                <img 
                                    className="w-[80px] h-[80px] rounded-full object-cover bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity" 
                                    src={profile.profileImageUrl} 
                                    alt="Profile"
                                    onClick={handleImageClick}
                                />
                            ) : (
                                <div 
                                    className="w-[80px] h-[80px] rounded-full bg-gray-200 flex items-center justify-center text-lg text-gray-500 cursor-pointer hover:bg-gray-300 transition-colors"
                                    onClick={handleImageClick}
                                >
                                    Profile
                                </div>
                            )}
                        </div>
                        <Button 
                            className="ml-4 h-10 bg-black hover:bg-black/90 text-white rounded" 
                            onClick={handleImageClick}
                            disabled={isUploading}
                        >
                            {isUploading ? "업로드 중..." : "프로필 이미지 변경"}
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>
                </div>

                {/* 계정정보 카드 */}
                <div className="w-full flex justify-center mt-8">
                    <div className="w-[1100px] bg-white rounded-xl border border-[#eee] px-0 py-10 shadow-[0_1px_8px_#0001] flex flex-col">
                        <h2 className="font-medium text-black text-2xl px-12 mb-8">계정 정보</h2>
                        {loading && <div className="px-12">로딩중...</div>}
                        {error && <div className="px-12 text-red-600">{error}</div>}
                        {!loading && !error && profile && (
                            <div>
                                <div className="px-12">
                                    <div className="grid grid-cols-2 gap-x-12 gap-y-5">
                                        <div className="flex">
                                            <span className="w-32 text-gray-500">닉네임</span>
                                            <span className="text-black">{profile.nickname}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="w-32 text-gray-500">이메일 주소</span>
                                            <span className="text-black">{profile.email}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="w-32 text-gray-500">가입일</span>
                                            <span className="text-black">{formatDate(profile.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="w-32 text-gray-500">회원등급</span>
                                            <span className="text-black mr-2">
                                                {profile.subscriptionLevel === "PREMIUM" ? "프리미엄" : "베이직"}
                                            </span>
                                            {profile.subscriptionLevel !== "PREMIUM" && (
                                                <Button
                                                    size="sm"
                                                    className="ml-2 h-8 bg-white text-black border border-black rounded"
                                                    variant="outline"
                                                    onClick={goToPremiumUpgrade}
                                                >
                                                    프리미엄 회원 업그레이드
                                                </Button>
                                            )}
                                        </div>
                                        <div className="flex items-center">
                                            <span className="w-32 text-gray-500">회원타입</span>
                                            <span className="text-black mr-2">
                                                {profile.memberTypeCode === "GENERAL" ? "구직자" : profile.memberTypeCode}
                                            </span>
                                            <Button
                                                size="sm"
                                                className="ml-2 h-8 bg-white text-black border border-black rounded"
                                                variant="outline"
                                                onClick={goToMembershipTypeRequest}
                                            >
                                                회원타입 전환 신청
                                            </Button>
                                        </div>
                                        <div className="flex">
                                            <span className="w-32 text-gray-500">남은 포인트</span>
                                            <span className="text-black">{profile.remainingPoints?.toLocaleString()} P</span>
                                        </div>
                                        <div className="flex">
                                            <span className="w-32 text-gray-500">연락처</span>
                                            <span className="text-black">{profile.phone}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-12 px-12">
                                    <Button className="h-[44px] w-[180px] bg-black hover:bg-black/90 text-white font-normal text-base">
                                        비밀번호 변경
                                    </Button>
                                    <Button variant="outline" className="h-[44px] w-[180px] border-red-600 text-red-600 hover:bg-red-50 font-normal text-base">
                                        회원 탈퇴 요청
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MyPageLayout>
    );
}
