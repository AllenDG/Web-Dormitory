import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Image,
  Badge,
  Icon,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiUsers, FiHeart, FiTrash2 } from 'react-icons/fi';
import { Section, Card, Container, Button } from '../../shared/components';
import useRentalStore from '../../shared/stores/useRentalStore';

/**
 * Favorites Page - Display saved properties
 */
const FavoritesPage = () => {
  const navigate = useNavigate();
  const { getFavoriteRentals, toggleFavorite } = useRentalStore();
  const favoriteRentals = getFavoriteRentals();

  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Box>
      {/* Header */}
      <Section bg={bgColor} py={12}>
        <Container>
          <VStack spacing={4}>
            <Icon as={FiHeart} boxSize={12} color="red.500" />
            <Heading as="h1" fontSize={{ base: '3xl', md: '4xl' }}>
              My Favorites
            </Heading>
            <Text color="gray.600" _dark={{ color: 'gray.400' }}>
              {favoriteRentals.length} saved{' '}
              {favoriteRentals.length === 1 ? 'property' : 'properties'}
            </Text>
          </VStack>
        </Container>
      </Section>

      {/* Content */}
      <Section>
        <Container>
          {favoriteRentals.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {favoriteRentals.map((rental) => (
                <Card
                  key={rental.id}
                  hover
                  padding={0}
                  overflow="hidden"
                  cursor="pointer"
                  onClick={() => navigate(`/listing/${rental.id}`)}
                >
                  {/* Image */}
                  <Box position="relative" overflow="hidden" h="200px">
                    <Image
                      src={rental.imageUrl[0]}
                      alt={rental.title}
                      w="full"
                      h="full"
                      objectFit="cover"
                      transition="transform 0.3s"
                      _hover={{ transform: 'scale(1.1)' }}
                    />
                    {/* Remove Button */}
                    <IconButton
                      icon={<FiTrash2 />}
                      position="absolute"
                      top={3}
                      right={3}
                      size="sm"
                      borderRadius="full"
                      bg="red.500"
                      color="white"
                      _hover={{ bg: 'red.600' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(rental.id);
                      }}
                      aria-label="Remove from favorites"
                    />
                    {/* Price Badge */}
                    <Badge
                      position="absolute"
                      bottom={3}
                      left={3}
                      colorScheme="green"
                      fontSize="md"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {formatPrice(rental.price)}/mo
                    </Badge>
                  </Box>

                  {/* Content */}
                  <VStack align="start" spacing={3} p={5}>
                    <Heading as="h3" size="md" noOfLines={1}>
                      {rental.title}
                    </Heading>

                    <HStack
                      spacing={2}
                      color="gray.600"
                      _dark={{ color: 'gray.400' }}
                    >
                      <Icon as={FiMapPin} />
                      <Text fontSize="sm" noOfLines={1}>
                        {rental.city}
                      </Text>
                    </HStack>

                    <HStack spacing={4}>
                      <HStack spacing={1}>
                        <Icon as={FiUsers} color="gray.500" />
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          _dark={{ color: 'gray.400' }}
                        >
                          {rental.availablePerson} persons
                        </Text>
                      </HStack>
                      <Badge colorScheme="blue">{rental.bedType}</Badge>
                    </HStack>

                    <Text
                      fontSize="sm"
                      color="gray.600"
                      _dark={{ color: 'gray.400' }}
                      noOfLines={2}
                    >
                      {rental.description}
                    </Text>
                  </VStack>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <Card padding={12} textAlign="center">
              <VStack spacing={6}>
                <Icon as={FiHeart} boxSize={16} color="gray.400" />
                <VStack spacing={2}>
                  <Heading size="lg" color="gray.600">
                    No Favorites Yet
                  </Heading>
                  <Text color="gray.500" maxW="md">
                    Start exploring properties and save your favorites by clicking
                    the heart icon.
                  </Text>
                </VStack>
                <Button
                  onClick={() => navigate('/find-rentals')}
                  colorScheme="primary"
                  size="lg"
                >
                  Browse Properties
                </Button>
              </VStack>
            </Card>
          )}
        </Container>
      </Section>
    </Box>
  );
};

export default FavoritesPage;
