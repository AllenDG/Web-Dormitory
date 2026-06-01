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
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import { FiMapPin, FiUsers, FiZap } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card } from '../../../shared/components';
import { recommenderService } from '../../../services/ai';
import useRentalStore from '../../../shared/stores/useRentalStore';

/**
 * Recommended Section
 * AI-powered personalized property recommendations
 */
const RecommendedSection = () => {
  const navigate = useNavigate();
  const { rentals } = useRentalStore();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();

    // Listen for preference updates
    const handlePreferencesUpdate = () => {
      loadRecommendations();
    };

    window.addEventListener('preferencesUpdated', handlePreferencesUpdate);

    return () => {
      window.removeEventListener('preferencesUpdated', handlePreferencesUpdate);
    };
  }, [rentals]);

  const loadRecommendations = async () => {
    if (!rentals || rentals.length === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      // Get user profile from localStorage or use defaults
      const userProfile = getUserProfile();

      // Get recommendations
      const recs = await recommenderService.getRecommendations(
        userProfile,
        rentals,
        6
      );

      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      // Fallback to featured properties
      const featured = recommenderService.getFeaturedForNewUsers(rentals, 6);
      setRecommendations(featured);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserProfile = () => {
    // Try to get user preferences from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        return JSON.parse(savedProfile);
      } catch (e) {
        console.error('Failed to parse user profile:', e);
      }
    }

    // Default profile for new users
    return {
      budget: { min: 5000, max: 15000 },
      preferredLocations: ['Quezon City', 'Manila', 'Makati'],
      requiredAmenities: ['wifi', 'aircon'],
      propertyType: 'apartment',
      recentSearches: [],
      favoriteCount: 0,
    };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!isLoading && recommendations.length === 0) {
    return null;
  }

  return (
    <Box py={{ base: 8, md: 12 }}>
      <VStack spacing={6} align="stretch">
        {/* Section Header */}
        <VStack spacing={1} align="start">
          <HStack>
            <Icon as={FiZap} color="purple.500" boxSize={5} />
            <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight="semibold">
              Recommended For You
            </Heading>
          </HStack>
          <Text color="gray.600" fontSize="sm">
            AI-powered suggestions based on your preferences
          </Text>
        </VStack>

        {/* Recommendations Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {isLoading
            ? // Loading skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} padding={0} overflow="hidden">
                  <Skeleton height="200px" />
                  <VStack align="start" spacing={3} p={5}>
                    <SkeletonText noOfLines={2} spacing={2} width="100%" />
                    <SkeletonText noOfLines={1} spacing={2} width="60%" />
                  </VStack>
                </Card>
              ))
            : // Actual recommendations
              recommendations.map(({ property, score, reasons }) => (
                <Card
                  key={property.id}
                  hover
                  padding={0}
                  overflow="hidden"
                  cursor="pointer"
                  onClick={() => navigate(`/listing/${property.id}`)}
                  position="relative"
                >
                  {/* AI Badge */}
                  <Badge
                    position="absolute"
                    top={3}
                    left={3}
                    colorScheme="purple"
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="full"
                    zIndex={1}
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Icon as={FiZap} boxSize={3} />
                    {score}% Match
                  </Badge>

                  {/* Image */}
                  <Box position="relative" overflow="hidden" h="200px">
                    <Image
                      src={property.imageUrl[0]}
                      alt={property.title}
                      w="full"
                      h="full"
                      objectFit="cover"
                      transition="transform 0.3s"
                      _hover={{ transform: 'scale(1.1)' }}
                    />
                    {/* Price Badge */}
                    <Badge
                      position="absolute"
                      bottom={3}
                      right={3}
                      colorScheme="green"
                      fontSize="md"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {formatPrice(property.price)}/mo
                    </Badge>
                  </Box>

                  {/* Content */}
                  <VStack align="start" spacing={2} p={4}>
                    <Heading as="h3" fontSize="lg" fontWeight="semibold" noOfLines={1}>
                      {property.title}
                    </Heading>

                    <HStack spacing={2} color="gray.600">
                      <Icon as={FiMapPin} />
                      <Text fontSize="sm" noOfLines={1}>
                        {property.city}
                      </Text>
                    </HStack>

                    <HStack spacing={4}>
                      <HStack spacing={1}>
                        <Icon as={FiUsers} color="gray.500" />
                        <Text fontSize="sm" color="gray.600">
                          {property.availablePerson} persons
                        </Text>
                      </HStack>
                      <Badge colorScheme="blue">{property.bedType}</Badge>
                    </HStack>

                    {/* AI Reasons */}
                    {reasons && reasons.length > 0 && (
                      <VStack align="start" spacing={1} w="full">
                        <Text fontSize="xs" fontWeight="semibold" color="purple.600">
                          Why we recommend this:
                        </Text>
                        {reasons.slice(0, 2).map((reason, idx) => (
                          <Text key={idx} fontSize="xs" color="gray.600" noOfLines={1}>
                            • {reason}
                          </Text>
                        ))}
                      </VStack>
                    )}
                  </VStack>
                </Card>
              ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default RecommendedSection;
