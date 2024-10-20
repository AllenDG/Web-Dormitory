import {
  Box,
  Flex,
  Text,
  Heading,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";

export default function HowItWorksPage() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");
  const textColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Flex
      direction="column"
      minH="100vh"
      justify="center"
      align="center"
      bg={bgColor}
      px={4}
    >
      {/* "How it works" section */}
      <Heading as="h1" size="sm" textAlign="center" color="black" mt={50}>
        How It Works
      </Heading>
      <Text
        fontSize="4xl"
        fontWeight="bold"
        color="blue.600"
        textAlign="center"
        mt={2}
        mb="20%"
      >
        Finding your perfect home is just 3 clicks away.
      </Text>

      {/* Step-by-step content */}
      <Box width="100%" maxW="800px">
        {/* Step 1: Browse */}
        <Flex direction={["column", "column", "row"]} align="center" mb={6}>
          <Box flex="1">
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color="blue.700"
              textAlign={["center", "center", "left"]}
              mt={2}
            >
              1. Browse 🔍
            </Text>
            <Text
              fontSize="md"
              color={textColor}
              textAlign={["center", "center", "left"]}
              mt={2}
            >
              Start by typing your ideal location. Apply filters like pets
              allowed, with gym amenities, or explore bedspace versus
              entire-room stays to narrow down your options.
            </Text>
          </Box>
          <Box
            flex="1"
            p={4}
            ml={[0, 0, 4]}
            boxShadow="lg"
            bg="white"
            rounded="md"
            mt={[4, 4, 0]}
            width="250px" // set the width to create a square
            height="250px" // set the height to create a square with added height
          >
            <Image
              src="/path-to-browse-image.jpg" // replace with actual image path
              alt="Browse Properties"
              boxSize="200px"
              objectFit="cover"
            />
          </Box>
        </Flex>

        {/* Step 2: Book or Contact */}
        <Flex
          direction={["column", "column", "row-reverse"]}
          align="center"
          mb={6}
          mt="20%"
        >
          <Box flex="1">
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color="blue.700"
              textAlign={["center", "center", "right"]}
              mt={2}
            >
              2. Book or Contact 📞
            </Text>
            <Text
              fontSize="md"
              color={textColor}
              textAlign={["center", "center", "right"]}
              mt={2}
            >
              Found your ideal home? Book it instantly or contact the owner for
              more details and queries.
            </Text>
          </Box>
          <Box
            flex="1"
            p={4}
            mr={[0, 0, 4]}
            boxShadow="lg"
            bg="white"
            rounded="md"
            mt={[4, 4, 0]}
            width="250px" // set the width to create a square
            height="250px" // set the height to create a square with added height
          >
            <Image
              src="/path-to-book-contact-image.jpg" // replace with actual image path
              alt="Book or Contact"
              boxSize="200px"
              objectFit="cover"
            />
          </Box>
        </Flex>

        {/* Step 3: Visit and Move In */}
        <Flex direction={["column", "column", "row"]} align="center" mt="20%">
          <Box flex="1">
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color="blue.700"
              textAlign={["center", "center", "left"]}
              mt={2}
            >
              3. Visit and Move In 🚚
            </Text>
            <Text
              fontSize="md"
              color={textColor}
              textAlign={["center", "center", "left"]}
              mt={2}
            >
              Schedule a visit, see your future home in person, and move in with
              ease.
            </Text>
          </Box>
          <Box
            flex="1"
            p={4}
            ml={[0, 0, 4]}
            boxShadow="lg"
            bg="white"
            rounded="md"
            mt={[4, 4, 0]}
            width="250px" // set the width to create a square
            height="250px" // set the height to create a square with added height
          >
            <Image
              src="/path-to-visit-move-in-image.jpg" // replace with actual image path
              alt="Visit and Move In"
              boxSize="200px"
              objectFit="cover"
            />
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
