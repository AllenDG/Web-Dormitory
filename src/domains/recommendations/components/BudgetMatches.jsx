import { Box, Heading, Text, SimpleGrid, HStack, Icon, Badge } from '@chakra-ui/react';
import { FaMoneyBillWave } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import PropertyCard from '../../../shared/components/PropertyCard';
import useRecommendationStore from '../../../shared/stores/useRecommendationStore';
import useRentalStore from '../../../shared/stores/useRentalStore';

/**
 * Budget Matches Component
 * Displays properties that match user's budget
 * 
 * @component
 * @param {Object} props
 * @param {number} props.limit - Maximum number of properties to show
 * @param {boolean} props.showHeader - Whether to show the section header
 */
const BudgetMatches = ({ limit = 6, showHeader = true }) => {
  const { getBudgetMatches, userPreferences } = useRecommendationStore();
  const { rentals } = useRentalStore();
  const [budgetProperties, setBudgetProperties] = useState([]);

  useEffect(() => {
    const matches = getBudgetMatches(rentals, limit);
    setBudgetProperties(matches);
  }, [rentals, limit, getBudgetMatches]);

  if (budgetProperties.length === 0 || !userPreferences.hasCompletedWizard) {
    return null;
  }

  return (
    <Box>
      {showHeader && (
        <Box mb={6}>
          <HStack spacing={2} mb={2}>
            <Icon as={FaMoneyBillWave} color="green.500" boxSize={5} />
            <Heading size="lg">Within Your Budget</Heading>
            <Badge colorScheme="green" fontSize="sm">
              ₱{userPreferences.budgetMin.toLocaleString()} - ₱{userPreferences.budgetMax.toLocaleString()}
            </Badge>
          </HStack>
          <Text color="gray.600">
            Properties that fit your budget perfectly
          </Text>
        </Box>
      )}

      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {budgetProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default BudgetMatches;
