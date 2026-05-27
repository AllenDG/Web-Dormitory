import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Image,
  HStack,
  VStack,
  Badge,
  Icon,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiMapPin, FiUsers, FiHeart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Section, Card, Button } from '../../../shared/components';
import useRentalStore from '../../../shared/stores/useRentalStore';

const MotionBox = motion(Box);

/**
 * Featured Listings Section
 */
const FeaturedListings = () => {
  const navigate = useNavigate();
  const { rentals, toggleFavorite, isFavorite } = useRentalStore();
  const bgColor = useColorModeValue('white', 'gray.800');

  // Get first 6 rentals as featured
  const featuredRentals = rentals.slice(0, 6);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Section>
      <VStack spacing={12}>
        {/* Section Header */}
        <VStack spacing={4} textAlign="center" maxW="3xl">
          <Heading
            as="h2"
            fontSize={{ base: '3xl', md: '4xl' }}
            fontWeight="bold"
          >
            Featured Properties
          </Heading>
          <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600" _dark={{ color: 'gray.400' }}>
            Handpicked properties that offer the best value and comfort for
            students.
          </Text>
        </VStack>

        {/* Listings Grid */}
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={{ base: 6, md: 8 }}
          w="full"
        >
          {featuredRentals.map((rental, index) => (
            <MotionBox
              key={rental.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                hover
                padding={0}
                overflow="hidden"
                cursor="pointer"
                onClick={() => navigate(`/listing/${rental.id}`)}
                position="relative"
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
                    bg={isFavorite(rental.id) ? 'red.500' : 'whiteAlpha.800'}
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

                  <HStack spacing={2} color="gray.600" _dark={{ color: 'gray.400' }}>
                    <Icon as={FiMapPin} />
                    <Text fontSize="sm" noOfLines={1}>
                      {rental.city}
                    </Text>
                  </HStack>

                  <HStack spacing={4}>
                    <HStack spacing={1}>
                      <Icon as={FiUsers} color="gray.500" />
                      <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                        {rental.availablePerson} persons
                      </Text>
                    </HStack>
                    <Badge colorScheme="blue">{rental.bedType}</Badge>
                  </HStack>

                  <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }} noOfLines={2}>
                    {rental.description}
                  </Text>
                </VStack>
              </Card>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* View All Button */}
        <Button
          size="lg"
          colorScheme="primary"
          onClick={() => navigate('/find-rentals')}
          px={8}
        >
          View All Properties
        </Button>
      </VStack>
    </Section>
  );
};

export default FeaturedListings;
