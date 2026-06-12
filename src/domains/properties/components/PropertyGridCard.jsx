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
  useToast,
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
  FiBarChart2,
} from 'react-icons/fi';
import useCompareStore from '../../../shared/stores/useCompareStore';
import useReviewStore from '../../../shared/stores/useReviewStore';

/**
 * PropertyGridCard Component v2.1
 * Enhanced vertical card for grid view with better UX
 * Optimized for mobile and tablet
 * Added compare functionality with visual feedback
 */
const PropertyGridCard = ({
  property,
  onClick,
  onFavoriteToggle,
  isFavorite = false,
}) => {
  const toast = useToast();
  const isInCompare = useCompareStore((state) => state.isInCompare)(property.id);
  const addToCompare = useCompareStore((state) => state.addToCompare);
  const removeFromCompare = useCompareStore((state) => state.removeFromCompare);
  const isLimitReached = useCompareStore((state) => state.isLimitReached)();

  // Get property ratings
  const getPropertyRatings = useReviewStore((state) => state.getPropertyRatings);
  const ratings = getPropertyRatings(property.id);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCompareToggle = (e) => {
    e.stopPropagation();
    
    if (isInCompare) {
      removeFromCompare(property.id);
      toast({
        title: 'Removed from comparison',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    } else {
      if (isLimitReached) {
        toast({
          title: 'Comparison limit reached',
          description: 'You can compare up to 4 properties. Remove one to add another.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      const success = addToCompare(property.id);
      if (success) {
        toast({
          title: 'Added to comparison',
          description: 'Click the compare button at the bottom to view',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
    }
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

        {/* Action Buttons */}
        <VStack position="absolute" top={3} right={3} spacing={2}>
          {/* Compare Button */}
          <Tooltip label={isInCompare ? 'Remove from comparison' : 'Add to comparison'}>
            <IconButton
              icon={<Icon as={FiBarChart2} />}
              size="sm"
              borderRadius="full"
              bg={isInCompare ? 'primary.500' : 'whiteAlpha.900'}
              color={isInCompare ? 'white' : 'gray.700'}
              _hover={{
                bg: isInCompare ? 'primary.600' : 'white',
                transform: 'scale(1.1)',
              }}
              onClick={handleCompareToggle}
              aria-label={isInCompare ? 'Remove from comparison' : 'Add to comparison'}
            />
          </Tooltip>
          
          {/* Favorite Button */}
          <Tooltip label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
            <IconButton
              icon={<Icon as={FiHeart} fill={isFavorite ? 'currentColor' : 'none'} />}
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
        </VStack>

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
          {ratings && ratings.totalReviews > 0 && (
            <Tooltip label={`${ratings.totalReviews} ${ratings.totalReviews === 1 ? 'review' : 'reviews'}`}>
              <HStack spacing={1}>
                <Icon as={FiStar} boxSize={3} color="yellow.400" />
                <Text fontSize="sm" fontWeight="semibold">
                  {ratings.overallRating}
                </Text>
              </HStack>
            </Tooltip>
          )}
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
