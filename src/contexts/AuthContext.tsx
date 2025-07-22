import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTokens, clearTokens, isTokenValid, setTokens } from '../lib/auth';
import { getUserFromToken } from '../lib/auth';
import { logout as logoutApi, getUserProfile } from '../lib/authApi';

export interface User {
  userId?: string;
  email: string;
  name?: string;
  nickname?: string;
  memberTypeCode?: string;
  subscriptionLevel?: string;
  remainingPoints?: number;
  role?: string; // "USER" | "ADMIN"
  roleCodeId?: number; // 숫자
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

  // 서버 응답이 snake_case로 올 수도 있으니 camelCase로 맞춰줌
  const normalizeUser = (data: any): User => ({
    ...data,
    roleCodeId: data.roleCodeId ?? data.role_code_id,
    userId: data.userId ?? data.user_id,
    // 필요한 경우 추가 변환
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const tokens = getTokens();
        if (tokens && isTokenValid(tokens.accessToken)) {
          const userData = getUserFromToken(tokens.accessToken);
          if (userData) {
            setUser(normalizeUser(userData));
            try {
              const detailedUser = await getUserProfile();
              setUser(normalizeUser(detailedUser));
            } catch (error) {
              console.error('Failed to get detailed user info:', error);
            }
          } else {
            clearTokens();
          }
        } else {
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
    setUser(normalizeUser(userData));
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
    setUser(normalizeUser(userData));
  };

  const refreshUserInfo = async () => {
    try {
      const tokens = getTokens();
      if (tokens && isTokenValid(tokens.accessToken)) {
        const userData = await getUserProfile();
        setUser(normalizeUser(userData));
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
      setTokens({ accessToken: token });
      const basicUser = getUserFromToken(token);
      if (basicUser) {
        setUser(normalizeUser(basicUser));
      }
      try {
        const detailedUser = await getUserProfile();
        setUser(normalizeUser(detailedUser));
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
    authLogin,
  };

  return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
  );
};
