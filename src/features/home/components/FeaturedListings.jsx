import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  VStack,
  Image,
  Badge,
  Icon,
  IconButton,
  Button,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiMapPin, FiStar, FiHeart, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import useRentalStore from '../../../shared/stores/useRentalStore';

/**
 * Featured Listings v3.0
 * Horizontal scroll with large cards (Airbnb pattern)
 * Shows photo, title, location chip, price/month, rating stars, and View button
 */

const PropertyCard = ({ property, onToggleFavorite, isFavorite }) => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.800');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Box
      bg={cardBg}
      borderRadius="lg"
      overflow="hidden"
      border="1px"
      borderColor="gray.200"
      _dark={{ borderColor: 'gray.700' }}
      transition="all 0.3s"
      cursor="pointer"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
      }}
      minW={{ base: '280px', sm: '320px', md: '360px' }}
      maxW={{ base: '280px', sm: '320px', md: '360px' }}
      onClick={() => navigate(`/listing/${property.id}`)}
    >
      {/* Image */}
      <Box position="relative" h="240px">
        <Image
          src={property.imageUrl[0]}
          alt={property.title}
          w="full"
          h="full"
          objectFit="cover"
        />
        
        {/* Favorite Button */}
        <IconButton
          icon={<Icon as={FiHeart} fill={isFavorite ? 'currentColor' : 'none'} />}
          position="absolute"
          top={3}
          right={3}
          size="sm"
          borderRadius="full"
          bg={isFavorite ? 'error.500' : 'whiteAlpha.900'}
          color={isFavorite ? 'white' : 'gray.700'}
          _hover={{
            bg: isFavorite ? 'error.600' : 'white',
            transform: 'scale(1.1)',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id);
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
          borderRadius="md"
          fontWeight="semibold"
        >
          {formatPrice(property.price)}/mo
        </Badge>
      </Box>

      {/* Content */}
      <VStack align="start" spacing={2} p={4}>
        {/* Title */}
        <Heading
          fontSize="lg"
          fontWeight="semibold"
          noOfLines={1}
        >
          {property.title}
        </Heading>

        {/* Location */}
        <HStack spacing={2} color="gray.600" _dark={{ color: 'gray.400' }}>
          <Icon as={FiMapPin} boxSize={4} />
          <Text fontSize="sm" noOfLines={1}>
            {property.city}
          </Text>
        </HStack>

        {/* Rating */}
        <HStack spacing={1}>
          <Icon as={FiStar} color="warning.500" boxSize={4} />
          <Text fontSize="sm" fontWeight="semibold">
            4.8
          </Text>
          <Text fontSize="sm" color="gray.500">
            (24 reviews)
          </Text>
        </HStack>

        {/* Description */}
        <Text
          fontSize="sm"
          color="gray.600"
          _dark={{ color: 'gray.400' }}
          noOfLines={2}
        >
          {property.description}
        </Text>
      </VStack>
    </Box>
  );
};

const FeaturedListings = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const { rentals = [], toggleFavorite, isFavorite } = useRentalStore();
  const bgColor = useColorModeValue('white', 'gray.800');

  // Get first 6 properties as featured
  const featuredProperties = rentals.slice(0, 6);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 380;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box bg={bgColor} py={{ base: 8, md: 12 }}>
      <Container maxW="1400px">
        <VStack spacing={6} align="stretch">
          {/* Section Header */}
          <Flex justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Heading
                as="h2"
                fontSize={{ base: '2xl', md: '3xl' }}
                fontWeight="semibold"
              >
                Featured Properties
              </Heading>
              <Text
                fontSize="sm"
                color="gray.600"
                _dark={{ color: 'gray.400' }}
              >
                Handpicked homes perfect for students
              </Text>
            </VStack>
            <HStack spacing={2} display={{ base: 'none', md: 'flex' }}>
              <IconButton
                icon={<Icon as={FiArrowRight} transform="rotate(180deg)" />}
                variant="outline"
                borderRadius="full"
                onClick={() => scroll('left')}
                aria-label="Scroll left"
              />
              <IconButton
                icon={<Icon as={FiArrowRight} />}
                variant="outline"
                borderRadius="full"
                onClick={() => scroll('right')}
                aria-label="Scroll right"
              />
            </HStack>
          </Flex>

          {/* Horizontal Scroll Container */}
          <Box
            ref={scrollRef}
            overflowX="auto"
            css={{
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '8px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
              },
            }}
          >
            <HStack spacing={4} pb={4}>
              {featuredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={isFavorite(property.id)}
                />
              ))}
            </HStack>
          </Box>

          {/* View All Button */}
          <Flex justify="center" pt={2}>
            <Button
              rightIcon={<Icon as={FiArrowRight} />}
              size="md"
              variant="outline"
              onClick={() => navigate('/find-rentals')}
            >
              View All Properties
            </Button>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default FeaturedListings;
