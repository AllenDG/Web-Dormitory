import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiShield,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiHeart,
} from 'react-icons/fi';
import { Section, Card } from '../../../shared/components';

const MotionBox = motion(Box);

const features = [
  {
    icon: FiSearch,
    title: 'Easy Search',
    description:
      'Find your perfect place with advanced filters and interactive maps.',
    color: 'blue.500',
  },
  {
    icon: FiShield,
    title: 'Verified Listings',
    description:
      'All properties are verified to ensure quality and authenticity.',
    color: 'green.500',
  },
  {
    icon: FiClock,
    title: 'Quick Booking',
    description:
      'Schedule visits and book your room in minutes, not days.',
    color: 'purple.500',
  },
  {
    icon: FiDollarSign,
    title: 'Best Prices',
    description:
      'Transparent pricing with no hidden fees. Find options for every budget.',
    color: 'yellow.500',
  },
  {
    icon: FiMapPin,
    title: 'Prime Locations',
    description:
      'Properties near universities, public transport, and amenities.',
    color: 'red.500',
  },
  {
    icon: FiHeart,
    title: 'Student-Friendly',
    description:
      'Designed for students with flexible terms and community features.',
    color: 'pink.500',
  },
];

/**
 * Features Section showcasing platform benefits
 */
const FeaturesSection = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Section bg={bgColor}>
      <VStack spacing={12}>
        {/* Section Header */}
        <VStack spacing={4} textAlign="center" maxW="3xl">
          <Heading
            as="h2"
            fontSize={{ base: '3xl', md: '4xl' }}
            fontWeight="bold"
          >
            Why Choose Dormy?
          </Heading>
          <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600" _dark={{ color: 'gray.400' }}>
            We make finding and renting student accommodation simple, safe, and
            stress-free.
          </Text>
        </VStack>

        {/* Features Grid */}
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={{ base: 6, md: 8 }}
          w="full"
        >
          {features.map((feature, index) => (
            <MotionBox
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card hover padding={8} h="full">
                <VStack align="start" spacing={4}>
                  <Box
                    p={3}
                    borderRadius="lg"
                    bg={`${feature.color.split('.')[0]}.50`}
                    _dark={{ bg: `${feature.color.split('.')[0]}.900` }}
                  >
                    <Icon
                      as={feature.icon}
                      boxSize={6}
                      color={feature.color}
                    />
                  </Box>
                  <Heading as="h3" size="md">
                    {feature.title}
                  </Heading>
                  <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                    {feature.description}
                  </Text>
                </VStack>
              </Card>
            </MotionBox>
          ))}
        </SimpleGrid>
      </VStack>
    </Section>
  );
};

export default FeaturesSection;
