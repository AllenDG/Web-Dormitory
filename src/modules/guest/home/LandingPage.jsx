import { Box, Container, useDisclosure, VStack, Heading, Text, Icon, Button } from '@chakra-ui/react';
import { useEffect } from 'react';
import { FiZap } from 'react-icons/fi';
import {
  HeroSection,
  RecommendedSection,
  FeaturedListings,
  PopularLocations,
  CTASection,
} from './components';
import { PreferenceWizard, RecommendedForYou, RecentlyViewed, NewListings } from '../../../domains/recommendations';
import useRecommendationStore from '../../../shared/stores/useRecommendationStore';
import { Card } from '../../../shared/components';

/**
 * Landing Page v6.0
 * Enhanced UI with AI-powered personalization and recommendation engine
 * - Opt-in preference discovery wizard (click to start)
 * - Personalized recommendations based on user preferences
 * - Recently viewed properties
 * - New listings
 * - Featured listings
 * - Popular locations
 */
const LandingPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userPreferences } = useRecommendationStore();

  return (
    <Box>
      <HeroSection />
      
      <Container maxW="1400px" px={{ base: 4, md: 6, lg: 8 }}>
        {/* Recommendation Opt-in Card */}
        {!userPreferences.hasCompletedWizard && (
          <Box mb={12} mt={{ base: 8, md: 12 }}>
            <Card
              bg="linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)"
              borderRadius="16px"
              p={{ base: 6, md: 8 }}
              textAlign="center"
              boxShadow="xl"
            >
              <VStack spacing={4}>
                <Box
                  bg="whiteAlpha.200"
                  p={4}
                  borderRadius="full"
                  backdropFilter="blur(10px)"
                >
                  <Icon as={FiZap} boxSize={10} color="white" />
                </Box>
                <Heading fontSize={{ base: 'xl', md: '2xl' }} color="white" fontWeight="700">
                  Get Personalized Recommendations
                </Heading>
                <Text color="whiteAlpha.900" fontSize={{ base: 'sm', md: 'md' }} maxW="600px">
                  Answer a few quick questions and we'll help you discover properties that perfectly match your needs, budget, and preferences.
                </Text>
                <Button
                  size="lg"
                  bg="white"
                  color="primary.600"
                  fontWeight="700"
                  px={8}
                  py={6}
                  fontSize="md"
                  borderRadius="12px"
                  leftIcon={<Icon as={FiZap} />}
                  onClick={onOpen}
                  _hover={{ transform: 'translateY(-2px)', boxShadow: '2xl' }}
                  transition="all 0.2s"
                >
                  Find My Perfect Home
                </Button>
                <Text color="whiteAlpha.800" fontSize="xs">
                  Takes less than 2 minutes • 100% Free
                </Text>
              </VStack>
            </Card>
          </Box>
        )}

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
