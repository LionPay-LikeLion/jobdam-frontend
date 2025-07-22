import React, { useEffect, useState } from "react";
import { FaRegCommentDots, FaQuestionCircle, FaInfoCircle, FaBullhorn, FaCamera, FaPlus } from "react-icons/fa";
import { HiSpeakerphone } from "react-icons/hi";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

interface CommunityBoard {
    communityBoardId: number;
    name: string;
    description: string;
    boardTypeCode: string;
    boardStatusCode: string;
}

interface CommunityMember {
    userId: number;
    nickname: string;
    joinedAt: string;
    profileImageUrl: string | null;
    communityMemberRoleCode: string;
    memberTypeCode: string;
}

// 게시판 타입에 따른 아이콘 매핑
const getBoardIcon = (boardTypeCode: string) => {
    switch (boardTypeCode) {
        case "GENERAL":
            return <FaRegCommentDots className="w-4 h-4" />;
        case "NOTICE":
            return <FaInfoCircle className="w-4 h-4" />;
        case "QNA":
            return <FaQuestionCircle className="w-4 h-4" />;
        case "ANNOUNCEMENT":
            return <FaBullhorn className="w-4 h-4" />;
        case "FEEDBACK":
            return <HiSpeakerphone className="w-4 h-4" />;
        default:
            return <FaRegCommentDots className="w-4 h-4" />;
    }
};

// 게시판 타입에 따른 색상 매핑
const getBoardTypeColor = (boardTypeCode: string) => {
    switch (boardTypeCode) {
        case "GENERAL":
            return "bg-blue-100 text-blue-800 border-blue-200";
        case "NOTICE":
            return "bg-red-100 text-red-800 border-red-200";
        case "QNA":
            return "bg-green-100 text-green-800 border-green-200";
        case "ANNOUNCEMENT":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "FEEDBACK":
            return "bg-purple-100 text-purple-800 border-purple-200";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
};

// 게시판 타입에 따른 한글명 매핑
const getBoardTypeName = (boardTypeCode: string) => {
    switch (boardTypeCode) {
        case "GENERAL":
            return "자유게시판";
        case "NOTICE":
            return "공지사항";
        case "QNA":
            return "Q&A";
        case "ANNOUNCEMENT":
            return "자료공유";
        case "FEEDBACK":
            return "스터디 모집";
        default:
            return boardTypeCode;
    }
};

export const CommunityBoardList = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [boards, setBoards] = useState<CommunityBoard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOwner, setIsOwner] = useState(false);
    const [checkingPermission, setCheckingPermission] = useState(true);

    useEffect(() => {
        fetchBoards();
        checkUserPermission();
    }, [id]);

    const fetchBoards = async () => {
        try {
            setLoading(true);
            const response = await api.get<CommunityBoard[]>(`/communities/${id}/boards`);
            setBoards(response.data);
        } catch (error) {
            console.error('게시판 목록 조회 실패:', error);
            setError("게시판 목록을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const checkUserPermission = async () => {
        try {
            setCheckingPermission(true);
            // 현재 사용자의 커뮤니티 내 역할 확인
            const response = await api.get<CommunityMember[]>(`/communities/${id}/members`);
            const currentUser = response.data.find(member =>
                member.userId.toString() === user?.id
            );

            // OWNER 또는 ADMIN 권한 확인
            setIsOwner(currentUser?.communityMemberRoleCode === 'OWNER' ||
                currentUser?.communityMemberRoleCode === 'ADMIN');
        } catch (error) {
            console.error('권한 확인 실패:', error);
            setIsOwner(false);
        } finally {
            setCheckingPermission(false);
        }
    };

    if (loading || checkingPermission) {
        return (
            <div className="bg-white min-h-screen py-10 px-40">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">게시판 목록을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white min-h-screen py-10 px-40">
                <div className="text-center text-red-600">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 pb-10">
            {/* 상단 타이틀/버튼 영역 */}
            <div className="w-full py-10 px-4 md:px-0 bg-white shadow-sm border-b border-gray-100 mb-8">
                <div className="max-w-[900px] mx-auto flex flex-row items-center justify-between text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">게시판</h1>
                    {/* 게시판 생성 버튼 제거 */}
                </div>
            </div>
            {/* 게시판 카드 리스트 */}
            <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {boards.map((board, idx) => {
                    const pastelColors = [
                        "bg-blue-50 border-blue-100",
                        "bg-pink-50 border-pink-100",
                        "bg-purple-50 border-purple-100",
                        "bg-yellow-50 border-yellow-100"
                    ];
                    return (
                        <div
                            key={board.communityBoardId}
                            className={`rounded-2xl shadow-md border ${pastelColors[idx % pastelColors.length]} p-7 flex flex-col min-h-[220px] transition-all group hover:shadow-lg`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <span className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 border border-gray-100 shadow text-xl">
                                    {getBoardIcon(board.boardTypeCode)}
                                </span>
                                <span className="text-xl font-bold text-gray-900 truncate">{board.name}</span>
                            </div>
                            <p className="text-gray-700 text-base mb-4 line-clamp-2 break-words">{board.description}</p>
                            <div className="flex items-center gap-2 mt-auto">
                                <span className={`text-xs px-3 py-1 rounded-full border font-bold ${getBoardTypeColor(board.boardTypeCode)}`}>{getBoardTypeName(board.boardTypeCode)}</span>
                                <span className={`ml-auto`}>
                                    <button
                                        onClick={() => navigate(`/communities/${id}/board/${board.communityBoardId}`)}
                                        className="px-4 py-2 rounded-md bg-blue-500 text-white font-bold shadow hover:bg-blue-600 transition-all text-sm"
                                    >
                                        게시판 입장
                                    </button>
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CommunityBoardList;
