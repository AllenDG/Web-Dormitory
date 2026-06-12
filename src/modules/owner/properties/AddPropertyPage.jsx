import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  Icon,
  SimpleGrid,
  Checkbox,
  CheckboxGroup,
  useToast,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FiSave, FiX, FiZap, FiMapPin, FiCheck } from 'react-icons/fi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { listingWriterService } from '../../../services/ai';
import geocodingService from '../../../services/geocoding/geocodingService';
import LocationPicker from '../../../shared/components/LocationPicker';
import LocationAutocomplete from '../../../shared/components/LocationAutocomplete';

/**
 * Add Property Page
 * Form for owners to add new property listings
 * Includes "AI Assist" button for description generation
 */

const AddPropertyPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [location, setLocation] = useState(null); // Stores geocoded coordinates
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState(null);
  const { isOpen: isLocationPickerOpen, onOpen: openLocationPicker, onClose: closeLocationPicker } = useDisclosure();

  const amenitiesList = [
    'Wifi / Internet',
    'Air Conditioning',
    'Refrigerator',
    'Kitchen',
    'Parking',
    'Laundry Area',
    '24/7 Security',
    'CCTV',
    'Elevator',
    'Swimming Pool',
    'Gym Access',
    'Balcony',
  ];

  const watchedFields = watch();

  const handleAIAssist = async () => {
    // Check if AI service is available
    if (!listingWriterService.isAvailable()) {
      toast({
        title: 'AI Service Unavailable',
        description: 'Please configure your Anthropic API key in the .env file to use AI features.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const { title, bedType, price, city, address, propertyType } = watchedFields;
      
      // Validate required fields
      if (!title) {
        toast({
          title: 'Missing Information',
          description: 'Please enter a property title first.',
          status: 'warning',
          duration: 3000,
        });
        setIsGenerating(false);
        return;
      }

      // Prepare property data for AI
      const propertyData = {
        title,
        location: city,
        address,
        propertyType: propertyType || 'Rental Property',
        amenities: selectedAmenities,
        price: price ? parseFloat(price) : null,
        bedType,
        availablePerson: watchedFields.availablePerson,
      };

      // Generate description using AI
      const generatedDescription = await listingWriterService.generateDescription(propertyData);
      
      // Set the generated description
      setValue('description', generatedDescription);
      
      toast({
        title: 'Description Generated! ✨',
        description: 'AI has created a professional description for your property.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('AI generation error:', error);
      toast({
        title: 'Generation Failed',
        description: error.message || 'Failed to generate description. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle geocoding when address changes
  const handleAddressBlur = async () => {
    const city = watchedFields.city;
    const address = watchedFields.address;

    if (!city || !address) {
      return;
    }

    const fullAddress = `${address}, ${city}, Philippines`;
    await geocodeAddress(fullAddress);
  };

  // Geocode address to get coordinates
  const geocodeAddress = async (address) => {
    if (!geocodingService.isAvailable()) {
      toast({
        title: 'Google Maps Not Configured',
        description: 'Please add your Google Maps API key to use geocoding.',
        status: 'warning',
        duration: 5000,
      });
      return;
    }

    setIsGeocoding(true);
    setGeocodingError(null);

    try {
      const result = await geocodingService.validatePhilippinesAddress(address);

      if (result.isValid) {
        setLocation(result.location);
        toast({
          title: 'Location Found! ✓',
          description: 'Address has been geocoded successfully.',
          status: 'success',
          duration: 3000,
        });
      } else {
        setGeocodingError(result.message);
        toast({
          title: 'Invalid Address',
          description: result.message,
          status: 'error',
          duration: 5000,
        });
      }
    } catch (error) {
      setGeocodingError(error.message);
      toast({
        title: 'Geocoding Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsGeocoding(false);
    }
  };

  // Handle location selection from autocomplete
  const handleLocationSelect = (selectedLocation) => {
    if (selectedLocation.city) {
      setValue('city', selectedLocation.city);
    }
    if (selectedLocation.address) {
      setValue('address', selectedLocation.address);
    }
    if (selectedLocation.latitude && selectedLocation.longitude) {
      setLocation({
        address: selectedLocation.address,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        placeId: selectedLocation.placeId,
        addressComponents: {
          city: selectedLocation.city,
        },
      });
      setGeocodingError(null);
    }
  };

  // Handle location selection from location picker
  const handleLocationPickerConfirm = (selectedLocation) => {
    setLocation({
      address: selectedLocation.address,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    });
    
    // Update form fields if available
    if (selectedLocation.address) {
      setValue('address', selectedLocation.address);
    }
    
    setGeocodingError(null);
    closeLocationPicker();
    
    toast({
      title: 'Location Updated! ✓',
      description: 'Exact location has been set.',
      status: 'success',
      duration: 3000,
    });
  };

  const onSubmit = async (data) => {
    // Validate location is set
    if (!location) {
      toast({
        title: 'Location Required',
        description: 'Please geocode the address or pick a location on the map.',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    // Prepare property data with geocoded location
    const propertyData = {
      ...data,
      amenities: selectedAmenities,
      location: {
        address: location.address,
        city: data.city,
        latitude: location.latitude,
        longitude: location.longitude,
        placeId: location.placeId,
      },
    };

    // TODO: Replace with actual API call to backend
    console.log('Property data with geocoded location:', propertyData);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Property Data Ready!',
      description: 'Property has been prepared with accurate GPS coordinates. Check console for details.',
      status: 'success',
      duration: 3000,
    });
    
    navigate('/owner/properties');
  };

  return (
    <Box>
      {/* Page Header */}
      <HStack justify="space-between" mb={8}>
        <VStack align="start" spacing={2}>
          <Heading size="lg">Add New Property</Heading>
          <Text color="gray.600">
            Fill in the details to list your property
          </Text>
        </VStack>
        <Button
          leftIcon={<Icon as={FiX} />}
          variant="ghost"
          onClick={() => navigate('/owner/properties')}
        >
          Cancel
        </Button>
      </HStack>

      {/* Form */}
      <Box
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        bg="white"
        p={8}
        borderRadius="lg"
        border="1px"
        borderColor="gray.200"
      >
        <VStack spacing={6} align="stretch">
          {/* Basic Information */}
          <Box>
            <Heading size="md" mb={4}>Basic Information</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isInvalid={errors.title}>
                <FormLabel>Property Title *</FormLabel>
                <Input
                  {...register('title', { required: 'Title is required' })}
                  placeholder="e.g., Modern Studio Room with City View"
                />
                {errors.title && (
                  <Text color="error.500" fontSize="sm" mt={1}>
                    {errors.title.message}
                  </Text>
                )}
              </FormControl>

              <FormControl isInvalid={errors.bedType}>
                <FormLabel>Room Type *</FormLabel>
                <Select
                  {...register('bedType', { required: 'Room type is required' })}
                  placeholder="Select room type"
                >
                  <option value="Single Bed">Single Bed</option>
                  <option value="Double Bed">Double Bed</option>
                  <option value="Queen Bed">Queen Bed</option>
                  <option value="King Bed">King Bed</option>
                  <option value="Multiple Beds">Multiple Beds</option>
                </Select>
              </FormControl>

              <FormControl isInvalid={errors.price}>
                <FormLabel>Monthly Price (₱) *</FormLabel>
                <Input
                  {...register('price', { required: 'Price is required' })}
                  type="number"
                  placeholder="e.g., 3500"
                />
              </FormControl>

              <FormControl isInvalid={errors.availablePerson}>
                <FormLabel>Max Occupancy *</FormLabel>
                <Input
                  {...register('availablePerson', { required: 'Occupancy is required' })}
                  type="number"
                  placeholder="e.g., 2"
                />
              </FormControl>
            </SimpleGrid>
          </Box>

          {/* Location */}
          <Box>
            <Heading size="md" mb={4}>Location</Heading>
            
            {/* Location Autocomplete */}
            <FormControl mb={4}>
              <FormLabel>Search Location</FormLabel>
              <LocationAutocomplete
                placeholder="Search for your property location..."
                onSelect={handleLocationSelect}
                showCurrentLocation={false}
              />
              <Text fontSize="xs" color="gray.500" mt={2}>
                💡 Use autocomplete to quickly find and fill in the address
              </Text>
            </FormControl>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isInvalid={errors.city}>
                <FormLabel>City *</FormLabel>
                <Input
                  {...register('city', { required: 'City is required' })}
                  placeholder="e.g., Quezon City"
                />
              </FormControl>

              <FormControl isInvalid={errors.address}>
                <FormLabel>Full Address *</FormLabel>
                <Input
                  {...register('address', { required: 'Address is required' })}
                  placeholder="e.g., 123 Main St, Barangay..."
                  onBlur={handleAddressBlur}
                />
                {errors.address && (
                  <Text color="error.500" fontSize="sm" mt={1}>
                    {errors.address.message}
                  </Text>
                )}
              </FormControl>
            </SimpleGrid>

            {/* Geocoding Status */}
            {isGeocoding && (
              <Alert status="info" mt={4}>
                <Spinner size="sm" mr={2} />
                <Text fontSize="sm">Geocoding address...</Text>
              </Alert>
            )}

            {location && !geocodingError && (
              <Alert status="success" mt={4}>
                <AlertIcon as={FiCheck} />
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontSize="sm" fontWeight="semibold">
                    ✓ Location Verified
                  </Text>
                  <Text fontSize="xs" color="gray.700">
                    {location.address}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    📍 {geocodingService.formatCoordinates(location.latitude, location.longitude)}
                  </Text>
                </VStack>
                <Button
                  size="sm"
                  leftIcon={<Icon as={FiMapPin} />}
                  onClick={openLocationPicker}
                  ml={2}
                >
                  Adjust on Map
                </Button>
              </Alert>
            )}

            {geocodingError && (
              <Alert status="error" mt={4}>
                <AlertIcon />
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontSize="sm" fontWeight="semibold">
                    Geocoding Failed
                  </Text>
                  <Text fontSize="xs">{geocodingError}</Text>
                </VStack>
                <Button
                  size="sm"
                  leftIcon={<Icon as={FiMapPin} />}
                  onClick={openLocationPicker}
                  ml={2}
                >
                  Pick on Map
                </Button>
              </Alert>
            )}

            {!location && !isGeocoding && !geocodingError && (
              <Alert status="warning" mt={4}>
                <AlertIcon />
                <Text fontSize="sm" flex={1}>
                  Enter address and click outside the field to geocode, or pick location on map
                </Text>
                <Button
                  size="sm"
                  leftIcon={<Icon as={FiMapPin} />}
                  onClick={openLocationPicker}
                  ml={2}
                >
                  Pick on Map
                </Button>
              </Alert>
            )}
          </Box>

          {/* Description with AI Assist */}
          <Box>
            <HStack justify="space-between" mb={4}>
              <Heading size="md">Description</Heading>
              <Button
                leftIcon={<Icon as={FiZap} />}
                size="sm"
                colorScheme="purple"
                variant="outline"
                onClick={handleAIAssist}
                isLoading={isGenerating}
                loadingText="Generating..."
              >
                AI Assist
              </Button>
            </HStack>
            <FormControl isInvalid={errors.description}>
              <Textarea
                {...register('description', { required: 'Description is required' })}
                placeholder="Describe your property..."
                rows={6}
              />
              <Text fontSize="xs" color="gray.500" mt={2}>
                💡 Tip: Click "AI Assist" to generate a professional description based on your property details
              </Text>
            </FormControl>
          </Box>

          {/* Amenities */}
          <Box>
            <Heading size="md" mb={4}>Amenities</Heading>
            <CheckboxGroup value={selectedAmenities} onChange={setSelectedAmenities}>
              <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
                {amenitiesList.map((amenity) => (
                  <Checkbox key={amenity} value={amenity}>
                    {amenity}
                  </Checkbox>
                ))}
              </SimpleGrid>
            </CheckboxGroup>
          </Box>

          {/* Images */}
          <Box>
            <Heading size="md" mb={4}>Images</Heading>
            <FormControl>
              <FormLabel>Property Images</FormLabel>
              <Input
                type="file"
                accept="image/*"
                multiple
                p={1}
              />
              <Text fontSize="xs" color="gray.500" mt={2}>
                Upload up to 10 images (JPG, PNG). First image will be the cover photo.
              </Text>
            </FormControl>
          </Box>

          {/* Submit Buttons */}
          <HStack spacing={4} pt={4}>
            <Button
              variant="outline"
              onClick={() => navigate('/owner/properties')}
              flex={1}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              leftIcon={<Icon as={FiSave} />}
              colorScheme="primary"
              flex={1}
            >
              Save Property
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* Location Picker Modal */}
      <Modal isOpen={isLocationPickerOpen} onClose={closeLocationPicker} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pick Exact Location</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <LocationPicker
              initialLocation={location ? {
                lat: location.latitude,
                lng: location.longitude,
              } : null}
              onLocationSelect={handleLocationPickerConfirm}
              onCancel={closeLocationPicker}
              height="500px"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AddPropertyPage;
