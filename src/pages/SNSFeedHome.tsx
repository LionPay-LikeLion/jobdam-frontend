import React, { useEffect, useState } from "react";
import { FaHeart, FaComment, FaEye } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
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

  const isPremium = (subscriptionLevelCode: string) => {
    return subscriptionLevelCode === "PREMIUM";
  };

  if (loading) return <div className="text-center py-10">로딩중...</div>;

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="max-w-[1280px] mx-auto flex px-4 md:px-6">
        <main className="flex-1 w-full">
          <div className="container mx-auto mt-12 mb-8 px-4 text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">SNS 피드</h1>
            <p className="text-base text-gray-500 mt-2">사용자들이 공유한 소중한 의견입니다.</p>
          </div>
          
          {/* 필터 영역 */}
          <div className="flex items-center gap-4 bg-white border rounded-lg shadow p-4 mb-8 flex-nowrap min-w-0">
            <label className="text-sm font-medium">작성자 유형:</label>
            <select className="h-[42px] w-[100px] border border-gray-300 rounded-md px-3 text-sm">
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
              className="bg-black text-white px-4 py-1 rounded-md text-sm"
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
            >
              검색
            </button>
          </div>

          {/* 게시글 카드 */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.snsPostId}
                className={clsx(
                  "flex border rounded-lg shadow p-6 bg-white transition-all duration-300 relative",
                  isPremium(post.subscriptionLevelCode) && [
                    "border-4 border-yellow-500",
                    "shadow-lg hover:shadow-xl"
                  ]
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
                      <div>
                        <p className="font-medium">{post.nickname}</p>
                        <p className="text-sm text-gray-500">{post.createdAt}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isPremium(post.subscriptionLevelCode) && (
                          <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                            PREMIUM
                          </span>
                        )}
                        <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                          {post.memberTypeCode}
                        </span>
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
                </Link>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SNSFeedHome;
