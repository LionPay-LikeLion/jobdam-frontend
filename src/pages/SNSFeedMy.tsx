import React, { useEffect, useState } from "react";
import { FaHeart, FaComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchMySnsPosts, deleteSnsPost } from "@/lib/snsApi";
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
    navigate(`/sns-post-edit/${id}`);
  };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm("정말 게시글을 삭제하시겠습니까?")) return;

    try {
      await deleteSnsPost(postId);
      setPosts(posts.filter((p) => p.snsPostId !== postId));
    } catch (err) {
      console.error("게시글 삭제 실패:", err);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleNewPost = () => {
    navigate("/sns-post-write");
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* 상단 타이틀/설명 영역 (SNSFeedHome과 동일) */}
      <div className="w-full py-10 px-4 md:px-0 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-[900px] mx-auto flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">내 피드</h1>
          <p className="text-base md:text-lg text-gray-500 mt-2 font-medium">작성한 글을 관리하고 편집할 수 있습니다.</p>
        </div>
      </div>
      <div className="max-w-[900px] mx-auto flex flex-col px-2 md:px-0">
        <main className="flex-1 w-full py-10">
          <div className="flex justify-end items-center mb-6">
            <button
              onClick={handleNewPost}
              className="px-4 py-2 rounded-md border border-blue-300 text-blue-600 bg-white hover:bg-blue-50 font-medium transition"
            >
              + 새 글 작성
            </button>
          </div>
          <div className="space-y-8">
            {posts.map((post) => {
              if (post.boardStatusCode === "DELETED") {
                // 삭제된 게시글 안내 카드
                return (
                  <div
                    key={post.snsPostId}
                    className="w-full bg-gray-100 border border-gray-200 rounded-lg shadow-sm p-6 flex items-center justify-center text-gray-400"
                  >
                    <div className="text-lg font-semibold">삭제된 게시글입니다.</div>
                  </div>
                );
              }

              // 정상 게시글 카드
              return (
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
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SNSFeedMy;
