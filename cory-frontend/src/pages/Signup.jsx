import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("organizer"); // Default role is "organizer"
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        credentials: "include", // ✅ Ensures cookies/sessions work
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });

      const data = await response.json();
      console.log("🔹 Signup Response:", data);

      if (response.ok) {
        console.log("✅ Signup successful:", data);
        navigate("/login"); // ✅ Redirect to login after signup
      } else {
        setError(data.error || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("❌ Server error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 w-96 shadow-xl bg-white rounded-lg">
        <h2 className="text-center mb-4 font-bold text-gray-900">Sign Up</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          {/* Role Selection - Only "organizer" or "staff" */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
          >
            <option value="organizer">Organizer</option>
            <option value="staff">Staff</option>
          </select>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Sign Up
          </button>
        </form>

        {/* Link to Login Page */}
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
