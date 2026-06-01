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
 * Floating Compare Button Component
 * Shows comparison count and navigates to comparison page
 * Only visible when properties are in comparison
 */
const CompareFloatingButton = () => {
  const navigate = useNavigate();
  const compareCount = useCompareStore((state) => state.getCompareCount());
  const hasProperties = useCompareStore((state) => state.hasProperties());

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
          _hover={{ bg: hoverBg, transform: 'translateY(-2px)' }}
          _active={{ transform: 'translateY(0)' }}
          onClick={handleClick}
          borderRadius="md"
          boxShadow="lg"
          leftIcon={<Icon as={FiBarChart2} boxSize={5} />}
          transition="all 0.3s"
          pointerEvents="auto"
          position="relative"
        >
          <HStack spacing={2}>
            <Text fontWeight="600">Compare Properties</Text>
            <Badge
              bg="white"
              color={bgColor}
              borderRadius="full"
              px={2}
              py={0.5}
              fontSize="sm"
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
