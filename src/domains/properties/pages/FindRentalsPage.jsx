import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Select,
  IconButton,
  Icon,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  Button,
  Grid,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FiMap, FiList, FiSliders } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar';
import { PropertyListCard, PropertyGridCard } from '../components';
import { MapView } from '../../../shared/components';
import { BudgetMatches, PopularNearby } from '../../../domains/recommendations';
import useRentalStore from '../../../shared/stores/useRentalStore';
import useRecommendationStore from '../../../shared/stores/useRecommendationStore';
import { CompareFloatingButton } from '../components';

/**
 * Find Rentals Page v6.0 - With Recommendations
 * 
 * Features:
 * - 2-column grid layout for better property viewing
 * - Split view with interactive map
 * - Advanced filtering and sorting
 * - Hover synchronization between cards and map
 * - Budget matches and popular nearby recommendations
 * - Responsive design for all devices
 * 
 * @component
 */
const FindRentalsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userPreferences } = useRecommendationStore();
  
  const {
    filters,
    setFilters,
    resetFilters,
    getFilteredRentals,
    toggleFavorite,
    isFavorite,
  } = useRentalStore();

  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('split'); // 'grid', 'split'
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const filteredRentals = getFilteredRentals();
  
  // Responsive: Show split view only on desktop
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const effectiveViewMode = isMobile ? 'grid' : viewMode;

  // Initialize from URL params
  useEffect(() => {
    const city = searchParams.get('city');
    const minBudget = searchParams.get('minBudget');
    const maxBudget = searchParams.get('maxBudget');
    const roomType = searchParams.get('roomType');
    const amenity = searchParams.get('amenity');

    const newFilters = {};
    if (city) newFilters.city = city;
    if (minBudget && maxBudget) {
      newFilters.priceRange = [parseInt(minBudget), parseInt(maxBudget)];
    }
    if (roomType) newFilters.roomTypes = [roomType];
    if (amenity) newFilters.amenities = [amenity];

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
      default:
        return 0;
    }
  });

  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Desktop Sidebar */}
      <Box display={{ base: 'none', lg: 'block' }}>
        <FilterSidebar
          filters={{ ...filters, resultsCount: sortedRentals.length }}
          onFilterChange={setFilters}
          onReset={resetFilters}
        />
      </Box>

      {/* Main Content */}
      <Box flex="1" minW="0">
        {/* Top Bar */}
        <Box
          bg="white"
          borderBottom="1px"
          borderColor="gray.200"
          px={6}
          py={3}
          position="sticky"
          top="0"
          zIndex="sticky"
        >
          <Flex justify="space-between" align="center" gap={4}>
            {/* Results Count */}
            <Text fontWeight="medium" fontSize="md">
              {sortedRentals.length} properties
              {filters.city && ` in ${filters.city}`}
            </Text>

            {/* Right Side Controls */}
            <HStack spacing={3}>
              {/* Mobile Filter Button */}
              <Button
                leftIcon={<Icon as={FiSliders} />}
                display={{ base: 'flex', lg: 'none' }}
                onClick={onOpen}
                size="sm"
              >
                Filters
              </Button>

              {/* Sort Dropdown */}
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                size="sm"
                w="180px"
              >
                <option value="relevance">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </Select>

              {/* View Toggle - Desktop Only */}
              <HStack spacing={0} bg="gray.100" borderRadius="8px" p={1} display={{ base: 'none', lg: 'flex' }}>
                <IconButton
                  icon={<Icon as={FiList} />}
                  size="sm"
                  variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                  colorScheme={viewMode === 'grid' ? 'primary' : 'gray'}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  borderRadius="8px"
                />
                <IconButton
                  icon={<Icon as={FiMap} />}
                  size="sm"
                  variant={viewMode === 'split' ? 'solid' : 'ghost'}
                  colorScheme={viewMode === 'split' ? 'primary' : 'gray'}
                  onClick={() => setViewMode('split')}
                  aria-label="Split view"
                  borderRadius="8px"
                />
              </HStack>
            </HStack>
          </Flex>
        </Box>

        {/* Content Area */}
        {effectiveViewMode === 'split' ? (
          // Split View: 2-Column Grid + Map (Desktop Only)
          <Flex h="calc(100vh - 120px)">
            {/* Left: Property Grid - 2 Columns */}
            <Box
              w="60%"
              overflowY="auto"
              p={4}
              css={{
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                  borderRadius: '4px',
                },
              }}
            >
              {sortedRentals.length > 0 ? (
                <Grid
                  templateColumns="repeat(2, 1fr)"
                  gap={4}
                >
                  {sortedRentals.map((rental) => (
                    <Box
                      key={rental.id}
                      onMouseEnter={() => setHoveredProperty(rental.id)}
                      onMouseLeave={() => setHoveredProperty(null)}
                      transform={hoveredProperty === rental.id ? 'scale(1.02)' : 'scale(1)'}
                      transition="transform 0.2s"
                    >
                      <PropertyGridCard
                        property={rental}
                        onClick={() => navigate(`/listing/${rental.id}`)}
                        onFavoriteToggle={() => toggleFavorite(rental.id)}
                        isFavorite={isFavorite(rental.id)}
                        isHighlighted={hoveredProperty === rental.id || selectedProperty === rental.id}
                      />
                    </Box>
                  ))}
                </Grid>
              ) : (
                <EmptyState onReset={resetFilters} />
              )}
            </Box>

            {/* Right: Map */}
            <Box
              w="40%"
              position="sticky"
              top="120px"
              h="calc(100vh - 120px)"
              borderLeft="1px"
              borderColor="gray.200"
            >
              <MapView
                properties={sortedRentals}
                selectedProperty={selectedProperty}
                hoveredProperty={hoveredProperty}
                onPropertySelect={setSelectedProperty}
                onPropertyHover={setHoveredProperty}
                onPropertyClick={(property) => navigate(`/listing/${property.id}`)}
                height="100%"
              />
            </Box>
          </Flex>
        ) : (
          // Grid View Only (Mobile and Desktop Grid Mode)
          <Box p={4}>
            {sortedRentals.length > 0 ? (
              <>
                <Grid
                  templateColumns={{
                    base: '1fr',
                    sm: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)',
                  }}
                  gap={4}
                  mb={12}
                >
                  {sortedRentals.map((rental) => (
                    <PropertyGridCard
                      key={rental.id}
                      property={rental}
                      onClick={() => navigate(`/listing/${rental.id}`)}
                      onFavoriteToggle={() => toggleFavorite(rental.id)}
                      isFavorite={isFavorite(rental.id)}
                    />
                  ))}
                </Grid>

                {/* Recommendation Sections */}
                {userPreferences.hasCompletedWizard && (
                  <>
                    <Box mb={12}>
                      <BudgetMatches limit={6} />
                    </Box>
                    <Box mb={12}>
                      <PopularNearby limit={6} />
                    </Box>
                  </>
                )}
              </>
            ) : (
              <EmptyState onReset={resetFilters} />
            )}
          </Box>
        )}
      </Box>

      {/* Mobile Filter Drawer */}
      <Drawer isOpen={isOpen} onClose={onClose} size="md" placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <FilterSidebar
            filters={{ ...filters, resultsCount: sortedRentals.length }}
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
              onClose();
            }}
            onReset={() => {
              resetFilters();
              onClose();
            }}
          />
        </DrawerContent>
      </Drawer>

      {/* Floating Compare Button */}
      <CompareFloatingButton />
    </Flex>
  );
};

/**
 * Empty State Component
 * Displayed when no properties match the current filters
 * 
 * @param {Object} props
 * @param {Function} props.onReset - Callback to reset all filters
 */
const EmptyState = ({ onReset }) => (
  <Box
    bg="white"
    borderRadius="8px"
    p={12}
    textAlign="center"
  >
    <VStack spacing={4}>
      <Text fontSize="4xl">🏠</Text>
      <Text fontSize="xl" fontWeight="semibold" color="gray.900">
        No properties found
      </Text>
      <Text color="gray.600" fontSize="md">
        Try adjusting your filters to see more results
      </Text>
      <Button onClick={onReset} colorScheme="primary" size="md" borderRadius="8px">
        Reset All Filters
      </Button>
    </VStack>
  </Box>
);

export default FindRentalsPage;
