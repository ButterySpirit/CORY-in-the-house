import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Features from "./pages/Features";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function AppRouter() {
  return (
    <Router>
      {/* ✅ Navbar is always at the top */}
      <Navbar />

      {/* ✅ Page content is below the Navbar */}
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} /> {/* ✅ Home is the landing page */}
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </Router>
  );
}
