import { Heading, Button, Flex } from "@radix-ui/themes";
import { Link } from "react-router-dom";

export default function StaffDashboard() {
  return (
    <Flex align="center" justify="center" height="100vh" direction="column">
      <Heading size="5">Staff Dashboard</Heading>
      <Button asChild>
        <Link to="/jobs">Browse Jobs</Link>
      </Button>
      <Button asChild>
        <Link to="/my-applications">My Applications</Link>
      </Button>
    </Flex>
  );
}
