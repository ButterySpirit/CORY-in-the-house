import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/global.css"; // ✅ Ensure global styles are applied

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  // ✅ Redirect logged-in users to their respective dashboard
  useEffect(() => {
    if (user?.role) {
      redirectToDashboard(user.role);
    }
  }, [user]);

  const redirectToDashboard = (role) => {
    console.log("🔍 Redirecting User with Role:", role);
    if (role === "organizer") {
      navigate("/organizer-dashboard", { replace: true });
    } else if (role === "staff") {
      navigate("/staff-dashboard", { replace: true });
    } else {
      navigate("/volunteer-dashboard", { replace: true });
    }
  };

  // ✅ Check if user session exists (auto-login)
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/users/session", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        console.log("🔍 Session Check:", data);

        if (data.user) {
          setUser(data.user);
          redirectToDashboard(data.user.role);
        }
      } catch (err) {
        console.error("❌ Session check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate, setUser]);

  // ✅ Handle Login Submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("✅ Login API Response:", data);

      if (response.ok && data.user?.role) {
        console.log("✅ Successfully Logged In. Redirecting...");
        setUser(data.user);
        redirectToDashboard(data.user.role);
      } else {
        console.error("❌ Backend returned an error:", data);
        setError(data.error || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("❌ Network or Server Error:", err);
      setError("Failed to connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container flex items-center justify-center h-screen bg-gray-100">
      <div className="login-box p-6 w-96 shadow-xl bg-white rounded-lg">
        <h2 className="text-center mb-4 font-bold text-gray-900">Login</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-black font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
