import { Box, useColorModeValue } from "@chakra-ui/react";

export default function OwnerDashboardPage() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");
  return (
    <Box direction="column" minH="100vh" bgColor={bgColor}>
      <h1>Dashboard</h1>
    </Box>
  );
}
