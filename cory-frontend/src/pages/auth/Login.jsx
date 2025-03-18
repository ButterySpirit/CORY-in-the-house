import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/session", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        console.log("🔍 Session Check:", data);

        if (data.user?.role) {
          redirectToDashboard(data.user.role);
        }
      } catch (err) {
        console.error("Session check failed:", err);
      }
    };

    checkSession();
  }, [navigate]);

  // ✅ Function to redirect user based on role
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

  // ✅ Handle Login Submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear errors

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
        redirectToDashboard(data.user.role);
      } else {
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 w-96 shadow-xl bg-white rounded-lg">
        <h2 className="text-center mb-4 font-bold text-gray-900">Login</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
