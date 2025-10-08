import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (accessToken: string, refreshToken: string, user: any) => void;
  logout: () => void;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Vérifie le token au démarrage
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
    	setAccessToken(accessToken);
		setIsLoggedIn(true);
    }
  }, []);

  const login = (accessToken: string, refreshToken: string, user: any) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("name", user.name);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("name");
	setAccessToken(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, accessToken }}>
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