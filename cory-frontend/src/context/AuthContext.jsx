import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ✅ Fetch session when app loads
  useEffect(() => {
    fetch("http://localhost:3000/users/session", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => setUser(null));
  }, []);

  // ✅ Login function
  const login = async (email, password) => {
    const response = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      setUser(data.user);
    } else {
      throw new Error(data.error || "Login failed");
    }
  };

  // ✅ Logout function
  const logout = async () => {
    await fetch("http://localhost:3000/users/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Custom Hook for accessing auth state
export function useAuth() {
  return useContext(AuthContext);
}
