import { useState, useRef } from 'react';
import { Autocomplete, LoadScript } from '@react-google-maps/api';
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Text,
  Flex,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import { FiMapPin, FiNavigation } from 'react-icons/fi';
import { colors, spacing, borderRadius, typography, shadows } from '../styles/tokens';

const libraries = ['places'];

/**
 * LocationAutocomplete Component
 * Provides location search with Google Places autocomplete for Philippines
 * Replaced mock data with real Google Places API integration
 */
const LocationAutocomplete = ({
  placeholder = 'Search location in Philippines...',
  onSelect,
  showCurrentLocation = true,
  ...props
}) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();

      if (place.geometry) {
        const location = {
          id: place.place_id,
          name: place.name || place.formatted_address,
          address: place.formatted_address,
          city: place.address_components?.find(
            (c) => c.types.includes('locality') || c.types.includes('administrative_area_level_2')
          )?.long_name || '',
          type: place.types?.[0] || 'location',
          coordinates: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          placeId: place.place_id,
        };

        if (onSelect) {
          onSelect(location);
        }
      }
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode to get location name using Geocoding API
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results, status) => {
              setIsLoading(false);
              
              if (status === 'OK' && results[0]) {
                const result = results[0];
                const city = result.address_components?.find(
                  (c) => c.types.includes('locality')
                )?.long_name || '';

                if (inputRef.current) {
                  inputRef.current.value = result.formatted_address;
                }

                if (onSelect) {
                  onSelect({
                    id: result.place_id,
                    name: 'Current Location',
                    address: result.formatted_address,
                    city: city,
                    type: 'Current',
                    coordinates: { lat: latitude, lng: longitude },
                    latitude: latitude,
                    longitude: longitude,
                    placeId: result.place_id,
                  });
                }
              } else {
                // Fallback if geocoding fails
                if (inputRef.current) {
                  inputRef.current.value = 'Current Location';
                }
                
                if (onSelect) {
                  onSelect({
                    name: 'Current Location',
                    type: 'Current',
                    coordinates: { lat: latitude, lng: longitude },
                    latitude: latitude,
                    longitude: longitude,
                  });
                }
              }
            }
          );
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        }
      );
    }
  };

  return (
    <Box position="relative" width="100%" {...props}>
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
      >
        {showCurrentLocation && (
          <Box mb={spacing[2]}>
            <Flex
              as="button"
              type="button"
              alignItems="center"
              gap={spacing[2]}
              px={spacing[3]}
              py={spacing[2]}
              bg="white"
              border={`1px solid ${colors.gray[200]}`}
              borderRadius={borderRadius.lg}
              cursor="pointer"
              transition="all 0.2s"
              width="100%"
              onClick={handleCurrentLocation}
              disabled={isLoading}
              _hover={{
                bg: colors.gray[50],
                borderColor: colors.primary[300],
              }}
              _active={{
                bg: colors.gray[100],
              }}
            >
              {isLoading ? (
                <Spinner size="sm" color={colors.primary[500]} />
              ) : (
                <Icon as={FiNavigation} color={colors.primary[500]} />
              )}
              <Text
                fontSize={typography.fontSize.sm}
                fontWeight={typography.fontWeight.medium}
                color={colors.primary[700]}
              >
                {isLoading ? 'Getting your location...' : 'Use Current Location'}
              </Text>
            </Flex>
          </Box>
        )}

        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
          options={{
            componentRestrictions: { country: 'ph' }, // Philippines only
            types: ['geocode', 'establishment'],
            fields: [
              'place_id',
              'geometry',
              'name',
              'formatted_address',
              'address_components',
              'types',
            ],
          }}
        >
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiMapPin} color={colors.gray[400]} />
            </InputLeftElement>
            <Input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              bg="white"
              borderColor={colors.gray[200]}
              borderRadius={borderRadius.lg}
              fontSize={typography.fontSize.base}
              _focus={{
                borderColor: colors.primary[500],
                boxShadow: `0 0 0 1px ${colors.primary[500]}`,
              }}
              _placeholder={{
                color: colors.gray[400],
              }}
            />
          </InputGroup>
        </Autocomplete>
      </LoadScript>
    </Box>
  );
};

export default LocationAutocomplete;
