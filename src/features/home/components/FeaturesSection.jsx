import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiCheckCircle,
  FiZap,
  FiShield,
  FiMapPin,
  FiClock,
  FiUsers,
} from 'react-icons/fi';
import { Section } from '../../../shared/components';
import { colors, spacing, borderRadius, typography } from '../../../shared/styles/tokens';

const MotionBox = motion(Box);

const benefits = [
  {
    icon: FiCheckCircle,
    title: 'Verified Listings',
    description:
      'Every property is verified and inspected to ensure quality, safety, and authenticity. No fake listings, no surprises.',
  },
  {
    icon: FiZap,
    title: 'Smart Recommendations',
    description:
      'AI-powered suggestions based on your budget, location preferences, and lifestyle needs. Find the perfect match faster.',
  },
  {
    icon: FiUsers,
    title: 'Student-Focused',
    description:
      'Designed specifically for students with flexible terms, affordable pricing, and amenities that matter to student life.',
  },
  {
    icon: FiShield,
    title: 'Safety & Trust',
    description:
      'Safety ratings, verified owners, secure payments, and transparent reviews from real students.',
  },
  {
    icon: FiMapPin,
    title: 'Nearby Establishments',
    description:
      'See nearby universities, hospitals, transport stations, and essential services. Know your neighborhood before you move.',
  },
  {
    icon: FiClock,
    title: 'Real-Time Availability',
    description:
      'Live updates on room availability, instant booking confirmations, and quick responses from property owners.',
  },
];

/**
 * Redesigned Features Section - Phase 2
 * Focus on informative benefits with clean card layout
 */
const FeaturesSection = () => {
  return (
    <Section bg="white">
      <VStack spacing={spacing[12]}>
        {/* Section Header */}
        <VStack spacing={spacing[4]} textAlign="center" maxW="3xl">
          <Heading
            as="h2"
            fontSize={{ base: '3xl', md: '4xl' }}
            fontWeight={typography.fontWeight.bold}
            color={colors.gray[900]}
          >
            Why Choose Dormy?
          </Heading>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            color={colors.gray[600]}
          >
            We make finding and renting student accommodation simple, safe, and
            stress-free with verified listings and smart technology.
          </Text>
        </VStack>

        {/* Benefits Grid */}
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={{ base: spacing[6], md: spacing[8] }}
          w="full"
        >
          {benefits.map((benefit, index) => (
            <MotionBox
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Box
                bg={colors.gray[50]}
                borderRadius={borderRadius.lg}
                p={spacing[6]}
                h="full"
                transition="all 0.3s"
                _hover={{
                  bg: 'white',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-4px)',
                }}
              >
                <VStack align="start" spacing={spacing[4]}>
                  <HStack spacing={spacing[3]}>
                    <Box
                      p={spacing[3]}
                      borderRadius={borderRadius.md}
                      bg={colors.primary[50]}
                    >
                      <Icon
                        as={benefit.icon}
                        boxSize={6}
                        color={colors.primary[700]}
                      />
                    </Box>
                    <Heading
                      as="h3"
                      fontSize={typography.fontSize.lg}
                      fontWeight={typography.fontWeight.semibold}
                      color={colors.gray[900]}
                    >
                      {benefit.title}
                    </Heading>
                  </HStack>
                  <Text
                    fontSize={typography.fontSize.sm}
                    color={colors.gray[600]}
                    lineHeight={typography.lineHeight.relaxed}
                  >
                    {benefit.description}
                  </Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </VStack>
    </Section>
  );
};

export default FeaturesSection;
