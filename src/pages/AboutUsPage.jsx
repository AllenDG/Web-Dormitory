import {
  Flex,
  Box,
  Text,
  Heading,
  useColorModeValue,
  Image,
  Grid,
  GridItem,

} from "@chakra-ui/react";
import banner from "../assets/banner.png";
import person from "../assets/person.png";


export default function AboutUsPage() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");
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
      <Heading as="h1" size="3xl" mb={4} mt={50} color={textColor}>
        SECURE YOUR SPACE
      </Heading>
      <Text fontSize="lg" color={textColor} mb={12} textAlign="center">
        Discover a hassle-free way to find your perfect living space.
      </Text>
      {/* Banner Section */}
      {/* Banner Section */}
      <Box
        mb={12}
        width="100vw" // Full width of the viewport
        height={400}
        bg="gray.300"
        borderRadius="md" // Border radius on the Box, not the image
        overflow="hidden" // Ensure the image doesn't overflow the container
        position="relative"
        mx={0} // No left or right margin
      >
        <Image
          src={banner} // Placeholder banner image
          alt="Banner Image"
          objectFit="fill" // Forces the image to stretch and fit the container
          width="100%"
          height="100%"
        />
      </Box>

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
          justifyContent="space-evenly"
        >
          <Box
            flex="1"
            textAlign={{ base: "center", md: "left" }}
            mb={{ base: 8, md: 0 }}
            pr={{ base: 0, md: 4 }} // Right padding for larger screens
          >
            <Heading as="h1" size="3xl" mb={4} color={textColor}>
              What is Dormitory?
            </Heading>
            <Text fontSize="lg" color={textColor} mb={8}>
              An all-in-one web and app platform designed to help students and
              young professionals effortlessly find and secure their ideal
              dormitory or apartment.
            </Text>
           
          </Box>

          {/* Right Side - Image */}
          <Box flex="1" textAlign="center">
            <Image
              src={person} // Replace with your own image URL
              alt="Living Space"
              borderRadius="md"
              maxW="100%"
              height="600px" // Increased height for a larger image
              objectFit="cover" // Ensure the image covers the entire box
            />
          </Box>
        </Flex>
      </Box>
      {/* What is Dormy Section */}
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={6}
        mb={12}
        maxW="1200px"
        width="100%"
      >
        {cardData.map((card) => (
          <GridItem key={card.id}>
            <Box
              h="100%"
              p={4}
              borderWidth={1}
              borderRadius="md"
              bg={bgColor}
              boxShadow="md"
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.05)" }} // Scale up on hover
            >
              <Image
                h={300}
                w="100%"
                objectFit="cover"
                src={card.image}
                alt={card.title}
                borderRadius="md"
                mb={4}
                transition="transform 0.3s ease"
                _hover={{ transform: "scale(1.1)" }} // Image zoom on hover
              />
              <Heading as="h3" size="md" mb={2} color={textColor}>
                {card.title}
              </Heading>
              <Text color={textColor}>{card.description}</Text>
            </Box>
          </GridItem>
        ))}
      </Grid>
    </Flex>
  );
}
