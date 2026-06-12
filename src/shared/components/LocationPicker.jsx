import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  Alert,
  AlertIcon,
  Spinner,
  Badge,
} from '@chakra-ui/react';
import { FiMapPin, FiCheck, FiX } from 'react-icons/fi';
import { colors, spacing, borderRadius, typography } from '../styles/tokens';
import geocodingService from '../../services/geocoding/geocodingService';

const libraries = ['places'];

/**
 * LocationPicker Component
 * Interactive map for selecting property location
 * Allows dragging marker to adjust exact position
 */
const LocationPicker = ({
  initialLocation = null,
  onLocationSelect,
  onCancel,
  height = '400px',
}) => {
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(
    initialLocation || {
      lat: 14.5995, // Manila default
      lng: 120.9842,
    }
  );
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidLocation, setIsValidLocation] = useState(true);
  const mapRef = useRef();

  const mapContainerStyle = {
    width: '100%',
    height: height,
  };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    gestureHandling: 'greedy',
  };

  // Initialize with initial location
  useEffect(() => {
    if (initialLocation) {
      setMarkerPosition(initialLocation);
      reverseGeocodeLocation(initialLocation.lat, initialLocation.lng);
    }
  }, [initialLocation]);

  const onLoad = useCallback((map) => {
    setMap(map);
    mapRef.current = map;
  }, []);

  const onMarkerDragEnd = useCallback(async (event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();

    setMarkerPosition({ lat: newLat, lng: newLng });
    await reverseGeocodeLocation(newLat, newLng);
  }, []);

  const reverseGeocodeLocation = async (lat, lng) => {
    setIsLoading(true);
    try {
      const result = await geocodingService.reverseGeocode(lat, lng);
      
      if (result.success) {
        setAddress(result.address);
        
        // Check if location is in Philippines
        const isInPH = geocodingService._isWithinPhilippines(lat, lng);
        setIsValidLocation(isInPH);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      setAddress('Unable to get address');
      setIsValidLocation(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!isValidLocation) {
      return;
    }

    if (onLocationSelect) {
      onLocationSelect({
        latitude: markerPosition.lat,
        longitude: markerPosition.lng,
        address: address,
        coordinates: markerPosition,
      });
    }
  };

  const handleMapClick = useCallback((event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    
    setMarkerPosition({ lat: newLat, lng: newLng });
    reverseGeocodeLocation(newLat, newLng);
  }, []);

  return (
    <Box>
      <VStack spacing={spacing[4]} align="stretch">
        {/* Map */}
        <Box
          borderRadius={borderRadius.lg}
          overflow="hidden"
          border={`2px solid ${isValidLocation ? colors.primary[500] : colors.error[500]}`}
          position="relative"
        >
          <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            libraries={libraries}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={markerPosition}
              zoom={15}
              options={mapOptions}
              onLoad={onLoad}
              onClick={handleMapClick}
            >
              <Marker
                position={markerPosition}
                draggable={true}
                onDragEnd={onMarkerDragEnd}
                icon={{
                  path: window.google?.maps?.SymbolPath?.CIRCLE,
                  scale: 10,
                  fillColor: isValidLocation ? colors.primary[500] : colors.error[500],
                  fillOpacity: 1,
                  strokeColor: 'white',
                  strokeWeight: 2,
                }}
              />
            </GoogleMap>
          </LoadScript>

          {/* Crosshair indicator */}
          {isLoading && (
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              bg="white"
              p={spacing[3]}
              borderRadius={borderRadius.lg}
              boxShadow="lg"
            >
              <HStack spacing={spacing[2]}>
                <Spinner size="sm" color={colors.primary[500]} />
                <Text fontSize={typography.fontSize.sm}>Getting address...</Text>
              </HStack>
            </Box>
          )}
        </Box>

        {/* Instructions */}
        <Alert status="info" borderRadius={borderRadius.md}>
          <AlertIcon />
          <Text fontSize={typography.fontSize.sm}>
            💡 Drag the marker or click on the map to adjust the exact location
          </Text>
        </Alert>

        {/* Address Display */}
        <Box
          bg={colors.gray[50]}
          p={spacing[4]}
          borderRadius={borderRadius.md}
          border={`1px solid ${colors.gray[200]}`}
        >
          <VStack align="stretch" spacing={spacing[2]}>
            <HStack justify="space-between">
              <Text
                fontSize={typography.fontSize.sm}
                fontWeight={typography.fontWeight.semibold}
                color={colors.gray[700]}
              >
                Selected Location
              </Text>
              {isValidLocation ? (
                <Badge colorScheme="green" fontSize="xs">
                  <HStack spacing={1}>
                    <Icon as={FiCheck} />
                    <Text>Philippines</Text>
                  </HStack>
                </Badge>
              ) : (
                <Badge colorScheme="red" fontSize="xs">
                  <HStack spacing={1}>
                    <Icon as={FiX} />
                    <Text>Not in Philippines</Text>
                  </HStack>
                </Badge>
              )}
            </HStack>

            <Text fontSize={typography.fontSize.sm} color={colors.gray[900]}>
              {address || 'Loading address...'}
            </Text>

            <Text fontSize={typography.fontSize.xs} color={colors.gray[500]}>
              📍 {geocodingService.formatCoordinates(markerPosition.lat, markerPosition.lng)}
            </Text>
          </VStack>
        </Box>

        {/* Validation Warning */}
        {!isValidLocation && (
          <Alert status="error" borderRadius={borderRadius.md}>
            <AlertIcon />
            <Text fontSize={typography.fontSize.sm}>
              ⚠️ This location is outside Philippines. Please select a location within the Philippines.
            </Text>
          </Alert>
        )}

        {/* Action Buttons */}
        <HStack spacing={spacing[3]} justify="flex-end">
          {onCancel && (
            <Button
              variant="ghost"
              onClick={onCancel}
              leftIcon={<Icon as={FiX} />}
            >
              Cancel
            </Button>
          )}
          <Button
            colorScheme="primary"
            onClick={handleConfirm}
            isDisabled={!isValidLocation || !address}
            leftIcon={<Icon as={FiMapPin} />}
          >
            Confirm Location
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default LocationPicker;
