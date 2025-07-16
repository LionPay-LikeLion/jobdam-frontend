import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

interface Board {
  communityBoardId: number;
  name: string;
  description: string;
  boardTypeCode: string;
  boardStatusCode: string;
}

const CommunityPage = () => {
  const { id } = useParams<{ id: string }>();
  const [boards, setBoards] = useState<Board[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://localhost:8081/api/communities/${id}/boards`)
      .then((res) => setBoards(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">커뮤니티 게시판 목록</h1>
      {loading && <div>로딩 중...</div>}
      {error && <div className="text-red-500">에러 발생: {error}</div>}
      {!loading && !error && (
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">게시판 ID</th>
              <th className="border px-4 py-2">이름</th>
              <th className="border px-4 py-2">설명</th>
              <th className="border px-4 py-2">타입</th>
              <th className="border px-4 py-2">상태</th>
            </tr>
          </thead>
          <tbody>
            {boards.map((board) => (
              <tr key={board.communityBoardId} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-center">{board.communityBoardId}</td>
                <td className="border px-4 py-2">
                  <Link
                    to={`/community/${id}/board/${board.communityBoardId}`}
                    className="text-blue-600 hover:underline"
                  >
                    {board.name}
                  </Link>
                </td>
                <td className="border px-4 py-2">{board.description}</td>
                <td className="border px-4 py-2">{board.boardTypeCode}</td>
                <td className="border px-4 py-2">{board.boardStatusCode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && !error && boards.length === 0 && (
        <div className="mt-4 text-center text-gray-500">게시판이 없습니다.</div>
      )}
    </div>
  );
};

export default CommunityPage;
