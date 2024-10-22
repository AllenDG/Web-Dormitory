import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function OwnerRentalsPage() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");
  return (
    <Box direction="column" minH="100vh" bgColor={bgColor}>
      <Flex>
        <h1>Rentals</h1>
        <Link to="/owner/add-rentals">Add Rentals</Link>
      </Flex>
    </Box>
  );
}
