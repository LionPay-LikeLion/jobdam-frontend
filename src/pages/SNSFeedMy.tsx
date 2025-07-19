import React, { useEffect, useState } from "react";
import { FaRegThumbsUp, FaRegCommentDots } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchMySnsPosts } from "@/lib/snsApi";
import { useAuth } from "@/contexts/AuthContext";

const SNSFeedMy = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      fetchMySnsPosts()
        .then(data => setPosts(data))
        .catch(err => setPosts([]))
        .finally(() => setLoading(false));
    }
  }, [isLoading]);

  if (loading) return <div className="text-center py-10">로딩중...</div>;

  const handleEditPost = (id: number) => {
    console.log("Edit post:", id);
  };

  const handleDeletePost = (id: number) => {
    console.log("Delete post:", id);
  };

  const handleNewPost = () => {
    navigate("/sns-post-write");
  };

  return (
    <div className="flex w-full justify-center bg-white">
      <main className="flex-1 px-12 py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold">내 피드</h2>
            <p className="text-gray-600 mt-1">작성한 글을 관리하고 편집할 수 있습니다.</p>
          </div>
          <button
            onClick={handleNewPost}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            + 새 글 작성
          </button>
        </div>
        <div className="space-y-8">
          {posts.map((post) => (
            <div
              key={post.snsPostId}
              className="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex gap-6 cursor-pointer"
              onClick={() => navigate(`/${post.snsPostId}`)}
            >
              <div className="w-64 h-48 bg-gray-200 rounded-md">
                {post.imageUrl && post.imageUrl !== "string" && post.imageUrl !== "" ? (
                  <img
                    src={post.imageUrl}
                    alt="썸네일"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-100">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📷</div>
                      <div className="text-sm">이미지 없음</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 relative">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-1">
                  <span>{post.date}</span>
                  <span
                    className="px-2 py-0.5 bg-gray-100 rounded"
                    style={{ color: post.visibilityColor }}
                  >
                    {post.visibility}
                  </span>
                  <span
                    className="px-2 py-0.5 bg-gray-100 rounded"
                    style={{ color: post.statusColor }}
                  >
                    {post.status}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-800 text-base mb-4">{post.content}</p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <FaRegThumbsUp />
                    <span>{post.likeCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaRegCommentDots />
                    <span>{post.commentCount}</span>
                  </div>
                </div>
                {!post.isDeleted ? (
                  <div className="absolute top-0 right-0 flex gap-2">
                    <button
                      onClick={() => handleEditPost(post.snsPostId)}
                      className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 text-sm"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.snsPostId)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                ) : (
                  <div className="absolute top-0 right-0 text-sm text-gray-400">삭제된 게시물</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SNSFeedMy;
