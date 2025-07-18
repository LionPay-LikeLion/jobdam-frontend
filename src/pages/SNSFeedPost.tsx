import { useParams } from "react-router-dom";

const SNSFeedPost = () => {
  const { postId } = useParams();

  // 여기서는 postId를 백엔드에 요청해서 데이터를 받아오는 구조로 구성
  return (
    <div className="min-h-screen flex flex-col bg-white font-korean">
      <div className="max-w-[800px] mx-auto mt-20 px-6">
        <h1 className="text-3xl font-bold mb-4">게시물 상세 보기</h1>
        <p className="text-gray-500">Post ID: {postId}</p>

        {/* 여기에 실제 게시물 데이터 렌더링하면 됨 */}
      </div>
    </div>
  );
};

export default SNSFeedPost;
