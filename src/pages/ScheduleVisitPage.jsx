import { Box, Flex, useColorModeValue } from "@chakra-ui/react";

export default function ScheduleVisitPage() {
  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      bg={bgColor}
      p={5}
    >
      <Box bg="tomato" w="100%" p={4} color="white">
        This is the Box
      </Box>
    </Flex>
  );
}
