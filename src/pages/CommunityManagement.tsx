import React, { useEffect, useState } from "react";
import { FaUser, FaCrown, FaTrashAlt, FaEdit, FaPlus, FaUserSlash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CommunityManagement = () => {
    const navigate = useNavigate();
    const { id: communityId } = useParams();
    const { user, isLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [communityInfo, setCommunityInfo] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // ✅ useAuth 로딩 중이거나, param 없음, user 없음 => API 호출 금지
    useEffect(() => {
        if (isLoading) return; // 아직 user profile 로딩 중이면 아무것도 안 함
        if (!communityId || !user?.userId) {
            setError("잘못된 접근입니다. (커뮤니티 ID 또는 로그인 정보 없음)");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        api.get(`/communities/${communityId}/admin/manage`)
            .then(res => setCommunityInfo(res.data))
            .catch(err => {
                setError(
                    err?.response?.data === "접근 권한이 없습니다."
                        ? "관리자만 접근할 수 있습니다."
                        : "관리 정보를 불러올 수 없습니다."
                );
            })
            .finally(() => setLoading(false));
    }, [communityId, user?.userId, isLoading]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">{error}</div>;
    if (!communityInfo) return null;

    // owner/권한 판별(프론트 방어)
    const isOwner = String(user.userId) === String(communityInfo.members?.find((m: any) => m.role === "OWNER")?.userId);
    const isPremium = communityInfo?.plan?.levelCode === "PREMIUM" || communityInfo?.plan?.levelName?.includes("프리미엄");

    // 플랜 등급 색상
    const getPlanColor = (code: string) =>
        code === "PREMIUM" ? "text-orange-500" : "text-purple-600";
    const roleIcon = (role: string) =>
        role === "OWNER" ? <FaCrown className="text-yellow-500 text-lg mr-1" /> : <FaUser className="text-gray-500 mr-1" />;

    return (
        <div className="bg-white min-h-screen flex justify-center py-10 px-4">
            <div className="w-full max-w-[960px]">
                <h1 className="text-3xl font-bold mb-10 flex items-center gap-2">
                    <span role="img" aria-label="manage">🛠️</span>
                    커뮤니티 관리
                </h1>
                {/* 이하 동일 */}
            </div>
        </div>
    );
};

export default CommunityManagement;
