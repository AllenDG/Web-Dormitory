import {
  VStack,
  Icon,
  Heading,
  Text,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiBarChart2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

/**
 * Empty State Component for Compare Page
 * Shown when no properties are in comparison
 */
const CompareEmptyState = () => {
  const navigate = useNavigate();
  const iconColor = useColorModeValue('gray.300', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <VStack
      spacing={6}
      py={20}
      px={4}
      textAlign="center"
      maxW="500px"
      mx="auto"
    >
      {/* Icon */}
      <Icon
        as={FiBarChart2}
        boxSize={20}
        color={iconColor}
      />

      {/* Heading */}
      <Heading
        size="lg"
        color="gray.900"
        _dark={{ color: 'white' }}
      >
        No Properties to Compare
      </Heading>

      {/* Description */}
      <Text
        fontSize="md"
        color={textColor}
        maxW="400px"
      >
        Add properties from search results to compare them side-by-side and find your perfect home.
      </Text>

      {/* CTA Button */}
      <Button
        colorScheme="primary"
        size="lg"
        onClick={() => navigate('/find-rentals')}
        borderRadius="md"
        mt={4}
      >
        Browse Properties
      </Button>
    </VStack>
  );
};

export default CompareEmptyState;
