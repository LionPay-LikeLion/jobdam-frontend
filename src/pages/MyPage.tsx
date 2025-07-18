import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TopBar from "@/components/TopBar"; // ★ 이 부분만 추가
// Input, Search는 탑바에서만 필요하면 아래에서 삭제해도 무방

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

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get<UserProfile>("/user/profile");
                setProfile(res.data);
                setError(null);
            } catch (err: any) {
                setError("유저 정보를 불러오지 못했습니다.");
                setProfile(null);
                console.error("[MY PAGE] 유저정보 에러:", err);
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    // 프리미엄 업그레이드 페이지 이동
    const goToPremiumUpgrade = () => {
        navigate("/premium-upgrade");
    };

    // 회원타입 전환 신청 페이지로 이동
    const goToMembershipTypeRequest = () => {
        navigate("/membership-type-request");
    };

    const formatDate = (isoDate: string) => {
        if (!isoDate) return "";
        const date = new Date(isoDate);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    // 계정 정보 필드
    const accountInfo = profile && [
        { label: "닉네임", value: profile.nickname },
        { label: "이메일 주소", value: profile.email },
        { label: "가입일", value: formatDate(profile.createdAt) },
        {
            label: "회원등급",
            value: profile.subscriptionLevel === "PREMIUM" ? "프리미엄" : "베이직",
            action:
                profile.subscriptionLevel === "PREMIUM"
                    ? null
                    : {
                        label: "프리미엄 회원 업그레이드",
                        onClick: goToPremiumUpgrade,
                        disabled: false,
                    },
        },
        {
            label: "회원타입",
            value: profile.memberTypeCode === "GENERAL" ? "구직자" : profile.memberTypeCode,
            action: {
                label: "회원타입 전환 신청",
                onClick: goToMembershipTypeRequest,
                disabled: false,
            },
        },
        {
            label: "남은 포인트",
            value: profile.remainingPoints != null ? `${profile.remainingPoints.toLocaleString()} P` : "-",
            action: null,
        },
        { label: "연락처", value: profile.phone, action: null },
    ];

    return (
        <div className="bg-white flex flex-row justify-center w-full min-h-screen">
            <div className="bg-white w-[1440px] relative min-h-screen">
                {/* TopBar로 네비게이션 대체 */}
                <TopBar />
                <h1 className="text-center font-bold text-black text-[40px] mt-[119px]">마이페이지</h1>
                {/* 프로필 카드 */}
                <Card className="w-[1320px] h-[186px] mx-auto mt-8 shadow-[0px_2px_8px_#00000014]">
                    <CardContent className="p-0 h-full relative">
                        {profile?.profileImageUrl ? (
                            <img className="absolute w-[120px] h-[120px] top-8 left-8 rounded-full object-cover" src={profile.profileImageUrl} alt="Profile" />
                        ) : (
                            <div className="absolute w-[120px] h-[120px] top-8 left-8 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-500">Profile</div>
                        )}
                        <Button className="absolute h-11 top-[71px] left-[177px] bg-black hover:bg-black/90 text-white rounded-md" disabled>
                            프로필 이미지 변경
                        </Button>
                    </CardContent>
                </Card>
                <div className="flex gap-6 mt-8 px-[60px]">
                    {/* 사이드바 */}
                    <Card className="w-[246px] h-[230px]">
                        <CardContent className="p-0 h-full relative">
                            <a href="#" className="block px-6 py-3 mt-[9px] mx-[9px] bg-black text-white rounded-md font-normal text-base">내 계정 정보</a>
                            <a href="#" className="block px-6 py-3 text-black font-normal text-base">포인트 관리</a>
                            <a href="#" className="block px-6 py-3 text-black font-normal text-base">활동 내역</a>
                        </CardContent>
                    </Card>
                    {/* 메인 - 계정정보 */}
                    <Card className="flex-1 shadow-[0px_2px_8px_#00000014]">
                        <CardContent className="p-8">
                            <h2 className="font-medium text-black text-[28px] mb-8">계정 정보</h2>
                            {loading && <div>로딩중...</div>}
                            {error && <div className="text-red-600">{error}</div>}
                            {!loading && !error && profile && accountInfo && accountInfo.map((info, idx) => (
                                <div key={idx} className="border-b border-[#0000001a] py-4 flex items-center">
                                    <span className="font-normal text-black text-sm w-[120px]">{info.label}</span>
                                    <span className="font-normal text-black text-base">{info.value}</span>
                                    {info.action && (
                                        <div className="ml-auto">
                                            <Button
                                                variant="outline"
                                                className="h-[50px] text-[#000000b2] text-base"
                                                onClick={info.action.onClick}
                                                disabled={info.action.disabled}
                                            >
                                                {info.action.label}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {/* 하단 버튼 */}
                            <div className="flex gap-4 mt-12">
                                <Button className="h-[50px] bg-black hover:bg-black/90 text-white font-normal text-base" disabled onClick={() => {}}>
                                    비밀번호 변경
                                </Button>
                                <Button variant="outline" className="h-[50px] border-red-600 text-red-600 hover:bg-red-50 font-normal text-base" disabled onClick={() => {}}>
                                    회원 탈퇴 요청
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
