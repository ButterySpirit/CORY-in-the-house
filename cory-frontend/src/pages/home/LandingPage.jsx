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
          <Text size="3">Discover how CORY connects event organizers with talented volunteers and staff—seamlessly and meaningfully.</Text>
        </Box>
        <Box className="hero-image">
          <img src="img/hero.png"/>
        </Box>
      </Flex>

      {/* ✅ Features Section */}
      <Box className="features container">
        <Heading size="5">Explore CORY's Features</Heading>
        <Text size="3">Enhance your event staffing experience with purpose-built tools for the nightlife, arts, and music industry.</Text>
        <Flex mt="4" gap="3">
          <Button asChild className="btn">
            <Link to="/signup?role=staff">Sign Up as Staff or Volunteer</Link>
          </Button>
          <Button asChild className="btn">
            <Link to="/signup?role=organizer">Sign Up as Organizer</Link>
          </Button>
        </Flex>
      </Box>

      {/* ✅ Feature Cards */}
      <Grid className="feature-cards grid-container">
        <Link to="/features" className="feature-card">
          <Box height="150px" className="hero-image">
            <img src="img/feature1.png"/>
          </Box>
          <Text weight="bold" size="4">Verified Community</Text>
          <Text size="2">Work with trusted organizers, volunteers, and staff. User ratings help ensure accountability and quality.</Text>
        </Link>

        <Link to="/features" className="feature-card">
          <Box height="150px" className="hero-image">
            <img src="img/feature2.png"/>
          </Box>
          <Text weight="bold" size="4">All-in-One Dashboard</Text>
          <Text size="2">Easily manage your events, job postings, applications, and team communication in one sleek interface.</Text>
        </Link>

        <Link to="/features" className="feature-card">
          <Box height="150px" className="hero-image">
            <img src="img/feature3.png"/>
          </Box>
          <Text weight="bold" size="4">Flexible Role Creation</Text>
          <Text size="2">Create and customize volunteer and staff positions for each event—tailored to your crew’s specific needs.</Text>
        </Link>
      </Grid>
    </Box>
  );
}
