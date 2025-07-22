import React, { useEffect, useState } from "react";
import { FaHeart, FaComment, FaEye, FaRegBookmark } from "react-icons/fa";
import { FiSearch, FiFilter } from "react-icons/fi";
import { Link } from "react-router-dom";
import { fetchSnsPosts, searchByKeyword, fetchSnsPostsFiltered } from "@/lib/snsApi";
import { useAuth } from "@/contexts/AuthContext";
import clsx from "clsx";

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

  if (loading) return <div className="text-center py-10 text-gray-400">로딩중...</div>;

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans">
      {/* 상단 헤더 */}
      <div className="w-full py-10 px-4 md:px-0 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-[900px] mx-auto flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">피드 보기</h1>
          <p className="text-base md:text-lg text-gray-500 mt-2 font-medium">사용자들이 공유한 소중한 의견입니다.</p>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto flex flex-col px-2 md:px-0">
        {/* 필터 영역 */}
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl shadow-sm p-4 mt-6 mb-6 flex-nowrap min-w-0">
          <FiFilter className="text-blue-400 text-lg mr-1" />
          <label className="text-xs font-bold text-gray-500">작성자 유형:</label>
          <select
            className="h-8 w-[80px] border border-gray-200 rounded-md px-2 text-xs bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-200"
            value={memberType}
            onChange={e => setMemberType(e.target.value)}
          >
            <option value="">전체</option>
            <option value="GENERAL">구직자</option>
            <option value="HUNTER">컨설턴트</option>
            <option value="EMPLOYEE">기업</option>
          </select>
          <label className="text-xs font-bold text-blue-400 ml-2">정렬 기준:</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-8 w-[80px] border border-gray-200 rounded-md px-2 text-xs bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-200">
            <option value="latest">최신순</option>
            <option value="likes">인기순</option>
          </select>
          <span className="ml-4 mr-1 font-bold text-blue-400 text-xs flex items-center"><FiSearch className="mr-1" />제목/내용</span>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="키워드 검색"
            className="border border-gray-200 px-2 py-1 rounded-md w-[120px] text-xs bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-200 placeholder:text-gray-400"
          />
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs font-bold shadow hover:scale-105 transition-transform"
            onClick={async () => {
              try {
                let data = [];

                if (keyword.trim() !== "") {
                  data = await searchByKeyword(keyword);
                } else {
                  data = await fetchSnsPosts();
                }

          <div className="flex flex-col gap-6 pb-8">
            {posts.map((post) => {
              const isPremiumUser = post.subscriptionLevelCode === "PREMIUM";
              // 삭제된 게시글 처리
              if (post.boardStatusCode === "DELETED") {
                return (
                  <div
                    key={post.snsPostId}
                    className="flex rounded-2xl shadow-md border border-gray-100 bg-gray-100 text-gray-400 min-h-[180px] items-center justify-center"
                  >
                    <div className="w-full text-center py-12 text-lg font-semibold">
                      삭제된 게시글입니다.
                    </div>
                  </div>
                );
              }

              // 정상 게시글 렌더링
              return (
                <Link
                  to={`/${post.snsPostId}`}
                  key={post.snsPostId}
                  className={clsx(
                    "bg-white rounded-2xl shadow-md border border-gray-100 px-0 py-0 flex flex-row transition hover:shadow-lg cursor-pointer group focus:ring-2 focus:ring-blue-400 outline-none min-h-[180px] relative",
                    isPremiumUser && "ring-2 ring-blue-300"
                  )}
                  tabIndex={0}
                >
                  {/* 왼쪽: 이미지 */}
                  <div className="w-[220px] h-[180px] bg-gray-100 rounded-l-2xl overflow-hidden flex items-center justify-center flex-shrink-0">
                    {post.imageUrl && post.imageUrl !== "string" && post.imageUrl !== "" ? (
                      <img
                        src={post.imageUrl}
                        alt="썸네일"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📷</div>
                          <div className="text-sm">이미지 없음</div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* 오른쪽: 게시글 내용 */}
                  <div className="flex flex-col flex-1 justify-between p-6">
                    <div className="flex items-center gap-3 mb-2">
                      {isPremiumUser && (
                        <span className="px-2 py-0.5 rounded bg-yellow-200 text-yellow-800 text-xs font-bold">
                          프리미엄
                        </span>
                      )}
                      <span className="font-semibold text-lg">{post.title}</span>
                    </div>
                    <div className="flex-1 text-gray-600 line-clamp-2">{post.content}</div>
                    <div className="flex justify-between items-end mt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{post.nickname}</span>
                        <span>·</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-4 text-gray-400 text-sm">
                        <span>👍 {post.likeCount}</span>
                        <span>💬 {post.commentCount}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

            
                {/* 오른쪽: 텍스트/닉네임/회원유형/본문/아이콘 */}
                <div className="flex-1 flex flex-col justify-between p-6 min-w-0">
                  {/* 우측 상단 좋아요/북마크 버튼 */}
                  <div className="absolute top-4 right-6 flex items-center gap-4 z-10">
                    <button
                      className="focus:outline-none"
                      tabIndex={-1}
                      onClick={e => { e.preventDefault(); /* 좋아요 토글 함수 연결 */ }}
                    >
                      <FaHeart className={post.liked ? "text-pink-500 w-6 h-6" : "text-gray-300 w-6 h-6"} />
                    </button>
                    <button
                      className="focus:outline-none"
                      tabIndex={-1}
                      onClick={e => { e.preventDefault(); /* 북마크 토글 함수 연결 */ }}
                    >
                      <FaRegBookmark className={post.bookmarked ? "text-blue-400 w-6 h-6" : "text-gray-300 w-6 h-6"} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-gray-900 text-base truncate max-w-[120px]">{post.nickname ?? "닉네임"}</span>
                    <span className={clsx(
                      "px-2 py-0.5 rounded-full text-xs font-bold",
                      post.memberTypeCode === "GENERAL" && "bg-blue-100 text-blue-700",
                      post.memberTypeCode === "HUNTER" && "bg-green-100 text-green-700",
                      post.memberTypeCode === "EMPLOYEE" && "bg-purple-100 text-purple-700"
                    )}>
                      {post.memberTypeCode === "GENERAL"
                        ? "구직자"
                        : post.memberTypeCode === "HUNTER"
                          ? "컨설턴트"
                          : post.memberTypeCode === "EMPLOYEE"
                            ? "기업"
                            : post.memberTypeCode}
                    </span>
                    {isPremiumUser && (
                      <span className="ml-2 text-blue-500 font-extrabold text-xs animate-pulse">PREMIUM</span>
                    )}
                  </div>
                  {/* 글 제목 */}
                  <div className="text-xl font-bold text-gray-900 mb-1 truncate">{post.title}</div>
                  {/* 본문 요약 */}
                  <div className="text-gray-700 text-base line-clamp-2 break-words mb-4">{post.content}</div>
                  <div className="flex items-center gap-8 text-gray-400 text-sm select-none mt-auto">
                    <div className="flex items-center gap-1">
                      <FaHeart className={post.liked ? "text-pink-500" : "text-gray-300"} />
                      <span className={clsx(post.liked && "font-bold text-pink-500")}>{post.likeCount}</span>
                    </div>
                    <div className="ml-6 flex flex-col justify-between w-full">
                      <div className="flex justify-between items-center">
                        <div className="relative flex items-center gap-3">
                          {/* 프로필 이미지 */}
                          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mr-2">
                            {post.profileImageUrl ? (
                              <img
                                src={post.profileImageUrl}
                                alt={post.nickname}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-400 text-xl">👤</span>
                            )}
                          </div>
                          {/* 닉네임 */}
                          <p className={clsx("font-bold text-xl text-black", isPremiumUser && "pr-8")}>{post.nickname}</p>
                          {/* PREMIUM 왕관 아이콘 */}
                          {isPremiumUser && (
                            <span className="absolute -top-4 right-0 animate-bounce z-10">
                              <FaCrown className="text-yellow-400 drop-shadow-lg" style={{ fontSize: 32, filter: "drop-shadow(0 0 6px gold)" }} />
                            </span>
                          )}
                          {/* MemberType 뱃지 */}
                          <span
                            className={clsx(
                              "px-3 py-1 rounded-full text-xs font-bold ml-2",
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
                            <span className="ml-2 text-yellow-500 font-extrabold text-base drop-shadow-sm">PREMIUM</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          {/* 좋아요 아이콘 - 내가 했으면 큼지막하고 진하게 */}
                          <div className="flex items-center gap-1">
                            <FaHeart
                              className={clsx(
                                post.liked ? "text-red-500" : "text-gray-300",
                                post.liked ? "w-7 h-7" : "w-5 h-5"
                              )}
                            />
                            <span className={clsx("font-bold", post.liked && "text-red-500 text-lg")}>{post.likeCount}</span>
                          </div>
                          {/* 북마크 아이콘 - 내가 했으면 큼지막하고 진하게 */}
                          <div className="flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill={post.bookmarked ? "#2563eb" : "none"}
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke={post.bookmarked ? "#2563eb" : "#d1d5db"}
                              className={clsx(post.bookmarked ? "w-7 h-7" : "w-5 h-5")}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 5a2 2 0 0 1 2 2v12l-7-4-7 4V7a2 2 0 0 1 2-2h10z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h3 className="text-xl font-bold">{post.title}</h3>
                        <p className="text-base mt-2 text-gray-700">{post.content}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FaHeart className={post.liked ? "text-red-500" : "text-gray-400"} />
                          {post.likeCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <FaComment className="text-blue-500" />
                          {post.commentCount}
                        </div>
                      </div>
                    </div>
                    {isPremiumUser && (
                      <span className="ml-auto px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-extrabold border border-blue-200 shadow animate-pulse">
                        PREMIUM
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SNSFeedHome;
