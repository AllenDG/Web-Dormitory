import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiShield, FiMap, FiZap, FiHeart, FiDollarSign, FiUsers } from 'react-icons/fi';

/**
 * Features Section v3.0
 * "Why Choose Dormitory" - 3-column icon cards
 * Concise benefit headlines (per spec)
 */

const features = [
  {
    icon: FiShield,
    title: 'Verified Listings',
    description: 'Every property is verified by our team. No fake listings, no scams. Just real homes from trusted owners.',
    color: 'primary',
  },
  {
    icon: FiMap,
    title: 'Smart Map Search',
    description: 'Find properties near your school with our interactive map. See exactly where you\'ll be living.',
    color: 'success',
  },
  {
    icon: FiZap,
    title: 'Instant Booking',
    description: 'Schedule visits directly with owners. No middlemen, no delays. Connect and move in faster.',
    color: 'warning',
  },
  {
    icon: FiDollarSign,
    title: 'Budget-Friendly',
    description: 'Filter by your budget and find the best value. Our Budget Finder helps you maximize every peso.',
    color: 'info',
  },
  {
    icon: FiHeart,
    title: 'Save Favorites',
    description: 'Bookmark properties you love and compare them side-by-side. Make informed decisions.',
    color: 'error',
  },
  {
    icon: FiUsers,
    title: 'Student-Centered',
    description: 'Built specifically for Filipino students and young professionals. We understand your needs.',
    color: 'primary',
  },
];

const FeatureCard = ({ icon, title, description, color }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const iconBg = useColorModeValue(`${color}.50`, `${color}.900`);
  const iconColor = useColorModeValue(`${color}.600`, `${color}.200`);

  return (
    <VStack
      bg={bgColor}
      p={6}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
      _dark={{ borderColor: 'gray.700' }}
      align="start"
      spacing={3}
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'md',
        borderColor: `${color}.200`,
      }}
    >
      <Box
        p={3}
        borderRadius="lg"
        bg={iconBg}
      >
        <Icon as={icon} boxSize={5} color={iconColor} />
      </Box>
      <VStack align="start" spacing={1}>
        <Heading fontSize="lg" fontWeight="semibold">
          {title}
        </Heading>
        <Text color="gray.600" _dark={{ color: 'gray.400' }} fontSize="sm" lineHeight="1.5">
          {description}
        </Text>
      </VStack>
    </VStack>
  );
};

const FeaturesSection = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box bg={bgColor} py={{ base: 12, md: 16 }}>
      <Container maxW="1200px">
        <VStack spacing={8}>
          {/* Section Header */}
          <VStack spacing={2} textAlign="center" maxW="700px">
            <Heading
              as="h2"
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="semibold"
            >
              Why Choose Dormitory?
            </Heading>
            <Text
              fontSize="md"
              color="gray.600"
              _dark={{ color: 'gray.400' }}
            >
              Simple, safe, and stress-free
            </Text>
          </VStack>

          {/* Feature Cards Grid */}
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={6}
            w="full"
          >
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
