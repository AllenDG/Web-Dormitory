import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Button,
  Text,
  Box,
  Progress,
  SimpleGrid,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Checkbox,
  CheckboxGroup,
  Icon,
  useToast,
} from '@chakra-ui/react';
import {
  FaHome,
  FaBuilding,
  FaDoorOpen,
  FaBed,
  FaCouch,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
} from 'react-icons/fa';
import { MdApartment } from 'react-icons/md';
import useRecommendationStore, { PROPERTY_TYPES, STAY_DURATION } from '../../../shared/stores/useRecommendationStore';

/**
 * Preference Discovery Wizard Component
 * Multi-step wizard to collect user preferences for property recommendations
 * 
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 */
const PreferenceWizard = ({ isOpen, onClose }) => {
  const toast = useToast();
  const { setUserPreferences, userPreferences } = useRecommendationStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [preferences, setPreferences] = useState({
    propertyTypes: userPreferences.propertyTypes || [],
    budgetMin: userPreferences.budgetMin || 0,
    budgetMax: userPreferences.budgetMax || 50000,
    preferredLocations: userPreferences.preferredLocations || [],
    stayDuration: userPreferences.stayDuration || null,
    amenities: userPreferences.amenities || [],
  });

  const totalSteps = 5;

  // Property type options
  const propertyTypeOptions = [
    { value: PROPERTY_TYPES.DORM, label: 'Dormitory', icon: FaHome },
    { value: PROPERTY_TYPES.APARTMENT, label: 'Apartment', icon: FaBuilding },
    { value: PROPERTY_TYPES.STUDIO, label: 'Studio', icon: FaDoorOpen },
    { value: PROPERTY_TYPES.CONDO, label: 'Condo', icon: MdApartment },
    { value: PROPERTY_TYPES.BEDSPACE, label: 'Bedspace', icon: FaBed },
    { value: PROPERTY_TYPES.ROOM, label: 'Room', icon: FaCouch },
  ];

  // Location options (common areas in Metro Manila)
  const locationOptions = [
    'Manila', 'Quezon City', 'Makati', 'Taguig', 'Pasig',
    'Mandaluyong', 'Pasay', 'Parañaque', 'Las Piñas', 'Muntinlupa',
    'Caloocan', 'Malabon', 'Navotas', 'Valenzuela', 'Marikina',
    'San Juan', 'Pateros',
  ];

  // Stay duration options
  const stayDurationOptions = [
    { value: STAY_DURATION.DAILY, label: 'Daily (1-30 days)' },
    { value: STAY_DURATION.MONTHLY, label: 'Monthly (1-5 months)' },
    { value: STAY_DURATION.SIX_MONTHS, label: '6 Months' },
    { value: STAY_DURATION.ONE_YEAR, label: '1 Year or more' },
  ];

  // Amenity options
  const amenityOptions = [
    'WiFi', 'Air Conditioning', 'Kitchen', 'Laundry',
    'Parking', 'Security', 'Gym', 'Swimming Pool',
    'Study Area', 'Common Area', 'Pet Friendly', 'Furnished',
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePropertyTypeToggle = (type) => {
    setPreferences((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter((t) => t !== type)
        : [...prev.propertyTypes, type],
    }));
  };

  const handleLocationToggle = (location) => {
    setPreferences((prev) => ({
      ...prev,
      preferredLocations: prev.preferredLocations.includes(location)
        ? prev.preferredLocations.filter((l) => l !== location)
        : [...prev.preferredLocations, location],
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setPreferences((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleComplete = () => {
    // Validate preferences
    if (preferences.propertyTypes.length === 0) {
      toast({
        title: 'Please select at least one property type',
        status: 'warning',
        duration: 3000,
      });
      setCurrentStep(1);
      return;
    }

    // Save preferences
    setUserPreferences(preferences);
    
    toast({
      title: 'Preferences saved!',
      description: 'We\'ll use these to recommend properties for you.',
      status: 'success',
      duration: 3000,
    });

    onClose();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return preferences.propertyTypes.length > 0;
      case 2:
        return preferences.budgetMax > preferences.budgetMin;
      case 3:
        return preferences.preferredLocations.length > 0;
      case 4:
        return preferences.stayDuration !== null;
      case 5:
        return true; // Amenities are optional
      default:
        return false;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent borderRadius="8px">
        <ModalHeader>
          <VStack align="stretch" spacing={2}>
            <Text fontSize="xl" fontWeight="bold">
              Find Your Perfect Home
            </Text>
            <Text fontSize="sm" fontWeight="normal" color="gray.600">
              Step {currentStep} of {totalSteps}
            </Text>
            <Progress
              value={(currentStep / totalSteps) * 100}
              size="sm"
              colorScheme="blue"
              borderRadius="full"
            />
          </VStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          {/* Step 1: Property Type */}
          {currentStep === 1 && (
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={2}>
                  What type of property are you looking for?
                </Text>
                <Text fontSize="sm" color="gray.600" mb={4}>
                  Select all that apply
                </Text>
              </Box>

              <SimpleGrid columns={[2, 3]} spacing={3}>
                {propertyTypeOptions.map((option) => (
                  <Box
                    key={option.value}
                    as="button"
                    p={4}
                    borderWidth="2px"
                    borderColor={
                      preferences.propertyTypes.includes(option.value)
                        ? 'blue.500'
                        : 'gray.200'
                    }
                    borderRadius="8px"
                    bg={
                      preferences.propertyTypes.includes(option.value)
                        ? 'blue.50'
                        : 'white'
                    }
                    onClick={() => handlePropertyTypeToggle(option.value)}
                    transition="all 0.2s"
                    _hover={{ borderColor: 'blue.300' }}
                  >
                    <VStack spacing={2}>
                      <Icon
                        as={option.icon}
                        boxSize={8}
                        color={
                          preferences.propertyTypes.includes(option.value)
                            ? 'blue.500'
                            : 'gray.500'
                        }
                      />
                      <Text
                        fontSize="sm"
                        fontWeight={
                          preferences.propertyTypes.includes(option.value)
                            ? 'semibold'
                            : 'normal'
                        }
                      >
                        {option.label}
                      </Text>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </VStack>
          )}

          {/* Step 2: Budget Range */}
          {currentStep === 2 && (
            <VStack align="stretch" spacing={6}>
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={2}>
                  What's your budget?
                </Text>
                <Text fontSize="sm" color="gray.600" mb={4}>
                  Set your monthly budget range
                </Text>
              </Box>

              <Box px={4}>
                <HStack justify="space-between" mb={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.600">
                      Min
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                      ₱{preferences.budgetMin.toLocaleString()}
                    </Text>
                  </Box>
                  <Box textAlign="right">
                    <Text fontSize="sm" color="gray.600">
                      Max
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                      ₱{preferences.budgetMax.toLocaleString()}
                    </Text>
                  </Box>
                </HStack>

                <RangeSlider
                  min={0}
                  max={50000}
                  step={1000}
                  value={[preferences.budgetMin, preferences.budgetMax]}
                  onChange={(values) =>
                    setPreferences((prev) => ({
                      ...prev,
                      budgetMin: values[0],
                      budgetMax: values[1],
                    }))
                  }
                >
                  <RangeSliderTrack bg="gray.200">
                    <RangeSliderFilledTrack bg="blue.500" />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} boxSize={6} />
                  <RangeSliderThumb index={1} boxSize={6} />
                </RangeSlider>
              </Box>

              <Box bg="blue.50" p={4} borderRadius="8px">
                <Text fontSize="sm" color="gray.700">
                  💡 <strong>Tip:</strong> Setting a wider range gives you more options to choose from.
                </Text>
              </Box>
            </VStack>
          )}

          {/* Step 3: Preferred Locations */}
          {currentStep === 3 && (
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={2}>
                  <Icon as={FaMapMarkerAlt} mr={2} color="blue.500" />
                  Where do you want to live?
                </Text>
                <Text fontSize="sm" color="gray.600" mb={4}>
                  Select your preferred locations
                </Text>
              </Box>

              <Box maxH="300px" overflowY="auto" pr={2}>
                <SimpleGrid columns={[2, 3]} spacing={2}>
                  {locationOptions.map((location) => (
                    <Checkbox
                      key={location}
                      isChecked={preferences.preferredLocations.includes(location)}
                      onChange={() => handleLocationToggle(location)}
                      colorScheme="blue"
                    >
                      {location}
                    </Checkbox>
                  ))}
                </SimpleGrid>
              </Box>
            </VStack>
          )}

          {/* Step 4: Stay Duration */}
          {currentStep === 4 && (
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={2}>
                  <Icon as={FaCalendarAlt} mr={2} color="blue.500" />
                  How long do you plan to stay?
                </Text>
                <Text fontSize="sm" color="gray.600" mb={4}>
                  Select your preferred duration
                </Text>
              </Box>

              <VStack spacing={3}>
                {stayDurationOptions.map((option) => (
                  <Box
                    key={option.value}
                    as="button"
                    w="full"
                    p={4}
                    borderWidth="2px"
                    borderColor={
                      preferences.stayDuration === option.value
                        ? 'blue.500'
                        : 'gray.200'
                    }
                    borderRadius="8px"
                    bg={
                      preferences.stayDuration === option.value
                        ? 'blue.50'
                        : 'white'
                    }
                    onClick={() =>
                      setPreferences((prev) => ({
                        ...prev,
                        stayDuration: option.value,
                      }))
                    }
                    transition="all 0.2s"
                    _hover={{ borderColor: 'blue.300' }}
                  >
                    <HStack justify="space-between">
                      <Text
                        fontWeight={
                          preferences.stayDuration === option.value
                            ? 'semibold'
                            : 'normal'
                        }
                      >
                        {option.label}
                      </Text>
                      {preferences.stayDuration === option.value && (
                        <Icon as={FaCheckCircle} color="blue.500" />
                      )}
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </VStack>
          )}

          {/* Step 5: Amenities */}
          {currentStep === 5 && (
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={2}>
                  What amenities are important to you?
                </Text>
                <Text fontSize="sm" color="gray.600" mb={4}>
                  Select all that apply (optional)
                </Text>
              </Box>

              <SimpleGrid columns={[2, 3]} spacing={3}>
                {amenityOptions.map((amenity) => (
                  <Checkbox
                    key={amenity}
                    isChecked={preferences.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    colorScheme="blue"
                  >
                    {amenity}
                  </Checkbox>
                ))}
              </SimpleGrid>

              <Box bg="green.50" p={4} borderRadius="8px" mt={4}>
                <Text fontSize="sm" color="gray.700">
                  🎉 <strong>Almost done!</strong> Click "Complete" to save your preferences.
                </Text>
              </Box>
            </VStack>
          )}

          {/* Navigation Buttons */}
          <HStack justify="space-between" mt={8}>
            <Button
              variant="ghost"
              onClick={handleBack}
              isDisabled={currentStep === 1}
            >
              Back
            </Button>

            {currentStep < totalSteps ? (
              <Button
                colorScheme="blue"
                onClick={handleNext}
                isDisabled={!canProceed()}
              >
                Next
              </Button>
            ) : (
              <Button
                colorScheme="blue"
                onClick={handleComplete}
                leftIcon={<FaCheckCircle />}
              >
                Complete
              </Button>
            )}
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PreferenceWizard;
