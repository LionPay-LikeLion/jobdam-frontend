import api from "./api";

export const fetchMessageBoxes = async () => {
  const res = await api.get("/messages/boxes");
  return res.data;
};

export const fetchConversation = async (userId: number) => {
  const res = await api.get("/messages/conversation", { params: { userId } });
  return res.data;
};

export const sendMessage = async (receiverId: number, content: string) => {
  const res = await api.post("/messages", { receiverId, content });
  return res.data;
};
