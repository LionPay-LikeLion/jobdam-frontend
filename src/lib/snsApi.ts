import api from "./api";

export const fetchSnsPosts = async () => {
  const response = await api.get("/api/sns/posts");
  return response.data;
};

export const fetchMySnsPosts = async () => {
  const response = await api.get("/api/sns/posts/my");
  return response.data;
};

export const createSnsPost = async (data: {
  title: string;
  content: string;
  imageUrl?: string;
  attachmentUrl?: string;
}) => {
  const response = await api.post("/api/sns/posts", data);
  return response.data;
};

export const fetchSnsPostDetail = async (postId: number) => {
  const response = await api.get(`/api/sns/posts/${postId}`);
  return response.data;
};

export const fetchComments = async (snsPostId: number) => {
  const res = await api.get(`/api/sns/comments/${snsPostId}`, { params: { snsPostId } });
  return res.data;
};

export const createComment = async (snsPostId: number, content: string) => {
  const res = await api.post(`/api/sns/comments`, { snsPostId, content });
  return res.data;
};

export const updateComment = async (commentId: number, snsPostId: number, content: string) => {
  const res = await api.put(`/api/sns/comments/${commentId}`, { snsPostId, content });
  return res.data;
};

export const deleteComment = async (commentId: number) => {
  const res = await api.delete(`/api/sns/comments/${commentId}`);
  return res.data;
}; 