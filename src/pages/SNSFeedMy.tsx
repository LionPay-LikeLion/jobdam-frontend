import React, { useState } from "react";
import TopBar from "@/components/TopBar";
import SNS_SideBar from "@/components/SNS_SideBar";
import { FaRegThumbsUp, FaRegCommentDots } from "react-icons/fa";

const SNSFeedMy = () => {
  const [selectedMenu, setSelectedMenu] = useState("내 피드");

  const feedPosts = [
    {
      id: 1,
      date: "2024년 1월 15일",
      visibility: "전체 공개",
      visibilityColor: "#34c759",
      status: "게시됨",
      statusColor: "black",
      title: "마케터 3년차, 이직 타이밍과 포트폴리오 방향에 대한 고민",
      content:
        "B2C D2C 브랜드 마케팅 업무를 3년 넘게 해오고 있는 마케터입니다. 현재는 이직을 고려 중인데, 막상 포트폴리오를 만들려니 막막하네요...",
      likes: 32,
      comments: 17,
      isDeleted: false,
    },
    {
      id: 2,
      date: "2024년 1월 14일",
      visibility: "친구만",
      visibilityColor: "#007aff",
      status: "게시됨",
      statusColor: "black",
      title: "이직 준비 중인데, 포트폴리오 피드백 받을 수 있을까요?",
      content:
        "현재 B2C 브랜드 마케팅 경력 3년차입니다. 지금 준비 중인 이직용 포트폴리오인데, 혹시 지나치게 디테일한지/빠진 부분 있는지 조언 주실 분 계실까요?",
      likes: 25,
      comments: 20,
      isDeleted: false,
    },
    {
      id: 3,
      date: "2024년 1월 13일",
      visibility: "비공개",
      visibilityColor: "#ff9500",
      status: "작성 중",
      statusColor: "#ff9500",
      title: "신입 개발자를 위한 면접 준비 가이드",
      content:
        "백엔드 부트캠프 수료 후 첫 면접을 보고 왔어요. Spring Boot + MySQL 기반 프로젝트 위주로 설명했고, 기술보단 팀워크 경험에 질문이 많더라구요...",
      likes: 0,
      comments: 0,
      isDeleted: false,
    },
    {
      id: 4,
      date: "2024년 1월 10일",
      visibility: "전체 공개",
      visibilityColor: "#34c759",
      status: "삭제됨",
      statusColor: "#ff3b30",
      title: "스타트업 vs 대기업, 어디서 커리어를 시작할까?",
      content:
        "신입 개발자로 취업을 앞두고 있는데, 스타트업과 대기업 중 어디서 시작하는 게 좋을지 고민이 많습니다. 각각의 장단점과 실제 경험담을 들어보고 싶어요...",
      likes: 89,
      comments: 67,
      isDeleted: true,
    },
  ];

  const handleEditPost = (id: number) => {
    console.log("Edit post:", id);
  };

  const handleDeletePost = (id: number) => {
    console.log("Delete post:", id);
  };

  const handleNewPost = () => {
    console.log("새 글 작성");
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
                {feedPosts.map((post) => (
                <div
                    key={post.id}
                    className="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex gap-6"
                >
                    <div className="w-64 h-48 bg-gray-200 rounded-md">
                    {/* 임시 썸네일 */}
                    <img
                        src="https://placehold.co/256x192?text=Thumbnail"
                        alt="썸네일"
                        className="w-full h-full object-cover rounded-md"
                    />
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
                        <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                        <FaRegCommentDots />
                        <span>{post.comments}</span>
                        </div>
                    </div>

                    {!post.isDeleted ? (
                        <div className="absolute top-0 right-0 flex gap-2">
                        <button
                            onClick={() => handleEditPost(post.id)}
                            className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 text-sm"
                        >
                            수정
                        </button>
                        <button
                            onClick={() => handleDeletePost(post.id)}
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
