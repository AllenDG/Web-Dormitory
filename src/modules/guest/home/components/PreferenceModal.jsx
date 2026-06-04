import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  HStack,
  Text,
  FormControl,
  FormLabel,
  Select,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Checkbox,
  CheckboxGroup,
  Stack,
  Icon,
  Box,
  Progress,
  Heading,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiHome, FiDollarSign, FiMapPin, FiCheckCircle } from 'react-icons/fi';

/**
 * AI Preference Modal
 * User-friendly questionnaire to gather preferences for AI recommendations
 */
const PreferenceModal = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    budget: [5000, 15000],
    propertyType: '',
    locations: [],
    amenities: [],
    occupancy: '',
  });

  const totalSteps = 4;

  const cities = [
    'Quezon City',
    'Manila',
    'Makati',
    'Pasig',
    'Taguig',
    'Mandaluyong',
    'Caloocan',
    'Las Piñas',
  ];

  const amenities = [
    { value: 'wifi', label: 'WiFi' },
    { value: 'aircon', label: 'Air Conditioning' },
    { value: 'parking', label: 'Parking' },
    { value: 'laundry', label: 'Laundry' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'security', label: '24/7 Security' },
  ];

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'condo', label: 'Condominium' },
    { value: 'dormitory', label: 'Dormitory' },
    { value: 'bedspace', label: 'Bed Space' },
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    // Save preferences to localStorage
    const userProfile = {
      budget: { min: preferences.budget[0], max: preferences.budget[1] },
      preferredLocations: preferences.locations,
      requiredAmenities: preferences.amenities,
      propertyType: preferences.propertyType,
      occupancy: preferences.occupancy,
      recentSearches: [],
      favoriteCount: 0,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    localStorage.setItem('hasCompletedPreferences', 'true');

    onComplete(userProfile);
    onClose();
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return preferences.budget[0] < preferences.budget[1];
      case 2:
        return preferences.propertyType !== '';
      case 3:
        return preferences.locations.length > 0;
      case 4:
        return preferences.amenities.length > 0;
      default:
        return false;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
      <ModalContent mx={4}>
        <ModalHeader>
          <VStack spacing={2} align="start">
            <Heading fontSize="xl" fontWeight="semibold">
              Let's Find Your Perfect Home
            </Heading>
            <Text fontSize="sm" fontWeight="normal" color="gray.600">
              Answer a few questions to get personalized recommendations
            </Text>
          </VStack>
          <Progress
            value={(step / totalSteps) * 100}
            size="sm"
            colorScheme="primary"
            mt={4}
            borderRadius="full"
          />
        </ModalHeader>

        <ModalBody py={6}>
          <VStack spacing={6} align="stretch">
            {/* Step 1: Budget */}
            {step === 1 && (
              <VStack spacing={4} align="stretch">
                <HStack spacing={3}>
                  <Icon as={FiDollarSign} color="primary.500" boxSize={6} />
                  <VStack spacing={0} align="start">
                    <Text fontSize="lg" fontWeight="semibold">
                      What's your budget?
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Monthly rent range
                    </Text>
                  </VStack>
                </HStack>

                <Box pt={4}>
                  <HStack justify="space-between" mb={4}>
                    <Text fontSize="md" fontWeight="medium" color="primary.600">
                      {formatPrice(preferences.budget[0])}
                    </Text>
                    <Text fontSize="md" fontWeight="medium" color="primary.600">
                      {formatPrice(preferences.budget[1])}
                    </Text>
                  </HStack>

                  <RangeSlider
                    value={preferences.budget}
                    onChange={(val) =>
                      setPreferences({ ...preferences, budget: val })
                    }
                    min={2000}
                    max={50000}
                    step={1000}
                    colorScheme="primary"
                  >
                    <RangeSliderTrack>
                      <RangeSliderFilledTrack />
                    </RangeSliderTrack>
                    <RangeSliderThumb index={0} boxSize={6} />
                    <RangeSliderThumb index={1} boxSize={6} />
                  </RangeSlider>
                </Box>
              </VStack>
            )}

            {/* Step 2: Property Type */}
            {step === 2 && (
              <VStack spacing={4} align="stretch">
                <HStack spacing={3}>
                  <Icon as={FiHome} color="primary.500" boxSize={6} />
                  <VStack spacing={0} align="start">
                    <Text fontSize="lg" fontWeight="semibold">
                      What type of property?
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Choose your preferred accommodation
                    </Text>
                  </VStack>
                </HStack>

                <Stack spacing={3}>
                  {propertyTypes.map((type) => (
                    <Box
                      key={type.value}
                      p={4}
                      borderRadius="lg"
                      border="2px"
                      borderColor={
                        preferences.propertyType === type.value
                          ? 'primary.500'
                          : 'gray.200'
                      }
                      bg={
                        preferences.propertyType === type.value
                          ? 'primary.50'
                          : 'white'
                      }
                      cursor="pointer"
                      onClick={() =>
                        setPreferences({ ...preferences, propertyType: type.value })
                      }
                      transition="all 0.2s"
                      _hover={{
                        borderColor: 'primary.500',
                        transform: 'translateY(-2px)',
                      }}
                    >
                      <HStack justify="space-between">
                        <Text fontSize="md" fontWeight="medium">
                          {type.label}
                        </Text>
                        {preferences.propertyType === type.value && (
                          <Icon as={FiCheckCircle} color="primary.500" boxSize={5} />
                        )}
                      </HStack>
                    </Box>
                  ))}
                </Stack>
              </VStack>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <VStack spacing={4} align="stretch">
                <HStack spacing={3}>
                  <Icon as={FiMapPin} color="primary.500" boxSize={6} />
                  <VStack spacing={0} align="start">
                    <Text fontSize="lg" fontWeight="semibold">
                      Preferred locations?
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Select one or more cities
                    </Text>
                  </VStack>
                </HStack>

                <CheckboxGroup
                  value={preferences.locations}
                  onChange={(val) =>
                    setPreferences({ ...preferences, locations: val })
                  }
                >
                  <Stack spacing={2}>
                    {cities.map((city) => (
                      <Checkbox key={city} value={city} colorScheme="primary">
                        <Text fontSize="sm">{city}</Text>
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </VStack>
            )}

            {/* Step 4: Amenities */}
            {step === 4 && (
              <VStack spacing={4} align="stretch">
                <HStack spacing={3}>
                  <Icon as={FiCheckCircle} color="primary.500" boxSize={6} />
                  <VStack spacing={0} align="start">
                    <Text fontSize="lg" fontWeight="semibold">
                      Must-have amenities?
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Select your essential features
                    </Text>
                  </VStack>
                </HStack>

                <CheckboxGroup
                  value={preferences.amenities}
                  onChange={(val) =>
                    setPreferences({ ...preferences, amenities: val })
                  }
                >
                  <Stack spacing={2}>
                    {amenities.map((amenity) => (
                      <Checkbox
                        key={amenity.value}
                        value={amenity.value}
                        colorScheme="primary"
                      >
                        <Text fontSize="sm">{amenity.label}</Text>
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </VStack>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3} w="full" justify="space-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              isDisabled={step === 1}
              size="md"
            >
              Back
            </Button>
            <HStack spacing={2}>
              <Button variant="ghost" onClick={onClose} size="md">
                Skip
              </Button>
              <Button
                colorScheme="primary"
                onClick={handleNext}
                isDisabled={!canProceed()}
                size="md"
              >
                {step === totalSteps ? 'Get Recommendations' : 'Next'}
              </Button>
            </HStack>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PreferenceModal;
