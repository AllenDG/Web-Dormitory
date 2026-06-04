import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  Badge,
  Icon,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import {
  FiHeart,
  FiMapPin,
  FiStar,
  FiWifi,
  FiUsers,
  FiShield,
  FiCheckCircle,
  FiAward,
} from 'react-icons/fi';

/**
 * PropertyGridCard Component v2.0
 * Enhanced vertical card for grid view with better UX
 * Optimized for mobile and tablet
 */
const PropertyGridCard = ({
  property,
  onClick,
  onFavoriteToggle,
  isFavorite = false,
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isBestMatch = property.id % 4 === 0;
  const isVerified = true;
  const distanceFromSchool = '2 min walk';

  return (
    <Box
      bg="white"
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.3s"
      border="1px solid"
      borderColor="gray.200"
      _hover={{
        boxShadow: 'lg',
        transform: 'translateY(-4px)',
        borderColor: 'primary.500',
      }}
      cursor="pointer"
      onClick={onClick}
    >
      {/* Image */}
      <Box position="relative" h="220px">
        <Image
          src={property.imageUrl[0]}
          alt={property.title}
          w="full"
          h="full"
          objectFit="cover"
        />

        {/* Favorite Button */}
        <Tooltip label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
          <IconButton
            icon={<Icon as={FiHeart} fill={isFavorite ? 'currentColor' : 'none'} />}
            position="absolute"
            top={3}
            right={3}
            size="sm"
            borderRadius="full"
            bg={isFavorite ? 'error.500' : 'whiteAlpha.900'}
            color={isFavorite ? 'white' : 'gray.700'}
            _hover={{
              bg: isFavorite ? 'error.600' : 'white',
              transform: 'scale(1.1)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
            aria-label="Add to favorites"
          />
        </Tooltip>

        {/* Badges */}
        <VStack position="absolute" top={3} left={3} spacing={2} align="start">
          {isBestMatch && (
            <Tooltip label="AI-powered match">
              <Badge
                bg="primary.600"
                color="white"
                px={2}
                py={1}
                borderRadius="full"
                fontSize="xs"
                fontWeight="semibold"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Icon as={FiAward} boxSize={3} />
                Best Match
              </Badge>
            </Tooltip>
          )}
          {isVerified && (
            <Tooltip label="Verified property">
              <Badge
                bg="blue.500"
                color="white"
                px={2}
                py={1}
                borderRadius="full"
                fontSize="xs"
                fontWeight="semibold"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Icon as={FiCheckCircle} boxSize={3} />
                Verified
              </Badge>
            </Tooltip>
          )}
        </VStack>
      </Box>

      {/* Content */}
      <VStack align="start" spacing={2} p={4}>
        {/* Location and Rating */}
        <HStack justify="space-between" w="full">
          <HStack spacing={1} color="gray.600">
            <Icon as={FiMapPin} boxSize={3} />
            <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
              {property.city}
            </Text>
          </HStack>
          <Tooltip label="Average rating from tenants">
            <HStack spacing={1}>
              <Icon as={FiStar} boxSize={3} color="warning.500" />
              <Text fontSize="sm" fontWeight="medium">
                4.8
              </Text>
            </HStack>
          </Tooltip>
        </HStack>

        {/* Title */}
        <Text
          fontSize="md"
          fontWeight="semibold"
          color="gray.900"
          noOfLines={1}
        >
          {property.title}
        </Text>

        {/* School Proximity */}
        <Tooltip label="Walking distance to school">
          <HStack
            spacing={2}
            bg="blue.50"
            px={2}
            py={1}
            borderRadius="md"
            w="full"
          >
            <Icon as={FiMapPin} color="blue.600" boxSize={3} />
            <Text fontSize="xs" color="blue.700" fontWeight="medium" noOfLines={1}>
              {distanceFromSchool} from school
            </Text>
          </HStack>
        </Tooltip>

        {/* Key Features */}
        <HStack spacing={3} w="full" justify="space-between">
          <Tooltip label="Maximum capacity">
            <HStack spacing={1}>
              <Icon as={FiUsers} color="gray.500" boxSize={3} />
              <Text fontSize="xs" color="gray.600">
                {property.availablePerson}
              </Text>
            </HStack>
          </Tooltip>
          <Tooltip label="WiFi available">
            <HStack spacing={1}>
              <Icon as={FiWifi} color="gray.500" boxSize={3} />
              <Text fontSize="xs" color="gray.600">
                50 Mbps
              </Text>
            </HStack>
          </Tooltip>
          <Tooltip label="Safety rating">
            <HStack spacing={1}>
              <Icon as={FiShield} color="gray.500" boxSize={3} />
              <Text fontSize="xs" color="gray.600">
                4.5/5
              </Text>
            </HStack>
          </Tooltip>
        </HStack>

        {/* Price and Type */}
        <HStack justify="space-between" w="full" pt={1}>
          <VStack align="start" spacing={0}>
            <Text fontSize="lg" fontWeight="bold" color="primary.600" lineHeight="1.2">
              {formatPrice(property.price)}
            </Text>
            <Text fontSize="xs" color="gray.500">
              per month
            </Text>
          </VStack>
          <Badge colorScheme="blue" fontSize="xs" px={2} py={1}>
            {property.bedType}
          </Badge>
        </HStack>
      </VStack>
    </Box>
  );
};

export default PropertyGridCard;
