import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/users/logout", {
        method: "POST",
        credentials: "include", // ✅ Ensures session is cleared properly
      });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}
