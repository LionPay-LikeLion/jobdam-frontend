import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8081",
  withCredentials: true, // optional, only if your backend uses cookies/auth
});

export default api;