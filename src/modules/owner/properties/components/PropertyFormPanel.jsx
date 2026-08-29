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
import { FiSave, FiZap, FiMapPin, FiCheck, FiHome } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import SidePanel from '../../../../shared/components/SidePanel';
import { listingWriterService } from '../../../../services/ai';
import geocodingService from '../../../../services/geocoding/geocodingService';
import LocationPicker from '../../../../shared/components/LocationPicker';
import LocationAutocomplete from '../../../../shared/components/LocationAutocomplete';
import { useAuth } from '../../../../app/providers/AuthProvider';
import useRentalStore from '../../../../shared/stores/useRentalStore';
import { useDraftAutosave, readDraft, clearDraft } from '../../../../shared/hooks/useDraftAutosave';
import { useAppToast } from '../../../../shared/hooks/useAppToast';
import ImageUploadField from '../../../../shared/components/ImageUploadField';
import UnitsManager from '../UnitsManager';
import AMENITIES_LIST from '../../../../data/amenities.json';

/**
 * Add/Edit Property side panel — unifies AddPropertyPage + EditPropertyPage
 * (their form bodies were ~90% identical) into one SidePanel instead of two
 * full-page routes. Draft-autosave keeps working unchanged since it's just
 * localStorage keyed by a string, unaffected by where the JSX lives.
 *
 * Props: { mode: 'add' | 'edit', propertyId?, isOpen, onClose }
 */
const PropertyFormPanel = ({ mode, propertyId, isOpen, onClose }) => {
  const isEdit = mode === 'edit';
  const toast = useAppToast();
  const { user } = useAuth();
  const rentals = useRentalStore((state) => state.rentals) || [];
  const addRental = useRentalStore((state) => state.addRental);
  const updateRental = useRentalStore((state) => state.updateRental);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState(null);
  const [hasDraft, setHasDraft] = useState(false);
  const { isOpen: isLocationPickerOpen, onOpen: openLocationPicker, onClose: closeLocationPicker } = useDisclosure();

  const draftKey = isEdit ? `rentme_draft_edit_property_${propertyId}` : 'rentme_draft_add_property';

  // Prefill from the store when editing; reset to blank when adding.
  useEffect(() => {
    if (!isOpen) return;

    if (isEdit) {
      const property = rentals.find((r) => r.id === propertyId);
      if (property) {
        reset({
          title: property.title,
          propertyType: property.propertyType,
          bedType: property.bedType,
          price: property.price,
          availablePerson: property.availablePerson,
          city: property.city,
          address: property.address,
          description: property.description,
        });
        setSelectedAmenities(property.amenities || []);
        setImages(property.imageUrl || []);
      }
    } else {
      reset({});
      setSelectedAmenities([]);
      setImages([]);
      setLocation(null);
      setGeocodingError(null);
    }
    setHasDraft(Boolean(readDraft(draftKey)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isEdit, propertyId]);

  const restoreDraft = () => {
    const draft = readDraft(draftKey);
    if (!draft) return;

    ['title', 'propertyType', 'bedType', 'price', 'availablePerson', 'city', 'address', 'description'].forEach((field) => {
      if (draft.fields?.[field] !== undefined) setValue(field, draft.fields[field]);
    });
    if (draft.selectedAmenities) setSelectedAmenities(draft.selectedAmenities);
    if (draft.location) setLocation(draft.location);
    setHasDraft(false);
    toast({ title: 'Draft Restored', status: 'info', duration: 2000 });
  };

  const discardDraft = () => {
    clearDraft(draftKey);
    setHasDraft(false);
  };

  const watchedFields = watch();

  useDraftAutosave(
    draftKey,
    { fields: watchedFields, selectedAmenities, location },
    { enabled: isOpen && !hasDraft }
  );

  const handleAIAssist = async () => {
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
      if (!title) {
        toast({ title: 'Missing Information', description: 'Please enter a property title first.', status: 'warning', duration: 3000 });
        setIsGenerating(false);
        return;
      }

      const generatedDescription = await listingWriterService.generateDescription({
        title,
        location: city,
        address,
        propertyType: propertyType || 'Rental Property',
        amenities: selectedAmenities,
        price: price ? parseFloat(price) : null,
        bedType,
        availablePerson: watchedFields.availablePerson,
      });

      setValue('description', generatedDescription);
      toast({ title: 'Description Generated! ✨', status: 'success', duration: 3000, isClosable: true });
    } catch (error) {
      toast({ title: 'Generation Failed', description: error.message || 'Please try again.', status: 'error', duration: 5000, isClosable: true });
    } finally {
      setIsGenerating(false);
    }
  };

  const geocodeAddress = async (address) => {
    if (!geocodingService.isAvailable()) {
      toast({ title: 'Google Maps Not Configured', description: 'Please add your Google Maps API key to use geocoding.', status: 'warning', duration: 5000 });
      return;
    }

    setIsGeocoding(true);
    setGeocodingError(null);
    try {
      const result = await geocodingService.validatePhilippinesAddress(address);
      if (result.isValid) {
        setLocation(result.location);
        toast({ title: 'Location Found! ✓', status: 'success', duration: 3000 });
      } else {
        setGeocodingError(result.message);
        toast({ title: 'Invalid Address', description: result.message, status: 'error', duration: 5000 });
      }
    } catch (error) {
      setGeocodingError(error.message);
      toast({ title: 'Geocoding Failed', description: error.message, status: 'error', duration: 5000 });
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleAddressBlur = async () => {
    const { city, address } = watchedFields;
    if (!city || !address) return;
    await geocodeAddress(`${address}, ${city}, Philippines`);
  };

  const handleLocationSelect = (selectedLocation) => {
    if (selectedLocation.city) setValue('city', selectedLocation.city);
    if (selectedLocation.address) setValue('address', selectedLocation.address);
    if (selectedLocation.latitude && selectedLocation.longitude) {
      setLocation({
        address: selectedLocation.address,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        placeId: selectedLocation.placeId,
        addressComponents: { city: selectedLocation.city },
      });
      setGeocodingError(null);
    }
  };

  const handleLocationPickerConfirm = (selectedLocation) => {
    setLocation({ address: selectedLocation.address, latitude: selectedLocation.latitude, longitude: selectedLocation.longitude });
    if (selectedLocation.address) setValue('address', selectedLocation.address);
    setGeocodingError(null);
    closeLocationPicker();
    toast({ title: 'Location Updated! ✓', status: 'success', duration: 3000 });
  };

  const onSubmit = async (data) => {
    if (isEdit) {
      updateRental(propertyId, {
        title: data.title,
        propertyType: data.propertyType,
        bedType: data.bedType,
        price: parseFloat(data.price),
        availablePerson: parseInt(data.availablePerson, 10),
        city: data.city,
        address: data.address,
        description: data.description,
        amenities: selectedAmenities,
        imageUrl: images,
      });
      clearDraft(draftKey);
      toast({ title: 'Property Updated!', status: 'success', duration: 3000 });
      onClose();
      return;
    }

    if (!location) {
      toast({ title: 'Location Required', description: 'Please geocode the address or pick a location on the map.', status: 'error', duration: 5000 });
      return;
    }

    addRental({
      title: data.title,
      propertyType: data.propertyType,
      description: data.description,
      city: data.city,
      address: location.address || data.address,
      latitude: location.latitude,
      longitude: location.longitude,
      price: parseFloat(data.price),
      availablePerson: parseInt(data.availablePerson, 10),
      bedType: data.bedType,
      imageUrl: images,
      amenities: selectedAmenities,
      ownerEmail: user.email,
      ownerName: user.name,
      ownerPhone: user.phone || '',
      status: 'active',
      moderationStatus: 'pending',
      availableDates: [],
      createdAt: new Date().toISOString(),
    });
    clearDraft(draftKey);
    toast({ title: 'Property Added!', description: 'Your property has been listed and is pending review.', status: 'success', duration: 3000, isClosable: true });
    onClose();
  };

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Property' : 'Add Property'}
      icon={FiHome}
      size="lg"
      footer={
        <HStack spacing={3} w="full">
          <Button variant="outline" onClick={onClose} flex={1}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="property-form-panel"
            leftIcon={<Icon as={FiSave} />}
            colorScheme="primary"
            flex={1}
          >
            {isEdit ? 'Save Changes' : 'Save Property'}
          </Button>
        </HStack>
      }
    >
      {hasDraft && (
        <Alert status="info" borderRadius="lg" mb={6}>
          <AlertIcon />
          <Text flex={1} fontSize="sm">
            You have an unsaved draft.
          </Text>
          <Button size="sm" colorScheme="primary" mr={2} onClick={restoreDraft}>
            Restore
          </Button>
          <Button size="sm" variant="ghost" onClick={discardDraft}>
            Discard
          </Button>
        </Alert>
      )}

      <Box as="form" id="property-form-panel" onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="sm" mb={4}>Basic Information</Heading>
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={errors.title}>
                <FormLabel>Property Title *</FormLabel>
                <Input {...register('title', { required: 'Title is required' })} placeholder="e.g., Modern Studio Room with City View" />
                {errors.title && <Text color="error.600" fontSize="sm" mt={1}>{errors.title.message}</Text>}
              </FormControl>

              <FormControl isInvalid={errors.propertyType}>
                <FormLabel>Property Type *</FormLabel>
                <Select {...register('propertyType', { required: 'Property type is required' })} placeholder="Select property type">
                  <option value="dormitory">Dormitory</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condominium</option>
                  <option value="bedspace">Bed Space</option>
                </Select>
                {errors.propertyType && <Text color="error.600" fontSize="sm" mt={1}>{errors.propertyType.message}</Text>}
              </FormControl>

              <FormControl isInvalid={errors.bedType}>
                <FormLabel>Room Type *</FormLabel>
                <Select {...register('bedType', { required: 'Room type is required' })} placeholder="Select room type">
                  <option value="Single Bed">Single Bed</option>
                  <option value="Double Bed">Double Bed</option>
                  <option value="Queen Bed">Queen Bed</option>
                  <option value="King Bed">King Bed</option>
                  <option value="Multiple Beds">Multiple Beds</option>
                </Select>
              </FormControl>

              <SimpleGrid columns={2} spacing={4}>
                <FormControl isInvalid={errors.price}>
                  <FormLabel>Monthly Price (₱) *</FormLabel>
                  <Input {...register('price', { required: 'Price is required' })} type="number" placeholder="e.g., 3500" />
                </FormControl>
                <FormControl isInvalid={errors.availablePerson}>
                  <FormLabel>Max Occupancy *</FormLabel>
                  <Input {...register('availablePerson', { required: 'Occupancy is required' })} type="number" placeholder="e.g., 2" />
                </FormControl>
              </SimpleGrid>
            </VStack>
          </Box>

          <Box>
            <Heading size="sm" mb={4}>Location</Heading>
            {!isEdit && (
              <FormControl mb={4}>
                <FormLabel>Search Location</FormLabel>
                <LocationAutocomplete placeholder="Search for your property location..." onSelect={handleLocationSelect} showCurrentLocation={false} />
              </FormControl>
            )}

            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={errors.city}>
                <FormLabel>City *</FormLabel>
                <Input {...register('city', { required: 'City is required' })} placeholder="e.g., Dagupan" />
              </FormControl>

              <FormControl isInvalid={errors.address}>
                <FormLabel>Full Address *</FormLabel>
                <Input
                  {...register('address', { required: 'Address is required' })}
                  placeholder="e.g., 123 Main St, Barangay..."
                  onBlur={!isEdit ? handleAddressBlur : undefined}
                />
              </FormControl>
            </VStack>

            {!isEdit && isGeocoding && (
              <Alert status="info" mt={4}>
                <Spinner size="sm" mr={2} />
                <Text fontSize="sm">Geocoding address...</Text>
              </Alert>
            )}

            {!isEdit && location && !geocodingError && (
              <Alert status="success" mt={4}>
                <AlertIcon as={FiCheck} />
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontSize="sm" fontWeight="semibold">✓ Location Verified</Text>
                  <Text fontSize="xs" color="gray.700">{location.address}</Text>
                </VStack>
                <Button size="sm" leftIcon={<Icon as={FiMapPin} />} onClick={openLocationPicker} ml={2}>
                  Adjust
                </Button>
              </Alert>
            )}

            {!isEdit && geocodingError && (
              <Alert status="error" mt={4}>
                <AlertIcon />
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontSize="sm" fontWeight="semibold">Geocoding Failed</Text>
                  <Text fontSize="xs">{geocodingError}</Text>
                </VStack>
                <Button size="sm" leftIcon={<Icon as={FiMapPin} />} onClick={openLocationPicker} ml={2}>
                  Pick on Map
                </Button>
              </Alert>
            )}

            {!isEdit && !location && !isGeocoding && !geocodingError && (
              <Alert status="warning" mt={4}>
                <AlertIcon />
                <Text fontSize="sm" flex={1}>Enter address and click outside the field to geocode, or pick location on map</Text>
                <Button size="sm" leftIcon={<Icon as={FiMapPin} />} onClick={openLocationPicker} ml={2}>
                  Pick on Map
                </Button>
              </Alert>
            )}
          </Box>

          <Box>
            <HStack justify="space-between" mb={4}>
              <Heading size="sm">Description</Heading>
              <Button leftIcon={<Icon as={FiZap} />} size="sm" colorScheme="purple" variant="outline" onClick={handleAIAssist} isLoading={isGenerating} loadingText="Generating...">
                AI Assist
              </Button>
            </HStack>
            <FormControl isInvalid={errors.description}>
              <Textarea {...register('description', { required: 'Description is required' })} placeholder="Describe your property..." rows={5} />
            </FormControl>
          </Box>

          <Box>
            <Heading size="sm" mb={4}>Amenities</Heading>
            <CheckboxGroup value={selectedAmenities} onChange={setSelectedAmenities}>
              <SimpleGrid columns={2} spacing={3}>
                {AMENITIES_LIST.map((amenity) => (
                  <Checkbox key={amenity} value={amenity} fontSize="sm">{amenity}</Checkbox>
                ))}
              </SimpleGrid>
            </CheckboxGroup>
          </Box>

          <Box>
            <Heading size="sm" mb={4}>Images</Heading>
            <ImageUploadField value={images} onChange={setImages} />
          </Box>

          {isEdit && propertyId && (
            <Box>
              <Heading size="sm" mb={4}>Units</Heading>
              <UnitsManager rentalId={propertyId} />
            </Box>
          )}
        </VStack>
      </Box>

      <Modal isOpen={isLocationPickerOpen} onClose={closeLocationPicker} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pick Exact Location</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <LocationPicker
              initialLocation={location ? { lat: location.latitude, lng: location.longitude } : null}
              onLocationSelect={handleLocationPickerConfirm}
              onCancel={closeLocationPicker}
              height="500px"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </SidePanel>
  );
};

export default PropertyFormPanel;
