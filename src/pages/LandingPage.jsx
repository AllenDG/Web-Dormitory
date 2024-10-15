import { Box, Flex, Heading, useColorModeValue } from "@chakra-ui/react";
import RentalsListing from "../features/rentals/RentalsListing";
import useTypingAnimation from "../hooks/useTypingAnimation";

const words = ["rooms", "apartment", "condo"];

export default function LandingPage() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");
  const displayText = useTypingAnimation(words, 100, 2000);

  return (
    <Flex p="12px" minH="100vh" direction="column" align="center" bg={bgColor}>
      <Box p="20px">
        <Heading as="h4" size="md">
          Find {displayText} for rent with Dormitory
        </Heading>
      </Box>
      <RentalsListing />
    </Flex>
  );
}
