import { useState } from 'react';
import {
  Box,
  Flex,
  HStack,
  Button,
  Icon,
  Text,
  Badge,
  useDisclosure,
} from '@chakra-ui/react';
import { FiSliders, FiX } from 'react-icons/fi';
import { colors, spacing, borderRadius, shadows } from '../../../shared/styles/tokens';

/**
 * StickyFilterBar Component
 * Sticky top filter bar with active filter display
 */
const StickyFilterBar = ({
  activeFiltersCount = 0,
  onOpenFilters,
  onResetFilters,
  sortBy,
  onSortChange,
  resultsCount = 0,
}) => {
  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  return (
    <Box
      position="sticky"
      top="64px"
      zIndex={100}
      bg="white"
      borderBottom={`1px solid ${colors.gray[200]}`}
      boxShadow={shadows.sm}
      py={spacing[4]}
    >
      <Flex
        maxW="1400px"
        mx="auto"
        px={{ base: spacing[4], md: spacing[6] }}
        alignItems="center"
        justifyContent="space-between"
        gap={spacing[4]}
        flexWrap="wrap"
      >
        {/* Left: Results count and filters */}
        <HStack spacing={spacing[4]} flex="1">
          <Text
            fontSize="sm"
            fontWeight="medium"
            color={colors.gray[700]}
            whiteSpace="nowrap"
          >
            {resultsCount} {resultsCount === 1 ? 'property' : 'properties'}
          </Text>

          <Button
            leftIcon={<Icon as={FiSliders} />}
            onClick={onOpenFilters}
            variant="outline"
            size="sm"
            borderColor={colors.gray[300]}
            color={colors.gray[700]}
            borderRadius={borderRadius.md}
            _hover={{
              bg: colors.gray[50],
              borderColor: colors.gray[400],
            }}
          >
            Filters
            {activeFiltersCount > 0 && (
              <Badge
                ml={spacing[2]}
                bg={colors.primary[700]}
                color="white"
                borderRadius="full"
                px={spacing[2]}
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {activeFiltersCount > 0 && (
            <Button
              leftIcon={<Icon as={FiX} />}
              onClick={onResetFilters}
              variant="ghost"
              size="sm"
              color={colors.gray[600]}
              _hover={{
                bg: colors.gray[100],
                color: colors.gray[800],
              }}
            >
              Clear all
            </Button>
          )}
        </HStack>

        {/* Right: Sort dropdown */}
        <HStack spacing={spacing[2]}>
          <Text fontSize="sm" color={colors.gray[600]} whiteSpace="nowrap">
            Sort by:
          </Text>
          <Box position="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              style={{
                padding: `${spacing[2]} ${spacing[8]} ${spacing[2]} ${spacing[3]}`,
                fontSize: '14px',
                fontWeight: 500,
                color: colors.gray[700],
                backgroundColor: 'white',
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: borderRadius.md,
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23475569' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: `right ${spacing[2]} center`,
              }}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Box>
        </HStack>
      </Flex>
    </Box>
  );
};

export default StickyFilterBar;
