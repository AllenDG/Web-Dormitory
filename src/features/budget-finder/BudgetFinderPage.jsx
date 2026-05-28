import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { FiDollarSign, FiMapPin, FiHome, FiZap } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Section,
  BudgetRangeSlider,
  LocationAutocomplete,
  Select,
  Button,
} from '../../shared/components';
import { BudgetResults } from './components';
import { colors, spacing, borderRadius, typography } from '../../shared/styles/tokens';
import useRentalStore from '../../shared/stores/useRentalStore';

/**
 * Budget Finder Page - Phase 5
 * Smart property recommendations based on budget and preferences
 */
const BudgetFinderPage = () => {
  const navigate = useNavigate();
  const { rentals } = useRentalStore();
  
  const [formData, setFormData] = useState({
    budget: [3000, 8000],
    location: null,
    roomType: '',
    lifestyle: '',
  });
  
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const roomTypeOptions = [
    { value: '', label: 'Any Room Type' },
    { value: 'solo', label: 'Solo Room' },
    { value: 'shared', label: 'Shared Room' },
    { value: 'studio', label: 'Studio Type' },
    { value: 'apartment', label: 'Apartment' },
  ];

  const lifestyleOptions = [
    { value: '', label: 'Select Lifestyle' },
    { value: 'student', label: 'Student (Study-focused)' },
    { value: 'working', label: 'Working Professional' },
    { value: 'social', label: 'Social Butterfly' },
    { value: 'quiet', label: 'Quiet & Private' },
    { value: 'active', label: 'Active & Outdoorsy' },
  ];

  const handleBudgetChange = (value) => {
    setFormData((prev) => ({ ...prev, budget: value }));
  };

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({ ...prev, location }));
  };

  const handleRoomTypeChange = (e) => {
    setFormData((prev) => ({ ...prev, roomType: e.target.value }));
  };

  const handleLifestyleChange = (e) => {
    setFormData((prev) => ({ ...prev, lifestyle: e.target.value }));
  };

  const calculateRecommendations = () => {
    // Filter properties within budget
    const inBudget = rentals.filter(
      (rental) => rental.price >= formData.budget[0] && rental.price <= formData.budget[1]
    );

    // Score each property
    const scored = inBudget.map((rental) => {
      let score = 0;
      let reasons = [];

      // Budget score (closer to lower end = better value)
      const budgetRange = formData.budget[1] - formData.budget[0];
      const pricePosition = (rental.price - formData.budget[0]) / budgetRange;
      const budgetScore = (1 - pricePosition) * 30;
      score += budgetScore;

      if (pricePosition < 0.3) {
        reasons.push('Excellent value for money');
      } else if (pricePosition < 0.6) {
        reasons.push('Good balance of price and quality');
      }

      // Location match
      if (formData.location && rental.city.toLowerCase().includes(formData.location.name.toLowerCase())) {
        score += 25;
        reasons.push(`Located in ${formData.location.name}`);
      }

      // Room type match
      if (formData.roomType && rental.bedType.toLowerCase().includes(formData.roomType.toLowerCase())) {
        score += 20;
        reasons.push(`Matches your ${formData.roomType} preference`);
      }

      // Lifestyle match
      if (formData.lifestyle) {
        const lifestyleScores = {
          student: rental.amenities.includes('Study Area') || rental.amenities.includes('WiFi'),
          working: rental.amenities.includes('WiFi') || rental.amenities.includes('Parking'),
          social: rental.amenities.includes('Common Area') || rental.amenities.includes('Recreation'),
          quiet: rental.amenities.includes('Security') || rental.amenities.includes('CCTV'),
          active: rental.amenities.includes('Gym') || rental.amenities.includes('Recreation'),
        };

        if (lifestyleScores[formData.lifestyle]) {
          score += 15;
          reasons.push(`Great for ${lifestyleOptions.find(o => o.value === formData.lifestyle)?.label}`);
        }
      }

      // Amenities bonus
      const amenityCount = rental.amenities.length;
      score += Math.min(amenityCount * 2, 10);
      if (amenityCount >= 5) {
        reasons.push(`${amenityCount} amenities included`);
      }

      return {
        ...rental,
        score: Math.round(score),
        reasons,
        valueRating: pricePosition < 0.3 ? 'Excellent' : pricePosition < 0.6 ? 'Good' : 'Fair',
      };
    });

    // Sort by score and return top 6
    const sorted = scored.sort((a, b) => b.score - a.score).slice(0, 6);
    return sorted;
  };

  const handleFindProperties = () => {
    const results = calculateRecommendations();
    setRecommendations(results);
    setShowResults(true);
  };

  const handleReset = () => {
    setFormData({
      budget: [3000, 8000],
      location: null,
      roomType: '',
      lifestyle: '',
    });
    setShowResults(false);
    setRecommendations([]);
  };

  return (
    <Box bg={colors.gray[50]} minH="100vh">
      {/* Header */}
      <Section bg="white" borderBottom={`1px solid ${colors.gray[200]}`} py={spacing[8]}>
        <Container>
          <VStack spacing={spacing[4]} textAlign="center" maxW="3xl" mx="auto">
            <HStack spacing={spacing[2]} justify="center">
              <Icon as={FiDollarSign} boxSize={8} color={colors.primary[700]} />
              <Heading
                fontSize={{ base: '3xl', md: '4xl' }}
                fontWeight={typography.fontWeight.bold}
                color={colors.gray[900]}
              >
                Budget Finder
              </Heading>
            </HStack>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color={colors.gray[600]}
              lineHeight={typography.lineHeight.relaxed}
            >
              Tell us your budget and preferences, and we'll find the best dormitories
              that offer the most value for your money.
            </Text>
          </VStack>
        </Container>
      </Section>

      {/* Main Content */}
      <Section py={spacing[12]}>
        <Container maxW="1200px">
          {!showResults ? (
            // Input Form
            <Box
              bg="white"
              borderRadius={borderRadius.lg}
              border={`1px solid ${colors.gray[200]}`}
              p={{ base: spacing[6], md: spacing[8] }}
              maxW="800px"
              mx="auto"
            >
              <VStack spacing={spacing[8]} align="stretch">
                {/* Budget Range */}
                <Box>
                  <HStack spacing={spacing[2]} mb={spacing[4]}>
                    <Icon as={FiDollarSign} color={colors.primary[700]} />
                    <Text
                      fontSize={typography.fontSize.lg}
                      fontWeight={typography.fontWeight.semibold}
                      color={colors.gray[900]}
                    >
                      Your Budget
                    </Text>
                  </HStack>
                  <BudgetRangeSlider
                    min={1000}
                    max={20000}
                    step={500}
                    defaultValue={formData.budget}
                    onChange={handleBudgetChange}
                  />
                  <Text
                    fontSize={typography.fontSize.sm}
                    color={colors.gray[600]}
                    mt={spacing[2]}
                  >
                    We'll find properties within this price range
                  </Text>
                </Box>

                <Divider />

                {/* Location */}
                <Box>
                  <HStack spacing={spacing[2]} mb={spacing[4]}>
                    <Icon as={FiMapPin} color={colors.primary[700]} />
                    <Text
                      fontSize={typography.fontSize.lg}
                      fontWeight={typography.fontWeight.semibold}
                      color={colors.gray[900]}
                    >
                      Preferred Location
                    </Text>
                  </HStack>
                  <LocationAutocomplete
                    placeholder="Where do you want to stay?"
                    onSelect={handleLocationSelect}
                    showCurrentLocation
                  />
                  <Text
                    fontSize={typography.fontSize.sm}
                    color={colors.gray[600]}
                    mt={spacing[2]}
                  >
                    Optional: Helps us find properties near your school or work
                  </Text>
                </Box>

                <Divider />

                {/* Room Type */}
                <Box>
                  <HStack spacing={spacing[2]} mb={spacing[4]}>
                    <Icon as={FiHome} color={colors.primary[700]} />
                    <Text
                      fontSize={typography.fontSize.lg}
                      fontWeight={typography.fontWeight.semibold}
                      color={colors.gray[900]}
                    >
                      Room Type Preference
                    </Text>
                  </HStack>
                  <Select
                    options={roomTypeOptions}
                    value={formData.roomType}
                    onChange={handleRoomTypeChange}
                    placeholder="Select room type"
                  />
                </Box>

                <Divider />

                {/* Lifestyle */}
                <Box>
                  <HStack spacing={spacing[2]} mb={spacing[4]}>
                    <Icon as={FiZap} color={colors.primary[700]} />
                    <Text
                      fontSize={typography.fontSize.lg}
                      fontWeight={typography.fontWeight.semibold}
                      color={colors.gray[900]}
                    >
                      Your Lifestyle
                    </Text>
                  </HStack>
                  <Select
                    options={lifestyleOptions}
                    value={formData.lifestyle}
                    onChange={handleLifestyleChange}
                    placeholder="Select lifestyle"
                  />
                  <Text
                    fontSize={typography.fontSize.sm}
                    color={colors.gray[600]}
                    mt={spacing[2]}
                  >
                    Helps us match you with properties that fit your daily routine
                  </Text>
                </Box>

                {/* Action Buttons */}
                <HStack spacing={spacing[3]} pt={spacing[4]}>
                  <Button
                    flex="1"
                    bg={colors.primary[700]}
                    color="white"
                    size="lg"
                    onClick={handleFindProperties}
                    _hover={{
                      bg: colors.primary[800],
                    }}
                  >
                    Find Best Properties
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleReset}
                    borderColor={colors.gray[300]}
                    color={colors.gray[700]}
                    _hover={{
                      bg: colors.gray[50],
                    }}
                  >
                    Reset
                  </Button>
                </HStack>
              </VStack>
            </Box>
          ) : (
            // Results
            <BudgetResults
              recommendations={recommendations}
              budget={formData.budget}
              onReset={handleReset}
              onViewProperty={(id) => navigate(`/listing/${id}`)}
            />
          )}
        </Container>
      </Section>
    </Box>
  );
};

export default BudgetFinderPage;
