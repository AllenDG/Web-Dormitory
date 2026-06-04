import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  Checkbox,
  CheckboxGroup,
  Button,
  Icon,
  HStack,
  Divider,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { FiSearch, FiWifi, FiWind, FiHome, FiCoffee, FiTruck, FiHeart } from 'react-icons/fi';
import { useState } from 'react';

/**
 * Filter Sidebar v3.0
 * Desktop left sidebar (280px) with all filters
 * Airbnb-inspired design
 */

const amenityIcons = {
  'Wifi / Internet': FiWifi,
  'Air Conditioning': FiWind,
  'Kitchen': FiCoffee,
  'Parking': FiTruck,
  'Pet Friendly': FiHeart,
};

const FilterSidebar = ({ filters, onFilterChange, onReset }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handlePriceChange = (values) => {
    setLocalFilters({ ...localFilters, priceRange: values });
  };

  const handleRoomTypeChange = (values) => {
    setLocalFilters({ ...localFilters, roomTypes: values });
  };

  const handleAmenityChange = (values) => {
    setLocalFilters({ ...localFilters, amenities: values });
  };

  const handleAvailabilityChange = (e) => {
    setLocalFilters({ ...localFilters, availableOnly: e.target.checked });
  };

  const handleApply = () => {
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      searchQuery: '',
      priceRange: [1000, 15000],
      roomTypes: [],
      amenities: [],
      availableOnly: false,
    };
    setLocalFilters(resetFilters);
    onReset();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Box
      w="280px"
      h="calc(100vh - 64px)"
      position="sticky"
      top="64px"
      overflowY="auto"
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
      p={6}
      css={{
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '3px',
        },
      }}
    >
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="md" mb={2}>
            Filters
          </Heading>
          <Text fontSize="sm" color="gray.600">
            {filters.resultsCount || 0} properties found
          </Text>
        </Box>

        <Divider />

        {/* Location Search */}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="semibold">
            Location
          </FormLabel>
          <Input
            placeholder="City or barangay"
            value={localFilters.searchQuery || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, searchQuery: e.target.value })}
            leftElement={<Icon as={FiSearch} color="gray.400" ml={3} />}
          />
        </FormControl>

        <Divider />

        {/* Budget Slider */}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="semibold" mb={3}>
            Budget Range
          </FormLabel>
          <Text fontSize="sm" color="primary.600" fontWeight="semibold" mb={4}>
            {formatPrice(localFilters.priceRange?.[0] || 1000)} – {formatPrice(localFilters.priceRange?.[1] || 15000)}/mo
          </Text>
          <RangeSlider
            min={1000}
            max={15000}
            step={500}
            value={localFilters.priceRange || [1000, 15000]}
            onChange={handlePriceChange}
            colorScheme="primary"
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
        </FormControl>

        <Divider />

        {/* Room Type */}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="semibold" mb={3}>
            Room Type
          </FormLabel>
          <CheckboxGroup
            value={localFilters.roomTypes || []}
            onChange={handleRoomTypeChange}
          >
            <VStack align="start" spacing={2}>
              {['Studio', 'Bed Spacer', 'Condo', 'Family Room', 'Apartment'].map((type) => (
                <Checkbox key={type} value={type} size="sm">
                  {type}
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>
        </FormControl>

        <Divider />

        {/* Amenities */}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="semibold" mb={3}>
            Amenities
          </FormLabel>
          <CheckboxGroup
            value={localFilters.amenities || []}
            onChange={handleAmenityChange}
          >
            <VStack align="start" spacing={2}>
              {Object.entries(amenityIcons).map(([amenity, IconComponent]) => (
                <Checkbox key={amenity} value={amenity} size="sm">
                  <HStack spacing={2}>
                    <Icon as={IconComponent} boxSize={4} />
                    <Text fontSize="sm">{amenity}</Text>
                  </HStack>
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>
        </FormControl>

        <Divider />

        {/* Availability Toggle */}
        <FormControl display="flex" alignItems="center" justifyContent="space-between">
          <FormLabel fontSize="sm" fontWeight="semibold" mb={0}>
            Available Only
          </FormLabel>
          <Switch
            isChecked={localFilters.availableOnly || false}
            onChange={handleAvailabilityChange}
            colorScheme="primary"
          />
        </FormControl>

        <Divider />

        {/* Action Buttons */}
        <VStack spacing={3}>
          <Button
            w="full"
            colorScheme="primary"
            onClick={handleApply}
          >
            Show {filters.resultsCount || 0} Results
          </Button>
          <Button
            w="full"
            variant="ghost"
            onClick={handleReset}
          >
            Clear Filters
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default FilterSidebar;
