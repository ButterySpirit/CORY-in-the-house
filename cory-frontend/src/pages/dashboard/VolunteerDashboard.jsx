import { Heading, Button, Flex } from "@radix-ui/themes";
import { Link } from "react-router-dom";

export default function VolunteerDashboard() {
  return (
    <Flex align="center" justify="center" height="100vh" direction="column">
      <Heading size="5">Volunteer Dashboard</Heading>
      <Button asChild>
        <Link to="/events">Browse Events</Link>
      </Button>
      <Button asChild>
        <Link to="/my-events">My Signups</Link>
      </Button>
    </Flex>
  );
}
