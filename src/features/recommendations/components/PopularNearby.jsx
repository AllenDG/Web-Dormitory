import { Box, Heading, Text, SimpleGrid, HStack, Icon } from '@chakra-ui/react';
import { FaFire } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import PropertyCard from '../../../shared/components/PropertyCard';
import useRecommendationStore from '../../../shared/stores/useRecommendationStore';
import useRentalStore from '../../../shared/stores/useRentalStore';

/**
 * Popular Nearby Component
 * Displays popular properties near user's preferred locations
 * 
 * @component
 * @param {Object} props
 * @param {number} props.limit - Maximum number of properties to show
 * @param {boolean} props.showHeader - Whether to show the section header
 */
const PopularNearby = ({ limit = 6, showHeader = true }) => {
  const { getPopularNearby, userPreferences } = useRecommendationStore();
  const { rentals } = useRentalStore();
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    const popularProperties = getPopularNearby(rentals, limit);
    setPopular(popularProperties);
  }, [rentals, limit, getPopularNearby]);

  if (popular.length === 0) {
    return null;
  }

  const locationText = userPreferences.preferredLocations.length > 0
    ? `in ${userPreferences.preferredLocations.slice(0, 2).join(', ')}`
    : 'with high ratings';

  return (
    <Box>
      {showHeader && (
        <Box mb={6}>
          <HStack spacing={2} mb={2}>
            <Icon as={FaFire} color="orange.500" boxSize={5} />
            <Heading size="lg">Popular Nearby</Heading>
          </HStack>
          <Text color="gray.600">
            Highly rated properties {locationText}
          </Text>
        </Box>
      )}

      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {popular.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default PopularNearby;
