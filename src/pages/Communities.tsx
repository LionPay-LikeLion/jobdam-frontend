import axios from "axios";
import { useEffect, useState } from "react";

function Communities() {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get("http://localhost:8081/api/communities")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>에러 발생: {error}</div>;
  if (!data) return <div>로딩 중...</div>;

  return (
    <div>
      <h1>커뮤니티 목록</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Communities;