import React, { useEffect, useState } from "react";
import { FaHeart, FaComment, FaBookmark, FaPlus } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { fetchSnsPostsFiltered, fetchComments, searchByKeyword, fetchSnsPosts } from "@/lib/snsApi";
import { useAuth } from "@/contexts/AuthContext";

const SNSFeedHome = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { isLoading } = useAuth();
    const [memberType, setMemberType] = useState<string>("");
    const [sort, setSort] = useState<string>("latest");
    const [keyword, setKeyword] = useState("");
    const [previewComments, setPreviewComments] = useState<Record<number, any[]>>({});

    useEffect(() => {
        setLoading(true);
        fetchSnsPostsFiltered(memberType, sort)
            .then(data => setPosts(data))
            .catch(() => setPosts([]))
            .finally(() => setLoading(false));
    }, [memberType, sort]);

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

    const isPremium = (subscriptionLevelCode: string) => subscriptionLevelCode === "PREMIUM";
    const visiblePosts = posts.filter(post => post.boardStatusCode !== "DELETED");

    if (loading) return <div className="text-center py-10 text-lg">로딩중...</div>;

    return (
        <div className="bg-[#f6f6f7] min-h-screen pb-10 w-full flex justify-center">
            <div className="w-full max-w-[540px] mx-auto flex flex-col px-1 sm:px-0">
                {/* 중앙 정렬 & 카드 너비랑 통일 */}
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
                        <button
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1e88e5] text-white ml-1"
                            onClick={async () => {
                                let data: any[] = [];
                                if (keyword.trim() !== "") {
                                    data = await searchByKeyword(keyword);
                                } else {
                                    data = await fetchSnsPosts();
                                }
                                setPosts(data);
                            }}
                            title="검색"
                        >
                            <FiSearch className="w-5 h-5" />
                        </button>
                    </div>
                    <button
                        onClick={() => window.location.href = '/sns-post-write'}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1e88e5] text-white"
                        title="글 작성"
                    >
                        <FaPlus />
                    </button>
                </div>
                {/* ===== 인스타 느낌 밝은 카드 ===== */}
                <div className="flex flex-col gap-8 w-full">
                    {visiblePosts.map(post => {
                        const isPremiumUser = isPremium(post.subscriptionLevelCode);
                        return (
                            <div
                                key={post.snsPostId}
                                className={clsx(
                                    "w-full rounded-2xl shadow-lg bg-white border border-[#ececec] overflow-hidden flex flex-col",
                                    "transition hover:shadow-2xl"
                                )}
                                style={{ minWidth: 0 }}
                            >
                                {/* 상단 프로필/닉네임/시간/더보기 */}
                                <div className="flex items-center px-5 pt-4 pb-2">
                                    {post.profileImageUrl ? (
                                        <img
                                            src={post.profileImageUrl}
                                            alt={post.nickname}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-[#ededed] mr-3"
                                        />
                                    ) : (
                                        <span className="w-10 h-10 flex items-center justify-center rounded-full bg-[#e3e3e3] text-xl text-gray-400 mr-3">👤</span>
                                    )}
                                    <span className="font-semibold text-black text-base mr-1">{post.nickname}</span>
                                    {isPremiumUser && (
                                        <span className="ml-2 text-yellow-500 text-lg font-extrabold">PREMIUM</span>
                                    )}
                                    <span className="ml-auto text-xs text-gray-400">{formatRelativeTime(post.createdAt)}</span>
                                    <button
                                        className="ml-2 text-gray-400 hover:text-gray-600"
                                        title="더보기"
                                    >•••</button>
                                </div>
                                {/* ===== 제목! (닉네임 아래, 진하게 한 줄) ===== */}
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
                                {/* 좋아요/북마크/댓글/메뉴 등 */}
                                <div className="flex items-center px-5 py-2 gap-6">
                                    <FaHeart className={clsx(post.liked ? "text-red-500" : "text-gray-400", "w-6 h-6 cursor-pointer")} />
                                    <FaComment className="text-blue-500 w-6 h-6" />
                                    <FaBookmark className={clsx(post.bookmarked ? "text-yellow-400" : "text-gray-400", "w-6 h-6 ml-auto cursor-pointer")} />
                                </div>
                                {/* 좋아요/댓글수/본문 */}
                                <div className="px-5 pb-3">
                                    <div className="text-gray-700 text-sm font-semibold mb-1">
                                        {post.likeCount > 0 && <>{post.likeCount.toLocaleString()}명이 좋아합니다</>}
                                    </div>
                                    <div className="flex items-center mb-1">
                                        <span className="font-semibold text-black">{post.nickname}</span>
                                        <span className="ml-2 text-gray-800 line-clamp-2">{post.content}</span>
                                    </div>
                                    {/* ===== 댓글 2개 미리보기 ===== */}
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
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
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

export default SNSFeedHome;
