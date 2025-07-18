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