import {
  Button,
  Icon,
  Badge,
  HStack,
  Text,
  useColorModeValue,
  Slide,
} from '@chakra-ui/react';
import { FiBarChart2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useCompareStore from '../../../shared/stores/useCompareStore';

/**
 * Floating Compare Button Component v2.0
 * Shows comparison count and navigates to comparison page
 * Only visible when properties are in comparison
 * Enhanced visibility and UX with pulsing animation
 */
const CompareFloatingButton = () => {
  const navigate = useNavigate();
  const compareList = useCompareStore((state) => state.compareList);
  
  // Derive values from compareList
  const compareCount = compareList.length;
  const hasProperties = compareList.length > 0;

  const bgColor = useColorModeValue('primary.600', 'primary.500');
  const hoverBg = useColorModeValue('primary.700', 'primary.600');

  const handleClick = () => {
    navigate('/compare');
  };

  return (
    <Slide
      direction="bottom"
      in={hasProperties}
      style={{ zIndex: 1000 }}
    >
      <HStack
        justify="center"
        pb={{ base: 4, md: 6 }}
        px={4}
        pointerEvents="none"
      >
        <Button
          size="lg"
          bg={bgColor}
          color="white"
          _hover={{ bg: hoverBg, transform: 'translateY(-4px)', boxShadow: 'xl' }}
          _active={{ transform: 'translateY(0)' }}
          onClick={handleClick}
          borderRadius="full"
          boxShadow="xl"
          leftIcon={<Icon as={FiBarChart2} boxSize={5} />}
          transition="all 0.3s"
          pointerEvents="auto"
          position="relative"
          px={8}
          py={6}
          animation={compareCount >= 2 ? 'pulse 2s infinite' : 'none'}
          sx={{
            '@keyframes pulse': {
              '0%, 100%': {
                boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
              },
              '50%': {
                boxShadow: '0 10px 35px rgba(37, 99, 235, 0.5)',
              },
            },
          }}
        >
          <HStack spacing={3}>
            <Text fontWeight="700" fontSize="md">
              {compareCount >= 2 ? 'Compare Now' : 'Add Properties to Compare'}
            </Text>
            <Badge
              bg="white"
              color={bgColor}
              borderRadius="full"
              px={3}
              py={1}
              fontSize="md"
              fontWeight="700"
            >
              {compareCount}
            </Badge>
          </HStack>
        </Button>
      </HStack>
    </Slide>
  );
};

export default CompareFloatingButton;
