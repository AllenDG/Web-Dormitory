import {
  Box,
  HStack,
  VStack,
  Text,
  Icon,
  Badge,
  Progress,
} from '@chakra-ui/react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

/**
 * Enhanced Stat Card Component
 * Displays key metrics with trend indicators and progress
 */

const StatCard = ({
  label,
  value,
  icon,
  color = 'primary',
  trend,
  trendValue,
  helpText,
  showProgress = false,
  progressValue,
  progressMax = 100,
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend) {
      case 'up':
        return FiTrendingUp;
      case 'down':
        return FiTrendingDown;
      default:
        return FiMinus;
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'gray';
    switch (trend) {
      case 'up':
        return 'green';
      case 'down':
        return 'red';
      default:
        return 'gray';
    }
  };

  const TrendIcon = getTrendIcon();

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
      boxShadow="sm"
      transition="all 0.2s"
      _hover={{
        boxShadow: 'md',
        transform: 'translateY(-2px)',
      }}
    >
      <VStack align="stretch" spacing={4}>
        {/* Header with Icon */}
        <HStack justify="space-between">
          <Box
            p={3}
            borderRadius="lg"
            bg={`${color}.50`}
          >
            <Icon as={icon} boxSize={6} color={`${color}.600`} />
          </Box>
          {trend && trendValue && (
            <Badge
              colorScheme={getTrendColor()}
              fontSize="xs"
              px={2}
              py={1}
              borderRadius="md"
            >
              <HStack spacing={1}>
                <Icon as={TrendIcon} boxSize={3} />
                <Text>{trendValue}</Text>
              </HStack>
            </Badge>
          )}
        </HStack>

        {/* Label and Value */}
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" color="gray.600" fontWeight="medium">
            {label}
          </Text>
          <Text fontSize="3xl" fontWeight="bold" color="gray.900">
            {value}
          </Text>
          {helpText && (
            <Text fontSize="xs" color="gray.500">
              {helpText}
            </Text>
          )}
        </VStack>

        {/* Progress Bar */}
        {showProgress && progressValue !== undefined && (
          <VStack align="stretch" spacing={1}>
            <HStack justify="space-between" fontSize="xs" color="gray.600">
              <Text>Progress</Text>
              <Text fontWeight="semibold">
                {progressValue}/{progressMax}
              </Text>
            </HStack>
            <Progress
              value={(progressValue / progressMax) * 100}
              size="sm"
              colorScheme={color}
              borderRadius="full"
            />
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default StatCard;
