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