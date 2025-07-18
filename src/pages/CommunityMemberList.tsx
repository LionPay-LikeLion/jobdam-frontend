// CommunityMemberList.tsx
import React from "react";
import { FiMessageSquare } from "react-icons/fi";
import { HiOutlineEye } from "react-icons/hi";

const members = [
    {
        name: "김개발",
        role: "운영자",
        joined: "2024-01-15",
        image: "https://placehold.co/48x48",
    },
    {
        name: "박서버",
        role: "일반 멤버",
        joined: "2024-01-14",
        image: "https://placehold.co/48x48",
    },
    {
        name: "이웹",
        role: "일반 멤버",
        joined: "2024-01-13",
        image: "https://placehold.co/48x48",
    },
    {
        name: "최모바일",
        role: "일반 멤버",
        joined: "2024-01-12",
        image: "https://placehold.co/48x48",
    },
    {
        name: "정데이터",
        role: "운영자",
        joined: "2024-01-11",
        image: "https://placehold.co/48x48",
    },
    {
        name: "한클라우드",
        role: "일반 멤버",
        joined: "2024-01-10",
        image: "https://placehold.co/48x48",
    },
    {
        name: "조보안",
        role: "일반 멤버",
        joined: "2024-01-09",
        image: "https://placehold.co/48x48",
    },
    {
        name: "윤인공지능",
        role: "일반 멤버",
        joined: "2024-01-08",
        image: "https://placehold.co/48x48",
    },
];

export default function CommunityMemberList(): JSX.Element {
    return (
        <div className="min-h-screen flex flex-col bg-white font-korean px-4 py-12">
            <div className="w-full max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">멤버 목록</h1>
                <div className="mb-4 text-sm text-gray-500">
                    총 {members.length}명의 멤버
                </div>

                <div className="space-y-4">
                    {members.map((member, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-medium">{member.name}</span>
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded ${member.role === "운영자"
                                                ? "bg-purple-600 text-white"
                                                : "bg-gray-200 text-black"
                                                }`}
                                        >
                                            {member.role}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        가입일: {member.joined}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex items-center gap-1 px-3 py-1 border text-sm rounded hover:bg-gray-100">
                                    <HiOutlineEye />
                                    상세 보기
                                </button>
                                <button className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700">
                                    <FiMessageSquare />
                                    메시지 전송
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
