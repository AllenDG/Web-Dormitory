import { Box, HStack, VStack, Text, Icon, Progress } from '@chakra-ui/react';

/**
 * Shared Stat Card Component
 * Displays a key metric: label + value on the left, a color-coded icon chip
 * on the right, and a color-coded left border so a row of cards reads at a
 * glance (e.g. red = needs attention, green = healthy). Used by both the
 * owner and admin dashboards.
 */

const StatCard = ({
  label,
  value,
  icon,
  color = 'primary',
  helpText,
  showProgress = false,
  progressValue,
  progressMax = 100,
}) => {
  return (
    <Box
      bg={`${color}.50`}
      p={5}
      borderRadius="lg"
      border="1px"
      borderColor={`${color}.200`}
    >
      <HStack justify="space-between" align="flex-start" spacing={3}>
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" color="gray.700" fontWeight="medium">
            {label}
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="gray.900">
            {value}
          </Text>
          {helpText && (
            <Text fontSize="xs" color="gray.700">
              {helpText}
            </Text>
          )}
        </VStack>

        <Box p={2.5} borderRadius="lg" bg="white" flexShrink={0}>
          <Icon as={icon} boxSize={5} color={`${color}.600`} />
        </Box>
      </HStack>

      {showProgress && progressValue !== undefined && (
        <VStack align="stretch" spacing={1} mt={3}>
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
    </Box>
  );
};

export default StatCard;
