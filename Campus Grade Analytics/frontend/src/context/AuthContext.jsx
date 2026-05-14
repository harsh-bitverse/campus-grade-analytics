import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("campus-grade-token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem("campus-grade-token");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  async function login(formData) {
    const response = await api.post("/auth/login", formData);
    localStorage.setItem("campus-grade-token", response.data.token);
    setUser(response.data.user);
  }

  async function signup(formData) {
    const response = await api.post("/auth/signup", formData);
    localStorage.setItem("campus-grade-token", response.data.token);
    setUser(response.data.user);
  }

  function logout() {
    localStorage.removeItem("campus-grade-token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAdmin: user?.role === "ADMIN"
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

