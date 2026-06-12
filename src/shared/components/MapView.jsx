import { useState, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Box, VStack, Text, Heading, Image, Badge, Button } from '@chakra-ui/react';
import { colors, spacing, borderRadius, typography } from '../styles/tokens';

const libraries = ['places'];

/**
 * MapView Component
 * Interactive map with property markers using Google Maps
 * Replaced Mapbox with Google Maps for better Philippines location data
 */
const MapView = ({
  properties = [],
  selectedProperty = null,
  onPropertySelect,
  onPropertyClick,
  center = { lat: 14.5995, lng: 120.9842 }, // Manila default
  zoom = 12,
  height = '600px',
}) => {
  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
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
    styles: [
      // Subtle custom styling for better UX
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
    ],
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const onLoad = useCallback((map) => {
    setMap(map);
    mapRef.current = map;
  }, []);

  const handleMarkerClick = useCallback((property) => {
    setSelectedMarker(property.id);
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  }, [onPropertySelect]);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const handleViewProperty = useCallback((property) => {
    if (onPropertyClick) {
      onPropertyClick(property);
    }
  }, [onPropertyClick]);

  // Fly to property location
  const flyToProperty = useCallback((property) => {
    if (map) {
      map.panTo({
        lat: property.latitude || 14.5995,
        lng: property.longitude || 120.9842,
      });
      map.setZoom(15);
      setSelectedMarker(property.id);
    }
  }, [map]);

  // Mock coordinates for properties (in real app, these would come from database)
  const getPropertyCoordinates = (property) => {
    // If property has coordinates, use them
    if (property.latitude && property.longitude) {
      return {
        lat: property.latitude,
        lng: property.longitude,
      };
    }

    // Otherwise, generate mock coordinates based on city
    const cityCoordinates = {
      'Manila': { lat: 14.5995, lng: 120.9842 },
      'Quezon City': { lat: 14.6760, lng: 121.0437 },
      'Makati': { lat: 14.5547, lng: 121.0244 },
      'Taguig': { lat: 14.5176, lng: 121.0509 },
      'Pasig': { lat: 14.5764, lng: 121.0851 },
      'Dagupan': { lat: 16.0433, lng: 120.3334 },
      'Caloocan': { lat: 14.6492, lng: 120.9834 },
      'Antipolo': { lat: 14.5863, lng: 121.1756 },
    };

    const baseCoords = cityCoordinates[property.city] || cityCoordinates['Manila'];
    
    // Add small random offset to spread markers
    return {
      lat: baseCoords.lat + (Math.random() - 0.5) * 0.02,
      lng: baseCoords.lng + (Math.random() - 0.5) * 0.02,
    };
  };

  const isSelected = (propertyId) => {
    return selectedProperty?.id === propertyId || selectedMarker === propertyId;
  };

  return (
    <Box
      height={height}
      width="100%"
      borderRadius={borderRadius.lg}
      overflow="hidden"
      border={`1px solid ${colors.gray[200]}`}
    >
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          options={mapOptions}
          onLoad={onLoad}
        >
          {/* Property Markers */}
          {properties.map((property) => {
            const coords = getPropertyCoordinates(property);
            const selected = isSelected(property.id);

            return (
              <Marker
                key={property.id}
                position={coords}
                onClick={() => handleMarkerClick(property)}
                animation={selected ? window.google?.maps?.Animation?.BOUNCE : null}
                icon={{
                  path: window.google?.maps?.SymbolPath?.CIRCLE,
                  scale: selected ? 12 : 8,
                  fillColor: selected ? colors.primary[700] : colors.primary[500],
                  fillOpacity: 1,
                  strokeColor: 'white',
                  strokeWeight: 2,
                }}
                label={{
                  text: formatPrice(property.price),
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  className: 'marker-label',
                }}
              />
            );
          })}

          {/* Info Window */}
          {selectedMarker && (() => {
            const property = properties.find(p => p.id === selectedMarker);
            if (!property) return null;
            
            const coords = getPropertyCoordinates(property);
            
            return (
              <InfoWindow
                position={coords}
                onCloseClick={handleInfoWindowClose}
              >
                <VStack align="start" spacing={spacing[2]} p={spacing[1]} maxW="280px">
                  <Image
                    src={property.imageUrl[0]}
                    alt={property.title}
                    width="100%"
                    height="150px"
                    objectFit="cover"
                    borderRadius={borderRadius.md}
                  />
                  <Heading
                    fontSize={typography.fontSize.base}
                    fontWeight={typography.fontWeight.semibold}
                    color={colors.gray[900]}
                    noOfLines={2}
                  >
                    {property.title}
                  </Heading>
                  <Text fontSize={typography.fontSize.sm} color={colors.gray[600]}>
                    📍 {property.city}
                  </Text>
                  <Badge colorScheme="blue" fontSize="xs">
                    {property.bedType}
                  </Badge>
                  <Text
                    fontSize={typography.fontSize.lg}
                    fontWeight={typography.fontWeight.bold}
                    color={colors.primary[700]}
                  >
                    {formatPrice(property.price)}/month
                  </Text>
                  <Button
                    size="sm"
                    width="100%"
                    bg={colors.primary[700]}
                    color="white"
                    onClick={() => handleViewProperty(property)}
                    _hover={{
                      bg: colors.primary[800],
                    }}
                  >
                    View Details
                  </Button>
                </VStack>
              </InfoWindow>
            );
          })()}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default MapView;
