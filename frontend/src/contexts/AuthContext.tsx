import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { API_URL } from "@/utils/api";

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (accessToken: string, user: any) => void;
  logout: () => void;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Vérifie le token au démarrage
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      setAccessToken(token);
      setIsLoggedIn(true);
    }
    
    setIsLoading(false);
  }, []);

  const login = (accessToken: string, user: any) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("name", user.name);
    setAccessToken(accessToken);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Erreur logout:', error);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("name");
    setAccessToken(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}