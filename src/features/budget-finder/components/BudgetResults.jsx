import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Image,
  Badge,
  Icon,
  Divider,
  Progress,
} from '@chakra-ui/react';
import { FiCheck, FiTrendingUp, FiAward, FiRefreshCw } from 'react-icons/fi';
import { Button } from '../../../shared/components';
import { colors, spacing, borderRadius, typography } from '../../../shared/styles/tokens';

/**
 * BudgetResults Component
 * Displays recommended properties with explanations
 */
const BudgetResults = ({ recommendations, budget, onReset, onViewProperty }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getValueColor = (rating) => {
    switch (rating) {
      case 'Excellent':
        return colors.success;
      case 'Good':
        return colors.primary[700];
      case 'Fair':
        return colors.warning;
      default:
        return colors.gray[500];
    }
  };

  return (
    <VStack spacing={spacing[8]} align="stretch">
      {/* Header */}
      <Box
        bg="white"
        borderRadius={borderRadius.lg}
        border={`1px solid ${colors.gray[200]}`}
        p={spacing[6]}
      >
        <VStack spacing={spacing[4]}>
          <HStack spacing={spacing[2]}>
            <Icon as={FiAward} boxSize={6} color={colors.primary[700]} />
            <Heading
              fontSize={typography.fontSize['2xl']}
              fontWeight={typography.fontWeight.semibold}
              color={colors.gray[900]}
            >
              Your Best Matches
            </Heading>
          </HStack>
          <Text
            fontSize={typography.fontSize.base}
            color={colors.gray[600]}
            textAlign="center"
          >
            Based on your budget of {formatPrice(budget[0])} - {formatPrice(budget[1])},
            we found {recommendations.length} properties that offer the best value.
          </Text>
          <Button
            leftIcon={<Icon as={FiRefreshCw} />}
            variant="outline"
            size="sm"
            onClick={onReset}
            borderColor={colors.gray[300]}
            color={colors.gray[700]}
            _hover={{
              bg: colors.gray[50],
            }}
          >
            Adjust Preferences
          </Button>
        </VStack>
      </Box>

      {/* Results Grid */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={spacing[6]}>
        {recommendations.map((property, index) => (
          <Box
            key={property.id}
            bg="white"
            borderRadius={borderRadius.lg}
            border={`1px solid ${colors.gray[200]}`}
            overflow="hidden"
            transition="all 0.3s"
            _hover={{
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              transform: 'translateY(-4px)',
            }}
          >
            {/* Rank Badge */}
            {index === 0 && (
              <Box
                position="absolute"
                top={spacing[4]}
                left={spacing[4]}
                bg={colors.primary[700]}
                color="white"
                px={spacing[3]}
                py={spacing[1]}
                borderRadius={borderRadius.md}
                fontSize={typography.fontSize.sm}
                fontWeight={typography.fontWeight.semibold}
                zIndex={1}
                boxShadow="0 2px 4px rgba(0,0,0,0.2)"
              >
                🏆 Best Match
              </Box>
            )}

            {/* Image */}
            <Box position="relative" height="200px">
              <Image
                src={property.imageUrl[0]}
                alt={property.title}
                width="100%"
                height="100%"
                objectFit="cover"
              />
            </Box>

            {/* Content */}
            <VStack align="stretch" spacing={spacing[4]} p={spacing[5]}>
              {/* Title and Price */}
              <VStack align="stretch" spacing={spacing[2]}>
                <Heading
                  fontSize={typography.fontSize.lg}
                  fontWeight={typography.fontWeight.semibold}
                  color={colors.gray[900]}
                  noOfLines={1}
                >
                  {property.title}
                </Heading>
                <HStack justify="space-between" align="center">
                  <Text
                    fontSize={typography.fontSize['2xl']}
                    fontWeight={typography.fontWeight.bold}
                    color={colors.primary[700]}
                  >
                    {formatPrice(property.price)}
                    <Text
                      as="span"
                      fontSize={typography.fontSize.sm}
                      fontWeight={typography.fontWeight.normal}
                      color={colors.gray[600]}
                    >
                      /mo
                    </Text>
                  </Text>
                  <Badge
                    bg={getValueColor(property.valueRating)}
                    color="white"
                    px={spacing[3]}
                    py={spacing[1]}
                    borderRadius={borderRadius.sm}
                    fontSize={typography.fontSize.xs}
                  >
                    {property.valueRating} Value
                  </Badge>
                </HStack>
              </VStack>

              <Divider />

              {/* Match Score */}
              <Box>
                <HStack justify="space-between" mb={spacing[2]}>
                  <HStack spacing={spacing[1]}>
                    <Icon as={FiTrendingUp} color={colors.primary[700]} boxSize={4} />
                    <Text
                      fontSize={typography.fontSize.sm}
                      fontWeight={typography.fontWeight.medium}
                      color={colors.gray[700]}
                    >
                      Match Score
                    </Text>
                  </HStack>
                  <Text
                    fontSize={typography.fontSize.sm}
                    fontWeight={typography.fontWeight.semibold}
                    color={colors.primary[700]}
                  >
                    {property.score}%
                  </Text>
                </HStack>
                <Progress
                  value={property.score}
                  size="sm"
                  colorScheme="blue"
                  borderRadius={borderRadius.sm}
                  bg={colors.gray[200]}
                />
              </Box>

              <Divider />

              {/* Why This Dorm */}
              <Box>
                <Text
                  fontSize={typography.fontSize.sm}
                  fontWeight={typography.fontWeight.semibold}
                  color={colors.gray[900]}
                  mb={spacing[2]}
                >
                  Why this dorm?
                </Text>
                <VStack align="stretch" spacing={spacing[2]}>
                  {property.reasons.map((reason, idx) => (
                    <HStack key={idx} spacing={spacing[2]} align="start">
                      <Icon
                        as={FiCheck}
                        color={colors.success}
                        boxSize={4}
                        mt="2px"
                        flexShrink={0}
                      />
                      <Text
                        fontSize={typography.fontSize.sm}
                        color={colors.gray[600]}
                        lineHeight={typography.lineHeight.relaxed}
                      >
                        {reason}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>

              {/* Location and Room Type */}
              <HStack spacing={spacing[4]} flexWrap="wrap">
                <Badge
                  colorScheme="gray"
                  px={spacing[2]}
                  py={spacing[1]}
                  borderRadius={borderRadius.sm}
                >
                  {property.city}
                </Badge>
                <Badge
                  colorScheme="blue"
                  px={spacing[2]}
                  py={spacing[1]}
                  borderRadius={borderRadius.sm}
                >
                  {property.bedType}
                </Badge>
                <Badge
                  colorScheme="purple"
                  px={spacing[2]}
                  py={spacing[1]}
                  borderRadius={borderRadius.sm}
                >
                  {property.availablePerson} persons
                </Badge>
              </HStack>

              {/* View Button */}
              <Button
                width="100%"
                bg={colors.primary[700]}
                color="white"
                onClick={() => onViewProperty(property.id)}
                _hover={{
                  bg: colors.primary[800],
                }}
              >
                View Details
              </Button>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {/* No Results Message */}
      {recommendations.length === 0 && (
        <Box
          bg="white"
          borderRadius={borderRadius.lg}
          border={`1px solid ${colors.gray[200]}`}
          p={spacing[12]}
          textAlign="center"
        >
          <VStack spacing={spacing[4]}>
            <Text fontSize="48px">🏠</Text>
            <Heading
              fontSize={typography.fontSize.xl}
              color={colors.gray[900]}
            >
              No properties found
            </Heading>
            <Text color={colors.gray[600]}>
              Try adjusting your budget or preferences to see more results
            </Text>
            <Button
              onClick={onReset}
              bg={colors.primary[700]}
              color="white"
              _hover={{
                bg: colors.primary[800],
              }}
            >
              Adjust Preferences
            </Button>
          </VStack>
        </Box>
      )}
    </VStack>
  );
};

export default BudgetResults;
