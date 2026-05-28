import { Box, Heading, Text, Stack, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  AdvancedSearchBar,
  QuickFilters,
} from '../../../shared/components';
import { colors, spacing } from '../../../shared/styles/tokens';

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

/**
 * Redesigned Hero Section - Phase 2
 * Features: Advanced search, quick filters, no gradients, clean design
 */
const HeroSection = () => {
  const navigate = useNavigate();

  const handleSearch = (searchParams) => {
    // Build query string from search parameters
    const params = new URLSearchParams();
    
    if (searchParams.location) {
      params.append('location', searchParams.location.name);
    }
    if (searchParams.budget) {
      params.append('minBudget', searchParams.budget[0]);
      params.append('maxBudget', searchParams.budget[1]);
    }
    if (searchParams.roomType) {
      params.append('roomType', searchParams.roomType);
    }
    if (searchParams.gender) {
      params.append('gender', searchParams.gender);
    }
    if (searchParams.nearbyUniversity) {
      params.append('university', searchParams.nearbyUniversity);
    }

    navigate(`/find-rentals?${params.toString()}`);
  };

  const handleQuickFilterChange = (filters) => {
    // Navigate to find rentals with quick filters
    const params = new URLSearchParams();
    filters.forEach((filter) => {
      params.append('filter', filter);
    });
    navigate(`/find-rentals?${params.toString()}`);
  };

  return (
    <Box
      position="relative"
      minH={{ base: '85vh', md: '80vh' }}
      display="flex"
      alignItems="center"
      bg={colors.gray[50]}
      py={{ base: spacing[12], md: spacing[20] }}
    >
      <Container size="xl" position="relative" zIndex={1}>
        <Stack spacing={spacing[8]} align="center" textAlign="center">
          {/* Main Heading */}
          <MotionHeading
            as="h1"
            fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
            fontWeight="bold"
            lineHeight="shorter"
            color={colors.gray[900]}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Find Your Perfect
            <Text as="span" display="block" color={colors.primary[500]}>
              Student Dormitory
            </Text>
          </MotionHeading>

          {/* Subtitle */}
          <MotionText
            fontSize={{ base: 'lg', md: 'xl' }}
            maxW="2xl"
            color={colors.gray[600]}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover verified, affordable dormitories near your campus. Smart
            search, real-time availability, and student-friendly options.
          </MotionText>

          {/* Advanced Search Bar */}
          <MotionBox
            w="full"
            maxW="4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AdvancedSearchBar onSearch={handleSearch} />
          </MotionBox>

          {/* Quick Filters */}
          <MotionBox
            w="full"
            maxW="4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <VStack spacing={spacing[3]} align="start">
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={colors.gray[700]}
                alignSelf="center"
              >
                Quick Filters
              </Text>
              <QuickFilters onFilterChange={handleQuickFilterChange} />
            </VStack>
          </MotionBox>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;
