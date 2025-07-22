import api from "./api";
import { setTokens, getTokens, AuthTokens } from "./auth";
import { User } from "@/contexts/AuthContext";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

// 백엔드가 단순 토큰만 반환하는 경우를 위한 인터페이스
export interface SimpleLoginResponse {
  token: string;
  // 또는
  accessToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
  phone?: string;
  profileImageUrl?: string;
}

export interface RegisterResponse {
  message: string;
}

export interface GoogleLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const googleLogin = async (code: string): Promise<GoogleLoginResponse> => {
  const response = await api.post('/oauth/login', { 
    code,
    providerType: 'GOOGLE',
  });
  return response.data;
};

export const kakaoLogin = async (code: string): Promise<GoogleLoginResponse> => {
  const response = await api.post('/oauth/login', { 
    code,
    providerType: 'KAKAO',
  });
  return response.data;
};


// 로그인 API
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post<any>('/auth/login', credentials);
    console.log('Login response:', response.data); // 디버깅용
    
    let accessToken = '';
    let refreshToken = '';
    let user = null;
    
    // 새로운 백엔드 응답 형식 처리 (LoginResponseDto)
    if (response.data.accessToken && response.data.refreshToken) {
      accessToken = response.data.accessToken;
      refreshToken = response.data.refreshToken;
      user = response.data.user; // 백엔드에서 제공하는 user 정보 사용
    } 
    // 이전 형식 (토큰 문자열만) 호환성을 위한 fallback
    else if (typeof response.data === 'string') {
      accessToken = response.data;
      // JWT에서 사용자 정보 추출 (fallback)
      if (accessToken) {
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          console.log('JWT payload:', payload); // 디버깅용
          
          const emailName = payload.email.split('@')[0];
          const cleanName = emailName.replace(/[0-9]/g, '');
          const displayName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
          
          user = {
            id: payload.sub,
            email: payload.email,
            name: displayName
          };
        } catch (error) {
          console.error('JWT decode error:', error);
        }
      }
    } else if (response.data.accessToken || response.data.token) {
      accessToken = response.data.accessToken || response.data.token;
    }
    
    // 토큰 저장
    setTokens({
      accessToken,
      refreshToken,
    });
    
    return {
      accessToken,
      refreshToken,
      user
    };
  } catch (error) {
    throw error;
  }
};

// 회원가입 API
export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await api.post<RegisterResponse>('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 이메일 중복 확인 (GET 요청, query parameter)
export const checkEmail = async (email: string): Promise<boolean> => {
  try {
    const response = await api.get<boolean>('/auth/check-email', {
      params: { email }
    });
    console.log('Email check response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Email check error:', error);
    throw error;
  }
};

// 닉네임 중복 확인 (GET 요청, query parameter)
export const checkNickname = async (nickname: string): Promise<boolean> => {
  try {
    const response = await api.get<boolean>('/auth/check-id', {
      params: { nickname }
    });
    console.log('Nickname check response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Nickname check error:', error);
    throw error;
  }
};

// 로그아웃 API
export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    // 에러가 발생해도 클라이언트에서는 토큰을 삭제
    console.error('Logout error:', error);
  }
};

// 사용자 프로필 가져오기
export const getUserProfile = async () => {
  try {
    const response = await api.get('/user/profile');
    const data = response.data;
    return {
      ...data,
      id: data.userId   // userId -> id로만 추가 매핑
    };
  } catch (error) {
    throw error;
  }
};

// 토큰 갱신
export const refreshToken = async (): Promise<AuthTokens> => {
  try {
    const currentTokens = getTokens();
    if (!currentTokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/auth/reissue', {
      refreshToken: currentTokens.refreshToken
    });
    
    const newTokens: AuthTokens = {
      accessToken: response.data.accessToken,
      refreshToken: currentTokens.refreshToken // Keep the same refresh token
    };
    
    setTokens(newTokens);
    return newTokens;
  } catch (error) {
    throw error;
  }
}; 

// 회원 탈퇴 API
export const withdrawUser = async (): Promise<void> => {
  try {
    await api.delete('/user/withdraw');
  } catch (error) {
    throw error;
  }
}; 
