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
  AspectRatio,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMapPin, FiUsers, FiHeart, FiArrowLeft, FiCheck, FiMessageSquare, FiPlus } from 'react-icons/fi';
import {
  Card,
  Button,
  MapView,
  NearbyPlaces,
  CommuteCalculator,
  PageContainer,
} from '../../../shared/components';
import { SendInquiryModal } from '../components';
import { LoginPromptModal } from '../../auth';
import { SimilarProperties } from '../../recommendations';
import { ReviewsList, HouseRulesDisplay } from '../../reviews';
import { TYPOGRAPHY, LAYOUT } from '../../../shared/styles/layoutConstants';
import useRentalStore from '../../../shared/stores/useRentalStore';
import useChatStore from '../../../shared/stores/useChatStore';
import useRecommendationStore from '../../../shared/stores/useRecommendationStore';
import useHouseRulesStore from '../../../shared/stores/useHouseRulesStore';
import useCompareStore from '../../../shared/stores/useCompareStore';
import useGuestRestriction from '../../../shared/hooks/useGuestRestriction';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

/**
 * Rental Detail Page v5.0 - Reviews & House Rules
 * 
 * Features:
 * - Guest mode support
 * - Login prompts for restricted actions
 * - Chat with Owner
 * - Reviews and ratings
 * - House rules display
 * - Similar properties
 * - Improved layout
 * 
 * @component
 */
const RentalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const { getRentalById, toggleFavorite, isFavorite } = useRentalStore();
  const { createConversation, getConversationByProperty } = useChatStore();
  const { addToViewingHistory } = useRecommendationStore();
  const { getPropertyRules, initializeDefaultRules } = useHouseRulesStore();
  const { isInCompare, toggleCompare, isLimitReached, maxCompare } = useCompareStore();
  const rental = getRentalById(id);
  
  // Guest restrictions for different features
  const bookingRestriction = useGuestRestriction('book this property', `/booking/${id}`);
  const visitRestriction = useGuestRestriction('schedule a visit', `/schedule-visit/${id}`);
  const chatRestriction = useGuestRestriction('chat with owner');
  const favoriteRestriction = useGuestRestriction('save favorites');

  const [selectedImage, setSelectedImage] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Track property view
  useEffect(() => {
    if (rental) {
      addToViewingHistory(rental);
      
      // Initialize house rules if not set
      const rules = getPropertyRules(rental.id);
      if (!rules) {
        initializeDefaultRules(rental.id);
      }
    }
  }, [rental, addToViewingHistory, getPropertyRules, initializeDefaultRules]);

  // Handle chat with owner
  const handleChatWithOwner = async () => {
    if (!chatRestriction.checkAuth()) return;

    try {
      // Check if conversation already exists
      const existing = getConversationByProperty(rental.id, user.id);
      
      if (existing) {
        // Navigate to existing conversation
        navigate(`/chat?conversation=${existing.id}`);
      } else {
        // Create new conversation
        const conversation = await createConversation(
          rental.id,
          rental.title,
          rental.ownerId || 'owner_1',
          rental.ownerName || 'Property Owner',
          user.id,
          user.name
        );
        
        // Navigate to new conversation
        navigate(`/chat?conversation=${conversation.id}`);
      }
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };

  // Handle toggle compare
  const handleToggleCompare = () => {
    // If already in compare, remove it
    if (isInCompare(rental.id)) {
      toggleCompare(rental.id);
      toast({
        title: 'Removed from comparison',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    // If limit reached, show error
    if (isLimitReached) {
      toast({
        title: 'Comparison limit reached',
        description: `You can compare up to ${maxCompare} properties at a time`,
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Add to compare
    const added = toggleCompare(rental.id);
    if (added) {
      toast({
        title: 'Added to comparison',
        description: 'View comparison at the bottom of the page',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (!rental) {
    return (
      <Box py={LAYOUT.sectionSpacing}>
        <PageContainer>
          <Card padding={12} textAlign="center">
            <VStack spacing={4}>
              <Heading fontSize={TYPOGRAPHY.h2}>Property Not Found</Heading>
              <Text color="gray.600" fontSize={TYPOGRAPHY.body.regular}>
                The property you're looking for doesn't exist.
              </Text>
              <Button onClick={() => navigate('/find-rentals')} colorScheme="primary">
                Browse Properties
              </Button>
            </VStack>
          </Card>
        </PageContainer>
      </Box>
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
      <Box bg="gray.50" py={4}>
        <PageContainer>
          <Button
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            onClick={() => navigate(-1)}
            fontSize={TYPOGRAPHY.body.regular}
          >
            Back
          </Button>
        </PageContainer>
      </Box>

      {/* Main Content */}
      <Box py={LAYOUT.sectionSpacing}>
        <PageContainer>
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
              <Card padding={6}>
                <VStack spacing={4} align="stretch">
                  <Heading fontSize={TYPOGRAPHY.h3}>About This Property</Heading>
                  <Text color="gray.600" fontSize={TYPOGRAPHY.body.regular}>
                    {rental.description}
                  </Text>
                </VStack>
              </Card>

              {/* Amenities */}
              <Card padding={6}>
                <VStack spacing={4} align="stretch">
                  <Heading fontSize={TYPOGRAPHY.h3}>Amenities</Heading>
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                    {rental.amenities.map((amenity) => (
                      <HStack key={amenity}>
                        <Icon as={FiCheck} color="green.500" />
                        <Text fontSize={TYPOGRAPHY.body.small}>{amenity}</Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </VStack>
              </Card>

              {/* Location & Map */}
              <Card padding={6}>
                <VStack spacing={4} align="stretch">
                  <Heading fontSize={TYPOGRAPHY.h3}>Location & Nearby</Heading>
                  <HStack>
                    <Icon as={FiMapPin} color="primary.500" />
                    <Text fontSize={TYPOGRAPHY.body.small}>{rental.address}</Text>
                  </HStack>
                  <Text fontSize={TYPOGRAPHY.body.small} color="gray.600">
                    {rental.city}
                  </Text>

                  {/* Tabs for Map, Nearby Places, and Commute */}
                  <Tabs variant="enclosed" colorScheme="blue">
                    <TabList>
                      <Tab fontSize={TYPOGRAPHY.body.small}>Map</Tab>
                      <Tab fontSize={TYPOGRAPHY.body.small}>Nearby Places</Tab>
                      <Tab fontSize={TYPOGRAPHY.body.small}>Commute</Tab>
                    </TabList>

                    <TabPanels>
                      {/* Map Tab */}
                      <TabPanel px={0} py={4}>
                        <MapView
                          properties={[rental]}
                          selectedProperty={rental}
                          center={{
                            lat: 14.6760,
                            lng: 121.0437,
                          }}
                          zoom={15}
                          height="400px"
                        />
                      </TabPanel>

                      {/* Nearby Places Tab */}
                      <TabPanel px={0} py={4}>
                        <NearbyPlaces
                          location={rental.city}
                          radius={2}
                        />
                      </TabPanel>

                      {/* Commute Tab */}
                      <TabPanel px={0} py={4}>
                        <CommuteCalculator
                          propertyLocation={`${rental.address}, ${rental.city}`}
                        />
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </VStack>
              </Card>

              {/* House Rules */}
              <Card padding={6}>
                <VStack spacing={4} align="stretch">
                  <Heading fontSize={TYPOGRAPHY.h3}>House Rules</Heading>
                  <HouseRulesDisplay rules={getPropertyRules(rental.id)} compact />
                </VStack>
              </Card>

              {/* Reviews */}
              <Card padding={6}>
                <VStack spacing={4} align="stretch">
                  <Heading fontSize={TYPOGRAPHY.h3}>Reviews & Ratings</Heading>
                  <ReviewsList
                    propertyId={rental.id}
                    isOwner={false}
                    onWriteReview={() => {
                      // Navigate to review form or open modal
                      navigate(`/listing/${rental.id}/review`);
                    }}
                  />
                </VStack>
              </Card>
            </VStack>

            {/* Right Column - Booking Card */}
            <Box>
              <Card padding={6} position="sticky" top="80px">
                <VStack spacing={6} align="stretch">
                  {/* Header */}
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={1}>
                      <Heading fontSize={TYPOGRAPHY.h2}>{formatPrice(rental.price)}</Heading>
                      <Text fontSize={TYPOGRAPHY.body.small} color="gray.600">
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
                      onClick={() => {
                        if (favoriteRestriction.checkAuth()) {
                          toggleFavorite(rental.id);
                        }
                      }}
                      aria-label="Add to favorites"
                    />
                  </HStack>

                  <Divider />

                  {/* Property Info */}
                  <VStack spacing={3} align="stretch">
                    <Heading fontSize={TYPOGRAPHY.h4}>{rental.title}</Heading>
                    
                    <HStack>
                      <Icon as={FiMapPin} color="gray.500" />
                      <Text fontSize={TYPOGRAPHY.body.small} color="gray.600">
                        {rental.city}
                      </Text>
                    </HStack>

                    <HStack spacing={4}>
                      <HStack>
                        <Icon as={FiUsers} color="gray.500" />
                        <Text fontSize={TYPOGRAPHY.body.small} color="gray.600">
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
                      fontSize={TYPOGRAPHY.button}
                      onClick={() => {
                        if (bookingRestriction.checkAuth()) {
                          navigate(`/booking/${rental.id}`);
                        }
                      }}
                      borderRadius="8px"
                      _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                      transition="all 0.2s"
                    >
                      Book Now
                    </Button>
                    <Button
                      variant="outline"
                      colorScheme="primary"
                      size="lg"
                      w="full"
                      fontSize={TYPOGRAPHY.button}
                      onClick={() => {
                        if (visitRestriction.checkAuth()) {
                          navigate(`/schedule-visit/${rental.id}`);
                        }
                      }}
                      borderRadius="8px"
                    >
                      Schedule a Visit
                    </Button>
                    <Button
                      leftIcon={<Icon as={FiMessageSquare} />}
                      variant="outline"
                      size="lg"
                      w="full"
                      fontSize={TYPOGRAPHY.button}
                      onClick={handleChatWithOwner}
                      borderRadius="8px"
                    >
                      Chat with Owner
                    </Button>
                    <Button
                      leftIcon={<Icon as={isInCompare(rental.id) ? FiCheck : FiPlus} />}
                      variant="outline"
                      colorScheme={isInCompare(rental.id) ? 'green' : 'primary'}
                      size="lg"
                      w="full"
                      fontSize={TYPOGRAPHY.button}
                      onClick={handleToggleCompare}
                      borderRadius="8px"
                      isDisabled={!isInCompare(rental.id) && isLimitReached}
                    >
                      {isInCompare(rental.id) ? 'Added to Compare' : 'Add to Compare'}
                    </Button>
                  </VStack>

                  <Divider />

                  {/* Contact Info */}
                  <VStack spacing={2} align="stretch">
                    <Text fontSize={TYPOGRAPHY.body.small} fontWeight="medium">
                      Need help?
                    </Text>
                    <Text fontSize={TYPOGRAPHY.body.small} color="gray.600">
                      Contact us at support@dormy.ph or call +63 912 345 6789
                    </Text>
                  </VStack>
                </VStack>
              </Card>
            </Box>
          </SimpleGrid>

          {/* Similar Properties Section */}
          <Box mt={12}>
            <SimilarProperties referenceProperty={rental} limit={6} />
          </Box>
        </PageContainer>
      </Box>

      {/* Login Prompt Modals */}
      <LoginPromptModal {...bookingRestriction} />
      <LoginPromptModal {...visitRestriction} />
      <LoginPromptModal {...chatRestriction} />
      <LoginPromptModal {...favoriteRestriction} />
    </Box>
  );
};

export default RentalDetailPage;
