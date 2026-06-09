import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService, type User } from "@/lib/api/services/auth.service";
import { getAuthToken, setAuthToken } from "@/lib/api/client";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const USER_KEY = "ai_studio_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    const cached = typeof window !== "undefined" ? localStorage.getItem(USER_KEY) : null;
    if (token && cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {
        setAuthToken(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { user } = await authService.login({ email, password });
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
