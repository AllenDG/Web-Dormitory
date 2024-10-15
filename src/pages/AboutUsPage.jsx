import { Flex, Box, Text, Heading, useColorModeValue, Image, Grid, GridItem } from "@chakra-ui/react";

export default function AboutUsPage() {
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Flex
      direction="column"
      minH="100vh"
      justify="flex-start"
      align="center"
      bg={bgColor}
      px={6}
      py={12}
    >
      {/* Header */}
      <Heading as="h1" size="3xl" mb={4} color={textColor}>
        SECURE YOUR SPACE
      </Heading>
      <Text fontSize="lg" color={textColor} mb={12} textAlign="center">
        Discover a hassle-free way to find your perfect living space.
      </Text>

      {/* Banner Section */}
      <Box
        mb={12}
        width="100%"
        height="300px"
        bg="gray.300"
        borderRadius="md"
        position="relative"
      >
        <Image
          src="https://via.placeholder.com/1200x300" // Placeholder banner image
          alt="Banner Image"
          objectFit="cover"
          borderRadius="md"
          width="100%"
          height="100%"
        />
      </Box>

      {/* What is Dormy Section */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={100} mb={12} maxW="800px" width="100%" mt={12}>
        <GridItem>
          <Image
            src="https://via.placeholder.com/500x300" // Placeholder image for Dormy example
            alt="What is Dormy"
            borderRadius="md"
            objectFit="cover"
          />
        </GridItem>
        <GridItem>
          <Heading as="h2" size="lg" mb={4} color={textColor}>
            What is Dormy?
          </Heading>
          <Text fontSize="lg" color={textColor}>
            Dormy is a marketplace for residential stays, where renters can easily find residential spaces for rent in one platform.
          </Text>
        </GridItem>
      </Grid>

      {/* Mission Section */}
      <Box textAlign="center" mb={12}>
        <Heading as="h2" size="xl" mb={4} color={textColor}>
          OUR MISSION
        </Heading>
        <Text fontSize="lg" color={textColor} mb={4}>
          Make renting better, for everyone
        </Text>
        <Text fontSize="md" maxW="600px" mx="auto" color={textColor}>
          We're revolutionizing the way people rent, by paving the path towards a tech-enabled rental ecosystem for all.
        </Text>
      </Box>

      {/* Cards Section */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} mb={12} maxW="1200px" width="100%">
        <GridItem>
          <Box p={4} borderWidth={1} borderRadius="md" bg="white" boxShadow="md">
            <Image
              src="https://static.wixstatic.com/media/ea71bb_688298c755fc420abee57b56d06031b8~mv2.png/v1/fill/w_850,h_1049,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/ea71bb_688298c755fc420abee57b56d06031b8~mv2.png" // Placeholder image for card 1
              alt="Card Image 1"
              borderRadius="md"
              mb={4}
            />
            <Heading as="h3" size="md" mb={2} color={textColor}>
              User-Friendly Interface
            </Heading>
            <Text color={textColor}>
              Our platform is designed for ease of use, making it simple for anyone to find their ideal rental space.
            </Text>
          </Box>
        </GridItem>
        <GridItem>
          <Box p={4} borderWidth={1} borderRadius="md" bg="white" boxShadow="md">
            <Image
              src="https://static.wixstatic.com/media/ea71bb_688298c755fc420abee57b56d06031b8~mv2.png/v1/fill/w_850,h_1049,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/ea71bb_688298c755fc420abee57b56d06031b8~mv2.png" // Placeholder image for card 2
              alt="Card Image 2"
              borderRadius="md"
              mb={4}
            />
            <Heading as="h3" size="md" mb={2} color={textColor}>
              Comprehensive Listings
            </Heading>
            <Text color={textColor}>
              Browse through a variety of listings, with detailed descriptions and amenities to choose from.
            </Text>
          </Box>
        </GridItem>
        <GridItem>
          <Box p={4} borderWidth={1} borderRadius="md" bg="white" boxShadow="md">
            <Image
              src="https://static.wixstatic.com/media/ea71bb_688298c755fc420abee57b56d06031b8~mv2.png/v1/fill/w_850,h_1049,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/ea71bb_688298c755fc420abee57b56d06031b8~mv2.png" // Placeholder image for card 3
              alt="Card Image 3"
              borderRadius="md"
              mb={4}
            />
            <Heading as="h3" size="md" mb={2} color={textColor}>
              Secure Transactions
            </Heading>
            <Text color={textColor}>
              We ensure all transactions are secure, providing peace of mind for both renters and owners.
            </Text>
          </Box>
        </GridItem>
      </Grid>

    </Flex>
  );
}
