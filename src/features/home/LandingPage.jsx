import { Box, Container, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  HeroSection,
  RecommendedSection,
  FeaturedListings,
  PopularLocations,
  CTASection,
} from './components';
import { PreferenceWizard, RecommendedForYou, RecentlyViewed, NewListings } from '../recommendations';
import useRecommendationStore from '../../shared/stores/useRecommendationStore';

/**
 * Landing Page v5.0
 * Enhanced UI with AI-powered personalization and recommendation engine
 * - Preference discovery wizard on first visit
 * - Personalized recommendations based on user preferences
 * - Recently viewed properties
 * - New listings
 * - Featured listings
 * - Popular locations
 */
const LandingPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userPreferences } = useRecommendationStore();

  useEffect(() => {
    // Check if user has completed preferences wizard
    if (!userPreferences.hasCompletedWizard) {
      // Show wizard after a short delay for better UX
      setTimeout(() => {
        onOpen();
      }, 1500);
    }
  }, [onOpen, userPreferences.hasCompletedWizard]);

  return (
    <Box>
      <HeroSection />
      
      <Container maxW="1400px" px={{ base: 4, md: 6, lg: 8 }}>
        {/* Personalized Recommendations */}
        {userPreferences.hasCompletedWizard && (
          <Box mb={12}>
            <RecommendedForYou limit={6} />
          </Box>
        )}

        {/* Recently Viewed */}
        <Box mb={12}>
          <RecentlyViewed limit={6} />
        </Box>

        {/* New Listings */}
        <Box mb={12}>
          <NewListings limit={6} />
        </Box>

        {/* Featured Listings (existing) */}
        <FeaturedListings />
      </Container>
      
      <PopularLocations />
      <CTASection />

      {/* Preference Discovery Wizard */}
      <PreferenceWizard isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default LandingPage;
