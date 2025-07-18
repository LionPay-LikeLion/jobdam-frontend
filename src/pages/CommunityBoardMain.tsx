import React from "react";
import { FaBullhorn, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

export default function CommunityBoardMain(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <div className="bg-white flex justify-center w-full">
      <div className="w-full max-w-[1200px] h-auto px-4 pt-10 mx-auto">
        {/* 검색 및 버튼 영역 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-gray-300 px-4 py-2 rounded-md text-sm">전체</div>
            <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md w-[250px]">
              <FiSearch className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-500">게시글 검색</span>
            </div>
            <button className="bg-black text-white text-sm px-4 py-2 rounded-md">검색</button>
          </div>
          <button className="bg-teal-400 text-white text-sm px-5 py-2 rounded-md">
            + 게시글 작성
          </button>
        </div>

        {/* 게시판 제목 */}
        <div className="flex items-center gap-2 mb-4">
          <FaBullhorn className="text-black w-5 h-5" />
          <h2 className="text-2xl font-semibold text-black">정보 공유</h2>
        </div>

        {/* 게시글 테이블 */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr] bg-gray-50 border-b border-gray-200">
            {["제목", "게시판", "작성자", "댓글 수", "조회 수", "작성일"].map((text, idx) => (
              <div key={idx} className="py-4 px-4 text-sm font-medium text-black">
                {text}
              </div>
            ))}
          </div>

          {/* 공지 게시글 */}
          {[
            {
              id: 1,
              title: "[공지] 커뮤니티 이용 규칙 안내",
              board: "공지사항",
              author: "관리자",
              comments: 12,
              views: 245,
              date: "2025.01.15",
            },
            {
              id: 2,
              title: "[공지] 서버 점검 안내",
              board: "공지사항",
              author: "관리자",
              comments: 3,
              views: 198,
              date: "2025.01.12",
            },
          ].map((item, i) => (
            <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr] border-b border-gray-100 text-sm text-black bg-red-50">
              <div className="flex items-center gap-2 px-4 py-3">
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-[2px] rounded">공지</span>
                <div
                  onClick={() => navigate(`/community/${id}/board/detail/${item.id}`)}
                  className="text-black hover:text-blue-600 hover:underline cursor-pointer"
                >
                  {item.title}
                </div>
              </div>
              <div className="px-4 py-3">
                <span className="bg-red-500 text-white text-xs px-2 py-[2px] rounded">
                  {item.board}
                </span>
              </div>
              <div className="px-4 py-3 text-gray-700">{item.author}</div>
              <div className="px-4 py-3 text-center text-gray-700">{item.comments}</div>
              <div className="px-4 py-3 text-center text-gray-700">{item.views}</div>
              <div className="px-4 py-3 text-center text-gray-700">{item.date}</div>
            </div>
          ))}

          {/* 일반 게시글 */}
          {[
            {
              id: 3,
              title: "새로운 프로젝트 팀원을 모집합니다",
              board: "자유게시판",
              author: "김개발",
              comments: 8,
              views: 156,
              date: "2025.01.14",
            },
            {
              id: 4,
              title: "React 관련 질문이 있습니다",
              board: "Q&A",
              author: "이초보",
              comments: 15,
              views: 89,
              date: "2025.01.14",
            },
            {
              id: 5,
              title: "스터디 그룹 모집 공고",
              board: "자유게시판",
              author: "박스터디",
              comments: 6,
              views: 134,
              date: "2025.01.13",
            },
            {
              id: 6,
              title: "JavaScript 비동기 처리 방법",
              board: "Q&A",
              author: "최코딩",
              comments: 22,
              views: 267,
              date: "2025.01.12",
            },
            {
              id: 7,
              title: "프론트엔드 개발자 취업 후기",
              board: "자유게시판",
              author: "신입개발",
              comments: 18,
              views: 312,
              date: "2025.01.11",
            },
            {
              id: 8,
              title: "CSS Grid vs Flexbox 언제 사용하나요?",
              board: "Q&A",
              author: "학습중",
              comments: 11,
              views: 178,
              date: "2025.01.11",
            },
          ].map((item, i) => (
            <div
              key={item.id}
              className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr] border-b border-gray-100 text-sm text-black">
              <div className="px-4 py-3">
                <span
                  onClick={() => navigate(`/community/${id}/board/detail/${item.id}`)}
                  className="text-black hover:text-blue-600 hover:underline cursor-pointer"
                >
                  {item.title}
                </span>
              </div>
              <div className="px-4 py-3">
                <span
                  className={`px-2 py-[2px] rounded text-white text-xs ${item.board === "Q&A" ? "bg-sky-400" : "bg-teal-400"
                    }`}
                >
                  {item.board}
                </span>
              </div>
              <div className="px-4 py-3 text-gray-700">{item.author}</div>
              <div className="px-4 py-3 text-center text-gray-700">{item.comments}</div>
              <div className="px-4 py-3 text-center text-gray-700">{item.views}</div>
              <div className="px-4 py-3 text-center text-gray-700">{item.date}</div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <button className="w-8 h-8 border rounded text-gray-400">
            <FaChevronLeft className="mx-auto" />
          </button>
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              className={`w-8 h-8 border rounded ${num === 1 ? "bg-teal-400 text-white" : "text-black"
                }`}
            >
              {num}
            </button>
          ))}
          <span className="text-sm text-gray-400 mx-2">...</span>
          <button className="w-8 h-8 border rounded text-black">10</button>
          <button className="w-8 h-8 border rounded text-gray-400">
            <FaChevronRight className="mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
}
