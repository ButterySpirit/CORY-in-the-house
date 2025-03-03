import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Fix Import
import { Button, Flex, Box } from "@radix-ui/themes";

export default function Navbar() {
  const { user, logout, loading } = useAuth(); // ✅ Include `loading`

  console.log("🔍 Navbar Rendered");
  console.log("📌 User State in Navbar:", user);

  if (loading) {
    return <p>Loading...</p>; // ✅ Prevent flashing between states
  }

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          CORY
        </Link>

        <Flex className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>
          <Link to="/features" className="text-gray-700 hover:text-blue-500">Features</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-500">About</Link>
        </Flex>

        {user ? (
          <>
            <p className="text-green-500">Logged in as: {user.username}</p>
            <Flex className="hidden md:flex space-x-4">
              <Link to="/profile">
                <Button variant="outline">Profile</Button>
              </Link>
              <Button onClick={logout} className="bg-red-500 text-white">
                Logout
              </Button>
            </Flex>
          </>
        ) : (
          <>
            <p className="text-red-500">Not logged in</p>
            <Flex className="hidden md:flex space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </Flex>
          </>
        )}
      </div>
    </nav>
  );
}
