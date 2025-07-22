import React, { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import SNS_SideBar from "@/components/SNS_SideBar";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

type TabType = "SNS_POST" | "SNS_COMMENT" | "SNS_BOOKMARK";

export default function ActivityHistoryPage() {

  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<TabType>("SNS_POST");
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (isAuthLoading) return;        // ✅ 아직 user 불러오는 중이면 기다리기
    if (!user) {
      navigate("/login");             // ✅ 로그인 안 되어 있으면 로그인 페이지로 이동
      return;
    }
    setLoading(true);
    let fetch;
    if (tab === "SNS_POST") {
      fetch = import("@/lib/api").then(api => api.default.get("/sns/posts/my"));
    } else if (tab === "SNS_COMMENT") {
      fetch = import("@/lib/api").then(api => api.default.get("/sns/comments/my"));
    } else {
      fetch = import("@/lib/api").then(api => api.default.get("/sns/bookmarks"));
    }
    fetch.then(res => setList(res.data)).finally(() => setLoading(false));
  }, [tab, user, isAuthLoading]);


  function formatDate(iso: string) {
    if (!iso) return "-";
    const d = new Date(iso);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  function pad(n: number) { return n < 10 ? "0" + n : n; }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* 상단 타이틀/설명 영역 (SNSFeedHome과 동일) */}
      <div className="w-full py-10 px-4 md:px-0 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-[900px] mx-auto flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">활동 내역</h1>
          <p className="text-base md:text-lg text-gray-500 mt-2 font-medium">내가 작성한 게시글, 댓글, 북마크 내역을 확인할 수 있습니다.</p>
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

            {loading ? (
              <div className="text-center text-gray-400 py-12">로딩중...</div>
            ) : (
              <div className="space-y-6">
                {tab === "SNS_POST" && (
                  <>
                    {list.length === 0 ? (
                      <div className="text-center text-gray-400 py-12">내 게시글 내역이 없습니다.</div>
                    ) : (
                      list.map((item: any) => (
                        <div
                          key={item.snsPostId}
                          className={clsx(
                            "bg-white border border-gray-100 rounded-2xl shadow-md p-6 transition-all duration-300 relative flex flex-col"
                          )}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <span className="font-semibold text-lg">{item.title}</span>
                              <span className="ml-4 text-gray-500 text-sm">{formatDate(item.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-gray-700 text-sm">좋아요 {item.likeCount}</span>
                              <span className="text-gray-700 text-sm">댓글 {item.commentCount}</span>
                            </div>
                          </div>
                          <div className="text-base mt-1 text-gray-700">{item.content}</div>
                        </div>
                      ))
                    )}
                  </>
                )}

                {tab === "SNS_COMMENT" && (
                  <>
                    {list.length === 0 ? (
                      <div className="text-center text-gray-400 py-12">내 댓글 내역이 없습니다.</div>
                    ) : (
                      list.map((item: any) => (
                        <div
                          key={item.commentId}
                          className="bg-white border border-gray-100 rounded-2xl shadow-md p-6 transition-all duration-300 relative flex flex-col"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500 text-sm">{formatDate(item.createdAt)}</span>
                          </div>
                          <div className="text-base mt-1 text-gray-700">{item.content}</div>
                        </div>
                      ))
                    )}
                  </>
                )}

                {tab === "SNS_BOOKMARK" && (  // ✅ [추가] 북마크 탭 렌더링
                  <>
                    {list.length === 0 ? (
                      <div className="text-center text-gray-400 py-12">북마크한 게시글이 없습니다.</div>
                    ) : (
                      list.map((item: any) => (
                        <div
                          key={item.bookmarkId}
                          className="bg-white border border-gray-100 rounded-2xl shadow-md p-6 transition-all duration-300 relative flex flex-col"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <span className="font-semibold text-lg">{item.title}</span>
                              <span className="ml-4 text-gray-500 text-sm">{formatDate(item.bookmarkedAt)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-gray-700 text-sm">작성자 {item.nickname}</span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <a
                              href={`/${item.snsPostId}`}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              게시글로 이동 👉
                            </a>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
