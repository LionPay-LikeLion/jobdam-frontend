import ReportModal from "@/components/ReportModal";
import React, { useEffect, useState, useRef } from "react";
import { FaHeart, FaComment, FaBookmark, FaPlus, FaCrown, FaClock } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
    fetchSnsPostsFiltered,
    fetchComments,
    searchByKeyword,
    fetchSnsPosts,
    createComment,
    deleteSnsPost,
    likeSnsPost,
    unlikeSnsPost,
    addBookmark,
    removeBookmark,
} from "@/lib/snsApi";
import { useAuth } from "@/contexts/AuthContext";

const BADGE_MAP = {
    GENERAL: { label: "구직자", className: "bg-blue-50 text-blue-600 border border-blue-200" },
    HUNTER: { label: "컨설턴트", className: "bg-green-50 text-green-600 border border-green-200" },
    EMPLOYEE: { label: "기업", className: "bg-yellow-50 text-yellow-700 border border-yellow-200" }
};
const BTN_GRAY = "bg-[#e5e7eb] hover:bg-[#d1d5db] text-gray-800";

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
    const [reportOpen, setReportOpen] = useState(false);
    const [reportTargetId, setReportTargetId] = useState<number | null>(null);
    const commentInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
    const menuButtonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
    const navigate = useNavigate();
    const { user } = useAuth();

    // 1. 상태 추가
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    // 필터/검색/초기 로딩
    useEffect(() => {
      setLoading(true);
      setOffset(0);
      setHasMore(true);
      fetchSnsPostsFiltered(memberType, sort)
          .then(data => {
              setPosts(data);
              setOffset(7);
          })
          .catch(() => setPosts([]))
          .finally(() => setLoading(false));
  }, [memberType, sort]); // <-- keyword 빼기

    // 무한스크롤
    useEffect(() => {
        const onScroll = () => {
            if (fetching || loading || !hasMore) return;
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
                setFetching(true);
                fetchSnsPostsFiltered(memberType, sort)
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

    // 댓글 2개 미리보기
    useEffect(() => {
      if (!posts.length) return;
    
      const fetchAll = async () => {
        // Promise.all로 동시 호출(성능 ↑)
        const entries = await Promise.all(
          posts.map(async (post) => {
            if (!post.snsPostId) return [post.snsPostId, []];
            const comments = await fetchComments(post.snsPostId);
            return [
              post.snsPostId,
              (comments || []).filter(c => c.boardStatusCode !== "DELETED").slice(0, 2)
            ];
          })
        );
        setPreviewComments(Object.fromEntries(entries));
      };
      fetchAll();
    }, [posts]);
    // 바깥 클릭시 더보기 메뉴 닫기
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

    const handleSearch = async (searchKeyword: string) => {
      if (!searchKeyword.trim()) return; // 한 글자도 없으면 실행X
      setLoading(true);
      try {
          let data = await searchByKeyword(searchKeyword.trim());
          setPosts(data);
          setOffset(data.length);
          setHasMore(true);
      } catch (e) {
          setPosts([]);
      } finally {
          setLoading(false);
      }
  };

    const handleDeletePost = async (postId: number) => {
        if (!window.confirm("정말 게시글을 삭제하시겠습니까?")) return;
        await deleteSnsPost(postId);
        setPosts(prev => prev.filter(post => post.snsPostId !== postId));
    };

    const isPremium = (subscriptionLevelCode: string) => subscriptionLevelCode === "PREMIUM";
    const visiblePosts = posts.filter(post => post.boardStatusCode !== "DELETED");

    // 좋아요 토글
    const handleToggleLike = async (post: any) => {
      if (!user) {
          window.location.href = "/login";
          return;
      }
      let updated;
      if (post.liked) {
          await unlikeSnsPost(post.snsPostId);
          updated = { ...post, liked: false};
      } else {
          await likeSnsPost(post.snsPostId);
          updated = { ...post, liked: true};
      }
      setPosts(prev => prev.map(p => p.snsPostId === post.snsPostId ? updated : p));
      // 여기서만 fetchComments(post.snsPostId) 호출
      const comments = await fetchComments(post.snsPostId);
      setPreviewComments(prev => ({
          ...prev,
          [post.snsPostId]: (comments || []).filter(c => c.boardStatusCode !== "DELETED").slice(0, 2)
      }));
  };

    // 북마크 토글
    const handleToggleBookmark = async (post: any) => {
      if (!user) {
          window.location.href = "/login";
          return;
      }
      let updated;
      if (post.bookmarked) {
          await removeBookmark(post.snsPostId);
          updated = { ...post, bookmarked: false };
      } else {
          await addBookmark(post.snsPostId);
          updated = { ...post, bookmarked: true };
      }
      setPosts(prev => prev.map(p => p.snsPostId === post.snsPostId ? updated : p));
      // 북마크는 댓글 미리보기가 필요 없으면 아래 라인은 생략
      // 필요하다면 똑같이 fetchComments 호출
  };

    return (
        <div className="bg-[#f6f6f7] min-h-screen pb-10 w-full flex justify-center">
            <div className="w-full max-w-[540px] mx-auto flex flex-col px-1 sm:px-0">
                {/* 필터 바 */}
                <div className="flex items-center gap-2 mt-8 mb-5 w-full bg-white rounded-2xl shadow border border-[#ececec] px-4 py-3 justify-between">
                    {/* 필터 버튼 그룹 */}
                    <div className="flex gap-2 items-center flex-nowrap">
                        <button
                            className={`h-10 min-w-[60px] px-3 rounded border text-sm font-bold flex items-center justify-center transition ${memberType === "" ? "bg-gray-700 text-white border-gray-800" : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"}`}
                            onClick={() => setMemberType("")}
                        >전체</button>
                        <button
                            className={`h-10 min-w-[60px] px-3 rounded border text-sm font-bold flex items-center justify-center transition ${memberType === "GENERAL" ? "bg-blue-600 text-white border-blue-700" : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"}`}
                            onClick={() => setMemberType("GENERAL")}
                        >구직자</button>
                        <button
                            className={`h-10 min-w-[60px] px-3 rounded border text-sm font-bold flex items-center justify-center transition ${memberType === "HUNTER" ? "bg-green-600 text-white border-green-700" : "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"}`}
                            onClick={() => setMemberType("HUNTER")}
                        >컨설턴트</button>
                        <button
                            className={`h-10 min-w-[60px] px-3 rounded border text-sm font-bold flex items-center justify-center transition ${memberType === "EMPLOYEE" ? "bg-yellow-400 text-white border-yellow-500" : "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"}`}
                            onClick={() => setMemberType("EMPLOYEE")}
                        >기업</button>
                        {/* 최신순/인기순 토글 버튼 */}
                        <button
                            onClick={() => setSort(sort === "latest" ? "likes" : "latest")}
                            className={`h-12 w-12 flex items-center justify-center rounded-full border text-2xl font-bold transition ml-2 ${sort === "latest" ? "bg-blue-500 text-white border-blue-500" : "bg-red-500 text-white border-red-500"}`}
                            title={sort === "latest" ? "최신순" : "인기순"}
                        >
                            {sort === "latest" ? <FaClock /> : <FaHeart />}
                        </button>
                        {/* 글작성 버튼 */}
                        <button
                            onClick={() => window.location.href = '/sns-post-write'}
                            className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 border border-gray-300 text-2xl ml-2"
                            title="글 작성"
                        >
                            <FaPlus />
                        </button>
                    </div>
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
                                {/* 점세개/시간 */}
                                <div className="absolute top-5 right-7 flex items-center gap-2 z-20">
                                    <span className="text-xs text-gray-400 mr-1">{formatRelativeTime(post.createdAt)}</span>
                                    <button
                                        ref={el => (menuButtonRefs.current[post.snsPostId] = el)}
                                        onClick={e => {
                                            e.stopPropagation();
                                            setShowMenuId(showMenuId === post.snsPostId ? null : post.snsPostId);
                                        }}
                                        className="text-gray-400 hover:text-gray-700 text-base px-1"
                                    >⋯</button>
                                        {showMenuId === post.snsPostId && (
                                          <>
                                            {/* 밖 클릭용 오버레이 */}
                                            <div
                                              className="fixed inset-0 z-[999] bg-transparent" // or pointer-events-auto(default)
                                              onClick={() => setShowMenuId(null)}
                                            />

                                            {/* 실제 메뉴 */}
                                            <div
                                              className="absolute right-0 top-8 z-[1000] bg-white border border-gray-200 rounded shadow-lg py-1 min-w-[120px]"
                                              onClick={(e) => e.stopPropagation()}  // ★ 중요
                                            >
                                              {isMine ? (
                                                <>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      setShowMenuId(null);
                                                      navigate(`/sns/posts/${post.snsPostId}/edit`);
                                                    }}
                                                    className="block w-full text-left px-5 py-2 hover:bg-gray-100 text-sm text-gray-800"
                                                  >
                                                    수정
                                                  </button>

                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      setShowMenuId(null);
                                                      handleDeletePost(post.snsPostId);
                                                    }}
                                                    className="block w-full text-left px-5 py-2 hover:bg-gray-100 text-sm text-red-500"
                                                  >
                                                    삭제
                                                  </button>
                                                </>
                                              ) : (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setShowMenuId(null);
                                                    setReportTargetId(post.userId); // ← 작성자 id
                                                    setReportOpen(true);            // ← 모달 열기
                                                  }}
                                                  className="block w-full text-left px-5 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                                >
                                                  신고
                                                </button>
                                              )}
                                            </div>
                                          </>
                                        )}

                                </div>
                                {/* 프로필/뱃지/프리미엄/왕관 */}
                                <div className="flex items-center px-5 pt-4 pb-2 relative" style={{ minHeight: 50 }}>
                                    <div className="relative mr-3" style={{ width: 40, height: 40 }}>
                                        {isPremiumUser && (
                                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 animate-pulse"
                                                  style={{
                                                      pointerEvents: "none",
                                                      filter: "drop-shadow(0 0 6px gold)"
                                                  }}>
                        <FaCrown className="text-yellow-300" style={{ fontSize: 23 }} />
                      </span>
                                        )}
                                        {post.profileImageUrl ? (
                                            <img
                                                src={post.profileImageUrl}
                                                alt={post.nickname}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-[#ededed]"
                                            />
                                        ) : (
                                            <span className="w-10 h-10 flex items-center justify-center rounded-full bg-[#e3e3e3] text-xl text-gray-400">👤</span>
                                        )}
                                    </div>
                                    <span className="font-semibold text-black text-base">{post.nickname}</span>
                                    {badgeInfo && (
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ml-2 mr-1 ${badgeInfo.className}`}>
                      {badgeInfo.label}
                    </span>
                                    )}
                                    {isPremiumUser && (
                                        <span className="ml-1 text-yellow-600 text-xs font-bold border border-yellow-400 px-1 rounded">
                      PREMIUM
                    </span>
                                    )}
                                </div>
                                {/* 제목 */}
                                <div className="px-5 pb-1 pt-2">
                                    <div className="font-bold text-xl text-black leading-tight mb-1">{post.title}</div>
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
                                    <FaHeart
                                        className={clsx(post.liked ? "text-red-500" : "text-gray-400", "w-6 h-6 cursor-pointer")}
                                        onClick={() => handleToggleLike(post)}
                                        title={post.liked ? "좋아요 취소" : "좋아요"}
                                    />
                                    <FaComment className="text-[#727cf5] w-6 h-6" />
                                    <FaBookmark
                                        className={clsx(post.bookmarked ? "text-yellow-400" : "text-gray-400", "w-6 h-6 ml-auto cursor-pointer")}
                                        onClick={() => handleToggleBookmark(post)}
                                        title={post.bookmarked ? "북마크 취소" : "북마크"}
                                    />
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
                                        <button type="submit" className={`px-5 rounded ${BTN_GRAY} text-sm font-bold`}>등록</button>
                                    </form>
                                </div>
                            </div>
                        );
                    })}
                    {!loading && !hasMore && (
                        <div className="py-7 text-center text-gray-400 text-sm">더 이상 불러올 게시글이 없습니다.</div>
                    )}
                </div>
                <ReportModal
                      open={reportOpen}
                      onClose={() => setReportOpen(false)}
                      targetId={reportTargetId ?? 0}
                      reportTypeCodeId={1}
                    />
            </div>
        </div>
    );
}
