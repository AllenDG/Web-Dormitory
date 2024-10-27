import {
  Flex,
  Box,
  Text,
  Heading,
  useColorModeValue,
  Image,
  Grid,
  GridItem,
  Button,
  LightMode,
} from "@chakra-ui/react";

import person from "../assets/person.png";

export default function AboutUsPage() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");

  const cardData = [
    {
      id: 1,
      image:
        "https://firebasestorage.googleapis.com/v0/b/test-2ac5c.appspot.com/o/browse.jpg?alt=media&token=ff6faafd-be81-44dc-b83a-b17262b6ed1c",
      title: "Seamless User Experience",
      description:
        "Designed with simplicity in mind, our platform ensures that finding your perfect rental space is a hassle-free journey.",
    },
    {
      id: 2,
      image:
        "https://firebasestorage.googleapis.com/v0/b/test-2ac5c.appspot.com/o/Cart%20list.png?alt=media&token=8d9e5a83-6d58-4c00-9dd4-9893dbc71858",
      title: "Diverse Listings at Your Fingertips",
      description:
        "Explore an extensive range of listings tailored to your needs, complete with detailed descriptions and essential amenities.",
    },
    {
      id: 3,
      image:
        "https://firebasestorage.googleapis.com/v0/b/test-2ac5c.appspot.com/o/clock.jpg?alt=media&token=af94e33c-e482-4f7a-b1d1-5eae7f823986",
      title: "Peace of Mind with Secure Transactions",
      description:
        "We prioritize your security, ensuring that every transaction is protected for the safety of both renters and property owners.",
    },
  ];

  const teamMembers = [
    {
      id: 1,
      name: "CLAVERIA, JEDYNE B.",
      role: "system analyst",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "BADINAS, JOHN PAUL",
      role: "Mobile Developer",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "MANUCAN, JAMES",
      role: "Mobile Developer",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "DE GUZMAN, ALLEN WALTER F.",
      role: "UI/UX | Web Developer",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 5,
      name: "ESTRADA, JHULYAN MATTHEW T.",
      role: "System Analyst",
      image: "https://via.placeholder.com/150",
    },
  ];

  return (
    <Flex
      direction="column"
      minH="100vh"
      align="center"
      bg={bgColor}
      px={6}
      py={12}
    >
      {/* Header */}
      <Heading as="h1" size="3xl" mb={4} mt={8} color="#0084FF">
        SECURE YOUR SPACE
      </Heading>
      <Text fontSize="lg" mb={12} textAlign="center">
        Discover a hassle-free way to find your perfect living space.
      </Text>

      <Box
        w="100vw"
        mt={50}
        minH="400px"
        bgImage="url('https://firebasestorage.googleapis.com/v0/b/test-2ac5c.appspot.com/o/%E2%80%94Pngtree%E2%80%94real%20estate%20commercial%20real%20estate_1131973.jpg?alt=media&token=56696042-ee9b-4382-a6b6-08dc4f05d711')"
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        _after={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          bgGradient: `linear(to-t, ${bgColor}, transparent)`,
        }}
      ></Box>

      {/* What is Dormitory Section */}
      <Box
        as="section"
        w="100%"
        maxWidth={1200}
        py={{ base: 20, md: 40 }}
        px={4}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          alignItems="center"
          justify="space-evenly"
        >
          <Box
            flex="1"
            textAlign={{ base: "center", md: "left" }}
            mb={{ base: 8, md: 0 }}
            pr={{ base: 0, md: 4 }}
          >
            <Heading as="h1" size="3xl" mb={4}>
              What is Dormitory?
            </Heading>
            <Text fontSize="lg" mb={8}>
              An all-in-one web and app platform designed to help students and
              young professionals effortlessly find and secure their ideal
              dormitory or apartment.
            </Text>
            <LightMode>
              <Button colorScheme="primary" variant="solid" size="lg">
                Learn More
              </Button>
            </LightMode>
          </Box>
          <Box flex="1" textAlign="center">
            <Image
              src={person}
              alt="Living Space"
              borderRadius="md"
              maxW="100%"
              h="600px"
              objectFit="cover"
            />
          </Box>
        </Flex>
      </Box>

      {/* Mission Section */}
      <Box
        position="relative"
        width="100%"
        bg="#0084FF"
        py={16}
        textAlign="center"
        color="white"
      >
        <Heading as="h2" size="xl" mb={4}>
          OUR MISSION
        </Heading>
        <Text fontSize="lg" mb={4}>
          Make renting better, for everyone
        </Text>
        <Text fontSize="md" mb={4}>
          We&apos;re revolutionizing the way people rent, by paving the path
          towards a tech-enabled rental ecosystem for all.
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          Explore our initiatives below 👇
        </Text>
      </Box>

      {/* Card Grid Section */}
      <Box display="flex" justifyContent="center" py={12} w="full">
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          }}
          gap={6}
          maxW="800px"
          w="full"
        >
          {cardData.map((card) => (
            <GridItem key={card.id}>
              <Box
                p={4}
                borderWidth={1}
                borderRadius="md"
                bg="white"
                boxShadow="lg"
                transition="transform 0.3s ease"
                _hover={{ transform: "scale(1.05)" }}
              >
                <Image
                  h={200}
                  w="100%"
                  objectFit="cover"
                  src={card.image}
                  alt={card.title}
                  borderRadius="md"
                  mb={4}
                />
                <Heading as="h3" size="md" mb={2}>
                  {card.title}
                </Heading>
                <Text fontSize="sm">{card.description}</Text>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </Box>

      {/* Team Section */}
      <Box w="full" py={10} bg={bgColor}>
        <Heading as="h2" size="xl" mb={8} textAlign="center">
          Meet Our Team
        </Heading>
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          }}
          gap={6}
          maxW="1200px"
          mx="auto"
          px={4}
        >
          {teamMembers.map((member) => (
            <Box key={member.id} textAlign="center">
              <Image
                src={member.image}
                alt={member.name}
                borderRadius="full"
                boxSize="150px"
                mb={4}
                mx="auto"
              />
              <Text fontWeight="bold">{member.name}</Text>
              <Text>{member.role}</Text>
            </Box>
          ))}
        </Grid>
      </Box>
    </Flex>
  );
}
