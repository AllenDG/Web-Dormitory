import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Button,
  Icon,
  useColorModeValue,
  Badge,
  Tooltip,
} from '@chakra-ui/react';
import { FiSearch, FiZap } from 'react-icons/fi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchParserService } from '../../../services/ai';

/**
 * Hero Section v3.2
 * Clean, simple search bar with AI-powered natural language parsing
 * Quick filter chips below for common searches
 * Better UX - not overwhelming, easy to use
 */
const HeroSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [showAIBadge, setShowAIBadge] = useState(false);

  const bgGradient = useColorModeValue(
    'linear(to-br, primary.50, white)',
    'linear(to-br, gray.900, gray.800)'
  );

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      navigate('/find-rentals');
      return;
    }

    // Check if query looks like natural language (has multiple words or numbers)
    const isNaturalLanguage = searchQuery.split(' ').length > 1 || /\d/.test(searchQuery);

    if (isNaturalLanguage && searchParserService.isAvailable()) {
      setIsParsing(true);
      setShowAIBadge(true);

      try {
        // Parse natural language query into structured filters
        const filters = await searchParserService.parseQuery(searchQuery);
        
        // Build query string from filters
        const params = new URLSearchParams();
        
        if (filters.location) params.append('location', filters.location);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.propertyType) params.append('propertyType', filters.propertyType);
        if (filters.bedType) params.append('bedType', filters.bedType);
        if (filters.availablePerson) params.append('persons', filters.availablePerson);
        if (filters.amenities && filters.amenities.length > 0) {
          filters.amenities.forEach(amenity => params.append('amenity', amenity));
        }

        // Add original query for reference
        params.append('q', searchQuery);
        
        navigate(`/find-rentals?${params.toString()}`);
      } catch (error) {
        console.error('Search parsing error:', error);
        // Fallback to simple search
        navigate(`/find-rentals?search=${encodeURIComponent(searchQuery)}`);
      } finally {
        setIsParsing(false);
        setTimeout(() => setShowAIBadge(false), 3000);
      }
    } else {
      // Simple location search
      navigate(`/find-rentals?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleQuickFilter = (filter) => {
    navigate(`/find-rentals?amenity=${filter}`);
  };

  return (
    <Box
      bgGradient={bgGradient}
      pt={{ base: 16, md: 24 }}
      pb={{ base: 12, md: 16 }}
      position="relative"
      overflow="hidden"
    >
      {/* Background Pattern */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.05"
        bgImage="radial-gradient(circle, currentColor 1px, transparent 1px)"
        bgSize="24px 24px"
        pointerEvents="none"
      />

      <Container maxW="1200px" position="relative">
        <VStack spacing={6} align="center" textAlign="center">
          {/* Headline */}
          <VStack spacing={3} maxW="800px">
            <Heading
              as="h1"
              fontSize={{ base: '3xl', md: '4xl' }}
              fontWeight="semibold"
              color="gray.900"
              _dark={{ color: 'white' }}
              lineHeight="1.2"
            >
              Find Your Perfect Student Home
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color="gray.600"
              _dark={{ color: 'gray.400' }}
              maxW="600px"
            >
              Verified dormitories near your school
            </Text>
          </VStack>

          {/* AI-Powered Search Bar */}
          <Box w="full" maxW="700px">
            <Box position="relative">
              <HStack
                bg="white"
                _dark={{ bg: 'gray.800' }}
                borderRadius="lg"
                boxShadow="lg"
                p={2}
                spacing={2}
              >
                {/* Main Search Input */}
                <HStack flex="1" px={4} spacing={3}>
                  <Icon as={FiSearch} color="gray.400" boxSize={5} />
                  <Input
                    placeholder='Try "2 bedroom near university under 10k"...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="unstyled"
                    fontSize="md"
                    _placeholder={{ color: 'gray.400' }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </HStack>

                {/* Search Button */}
                <Button
                  colorScheme="primary"
                  size="md"
                  px={6}
                  onClick={handleSearch}
                  flexShrink={0}
                  isLoading={isParsing}
                  loadingText="Parsing..."
                >
                  Search
                </Button>
              </HStack>

              {/* AI Badge */}
              {showAIBadge && (
                <Tooltip label="AI-powered smart search" placement="top">
                  <Badge
                    position="absolute"
                    top="-10px"
                    right="120px"
                    colorScheme="purple"
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Icon as={FiZap} boxSize={3} />
                    AI Parsed
                  </Badge>
                </Tooltip>
              )}
            </Box>

            {/* Quick Filters Below */}
            <HStack spacing={2} mt={4} justify="center" flexWrap="wrap">
              <Text fontSize="sm" color="gray.600" fontWeight="medium">
                Popular:
              </Text>
              {[
                { label: 'Near Schools', icon: '🎓' },
                { label: 'WiFi', icon: '📶' },
                { label: 'Budget-Friendly', icon: '💰' },
                { label: 'Pet-Friendly', icon: '🐕' },
              ].map((filter) => (
                <Button
                  key={filter.label}
                  size="sm"
                  variant="ghost"
                  fontSize="sm"
                  fontWeight="normal"
                  color="gray.700"
                  onClick={() => handleQuickFilter(filter.label)}
                  _hover={{
                    bg: 'primary.50',
                    color: 'primary.600',
                  }}
                >
                  <span style={{ marginRight: '6px' }}>{filter.icon}</span>
                  {filter.label}
                </Button>
              ))}
            </HStack>

            {/* AI Search Examples */}
            <Text fontSize="xs" color="gray.500" mt={3}>
              💡 Try: "Studio in Quezon City under 8k" or "2 bedroom condo with parking"
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};;

export default HeroSection;
