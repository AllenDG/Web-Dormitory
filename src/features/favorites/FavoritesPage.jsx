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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiUsers, FiHeart, FiTrash2 } from 'react-icons/fi';
import { Card, Button, PageContainer } from '../../shared/components';
import { TYPOGRAPHY, LAYOUT } from '../../shared/styles/layoutConstants';
import useRentalStore from '../../shared/stores/useRentalStore';

/**
 * Favorites Page - With Standardized Layout
 * Follows layout constants and typography scale
 */
const FavoritesPage = () => {
  const navigate = useNavigate();
  const { getFavoriteRentals, toggleFavorite } = useRentalStore();
  const favoriteRentals = getFavoriteRentals();

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
      <Box bg="gray.50" py={12}>
        <PageContainer>
          <VStack spacing={4}>
            <Icon as={FiHeart} boxSize={12} color="red.500" />
            <Heading fontSize={TYPOGRAPHY.h1}>
              My Favorites
            </Heading>
            <Text color="gray.600" fontSize={TYPOGRAPHY.body.regular}>
              {favoriteRentals.length} saved{' '}
              {favoriteRentals.length === 1 ? 'property' : 'properties'}
            </Text>
          </VStack>
        </PageContainer>
      </Box>

      {/* Content */}
      <Box py={LAYOUT.sectionSpacing}>
        <PageContainer>
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
                    <Heading fontSize={TYPOGRAPHY.h4} noOfLines={1}>
                      {rental.title}
                    </Heading>

                    <HStack
                      spacing={2}
                      color="gray.600"
                    >
                      <Icon as={FiMapPin} />
                      <Text fontSize={TYPOGRAPHY.body.small} noOfLines={1}>
                        {rental.city}
                      </Text>
                    </HStack>

                    <HStack spacing={4}>
                      <HStack spacing={1}>
                        <Icon as={FiUsers} color="gray.500" />
                        <Text
                          fontSize={TYPOGRAPHY.body.small}
                          color="gray.600"
                        >
                          {rental.availablePerson} persons
                        </Text>
                      </HStack>
                      <Badge colorScheme="blue">{rental.bedType}</Badge>
                    </HStack>

                    <Text
                      fontSize={TYPOGRAPHY.body.small}
                      color="gray.600"
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
                  <Heading fontSize={TYPOGRAPHY.h3} color="gray.600">
                    No Favorites Yet
                  </Heading>
                  <Text color="gray.500" maxW="md" fontSize={TYPOGRAPHY.body.regular}>
                    Start exploring properties and save your favorites by clicking
                    the heart icon.
                  </Text>
                </VStack>
                <Button
                  onClick={() => navigate('/find-rentals')}
                  colorScheme="primary"
                  size="lg"
                  fontSize={TYPOGRAPHY.button}
                >
                  Browse Properties
                </Button>
              </VStack>
            </Card>
          )}
        </PageContainer>
      </Box>
    </Box>
  );
};

export default FavoritesPage;
