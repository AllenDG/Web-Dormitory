import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

/**
 * Popular Locations Section v3.0
 * City pill buttons that link to pre-filtered search results
 */

const locations = [
  {
    name: 'Dagupan',
    count: 45,
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&q=80',
  },
  {
    name: 'Mangaldan',
    count: 23,
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&q=80',
  },
  {
    name: 'Manaoag',
    count: 18,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80',
  },
  {
    name: 'Urdaneta',
    count: 31,
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80',
  },
];

const LocationCard = ({ location }) => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box
      bg={cardBg}
      borderRadius="lg"
      overflow="hidden"
      border="1px"
      borderColor="gray.200"
      _dark={{ borderColor: 'gray.700' }}
      cursor="pointer"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
      }}
      onClick={() => navigate(`/find-rentals?city=${location.name}`)}
    >
      <Box position="relative" h="200px">
        <Image
          src={location.image}
          alt={location.name}
          w="full"
          h="full"
          objectFit="cover"
        />
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          bg="linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
          p={4}
        >
          <VStack align="start" spacing={0}>
            <Heading fontSize="lg" fontWeight="semibold" color="white">
              {location.name}
            </Heading>
            <Text fontSize="sm" color="whiteAlpha.900">
              {location.count} properties
            </Text>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

const PopularLocations = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box bg={bgColor} py={{ base: 8, md: 12 }}>
      <Container maxW="1200px">
        <VStack spacing={8}>
          {/* Section Header */}
          <VStack spacing={1} textAlign="center" maxW="700px">
            <Heading
              as="h2"
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="semibold"
            >
              Popular Locations
            </Heading>
            <Text
              fontSize="sm"
              color="gray.600"
              _dark={{ color: 'gray.400' }}
            >
              Explore properties in sought-after areas
            </Text>
          </VStack>

          {/* Location Cards Grid */}
          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 4 }}
            spacing={4}
            w="full"
          >
            {locations.map((location) => (
              <LocationCard key={location.name} location={location} />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default PopularLocations;
