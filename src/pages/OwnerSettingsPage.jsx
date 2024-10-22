import { Box, useColorModeValue } from "@chakra-ui/react";

export default function OwnerSettingsPage() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");
  return (
    <Box direction="column" minH="100vh" bgColor={bgColor}>
      <h1>Account Settings</h1>
    </Box>
  );
}
