import { Box, VStack, Drawer, DrawerOverlay, DrawerContent, useDisclosure, Flex, IconButton, Icon } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiMap, FiList } from 'react-icons/fi';
import {
  StickyFilterBar,
  AdvancedFiltersPanel,
  PropertyListCard,
  ComparisonPanel,
} from './components';
import { MapView } from '../../shared/components';
import useRentalStore from '../../shared/stores/useRentalStore';
import { colors, spacing, borderRadius } from '../../shared/styles/tokens';

/**
 * Redesigned Find Rentals Page - Phase 3 & 4
 * Features: Sticky filter bar, desktop layout, comparison, map integration
 */
const FindRentalsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    filters,
    setFilters,
    resetFilters,
    getFilteredRentals,
    toggleFavorite,
    isFavorite,
  } = useRentalStore();

  const { isOpen: isFiltersOpen, onOpen: onFiltersOpen, onClose: onFiltersClose } = useDisclosure();
  const [sortBy, setSortBy] = useState('relevance');
  const [comparedProperties, setComparedProperties] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [selectedProperty, setSelectedProperty] = useState(null);

  const filteredRentals = getFilteredRentals();

  // Initialize from URL params
  useEffect(() => {
    const query = searchParams.get('q');
    const city = searchParams.get('city');
    const location = searchParams.get('location');
    const minBudget = searchParams.get('minBudget');
    const maxBudget = searchParams.get('maxBudget');
    const roomType = searchParams.get('roomType');
    const gender = searchParams.get('gender');
    const university = searchParams.get('university');

    const newFilters = {};
    if (query) newFilters.searchQuery = query;
    if (city) newFilters.city = city;
    if (location) newFilters.location = location;
    if (minBudget && maxBudget) {
      newFilters.priceRange = [parseInt(minBudget), parseInt(maxBudget)];
    }
    if (roomType) newFilters.roomType = roomType;
    if (gender) newFilters.gender = gender;
    if (university) newFilters.university = university;

    if (Object.keys(newFilters).length > 0) {
      setFilters(newFilters);
    }
  }, [searchParams, setFilters]);

  // Sort rentals
  const sortedRentals = [...filteredRentals].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return b.id - a.id;
      case 'rating':
        return 0; // TODO: Implement rating sort
      default:
        return 0;
    }
  });

  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.priceRange && (filters.priceRange[0] > 1000 || filters.priceRange[1] < 20000)) count++;
    if (filters.roomType) count++;
    if (filters.gender) count++;
    if (filters.amenities && filters.amenities.length > 0) count += filters.amenities.length;
    if (filters.facilities && filters.facilities.length > 0) count += filters.facilities.length;
    return count;
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    resetFilters();
    onFiltersClose();
  };

  const handleApplyFilters = () => {
    onFiltersClose();
  };

  const handleCompareToggle = (property) => {
    setComparedProperties((prev) => {
      const exists = prev.find((p) => p.id === property.id);
      if (exists) {
        const updated = prev.filter((p) => p.id !== property.id);
        if (updated.length === 0) {
          setShowComparison(false);
        }
        return updated;
      } else {
        if (prev.length >= 3) {
          alert('You can compare up to 3 properties at a time');
          return prev;
        }
        const updated = [...prev, property];
        setShowComparison(true);
        return updated;
      }
    });
  };

  const handleRemoveFromComparison = (propertyId) => {
    setComparedProperties((prev) => {
      const updated = prev.filter((p) => p.id !== propertyId);
      if (updated.length === 0) {
        setShowComparison(false);
      }
      return updated;
    });
  };

  const isPropertyCompared = (propertyId) => {
    return comparedProperties.some((p) => p.id === propertyId);
  };

  return (
    <Box bg={colors.gray[50]} minH="100vh" pb={showComparison ? '400px' : spacing[12]}>
      {/* Sticky Filter Bar */}
      <StickyFilterBar
        activeFiltersCount={countActiveFilters()}
        onOpenFilters={onFiltersOpen}
        onResetFilters={handleResetFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
        resultsCount={sortedRentals.length}
      />

      {/* View Mode Toggle */}
      <Box
        maxW="1400px"
        mx="auto"
        px={{ base: spacing[4], md: spacing[6] }}
        pt={spacing[4]}
      >
        <Flex justify="flex-end" mb={spacing[4]}>
          <Flex
            bg="white"
            borderRadius={borderRadius.md}
            border={`1px solid ${colors.gray[200]}`}
            overflow="hidden"
          >
            <IconButton
              icon={<Icon as={FiList} />}
              aria-label="List view"
              onClick={() => setViewMode('list')}
              bg={viewMode === 'list' ? colors.primary[700] : 'white'}
              color={viewMode === 'list' ? 'white' : colors.gray[600]}
              borderRadius={0}
              _hover={{
                bg: viewMode === 'list' ? colors.primary[800] : colors.gray[50],
              }}
            />
            <IconButton
              icon={<Icon as={FiMap} />}
              aria-label="Map view"
              onClick={() => setViewMode('map')}
              bg={viewMode === 'map' ? colors.primary[700] : 'white'}
              color={viewMode === 'map' ? 'white' : colors.gray[600]}
              borderRadius={0}
              _hover={{
                bg: viewMode === 'map' ? colors.primary[800] : colors.gray[50],
              }}
            />
          </Flex>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box maxW="1400px" mx="auto" px={{ base: spacing[4], md: spacing[6] }} pb={spacing[8]}>
        {viewMode === 'list' ? (
          // List View
          sortedRentals.length > 0 ? (
            <VStack spacing={spacing[4]} align="stretch">
              {sortedRentals.map((rental) => (
                <PropertyListCard
                  key={rental.id}
                  property={rental}
                  onClick={() => navigate(`/listing/${rental.id}`)}
                  onFavoriteToggle={() => toggleFavorite(rental.id)}
                  isFavorite={isFavorite(rental.id)}
                  onCompareToggle={() => handleCompareToggle(rental)}
                  isCompared={isPropertyCompared(rental.id)}
                  showCompareCheckbox={true}
                />
              ))}
            </VStack>
          ) : (
            <Box
              bg="white"
              borderRadius={spacing[2]}
              p={spacing[12]}
              textAlign="center"
            >
              <VStack spacing={spacing[4]}>
                <Box fontSize="48px">🏠</Box>
                <Box>
                  <Box
                    as="h2"
                    fontSize="xl"
                    fontWeight="semibold"
                    color={colors.gray[900]}
                    mb={spacing[2]}
                  >
                    No properties found
                  </Box>
                  <Box fontSize="sm" color={colors.gray[600]}>
                    Try adjusting your filters to see more results
                  </Box>
                </Box>
                <button
                  onClick={handleResetFilters}
                  style={{
                    padding: `${spacing[3]} ${spacing[6]}`,
                    backgroundColor: colors.primary[700],
                    color: 'white',
                    borderRadius: spacing[2],
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: 'none',
                  }}
                >
                  Reset Filters
                </button>
              </VStack>
            </Box>
          )
        ) : (
          // Map View
          <Flex gap={spacing[4]} direction={{ base: 'column', lg: 'row' }}>
            {/* Map */}
            <Box flex="1" minH="600px">
              <MapView
                properties={sortedRentals}
                selectedProperty={selectedProperty}
                onPropertySelect={setSelectedProperty}
                onPropertyClick={(property) => navigate(`/listing/${property.id}`)}
                height="calc(100vh - 250px)"
              />
            </Box>

            {/* Property List Sidebar */}
            <Box
              width={{ base: '100%', lg: '400px' }}
              maxH="calc(100vh - 250px)"
              overflowY="auto"
            >
              <VStack spacing={spacing[3]} align="stretch">
                {sortedRentals.map((rental) => (
                  <Box
                    key={rental.id}
                    bg="white"
                    borderRadius={borderRadius.md}
                    border={`2px solid ${selectedProperty?.id === rental.id ? colors.primary[700] : colors.gray[200]}`}
                    p={spacing[3]}
                    cursor="pointer"
                    onClick={() => setSelectedProperty(rental)}
                    transition="all 0.2s"
                    _hover={{
                      borderColor: colors.primary[500],
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <PropertyListCard
                      property={rental}
                      onClick={() => navigate(`/listing/${rental.id}`)}
                      onFavoriteToggle={() => toggleFavorite(rental.id)}
                      isFavorite={isFavorite(rental.id)}
                      onCompareToggle={() => handleCompareToggle(rental)}
                      isCompared={isPropertyCompared(rental.id)}
                      showCompareCheckbox={false}
                    />
                  </Box>
                ))}
              </VStack>
            </Box>
          </Flex>
        )}
      </Box>

      {/* Filters Drawer */}
      <Drawer isOpen={isFiltersOpen} onClose={onFiltersClose} size="md" placement="right">
        <DrawerOverlay />
        <DrawerContent>
          <AdvancedFiltersPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            onApply={handleApplyFilters}
          />
        </DrawerContent>
      </Drawer>

      {/* Comparison Panel */}
      {showComparison && (
        <ComparisonPanel
          properties={comparedProperties}
          onRemove={handleRemoveFromComparison}
          onClose={() => setShowComparison(false)}
        />
      )}
    </Box>
  );
};

export default FindRentalsPage;
