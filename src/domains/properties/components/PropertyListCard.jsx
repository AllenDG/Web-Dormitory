import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Heading,
  Image,
  Badge,
  Icon,
  IconButton,
  Tooltip,
  Divider,
} from '@chakra-ui/react';
import {
  FiHeart,
  FiMapPin,
  FiWifi,
  FiUsers,
  FiHome,
  FiZap,
  FiShield,
  FiClock,
  FiTrendingUp,
  FiAward,
  FiCheckCircle,
} from 'react-icons/fi';

/**
 * PropertyListCard Component v2.0
 * Enhanced UX with icons, tooltips, and better information hierarchy
 * Optimized for tenant understanding
 */
const PropertyListCard = ({
  property,
  onClick,
  onFavoriteToggle,
  isFavorite = false,
  isHighlighted = false,
  isCompact = false,
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Mock enhanced data
  const distanceFromSchool = '2 min walk';
  const schoolName = 'UP Diliman';
  const wifiSpeed = '50 Mbps';
  const safetyScore = 4.5;
  const responseTime = '< 1 hour';
  const viewCount = 234;
  const isVerified = true;
  const isNewlyRenovated = property.id % 3 === 0;
  const isBestMatch = property.id % 4 === 0;
  const availableFrom = 'Available Now';

  return (
    <Box
      bg="white"
      borderRadius="lg"
      border={`2px solid ${isHighlighted ? '#2563EB' : '#E5E7EB'}`}
      overflow="hidden"
      transition="all 0.3s"
      _hover={{
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(-2px)',
        borderColor: '#2563EB',
      }}
      cursor="pointer"
      onClick={onClick}
      position="relative"
      boxShadow={isHighlighted ? 'lg' : 'sm'}
    >
      <Flex direction={{ base: 'column', md: 'row' }}>
        {/* Image Section */}
        <Box
          position="relative"
          width={{ base: '100%', md: '280px' }}
          height={{ base: '200px', md: '220px' }}
          flexShrink={0}
        >
          <Image
            src={property.imageUrl[0]}
            alt={property.title}
            w="full"
            h="full"
            objectFit="cover"
          />

          {/* Top Badges */}
          <VStack
            position="absolute"
            top={3}
            left={3}
            spacing={2}
            align="start"
          >
            {isBestMatch && (
              <Tooltip label="AI-powered match based on your preferences" placement="right">
                <Badge
                  bg="primary.600"
                  color="white"
                  px={3}
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
            {isNewlyRenovated && (
              <Tooltip label="Recently renovated with modern amenities" placement="right">
                <Badge
                  bg="success.500"
                  color="white"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="semibold"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <Icon as={FiZap} boxSize={3} />
                  Newly Renovated
                </Badge>
              </Tooltip>
            )}
            {isVerified && (
              <Tooltip label="Property verified by Dormy team" placement="right">
                <Badge
                  bg="blue.500"
                  color="white"
                  px={3}
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

          {/* Favorite Button */}
          <Tooltip label={isFavorite ? 'Remove from favorites' : 'Add to favorites'} placement="left">
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

          {/* View Count */}
          <Tooltip label="Number of views this week" placement="top">
            <HStack
              position="absolute"
              bottom={3}
              left={3}
              bg="blackAlpha.700"
              px={2}
              py={1}
              borderRadius="md"
              spacing={1}
            >
              <Icon as={FiTrendingUp} color="white" boxSize={3} />
              <Text fontSize="xs" color="white" fontWeight="medium">
                {viewCount} views
              </Text>
            </HStack>
          </Tooltip>
        </Box>

        {/* Content Section */}
        <Flex flex="1" direction="column" p={4}>
          <VStack align="start" spacing={3} flex="1">
            {/* Title and Price Row */}
            <Flex justifyContent="space-between" width="full" alignItems="start">
              <VStack align="start" spacing={1} flex="1">
                <Heading
                  as="h3"
                  fontSize="lg"
                  fontWeight="semibold"
                  color="gray.900"
                  noOfLines={1}
                >
                  {property.title}
                </Heading>
                <HStack spacing={2} color="gray.600">
                  <Icon as={FiMapPin} boxSize={4} />
                  <Text fontSize="sm" fontWeight="medium">{property.city}</Text>
                </HStack>
              </VStack>

              {/* Price Box */}
              <VStack align="end" spacing={0} ml={4} flexShrink={0}>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color="primary.600"
                  whiteSpace="nowrap"
                >
                  {formatPrice(property.price)}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  per month
                </Text>
              </VStack>
            </Flex>

            {/* School Proximity - Highlighted */}
            <Tooltip label={`Walking distance to ${schoolName}`} placement="top">
              <HStack
                spacing={2}
                bg="blue.50"
                px={3}
                py={2}
                borderRadius="md"
                w="full"
              >
                <Icon as={FiMapPin} color="blue.600" boxSize={4} />
                <Text fontSize="sm" color="blue.700" fontWeight="medium">
                  {distanceFromSchool} from {schoolName}
                </Text>
              </HStack>
            </Tooltip>

            {/* Key Features Grid - 2 Rows */}
            <VStack spacing={2} w="full">
              {/* Row 1 */}
              <Flex gap={2} w="full">
                {/* Capacity */}
                <Tooltip label="Maximum occupancy" placement="top">
                  <HStack
                    spacing={2}
                    bg="gray.50"
                    px={3}
                    py={2}
                    borderRadius="md"
                    flex="1"
                    minW="0"
                  >
                    <Icon as={FiUsers} color="gray.600" boxSize={4} flexShrink={0} />
                    <VStack spacing={0} align="start" minW="0">
                      <Text fontSize="xs" color="gray.500" lineHeight="1" noOfLines={1}>
                        Capacity
                      </Text>
                      <Text fontSize="sm" color="gray.900" fontWeight="medium" lineHeight="1.2" noOfLines={1}>
                        {property.availablePerson} persons
                      </Text>
                    </VStack>
                  </HStack>
                </Tooltip>

                {/* Room Type */}
                <Tooltip label="Type of accommodation" placement="top">
                  <HStack
                    spacing={2}
                    bg="gray.50"
                    px={3}
                    py={2}
                    borderRadius="md"
                    flex="1"
                    minW="0"
                  >
                    <Icon as={FiHome} color="gray.600" boxSize={4} flexShrink={0} />
                    <VStack spacing={0} align="start" minW="0">
                      <Text fontSize="xs" color="gray.500" lineHeight="1" noOfLines={1}>
                        Type
                      </Text>
                      <Text fontSize="sm" color="gray.900" fontWeight="medium" lineHeight="1.2" noOfLines={1}>
                        {property.bedType}
                      </Text>
                    </VStack>
                  </HStack>
                </Tooltip>
              </Flex>

              {/* Row 2 */}
              <Flex gap={2} w="full">
                {/* WiFi Speed */}
                <Tooltip label="Internet connection speed" placement="top">
                  <HStack
                    spacing={2}
                    bg="gray.50"
                    px={3}
                    py={2}
                    borderRadius="md"
                    flex="1"
                    minW="0"
                  >
                    <Icon as={FiWifi} color="gray.600" boxSize={4} flexShrink={0} />
                    <VStack spacing={0} align="start" minW="0">
                      <Text fontSize="xs" color="gray.500" lineHeight="1" noOfLines={1}>
                        WiFi
                      </Text>
                      <Text fontSize="sm" color="gray.900" fontWeight="medium" lineHeight="1.2" noOfLines={1}>
                        {wifiSpeed}
                      </Text>
                    </VStack>
                  </HStack>
                </Tooltip>

                {/* Safety Score */}
                <Tooltip label="Safety rating based on location and security features" placement="top">
                  <HStack
                    spacing={2}
                    bg="gray.50"
                    px={3}
                    py={2}
                    borderRadius="md"
                    flex="1"
                    minW="0"
                  >
                    <Icon as={FiShield} color="gray.600" boxSize={4} flexShrink={0} />
                    <VStack spacing={0} align="start" minW="0">
                      <Text fontSize="xs" color="gray.500" lineHeight="1" noOfLines={1}>
                        Safety
                      </Text>
                      <Text fontSize="sm" color="gray.900" fontWeight="medium" lineHeight="1.2" noOfLines={1}>
                        {safetyScore}/5.0
                      </Text>
                    </VStack>
                  </HStack>
                </Tooltip>
              </Flex>
            </VStack>

            <Divider />

            {/* Bottom Row: Availability and Response Time */}
            <Flex justify="space-between" align="center" w="full">
              <HStack spacing={4}>
                {/* Availability */}
                <Tooltip label="Move-in availability" placement="top">
                  <HStack spacing={2}>
                    <Icon as={FiClock} color="success.500" boxSize={4} />
                    <Text fontSize="sm" color="success.600" fontWeight="medium">
                      {availableFrom}
                    </Text>
                  </HStack>
                </Tooltip>

                {/* Response Time */}
                <Tooltip label="Average owner response time" placement="top">
                  <HStack spacing={2}>
                    <Icon as={FiZap} color="orange.500" boxSize={4} />
                    <Text fontSize="sm" color="gray.600">
                      Responds {responseTime}
                    </Text>
                  </HStack>
                </Tooltip>
              </HStack>

              {/* View Details Button */}
              <Text
                fontSize="sm"
                color="primary.600"
                fontWeight="semibold"
                _hover={{ textDecoration: 'underline' }}
              >
                View Details →
              </Text>
            </Flex>
          </VStack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default PropertyListCard;
