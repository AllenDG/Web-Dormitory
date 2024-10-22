import { Box, useColorModeValue } from "@chakra-ui/react";

export default function OwnerTenantsPage() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");
  return (
    <Box direction="column" minH="100vh" bgColor={bgColor}>
      <h1>Tenants</h1>
    </Box>
  );
}
