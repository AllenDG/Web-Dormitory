import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Image,
  Badge,
  Icon,
  IconButton,
  Divider,
  useColorModeValue,
  AspectRatio,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMapPin, FiUsers, FiHeart, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { Section, Card, Container, Button } from '../../shared/components';
import useRentalStore from '../../shared/stores/useRentalStore';
import { useState } from 'react';

/**
 * Modern Rental Detail Page
 */
const RentalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRentalById, toggleFavorite, isFavorite } = useRentalStore();
  const rental = getRentalById(id);
  const [selectedImage, setSelectedImage] = useState(0);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  if (!rental) {
    return (
      <Section>
        <Container>
          <Card padding={12} textAlign="center">
            <VStack spacing={4}>
              <Heading size="lg">Property Not Found</Heading>
              <Text color="gray.600">
                The property you're looking for doesn't exist.
              </Text>
              <Button onClick={() => navigate('/find-rentals')} colorScheme="primary">
                Browse Properties
              </Button>
            </VStack>
          </Card>
        </Container>
      </Section>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Box>
      {/* Back Button */}
      <Section py={4} bg={bgColor}>
        <Container>
          <Button
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Container>
      </Section>

      {/* Main Content */}
      <Section>
        <Container>
          <SimpleGrid columns={{ base: 1, lg: '2fr 1fr' }} spacing={8}>
            {/* Left Column - Images & Details */}
            <VStack spacing={6} align="stretch">
              {/* Main Image */}
              <Card padding={0} overflow="hidden">
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={rental.imageUrl[selectedImage]}
                    alt={rental.title}
                    objectFit="cover"
                  />
                </AspectRatio>
              </Card>

              {/* Thumbnail Images */}
              {rental.imageUrl.length > 1 && (
                <SimpleGrid columns={4} spacing={3}>
                  {rental.imageUrl.map((img, index) => (
                    <Card
                      key={index}
                      padding={0}
                      overflow="hidden"
                      cursor="pointer"
                      onClick={() => setSelectedImage(index)}
                      border="2px"
                      borderColor={
                        selectedImage === index ? 'primary.500' : 'transparent'
                      }
                    >
                      <AspectRatio ratio={4 / 3}>
                        <Image src={img} alt={`View ${index + 1}`} objectFit="cover" />
                      </AspectRatio>
                    </Card>
                  ))}
                </SimpleGrid>
              )}

              {/* Description */}
              <Card padding={6} bg={cardBg}>
                <VStack spacing={4} align="stretch">
                  <Heading size="md">About This Property</Heading>
                  <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                    {rental.description}
                  </Text>
                </VStack>
              </Card>

              {/* Amenities */}
              <Card padding={6} bg={cardBg}>
                <VStack spacing={4} align="stretch">
                  <Heading size="md">Amenities</Heading>
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                    {rental.amenities.map((amenity) => (
                      <HStack key={amenity}>
                        <Icon as={FiCheck} color="green.500" />
                        <Text fontSize="sm">{amenity}</Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </VStack>
              </Card>

              {/* Location */}
              <Card padding={6} bg={cardBg}>
                <VStack spacing={4} align="stretch">
                  <Heading size="md">Location</Heading>
                  <HStack>
                    <Icon as={FiMapPin} color="primary.500" />
                    <Text fontSize="sm">{rental.address}</Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                    {rental.city}
                  </Text>
                  {/* Map placeholder */}
                  <AspectRatio ratio={16 / 9}>
                    <Box
                      bg="gray.200"
                      _dark={{ bg: 'gray.700' }}
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text color="gray.500">Map View</Text>
                    </Box>
                  </AspectRatio>
                </VStack>
              </Card>
            </VStack>

            {/* Right Column - Booking Card */}
            <Box>
              <Card padding={6} position="sticky" top="80px" bg={cardBg}>
                <VStack spacing={6} align="stretch">
                  {/* Header */}
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={1}>
                      <Heading size="lg">{formatPrice(rental.price)}</Heading>
                      <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                        per month
                      </Text>
                    </VStack>
                    <IconButton
                      icon={<FiHeart />}
                      size="lg"
                      borderRadius="full"
                      bg={isFavorite(rental.id) ? 'red.500' : 'gray.100'}
                      color={isFavorite(rental.id) ? 'white' : 'gray.800'}
                      _hover={{
                        bg: isFavorite(rental.id) ? 'red.600' : 'gray.200',
                      }}
                      onClick={() => toggleFavorite(rental.id)}
                      aria-label="Add to favorites"
                    />
                  </HStack>

                  <Divider />

                  {/* Property Info */}
                  <VStack spacing={3} align="stretch">
                    <Heading size="sm">{rental.title}</Heading>
                    
                    <HStack>
                      <Icon as={FiMapPin} color="gray.500" />
                      <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                        {rental.city}
                      </Text>
                    </HStack>

                    <HStack spacing={4}>
                      <HStack>
                        <Icon as={FiUsers} color="gray.500" />
                        <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                          {rental.availablePerson} persons
                        </Text>
                      </HStack>
                      <Badge colorScheme="blue">{rental.bedType}</Badge>
                    </HStack>
                  </VStack>

                  <Divider />

                  {/* Action Buttons */}
                  <VStack spacing={3}>
                    <Button
                      colorScheme="primary"
                      size="lg"
                      w="full"
                      onClick={() => navigate(`/schedule-visit?property=${rental.id}`)}
                    >
                      Schedule a Visit
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      w="full"
                      onClick={() => navigate(`/inquire?property=${rental.id}`)}
                    >
                      Send Inquiry
                    </Button>
                  </VStack>

                  <Divider />

                  {/* Contact Info */}
                  <VStack spacing={2} align="stretch">
                    <Text fontSize="sm" fontWeight="medium">
                      Need help?
                    </Text>
                    <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                      Contact us at support@dormy.ph or call +63 912 345 6789
                    </Text>
                  </VStack>
                </VStack>
              </Card>
            </Box>
          </SimpleGrid>
        </Container>
      </Section>
    </Box>
  );
};

export default RentalDetailPage;
