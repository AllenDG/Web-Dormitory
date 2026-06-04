import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSearch, FiHome } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

/**
 * CTA Section v3.0
 * Dual CTA: Search Rentals + Post My Listing
 */
const CTASection = () => {
  const navigate = useNavigate();
  const bgGradient = useColorModeValue(
    'linear(to-r, primary.600, primary.700)',
    'linear(to-r, primary.700, primary.800)'
  );

  return (
    <Box
      bgGradient={bgGradient}
      py={{ base: 12, md: 16 }}
      position="relative"
      overflow="hidden"
    >
      {/* Background Pattern */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.1"
        bgImage="radial-gradient(circle, white 1px, transparent 1px)"
        bgSize="24px 24px"
        pointerEvents="none"
      />

      <Container maxW="1200px" position="relative">
        <VStack spacing={6} textAlign="center">
          <VStack spacing={3} maxW="700px">
            <Heading
              as="h2"
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="semibold"
              color="white"
            >
              Ready to Find Your Next Home?
            </Heading>
            <Text
              fontSize="md"
              color="whiteAlpha.900"
            >
              Join thousands of students
            </Text>
          </VStack>

          <HStack spacing={3} flexWrap="wrap" justify="center">
            <Button
              leftIcon={<Icon as={FiSearch} />}
              size="md"
              bg="white"
              color="primary.600"
              _hover={{
                bg: 'whiteAlpha.900',
                transform: 'translateY(-1px)',
                boxShadow: 'lg',
              }}
              onClick={() => navigate('/find-rentals')}
            >
              Search Rentals
            </Button>
            <Button
              leftIcon={<Icon as={FiHome} />}
              size="md"
              variant="outline"
              borderColor="white"
              color="white"
              _hover={{
                bg: 'whiteAlpha.200',
                transform: 'translateY(-1px)',
              }}
              onClick={() => navigate('/owner/dashboard')}
            >
              Post My Listing
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default CTASection;
