// src/pages/Community.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/api"; // 설정된 axios 인스턴스를 불러옴
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Post {
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

const CommunityBoard = () => {
  const { communityId, boardId } = useParams<{ communityId: string; boardId: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!communityId || !boardId) return;
    api
      .get(`/api/communities/${communityId}/boards/${boardId}/posts`)
      .then((res) => setPosts(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [communityId, boardId]);

  return (
    <div className="min-h-screen bg-background font-korean p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">커뮤니티 게시판</h1>

      <Card>
        <CardContent className="p-4">
          {loading && <div>로딩 중...</div>}
          {error && <div className="text-red-500">에러 발생: {error}</div>}
          {!loading && !error && (
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">글번호</th>
                  <th className="border px-4 py-2">제목</th>
                  <th className="border px-4 py-2">작성자</th>
                  <th className="border px-4 py-2">작성일</th>
                  <th className="border px-4 py-2">댓글수</th>
                  <th className="border px-4 py-2">조회수</th>
                  <th className="border px-4 py-2">타입</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.postId} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 text-center">{post.postId}</td>
                    <td className="border px-4 py-2">{post.title}</td>
                    <td className="border px-4 py-2">{post.userNickname}</td>
                    <td className="border px-4 py-2">{new Date(post.createdAt).toLocaleString()}</td>
                    <td className="border px-4 py-2 text-center">{post.commentCount}</td>
                    <td className="border px-4 py-2 text-center">{post.viewCount}</td>
                    <td className="border px-4 py-2">{post.postTypeCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && !error && posts.length === 0 && (
            <div className="text-gray-500 text-center">게시글이 없습니다.</div>
          )}
        </CardContent>
      </Card>

      <Button variant="default">게시글 작성</Button>
    </div>
  );
};

export default CommunityBoard;
