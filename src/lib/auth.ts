// 토큰 관리 유틸리티
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

// 토큰 저장
export const setTokens = (tokens: AuthTokens) => {
  localStorage.setItem('accessToken', tokens.accessToken);
  if (tokens.refreshToken) {
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }
};

// 토큰 가져오기
export const getTokens = (): AuthTokens | null => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!accessToken) return null;
  
  return {
    accessToken,
    refreshToken: refreshToken || undefined,
  };
};

// 액세스 토큰만 가져오기
export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// 토큰 삭제 (로그아웃)
export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// 토큰 유효성 검사 (간단한 JWT 디코딩)
export const isTokenValid = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch {
    return false;
  }
};

// 사용자 정보 가져오기 (토큰에서)
export const getUserFromToken = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
}; 