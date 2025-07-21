// CommunityMemberList.tsx
import React, { useState, useEffect } from "react";
import { FiMessageSquare } from "react-icons/fi";
import { HiOutlineEye } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { sendMessage } from "@/lib/messageApi";

interface CommunityMember {
    userId: number;
    nickname: string;
    joinedAt: string;
    profileImageUrl: string | null;
    communityMemberRoleCode: string;
    memberTypeCode: string;
}

export default function CommunityMemberList(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [members, setMembers] = useState<CommunityMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        fetchMembers();
    }, [id]);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/communities/${id}/members`);
            setMembers(response.data);
        } catch (error) {
            console.error('커뮤니티 멤버 조회 실패:', error);
            toast({
                title: "오류",
                description: "멤버 목록을 불러오는데 실패했습니다.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!selectedMember || !message.trim()) return;

        try {
            await sendMessage(selectedMember.userId, message);

            toast({
                title: "성공",
                description: "메시지가 전송되었습니다.",
            });

            setShowMessageModal(false);
            setMessage("");
            setSelectedMember(null);
        } catch (error) {
            console.error('메시지 전송 실패:', error);
            toast({
                title: "오류",
                description: "메시지 전송에 실패했습니다.",
                variant: "destructive",
            });
        }
    };

    const getRoleDisplay = (role: string) => {
        switch (role) {
            case 'ADMIN': return '운영자';
            case 'MEMBER': return '일반 멤버';
            default: return role;
        }
    };

    const getMemberTypeDisplay = (memberType: string) => {
        switch (memberType) {
            case 'EMPLOYEE': return '기업회원';
            case 'HUNTER': return '컨설턴트';
            case 'GENERAL': return '일반회원';
            default: return memberType;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">멤버 목록을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white font-korean px-4 py-12">
            <div className="w-full max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">멤버 목록</h1>
                <div className="mb-4 text-sm text-gray-500">
                    총 {members.length}명의 멤버
                </div>

                <div className="space-y-4">
                    {members.map((member) => (
                        <div
                            key={member.userId}
                            className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={member.profileImageUrl || "https://placehold.co/48x48"}
                                    alt={member.nickname}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-medium">{member.nickname}</span>
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded ${member.communityMemberRoleCode === "ADMIN"
                                                ? "bg-purple-600 text-white"
                                                : "bg-gray-200 text-black"
                                                }`}
                                        >
                                            {getRoleDisplay(member.communityMemberRoleCode)}
                                        </span>
                                        <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                                            {getMemberTypeDisplay(member.memberTypeCode)}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        가입일: {new Date(member.joinedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                                    onClick={() => {
                                        setSelectedMember(member);
                                        setShowMessageModal(true);
                                    }}
                                >
                                    <FiMessageSquare />
                                    메시지 전송
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 메시지 전송 모달 */}
            {showMessageModal && selectedMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">
                            {selectedMember.nickname}에게 메시지 전송
                        </h3>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="메시지를 입력하세요..."
                            className="w-full h-32 p-3 border rounded-lg resize-none mb-4"
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    setShowMessageModal(false);
                                    setMessage("");
                                    setSelectedMember(null);
                                }}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSendMessage}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                전송
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
