// src/pages/features/Features.jsx

import { Box, Heading, Text } from "@radix-ui/themes";
import { useEffect } from "react";
import Navbar from "../../components/Navbar";
import "../../styles/features.css";

export default function FeaturesPage() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const sections = document.querySelectorAll(".features-section");

    const onScroll = () => {
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          section.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", onScroll);
    onScroll(); // trigger once on mount

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Box className="features-container">
      <Navbar />

      {/* 🔹 Section 1 */}
      <section id="section1" className="features-section">
        <img src="/img/feature1.png" alt="Verified Roles" className="feature-img" />
        <Heading size="6">Verified Community & Role-Based Access</Heading>
        <Text>
          CORY ensures a safe environment by requiring all users to register with clear roles: Organizer, Staff, or Volunteer.
        </Text>
        <ul>
          <li>✅ Organizers can only create events & jobs</li>
          <li>✅ Staff/Volunteers apply and build credibility</li>
          <li>✅ Built-in messaging system</li>
        </ul>
        <button className="scroll-arrow" onClick={() => scrollTo("section2")}>↓</button>
      </section>

      {/* 🔹 Section 2 */}
      <section id="section2" className="features-section">
        <img src="/img/feature2.png" alt="Dashboard" className="feature-img" />
        <Heading size="6">🧰 All-in-One Dashboard</Heading>
        <Text>Organizers can:</Text>
        <ul>
          <li>Create/manage events</li>
          <li>Post roles and assign staff</li>
          <li>View real-time applications</li>
          <li>Message selected users</li>
        </ul>
        <button className="scroll-arrow" onClick={() => scrollTo("section3")}>↓</button>
      </section>

      {/* 🔹 Section 3 */}
      <section id="section3" className="features-section">
        <img src="/img/feature3.png" alt="Apply & Track" className="feature-img" />
        <Heading size="6">👥 Smart Application Tools</Heading>
        <Text>Volunteers/Staff can:</Text>
        <ul>
          <li>Browse events</li>
          <li>Apply for specific events</li>
          <li>Upload resumes or portfolios</li>
          <li>Track application progress</li>
        </ul>
        <button className="scroll-arrow" onClick={() => scrollTo("section1")}>↑</button>
      </section>
    </Box>
  );
}
