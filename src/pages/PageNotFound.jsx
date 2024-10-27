import {
  Flex,
  Heading,
  Text,
  Button,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  // Define colors using the provided palette
  const bgColor = useColorModeValue("#F4F4F4", "gray.900"); // Light mode primary color or dark mode background
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const buttonColor = "#0084FF"; // Secondary color for button

  return (
    <Flex
      direction="column"
      minH="100vh"
      justify="center"
      align="center"
      bg={bgColor}
      px={4}
      textAlign="center"
      p={6} // Add padding for better spacing
    >
      <Box>
        {/* 404 Error Text */}
        <Heading as="h1" size="4xl" color={textColor} mb={4}>
          404
        </Heading>

        {/* Error Description */}
        <Text fontSize="lg" color={textColor} mb={6}>
          Oops! The page you are looking for doesn&apos;t exist.
        </Text>

        {/* Return to Home Button */}
        <Link to="/">
          <Button
            bg={buttonColor}
            color="white"
            size="lg"
            _hover={{ bg: "#005bb5" }} // Darken the button on hover
          >
            Go Back Home
          </Button>
        </Link>
      </Box>
    </Flex>
  );
}
