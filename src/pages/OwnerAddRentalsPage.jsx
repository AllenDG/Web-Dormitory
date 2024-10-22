import { Box, useColorModeValue } from "@chakra-ui/react";
import AddPropertyForm from "../components/forms/AddPropertyForm";

export default function OwnerAddRentalsPage() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");
  return (
    <Box direction="column" minH="100vh" bgColor={bgColor}>
      <h1>Add Rentals</h1>
      <AddPropertyForm />
    </Box>
  );
}
