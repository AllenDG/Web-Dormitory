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
import { FiSave, FiMapPin, FiCheck, FiHome } from 'react-icons/fi';
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import SidePanel from '../../../../shared/components/SidePanel';
import geocodingService from '../../../../services/geocoding/geocodingService';
import LocationPicker from '../../../../shared/components/LocationPicker';
import LocationAutocomplete from '../../../../shared/components/LocationAutocomplete';
import { useAuth } from '../../../../app/providers/AuthProvider';
import useRentalStore from '../../../../shared/stores/useRentalStore';
import useAdminStore from '../../../../shared/stores/useAdminStore';
import useAuditLogStore from '../../../../shared/stores/useAuditLogStore';
import { useAppToast } from '../../../../shared/hooks/useAppToast';
import ImageUploadField from '../../../../shared/components/ImageUploadField';
import UnitsManager from '../../../owner/properties/UnitsManager';
import AMENITIES_LIST from '../../../../data/amenities.json';

/**
 * Admin Add/Edit Property side panel — the bypass tier for Property
 * Management. Unlike Owner's PropertyFormPanel, this one lets Admin author
 * a listing on any owner's behalf (Owner Assignment) and directly set the
 * moderation outcome (Moderation Status), skipping the normal pending-
 * review queue entirely — that's the bypass. Duplicated-and-adapted from
 * the owner form rather than shared, to avoid regression risk to the
 * owner's working flow (see Round 3 plan §3).
 *
 * Props: { mode: 'add' | 'edit', propertyId?, isOpen, onClose }
 */
const AdminPropertyFormPanel = ({ mode, propertyId, isOpen, onClose }) => {
  const isEdit = mode === 'edit';
  const toast = useAppToast();
  const { user: actor } = useAuth();
  const rentals = useRentalStore((state) => state.rentals) || [];
  const addRental = useRentalStore((state) => state.addRental);
  const updateRental = useRentalStore((state) => state.updateRental);
  const allUsers = useAdminStore((state) => state.users);
  const owners = useMemo(() => allUsers.filter((u) => u.role === 'owner'), [allUsers]);
  const logAction = useAuditLogStore((state) => state.logAction);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm();
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState(null);
  const [moderationStatus, setModerationStatus] = useState('approved');
  const [rejectionReason, setRejectionReason] = useState('');
  const { isOpen: isLocationPickerOpen, onOpen: openLocationPicker, onClose: closeLocationPicker } = useDisclosure();

  // Prefill from the store when editing; reset to blank when adding.
  useEffect(() => {
    if (!isOpen) return;

    if (isEdit) {
      const property = rentals.find((r) => r.id === propertyId);
      if (property) {
        reset({
          title: property.title,
          bedType: property.bedType,
          price: property.price,
          availablePerson: property.availablePerson,
          city: property.city,
          address: property.address,
          description: property.description,
          ownerEmail: property.ownerEmail,
        });
        setSelectedAmenities(property.amenities || []);
        setImages(property.imageUrl || []);
        setModerationStatus(property.moderationStatus || 'approved');
        setRejectionReason(property.rejectionReason || '');
      }
    } else {
      reset({});
      setSelectedAmenities([]);
      setImages([]);
      setLocation(null);
      setGeocodingError(null);
      setModerationStatus('approved');
      setRejectionReason('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isEdit, propertyId]);

  const watchedFields = watch();

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
      const property = rentals.find((r) => r.id === propertyId);
      updateRental(propertyId, {
        title: data.title,
        bedType: data.bedType,
        price: parseFloat(data.price),
        availablePerson: parseInt(data.availablePerson, 10),
        city: data.city,
        address: data.address,
        description: data.description,
        amenities: selectedAmenities,
        imageUrl: images,
        moderationStatus,
        rejectionReason: moderationStatus === 'rejected' ? rejectionReason : '',
      });
      logAction({ actorEmail: actor?.email, actorName: actor?.name, action: 'property.updated', target: property?.title || data.title });
      toast({ title: 'Property Updated!', status: 'success', duration: 3000 });
      onClose();
      return;
    }

    if (!location) {
      toast({ title: 'Location Required', description: 'Please geocode the address or pick a location on the map.', status: 'error', duration: 5000 });
      return;
    }

    const owner = owners.find((o) => o.email === data.ownerEmail);
    if (!owner) {
      toast({ title: 'Owner Required', description: 'Select which owner this listing belongs to.', status: 'error', duration: 5000 });
      return;
    }

    addRental({
      title: data.title,
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
      ownerEmail: owner.email,
      ownerName: owner.name,
      ownerPhone: owner.phone || '',
      status: 'active',
      moderationStatus,
      rejectionReason: moderationStatus === 'rejected' ? rejectionReason : '',
      availableDates: [],
      createdAt: new Date().toISOString(),
    });
    logAction({ actorEmail: actor?.email, actorName: actor?.name, action: 'property.created', target: data.title });
    toast({ title: 'Property Added!', description: `Listed on behalf of ${owner.name}.`, status: 'success', duration: 3000, isClosable: true });
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
            form="admin-property-form-panel"
            leftIcon={<Icon as={FiSave} />}
            colorScheme="primary"
            flex={1}
          >
            {isEdit ? 'Save Changes' : 'Save Property'}
          </Button>
        </HStack>
      }
    >
      <Box as="form" id="admin-property-form-panel" onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={6} align="stretch">
          {!isEdit && (
            <Box>
              <Heading size="sm" mb={4}>Owner Assignment</Heading>
              <FormControl isInvalid={errors.ownerEmail}>
                <FormLabel>Owner *</FormLabel>
                <Select {...register('ownerEmail', { required: 'Select an owner' })} placeholder="Select owner">
                  {owners.map((owner) => (
                    <option key={owner.id} value={owner.email}>{owner.name} ({owner.email})</option>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          <Box>
            <Heading size="sm" mb={4}>Moderation Status</Heading>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select value={moderationStatus} onChange={(e) => setModerationStatus(e.target.value)}>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </Select>
            </FormControl>
            {moderationStatus === 'rejected' && (
              <FormControl mt={4}>
                <FormLabel>Rejection Reason</FormLabel>
                <Textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={2} />
              </FormControl>
            )}
          </Box>

          <Box>
            <Heading size="sm" mb={4}>Basic Information</Heading>
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={errors.title}>
                <FormLabel>Property Title *</FormLabel>
                <Input {...register('title', { required: 'Title is required' })} placeholder="e.g., Modern Studio Room with City View" />
                {errors.title && <Text color="error.600" fontSize="sm" mt={1}>{errors.title.message}</Text>}
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
                <LocationAutocomplete placeholder="Search for the property location..." onSelect={handleLocationSelect} showCurrentLocation={false} />
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
            <Heading size="sm" mb={4}>Description</Heading>
            <FormControl isInvalid={errors.description}>
              <Textarea {...register('description', { required: 'Description is required' })} placeholder="Describe the property..." rows={5} />
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

export default AdminPropertyFormPanel;
