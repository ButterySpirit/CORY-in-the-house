import { Button, Card, Text, Heading, Container, Flex, Box } from "@radix-ui/themes";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Container className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <Box className="text-center">
        <Heading as="h1" size="5" className="font-bold">
          Simplify Staffing, Empower Youth
        </Heading>
        <Text className="text-gray-600">Discover the power of the CORY platform.</Text>
        <Link to="/get-started">
          <Button className="mt-4">Get Started</Button>
        </Link>
      </Box>

      {/* Features Section */}
      <Box className="mt-12">
        <Heading as="h2" size="4" className="font-bold">
          Explore CORY's Features
        </Heading>
        <Text className="text-gray-600">Enhance your staffing experience.</Text>

        <Flex className="gap-6 mt-6">
          {[1, 2, 3].map((feature, idx) => (
            <Card key={idx} className="p-4 w-full">
              <Text as="p" className="text-sm text-gray-500">Label</Text>
              <Box className="bg-gray-200 h-32 mb-4" /> {/* Placeholder for Image */}
              <Heading as="h3" size="3" className="font-semibold">
                Feature {feature}
              </Heading>
              <Link to={`/features/${feature}`}>
                <Text className="text-blue-500 underline">Details</Text>
              </Link>
            </Card>
          ))}
        </Flex>
      </Box>

      {/* Quick Access Section */}
      <Box className="mt-12 text-center">
        <Heading as="h2" size="4" className="font-bold">
          Quick Access
        </Heading>
        <Text className="text-gray-600">Get started with CORY directly.</Text>
        <Link to="/learn-more">
          <Button className="mt-4">Learn More</Button>
        </Link>
      </Box>
    </Container>
  );
}
