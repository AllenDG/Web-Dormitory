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
} from "@chakra-ui/react";
import banner from "../assets/banner.png";
import person from "../assets/person.png";

export default function AboutUsPage() {
  const bgColor = useColorModeValue("#F4F4F4", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.300");

  const cardData = [
    {
      id: 1,
      image: banner,
      title: "Seamless User Experience",
      description:
        "Designed with simplicity in mind, our platform ensures that finding your perfect rental space is a hassle-free journey.",
    },
    {
      id: 2,
      image:
        "https://static.wixstatic.com/media/ea71bb_688298c755fc420abee57b56d06031b8~mv2.png/v1/fill/w_850,h_1049,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/ea71bb_688298c755fc420abee57b56d06031b8~mv2.png",
      title: "Diverse Listings at Your Fingertips",
      description:
        "Explore an extensive range of listings tailored to your needs, complete with detailed descriptions and essential amenities.",
    },
    {
      id: 3,
      image:
        "https://static.wixstatic.com/media/ea71bb_688298c755fc420abee57b56d06031b8~mv2.png/v1/fill/w_850,h_1049,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/ea71bb_688298c755fc420abee57b56d06031b8~mv2.png",
      title: "Peace of Mind with Secure Transactions",
      description:
        "We prioritize your security, ensuring that every transaction is protected for the safety of both renters and property owners.",
    },
  ];

  const teamMembers = [
    {
      id: 1,
      name: "CLAVERIA, JEDYNE B.",
      role: "Researcher",
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
      role: "Researcher",
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
      <Text fontSize="lg" color={textColor} mb={12} textAlign="center">
        Discover a hassle-free way to find your perfect living space.
      </Text>

      {/* Banner Section */}
      <Box
        mb={12}
        w="full"
        h={400}
        borderRadius="md"
        overflow="hidden"
        position="relative"
      >
        <Image
          src={banner}
          alt="Banner Image"
          objectFit="cover"
          w="100%"
          h="100%"
        />
      </Box>

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
            <Heading as="h1" size="3xl" mb={4} color={textColor}>
              What is Dormitory?
            </Heading>
            <Text fontSize="lg" color={textColor} mb={8}>
              An all-in-one web and app platform designed to help students and
              young professionals effortlessly find and secure their ideal
              dormitory or apartment.
            </Text>
            <Button colorScheme="blue" variant="solid" size="lg">
              Learn More
            </Button>
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
          We&apos;re revolutionizing the way people rent, by paving the path towards
          a tech-enabled rental ecosystem for all.
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
                bg={bgColor}
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
                <Heading as="h3" size="md" mb={2} color={textColor}>
                  {card.title}
                </Heading>
                <Text color={textColor} fontSize="sm">
                  {card.description}
                </Text>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </Box>

      {/* Team Section */}
      <Box w="full" py={10} bg={bgColor}>
        <Heading as="h2" size="xl" mb={8} color={textColor} textAlign="center">
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
              <Text fontWeight="bold" color={textColor}>
                {member.name}
              </Text>
              <Text color={textColor}>{member.role}</Text>
            </Box>
          ))}
        </Grid>
      </Box>
    </Flex>
  );
}
