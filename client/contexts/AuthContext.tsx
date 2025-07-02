import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  getUserFromStorage, 
  clearUserFromStorage, 
  saveUserToStorage,
  isSessionValid,
  type StoredUser 
} from "@/utils/auth";

export interface User {
  email: string;
  name: string;
  phone: string;
  role: string;
  loginTime: string;
  sessionId: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User, remember?: boolean) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const checkSession = () => {
      try {
        const savedUser = getUserFromStorage();

        if (savedUser) {
          // Validate session
          if (isSessionValid(savedUser)) {
            setUser(savedUser);
          } else {
            // Session expired, clear storage
            clearUserFromStorage();
          }
        }
      } catch (error) {
        console.error('Error loading saved session:', error);
        clearUserFromStorage();
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = (userData: User, remember: boolean = false) => {
    setUser(userData);
    saveUserToStorage(userData, remember);
  };

  const logout = () => {
    setUser(null);
    clearUserFromStorage();
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
