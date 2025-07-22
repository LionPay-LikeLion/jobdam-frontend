import React from "react";
import { FaUser, FaCrown, FaTrashAlt, FaEdit, FaPlus, FaUserSlash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const CommunityManagement = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const members = [
        { name: "김개발", role: "운영자", date: "2024-01-15" },
        { name: "박서버", role: "일반 멤버", date: "2024-01-14" },
        { name: "이웹", role: "일반 멤버", date: "2024-01-13" },
        { name: "최모바일", role: "일반 멤버", date: "2024-01-12" },
    ];

    const boards = ["자유게시판", "질문답변", "공지사항"];

    return (
        <>
            <div className="container mx-auto mt-12 mb-8 px-4 text-left max-w-[960px]"> {/* 줄어든 가로폭 */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">관리</h1>

                {/* 멤버 리스트 */}
                <section className="mb-16">
                    <h2 className="text-2xl font-semibold mb-4">멤버 리스트 관리</h2>
                    <div className="border rounded-xl shadow p-4">
                        <div className="grid grid-cols-4 font-medium text-gray-600 border-b py-2">
                            <span>멤버</span>
                            <span>역할</span>
                            <span>가입일</span>
                            <span>작업</span>
                        </div>
                        {members.map((m, i) => (
                            <div
                                key={i}
                                className="grid grid-cols-4 items-center border-b py-3 text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <FaUser className="text-gray-500" />
                                    {m.name}
                                </div>
                                <div className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded w-fit">
                                    <FaCrown className="text-gray-600 text-xs" />
                                    {m.role}
                                </div>
                                <span className="text-gray-500">{m.date}</span>
                                <button className="bg-red-600 text-white px-2 py-1 rounded text-sm w-fit">
                                    <FaUserSlash className="inline-block mr-1" />
                                    강퇴
                                </button>


                            </div>
                        ))}
                    </div>
                </section>

                {/* 게시판 관리 */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold">그룹 게시판 관리</h2>
                        <button
                            onClick={() => navigate(`/community/${id}/board/create`)}
                            className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                        >
                            <FaPlus /> 게시판 생성
                        </button>
                    </div>
                    {boards.map((board, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between border px-4 py-3 rounded-lg mb-3"
                        >
                            <span>{board}</span>
                            <div className="flex gap-2">
                                <button className="border px-3 py-1 rounded text-sm flex items-center gap-1">
                                    <FaEdit /> 수정
                                </button>
                                <button className="bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                                    <FaTrashAlt /> 삭제
                                </button>
                            </div>
                        </div>
                    ))}
                </section>

                {/* 플랜 관리 */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">그룹 플랜 관리</h2>
                    <div className="border rounded-xl shadow p-6 relative">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="font-medium text-lg">현재 플랜</p>
                                <p className="text-purple-600 font-semibold text-xl">베이직</p>
                            </div>
                            <button
                                className="bg-purple-600 text-white px-5 py-2 rounded-md hover:bg-purple-700 transition-colors"
                                onClick={() => navigate(`/community/${id}/upgrade`)}
                            >
                                플랜 전환
                            </button>
                        </div>

                        <div className="bg-purple-100 border-l-4 border-purple-600 rounded p-4 mb-4 text-sm text-gray-700">
                            프리미엄 플랜에서는 무제한 게시판 생성, AI 기능, 파일 첨부 등을 사용할 수 있습니다.
                        </div>

                        <div className="bg-yellow-50 border border-yellow-300 rounded p-4 text-sm text-gray-700">
                            현재 베이직 플랜을 사용 중입니다. 프리미엄으로 업그레이드하여 더 많은 기능을 이용해보세요.
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};
export default CommunityManagement;