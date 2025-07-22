import React, { useEffect, useState } from "react";
import { FaUser, FaCrown, FaTrashAlt, FaEdit, FaPlus, FaUserSlash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const CommunityManagement = () => {
    const navigate = useNavigate();
    const { id: communityId } = useParams();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [communityInfo, setCommunityInfo] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [kickLoading, setKickLoading] = useState<number | null>(null);

    // 게시판 수정 모달 상태
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editBoard, setEditBoard] = useState<any>(null);
    const [editName, setEditName] = useState("");
    const [editDesc, setEditDesc] = useState("");
    const [editLoading, setEditLoading] = useState(false);

    // 데이터 불러오기
    const fetchInfo = () => {
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
    };

    useEffect(() => {
        if (!communityId) return;
        fetchInfo();
        // eslint-disable-next-line
    }, [communityId]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">{error}</div>;
    if (!communityInfo) return null;

    // 소유자 여부
    const isOwner = String(user?.id) === String(communityInfo.members?.find((m: any) => m.role === "OWNER")?.userId);
    const isPremium = communityInfo?.plan?.levelCode === "PREMIUM" || communityInfo?.plan?.levelName?.includes("프리미엄");
    const getPlanColor = (code: string) => code === "PREMIUM" ? "text-orange-500" : "text-purple-600";
    const roleIcon = (role: string) =>
        role === "OWNER" ? <FaCrown className="text-yellow-500 text-lg mr-1" /> : <FaUser className="text-gray-500 mr-1" />;

    // 멤버 강퇴
    const handleKick = async (userId: number) => {
        if (!window.confirm("정말 이 멤버를 강퇴하시겠습니까?")) return;
        setKickLoading(userId);
        try {
            await api.delete(`/communities/${communityId}/admin/manage/kick/${userId}`);
            alert("멤버가 강퇴되었습니다.");
            fetchInfo();
        } catch (e: any) {
            alert(e?.response?.data || "강퇴에 실패했습니다.");
        } finally {
            setKickLoading(null);
        }
    };

    // 게시판 수정 모달 오픈
    const openEditModal = (board: any) => {
        setEditBoard(board);
        setEditName(board.name);
        setEditDesc(board.description || "");
        setEditModalOpen(true);
    };

    // 게시판 수정
    const handleEditBoard = async () => {
        if (!editBoard || !editName.trim()) return;
        setEditLoading(true);
        try {
            await api.put(`/communities/${communityId}/admin/manage/board/${editBoard.boardId}`, {
                name: editName.trim(),
                description: editDesc.trim(),
            });
            setEditModalOpen(false);
            fetchInfo();
        } catch (e: any) {
            alert(e?.response?.data || "게시판 수정에 실패했습니다.");
        } finally {
            setEditLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen flex justify-center py-10 px-4">
            <div className="w-full max-w-[960px]">
                <h1 className="text-3xl font-bold mb-10 flex items-center gap-2">
                    <span role="img" aria-label="manage">🛠️</span>
                    커뮤니티 관리
                </h1>

                {/* 멤버 리스트 */}
                <section className="mb-16">
                    <h2 className="text-2xl font-semibold mb-4">멤버 리스트</h2>
                    <div className="border rounded-xl shadow p-4">
                        <div className="grid grid-cols-4 font-medium text-gray-600 border-b py-2">
                            <span>멤버</span>
                            <span>역할</span>
                            <span>가입일</span>
                            <span>작업</span>
                        </div>
                        {communityInfo.members.map((m: any) => (
                            <div
                                key={m.userId}
                                className="grid grid-cols-4 items-center border-b py-3 text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    {roleIcon(m.role)}
                                    <img
                                        src={m.profileImageUrl || "/avatar-default.png"}
                                        alt="프로필"
                                        className="w-7 h-7 rounded-full object-cover border"
                                    />
                                    <span>{m.nickname}</span>
                                </div>
                                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded w-fit">
                                    {m.role === "OWNER"
                                        ? <FaCrown className="text-yellow-500 text-xs mr-1" />
                                        : <FaUser className="text-gray-500 text-xs mr-1" />}
                                    <span className={m.role === "OWNER" ? "font-bold text-yellow-800" : ""}>
                                        {m.role === "OWNER" ? "운영자" : "일반 멤버"}
                                    </span>
                                </div>
                                <span className="text-gray-500">{m.joinedAt?.slice(0, 10)}</span>
                                <button
                                    className="bg-red-600 text-white px-2 py-1 text-sm w-fit flex items-center rounded gap-1 disabled:opacity-50"
                                    disabled={!isOwner || m.role === "OWNER" || kickLoading === m.userId}
                                    onClick={() => handleKick(m.userId)}
                                >
                                    {kickLoading === m.userId
                                        ? <span className="animate-spin mr-1"><FaUserSlash /></span>
                                        : <FaUserSlash className="inline-block" />}
                                    강퇴
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 게시판 관리 */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold">게시판 관리</h2>
                        <button
                            onClick={() => isOwner && navigate(`/communities/${communityId}/board/create`)}
                            className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
                            disabled={!isOwner}
                        >
                            <FaPlus /> 게시판 생성
                        </button>
                    </div>
                    {communityInfo.boards.map((board: any) => (
                        <div
                            key={board.boardId}
                            className="flex items-center justify-between border px-4 py-3 rounded-lg mb-3"
                        >
                            <div>
                                <span className="font-semibold mr-3">{board.name}</span>
                                <span className="text-gray-500 text-sm">{board.description}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="border px-3 py-1 rounded text-sm flex items-center gap-1 disabled:opacity-50"
                                    disabled={!isOwner}
                                    onClick={() => openEditModal(board)}
                                >
                                    <FaEdit /> 수정
                                </button>
                            </div>
                        </div>
                    ))}
                </section>

                {/* === 게시판 수정 모달 === */}
                {editModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
                        <div className="bg-white rounded-2xl px-8 py-8 shadow-xl w-[340px]">
                            <h2 className="text-xl font-bold mb-5">게시판 수정</h2>
                            <div className="mb-3">
                                <label className="block text-sm mb-1">제목</label>
                                <input
                                    className="border rounded px-3 py-2 w-full"
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                />
                            </div>
                            <div className="mb-5">
                                <label className="block text-sm mb-1">설명</label>
                                <textarea
                                    className="border rounded px-3 py-2 w-full min-h-[60px]"
                                    value={editDesc}
                                    onChange={e => setEditDesc(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                                    onClick={() => setEditModalOpen(false)}
                                    disabled={editLoading}
                                >
                                    취소
                                </button>
                                <button
                                    className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
                                    onClick={handleEditBoard}
                                    disabled={editLoading || !editName.trim()}
                                >
                                    {editLoading ? "저장 중..." : "저장"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 플랜 관리 */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">플랜 관리</h2>
                    <div className="border rounded-xl shadow p-6 relative">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="font-medium text-lg">현재 플랜</p>
                                <p className={`${getPlanColor(communityInfo.plan.levelCode)} font-semibold text-xl`}>
                                    {communityInfo.plan.levelName}
                                </p>
                                {communityInfo.plan.endDate && (
                                    <p className="text-gray-500 text-sm mt-1">
                                        만료일: {communityInfo.plan.endDate}
                                    </p>
                                )}
                            </div>
                            <Button
                                className="bg-purple-600 text-white px-5 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
                                onClick={() => navigate(`/communities/${communityId}/upgrade`)}
                                disabled={!isOwner || isPremium}
                            >
                                플랜 전환
                            </Button>
                        </div>
                        <div className="bg-orange-50 border-l-4 border-orange-400 rounded p-4 mb-4 text-sm text-gray-700 flex gap-2 items-center">
                            <span className="text-2xl">✨</span>
                            <span>
                                프리미엄 플랜에서는 <b>무제한 게시판 생성</b>, <b>AI 기능</b>, <b>파일 첨부</b> 등을 사용할 수 있습니다.
                            </span>
                        </div>
                        {isPremium ? (
                            <div className="bg-green-50 border border-green-300 rounded p-4 text-sm text-gray-700 flex gap-2 items-center">
                                <span className="text-2xl">🥇</span>
                                <span>
                                    현재 <b>프리미엄 플랜</b> 사용 중입니다. 다양한 고급 기능이 활성화되어 있습니다.
                                </span>
                            </div>
                        ) : (
                            <div className="bg-yellow-50 border border-yellow-300 rounded p-4 text-sm text-gray-700 flex gap-2 items-center">
                                <span className="text-2xl">💡</span>
                                <span>
                                    <b>베이직 플랜</b> 사용 중입니다. 프리미엄으로 업그레이드하면 더 많은 기능을 이용할 수 있습니다.
                                </span>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CommunityManagement;
