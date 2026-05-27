import { Box } from '@chakra-ui/react';
import {
  HeroSection,
  FeaturesSection,
  FeaturedListings,
  CTASection,
} from './components';

/**
 * Modern Landing Page
 * Redesigned with clean architecture and modern UI
 */
const LandingPage = () => {
  return (
    <Box>
      <HeroSection />
      <FeaturesSection />
      <FeaturedListings />
      <CTASection />
    </Box>
  );
};

export default LandingPage;
