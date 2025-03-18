import { Link } from "react-router-dom";
import { Box, Flex, Heading, Text, Button, Grid } from "@radix-ui/themes";
import Navbar from "../../components/Navbar";
import "../../styles/global.css";
import "../../styles/landing.css";

export default function LandingPage() {
  return (
    <Box className="container">
      {/* ✅ Navbar */}

      <Navbar />

      {/* ✅ Hero Section */}
      <Flex className="hero container">
        <Box className="hero-text">
          <Heading size="6">Simplify Staffing, Empower Youth</Heading>
          <Text size="3">Discover the power of the CORY platform.</Text>
        </Box>
        <Box className="hero-image"></Box>
      </Flex>

      {/* ✅ Features Section */}
      <Box className="features container">
        <Heading size="5">Explore CORY's Features</Heading>
        <Text size="3">Enhance your staffing experience.</Text>
        <Flex mt="4" gap="3">
          <Button asChild className="btn">
            <Link to="/signup">Sign Up as Staff or Volunteer</Link>
          </Button>
          <Button asChild className="btn">
            <Link to="/signup">Sign Up as Organizer</Link>
          </Button>
        </Flex>
      </Box>

      {/* ✅ Feature Cards */}
      <Grid className="feature-cards grid-container">
        {[1, 2, 3].map((feature) => (
          <Box key={feature} className="feature-card">
            <Box height="150px" className="hero-image"></Box>
            <Text mt="2">Feature {feature}</Text>
            <Text weight="bold">Details</Text>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
