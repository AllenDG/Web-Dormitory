import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");
  return (
    <Flex
      direction="column"
      minH="100vh"
      justify="center"
      align="center"
      bg={bgColor}
    >
      <Link to="/">
        <Text>Home</Text>
      </Link>
    </Flex>
  );
}
