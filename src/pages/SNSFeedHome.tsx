import React from "react";
import { FaHeart, FaComment, FaEye } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";


const SNSFeedHome = () => {
  const posts = [
    {
      id: 1,
      author: "홍길동",
      time: "2시간 전",
      type: "구직자",
      title: "마케터 3년차, 이직 타이밍과 포트폴리오 방향에 대한 고민",
      content:
        "B2C D2C 브랜드 마케팅 업무를 3년 넘게 해오고 있는 마케터입니다. 현재는 이직을 고려 중인데, 막상 포트폴리오를 만들려니 막막하네요. 광고운영 → 콘텐츠 기획 → 데이터 분석까지...",
      likes: 32,
      comments: 17,
      views: 245,
    },
    {
      id: 2,
      author: "문정환",
      time: "12시간 전",
      type: "구직자",
      title: "이직 준비 중인데, 포트폴리오 피드백 받을 수 있을까요?",
      content:
        "현재 B2C 브랜드 마케팅 경력 3년차입니다. 지금 준비 중인 이직용 포트폴리오인데, 혹시 지나치게 디테일한지/빠진 부분 있는지 조언 주실 분 계실까요? 🙏",
      likes: 25,
      comments: 20,
      views: 189,
    },
    {
      id: 3,
      author: "멋쟁이사자처럼",
      time: "1일 전",
      type: "기업",
      title: "3개월 부트캠프 수료 후 첫 면접 후기 공유합니다!",
      content:
        "백엔드 부트캠프 수료 후 첫 면접을 보고 왔어요. Spring Boot + MySQL 기반 프로젝트 위주로 설명했고, 기술보단 팀워크 경험에 질문이 많더라구요. 비슷한 상황인 분들, 어떤 질문 받으셨는지 공유해봐요!",
      likes: 47,
      comments: 109,
      views: 892,
    },
    {
      id: 4,
      author: "김헤드헌터",
      time: "2일 전",
      type: "컨설턴트",
      title: "헤드헌터가 알려주는 이력서 작성 꿀팁 5가지",
      content:
        "10년간 헤드헌팅 업무를 하면서 수많은 이력서를 검토해왔습니다. 그 경험을 바탕으로 채용담당자의 눈에 띄는 이력서 작성법을 공유드립니다. 특히 경력직 분들께 도움이 될 것 같아요.",
      likes: 156,
      comments: 43,
      views: 1247,
    },
    {
      id: 5,
      author: "이직고민러",
      time: "3일 전",
      type: "구직자",
      title: "스타트업 vs 대기업, 어디서 커리어를 시작할까?",
      content:
        "신입 개발자로 취업을 앞두고 있는데, 스타트업과 대기업 중 어디서 시작하는 게 좋을지 고민이 많습니다. 각각의 장단점과 실제 경험담을 들어보고 싶어요. 조언 부탁드립니다!",
      likes: 89,
      comments: 67,
      views: 534,
    },
  ];

  return (
    
      <div className="flex w-full justify-center bg-white">
        
          

          {/* 본문 */}
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
                <div key={post.id} className="flex border rounded-lg shadow p-6 bg-white">
                  <Link to={`/${post.id}`} className="w-full flex">
                    <div className="w-[300px] h-[216px] bg-gray-300 rounded-md"></div>
                    <div className="ml-6 flex flex-col justify-between w-full">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{post.author}</p>
                          <p className="text-sm text-gray-500">{post.time}</p>
                        </div>
                        <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                          {post.type}
                        </span>
                      </div>
                      <div className="mt-3">
                        <h3 className="text-xl font-bold">{post.title}</h3>
                        <p className="text-base mt-2 text-gray-700">{post.content}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FaHeart className="text-red-500" />
                          {post.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <FaComment className="text-blue-500" />
                          {post.comments}
                        </div>
                        <div className="flex items-center gap-1">
                          <FaEye className="text-gray-500" />
                          {post.views}
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
