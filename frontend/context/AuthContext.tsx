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
import { Lender } from "../types/lender"; // Import the Lender type

interface AuthContextType {
  token: string | null;
  lender: Lender | null; // Use the Lender type here
  login: (token: string, lender: Lender) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [lender, setLender] = useState<Lender | null>(null); // State for lender details
  const [isLoading, setIsLoading] = useState(true); // Prevents hydration errors
  const router = useRouter();

  useEffect(() => {
    // Retrieve token and lender details from local storage
    const storedToken = localStorage.getItem("token");
    const storedLender = localStorage.getItem("lender");

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedLender) {
      setLender(JSON.parse(storedLender)); // Parse lender JSON
    }

    setIsLoading(false); // Stop loading after checking storage
  }, []);

  const login = (newToken: string, newLender: Lender) => {
    // Save token and lender details to local storage
    localStorage.setItem("token", newToken);
    localStorage.setItem("lender", JSON.stringify(newLender));

    // Update state
    setToken(newToken);
    setLender(newLender);

    // Redirect to dashboard
    router.push("/dashboard");
  };

  const logout = () => {
    // Remove token and lender details from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("lender");

    // Reset state
    setToken(null);
    setLender(null);

    // Redirect to login page
    router.push("/auth");
  };

  if (isLoading) return null; // Avoid rendering mismatched UI

  return (
    <AuthContext.Provider value={{ token, lender, login, logout }}>
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
