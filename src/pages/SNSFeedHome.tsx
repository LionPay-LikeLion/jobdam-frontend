import React, { useEffect, useState } from "react";
import { FaHeart, FaComment, FaPlus, FaCrown } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { fetchSnsPosts, searchByKeyword, fetchSnsPostsFiltered } from "@/lib/snsApi";
import { useAuth } from "@/contexts/AuthContext";
import clsx from "clsx";

// 기존 필터 select 유지
const SNSFeedHome = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoading } = useAuth();
  const [memberType, setMemberType] = useState<string>("");
  const [sort, setSort] = useState<string>("latest");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchSnsPostsFiltered(memberType, sort)
        .then(data => setPosts(data))
        .catch(() => setPosts([]))
        .finally(() => setLoading(false));
  }, [memberType, sort]);

  const isPremium = (subscriptionLevelCode: string) => {
    return subscriptionLevelCode === "PREMIUM";
  };

  // 상단 필터&검색바
  const FilterBar = (
      <div className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 flex flex-wrap items-center px-4 py-2 mb-5 shadow-sm">
        {/* 작성자 유형 필터 */}
        <select
            className="h-10 border border-gray-300 rounded-md px-3 text-sm mr-2"
            value={memberType}
            onChange={e => setMemberType(e.target.value)}
        >
          <option value="">전체</option>
          <option value="GENERAL">구직자</option>
          <option value="HUNTER">컨설턴트</option>
          <option value="EMPLOYEE">기업</option>
        </select>
        {/* 정렬 기준 */}
        <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="h-10 border border-gray-300 rounded-md px-3 text-sm mr-2"
        >
          <option value="latest">최신순</option>
          <option value="likes">인기순</option>
        </select>
        {/* 검색창 */}
        <div className="relative flex-1 max-w-[300px] mr-2">
          <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="제목/내용 검색"
              className="border px-3 py-2 rounded-md w-full text-sm pr-10"
              onKeyDown={e => { if (e.key === "Enter") handleSearch(); }}
          />
          <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={handleSearch}
          >
            <FiSearch className="w-5 h-5" />
          </button>
        </div>
        {/* 글작성 버튼 (우측 플로팅) */}
        <button
            onClick={() => window.location.href = '/sns-post-write'}
            className="ml-auto flex items-center justify-center rounded-full w-10 h-10 bg-black text-white text-xl shadow hover:bg-gray-800"
            title="글 작성하기"
        >
          <FaPlus />
        </button>
      </div>
  );

  async function handleSearch() {
    try {
      let data = [];
      if (keyword.trim() !== "") {
        data = await searchByKeyword(keyword);
      } else {
        data = await fetchSnsPosts();
      }
      const filtered = data
          .filter(post => memberType === "" || post.memberTypeCode === memberType)
          .sort((a, b) => sort === "likes" ? b.likeCount - a.likeCount : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPosts(filtered);
    } catch (err) {
      setPosts([]);
    }
  }

  if (loading) return <div className="text-center py-10">로딩중...</div>;

  return (
      <div className="w-full bg-gray-50 min-h-screen">
        {/* 상단 고정 필터바 */}
        {FilterBar}
        {/* 인스타 그리드 스타일 피드 */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-3 pb-12">
          {posts.map((post) => {
            const isPremiumUser = isPremium(post.subscriptionLevelCode);

            // 삭제된 게시글 처리
            if (post.boardStatusCode === "DELETED") {
              return (
                  <div
                      key={post.snsPostId}
                      className="flex items-center justify-center min-h-[370px] rounded-xl bg-gray-100 text-gray-400 border border-dashed"
                  >
                    <div className="text-lg font-semibold">삭제된 게시글입니다.</div>
                  </div>
              );
            }

            return (
                <Link
                    key={post.snsPostId}
                    to={`/${post.snsPostId}`}
                    className={clsx(
                        "group block bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-2xl transition-all relative",
                        isPremiumUser && "ring-2 ring-yellow-300 border-yellow-200"
                    )}
                    style={{ minHeight: 370 }}
                >
                  {/* 프리미엄 왕관 */}
                  {isPremiumUser && (
                      <span className="absolute top-3 left-3 z-10">
                  <FaCrown className="text-yellow-400 drop-shadow" style={{ fontSize: 22, filter: "drop-shadow(0 0 3px gold)" }} />
                </span>
                  )}
                  {/* 이미지 영역 */}
                  <div className="w-full h-[220px] bg-gray-200 flex items-center justify-center overflow-hidden">
                    {post.imageUrl && post.imageUrl !== "string" && post.imageUrl !== "" ? (
                        <img src={post.imageUrl} alt="썸네일" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <span className="text-4xl">📷</span>
                          <span className="text-xs mt-2">이미지 없음</span>
                        </div>
                    )}
                  </div>
                  {/* 카드 하단 정보 */}
                  <div className="p-4">
                    {/* 닉네임/뱃지/프리미엄 */}
                    <div className="flex items-center gap-2 mb-2">
                      {/* 프로필 이미지 */}
                      {post.profileImageUrl ? (
                          <img
                              src={post.profileImageUrl}
                              alt={post.nickname}
                              className="w-7 h-7 rounded-full object-cover border border-gray-300 bg-gray-100"
                          />
                      ) : (
                          <span className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 text-gray-400 text-lg">👤</span>
                      )}
                      <span className="font-bold text-base text-gray-900">{post.nickname}</span>
                      {/* 뱃지 */}
                      <span
                          className={clsx(
                              "px-2 py-0.5 rounded-full text-xs font-bold",
                              post.memberTypeCode === "GENERAL" && "bg-blue-100 text-blue-800 border border-blue-300",
                              post.memberTypeCode === "HUNTER" && "bg-green-100 text-green-800 border border-green-300",
                              post.memberTypeCode === "EMPLOYEE" && "bg-yellow-100 text-yellow-800 border border-yellow-300"
                          )}
                      >
                    {post.memberTypeCode === "GENERAL"
                        ? "구직자"
                        : post.memberTypeCode === "HUNTER"
                            ? "컨설턴트"
                            : post.memberTypeCode === "EMPLOYEE"
                                ? "기업"
                                : post.memberTypeCode}
                  </span>
                      {isPremiumUser && (
                          <span className="ml-1 text-yellow-500 font-extrabold text-xs">PREMIUM</span>
                      )}
                    </div>
                    {/* 제목/내용 */}
                    <div>
                      <h3 className="text-base font-semibold truncate">{post.title}</h3>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-2">{post.content}</p>
                    </div>
                    {/* 아이콘/숫자 영역 */}
                    <div className="flex items-center justify-between mt-4 text-gray-500">
                      <div className="flex gap-5">
                    <span className="flex items-center gap-1">
                      <FaHeart className={clsx(post.liked ? "text-red-500" : "text-gray-300")} />
                      <span className="text-sm">{post.likeCount}</span>
                    </span>
                        <span className="flex items-center gap-1">
                      <FaComment className="text-blue-500" />
                      <span className="text-sm">{post.commentCount}</span>
                    </span>
                      </div>
                      {/* 북마크 */}
                      <span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={post.bookmarked ? "#2563eb" : "none"}
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke={post.bookmarked ? "#2563eb" : "#d1d5db"}
                        className={clsx(post.bookmarked ? "w-6 h-6" : "w-5 h-5")}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 5a2 2 0 0 1 2 2v12l-7-4-7 4V7a2 2 0 0 1 2-2h10z" />
                    </svg>
                  </span>
                    </div>
                  </div>
                </Link>
            );
          })}
        </div>
      </div>
  );
};

export default SNSFeedHome;
