import { Box, Heading, useColorModeValue } from "@chakra-ui/react";
import AddPropertyForm from "../components/forms/AddPropertyForm";

export default function OwnerAddRentalsPage() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");
  return (
    <Box direction="column" minH="100vh" bgColor={bgColor} p="4">
      <Heading as="h1" size="lg" textAlign="center">
        Add Rental
      </Heading>
      <AddPropertyForm />
    </Box>
  );
}
