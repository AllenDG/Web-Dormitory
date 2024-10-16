import { Flex, Heading, Text, Button, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");

  return (
    <Flex
      direction="column"
      minH="100vh"
      justify="center"
      align="center"
      bg={bgColor}
      px={4}
    >
      {/* 404 Error Text */}
      <Heading as="h1" size="4xl" color={textColor} mb={4}>
        404
      </Heading>

      {/* Error Description */}
      <Text fontSize="lg" color={textColor} mb={6} textAlign="center">
        Oops! The page you are looking for doesn&apos;t exist.
      </Text>

      {/* Return to Home Button */}
      <Link to="/">
        <Button colorScheme="teal" size="lg">
          Go Back Home
        </Button>
      </Link>
    </Flex>
  );
}
