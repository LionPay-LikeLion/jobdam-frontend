import React, { useEffect, useState } from "react";
import { FaHeart, FaComment, FaEye } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { fetchSnsPosts } from "@/lib/snsApi";
import { useAuth } from "@/contexts/AuthContext";

const SNSFeedHome = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      fetchSnsPosts()
        .then(data => setPosts(data))
        .catch(err => setPosts([]))
        .finally(() => setLoading(false));
    }
  }, [isLoading]);



  if (loading) return <div className="text-center py-10">로딩중...</div>;

  return (
    <div className="flex w-full justify-center bg-white">
      <main className="flex-1 px-10">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold">SNS 피드</h1>
          <p className="text-base text-gray-700 mt-2">사용자들이 공유한 소중한 의견입니다.</p>
        </div>

        {/* 필터 영역 */}
        <div className="flex items-center gap-4 bg-white border rounded-lg shadow p-4 mb-8">
          <label className="text-sm font-medium">작성자 유형:</label>
          <select className="h-[42px] w-[100px] border border-gray-300 rounded-md px-3 text-sm">
            <option>전체</option>
            <option>구직자</option>
            <option>컨설턴트</option>
            <option>기업</option>
          </select>
          <label className="text-sm font-medium ml-4">정렬 기준:</label>
          <select className="h-[42px] w-[100px] border border-gray-300 rounded-md px-3 text-sm">
            <option>최신순</option>
            <option>인기순</option>
          </select>
          <input
            type="text"
            placeholder="키워드 검색"
            className="ml-auto border px-3 py-1 rounded-md w-[280px] text-sm"
          />
          <button className="bg-black text-white px-4 py-1 rounded-md text-sm">검색</button>
        </div>

        {/* 게시글 카드 */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.snsPostId} className="flex border rounded-lg shadow p-6 bg-white">
              <Link to={`/${post.snsPostId}`} className="w-full flex">
                <div className="w-[300px] h-[216px] bg-gray-300 rounded-md">
                  {post.imageUrl && <img src={post.imageUrl} alt="썸네일" className="w-full h-full object-cover rounded-md" />}
                </div>
                <div className="ml-6 flex flex-col justify-between w-full">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{post.nickname}</p>
                      <p className="text-sm text-gray-500">{post.createdAt}</p>
                    </div>
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                      {post.memberTypeCode}
                    </span>
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
  );
};

export default SNSFeedHome;
