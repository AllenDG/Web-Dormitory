import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Grid,
  Image,
  Divider,
  Icon,
  useToast,
  Alert,
  AlertIcon,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FiCalendar,
  FiHome,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone,
  FiCreditCard,
  FiCheckCircle,
  FiInfo,
} from 'react-icons/fi';
import { Button, Card } from '../../../shared/components';
import useRentalStore from '../../../shared/stores/useRentalStore';
import useBookingStore, { DURATION_TYPE } from '../../../shared/stores/useBookingStore';
import { useAuth } from '../../../app/providers/AuthProvider';
import { DurationSelector, DepositInfo } from '../components';

// Validation schema
const bookingSchema = z.object({
  guestName: z.string().min(2, 'Name must be at least 2 characters'),
  guestEmail: z.string().email('Invalid email address'),
  guestPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  guests: z.number().min(1, 'At least 1 guest required').max(10, 'Maximum 10 guests'),
  specialRequests: z.string().optional(),
}).refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
  message: 'Check-out date must be after check-in date',
  path: ['checkOut'],
});

/**
 * Booking Page Component
 * 
 * Allows tenants to book a property with duration selection and guest information
 * 
 * Features:
 * - Duration selection (Daily, 6-month, 1-year)
 * - Date range selection
 * - Guest information form
 * - Price calculation with discounts
 * - Deposit information
 * - Availability checking
 * - Booking confirmation
 * 
 * @component
 */
const BookingPage = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const { isOpen: isDepositModalOpen, onOpen: onDepositModalOpen, onClose: onDepositModalClose } = useDisclosure();
  
  const { getRentalById } = useRentalStore();
  const { createBooking, calculatePrice, checkAvailability } = useBookingStore();
  
  const property = getRentalById(propertyId);
  const [durationType, setDurationType] = useState(DURATION_TYPE.DAILY);
  const [priceBreakdown, setPriceBreakdown] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guestName: user?.name || '',
      guestEmail: user?.email || '',
      guestPhone: user?.phone || '',
      guests: 1,
    },
  });

  const checkInDate = watch('checkIn');
  const checkOutDate = watch('checkOut');

  // Calculate price when dates or duration change
  useEffect(() => {
    if (checkInDate && checkOutDate && property) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      
      if (checkOut > checkIn) {
        const breakdown = calculatePrice(property, checkIn, checkOut, durationType);
        setPriceBreakdown(breakdown);

        // Check availability
        const available = checkAvailability(propertyId, checkIn, checkOut);
        setIsAvailable(available);
      }
    }
  }, [checkInDate, checkOutDate, durationType, property, propertyId, calculatePrice, checkAvailability]);

  const onSubmit = async (data) => {
    if (!isAvailable) {
      toast({
        title: 'Property Not Available',
        description: 'The selected dates are not available. Please choose different dates.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const bookingData = {
      propertyId: property.id,
      propertyTitle: property.title,
      propertyImage: property.imageUrl[0],
      propertyAddress: `${property.address}, ${property.city}`,
      ownerId: property.ownerId || 'owner-1',
      ownerName: property.ownerName,
      ownerEmail: property.ownerEmail,
      userId: user?.id || 'guest-user',
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests,
      specialRequests: data.specialRequests,
      durationType,
      priceBreakdown,
      totalAmount: priceBreakdown.total,
      depositAmount: priceBreakdown.depositAmount,
      totalWithDeposit: priceBreakdown.totalWithDeposit,
    };

    const booking = createBooking(bookingData);

    toast({
      title: 'Booking Created!',
      description: 'Proceeding to payment...',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    // Navigate to payment page
    navigate(`/booking/${booking.id}/payment`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get minimum checkout date (day after checkin)
  const getMinCheckoutDate = () => {
    if (!checkInDate) return getMinDate();
    const checkIn = new Date(checkInDate);
    checkIn.setDate(checkIn.getDate() + 1);
    return checkIn.toISOString().split('T')[0];
  };

  if (!property) {
    return (
      <Box minH="100vh" bg="gray.50" py={8}>
        <Box maxW="1200px" mx="auto" px={4}>
          <Card p={8} textAlign="center">
            <Text fontSize="xl" color="gray.600">
              Property not found
            </Text>
            <Button mt={4} onClick={() => navigate('/find-rentals')}>
              Back to Search
            </Button>
          </Card>
        </Box>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Box maxW="1200px" mx="auto" px={4}>
        {/* Header */}
        <VStack spacing={6} mb={8}>
          <Box bg="primary.600" p={4} borderRadius="8px" boxShadow="lg">
            <Icon as={FiCalendar} boxSize={8} color="white" />
          </Box>
          <VStack spacing={2}>
            <Heading fontSize="3xl" fontWeight="bold" color="gray.900">
              Book Your Stay
            </Heading>
            <Text fontSize="md" color="gray.600">
              Complete your booking details
            </Text>
          </VStack>
        </VStack>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
          {/* Main Form */}
          <Card p={8} borderRadius="8px">
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={6} align="stretch">
                {/* Duration Selection */}
                <Box>
                  <DurationSelector
                    value={durationType}
                    onChange={setDurationType}
                    property={property}
                  />
                </Box>

                <Divider />

                {/* Dates Section */}
                <Box>
                  <Heading fontSize="xl" fontWeight="semibold" color="gray.900" mb={4}>
                    Select Dates
                  </Heading>
                  
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                    <FormControl isInvalid={errors.checkIn}>
                      <FormLabel fontSize="sm" fontWeight="500">Check-in Date</FormLabel>
                      <Input
                        {...register('checkIn')}
                        type="date"
                        min={getMinDate()}
                        size="lg"
                        borderRadius="8px"
                      />
                      {errors.checkIn && (
                        <Text color="red.500" fontSize="xs" mt={1}>
                          {errors.checkIn.message}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={errors.checkOut}>
                      <FormLabel fontSize="sm" fontWeight="500">Check-out Date</FormLabel>
                      <Input
                        {...register('checkOut')}
                        type="date"
                        min={getMinCheckoutDate()}
                        size="lg"
                        borderRadius="8px"
                      />
                      {errors.checkOut && (
                        <Text color="red.500" fontSize="xs" mt={1}>
                          {errors.checkOut.message}
                        </Text>
                      )}
                    </FormControl>
                  </Grid>

                  {!isAvailable && checkInDate && checkOutDate && (
                    <Alert status="error" mt={4} borderRadius="8px">
                      <AlertIcon />
                      <AlertDescription fontSize="sm">
                        Property is not available for the selected dates. Please choose different dates.
                      </AlertDescription>
                    </Alert>
                  )}
                </Box>

                <Divider />

                {/* Guest Information */}
                <Box>
                  <Heading fontSize="xl" fontWeight="semibold" color="gray.900" mb={4}>
                    Guest Information
                  </Heading>

                  <VStack spacing={4}>
                    <FormControl isInvalid={errors.guestName}>
                      <FormLabel fontSize="sm" fontWeight="500">Full Name</FormLabel>
                      <Input
                        {...register('guestName')}
                        placeholder="Juan Dela Cruz"
                        size="lg"
                        borderRadius="8px"
                      />
                      {errors.guestName && (
                        <Text color="red.500" fontSize="xs" mt={1}>
                          {errors.guestName.message}
                        </Text>
                      )}
                    </FormControl>

                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} w="full">
                      <FormControl isInvalid={errors.guestEmail}>
                        <FormLabel fontSize="sm" fontWeight="500">Email</FormLabel>
                        <Input
                          {...register('guestEmail')}
                          type="email"
                          placeholder="your@email.com"
                          size="lg"
                          borderRadius="8px"
                        />
                        {errors.guestEmail && (
                          <Text color="red.500" fontSize="xs" mt={1}>
                            {errors.guestEmail.message}
                          </Text>
                        )}
                      </FormControl>

                      <FormControl isInvalid={errors.guestPhone}>
                        <FormLabel fontSize="sm" fontWeight="500">Phone</FormLabel>
                        <Input
                          {...register('guestPhone')}
                          type="tel"
                          placeholder="+63 912 345 6789"
                          size="lg"
                          borderRadius="8px"
                        />
                        {errors.guestPhone && (
                          <Text color="red.500" fontSize="xs" mt={1}>
                            {errors.guestPhone.message}
                          </Text>
                        )}
                      </FormControl>
                    </Grid>

                    <FormControl isInvalid={errors.guests}>
                      <FormLabel fontSize="sm" fontWeight="500">Number of Guests</FormLabel>
                      <Input
                        {...register('guests', { valueAsNumber: true })}
                        type="number"
                        min={1}
                        max={10}
                        size="lg"
                        borderRadius="8px"
                      />
                      {errors.guests && (
                        <Text color="red.500" fontSize="xs" mt={1}>
                          {errors.guests.message}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="500">Special Requests (Optional)</FormLabel>
                      <Textarea
                        {...register('specialRequests')}
                        placeholder="Any special requests or requirements..."
                        rows={4}
                        borderRadius="8px"
                      />
                    </FormControl>
                  </VStack>
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  colorScheme="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  loadingText="Processing..."
                  borderRadius="8px"
                  leftIcon={<Icon as={FiCreditCard} />}
                  isDisabled={!isAvailable || !priceBreakdown}
                  w="full"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  Proceed to Payment
                </Button>
              </VStack>
            </form>
          </Card>

          {/* Booking Summary Sidebar */}
          <VStack spacing={6} align="stretch">
            {/* Property Info */}
            <Card p={6} borderRadius="8px">
              <VStack spacing={4} align="stretch">
                <Heading fontSize="lg" fontWeight="semibold">
                  Property Details
                </Heading>

                <Image
                  src={property.imageUrl[0]}
                  alt={property.title}
                  borderRadius="8px"
                  objectFit="cover"
                  h="150px"
                  w="full"
                />

                <VStack align="start" spacing={2}>
                  <HStack>
                    <Icon as={FiHome} color="primary.600" />
                    <Text fontSize="md" fontWeight="semibold">
                      {property.title}
                    </Text>
                  </HStack>

                  <HStack>
                    <Icon as={FiMapPin} color="gray.500" boxSize={4} />
                    <Text fontSize="sm" color="gray.600">
                      {property.address}, {property.city}
                    </Text>
                  </HStack>

                  <Text fontSize="lg" fontWeight="bold" color="primary.600">
                    {formatPrice(property.price)}/month
                  </Text>
                </VStack>
              </VStack>
            </Card>

            {/* Price Breakdown */}
            {priceBreakdown && (
              <Card p={6} borderRadius="8px">
                <VStack spacing={4} align="stretch">
                  <Heading fontSize="lg" fontWeight="semibold">
                    Price Breakdown
                  </Heading>

                  <VStack spacing={3} align="stretch">
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        {formatPrice(priceBreakdown.pricePerUnit)} × {priceBreakdown.days} days
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {formatPrice(priceBreakdown.subtotal)}
                      </Text>
                    </HStack>

                    {priceBreakdown.discount > 0 && (
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="green.600" fontWeight="500">
                          Discount
                        </Text>
                        <Text fontSize="sm" fontWeight="medium" color="green.600">
                          -{formatPrice(priceBreakdown.discount)}
                        </Text>
                      </HStack>
                    )}

                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        Service Fee ({priceBreakdown.serviceFeeRate})
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {formatPrice(priceBreakdown.serviceFee)}
                      </Text>
                    </HStack>

                    <Divider />

                    <HStack justify="space-between">
                      <Text fontSize="md" fontWeight="600">
                        Subtotal
                      </Text>
                      <Text fontSize="md" fontWeight="600">
                        {formatPrice(priceBreakdown.total)}
                      </Text>
                    </HStack>

                    <HStack justify="space-between" bg="blue.50" p={3} borderRadius="8px">
                      <HStack>
                        <Icon as={FiInfo} color="blue.600" boxSize={4} />
                        <Text fontSize="sm" fontWeight="600" color="blue.900">
                          Security Deposit
                        </Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight="600" color="blue.900">
                        {formatPrice(priceBreakdown.depositAmount)}
                      </Text>
                    </HStack>

                    <Divider />

                    <HStack justify="space-between">
                      <Text fontSize="lg" fontWeight="bold">
                        Total Due
                      </Text>
                      <Text fontSize="lg" fontWeight="bold" color="primary.600">
                        {formatPrice(priceBreakdown.totalWithDeposit)}
                      </Text>
                    </HStack>

                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      {priceBreakdown.days} days stay • {priceBreakdown.durationType}
                    </Text>

                    <Button
                      size="sm"
                      variant="link"
                      colorScheme="primary"
                      onClick={onDepositModalOpen}
                      fontSize="xs"
                    >
                      Learn about security deposit
                    </Button>
                  </VStack>
                </VStack>
              </Card>
            )}

            {/* Info Box */}
            <Box bg="blue.50" p={4} borderRadius="8px" borderLeft="4px" borderColor="primary.600">
              <VStack align="start" spacing={2}>
                <HStack>
                  <Icon as={FiCheckCircle} color="primary.600" />
                  <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                    What's Next?
                  </Text>
                </HStack>
                <Text fontSize="xs" color="gray.700">
                  After booking, the property owner will review your request. You'll receive a confirmation email once approved.
                </Text>
              </VStack>
            </Box>
          </VStack>
        </Grid>

        {/* Deposit Information Modal */}
        <Modal isOpen={isDepositModalOpen} onClose={onDepositModalClose} size="lg">
          <ModalOverlay />
          <ModalContent borderRadius="8px">
            <ModalHeader>Security Deposit Information</ModalHeader>
            <ModalBody>
              {priceBreakdown && (
                <DepositInfo
                  depositAmount={priceBreakdown.depositAmount}
                  durationType={durationType}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={onDepositModalClose} borderRadius="8px">
                Got it
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default BookingPage;
