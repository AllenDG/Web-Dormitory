import {
  Box,
  Flex,
  Text,
  Heading,
  Image,
  Button,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { FaSearch, FaPhone, FaTruck } from "react-icons/fa";

export default function HowItWorksPage() {
  const bgColor = useColorModeValue("#F4F4F4", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const stepColor = useColorModeValue("blue.700", "blue.400");

  return (
    <Flex
      direction="column"
      minH="100vh"
      justify="center"
      align="center"
      bg={bgColor}
      px={6}
      py={12}
    >
      {/* "How it works" section */}
      <Heading as="h1" size="xl" textAlign="center" color="black" mb={4}>
        How It Works
      </Heading>
      <Text
        fontSize="2xl"
        fontWeight="bold"
        color="blue.600"
        textAlign="center"
        mb={12}
      >
        Finding your perfect home is just 3 clicks away.
      </Text>

      {/* Step-by-step content */}
      <Box width="100%" maxW="800px" mb={10}>
        {/* Step 1: Browse */}
        <Flex direction={["column", "column", "row"]} align="center" mb={10}>
          <Box flex="1" textAlign={["center", "center", "left"]}>
            <Icon as={FaSearch} boxSize={8} color="blue.600" mb={2} />
            <Text fontSize="2xl" fontWeight="bold" color={stepColor}>
              1. Browse
            </Text>
            <Text fontSize="md" color={textColor} mt={2} maxW="450px">
              Start by typing your ideal location. Use filters to find options
              like pet-friendly places, gyms, or specific room types.
            </Text>
          </Box>
          <Box
            flex="1"
            p={4}
            ml={[0, 0, 6]}
            boxShadow="lg"
            bg="white"
            rounded="lg"
            _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
            mt={[4, 4, 0]}
            width="250px"
            height="250px"
          >
            <Image
              src="/path-to-browse-image.jpg"
              alt="Browse Properties"
              boxSize="200px"
              objectFit="cover"
              rounded="md"
            />
          </Box>
        </Flex>

        {/* Step 2: Book or Contact */}
        <Flex
          direction={["column", "column", "row-reverse"]}
          align="center"
          mb={10}
        >
          <Box flex="1" textAlign={["center", "center", "right"]}>
            <Icon as={FaPhone} boxSize={8} color="green.500" mb={2} />
            <Text fontSize="2xl" fontWeight="bold" color={stepColor}>
              2. Book or Contact
            </Text>
            <Text fontSize="md" color={textColor} mt={2} maxW="450px">
              Found your ideal home? Book it instantly or reach out to the owner
              for more information.
            </Text>
          </Box>
          <Box
            flex="1"
            p={4}
            mr={[0, 0, 6]}
            boxShadow="lg"
            bg="white"
            rounded="lg"
            _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
            mt={[4, 4, 0]}
            width="250px"
            height="250px"
          >
            <Image
              src="/path-to-book-contact-image.jpg"
              alt="Book or Contact"
              boxSize="200px"
              objectFit="cover"
              rounded="md"
            />
          </Box>
        </Flex>

        {/* Step 3: Visit and Move In */}
        <Flex direction={["column", "column", "row"]} align="center">
          <Box flex="1" textAlign={["center", "center", "left"]}>
            <Icon as={FaTruck} boxSize={8} color="teal.600" mb={2} />
            <Text fontSize="2xl" fontWeight="bold" color={stepColor}>
              3. Visit and Move In
            </Text>
            <Text fontSize="md" color={textColor} mt={2} maxW="450px">
              Schedule a visit, get a firsthand look at your future home, and
              settle in seamlessly.
            </Text>
          </Box>
          <Box
            flex="1"
            p={4}
            ml={[0, 0, 6]}
            boxShadow="lg"
            bg="white"
            rounded="lg"
            _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
            mt={[4, 4, 0]}
            width="250px"
            height="250px"
          >
            <Image
              src="/path-to-visit-move-in-image.jpg"
              alt="Visit and Move In"
              boxSize="200px"
              objectFit="cover"
              rounded="md"
            />
          </Box>
        </Flex>
      </Box>

      {/* Add buttons for Renters and Owners */}
      <Flex mt={10} mb={8} justify="center" gap={6}>
        <Flex direction="column" align="center" gap={2}>
          <Text fontSize="lg" fontWeight="semibold" color="blue.600">
            For Renters
          </Text>
          <Text fontSize="md" color={textColor} textAlign="center" maxW="300px">
            Search for verified rentals, schedule a visit, and move in with
            ease.
          </Text>
          <Button
            size="lg"
            colorScheme="blue"
            _hover={{ bg: "blue.700" }}
            onClick={() => {
              // Handle Renters button click
            }}
          >
            Explore Rentals
          </Button>
        </Flex>

        <Flex direction="column" align="center" gap={2}>
          <Text fontSize="lg" fontWeight="semibold" color="green.600">
            For Owners
          </Text>
          <Text fontSize="md" color={textColor} textAlign="center" maxW="300px">
            List your property, connect with renters, and manage bookings
            effortlessly.
          </Text>
          <Button
            size="lg"
            colorScheme="green"
            _hover={{ bg: "green.700" }}
            onClick={() => {
              // Handle Owners button click
            }}
          >
            List Your Property
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
