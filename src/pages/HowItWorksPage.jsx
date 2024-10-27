import {
  Box,
  Flex,
  Text,
  Heading,
  Image,
  Button,
  useColorModeValue,
  Icon,
  LightMode,
} from "@chakra-ui/react";
import { FaSearch, FaPhone, FaTruck } from "react-icons/fa";

export default function HowItWorksPage() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");
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
      <Heading as="h1" size="xl" textAlign="center" mb={4}>
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
      <Box mb={10} mt={50}>
        {/* Step 1: Browse */}
        <Flex direction={["column", "column", "row"]} align="center" mb={10}>
          <Box flex="1" textAlign={["center", "center", "left"]}>
            <Icon as={FaSearch} boxSize={8} color="blue.600" mb={2} />
            <Text fontSize="2xl" fontWeight="bold" color={stepColor}>
              1. Browse
            </Text>
            <Text fontSize="md" mt={2} maxW="450px">
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
            width="150px"
            height="250px"
          >
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/test-2ac5c.appspot.com/o/browse.jpg?alt=media&token=ff6faafd-be81-44dc-b83a-b17262b6ed1c"
              alt="Browse Properties"
              boxSize="100%"
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
          mt={10} // Adjusted margin-top for better spacing
        >
          <Box flex="1" textAlign={["center", "center", "right"]}>
            <Icon as={FaPhone} boxSize={8} color="green.500" mb={2} />
            <Text fontSize="2xl" fontWeight="bold" color={stepColor}>
              2. Book or Contact
            </Text>
            <Text fontSize="md" mt={2} maxW="450px">
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
              src="https://firebasestorage.googleapis.com/v0/b/test-2ac5c.appspot.com/o/message.jpg?alt=media&token=2d8c3bce-b4d8-429c-b9cd-4f5d0c21ba9f"
              alt="Visit and Move In"
              boxSize="100%"
              objectFit="cover"
              rounded="md"
            />
          </Box>
        </Flex>

        {/* Step 3: Visit and Move In */}
        <Flex direction={["column", "column", "row"]} align="center" mt={10}>
          {" "}
          {/* Adjusted margin-top for better spacing */}
          <Box flex="1" textAlign={["center", "center", "left"]}>
            <Icon as={FaTruck} boxSize={8} color="teal.600" mb={2} />
            <Text fontSize="2xl" fontWeight="bold" color={stepColor}>
              3. Visit and Move In
            </Text>
            <Text fontSize="md" mt={2} maxW="450px">
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
              src="https://firebasestorage.googleapis.com/v0/b/test-2ac5c.appspot.com/o/clock.jpg?alt=media&token=af94e33c-e482-4f7a-b1d1-5eae7f823986"
              alt="Clock"
              boxSize="100%"
              objectFit="cover"
              rounded="md"
            />
          </Box>
        </Flex>
      </Box>

      {/* Add buttons for Renters and Owners */}
      <Flex mt={100} mb={8} justify="center" gap={6}>
        <Flex direction="column" align="center" gap={2}>
          <Text fontSize="lg" fontWeight="semibold" color="blue.600">
            For Renters
          </Text>
          <Text fontSize="md" textAlign="center" maxW="300px">
            Search for verified rentals, schedule a visit, and move in with
            ease.
          </Text>
          <LightMode>
            <Button
              mt={4}
              size="lg"
              colorScheme="primary"
              _hover={{ bg: "blue.700" }}
              onClick={() => {
                // Handle Renters button click
              }}
            >
              Explore Rentals
            </Button>
          </LightMode>
        </Flex>

        <Flex direction="column" align="center" gap={2}>
          <Text fontSize="lg" fontWeight="semibold" color="green.600">
            For Owners
          </Text>
          <Text fontSize="md" textAlign="center" maxW="300px">
            List your property, connect with renters, and manage bookings
            effortlessly.
          </Text>
          <LightMode>
            <Button
              mt={4}
              size="lg"
              colorScheme="green"
              _hover={{ bg: "green.700" }}
              onClick={() => {
                // Handle Owners button click
              }}
            >
              List Your Property
            </Button>
          </LightMode>
        </Flex>
      </Flex>
    </Flex>
  );
}
