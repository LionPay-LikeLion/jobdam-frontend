import React from "react";
import { FaRegCommentDots, FaQuestionCircle, FaInfoCircle, FaBullhorn, FaCamera } from "react-icons/fa";
import { HiSpeakerphone } from "react-icons/hi";
import { useParams, useNavigate } from "react-router-dom";

const boards = [
  {
    id: "free",
    icon: <FaRegCommentDots className="w-4 h-4" />,
    title: "자유게시판",
    description: "자유롭게 이야기를 나누는 공간입니다. 일상 이야기부터 취미, 관심사까지 무엇이든 환영합니다.",
    posts: 247,
  },
  {
    id: "qna",
    icon: <FaQuestionCircle className="w-4 h-4" />,
    title: "질문과 답변",
    description: "궁금한 것이 있으시면 언제든지 질문해주세요. 커뮤니티 멤버들이 친절하게 답변해드립니다.",
    posts: 89,
  },
  {
    id: "info",
    icon: <FaInfoCircle className="w-4 h-4" />,
    title: "정보 공유",
    description: "유용한 정보와 팁을 공유하는 게시판입니다. 좋은 정보를 함께 나누어요.",
    posts: 156,
  },
  {
    id: "recruit",
    icon: <HiSpeakerphone className="w-4 h-4" />,
    title: "채용 정보",
    description: "채용 정보 빠르게 알아가세요.",
    posts: 23,
  },
  {
    id: "event",
    icon: <FaBullhorn className="w-4 h-4" />,
    title: "이벤트",
    description: "커뮤니티 이벤트와 활동 소식을 확인하고 참여해보세요.",
    posts: 34,
  },
  {
    id: "gallery",
    icon: <FaCamera className="w-4 h-4" />,
    title: "사진 갤러리",
    description: "멋진 사진들을 공유하고 감상하는 공간입니다. 추억을 함께 나누어요.",
    posts: 78,
  },
];

export const CommunityBoardList = () => {
    const { id } = useParams();
    const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen py-10 px-40">
      <h1 className="text-3xl font-bold mb-10">게시판</h1>
      <div className="grid grid-cols-2 gap-10">
        {boards.map((board, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 shadow-md p-6 flex flex-col justify-between h-64"
          >
            <div className="flex items-center gap-2 mb-2">{board.icon}<span className="text-lg font-semibold">{board.title}</span></div>
            <p className="text-sm text-gray-600 mb-2">{board.description}</p>
            <p className="text-xs text-gray-500 mb-4">게시글 {board.posts}개</p>
            <button
              onClick={() => navigate(`/community/${id}/board/${board.id}`)}
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
