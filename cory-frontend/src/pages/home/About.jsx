// src/pages/about/About.jsx

import { Box, Heading, Text, Button, Flex, Grid } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../styles/about.css";

export default function AboutPage() {
  return (
    <Box className="about-container">
      <Navbar />

      {/* 🖥️ 1. Hero */}
      <section className="about-hero">
        <Heading size="7">About CORY</Heading>
        <Text size="4" className="subtitle">Build events with purpose.</Text>
      </section>

      {/* 📚 2. What is CORY */}
      <section className="about-section two-column">
        <img src="/img/about.png" alt="Connecting people" className="about-image"/>
        <Box>
          <Heading size="5">What is <strong>CORY</strong>?</Heading>
          <Text>
            <strong>CORY</strong> is a platform designed to empower the next generation of event collaborators by simplifying how organizers connect with passionate, talented individuals who want to contribute to music and cultural experiences.
            <br /><br />
            Whether you’re an event organizer planning your next underground show, or a volunteer or staff member looking to get involved in the scene—<strong>CORY</strong> brings people together with purpose, efficiency, and creativity.
          </Text>
        </Box>
      </section>

      {/* 🎯 3. Mission & Vision */}
      <section className="about-section card-section">
        <Box className="card">
          <Heading size="5">🚀 Our Mission</Heading>
          <Text>
            To streamline staffing for music and cultural events while creating real opportunities for youth to gain experience, build community, and develop creative careers.
          </Text>
        </Box>
        <Box className="card">
          <Heading size="5">🔍 Our Vision</Heading>
          <Text>
            A safer, more organized, and more inclusive nightlife ecosystem where events thrive—and every person involved feels empowered, recognized, and supported.
          </Text>
        </Box>
      </section>

      {/* 👥 4. Who It’s For */}
      <section className="about-section icon-grid">
        <Grid columns="3" gap="4">
          <Box className="icon-tile">
            <Heading size="4">🎛️ Organizers</Heading>
            <Text>Post jobs, screen applicants, manage events efficiently.</Text>
          </Box>
          <Box className="icon-tile">
            <Heading size="4">🤝 Volunteers & Staff</Heading>
            <Text>Get involved in events, gain experience, build your network.</Text>
          </Box>
          <Box className="icon-tile">
            <Heading size="4">🌍 Communities</Heading>
            <Text>Foster accessibility, harm reduction, and inclusive culture.</Text>
          </Box>
        </Grid>
      </section>

      {/* 🔧 5. Why We Built It */}
      <section className="about-section dark-bg">
        <Box className="overlay-text">
          <Text size="4">
            "As insiders in the local music scene, we saw how chaotic event staffing can be—text chains, spreadsheets, last-minute drop-offs.
            <br /><br />
            We built <strong>CORY</strong> to bring structure to the chaos, while still celebrating the energy that makes our scene special.
            We’ve collaborated with real promoters and collectives like Takeover 6ix to develop tools that are practical, intuitive, and focused on the realities of underground organizing."
          </Text>
        </Box>
      </section>

      {/* 🌱 6. Youth Empowerment */}
      <section className="about-section timeline">
        <Heading size="5">🌱 Youth Empowerment & Volunteering</Heading>
        <br></br>
        <br></br>
        <Flex gap="4" justify="center" align="center" wrap="wrap">
          <Box className="step">Sign Up</Box>
          <span className="arrow">→</span>
          <Box className="step">Join Events</Box>
          <span className="arrow">→</span>
          <Box className="step">Build Skills</Box>
          <span className="arrow">→</span>
          <Box className="step">Get Rated</Box>
          <span className="arrow">→</span>
          <Box className="step">Grow Profile</Box>
        </Flex>
      </section>

      {/* 💬 7. Final CTA */}
      <section className="about-cta">
        <Heading size="6">Build Events with Us</Heading>
        <Text>
          From raves to community festivals, from DJs to lighting techs, <strong>CORY</strong> helps everyone work together better.
        </Text>
        <Flex gap="3" mt="4" justify="center">
          <Button asChild><Link to="/signup?role=organizer">Sign Up as Organizer</Link></Button>
          <Button asChild variant="outline"><Link to="/signup?role=staff">Sign Up as Volunteer</Link></Button>
          <Button asChild color="gray"><Link to="/contact">Contact Us</Link></Button>
        </Flex>
      </section>
    </Box>
  );
}