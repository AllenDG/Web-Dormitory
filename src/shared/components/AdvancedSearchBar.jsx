import { useState } from 'react';
import {
  Box,
  Flex,
  Button,
  Icon,
  useDisclosure,
  Collapse,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { FiSearch, FiSliders } from 'react-icons/fi';
import LocationAutocomplete from './LocationAutocomplete';
import BudgetRangeSlider from './BudgetRangeSlider';
import Select from './Select';
import { colors, spacing, borderRadius, typography, shadows } from '../styles/tokens';

/**
 * AdvancedSearchBar Component
 * Comprehensive search interface with location, budget, and filters
 */
const AdvancedSearchBar = ({ onSearch, ...props }) => {
  const { isOpen, onToggle } = useDisclosure();
  const [searchParams, setSearchParams] = useState({
    location: null,
    budget: [3000, 10000],
    roomType: '',
    gender: '',
    nearbyUniversity: '',
  });

  const roomTypeOptions = [
    { value: 'solo', label: 'Solo Room' },
    { value: 'shared', label: 'Shared Room' },
    { value: 'studio', label: 'Studio Type' },
    { value: 'apartment', label: 'Apartment' },
  ];

  const genderOptions = [
    { value: 'any', label: 'Any' },
    { value: 'male', label: 'Male Only' },
    { value: 'female', label: 'Female Only' },
    { value: 'mixed', label: 'Mixed' },
  ];

  const universityOptions = [
    { value: '', label: 'Any University' },
    { value: 'up-diliman', label: 'UP Diliman' },
    { value: 'ateneo', label: 'Ateneo de Manila' },
    { value: 'dlsu', label: 'De La Salle University' },
    { value: 'ust', label: 'University of Santo Tomas' },
    { value: 'admu', label: 'Adamson University' },
    { value: 'plm', label: 'Pamantasan ng Lungsod ng Maynila' },
    { value: 'pup', label: 'Polytechnic University of the Philippines' },
  ];

  const handleLocationSelect = (location) => {
    setSearchParams((prev) => ({ ...prev, location }));
  };

  const handleBudgetChange = (budget) => {
    setSearchParams((prev) => ({ ...prev, budget }));
  };

  const handleRoomTypeChange = (e) => {
    setSearchParams((prev) => ({ ...prev, roomType: e.target.value }));
  };

  const handleGenderChange = (e) => {
    setSearchParams((prev) => ({ ...prev, gender: e.target.value }));
  };

  const handleUniversityChange = (e) => {
    setSearchParams((prev) => ({ ...prev, nearbyUniversity: e.target.value }));
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchParams);
    }
  };

  return (
    <Box
      bg="white"
      borderRadius={borderRadius.lg}
      boxShadow={shadows.lg}
      p={spacing[6]}
      {...props}
    >
      {/* Main Search Row */}
      <Grid
        templateColumns={{ base: '1fr', md: '1fr auto' }}
        gap={spacing[4]}
        mb={spacing[4]}
      >
        <GridItem>
          <LocationAutocomplete
            placeholder="Where do you want to stay?"
            onSelect={handleLocationSelect}
            showCurrentLocation
          />
        </GridItem>
        <GridItem>
          <Flex gap={spacing[3]}>
            <Button
              leftIcon={<Icon as={FiSliders} />}
              onClick={onToggle}
              variant="outline"
              borderColor={colors.gray[200]}
              color={colors.gray[700]}
              borderRadius={borderRadius.lg}
              _hover={{
                bg: colors.gray[50],
                borderColor: colors.gray[300],
              }}
              height="48px"
            >
              Filters
            </Button>
            <Button
              leftIcon={<Icon as={FiSearch} />}
              onClick={handleSearch}
              bg={colors.primary[700]}
              color="white"
              borderRadius={borderRadius.lg}
              _hover={{
                bg: colors.primary[800],
              }}
              height="48px"
              px={spacing[8]}
            >
              Search
            </Button>
          </Flex>
        </GridItem>
      </Grid>

      {/* Advanced Filters */}
      <Collapse in={isOpen} animateOpacity>
        <Box
          pt={spacing[4]}
          borderTop={`1px solid ${colors.gray[200]}`}
        >
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
            gap={spacing[6]}
          >
            {/* Budget Range */}
            <GridItem>
              <BudgetRangeSlider
                min={1000}
                max={20000}
                step={500}
                defaultValue={searchParams.budget}
                onChange={handleBudgetChange}
              />
            </GridItem>

            {/* Room Type */}
            <GridItem>
              <Select
                label="Room Type"
                placeholder="Select room type"
                options={roomTypeOptions}
                value={searchParams.roomType}
                onChange={handleRoomTypeChange}
              />
            </GridItem>

            {/* Gender Preference */}
            <GridItem>
              <Select
                label="Gender Preference"
                placeholder="Select preference"
                options={genderOptions}
                value={searchParams.gender}
                onChange={handleGenderChange}
              />
            </GridItem>

            {/* Nearby University */}
            <GridItem colSpan={{ base: 1, lg: 3 }}>
              <Select
                label="Nearby University"
                placeholder="Select university"
                options={universityOptions}
                value={searchParams.nearbyUniversity}
                onChange={handleUniversityChange}
              />
            </GridItem>
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
};

export default AdvancedSearchBar;
