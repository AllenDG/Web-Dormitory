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
  Checkbox,
} from '@chakra-ui/react';
import { FiHeart, FiMapPin, FiWifi, FiShield, FiUsers } from 'react-icons/fi';
import { colors, spacing, borderRadius, typography } from '../../../shared/styles/tokens';

/**
 * PropertyListCard Component
 * Horizontal property card for list view with enhanced information
 */
const PropertyListCard = ({
  property,
  onClick,
  onFavoriteToggle,
  isFavorite = false,
  onCompareToggle,
  isCompared = false,
  showCompareCheckbox = false,
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Mock data for enhanced features
  const distanceFromSchool = '2 min walk from UP Diliman';
  const wifiSpeed = '50 Mbps';
  const safetyScore = 4.5;
  const isNewlyRenovated = property.id % 3 === 0;
  const isBestMatch = property.id % 4 === 0;

  return (
    <Box
      bg="white"
      borderRadius={borderRadius.lg}
      border={`1px solid ${colors.gray[200]}`}
      overflow="hidden"
      transition="all 0.3s"
      _hover={{
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(-2px)',
      }}
      cursor="pointer"
      onClick={onClick}
      position="relative"
    >
      <Flex direction={{ base: 'column', md: 'row' }}>
        {/* Image Section */}
        <Box
          position="relative"
          width={{ base: '100%', md: '320px' }}
          height={{ base: '200px', md: '240px' }}
          flexShrink={0}
        >
          <Image
            src={property.imageUrl[0]}
            alt={property.title}
            w="full"
            h="full"
            objectFit="cover"
          />

          {/* Badges */}
          <HStack
            position="absolute"
            top={spacing[3]}
            left={spacing[3]}
            spacing={spacing[2]}
          >
            {isBestMatch && (
              <Badge
                bg={colors.primary[700]}
                color="white"
                px={spacing[3]}
                py={spacing[1]}
                borderRadius={borderRadius.md}
                fontSize="xs"
                fontWeight="semibold"
              >
                Best Match
              </Badge>
            )}
            {isNewlyRenovated && (
              <Badge
                bg={colors.success}
                color="white"
                px={spacing[3]}
                py={spacing[1]}
                borderRadius={borderRadius.md}
                fontSize="xs"
                fontWeight="semibold"
              >
                Newly Renovated
              </Badge>
            )}
          </HStack>

          {/* Favorite Button */}
          <IconButton
            icon={<Icon as={FiHeart} fill={isFavorite ? 'currentColor' : 'none'} />}
            position="absolute"
            top={spacing[3]}
            right={spacing[3]}
            size="sm"
            borderRadius="full"
            bg={isFavorite ? colors.error : 'whiteAlpha.800'}
            color={isFavorite ? 'white' : colors.gray[700]}
            _hover={{
              bg: isFavorite ? colors.error : 'white',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
            aria-label="Add to favorites"
          />

          {/* Compare Checkbox */}
          {showCompareCheckbox && (
            <Box
              position="absolute"
              bottom={spacing[3]}
              right={spacing[3]}
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                isChecked={isCompared}
                onChange={onCompareToggle}
                bg="white"
                borderRadius={borderRadius.sm}
                size="lg"
                colorScheme="blue"
              >
                <Text fontSize="xs" fontWeight="medium" color="white" textShadow="0 1px 2px rgba(0,0,0,0.5)">
                  Compare
                </Text>
              </Checkbox>
            </Box>
          )}
        </Box>

        {/* Content Section */}
        <Flex flex="1" direction="column" p={spacing[5]}>
          <VStack align="start" spacing={spacing[3]} flex="1">
            {/* Title and Price */}
            <Flex justifyContent="space-between" width="full" alignItems="start">
              <Heading
                as="h3"
                fontSize={typography.fontSize.xl}
                fontWeight={typography.fontWeight.semibold}
                color={colors.gray[900]}
                noOfLines={1}
              >
                {property.title}
              </Heading>
              <VStack align="end" spacing={0} ml={spacing[4]}>
                <Text
                  fontSize={typography.fontSize['2xl']}
                  fontWeight={typography.fontWeight.bold}
                  color={colors.primary[700]}
                  whiteSpace="nowrap"
                >
                  {formatPrice(property.price)}
                </Text>
                <Text fontSize={typography.fontSize.xs} color={colors.gray[500]}>
                  per month
                </Text>
              </VStack>
            </Flex>

            {/* Location */}
            <HStack spacing={spacing[2]} color={colors.gray[600]}>
              <Icon as={FiMapPin} />
              <Text fontSize={typography.fontSize.sm}>{property.city}</Text>
            </HStack>

            {/* Conversational Text */}
            <Text
              fontSize={typography.fontSize.sm}
              color={colors.primary[700]}
              fontWeight={typography.fontWeight.medium}
            >
              {distanceFromSchool}
            </Text>

            {/* Description */}
            <Text
              fontSize={typography.fontSize.sm}
              color={colors.gray[600]}
              noOfLines={2}
              lineHeight={typography.lineHeight.relaxed}
            >
              {property.description}
            </Text>

            {/* Features */}
            <HStack spacing={spacing[4]} flexWrap="wrap">
              <HStack spacing={spacing[1]}>
                <Icon as={FiUsers} color={colors.gray[500]} boxSize={4} />
                <Text fontSize={typography.fontSize.sm} color={colors.gray[600]}>
                  {property.availablePerson} persons
                </Text>
              </HStack>
              <HStack spacing={spacing[1]}>
                <Icon as={FiWifi} color={colors.gray[500]} boxSize={4} />
                <Text fontSize={typography.fontSize.sm} color={colors.gray[600]}>
                  {wifiSpeed}
                </Text>
              </HStack>
              <HStack spacing={spacing[1]}>
                <Icon as={FiShield} color={colors.gray[500]} boxSize={4} />
                <Text fontSize={typography.fontSize.sm} color={colors.gray[600]}>
                  Safety: {safetyScore}/5
                </Text>
              </HStack>
            </HStack>

            {/* Tags */}
            <HStack spacing={spacing[2]} flexWrap="wrap">
              <Badge
                colorScheme="blue"
                px={spacing[2]}
                py={spacing[1]}
                borderRadius={borderRadius.sm}
              >
                {property.bedType}
              </Badge>
              <Badge
                colorScheme="green"
                px={spacing[2]}
                py={spacing[1]}
                borderRadius={borderRadius.sm}
              >
                Available Now
              </Badge>
              <Badge
                colorScheme="purple"
                px={spacing[2]}
                py={spacing[1]}
                borderRadius={borderRadius.sm}
              >
                Best for students
              </Badge>
            </HStack>
          </VStack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default PropertyListCard;
