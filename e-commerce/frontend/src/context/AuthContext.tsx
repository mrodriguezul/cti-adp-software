import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { AuthUser, Client } from "@/types";
import * as authService from "@/services/authService";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Omit<Client, "id"> & { password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Client>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("lpa_auth");
    return stored ? JSON.parse(stored) : null;
  });

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (u) localStorage.setItem("lpa_auth", JSON.stringify(u));
    else localStorage.removeItem("lpa_auth");
  };

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.loginUser(email, password);
    persist(result);
  }, []);

  const register = useCallback(async (data: Omit<Client, "id"> & { password: string }) => {
    await authService.registerUser(data);
  }, []);

  const logout = useCallback(() => persist(null), []);

  const updateProfile = useCallback(
    async (data: Partial<Client>) => {
      if (!user) throw new Error("Not authenticated");
      const updated = await authService.updateProfile(user.client.id, data);
      persist({ ...user, client: updated });
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
