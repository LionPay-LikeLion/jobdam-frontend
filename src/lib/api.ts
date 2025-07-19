import axios from "axios";
import { getAccessToken, clearTokens } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8081/api",
  withCredentials: true, // optional, only if your backend uses cookies/auth
});

// 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 디버깅 로그 추가
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      hasToken: !!token
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 토큰 만료 처리
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 아직 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 여기서 refresh token을 사용해서 새로운 access token을 요청할 수 있습니다
      // 현재는 간단히 로그아웃 처리
      clearTokens();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;