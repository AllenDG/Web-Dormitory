import { Box, Heading, Text, SimpleGrid, HStack, Icon, Badge } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import PropertyCard from '../../../shared/components/PropertyCard';
import useRecommendationStore from '../../../shared/stores/useRecommendationStore';
import useRentalStore from '../../../shared/stores/useRentalStore';

/**
 * New Listings Component
 * Displays recently added properties
 * 
 * @component
 * @param {Object} props
 * @param {number} props.limit - Maximum number of properties to show
 * @param {boolean} props.showHeader - Whether to show the section header
 */
const NewListings = ({ limit = 6, showHeader = true }) => {
  const { getNewListings } = useRecommendationStore();
  const { rentals } = useRentalStore();
  const [newProperties, setNewProperties] = useState([]);

  useEffect(() => {
    const listings = getNewListings(rentals, limit);
    setNewProperties(listings);
  }, [rentals, limit, getNewListings]);

  if (newProperties.length === 0) {
    return null;
  }

  return (
    <Box>
      {showHeader && (
        <Box mb={6}>
          <HStack spacing={2} mb={2}>
            <Icon as={FaStar} color="purple.500" boxSize={5} />
            <Heading size="lg">New Listings</Heading>
            <Badge colorScheme="purple" fontSize="sm">
              Fresh
            </Badge>
          </HStack>
          <Text color="gray.600">
            Recently added properties you might like
          </Text>
        </Box>
      )}

      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {newProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default NewListings;
