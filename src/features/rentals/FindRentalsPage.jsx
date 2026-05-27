import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Checkbox,
  CheckboxGroup,
  Stack,
  Image,
  Badge,
  Icon,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiUsers, FiHeart, FiSliders } from 'react-icons/fi';
import { Section, Card, Container, Button } from '../../shared/components';
import useRentalStore from '../../shared/stores/useRentalStore';
import amenitiesData from '../../data/amenities.json';
import bedTypesData from '../../data/bedTypes.json';

/**
 * Modern Find Rentals Page with Advanced Filters
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

  const [showFilters, setShowFilters] = useState(true);
  const filteredRentals = getFilteredRentals();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Initialize from URL params
  useEffect(() => {
    const query = searchParams.get('q');
    const city = searchParams.get('city');
    if (query) setFilters({ searchQuery: query });
    if (city) setFilters({ city });
  }, [searchParams, setFilters]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Box>
      {/* Header */}
      <Section bg={bgColor} py={8}>
        <VStack spacing={4}>
          <Heading as="h1" fontSize={{ base: '3xl', md: '4xl' }}>
            Find Your Perfect Place
          </Heading>
          <Text color="gray.600" _dark={{ color: 'gray.400' }}>
            {filteredRentals.length} properties available
          </Text>
        </VStack>
      </Section>

      {/* Main Content */}
      <Section>
        <SimpleGrid columns={{ base: 1, lg: showFilters ? '280px 1fr' : '1fr' }} spacing={8}>
          {/* Filters Sidebar */}
          {showFilters && (
            <Box>
              <Card padding={6} position="sticky" top="80px" bg={cardBg}>
                <VStack spacing={6} align="stretch">
                  <HStack justify="space-between">
                    <Heading size="md">Filters</Heading>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={resetFilters}
                    >
                      Reset
                    </Button>
                  </HStack>

                  {/* Search */}
                  <Box>
                    <Text fontWeight="medium" mb={2}>
                      Search
                    </Text>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiSearch color="gray.400" />
                      </InputLeftElement>
                      <Input
                        placeholder="Location, property..."
                        value={filters.searchQuery}
                        onChange={(e) =>
                          setFilters({ searchQuery: e.target.value })
                        }
                      />
                    </InputGroup>
                  </Box>

                  {/* Price Range */}
                  <Box>
                    <Text fontWeight="medium" mb={2}>
                      Price Range
                    </Text>
                    <Text fontSize="sm" color="gray.600" mb={3}>
                      {formatPrice(filters.priceRange[0])} -{' '}
                      {formatPrice(filters.priceRange[1])}
                    </Text>
                    <RangeSlider
                      min={0}
                      max={10000}
                      step={500}
                      value={filters.priceRange}
                      onChange={(val) => setFilters({ priceRange: val })}
                    >
                      <RangeSliderTrack>
                        <RangeSliderFilledTrack bg="primary.500" />
                      </RangeSliderTrack>
                      <RangeSliderThumb index={0} />
                      <RangeSliderThumb index={1} />
                    </RangeSlider>
                  </Box>

                  {/* Bed Type */}
                  <Box>
                    <Text fontWeight="medium" mb={2}>
                      Bed Type
                    </Text>
                    <Select
                      value={filters.bedType}
                      onChange={(e) => setFilters({ bedType: e.target.value })}
                    >
                      <option value="">All Types</option>
                      {bedTypesData.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Select>
                  </Box>

                  {/* Amenities */}
                  <Box>
                    <Text fontWeight="medium" mb={2}>
                      Amenities
                    </Text>
                    <CheckboxGroup
                      value={filters.amenities}
                      onChange={(val) => setFilters({ amenities: val })}
                    >
                      <Stack spacing={2}>
                        {amenitiesData.slice(0, 8).map((amenity) => (
                          <Checkbox key={amenity} value={amenity}>
                            <Text fontSize="sm">{amenity}</Text>
                          </Checkbox>
                        ))}
                      </Stack>
                    </CheckboxGroup>
                  </Box>
                </VStack>
              </Card>
            </Box>
          )}

          {/* Results */}
          <Box>
            {/* Toggle Filters Button (Mobile) */}
            <Button
              leftIcon={<FiSliders />}
              onClick={() => setShowFilters(!showFilters)}
              mb={4}
              display={{ base: 'flex', lg: 'none' }}
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>

            {/* Results Grid */}
            {filteredRentals.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
                {filteredRentals.map((rental) => (
                  <Card
                    key={rental.id}
                    hover
                    padding={0}
                    overflow="hidden"
                    cursor="pointer"
                    onClick={() => navigate(`/listing/${rental.id}`)}
                  >
                    {/* Image */}
                    <Box position="relative" overflow="hidden" h="200px">
                      <Image
                        src={rental.imageUrl[0]}
                        alt={rental.title}
                        w="full"
                        h="full"
                        objectFit="cover"
                        transition="transform 0.3s"
                        _hover={{ transform: 'scale(1.1)' }}
                      />
                      {/* Favorite Button */}
                      <IconButton
                        icon={<FiHeart />}
                        position="absolute"
                        top={3}
                        right={3}
                        size="sm"
                        borderRadius="full"
                        bg={
                          isFavorite(rental.id) ? 'red.500' : 'whiteAlpha.800'
                        }
                        color={isFavorite(rental.id) ? 'white' : 'gray.800'}
                        _hover={{
                          bg: isFavorite(rental.id) ? 'red.600' : 'white',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(rental.id);
                        }}
                        aria-label="Add to favorites"
                      />
                      {/* Price Badge */}
                      <Badge
                        position="absolute"
                        bottom={3}
                        left={3}
                        colorScheme="green"
                        fontSize="md"
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        {formatPrice(rental.price)}/mo
                      </Badge>
                    </Box>

                    {/* Content */}
                    <VStack align="start" spacing={3} p={5}>
                      <Heading as="h3" size="md" noOfLines={1}>
                        {rental.title}
                      </Heading>

                      <HStack
                        spacing={2}
                        color="gray.600"
                        _dark={{ color: 'gray.400' }}
                      >
                        <Icon as={FiMapPin} />
                        <Text fontSize="sm" noOfLines={1}>
                          {rental.city}
                        </Text>
                      </HStack>

                      <HStack spacing={4}>
                        <HStack spacing={1}>
                          <Icon as={FiUsers} color="gray.500" />
                          <Text
                            fontSize="sm"
                            color="gray.600"
                            _dark={{ color: 'gray.400' }}
                          >
                            {rental.availablePerson} persons
                          </Text>
                        </HStack>
                        <Badge colorScheme="blue">{rental.bedType}</Badge>
                      </HStack>

                      <Text
                        fontSize="sm"
                        color="gray.600"
                        _dark={{ color: 'gray.400' }}
                        noOfLines={2}
                      >
                        {rental.description}
                      </Text>
                    </VStack>
                  </Card>
                ))}
              </SimpleGrid>
            ) : (
              <Card padding={12} textAlign="center">
                <VStack spacing={4}>
                  <Heading size="md" color="gray.600">
                    No properties found
                  </Heading>
                  <Text color="gray.500">
                    Try adjusting your filters to see more results
                  </Text>
                  <Button onClick={resetFilters} colorScheme="primary">
                    Reset Filters
                  </Button>
                </VStack>
              </Card>
            )}
          </Box>
        </SimpleGrid>
      </Section>
    </Box>
  );
};

export default FindRentalsPage;
