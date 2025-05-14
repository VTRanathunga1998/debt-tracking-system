// contexts/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Prevents hydration errors
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    }

    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    // Save token and lender details to local storage
    localStorage.setItem("token", newToken);

    // Update state
    setToken(newToken);

    // Redirect to dashboard
    router.push("");
  };

  const logout = () => {
    // Remove token and lender details from local storage
    localStorage.removeItem("token");

    // Reset state
    setToken(null);

    // Redirect to login page
    router.push("/auth");
  };

  if (isLoading) return null; // Avoid rendering mismatched UI

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
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
