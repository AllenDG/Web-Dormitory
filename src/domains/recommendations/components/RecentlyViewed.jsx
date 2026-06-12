import { Box, Heading, Text, SimpleGrid, HStack, Icon, Button } from '@chakra-ui/react';
import { FaClock, FaTrash } from 'react-icons/fa';
import PropertyCard from '../../../shared/components/PropertyCard';
import useRecommendationStore from '../../../shared/stores/useRecommendationStore';

/**
 * Recently Viewed Component
 * Displays properties the user has recently viewed
 * 
 * @component
 * @param {Object} props
 * @param {number} props.limit - Maximum number of properties to show
 * @param {boolean} props.showHeader - Whether to show the section header
 * @param {boolean} props.showClearButton - Whether to show the clear history button
 */
const RecentlyViewed = ({ limit = 6, showHeader = true, showClearButton = false }) => {
  const { getRecentlyViewed, clearViewingHistory } = useRecommendationStore();
  const recentlyViewed = getRecentlyViewed(limit);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your viewing history?')) {
      clearViewingHistory();
    }
  };

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <Box>
      {showHeader && (
        <Box mb={6}>
          <HStack justify="space-between" align="center" mb={2}>
            <HStack spacing={2}>
              <Icon as={FaClock} color="blue.500" boxSize={5} />
              <Heading size="lg">Recently Viewed</Heading>
            </HStack>
            {showClearButton && (
              <Button
                variant="ghost"
                colorScheme="red"
                size="sm"
                leftIcon={<FaTrash />}
                onClick={handleClearHistory}
              >
                Clear History
              </Button>
            )}
          </HStack>
          <Text color="gray.600">
            Properties you've recently checked out
          </Text>
        </Box>
      )}

      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {recentlyViewed.map((property) => (
          <PropertyCard 
            key={property.id} 
            property={property}
            isFavorite={false}
            onToggleFavorite={() => {}}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default RecentlyViewed;
