import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Text,
  VStack,
  HStack,
  Badge,
  Icon,
  IconButton,
  Button,
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
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useCompareStore from '../../../shared/stores/useCompareStore';

/**
 * Desktop Comparison Table Component
 * Displays properties side-by-side in a table layout
 */
const CompareTable = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const getCompareProperties = useCompareStore((state) => state.getCompareProperties);
  const removeFromCompare = useCompareStore((state) => state.removeFromCompare);
  
  // Call the function to get properties
  const properties = getCompareProperties();

  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const rowBg = useColorModeValue('white', 'gray.800');
  const altRowBg = useColorModeValue('gray.50', 'gray.700');
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
    toast({
      title: 'Property removed',
      description: `${propertyTitle} removed from comparison`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
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

  return (
    <Box overflowX="auto" w="full">
      <Table variant="simple" size="md">
        <Thead bg={headerBg} position="sticky" top={0} zIndex={1}>
          <Tr>
            <Th
              borderColor={borderColor}
              position="sticky"
              left={0}
              bg={headerBg}
              zIndex={2}
              minW="200px"
            >
              Attribute
            </Th>
            {properties.map((property) => (
              <Th
                key={property.id}
                borderColor={borderColor}
                textAlign="center"
                minW="250px"
              >
                <VStack spacing={2}>
                  <IconButton
                    icon={<Icon as={FiX} />}
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => handleRemove(property.id, property.title)}
                    aria-label="Remove property"
                  />
                </VStack>
              </Th>
            ))}
          </Tr>
        </Thead>

        <Tbody>
          {/* Property Image */}
          <Tr bg={rowBg}>
            <Td
              fontWeight="600"
              borderColor={borderColor}
              position="sticky"
              left={0}
              bg={rowBg}
              zIndex={1}
            >
              Property
            </Td>
            {properties.map((property) => (
              <Td key={property.id} borderColor={borderColor}>
                <VStack spacing={2} align="center">
                  <Image
                    src={property.imageUrl[0]}
                    alt={property.title}
                    w="full"
                    h="150px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                  <Text fontWeight="600" fontSize="sm" textAlign="center" noOfLines={2}>
                    {property.title}
                  </Text>
                </VStack>
              </Td>
            ))}
          </Tr>

          {/* Location */}
          <Tr bg={altRowBg}>
            <Td
              fontWeight="600"
              borderColor={borderColor}
              position="sticky"
              left={0}
              bg={altRowBg}
              zIndex={1}
            >
              Location
            </Td>
            {properties.map((property) => (
              <Td key={property.id} borderColor={borderColor}>
                <HStack spacing={2} justify="center">
                  <Icon as={FiMapPin} color="gray.500" />
                  <Text fontSize="sm">{property.city}</Text>
                </HStack>
              </Td>
            ))}
          </Tr>

          {/* Price */}
          <Tr bg={rowBg}>
            <Td
              fontWeight="600"
              borderColor={borderColor}
              position="sticky"
              left={0}
              bg={rowBg}
              zIndex={1}
            >
              Monthly Rate
            </Td>
            {properties.map((property) => (
              <Td key={property.id} borderColor={borderColor}>
                <VStack spacing={1}>
                  <Text
                    fontWeight="700"
                    fontSize="lg"
                    color={property.price === lowestPrice ? 'green.600' : 'gray.900'}
                    _dark={{ color: property.price === lowestPrice ? 'green.400' : 'white' }}
                  >
                    {formatPrice(property.price)}
                  </Text>
                  {property.price === lowestPrice && (
                    <Badge colorScheme="green" fontSize="xs">
                      Lowest Price
                    </Badge>
                  )}
                </VStack>
              </Td>
            ))}
          </Tr>

          {/* Bed Type */}
          <Tr bg={altRowBg}>
            <Td
              fontWeight="600"
              borderColor={borderColor}
              position="sticky"
              left={0}
              bg={altRowBg}
              zIndex={1}
            >
              Bed Type
            </Td>
            {properties.map((property) => (
              <Td key={property.id} borderColor={borderColor} textAlign="center">
                <Badge colorScheme="blue" borderRadius="md">
                  {property.bedType}
                </Badge>
              </Td>
            ))}
          </Tr>

          {/* Capacity */}
          <Tr bg={rowBg}>
            <Td
              fontWeight="600"
              borderColor={borderColor}
              position="sticky"
              left={0}
              bg={rowBg}
              zIndex={1}
            >
              Capacity
            </Td>
            {properties.map((property) => (
              <Td key={property.id} borderColor={borderColor}>
                <HStack spacing={2} justify="center">
                  <Icon as={FiUsers} color="gray.500" />
                  <Text fontSize="sm">{property.availablePerson} persons</Text>
                </HStack>
              </Td>
            ))}
          </Tr>

          {/* Amenities */}
          <Tr bg={altRowBg}>
            <Td
              fontWeight="600"
              borderColor={borderColor}
              position="sticky"
              left={0}
              bg={altRowBg}
              zIndex={1}
            >
              Amenities
            </Td>
            {properties.map((property) => (
              <Td key={property.id} borderColor={borderColor}>
                <VStack spacing={1} align="start">
                  {property.amenities.slice(0, 5).map((amenity, index) => {
                    const AmenityIcon = getAmenityIcon(amenity);
                    return (
                      <HStack key={index} spacing={2}>
                        {AmenityIcon && <Icon as={AmenityIcon} color="gray.500" boxSize={3} />}
                        <Text fontSize="xs">{amenity}</Text>
                      </HStack>
                    );
                  })}
                  {property.amenities.length > 5 && (
                    <Text fontSize="xs" color="gray.500" fontStyle="italic">
                      +{property.amenities.length - 5} more
                    </Text>
                  )}
                </VStack>
              </Td>
            ))}
          </Tr>

          {/* Description */}
          <Tr bg={rowBg}>
            <Td
              fontWeight="600"
              borderColor={borderColor}
              position="sticky"
              left={0}
              bg={rowBg}
              zIndex={1}
            >
              Description
            </Td>
            {properties.map((property) => (
              <Td key={property.id} borderColor={borderColor}>
                <Text fontSize="sm" noOfLines={3}>
                  {property.description}
                </Text>
              </Td>
            ))}
          </Tr>

          {/* Distance (if available) */}
          {properties.some((p) => p.distance) && (
            <Tr bg={altRowBg}>
              <Td
                fontWeight="600"
                borderColor={borderColor}
                position="sticky"
                left={0}
                bg={altRowBg}
                zIndex={1}
              >
                Distance
              </Td>
              {properties.map((property) => (
                <Td key={property.id} borderColor={borderColor} textAlign="center">
                  <Text fontSize="sm" color="primary.700">
                    {property.distance || 'N/A'}
                  </Text>
                </Td>
              ))}
            </Tr>
          )}

          {/* Rating (if available) */}
          {properties.some((p) => p.rating) && (
            <Tr bg={rowBg}>
              <Td
                fontWeight="600"
                borderColor={borderColor}
                position="sticky"
                left={0}
                bg={rowBg}
                zIndex={1}
              >
                Rating
              </Td>
              {properties.map((property) => (
                <Td key={property.id} borderColor={borderColor} textAlign="center">
                  {property.rating ? (
                    <HStack spacing={1} justify="center">
                      <Text fontWeight="600" fontSize="lg">
                        {property.rating}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        / 5
                      </Text>
                    </HStack>
                  ) : (
                    <Text fontSize="sm" color="gray.500">
                      No ratings yet
                    </Text>
                  )}
                </Td>
              ))}
            </Tr>
          )}

          {/* Actions */}
          <Tr bg={altRowBg}>
            <Td
              fontWeight="600"
              borderColor={borderColor}
              position="sticky"
              left={0}
              bg={altRowBg}
              zIndex={1}
            >
              Actions
            </Td>
            {properties.map((property) => (
              <Td key={property.id} borderColor={borderColor}>
                <VStack spacing={2}>
                  <Button
                    size="sm"
                    colorScheme="primary"
                    w="full"
                    leftIcon={<Icon as={FiExternalLink} />}
                    onClick={() => navigate(`/listing/${property.id}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="primary"
                    w="full"
                    leftIcon={<Icon as={FiMessageCircle} />}
                    onClick={() => navigate('/chat')}
                  >
                    Chat
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="primary"
                    w="full"
                    leftIcon={<Icon as={FiCalendar} />}
                    onClick={() => navigate(`/schedule-visit/${property.id}`)}
                  >
                    Schedule Visit
                  </Button>
                </VStack>
              </Td>
            ))}
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default CompareTable;
