import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Checkbox,
  CheckboxGroup,
  Stack,
  Divider,
  Button,
  Flex,
} from '@chakra-ui/react';
import { BudgetRangeSlider, Select } from '../../../shared/components';
import { colors, spacing, borderRadius, typography } from '../../../shared/styles/tokens';

/**
 * AdvancedFiltersPanel Component
 * Comprehensive filter panel with all available filters
 */
const AdvancedFiltersPanel = ({ filters, onFilterChange, onReset, onApply }) => {
  const roomTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'solo', label: 'Solo Room' },
    { value: 'shared', label: 'Shared Room' },
    { value: 'studio', label: 'Studio Type' },
    { value: 'apartment', label: 'Apartment' },
  ];

  const genderOptions = [
    { value: '', label: 'Any' },
    { value: 'male', label: 'Male Only' },
    { value: 'female', label: 'Female Only' },
    { value: 'mixed', label: 'Mixed' },
  ];

  const amenitiesList = [
    'WiFi',
    'Air Conditioning',
    'Laundry',
    'Parking',
    'Kitchen',
    'Study Area',
    'Security',
    'CCTV',
  ];

  const facilitiesList = [
    'Cooking Allowed',
    'Visitors Allowed',
    'Pet Friendly',
    'No Curfew',
    '24/7 Access',
    'Nearby Transport',
  ];

  return (
    <Box
      bg="white"
      borderRadius={borderRadius.lg}
      border={`1px solid ${colors.gray[200]}`}
      maxH="calc(100vh - 200px)"
      overflowY="auto"
    >
      <VStack spacing={spacing[6]} align="stretch" p={spacing[6]}>
        {/* Header */}
        <Flex justifyContent="space-between" alignItems="center">
          <Heading
            fontSize={typography.fontSize.lg}
            fontWeight={typography.fontWeight.semibold}
            color={colors.gray[900]}
          >
            All Filters
          </Heading>
          <Button
            size="sm"
            variant="ghost"
            onClick={onReset}
            color={colors.gray[600]}
            _hover={{ bg: colors.gray[100] }}
          >
            Reset All
          </Button>
        </Flex>

        <Divider />

        {/* Budget Range */}
        <Box>
          <BudgetRangeSlider
            min={1000}
            max={20000}
            step={500}
            defaultValue={filters.priceRange || [1000, 20000]}
            onChange={(value) => onFilterChange({ priceRange: value })}
          />
        </Box>

        <Divider />

        {/* Room Type */}
        <Box>
          <Select
            label="Room Type"
            options={roomTypeOptions}
            value={filters.roomType || ''}
            onChange={(e) => onFilterChange({ roomType: e.target.value })}
          />
        </Box>

        <Divider />

        {/* Gender Preference */}
        <Box>
          <Select
            label="Gender Preference"
            options={genderOptions}
            value={filters.gender || ''}
            onChange={(e) => onFilterChange({ gender: e.target.value })}
          />
        </Box>

        <Divider />

        {/* Amenities */}
        <Box>
          <Text
            fontSize={typography.fontSize.sm}
            fontWeight={typography.fontWeight.medium}
            color={colors.gray[700]}
            mb={spacing[3]}
          >
            Amenities
          </Text>
          <CheckboxGroup
            value={filters.amenities || []}
            onChange={(value) => onFilterChange({ amenities: value })}
          >
            <Stack spacing={spacing[2]}>
              {amenitiesList.map((amenity) => (
                <Checkbox
                  key={amenity}
                  value={amenity}
                  colorScheme="blue"
                  size="sm"
                >
                  <Text fontSize={typography.fontSize.sm} color={colors.gray[700]}>
                    {amenity}
                  </Text>
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </Box>

        <Divider />

        {/* Facilities & Policies */}
        <Box>
          <Text
            fontSize={typography.fontSize.sm}
            fontWeight={typography.fontWeight.medium}
            color={colors.gray[700]}
            mb={spacing[3]}
          >
            Facilities & Policies
          </Text>
          <CheckboxGroup
            value={filters.facilities || []}
            onChange={(value) => onFilterChange({ facilities: value })}
          >
            <Stack spacing={spacing[2]}>
              {facilitiesList.map((facility) => (
                <Checkbox
                  key={facility}
                  value={facility}
                  colorScheme="blue"
                  size="sm"
                >
                  <Text fontSize={typography.fontSize.sm} color={colors.gray[700]}>
                    {facility}
                  </Text>
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </Box>
      </VStack>

      {/* Apply Button */}
      <Box
        p={spacing[4]}
        borderTop={`1px solid ${colors.gray[200]}`}
        bg={colors.gray[50]}
      >
        <Button
          width="full"
          bg={colors.primary[700]}
          color="white"
          onClick={onApply}
          _hover={{
            bg: colors.primary[800],
          }}
        >
          Apply Filters
        </Button>
      </Box>
    </Box>
  );
};

export default AdvancedFiltersPanel;
