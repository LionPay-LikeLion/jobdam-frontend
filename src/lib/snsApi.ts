import api from "./api";

export const fetchSnsPosts = async () => {
  const response = await api.get("/sns/posts");
  return response.data;
};

export const fetchMySnsPosts = async () => {
  const response = await api.get("/sns/posts/my");
  return response.data;
};

export const createSnsPost = async (formData: FormData) => {
  const response = await api.post("/sns/posts", formData);
  return response.data;
};

export const fetchSnsPostDetail = async (postId: number) => {
  const response = await api.get(`/sns/posts/${postId}`);
  return response.data;
};

export const fetchFilteredPosts = async (memberType: string, sort: string, userId: number) => {
  const res = await api.get("/sns/posts/filter", { params: { memberType, sort, userId }, });
  return res.data;
};

export const searchByKeyword = async (keyword: string, userId?: number) => {
  const res = await api.get(`/sns/posts/search`, { params: { keyword, ...(userId && { userId }) }, });
  return res.data;
};

export const updateSnsPost = async (postId: number, formData: FormData) => {
  const res = await api.put(`/sns/posts/${postId}`, formData);
  return res.data;
};

export const deleteSnsPost = async (postId: number) => {
  const res = await api.delete(`/sns/posts/${postId}`);
  return res.data;
};

export const likeSnsPost = async (postId: number) => {
  const res = await api.post(`/sns/likes`, null, { params: { postId }});
  return res.data;
};

export const unlikeSnsPost = async (postId: number) => {
  const res = await api.delete(`/sns/likes`, { params: { postId }});
  return res.data;
};

export const addBookmark = async (postId: number) => {
  const res = await api.post("/sns/bookmarks", null, { params: { postId: postId }});
  return res.data;
};

export const removeBookmark = async (postId: number) => {
  const res = await api.delete("/sns/bookmarks", { params: { postId: postId }});
  return res.data;
};

export const fetchComments = async (snsPostId: number) => {
  const res = await api.get(`/sns/comments/${snsPostId}`, { params: { snsPostId } });
  return res.data;
};

export const createComment = async (snsPostId: number, content: string) => {
  const res = await api.post(`/sns/comments`, { snsPostId, content });
  return res.data;
};

export const updateComment = async (commentId: number, snsPostId: number, content: string) => {
  const res = await api.put(`/sns/comments/${commentId}`, { snsPostId, content });
  return res.data;
};

export const deleteComment = async (commentId: number) => {
  const res = await api.delete(`/sns/comments/${commentId}`);
  return res.data;
};

// 유저 검색 함수
export const searchUsers = async (query: string) => {
  const response = await api.get("/user/search", { params: { keyword: query } });
  return response.data;
};

// 필터/정렬된 SNS 게시글 조회
export const fetchSnsPostsFiltered = async (memberType?: string, sort?: string) => {
  const params: any = {};
  if (memberType && memberType !== "전체") params.memberType = memberType;
  if (sort) params.sort = sort;
  const response = await api.get("/sns/posts/filter", { params });
  return response.data;
};

// 키워드로 SNS 게시글 검색
export const searchSnsPosts = async (keyword: string) => {
  const response = await api.get("/sns/posts/search", { params: { keyword } });
  return response.data;
}; 