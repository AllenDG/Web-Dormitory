import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Image,
  Text,
  Badge,
  Icon,
  IconButton,
  Button,
  Divider,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import {
  FiMapPin,
  FiUsers,
  FiWifi,
  FiTv,
  FiWind,
  FiX,
  FiMessageCircle,
  FiCalendar,
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useCompareStore from '../../../shared/stores/useCompareStore';

/**
 * Mobile Comparison Cards Component
 * Displays properties as swipeable cards
 */
const CompareCards = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);

  const getCompareProperties = useCompareStore((state) => state.getCompareProperties);
  const removeFromCompare = useCompareStore((state) => state.removeFromCompare);
  
  // Call the function to get properties
  const properties = getCompareProperties();

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleRemove = (propertyId, propertyTitle) => {
    removeFromCompare(propertyId);
    
    // Adjust current index if needed
    if (currentIndex >= properties.length - 1 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }

    toast({
      title: 'Property removed',
      description: `${propertyTitle} removed from comparison`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : properties.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < properties.length - 1 ? prev + 1 : 0));
  };

  // Get amenity icon
  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) {
      return FiWifi;
    }
    if (amenityLower.includes('tv') || amenityLower.includes('television')) {
      return FiTv;
    }
    if (amenityLower.includes('aircon') || amenityLower.includes('ac')) {
      return FiWind;
    }
    return null;
  };

  // Find lowest price for highlighting
  const prices = properties.map((p) => p.price);
  const lowestPrice = Math.min(...prices);

  const currentProperty = properties[currentIndex];

  if (!currentProperty) {
    return null;
  }

  return (
    <VStack spacing={4} w="full" px={4}>
      {/* Navigation Controls */}
      <HStack justify="space-between" w="full" maxW="500px">
        <IconButton
          icon={<Icon as={FiChevronLeft} />}
          onClick={handlePrevious}
          variant="ghost"
          colorScheme="primary"
          aria-label="Previous property"
          isDisabled={properties.length <= 1}
        />

        {/* Dots Indicator */}
        <HStack spacing={2}>
          {properties.map((_, index) => (
            <Box
              key={index}
              w={2}
              h={2}
              borderRadius="full"
              bg={index === currentIndex ? 'primary.600' : 'gray.300'}
              cursor="pointer"
              onClick={() => setCurrentIndex(index)}
              transition="all 0.2s"
            />
          ))}
        </HStack>

        <IconButton
          icon={<Icon as={FiChevronRight} />}
          onClick={handleNext}
          variant="ghost"
          colorScheme="primary"
          aria-label="Next property"
          isDisabled={properties.length <= 1}
        />
      </HStack>

      {/* Property Card */}
      <Box
        w="full"
        maxW="500px"
        bg={cardBg}
        borderRadius="md"
        borderWidth="1px"
        borderColor={borderColor}
        overflow="hidden"
        boxShadow="md"
      >
        {/* Remove Button */}
        <Box position="relative">
          <Image
            src={currentProperty.imageUrl[0]}
            alt={currentProperty.title}
            w="full"
            h="200px"
            objectFit="cover"
          />
          <IconButton
            icon={<Icon as={FiX} />}
            position="absolute"
            top={2}
            right={2}
            size="sm"
            colorScheme="red"
            onClick={() => handleRemove(currentProperty.id, currentProperty.title)}
            aria-label="Remove property"
          />
        </Box>

        <VStack spacing={4} p={5} align="start">
          {/* Title */}
          <Text fontSize="xl" fontWeight="600">
            {currentProperty.title}
          </Text>

          {/* Location */}
          <HStack spacing={2}>
            <Icon as={FiMapPin} color="gray.500" />
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
              {currentProperty.city}
            </Text>
          </HStack>

          <Divider />

          {/* Price */}
          <VStack spacing={1} align="start" w="full">
            <Text fontSize="xs" color="gray.500" fontWeight="600">
              MONTHLY RATE
            </Text>
            <HStack spacing={2}>
              <Text
                fontSize="2xl"
                fontWeight="700"
                color={currentProperty.price === lowestPrice ? 'green.600' : 'gray.900'}
                _dark={{ color: currentProperty.price === lowestPrice ? 'green.400' : 'white' }}
              >
                {formatPrice(currentProperty.price)}
              </Text>
              {currentProperty.price === lowestPrice && (
                <Badge colorScheme="green">Lowest</Badge>
              )}
            </HStack>
          </VStack>

          <Divider />

          {/* Bed Type & Capacity */}
          <HStack spacing={4} w="full">
            <VStack spacing={1} align="start" flex={1}>
              <Text fontSize="xs" color="gray.500" fontWeight="600">
                BED TYPE
              </Text>
              <Badge colorScheme="blue" borderRadius="md">
                {currentProperty.bedType}
              </Badge>
            </VStack>
            <VStack spacing={1} align="start" flex={1}>
              <Text fontSize="xs" color="gray.500" fontWeight="600">
                CAPACITY
              </Text>
              <HStack spacing={1}>
                <Icon as={FiUsers} color="gray.500" boxSize={4} />
                <Text fontSize="sm">{currentProperty.availablePerson}</Text>
              </HStack>
            </VStack>
          </HStack>

          <Divider />

          {/* Amenities */}
          <VStack spacing={2} align="start" w="full">
            <Text fontSize="xs" color="gray.500" fontWeight="600">
              AMENITIES
            </Text>
            <VStack spacing={1} align="start">
              {currentProperty.amenities.slice(0, 5).map((amenity, index) => {
                const AmenityIcon = getAmenityIcon(amenity);
                return (
                  <HStack key={index} spacing={2}>
                    {AmenityIcon && <Icon as={AmenityIcon} color="gray.500" boxSize={4} />}
                    <Text fontSize="sm">{amenity}</Text>
                  </HStack>
                );
              })}
              {currentProperty.amenities.length > 5 && (
                <Text fontSize="xs" color="gray.500" fontStyle="italic">
                  +{currentProperty.amenities.length - 5} more amenities
                </Text>
              )}
            </VStack>
          </VStack>

          <Divider />

          {/* Description */}
          <VStack spacing={2} align="start" w="full">
            <Text fontSize="xs" color="gray.500" fontWeight="600">
              DESCRIPTION
            </Text>
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
              {currentProperty.description}
            </Text>
          </VStack>

          {/* Distance (if available) */}
          {currentProperty.distance && (
            <>
              <Divider />
              <VStack spacing={1} align="start" w="full">
                <Text fontSize="xs" color="gray.500" fontWeight="600">
                  DISTANCE
                </Text>
                <Text fontSize="sm" color="primary.700">
                  {currentProperty.distance}
                </Text>
              </VStack>
            </>
          )}

          {/* Rating (if available) */}
          {currentProperty.rating && (
            <>
              <Divider />
              <VStack spacing={1} align="start" w="full">
                <Text fontSize="xs" color="gray.500" fontWeight="600">
                  RATING
                </Text>
                <HStack spacing={1}>
                  <Text fontWeight="600" fontSize="xl">
                    {currentProperty.rating}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    / 5
                  </Text>
                </HStack>
              </VStack>
            </>
          )}

          <Divider />

          {/* Action Buttons */}
          <VStack spacing={2} w="full">
            <Button
              size="md"
              colorScheme="primary"
              w="full"
              leftIcon={<Icon as={FiExternalLink} />}
              onClick={() => navigate(`/listing/${currentProperty.id}`)}
            >
              View Details
            </Button>
            <HStack spacing={2} w="full">
              <Button
                size="md"
                variant="outline"
                colorScheme="primary"
                flex={1}
                leftIcon={<Icon as={FiMessageCircle} />}
                onClick={() => navigate('/chat')}
              >
                Chat
              </Button>
              <Button
                size="md"
                variant="outline"
                colorScheme="primary"
                flex={1}
                leftIcon={<Icon as={FiCalendar} />}
                onClick={() => navigate(`/schedule-visit/${currentProperty.id}`)}
              >
                Visit
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </Box>

      {/* Counter */}
      <Text fontSize="sm" color="gray.500">
        Property {currentIndex + 1} of {properties.length}
      </Text>
    </VStack>
  );
};

export default CompareCards;
