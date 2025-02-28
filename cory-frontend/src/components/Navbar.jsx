import { Link } from "react-router-dom";
import { Button, Flex, Box } from "@radix-ui/themes";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          CORY
        </Link>

        <Flex className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-500">
            Home
          </Link>
          <Link to="/features" className="text-gray-700 hover:text-blue-500">
            Features
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-500">
            About
          </Link>
        </Flex>

        <Flex className="hidden md:flex space-x-4">
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        </Flex>

        <Box className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </Box>
      </div>

      {menuOpen && (
        <Box className="md:hidden bg-white shadow-md p-4">
          <Flex direction="column" className="space-y-4">
            <Link to="/" className="text-gray-700 hover:text-blue-500" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/features" className="text-gray-700 hover:text-blue-500" onClick={() => setMenuOpen(false)}>
              Features
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-500" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-blue-500" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link to="/signup" className="text-gray-700 hover:text-blue-500" onClick={() => setMenuOpen(false)}>
              Sign Up
            </Link>
          </Flex>
        </Box>
      )}
    </nav>
  );
}
