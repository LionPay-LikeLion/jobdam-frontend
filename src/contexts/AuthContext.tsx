import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTokens, clearTokens, isTokenValid, setTokens } from '../lib/auth';
import { getUserFromToken } from '../lib/auth';
import { logout as logoutApi, getUserProfile } from '../lib/authApi';


interface User {
  id?: string;
  email: string;
  name?: string;
  nickname?: string;
  memberTypeCode?: string;  // memberType -> memberTypeCode로 변경
  subscriptionLevel?: string;
  remainingPoints?: number;
  role?: string;
  phone?: string;
  profileImageUrl?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  refreshUserInfo: () => Promise<void>;
  authLogin: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // 앱 시작 시 토큰 검증 및 사용자 정보 가져오기
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const tokens = getTokens();
        
        if (tokens && isTokenValid(tokens.accessToken)) {
          // JWT에서 기본 사용자 정보 추출
          const userData = getUserFromToken(tokens.accessToken);
          if (userData) {
            // 기본 정보로 먼저 설정
            setUser(userData);
            
            // 상세 정보를 API로 가져오기
            try {
              const detailedUser = await getUserProfile();
              console.log('API user profile:', detailedUser); // 디버깅용
              setUser(detailedUser);
            } catch (error) {
              console.error('Failed to get detailed user info:', error);
              // 상세 정보 가져오기 실패해도 기본 정보는 유지
            }
          } else {
            clearTokens();
          }
        } else {
          // 토큰이 없거나 만료된 경우
          clearTokens();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      setUser(null);
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  const refreshUserInfo = async () => {
    try {
      const tokens = getTokens();
      if (tokens && isTokenValid(tokens.accessToken)) {
        const userData = await getUserProfile();
        if (userData) {
          setUser(userData);
        } else {
          clearTokens();
        }
      } else {
        clearTokens();
      }
    } catch (error) {
      console.error('Error refreshing user info:', error);
      clearTokens();
    }
  };

  const authLogin = async (token: string) => {
  try {
    // Store tokens in localStorage or your method
    setTokens({ accessToken: token }); // replaces localStorage.setItem()

    // Decode user info from token
    const basicUser = getUserFromToken(token);
    if (basicUser) {
      setUser(basicUser);
    }

    // Fetch detailed profile
    try {
      const detailedUser = await getUserProfile();
      setUser(detailedUser);
    } catch (error) {
      console.error("Failed to fetch user profile after login", error);
    }
    } catch (error) {
      console.error("authLogin error", error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    refreshUserInfo,
    authLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 