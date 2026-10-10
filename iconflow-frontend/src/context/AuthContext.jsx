import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState(!!localStorage.getItem("token"));

  const saveUser = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const fetchMe = async (overrideToken = token) => {
    if (!overrideToken) {
      setUser(null);
      setAuthLoading(false);
      return null;
    }

    try {
      const res = await fetch(`${API_BASE}/api/users/me`, {
        headers: { Authorization: `Bearer ${overrideToken}` },
      });

      if (!res.ok) throw new Error("Failed to fetch user");

      const data = await res.json();
      saveUser(data);
      return data;
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");
      setToken(null);
      setUser(null);
      return null;
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (payload, userData = null) => {
    let jwt = null;
    let refreshToken = null;
    let nextUser = null;

    if (typeof payload === "string") {
      jwt = payload;
      nextUser = userData;
    } else if (payload && typeof payload === "object") {
      jwt = payload.accessToken || payload.token || null;
      refreshToken = payload.refreshToken || null;
      nextUser = payload.user || null;
    }

    if (!jwt) return null;

    localStorage.setItem("token", jwt);
    setToken(jwt);

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    if (nextUser) {
      saveUser(nextUser);
      setAuthLoading(false);
      return nextUser;
    }

    return await fetchMe(jwt);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setAuthLoading(false);
  };

  useEffect(() => {
    if (token && !user) {
      fetchMe(token);
    } else if (!token) {
      setAuthLoading(false);
    }
  }, [token, user]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        authLoading,
        setUser: saveUser,
        login,
        logout,
        refreshUser: fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);