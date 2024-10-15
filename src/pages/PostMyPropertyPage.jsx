import { Flex, useColorModeValue } from "@chakra-ui/react";

export default function PostMyPropertyPage() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");
  return (
    <Flex
      direction="column"
      minH="100vh"
      justify="center"
      align="center"
      bg={bgColor}
    ></Flex>
  );
}
