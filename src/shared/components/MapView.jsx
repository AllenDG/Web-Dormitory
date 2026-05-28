import { useState, useRef, useCallback } from 'react';
import Map, { Marker, Popup, NavigationControl, GeolocateControl } from 'react-map-gl';
import { Box, VStack, Text, Heading, Image, Badge, Button } from '@chakra-ui/react';
import { FiMapPin } from 'react-icons/fi';
import 'mapbox-gl/dist/mapbox-gl.css';
import { colors, spacing, borderRadius, typography } from '../styles/tokens';

/**
 * MapView Component
 * Interactive map with property markers
 * 
 * NOTE: This component requires a Mapbox access token
 * For development, you can use the demo token or get your own at https://mapbox.com
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
  // Demo token - Replace with your own Mapbox token
  const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGVtby11c2VyIiwiYSI6ImNrOGVxNzZ5YjBhcGczZW1yZGduMnJqNGQifQ.demo';
  
  const [viewState, setViewState] = useState({
    latitude: center.lat,
    longitude: center.lng,
    zoom: zoom,
  });

  const [popupInfo, setPopupInfo] = useState(null);
  const mapRef = useRef();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleMarkerClick = useCallback((property) => {
    setPopupInfo(property);
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  }, [onPropertySelect]);

  const handlePopupClose = useCallback(() => {
    setPopupInfo(null);
  }, []);

  const handleViewProperty = useCallback(() => {
    if (popupInfo && onPropertyClick) {
      onPropertyClick(popupInfo);
    }
  }, [popupInfo, onPropertyClick]);

  // Fly to property location
  const flyToProperty = useCallback((property) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [property.longitude || 120.9842, property.latitude || 14.5995],
        zoom: 15,
        duration: 2000,
      });
      setPopupInfo(property);
    }
  }, []);

  // Mock coordinates for properties (in real app, these would come from database)
  const getPropertyCoordinates = (property) => {
    // Generate mock coordinates based on city
    const cityCoordinates = {
      'Manila': { lat: 14.5995, lng: 120.9842 },
      'Quezon City': { lat: 14.6760, lng: 121.0437 },
      'Makati': { lat: 14.5547, lng: 121.0244 },
      'Taguig': { lat: 14.5176, lng: 121.0509 },
      'Pasig': { lat: 14.5764, lng: 121.0851 },
      'Dagupan': { lat: 16.0433, lng: 120.3334 },
    };

    const baseCoords = cityCoordinates[property.city] || cityCoordinates['Manila'];
    
    // Add small random offset to spread markers
    return {
      lat: baseCoords.lat + (Math.random() - 0.5) * 0.02,
      lng: baseCoords.lng + (Math.random() - 0.5) * 0.02,
    };
  };

  return (
    <Box
      height={height}
      width="100%"
      borderRadius={borderRadius.lg}
      overflow="hidden"
      border={`1px solid ${colors.gray[200]}`}
    >
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Navigation Controls */}
        <NavigationControl position="top-right" />
        
        {/* Geolocate Control */}
        <GeolocateControl
          position="top-right"
          trackUserLocation
          showUserHeading
        />

        {/* Property Markers */}
        {properties.map((property) => {
          const coords = getPropertyCoordinates(property);
          const isSelected = selectedProperty?.id === property.id;

          return (
            <Marker
              key={property.id}
              latitude={coords.lat}
              longitude={coords.lng}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(property);
              }}
            >
              <Box
                cursor="pointer"
                transform={isSelected ? 'scale(1.2)' : 'scale(1)'}
                transition="transform 0.2s"
                _hover={{ transform: 'scale(1.2)' }}
              >
                <Box
                  bg={isSelected ? colors.primary[700] : colors.primary[500]}
                  color="white"
                  px={spacing[2]}
                  py={spacing[1]}
                  borderRadius={borderRadius.md}
                  fontSize={typography.fontSize.xs}
                  fontWeight={typography.fontWeight.semibold}
                  boxShadow="0 2px 4px rgba(0,0,0,0.2)"
                  whiteSpace="nowrap"
                >
                  {formatPrice(property.price)}
                </Box>
                <Box
                  position="absolute"
                  bottom="-8px"
                  left="50%"
                  transform="translateX(-50%)"
                  width="0"
                  height="0"
                  borderLeft="8px solid transparent"
                  borderRight="8px solid transparent"
                  borderTop={`8px solid ${isSelected ? colors.primary[700] : colors.primary[500]}`}
                />
              </Box>
            </Marker>
          );
        })}

        {/* Popup */}
        {popupInfo && (
          <Popup
            latitude={getPropertyCoordinates(popupInfo).lat}
            longitude={getPropertyCoordinates(popupInfo).lng}
            anchor="bottom"
            onClose={handlePopupClose}
            closeButton={true}
            closeOnClick={false}
            maxWidth="300px"
          >
            <VStack align="start" spacing={spacing[2]} p={spacing[2]}>
              <Image
                src={popupInfo.imageUrl[0]}
                alt={popupInfo.title}
                width="100%"
                height="150px"
                objectFit="cover"
                borderRadius={borderRadius.md}
              />
              <Heading
                fontSize={typography.fontSize.base}
                fontWeight={typography.fontWeight.semibold}
                color={colors.gray[900]}
                noOfLines={1}
              >
                {popupInfo.title}
              </Heading>
              <Text fontSize={typography.fontSize.sm} color={colors.gray[600]}>
                {popupInfo.city}
              </Text>
              <Badge colorScheme="blue" fontSize="xs">
                {popupInfo.bedType}
              </Badge>
              <Text
                fontSize={typography.fontSize.lg}
                fontWeight={typography.fontWeight.bold}
                color={colors.primary[700]}
              >
                {formatPrice(popupInfo.price)}/mo
              </Text>
              <Button
                size="sm"
                width="100%"
                bg={colors.primary[700]}
                color="white"
                onClick={handleViewProperty}
                _hover={{
                  bg: colors.primary[800],
                }}
              >
                View Details
              </Button>
            </VStack>
          </Popup>
        )}
      </Map>
    </Box>
  );
};

export default MapView;
