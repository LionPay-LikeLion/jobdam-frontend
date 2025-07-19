import api from "./api";

// ===== Community Controller =====

// 커뮤니티 목록 조회
export const fetchCommunities = async () => {
  const response = await api.get("/communities");
  return response.data;
};

// 커뮤니티 생성
export const createCommunity = async (data: any) => {
  const response = await api.post("/communities", data);
  return response.data;
};

// 내 커뮤니티 조회
export const fetchMyCommunities = async () => {
  const response = await api.get("/communities/my");
  return response.data;
};

// 커뮤니티 가입
export const joinCommunity = async (communityId: number) => {
  const response = await api.post(`/communities/${communityId}/join`);
  return response.data;
};

// 커뮤니티 프리미엄 업그레이드
export const upgradeCommunity = async (data: any) => {
  const response = await api.post("/communities/upgrade", data);
  return response.data;
};

// 커뮤니티 통계 조회
export const fetchCommunityStats = async () => {
  const response = await api.get("/communities/stats");
  return response.data;
};

// ===== Community Member Controller =====

// 커뮤니티 멤버 목록 조회
export const fetchCommunityMembers = async (communityId: number) => {
  const response = await api.get(`/communities/${communityId}/members`);
  return response.data;
};

// 커뮤니티 멤버 추가
export const addCommunityMember = async (communityId: number, data: any) => {
  const response = await api.post(`/communities/${communityId}/members`, data);
  return response.data;
};

// 커뮤니티 멤버 존재 여부 확인
export const checkCommunityMemberExist = async (communityId: number, userId: number) => {
  const response = await api.get(`/communities/${communityId}/members/${userId}/exist`);
  return response.data;
};

// ===== Community Board Controller =====

// 커뮤니티 게시판 목록 조회
export const fetchCommunityBoards = async (communityId: number) => {
  const response = await api.get(`/communities/${communityId}/boards`);
  return response.data;
};

// 커뮤니티 게시판 생성
export const createCommunityBoard = async (communityId: number, data: any) => {
  const response = await api.post(`/communities/${communityId}/boards`, data);
  return response.data;
};

// ===== Community Post Controller =====

// 커뮤니티 게시글 목록 조회
export const fetchCommunityPosts = async (communityId: number, boardId: number) => {
  const response = await api.get(`/communities/${communityId}/boards/${boardId}/posts`);
  return response.data;
};

// 커뮤니티 게시글 생성
export const createCommunityPost = async (communityId: number, boardId: number, data: any) => {
  const response = await api.post(`/communities/${communityId}/boards/${boardId}/posts`, data);
  return response.data;
};

// 커뮤니티 게시글 수정
export const updateCommunityPost = async (communityId: number, boardId: number, postId: number, data: any) => {
  const response = await api.put(`/communities/${communityId}/boards/${boardId}/posts/${postId}`, data);
  return response.data;
};

// 커뮤니티 게시글 삭제
export const deleteCommunityPost = async (communityId: number, boardId: number, postId: number) => {
  const response = await api.delete(`/communities/${communityId}/boards/${boardId}/posts/${postId}`);
  return response.data;
};

// ===== Community Comment Controller =====

// 커뮤니티 댓글 목록 조회
export const fetchCommunityComments = async (communityId: number, boardId: number, postId: number) => {
  const response = await api.get(`/communities/${communityId}/boards/${boardId}/posts/${postId}/comments`);
  return response.data;
};

// 커뮤니티 댓글 생성
export const createCommunityComment = async (communityId: number, boardId: number, postId: number, data: any) => {
  const response = await api.post(`/communities/${communityId}/boards/${boardId}/posts/${postId}/comments`, data);
  return response.data;
};

// 커뮤니티 댓글 수정
export const updateCommunityComment = async (communityId: number, boardId: number, postId: number, commentId: number, data: any) => {
  const response = await api.put(`/communities/${communityId}/boards/${boardId}/posts/${postId}/comments/${commentId}`, data);
  return response.data;
};

// 커뮤니티 댓글 삭제
export const deleteCommunityComment = async (communityId: number, boardId: number, postId: number, commentId: number) => {
  const response = await api.delete(`/communities/${communityId}/boards/${boardId}/posts/${postId}/comments/${commentId}`);
  return response.data;
};

// 내 커뮤니티 댓글 조회
export const fetchMyCommunityComments = async (communityId: number, boardId: number, postId: number) => {
  const response = await api.get(`/communities/${communityId}/boards/${boardId}/posts/${postId}/comments/my`);
  return response.data;
}; 