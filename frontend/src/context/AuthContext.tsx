"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, setAuthToken, clearAuth, getAuthToken } from "@/lib/api";

interface User {
  id: number;
  email: string;
  full_name: string;
  role: "PROCUREMENT_OFFICER" | "BIDDER" | "ADMIN";
  organization?: string;
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = getAuthToken();
    const savedRole = localStorage.getItem("bts_role");
    const savedUserStr = localStorage.getItem("bts_user");

    if (savedToken && savedUserStr) {
      try {
        const parsedUser = JSON.parse(savedUserStr);
        setToken(savedToken);
        setRole(savedRole);
        setUser(parsedUser);
      } catch {
        clearAuth();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const data = await api.login(email, pass);
      const userObj: User = {
        id: data.user_id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        organization: data.organization,
      };
      setToken(data.access_token);
      setRole(data.role);
      setUser(userObj);
      setAuthToken(data.access_token, data.role, userObj);

      if (data.role === "ADMIN") {
        router.push("/admin");
      } else if (data.role === "BIDDER") {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    setRole(null);
    setToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, role, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
