import React, { useEffect, useState } from "react";
import { FaBullhorn, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/lib/api";

interface CommunityPost {
  postId: number;
  boardId: number;
  title: string;
  content: string;
  userNickname: string;
  createdAt: string;
  commentCount: number;
  viewCount: number;
  postTypeCode: string;
}

export default function CommunityBoardMain(): JSX.Element {
  const navigate = useNavigate();
  const { id, boardId } = useParams();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [postTypeCode, setPostTypeCode] = useState<string>("");
  const [boardName, setBoardName] = useState("게시판");

  useEffect(() => {
    fetchPosts();
  }, [boardId, postTypeCode]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (postTypeCode) params.append("postTypeCode", postTypeCode);
      if (keyword) params.append("keyword", keyword);

      const response = await api.get<CommunityPost[]>(`/communities/${id}/boards/${boardId}/posts?${params}`);
      setPosts(response.data);
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchPosts();
  };

  const handlePostTypeChange = (type: string) => {
    setPostTypeCode(type === "전체" ? "" : type);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const getPostTypeDisplay = (postTypeCode: string) => {
    switch (postTypeCode) {
      case "NOTICE": return "공지";
      case "NORMAL": return "일반";
      case "QNA": return "문답";
      default: return postTypeCode;
    }
  };

  const getPostTypeColor = (postTypeCode: string) => {
    switch (postTypeCode) {
      case "NOTICE": return "bg-red-500 text-white";
      case "QNA": return "bg-sky-400 text-white";
      case "NORMAL": return "bg-teal-400 text-white";
      default: return "bg-gray-400 text-white";
    }
  };

  if (loading) {
    return (
      <div className="bg-white flex justify-center w-full">
        <div className="w-full max-w-[1200px] h-auto px-4 pt-10 mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">게시글을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex justify-center w-full">
      <div className="w-full max-w-[1200px] h-auto px-4 pt-10 mx-auto">
        {/* 게시판 제목 modern 스타일 */}
        <div className="flex items-center gap-4 mb-8 mt-2">
          <FaBullhorn className="w-8 h-8 text-blue-500 drop-shadow" />
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm">{boardName || '게시판'}</h2>
        </div>
        {/* 검색 및 버튼 영역 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePostTypeChange("전체")}
                className={`px-4 py-2 rounded-md text-sm ${postTypeCode === "" ? "bg-gray-300" : "bg-gray-100"
                  }`}
              >
                전체
              </button>
              <button
                onClick={() => handlePostTypeChange("NOTICE")}
                className={`px-4 py-2 rounded-md text-sm ${postTypeCode === "NOTICE" ? "bg-red-100" : "bg-gray-100"
                  }`}
              >
                공지
              </button>
              <button
                onClick={() => handlePostTypeChange("NORMAL")}
                className={`px-4 py-2 rounded-md text-sm ${postTypeCode === "NORMAL" ? "bg-teal-100" : "bg-gray-100"}`}
              >
                일반
              </button>
              <button
                onClick={() => handlePostTypeChange("QNA")}
                className={`px-4 py-2 rounded-md text-sm ${postTypeCode === "QNA" ? "bg-sky-100" : "bg-gray-100"}`}
              >
                문답
              </button>
            </div>
          </div>
          <button
            className="bg-teal-400 text-white text-sm px-5 py-2 rounded-md"
            onClick={() => navigate(`/communities/${id}/board/${boardId}/post/write`)}
          >
            + 게시글 작성
          </button>
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

          {posts.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              게시글이 없습니다.
            </div>
          ) : (
            <>
              {/* 공지 게시글 */}
              {posts
                .filter(post => post.postTypeCode === "NOTICE")
                .map((post) => (
                  <div
                    key={post.postId}
                    className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr] border-b border-gray-100 text-sm text-black bg-red-50"
                  >
                    <div className="flex items-center gap-2 px-4 py-3">
                      <span className="bg-red-500 text-white text-[10px] px-1.5 py-[2px] rounded">
                        공지
                      </span>
                      <div
                        onClick={() => navigate(`/communities/${id}/board/detail/${post.postId}`)}
                        className="text-black hover:text-blue-600 hover:underline cursor-pointer"
                      >
                        {post.title}
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <span className={`px-2 py-[2px] rounded text-white text-xs ${getPostTypeColor(post.postTypeCode)}`}>
                        {getPostTypeDisplay(post.postTypeCode)}
                      </span>
                    </div>
                    <div className="px-4 py-3 text-gray-700">{post.userNickname}</div>
                    <div className="px-4 py-3 text-center text-gray-700 flex items-end justify-center">{post.commentCount}</div>
                    <div className="px-4 py-3 text-center text-gray-700 flex items-end justify-center">{post.viewCount}</div>
                    <div className="px-4 py-3 text-center text-gray-700">{formatDate(post.createdAt)}</div>
                  </div>
                ))
              }

              {/* 일반 게시글 */}
              {posts
                .filter(post => post.postTypeCode !== "NOTICE")
                .map((post) => (
                  <div
                    key={post.postId}
                    className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr] border-b border-gray-100 text-sm text-black"
                  >
                    <div className="flex items-center gap-2 px-4 py-3">
                      <div
                        onClick={() => navigate(`/communities/${id}/board/detail/${post.postId}`)}
                        className="text-black hover:text-blue-600 hover:underline cursor-pointer"
                      >
                        {post.title}
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <span className={`px-2 py-[2px] rounded text-white text-xs ${getPostTypeColor(post.postTypeCode)}`}>
                        {getPostTypeDisplay(post.postTypeCode)}
                      </span>
                    </div>
                    <div className="px-4 py-3 text-gray-700">{post.userNickname}</div>
                    <div className="px-4 py-3 text-center text-gray-700 flex items-end justify-center">{post.commentCount}</div>
                    <div className="px-4 py-3 text-center text-gray-700 flex items-end justify-center">{post.viewCount}</div>
                    <div className="px-4 py-3 text-center text-gray-700">{formatDate(post.createdAt)}</div>
                  </div>
                ))
              }
            </>
          )}
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
    </div >
  );
}
