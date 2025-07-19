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
        <div className="bg-white min-h-screen py-10 px-40">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold">게시판</h1>
                <button
                    onClick={() => isOwner ? navigate(`/community/${id}/board/create`) : null}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isOwner 
                            ? "bg-black text-white hover:bg-gray-800 cursor-pointer" 
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!isOwner}
                    title={isOwner ? "게시판 생성" : "게시판 생성 권한이 없습니다"}
                >
                    <FaPlus className="w-4 h-4" />
                    게시판 생성
                </button>
            </div>
            <div className="grid grid-cols-2 gap-10">
                {boards.map((board) => (
                    <div
                        key={board.communityBoardId}
                        className="bg-white rounded-xl border border-gray-200 shadow-md p-6 flex flex-col justify-between h-64"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            {getBoardIcon(board.boardTypeCode)}
                            <span className="text-lg font-semibold">{board.name}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{board.description}</p>
                        <div className="flex justify-end mb-4">
                            <span className={`text-xs px-2 py-1 rounded-full border ${getBoardTypeColor(board.boardTypeCode)}`}>
                                {board.boardTypeCode}
                            </span>
                        </div>
                        <button
                            onClick={() => navigate(`/community/${id}/board/${board.communityBoardId}`)}
                            className="bg-black text-white py-2 rounded-lg shadow-md"
                        >
                            게시판 입장
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommunityBoardList;
