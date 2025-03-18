import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Flex, DropdownMenu } from "@radix-ui/themes"; // ✅ Import DropdownMenu
import { Plus, List, Calendar, UserCircle } from "lucide-react"; // ✅ Import User Icon
import "../styles/navbar.css";

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <p className="text-center mt-4 text-gray-500">Loading...</p>;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* ✅ Left: Brand Logo */}
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            CORY
          </Link>
        </div>

        {/* ✅ Center: Main Navigation */}
        <div className="navbar-center">
          {user ? (
            <>
              {user.role === "organizer" && (
                <>
                  <Link to="/create-event" className="icon-button navbar-org">
                    <Plus size={20} />
                    <span>Create Event</span>
                  </Link>
                  <Link to="/my-events" className="icon-button navbar-org">
                    <List size={20} />
                    <span>My Events</span>
                  </Link>
                </>
              )}



              {user.role === "staff" && (
                <Link to="/events" className="icon-button navbar-staff">
                  <Calendar size={20} />
                  <span>Event Calendar</span>
                </Link>
              )}
            </>
          ) : (
            /* ✅ Non-authenticated users: Centered Links */
            <Flex className="navbar-links">
              <Link to="/">Home</Link>
              <Link to="/features">Features</Link>
              <Link to="/about">About</Link>
            </Flex>
          )}
        </div>

        {/* ✅ Right: Profile Dropdown + Logout */}
        <div className="navbar-right">
          {user ? (
            <>
              {/* ✅ Profile Dropdown */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="profile-link">
                    <UserCircle size={24} className="profile-icon" />
                    <span className="profile-name">{user.username}</span>
                  </button>
                </DropdownMenu.Trigger>
                
                <DropdownMenu.Content className="dropdown-menu" align="center">
                  <DropdownMenu.Item asChild>
                    <Link to="/profile" className="dropdown-item">Profile</Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link to="/dashboard" className="dropdown-item">Dashboard</Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={logout} className="dropdown-item logout">
                    Log Out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="btn-auth">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="btn-auth">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
