import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Section, Button, PropertyCard } from '../../../shared/components';
import useRentalStore from '../../../shared/stores/useRentalStore';
import { colors, spacing, typography } from '../../../shared/styles/tokens';

const MotionBox = motion(Box);

/**
 * Redesigned Featured Listings Section - Phase 2
 * Uses new PropertyCard component with enhanced features
 */
const FeaturedListings = () => {
  const navigate = useNavigate();
  const { rentals } = useRentalStore();

  // Get first 6 rentals as featured
  const featuredRentals = rentals.slice(0, 6);

  return (
    <Section bg={colors.gray[50]}>
      <VStack spacing={spacing[12]}>
        {/* Section Header */}
        <VStack spacing={spacing[4]} textAlign="center" maxW="3xl">
          <Heading
            as="h2"
            fontSize={{ base: '3xl', md: '4xl' }}
            fontWeight={typography.fontWeight.bold}
            color={colors.gray[900]}
          >
            Featured Properties
          </Heading>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            color={colors.gray[600]}
          >
            Handpicked dormitories that offer the best value, comfort, and
            convenience for students. Verified listings with real-time availability.
          </Text>
        </VStack>

        {/* Listings Grid */}
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={{ base: spacing[6], md: spacing[8] }}
          w="full"
        >
          {featuredRentals.map((rental, index) => (
            <MotionBox
              key={rental.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <PropertyCard
                property={rental}
                onClick={() => navigate(`/listing/${rental.id}`)}
              />
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* View All Button */}
        <Button
          size="lg"
          bg={colors.primary[700]}
          color="white"
          onClick={() => navigate('/find-rentals')}
          px={spacing[8]}
          _hover={{
            bg: colors.primary[800],
          }}
        >
          View All Properties
        </Button>
      </VStack>
    </Section>
  );
};

export default FeaturedListings;
