import { Box, Heading, Text, SimpleGrid, HStack, Icon } from '@chakra-ui/react';
import { FaLayerGroup } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import PropertyCard from '../../../shared/components/PropertyCard';
import useRecommendationStore from '../../../shared/stores/useRecommendationStore';
import useRentalStore from '../../../shared/stores/useRentalStore';

/**
 * Similar Properties Component
 * Displays properties similar to a reference property
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.referenceProperty - The property to find similar properties for
 * @param {number} props.limit - Maximum number of similar properties to show
 * @param {boolean} props.showHeader - Whether to show the section header
 */
const SimilarProperties = ({ referenceProperty, limit = 6, showHeader = true }) => {
  const { getSimilarProperties, similarProperties } = useRecommendationStore();
  const { rentals } = useRentalStore();
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    if (referenceProperty) {
      // Check if we have cached similar properties
      const cached = similarProperties[referenceProperty.id];
      if (cached && cached.length > 0) {
        setSimilar(cached.slice(0, limit));
      } else {
        // Generate similar properties
        const generated = getSimilarProperties(referenceProperty, rentals, limit);
        setSimilar(generated);
      }
    }
  }, [referenceProperty, rentals, limit, getSimilarProperties, similarProperties]);

  if (!referenceProperty || similar.length === 0) {
    return null;
  }

  return (
    <Box>
      {showHeader && (
        <Box mb={6}>
          <HStack spacing={2} mb={2}>
            <Icon as={FaLayerGroup} color="blue.500" boxSize={5} />
            <Heading size="lg">Similar Properties</Heading>
          </HStack>
          <Text color="gray.600">
            Properties similar to {referenceProperty.title}
          </Text>
        </Box>
      )}

      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {similar.map((property) => (
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

export default SimilarProperties;
