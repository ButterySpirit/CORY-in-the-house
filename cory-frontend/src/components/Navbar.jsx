import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Import Auth Context
import { Button, Flex, Box } from "@radix-ui/themes";
import { Plus, List } from "lucide-react"; // ✅ Import Icons for Event Creation & My Events

export default function Navbar() {
  const { user, logout, loading } = useAuth(); // ✅ Include `loading`

  console.log("🔍 Navbar Rendered");
  console.log("📌 User State in Navbar:", user);

  if (loading) {
    return <p className="text-center mt-4 text-gray-500">Loading...</p>; // ✅ Prevents flashing
  }

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* ✅ Brand Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          CORY
        </Link>

        {/* ✅ Main Navigation */}
        <Flex className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>
          <Link to="/features" className="text-gray-700 hover:text-blue-500">Features</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-500">About</Link>
        </Flex>

        {/* ✅ Conditional Rendering Based on Auth State */}
        <Flex className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              {/* ✅ Show "Create Event" button ONLY if user is an organizer */}
              {user.role === "organizer" && (
                <Link to="/create-event" className="relative group">
                  <Plus size={24} className="text-blue-600 hover:text-blue-800 cursor-pointer" />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs rounded px-2 py-1 transition-opacity">
                    Create Event
                  </span>
                </Link>
              )}

              {/* ✅ Show "My Events" button ONLY if user is an organizer */}
              {user.role === "organizer" && (
                <Link to="/my-events" className="relative group">
                  <List size={24} className="text-green-600 hover:text-green-800 cursor-pointer" />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs rounded px-2 py-1 transition-opacity">
                    My Events
                  </span>
                </Link>
              )}

              <p className="text-green-500">Logged in as: {user.username}</p>
              <Link to="/profile">
                <Button variant="outline">Profile</Button>
              </Link>
              <Button onClick={logout} className="bg-red-500 text-white">Logout</Button>
            </>
          ) : (
            <>
              <p className="text-red-500">Not logged in</p>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </Flex>
      </div>
    </nav>
  );
}
