import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTokens, clearTokens, isTokenValid } from '../lib/auth';
import { logout as logoutApi } from '../lib/authApi';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
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

  // JWT에서 사용자 정보 추출하는 함수
  const getUserFromToken = (token: string): User | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const emailName = payload.email.split('@')[0];
      const cleanName = emailName.replace(/[0-9]/g, ''); // 숫자 제거
      const displayName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      
      return {
        id: payload.sub,
        email: payload.email,
        name: displayName
      };
    } catch (error) {
      console.error('JWT decode error:', error);
      return null;
    }
  };

  // 앱 시작 시 토큰 검증 및 사용자 정보 가져오기
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const tokens = getTokens();
        
        if (tokens && isTokenValid(tokens.accessToken)) {
          // JWT에서 사용자 정보 추출
          const userData = getUserFromToken(tokens.accessToken);
          if (userData) {
            setUser(userData);
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

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 