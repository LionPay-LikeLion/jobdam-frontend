import React, { useEffect, useState, useRef } from "react";
import { FaHeart, FaComment, FaBookmark, FaPlus } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import clsx from "clsx";
import {
  fetchSnsPostsFiltered,
  fetchComments,
  searchByKeyword,
  fetchSnsPosts,
  createComment,
  deleteSnsPost
} from "@/lib/snsApi";
import { useAuth } from "@/contexts/AuthContext";

const BADGE_MAP = {
  GENERAL: { label: "구직자", className: "bg-blue-100 text-blue-700 border border-blue-300" },
  HUNTER: { label: "컨설턴트", className: "bg-green-100 text-green-700 border border-green-300" },
  EMPLOYEE: { label: "기업", className: "bg-yellow-100 text-yellow-700 border border-yellow-300" }
};

function formatRelativeTime(dateString: string): string {
  if (!dateString) return "";
  const now = new Date();
  const past = new Date(dateString);
  const diffSec = Math.floor((now.getTime() - past.getTime()) / 1000);
  if (diffSec < 60) return `${diffSec}초 전`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}분 전`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}시간 전`;
  if (diffSec < 86400 * 7) return `${Math.floor(diffSec / 86400)}일 전`;
  return past.toLocaleDateString("ko-KR");
}

export default function SNSFeedHome() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberType, setMemberType] = useState<string>("");
  const [sort, setSort] = useState<string>("latest");
  const [keyword, setKeyword] = useState("");
  const [previewComments, setPreviewComments] = useState<Record<number, any[]>>({});
  const [showMenuId, setShowMenuId] = useState<number | null>(null);
  const [fetching, setFetching] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const commentInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const { user } = useAuth();

  // 점세개 바깥 클릭시 메뉴 닫힘
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".feed-menu-dropdown")) {
        setShowMenuId(null);
      }
    };
    if (showMenuId !== null) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenuId]);

  // 최초/필터/검색시 첫페이지 로딩
  useEffect(() => {
    setLoading(true);
    setOffset(0);
    setHasMore(true);
    fetchSnsPostsFiltered(memberType, sort, 0, 7)
        .then(data => {
          setPosts(data);
          setOffset(7);
        })
        .catch(() => setPosts([]))
        .finally(() => setLoading(false));
  }, [memberType, sort, keyword]);

  // 무한스크롤
  useEffect(() => {
    const onScroll = () => {
      if (fetching || loading || !hasMore) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        setFetching(true);
        fetchSnsPostsFiltered(memberType, sort, offset, 7)
            .then(data => {
              if (!data || data.length === 0) {
                setHasMore(false);
              } else {
                setPosts(prev => [...prev, ...data]);
                setOffset(prev => prev + data.length);
              }
            })
            .finally(() => setFetching(false));
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [fetching, loading, hasMore, offset, memberType, sort]);

  // 댓글 2개만 미리보기 (최신순)
  useEffect(() => {
    if (!posts.length) return;
    setPreviewComments({});
    posts.forEach(post => {
      if (!post.snsPostId) return;
      fetchComments(post.snsPostId)
          .then(comments => {
            const filtered = (comments || [])
                .filter(c => c.boardStatusCode !== "DELETED")
                .slice(0, 2);
            setPreviewComments(prev => ({
              ...prev,
              [post.snsPostId]: filtered
            }));
          });
    });
  }, [posts]);

  const handleCreateComment = async (postId: number) => {
    const val = commentInputRefs.current[postId]?.value ?? "";
    if (!val.trim()) return;
    await createComment(postId, val);
    commentInputRefs.current[postId]!.value = "";
    fetchComments(postId).then(comments => {
      setPreviewComments(prev => ({
        ...prev,
        [postId]: (comments || []).filter(c => c.boardStatusCode !== "DELETED").slice(0, 2)
      }));
    });
  };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm("정말 게시글을 삭제하시겠습니까?")) return;
    await deleteSnsPost(postId);
    setPosts(prev => prev.filter(post => post.snsPostId !== postId));
  };

  const isPremium = (subscriptionLevelCode: string) => subscriptionLevelCode === "PREMIUM";
  const visiblePosts = posts.filter(post => post.boardStatusCode !== "DELETED");

  if (loading) return <div className="text-center py-10 text-lg">로딩중...</div>;

  return (
      <div className="bg-[#f6f6f7] min-h-screen pb-10 w-full flex justify-center">
        <div className="w-full max-w-[540px] mx-auto flex flex-col px-1 sm:px-0">
          {/* 필터 바 */}
          <div className="flex items-center gap-2 mt-8 mb-5 w-full bg-white rounded-2xl shadow border border-[#ececec] px-4 py-3 justify-between">
            <div className="flex gap-2 flex-1">
              <select
                  className="h-10 w-[90px] border border-gray-300 rounded px-3 text-sm bg-white"
                  value={memberType}
                  onChange={e => setMemberType(e.target.value)}
              >
                <option value="">전체</option>
                <option value="GENERAL">구직자</option>
                <option value="HUNTER">컨설턴트</option>
                <option value="EMPLOYEE">기업</option>
              </select>
              <select value={sort} onChange={e => setSort(e.target.value)}
                      className="h-10 w-[90px] border border-gray-300 rounded px-3 text-sm bg-white">
                <option value="latest">최신순</option>
                <option value="likes">인기순</option>
              </select>
              <input
                  type="text"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder="검색"
                  className="border border-gray-300 bg-white px-3 py-2 rounded w-[140px] text-sm"
              />
              {/* 검색 버튼 */}
              <button
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white ml-1"
                  onClick={async () => {
                    if (!keyword.trim()) return;
                    let data: any[] = await searchByKeyword(keyword);
                    setPosts(
                        data.map(post => ({
                          ...post,
                          profileImageUrl: post.profileImageUrl ?? ""
                        }))
                    );
                  }}
                  title="검색"
              >
                <FiSearch className="w-5 h-5" />
              </button>
            </div>
            <button
                onClick={() => window.location.href = '/sns-post-write'}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white"
                title="글 작성"
            >
              <FaPlus />
            </button>
          </div>
          {/* 피드 카드 */}
          <div className="flex flex-col gap-8 w-full">
            {visiblePosts.map(post => {
              const isMine = user?.id === post.userId;
              const isPremiumUser = isPremium(post.subscriptionLevelCode);
              const badgeInfo = BADGE_MAP[post.memberTypeCode] || null;
              return (
                  <div
                      key={post.snsPostId}
                      className={clsx(
                          "w-full rounded-2xl shadow-lg bg-white overflow-hidden flex flex-col relative",
                          isPremiumUser
                              ? "border-2 border-yellow-400"
                              : "border border-[#ececec]",
                          "transition hover:shadow-2xl"
                      )}
                      style={{ minWidth: 0 }}
                  >
                    {/* --- 점세개 메뉴(더보기) --- */}
                    <div className="absolute top-5 right-7 feed-menu-dropdown">
                      <button
                          className="text-gray-400 hover:text-gray-700 text-xl"
                          onClick={e => {
                            e.stopPropagation();
                            setShowMenuId(showMenuId === post.snsPostId ? null : post.snsPostId);
                          }}
                          title="더보기"
                      >
                        <BsThreeDots />
                      </button>
                      {/* 드롭다운 메뉴 */}
                      {showMenuId === post.snsPostId && (
                          <div
                              className="absolute right-0 mt-2 z-40 bg-white border border-gray-200 rounded shadow-lg py-1 min-w-[120px]"
                          >
                            {isMine && (
                                <>
                                  <Link
                                      to={`/sns-posts/${post.snsPostId}/edit`}
                                      className="block px-5 py-2 hover:bg-gray-100 text-sm text-gray-800"
                                      onClick={() => setShowMenuId(null)}
                                  >
                                    수정
                                  </Link>
                                  <button
                                      onClick={() => {
                                        setShowMenuId(null);
                                        handleDeletePost(post.snsPostId);
                                      }}
                                      className="block w-full text-left px-5 py-2 hover:bg-gray-100 text-sm text-red-500"
                                  >
                                    삭제
                                  </button>
                                </>
                            )}
                            {!isMine && (
                                <button
                                    onClick={() => setShowMenuId(null)}
                                    className="block w-full text-left px-5 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                >
                                  신고
                                </button>
                            )}
                          </div>
                      )}
                    </div>
                    {/* 상단 프로필/닉네임/뱃지/프리미엄/시간/왕관 */}
                    <div className="flex items-center px-5 pt-4 pb-2 relative">
                      <div className="relative">
                        {isPremiumUser && (
                            <span className="absolute -top-2 -left-2 z-10 animate-pulse">
                                                <svg width="26" height="26" viewBox="0 0 32 32">
                                                    <g>
                                                        <circle cx="16" cy="16" r="13" fill="gold" opacity="0.28"/>
                                                        <path d="M16 6l3.2 7.2 7.8.8-6 5.2 1.6 7.8L16 21l-6.6 3.9 1.6-7.8-6-5.2 7.8-.8z"
                                                              fill="#ffd700" stroke="#ffea00" strokeWidth="1"/>
                                                    </g>
                                                </svg>
                                            </span>
                        )}
                        {post.profileImageUrl ? (
                            <img
                                src={post.profileImageUrl}
                                alt={post.nickname}
                                className="w-10 h-10 rounded-full object-cover border-2 border-[#ededed] mr-3"
                            />
                        ) : (
                            <span className="w-10 h-10 flex items-center justify-center rounded-full bg-[#e3e3e3] text-xl text-gray-400 mr-3">👤</span>
                        )}
                      </div>
                      <span className="font-semibold text-black text-base mr-2">{post.nickname}</span>
                      {badgeInfo && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ml-1 mr-1 ${badgeInfo.className}`}>
                                            {badgeInfo.label}
                                        </span>
                      )}
                      {isPremiumUser && (
                          <span className="ml-1 text-yellow-500 text-xs font-bold tracking-wider border border-yellow-400 px-1 rounded">PREMIUM</span>
                      )}
                      <span className="ml-auto text-xs text-gray-400">{formatRelativeTime(post.createdAt)}</span>
                    </div>
                    {/* 제목 */}
                    <div className="px-5 pb-1 pt-2">
                      <div className="font-bold text-xl text-black leading-tight mb-1">
                        {post.title}
                      </div>
                    </div>
                    {/* 이미지 */}
                    <Link to={`/${post.snsPostId}`} className="block">
                      <div className="bg-[#eaeaea] w-full h-[410px] flex items-center justify-center">
                        {post.imageUrl && post.imageUrl !== "string" && post.imageUrl !== "" ? (
                            <img src={post.imageUrl} alt="썸네일"
                                 className="object-contain w-full h-full max-h-[410px] bg-white" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 bg-[#f3f3f3]">
                              <span className="text-4xl">📷</span>
                            </div>
                        )}
                      </div>
                    </Link>
                    {/* 좋아요/댓글/북마크 */}
                    <div className="flex items-center px-5 py-2 gap-6">
                      <FaHeart className={clsx(post.liked ? "text-red-500" : "text-gray-400", "w-6 h-6 cursor-pointer")} />
                      <FaComment className="text-blue-500 w-6 h-6" />
                      <FaBookmark className={clsx(post.bookmarked ? "text-yellow-400" : "text-gray-400", "w-6 h-6 ml-auto cursor-pointer")} />
                    </div>
                    {/* 좋아요/댓글수/본문/댓글 */}
                    <div className="px-5 pb-3">
                      <div className="text-gray-700 text-sm font-semibold mb-1">
                        {post.likeCount > 0 && <>{post.likeCount.toLocaleString()}명이 좋아합니다</>}
                      </div>
                      <div className="flex items-center mb-1">
                        <span className="font-semibold text-black">{post.nickname}</span>
                        <span className="ml-2 text-gray-800 line-clamp-2">{post.content}</span>
                      </div>
                      {/* 댓글 2개 미리보기 */}
                      <div className="mt-2">
                        {(previewComments[post.snsPostId] || []).map(comment => (
                            <div key={comment.commentId} className="flex items-center text-gray-600 text-sm mb-1">
                              <span className="font-bold mr-2 text-black">{comment.nickname}</span>
                              <span>{comment.content}</span>
                            </div>
                        ))}
                        {post.commentCount > 2 && (
                            <Link to={`/${post.snsPostId}`} className="text-gray-400 text-xs hover:underline mt-1 block">
                              댓글 {post.commentCount}개 모두 보기
                            </Link>
                        )}
                      </div>
                      {/* --- 댓글 입력 바로 작성 --- */}
                      <form
                          className="flex mt-3 gap-2"
                          onSubmit={e => {
                            e.preventDefault();
                            handleCreateComment(post.snsPostId);
                          }}
                      >
                        <input
                            ref={el => (commentInputRefs.current[post.snsPostId] = el)}
                            type="text"
                            placeholder="댓글 달기..."
                            className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm"
                            maxLength={200}
                        />
                        <button type="submit" className="px-5 rounded bg-gray-800 text-white text-sm font-bold">등록</button>
                      </form>
                    </div>
                  </div>
              );
            })}
            {!loading && !hasMore && (
                <div className="py-7 text-center text-gray-400 text-sm">더 이상 불러올 게시글이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
  );
}
