import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import MyPageLayout from "./MyPageLayout";
import { withdrawUser } from "@/lib/authApi";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";

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
    const { toast } = useToast();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [showPwModal, setShowPwModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [pwLoading, setPwLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = () => {
        api.get<UserProfile>("/user/profile")
            .then(res => setProfile(res.data))
            .catch(() => setError("유저 정보를 불러오지 못했습니다."))
            .finally(() => setLoading(false));
    };

    // 버튼 이동
    const goToPremiumUpgrade = () => navigate("/premium-upgrade");
    const goToMembershipTypeRequest = () => navigate("/membership-type-request");

    const formatDate = (isoDate: string) => {
        if (!isoDate) return "";
        const date = new Date(isoDate);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    const handleWithdraw = async () => {
        if (!window.confirm("정말로 회원 탈퇴하시겠습니까?")) return;
        try {
            await withdrawUser();
            await logout();
            toast({
                title: "탈퇴 완료",
                description: "회원 탈퇴가 완료되었습니다.",
            });
            navigate("/");
        } catch (error: any) {
            let msg = "회원 탈퇴에 실패했습니다.";
            if (error.response?.data?.message) msg = error.response.data.message;
            toast({
                title: "오류",
                description: msg,
                variant: "destructive",
            });
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword) {
            toast({
                title: "입력 오류",
                description: "현재 비밀번호와 새 비밀번호를 모두 입력하세요.",
                variant: "destructive",
            });
            return;
        }
        setPwLoading(true);
        try {
            await api.put("/user/password", {
                currentPassword,
                newPassword,
            });
            toast({
                title: "비밀번호 변경 완료",
                description: "다시 로그인 해주세요.",
            });
            setShowPwModal(false);
            setCurrentPassword("");
            setNewPassword("");
            await logout();
            navigate("/");
        } catch (error: any) {
            let msg = "비밀번호 변경에 실패했습니다.";
            if (error.response?.data?.message) msg = error.response.data.message;
            toast({
                title: "오류",
                description: msg,
                variant: "destructive",
            });
        } finally {
            setPwLoading(false);
        }
    };

    return (
        <MyPageLayout>
            <div className="bg-white rounded-xl border border-[#eee] px-8 py-10 shadow-[0_1px_8px_#0001]">
                <h2 className="font-medium text-black text-2xl mb-8">계정 정보</h2>
                {loading && <div>로딩중...</div>}
                {error && <div className="text-red-600">{error}</div>}
                {!loading && !error && profile && (
                    <div>
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-500 w-32">닉네임</span>
                                    <span className="text-black font-medium">{profile.nickname}</span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-500 w-32">이메일 주소</span>
                                    <span className="text-black">{profile.email}</span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-500 w-32">가입일</span>
                                    <span className="text-black">{formatDate(profile.createdAt)}</span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-500 w-32">회원등급</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-black">
                                            {profile.subscriptionLevel === "PREMIUM" ? "프리미엄" : "베이직"}
                                        </span>
                                        {profile.subscriptionLevel === "BASIC" && (
                                            <Button 
                                                onClick={goToPremiumUpgrade}
                                                variant="outline"
                                                className="h-8 px-4 text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
                                            >
                                                프리미엄 회원 업그레이드
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-500 w-32">회원타입</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-black">
                                            {profile.memberTypeCode === 'EMPLOYEE' ? '기업회원' : 
                                             profile.memberTypeCode === 'HUNTER' ? '컨설턴트' : 
                                             profile.memberTypeCode === 'GENERAL' ? '구직자' : '회원'}
                                        </span>
                                        <Button 
                                            onClick={goToMembershipTypeRequest}
                                            variant="outline"
                                            className="h-8 px-4 text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
                                        >
                                            회원타입 전환 신청
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-500 w-32">남은 포인트</span>
                                    <span className="text-black font-medium">{profile.remainingPoints?.toLocaleString()} P</span>
                                </div>
                            </div>
                            
                            <div className="flex gap-4 pt-6">
                                <Button className="h-[44px] w-[180px] bg-black hover:bg-black/90 text-white font-normal text-base" onClick={() => setShowPwModal(true)}>
                                    비밀번호 변경
                                </Button>
                                <Button variant="outline" className="h-[44px] w-[180px] border-red-600 text-red-600 hover:bg-red-50 font-normal text-base" onClick={handleWithdraw}>
                                    회원 탈퇴 요청
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {showPwModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-[350px]">
                        <h2 className="text-xl font-bold mb-4">비밀번호 변경</h2>
                        <div className="mb-3">
                            <label className="block text-sm mb-1">현재 비밀번호</label>
                            <Input
                                type="password"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                className="mb-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm mb-1">새 비밀번호</label>
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowPwModal(false);
                                    setCurrentPassword("");
                                    setNewPassword("");
                                }}
                                disabled={pwLoading}
                            >
                                취소
                            </Button>
                            <Button
                                onClick={handleChangePassword}
                                disabled={pwLoading}
                            >
                                {pwLoading ? "변경 중..." : "변경"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </MyPageLayout>
    );
}
