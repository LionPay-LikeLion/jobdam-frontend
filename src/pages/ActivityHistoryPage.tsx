import React, { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import SNS_SideBar from "@/components/SNS_SideBar";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { FaBookmark } from "react-icons/fa";

// 타입 선언
type TabType = "SNS_POST" | "SNS_COMMENT" | "SNS_BOOKMARK";
type PostType = {
  snsPostId: number;
  title: string;
  content: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  boardStatusCode: string;
  imageUrl?: string; // 추가
};
type CommentType = {
  commentId: number;
  content: string;
  createdAt: string;
  boardStatusCode: string;
};
type BookmarkType = {
  bookmarkId: number;
  snsPostId: number;
  title: string;
  content: string;
  thumbnailImageUrl: string;
  bookmarkedAt: string;
};

export default function ActivityHistoryPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<TabType>("SNS_POST");
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 북마크 해제 모달 관련 상태
  const [showUnbookmarkModal, setShowUnbookmarkModal] = useState(false);
  const [selectedBookmarkId, setSelectedBookmarkId] = useState<number | null>(null);

  // 날짜 포매터
  function formatDate(iso?: string) {
    if (!iso) return "-";
    const d = new Date(iso);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  function pad(n: number) { return n < 10 ? "0" + n : n; }

  // 북마크 해제 API
  const deleteBookmark = async (postId: number) => {
    return api.delete(`/sns/bookmarks`, { params: { postId } });
  };

  // 탭별 데이터 요청
  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    setLoading(true);
    let fetchPromise;
    if (tab === "SNS_POST") {
      fetchPromise = import("@/lib/api").then(api => api.default.get("/sns/posts/my"));
    } else if (tab === "SNS_COMMENT") {
      fetchPromise = import("@/lib/api").then(api => api.default.get("/sns/comments/my"));
    } else {
      fetchPromise = import("@/lib/api").then(api => api.default.get("/sns/bookmarks"));
    }
    fetchPromise.then(res => {
      // imageUrl이 있는 경우만 매핑
      if (tab === "SNS_POST") {
        setList(res.data.map((item: any) => ({
          ...item,
          imageUrl: item.imageUrl, // 혹시 이름 다르면 맞춰서
        })));
      } else {
        setList(res.data);
      }
    }).finally(() => setLoading(false));
  }, [tab, user, isAuthLoading, navigate]);

  // 탭별 렌더 함수 (컴포넌트 분리)
  function renderPostList(list: PostType[]) {
    if (list.length === 0)
      return <div className="text-center text-gray-400 py-12">내 게시글 내역이 없습니다.</div>;

    return list.map(item =>
      item.boardStatusCode === "DELETED" ? (
        <div
          key={item.snsPostId}
          className="border rounded-lg shadow p-6 bg-gray-100 text-gray-400 flex flex-col"
        >
          <div className="w-full text-center py-12 text-lg font-semibold">
            삭제된 게시글입니다.
          </div>
        </div>
      ) : (
        <div
          key={item.snsPostId}
          className="border rounded-lg shadow p-6 bg-white flex items-center mb-4"
          style={{ minHeight: 120 }}
        >
          {/* 왼쪽: 이미지 (더 작게) */}
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt="게시글 이미지"
              className="w-20 min-w-[80px] max-w-[96px] h-20 object-cover rounded-lg mr-6 flex-shrink-0"
              style={{ background: "#f3f4f6" }}
            />
          ) : (
            <div className="w-20 min-w-[80px] max-w-[96px] h-20 bg-gray-200 rounded-lg mr-6 flex-shrink-0 flex items-center justify-center text-gray-400">
              <span>이미지 없음</span>
            </div>
          )}
          {/* 오른쪽: 본문 */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-lg">{item.title}</span>
              <div className="flex items-center gap-4">
                <span className="text-gray-700 text-sm">좋아요 {item.likeCount}</span>
                <span className="text-gray-700 text-sm">댓글 {item.commentCount}</span>
              </div>
            </div>
            <div className="text-base mt-1 text-gray-700 truncate">{item.content}</div>
            <div className="flex justify-end mt-2 gap-2 items-center">
              {/* 바로가기 버튼 */}
              <Button
                size="sm"
                className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded text-xs"
                onClick={() => window.location.href = `/${item.snsPostId}`}
              >
                게시글 바로가기
              </Button>
            </div>
            <div className="flex justify-end mt-1">
              <span className="text-gray-500 text-sm">{formatDate(item.createdAt)}</span>
            </div>
          </div>
        </div>
      )
    );
  }

  function renderCommentList(list: CommentType[]) {
    if (list.length === 0)
      return <div className="text-center text-gray-400 py-12">내 댓글 내역이 없습니다.</div>;

    return list.map(item =>
      item.boardStatusCode === "DELETED" ? (
        <div
          key={item.commentId}
          className="border rounded-lg shadow px-4 py-2 bg-gray-100 text-gray-400 flex items-center text-base font-semibold"
          style={{ minHeight: 0 }}
        >
          <span className="flex-1 text-center">삭제된 댓글입니다.</span>
        </div>
      ) : (
        <div
          key={item.commentId}
          className="border rounded-lg shadow px-4 py-2 bg-white flex items-center"
          style={{ minHeight: 0 }}
        >
          <span className="flex-1 text-gray-700 truncate">{item.content}</span>
          <span className="ml-4 text-gray-500 text-sm whitespace-nowrap">{formatDate(item.createdAt)}</span>
        </div>
      )
    );
  }

  function renderBookmarkList(list: BookmarkType[]) {
    if (list.length === 0)
      return <div className="text-center text-gray-400 py-12">북마크한 게시글이 없습니다.</div>;

    return list.map(item => (
      <div
        key={item.bookmarkId}
        className="flex items-center border rounded-xl shadow-md p-4 bg-white mb-4"
        style={{ minHeight: 100 }}
      >
        {/* 썸네일 */}
        <img
          src={item.thumbnailImageUrl}
          alt="썸네일"
          className="w-28 h-20 object-cover rounded-lg mr-6 flex-shrink-0"
        />
        {/* 본문 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-lg text-black">{item.title}</span>
            <span className="text-gray-400 text-xs">{formatDate(item.bookmarkedAt)}</span>
          </div>
          {/* content 한두줄 + ...더보기 */}
          <div className="text-gray-700 text-base truncate">
            {item.content?.length > 40 ? (
              <>
                {item.content.slice(0, 40)}...{" "}
                <a
                  href={`/${item.snsPostId}`}
                  className="text-blue-500 hover:underline text-xs align-middle"
                >
                  더보기
                </a>
              </>
            ) : item.content}
          </div>
          <div className="mt-2">
            <a
              href={`/${item.snsPostId}`}
              className="text-blue-400 hover:underline text-xs"
            >
              게시글로 이동 →
            </a>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="text-blue-500 ml-2"
          onClick={() => {
            setSelectedBookmarkId(item.snsPostId);
            setShowUnbookmarkModal(true);
          }}
          title="북마크 해제"
        >
          <FaBookmark />
        </Button>
      </div>
    ));
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="w-full py-10 px-4 md:px-0 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-[900px] mx-auto flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">활동 내역</h1>
          <p className="text-base md:text-lg text-gray-500 mt-2 font-medium">
            내가 작성한 게시글, 댓글, 북마크 내역을 확인할 수 있습니다.
          </p>
        </div>
      </div>
      <div className="flex w-full">
        <main className="flex-1 flex flex-col items-center px-10 py-12 bg-gray-50">
          <div className="w-full max-w-[900px]">
            {/* 탭 버튼 */}
            <div className="flex gap-2 mb-10">
              <Button variant={tab === "SNS_POST" ? "default" : "outline"} onClick={() => setTab("SNS_POST")}>SNS 게시글</Button>
              <Button variant={tab === "SNS_COMMENT" ? "default" : "outline"} onClick={() => setTab("SNS_COMMENT")}>SNS 댓글</Button>
              <Button variant={tab === "SNS_BOOKMARK" ? "default" : "outline"} onClick={() => setTab("SNS_BOOKMARK")}>SNS 북마크</Button>
            </div>
            <div className="space-y-6">
              {loading ? (
                <div className="text-center text-gray-400 py-12">로딩중...</div>
              ) : tab === "SNS_POST" ? (
                renderPostList(list)
              ) : tab === "SNS_COMMENT" ? (
                renderCommentList(list)
              ) : (
                renderBookmarkList(list)
              )}
            </div>
          </div>
        </main>
      </div>
      {/* 북마크 해제 모달 */}
      {showUnbookmarkModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[300px]">
            <p className="mb-6 text-lg text-center">북마크에서 제외하시겠습니까?</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => setShowUnbookmarkModal(false)}>취소</Button>
              <Button
                onClick={async () => {
                  await deleteBookmark(selectedBookmarkId!);
                  setList(list => list.filter((bm: any) => bm.snsPostId !== selectedBookmarkId));
                  setShowUnbookmarkModal(false);
                }}
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
