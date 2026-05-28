import {
  Box,
  Image,
  Text,
  HStack,
  VStack,
  Badge,
  Icon,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiHeart, FiMapPin, FiUsers, FiWifi } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Card } from './index';

/**
 * Modern Property Card Component
 * Minimalist design with enhanced information display
 */
const PropertyCard = ({
  property,
  isFavorite = false,
  onToggleFavorite,
  showDistance = false,
}) => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.800');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card
      hover
      padding={0}
      overflow="hidden"
      cursor="pointer"
      onClick={() => navigate(`/listing/${property.id}`)}
      bg={cardBg}
      h="full"
      display="flex"
      flexDirection="column"
    >
      {/* Image */}
      <Box position="relative" overflow="hidden" h="200px">
        <Image
          src={property.imageUrl[0]}
          alt={property.title}
          w="full"
          h="full"
          objectFit="cover"
          transition="transform 0.3s"
          _hover={{ transform: 'scale(1.05)' }}
        />
        
        {/* Favorite Button */}
        <IconButton
          icon={<Icon as={FiHeart} fill={isFavorite ? 'currentColor' : 'none'} />}
          position="absolute"
          top={3}
          right={3}
          size="sm"
          borderRadius="md"
          bg={isFavorite ? 'error' : 'whiteAlpha.900'}
          color={isFavorite ? 'white' : 'gray.700'}
          _hover={{
            bg: isFavorite ? 'red.600' : 'white',
            transform: 'scale(1.1)',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          aria-label="Add to favorites"
        />

        {/* Price Badge */}
        <Badge
          position="absolute"
          bottom={3}
          left={3}
          colorScheme="green"
          fontSize="md"
          px={3}
          py={1}
          borderRadius="md"
          fontWeight="600"
        >
          {formatPrice(property.price)}/mo
        </Badge>

        {/* Best Match Badge */}
        {property.bestMatch && (
          <Badge
            position="absolute"
            top={3}
            left={3}
            colorScheme="yellow"
            fontSize="sm"
            px={2}
            py={1}
            borderRadius="md"
            fontWeight="600"
          >
            Best Match
          </Badge>
        )}
      </Box>

      {/* Content */}
      <VStack align="start" spacing={3} p={5} flex="1">
        {/* Title */}
        <Text
          fontSize="lg"
          fontWeight="600"
          color="gray.900"
          _dark={{ color: 'white' }}
          noOfLines={1}
        >
          {property.title}
        </Text>

        {/* Location */}
        <HStack spacing={2} color="gray.600" _dark={{ color: 'gray.400' }}>
          <Icon as={FiMapPin} />
          <Text fontSize="sm" noOfLines={1}>
            {property.city}
          </Text>
        </HStack>

        {/* Distance (if available) */}
        {showDistance && property.distance && (
          <Text fontSize="sm" color="primary.700" fontWeight="500">
            {property.distance} from your location
          </Text>
        )}

        {/* Amenities */}
        <HStack spacing={2} flexWrap="wrap">
          <HStack spacing={1}>
            <Icon as={FiUsers} color="gray.500" boxSize={4} />
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
              {property.availablePerson}
            </Text>
          </HStack>
          {property.amenities.includes('Wifi / Internet') && (
            <HStack spacing={1}>
              <Icon as={FiWifi} color="gray.500" boxSize={4} />
              <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                WiFi
              </Text>
            </HStack>
          )}
          <Badge colorScheme="blue" borderRadius="md">
            {property.bedType}
          </Badge>
        </HStack>

        {/* Description */}
        <Text
          fontSize="sm"
          color="gray.600"
          _dark={{ color: 'gray.400' }}
          noOfLines={2}
          flex="1"
        >
          {property.description}
        </Text>

        {/* Conversational Text */}
        {property.tags && property.tags.length > 0 && (
          <VStack align="start" spacing={1} w="full">
            {property.tags.slice(0, 2).map((tag, index) => (
              <Text
                key={index}
                fontSize="xs"
                color="primary.700"
                fontWeight="500"
                fontStyle="italic"
              >
                "{tag}"
              </Text>
            ))}
          </VStack>
        )}
      </VStack>
    </Card>
  );
};

export default PropertyCard;
