import axios from "axios";
import { getAccessToken, getTokens, setTokens, clearTokens } from "./auth";

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

// 토큰 갱신 중인지 추적하는 플래그
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// 응답 인터셉터 - 자동 토큰 갱신
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 또는 403 에러이고 아직 재시도하지 않은 경우 (JWT 만료/무효)
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      // refresh token 요청은 무한 루프 방지
      if (originalRequest.url?.includes('/auth/reissue')) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // 이미 토큰을 갱신 중인 경우, 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          // 토큰 갱신 완료 후 원래 요청 재시도
          const token = getAccessToken();
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const tokens = getTokens();
        if (!tokens?.refreshToken) {
          throw new Error('No refresh token available');
        }

        console.log('🔄 Attempting to refresh token...');
        
        // 직접 axios로 refresh 요청 (인터셉터 무한루프 방지)
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:8081/api"}/auth/reissue`,
          { refreshToken: tokens.refreshToken }
        );

        const newAccessToken = response.data.accessToken;
        
        // 새 토큰 저장
        setTokens({
          accessToken: newAccessToken,
          refreshToken: tokens.refreshToken
        });

        console.log('✅ Token refreshed successfully');
        
        // 대기 중인 요청들 처리
        processQueue(null, newAccessToken);
        
        // 원래 요청에 새 토큰 적용
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        processQueue(refreshError, null);
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;