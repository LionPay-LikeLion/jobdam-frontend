import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Community {
  communityId: number;
  name: string;
  description: string;
  subscriptionLevelCode: string;
  ownerNickname: string;
  maxMember: number;
  currentMember: number;
  enterPoint: number;
}

function CommunityMain() {
  const [data, setData] = useState<Community[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8081/api/communities")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error}</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">커뮤니티 목록</h1>
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">이름</th>
            <th className="border px-4 py-2">설명</th>
            <th className="border px-4 py-2">커뮤니티 등급</th>
            <th className="border px-4 py-2">방장</th>
            <th className="border px-4 py-2">최대 인원</th>
            <th className="border px-4 py-2">현재 인원</th>
            <th className="border px-4 py-2">입장 포인트</th>
          </tr>
        </thead>
        <tbody>
          {data.map((community) => (
            <tr key={community.communityId} className="hover:bg-gray-50">
              <td className="border px-4 py-2 text-center">{community.communityId}</td>
              <td className="border px-4 py-2">
                <Link
                  to={`/community/${community.communityId}`}
                  className="text-blue-600 hover:underline"
                >
                  {community.name}
                </Link>
              </td>
              <td className="border px-4 py-2">{community.description}</td>
              <td className="border px-4 py-2 text-center">{community.subscriptionLevelCode}</td>
              <td className="border px-4 py-2">{community.ownerNickname}</td>
              <td className="border px-4 py-2 text-right">{community.maxMember}</td>
              <td className="border px-4 py-2 text-right">{community.currentMember}</td>
              <td className="border px-4 py-2 text-right">{community.enterPoint}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <div className="mt-4 text-center text-gray-500">커뮤니티가 없습니다.</div>}
    </div>
  );
}

export default CommunityMain;