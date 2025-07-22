import React, { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import SNS_SideBar from "@/components/SNS_SideBar";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useAuth } from "@/contexts/AuthContext"; 
import { useNavigate } from "react-router-dom"; 
import api from "@/lib/api"; 
import { FaBookmark } from "react-icons/fa";

type TabType = "SNS_POST" | "SNS_COMMENT" | "SNS_BOOKMARK";

export default function ActivityHistoryPage() {

  const { user, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate();

  const [tab, setTab] = useState<TabType>("SNS_POST");
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnbookmarkModal, setShowUnbookmarkModal] = useState(false);
  const [selectedBookmarkId, setSelectedBookmarkId] = useState<number | null>(null);


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

  const deleteBookmark = async (postId: number) => {
    return api.delete(`/sns/bookmarks`, { params: { postId } });
  };

  return (
      <div className="min-h-screen w-full bg-white">
        <div className="flex w-full">
          <main className="flex-1 flex flex-col items-center px-10 py-12 bg-white">
            <div className="w-full max-w-4xl">
              <h1 className="text-3xl font-bold mb-6 text-black">활동 내역</h1>
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
                              list.map((item: any) => {
                                // 삭제된 게시글 처리
                                if (item.boardStatusCode === "DELETED") {
                                  return (
                                    <div
                                      key={item.snsPostId}
                                      className="border rounded-lg shadow p-6 bg-gray-100 text-gray-400 transition-all duration-300 relative flex flex-col"
                                    >
                                      <div className="w-full text-center py-12 text-lg font-semibold">
                                        삭제된 게시글입니다.
                                      </div>
                                    </div>
                                  );
                                }
                                // 정상 게시글
                                return (
                                  <div
                                    key={item.snsPostId}
                                    className="border rounded-lg shadow p-6 bg-white transition-all duration-300 relative flex flex-col"
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <div>
                                        <span className="font-semibold text-lg">{item.title}</span>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <span className="text-gray-700 text-sm">좋아요 {item.likeCount}</span>
                                        <span className="text-gray-700 text-sm">댓글 {item.commentCount}</span>
                                      </div>
                                    </div>
                                    <div className="text-base mt-1 text-gray-700">{item.content}</div>
                                    {/* 날짜를 오른쪽 아래에 */}
                                    <div className="flex justify-end mt-4">
                                      <span className="text-gray-500 text-sm">{formatDate(item.createdAt)}</span>
                                    </div>
                                  </div>
                                );
                              })
                          )}
                        </>
                    )}

                    {tab === "SNS_COMMENT" && (
                      <>
                        {list.length === 0 ? (
                          <div className="text-center text-gray-400 py-12">내 댓글 내역이 없습니다.</div>
                        ) : (
                          list.map((item: any) => {
                            // 삭제된 댓글 처리
                            if (item.boardStatusCode === "DELETED") {
                              return (
                                <div
                                  key={item.commentId}
                                  className="border rounded-lg shadow px-4 py-2 bg-gray-100 text-gray-400 flex items-center text-base font-semibold"
                                  style={{ minHeight: 0 }}
                                >
                                  <span className="flex-1 text-center">삭제된 댓글입니다.</span>
                                </div>
                              );
                            }
                            // 정상 댓글
                            return (
                              <div
                                key={item.commentId}
                                className="border rounded-lg shadow px-4 py-2 bg-white flex items-center"
                                style={{ minHeight: 0 }}
                              >
                                <span className="flex-1 text-gray-700 truncate">{item.content}</span>
                                <span className="ml-4 text-gray-500 text-sm whitespace-nowrap">{formatDate(item.createdAt)}</span>
                              </div>
                            );
                          })
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
                                <div className="text-gray-500 text-sm mb-1">{item.nickname}</div>
                                {/* content 한두줄 + ...더보기 */}
                                <div className="text-gray-700 text-base truncate">
                                  {item.content?.length > 40
                                    ? (
                                      <>
                                        {item.content.slice(0, 40)}...{" "}
                                        <a
                                          href={`/${item.snsPostId}`}
                                          className="text-blue-500 hover:underline text-xs align-middle"
                                        >
                                          더보기
                                        </a>
                                      </>
                                    )
                                    : item.content
                                  }
                                </div>
                                {/* 게시글로 이동 링크(작게) */}
                                <div className="mt-2">
                                  <a
                                    href={`/${item.snsPostId}`}
                                    className="text-blue-400 hover:underline text-xs"
                                  >
                                    게시글로 이동 →
                                  </a>
                                </div>
                              </div>
                              {/* 북마크 해제 아이콘 */}
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
                          ))
                        )}
                      </>
                    )}
                  </div>
              )}
            </div>
          </main>
        </div>
        {showUnbookmarkModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 min-w-[300px]">
              <p className="mb-6 text-lg text-center">북마크에서 제외하시겠습니까?</p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => setShowUnbookmarkModal(false)}>취소</Button>
                <Button
                  onClick={async () => {
                    await deleteBookmark(selectedBookmarkId!); // postId로 호출
                    setList(list => list.filter(bm => bm.snsPostId !== selectedBookmarkId));
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
