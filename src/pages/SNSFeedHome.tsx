import React, { useEffect, useState } from "react";
import { FaHeart, FaComment, FaEye } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { fetchSnsPosts, searchByKeyword, fetchSnsPostsFiltered } from "@/lib/snsApi";
import { useAuth } from "@/contexts/AuthContext";
import clsx from "clsx";
import { FaCrown, FaPlus } from "react-icons/fa";

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

  if (loading) return <div className="text-center py-10">로딩중...</div>;

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="max-w-[1280px] mx-auto flex px-4 md:px-6">
        <main className="flex-1 w-full">
          <div className="container mx-auto mt-12 mb-8 px-4 text-left">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">SNS 피드</h1>
                <p className="text-base text-gray-500 mt-2">사용자들이 공유한 소중한 의견입니다.</p>
              </div>
            </div>
          </div>
          
          {/* 필터 영역 */}
          <div className="flex items-center gap-4 bg-white border rounded-lg shadow p-4 mb-8 flex-nowrap min-w-0">
            <label className="text-sm font-medium">작성자 유형:</label>
            <select
              className="h-[42px] w-[100px] border border-gray-300 rounded-md px-3 text-sm"
              value={memberType}
              onChange={e => setMemberType(e.target.value)}
            >
              <option value="">전체</option>
              <option value="GENERAL">구직자</option>
              <option value="HUNTER">컨설턴트</option>
              <option value="EMPLOYEE">기업</option>
            </select>
            <label className="text-sm font-medium ml-4">정렬 기준:</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-[42px] w-[100px] border border-gray-300 rounded-md px-3 text-sm">
              <option value="latest">최신순</option>
              <option value="likes">인기순</option>
            </select>
            <span className="ml-8 mr-2 font-bold text-blue-600 text-base whitespace-nowrap min-w-0">제목/내용</span>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="키워드 검색"
              className="border px-3 py-1 rounded-md w-[180px] text-sm min-w-0 flex-shrink"
            />
            <button
              className="w-12 h-12 flex items-center justify-center rounded-full bg-black text-white shadow hover:bg-gray-800 transition-all text-2xl"
              onClick={async () => {
                try {
                  let data = [];

                  if (keyword.trim() !== "") {
                    data = await searchByKeyword(keyword);
                  } else {
                    data = await fetchSnsPosts();
                  }

                  const filtered = data
                    .filter(post => {
                      return memberType === "" || post.memberTypeCode === memberType;
                    })
                    .sort((a, b) => {
                      if (sort === "likes") {
                        return b.likeCount - a.likeCount;
                      } else {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                      }
                    });

                  setPosts(filtered);
                } catch (err) {
                  console.error("통합 검색 실패:", err);
                  setPosts([]);
                }
              }}
              title="검색"
            >
              <FiSearch className="w-5 h-5" />
            </button>
            {/* + 버튼을 검색창 오른쪽에 배치 */}
            <button
              onClick={() => window.location.href = '/sns-post-write'}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-black text-white shadow hover:bg-gray-800 transition-all text-2xl"
              title="글 작성하기"
            >
              <FaPlus />
            </button>
          </div>

          {/* 게시글 카드 */}
          <div className="space-y-6">
            {posts.map((post) => {
              const isPremiumUser = isPremium(post.subscriptionLevelCode);

              // 삭제된 게시글 처리
              if (post.boardStatusCode === "DELETED") {
                return (
                  <div
                    key={post.snsPostId}
                    className="flex rounded-lg shadow p-6 border border-gray-200 bg-gray-100 text-gray-400"
                  >
                    <div className="w-full text-center py-12 text-lg font-semibold">
                      삭제된 게시글입니다.
                    </div>
                  </div>
                );
              }

              // 정상 게시글 렌더링 (기존 코드)
              return (
                <div
                  key={post.snsPostId}
                  className={clsx(
                    "flex rounded-lg shadow p-6 transition-all duration-300 relative",
                    isPremiumUser
                      ? "border-4 border-yellow-400 bg-gradient-to-br from-yellow-50 via-white to-yellow-100 shadow-2xl ring-2 ring-yellow-300"
                      : "border border-gray-200 bg-white"
                  )}
                >
                  <Link to={`/${post.snsPostId}`} className="w-full flex">
                    <div className="w-[300px] h-[216px] bg-gray-300 rounded-md overflow-hidden">
                      {post.imageUrl && post.imageUrl !== "string" && post.imageUrl !== "" ? (
                        <img src={post.imageUrl} alt="썸네일" className="w-full h-full object-cover rounded-md" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-100">
                          <div className="text-center">
                            <div className="text-4xl mb-2">📷</div>
                            <div className="text-sm">이미지 없음</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="ml-6 flex flex-col justify-between w-full">
                      <div className="flex justify-between items-center">
                        <div className="relative flex items-center gap-3">
                          {/* 프로필 이미지 */}
                          {post.profileImageUrl ? (
                            <img
                              src={post.profileImageUrl}
                              alt={post.nickname}
                              className="w-8 h-8 rounded-full object-cover border border-gray-300 bg-gray-100 mr-2"
                            />
                          ) : (
                            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-400 text-xl mr-2">👤</span>
                          )}
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
                          <FaHeart className="text-red-500" />
                          {post.likeCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <FaComment className="text-blue-500" />
                          {post.commentCount}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SNSFeedHome;
