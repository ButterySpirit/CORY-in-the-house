import { Heading, Button, Flex } from "@radix-ui/themes";
import { Link } from "react-router-dom";

export default function OrganizerDashboard() {
  return (
    <Flex align="center" justify="center" height="100vh" direction="column">
      <Heading size="5">Organizer Dashboard</Heading>
      <Button asChild>
        <Link to="/create-job">Post a Job</Link>
      </Button>
      <Button asChild>
        <Link to="/create-event">Create Event</Link>
      </Button>
      <Button asChild>
        <Link to="/view-applications">View Applications</Link>
      </Button>
    </Flex>
  );
}
