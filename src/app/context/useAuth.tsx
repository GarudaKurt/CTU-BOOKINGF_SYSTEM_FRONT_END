// src/app/context/useAuth.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { is_authenticated, login, register, logout } from "@/api/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const route = useRouter();

  const get_authenticated = async () => {
    try {
      const success = await is_authenticated();
      setIsAuthenticated(success);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login_user = async (username, password) => {
    const success = await login(username, password);
    if (success) {
      setIsAuthenticated(true);
      console.log("Pass here!!");
      alert("login okay");
      route.push("/dashboard/sidebar");
    } else {
      console.log("Pass heee");
    }
  };

  const create_user = async (username, email, password, cPassword) => {
    if (password === cPassword) {
      try {
        const success = await register(username, email, password);
        if (success) {
          console.log("Success created");
          alert("create okay");
        }
      } catch (error) {
        alert("Error create account");
      }

      console.log("Pass shitt!");
    }
  };

  const signOut = async () => {
    try {
      const success = await logout();
      if (success) {
        setIsAuthenticated(false);
        console.log("Logged out successfully");
        route.push("/");
      } else {
        console.error("Logout API call failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    get_authenticated();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, login_user, create_user, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
