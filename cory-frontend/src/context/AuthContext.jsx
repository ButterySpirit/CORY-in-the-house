import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch session from backend
  async function fetchSession() {
    setLoading(true);
    console.log("🔍 [AuthContext] Fetching session...");

    try {
      const res = await fetch("http://localhost:3000/users/session", {
        credentials: "include",
      });
      const data = await res.json();
      console.log("✅ [AuthContext] Session Fetch Response:", data);

      if (data?.user) {
        console.log("🎯 [AuthContext] User data received:", data.user);
        setUser(data.user); // ✅ Set user state
      } else {
        console.warn("⚠️ [AuthContext] No user found in session.");
        setUser(null);
      }
    } catch (error) {
      console.error("❌ [AuthContext] Failed to fetch session", error);
      setUser(null);
    }
    setLoading(false);
  }

  // ✅ Fetch session on mount
  useEffect(() => {
    console.log("🔄 [AuthContext] useEffect running...");
    fetchSession();
  }, []);

  // ✅ Login function (forces re-fetch after login)
  const login = async (email, password) => {
    console.log("🚀 [AuthContext] Attempting login...");
    
    const response = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("✅ [AuthContext] Login Response:", data);

    if (response.ok && data.user) {
      console.log("🎯 [AuthContext] Login successful, updating user state...");
      setUser(data.user);
      await fetchSession(); // ✅ Forces re-fetch after login
    } else {
      console.error("❌ [AuthContext] Login failed", data);
    }
    return data;
  };

  // ✅ Logout function (clears user state)
  const logout = async () => {
    console.log("🚪 [AuthContext] Logging out...");

    await fetch("http://localhost:3000/users/logout", {
      method: "POST",
      credentials: "include",
    });

    console.log("✅ [AuthContext] Logout successful, clearing user state.");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser,login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
