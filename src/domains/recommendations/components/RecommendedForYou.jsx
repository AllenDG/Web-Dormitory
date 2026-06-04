import { Box, Heading, Text, SimpleGrid, Button, HStack, Icon, Spinner, Center } from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa';
import { FaWandMagicSparkles } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PropertyCard from '../../../shared/components/PropertyCard';
import useRecommendationStore from '../../../shared/stores/useRecommendationStore';
import useRentalStore from '../../../shared/stores/useRentalStore';

/**
 * Recommended For You Component
 * Displays personalized property recommendations based on user preferences
 * 
 * @component
 * @param {Object} props
 * @param {number} props.limit - Maximum number of recommendations to show
 * @param {boolean} props.showHeader - Whether to show the section header
 */
const RecommendedForYou = ({ limit = 6, showHeader = true }) => {
  const navigate = useNavigate();
  const { recommendations, generateRecommendations, userPreferences } = useRecommendationStore();
  const { rentals } = useRentalStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate recommendations when component mounts
    const timer = setTimeout(() => {
      generateRecommendations(rentals);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [rentals, generateRecommendations]);

  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size="lg" color="blue.500" />
      </Center>
    );
  }

  if (!userPreferences.hasCompletedWizard) {
    return null; // Don't show if user hasn't set preferences
  }

  const displayedRecommendations = recommendations.slice(0, limit);

  if (displayedRecommendations.length === 0) {
    return null;
  }

  return (
    <Box>
      {showHeader && (
        <Box mb={6}>
          <HStack justify="space-between" align="center" mb={2}>
            <HStack spacing={2}>
              <Icon as={FaWandMagicSparkles} color="blue.500" boxSize={6} />
              <Heading size="lg">Recommended For You</Heading>
            </HStack>
            {recommendations.length > limit && (
              <Button
                variant="ghost"
                colorScheme="blue"
                rightIcon={<FaArrowRight />}
                onClick={() => navigate('/rentals')}
                size="sm"
              >
                View All
              </Button>
            )}
          </HStack>
          <Text color="gray.600">
            Based on your preferences and browsing history
          </Text>
        </Box>
      )}

      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {displayedRecommendations.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default RecommendedForYou;
