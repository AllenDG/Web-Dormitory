import { Box, Flex, Spinner, Text, Skeleton, SkeletonText } from '@chakra-ui/react';
import { colors, spacing, typography } from '../styles/tokens';

/**
 * LoadingState Component
 * Provides various loading state indicators
 */

// Full page loading spinner
export const FullPageLoader = ({ message = 'Loading...' }) => {
  return (
    <Flex
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      alignItems="center"
      justifyContent="center"
      bg="rgba(255, 255, 255, 0.9)"
      zIndex={9999}
      flexDirection="column"
      gap={spacing[4]}
    >
      <Spinner
        size="xl"
        color={colors.primary[500]}
        thickness="4px"
        speed="0.65s"
      />
      <Text
        fontSize={typography.fontSize.base}
        color={colors.gray[600]}
        fontWeight={typography.fontWeight.medium}
      >
        {message}
      </Text>
    </Flex>
  );
};

// Inline loading spinner
export const InlineLoader = ({ size = 'md', message }) => {
  return (
    <Flex alignItems="center" gap={spacing[3]}>
      <Spinner size={size} color={colors.primary[500]} />
      {message && (
        <Text fontSize={typography.fontSize.sm} color={colors.gray[600]}>
          {message}
        </Text>
      )}
    </Flex>
  );
};

// Card skeleton loader
export const CardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={index}
          bg="white"
          borderRadius={spacing[2]}
          p={spacing[4]}
          boxShadow="sm"
        >
          <Skeleton height="200px" borderRadius={spacing[2]} mb={spacing[4]} />
          <SkeletonText noOfLines={3} spacing={spacing[2]} />
        </Box>
      ))}
    </>
  );
};

// Property card skeleton
export const PropertyCardSkeleton = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={index}
          bg="white"
          borderRadius={spacing[2]}
          overflow="hidden"
          boxShadow="sm"
        >
          <Skeleton height="240px" />
          <Box p={spacing[4]}>
            <Skeleton height="24px" mb={spacing[3]} width="70%" />
            <SkeletonText noOfLines={2} spacing={spacing[2]} mb={spacing[3]} />
            <Flex justifyContent="space-between" alignItems="center">
              <Skeleton height="20px" width="100px" />
              <Skeleton height="32px" width="80px" />
            </Flex>
          </Box>
        </Box>
      ))}
    </>
  );
};

// List skeleton
export const ListSkeleton = ({ count = 5 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Flex
          key={index}
          alignItems="center"
          gap={spacing[4]}
          p={spacing[4]}
          borderBottom={`1px solid ${colors.gray[200]}`}
        >
          <Skeleton height="60px" width="60px" borderRadius={spacing[2]} />
          <Box flex="1">
            <Skeleton height="20px" mb={spacing[2]} width="60%" />
            <SkeletonText noOfLines={1} width="40%" />
          </Box>
        </Flex>
      ))}
    </>
  );
};

// Default export
const LoadingState = {
  FullPageLoader,
  InlineLoader,
  CardSkeleton,
  PropertyCardSkeleton,
  ListSkeleton,
};

export default LoadingState;
