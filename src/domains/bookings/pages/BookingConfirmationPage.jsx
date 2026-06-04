import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Divider,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiCheckCircle,
  FiHome,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiMail,
  FiPhone,
  FiDownload,
  FiArrowRight,
} from 'react-icons/fi';
import { Button, Card } from '../../../shared/components';
import useBookingStore from '../../../shared/stores/useBookingStore';

/**
 * Booking Confirmation Page Component
 * 
 * Displays booking confirmation after successful payment
 * 
 * Features:
 * - Booking details summary
 * - Payment confirmation
 * - Download receipt option
 * - Next steps information
 * 
 * @component
 */
const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const { getBookingById } = useBookingStore();
  const booking = getBookingById(bookingId);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDownloadReceipt = () => {
    // Simulate download (in production, generate PDF)
    alert('Receipt download feature will be implemented with backend integration');
  };

  if (!booking) {
    return (
      <Box minH="100vh" bg="gray.50" py={8}>
        <Box maxW="1200px" mx="auto" px={4}>
          <Card p={8} textAlign="center">
            <Text fontSize="xl" color="gray.600">
              Booking not found
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
      <Box maxW="900px" mx="auto" px={4}>
        {/* Success Header */}
        <VStack spacing={6} mb={8}>
          <Box
            bg="green.500"
            p={6}
            borderRadius="full"
            boxShadow="xl"
            animation="scaleIn 0.5s ease-out"
          >
            <Icon as={FiCheckCircle} boxSize={16} color="white" />
          </Box>
          <VStack spacing={2}>
            <Heading fontSize="4xl" fontWeight="bold" color="gray.900">
              Booking Confirmed!
            </Heading>
            <Text fontSize="lg" color="gray.600" textAlign="center">
              Your booking has been successfully confirmed
            </Text>
            <Text fontSize="sm" color="gray.500">
              Booking ID: <Text as="span" fontWeight="semibold">{booking.id}</Text>
            </Text>
          </VStack>
        </VStack>

        {/* Main Content */}
        <VStack spacing={6} align="stretch">
          {/* Property & Booking Details */}
          <Card p={8} borderRadius="8px">
            <VStack spacing={6} align="stretch">
              <Heading fontSize="2xl" fontWeight="semibold">
                Booking Details
              </Heading>

              {/* Property Info */}
              <HStack spacing={4} align="start">
                <Image
                  src={booking.propertyImage}
                  alt={booking.propertyTitle}
                  borderRadius="8px"
                  objectFit="cover"
                  w="200px"
                  h="150px"
                />
                <VStack align="start" spacing={2} flex={1}>
                  <HStack>
                    <Icon as={FiHome} color="primary.600" boxSize={5} />
                    <Heading fontSize="xl" fontWeight="semibold">
                      {booking.propertyTitle}
                    </Heading>
                  </HStack>
                  <HStack>
                    <Icon as={FiMapPin} color="gray.500" boxSize={4} />
                    <Text fontSize="md" color="gray.600">
                      {booking.propertyAddress}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>

              <Divider />

              {/* Stay Details */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <VStack align="start" spacing={3}>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                    CHECK-IN
                  </Text>
                  <HStack>
                    <Icon as={FiCalendar} color="primary.600" />
                    <Text fontSize="md">{formatDate(booking.checkIn)}</Text>
                  </HStack>
                </VStack>

                <VStack align="start" spacing={3}>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                    CHECK-OUT
                  </Text>
                  <HStack>
                    <Icon as={FiCalendar} color="primary.600" />
                    <Text fontSize="md">{formatDate(booking.checkOut)}</Text>
                  </HStack>
                </VStack>

                <VStack align="start" spacing={3}>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                    GUESTS
                  </Text>
                  <HStack>
                    <Icon as={FiUser} color="primary.600" />
                    <Text fontSize="md">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</Text>
                  </HStack>
                </VStack>

                <VStack align="start" spacing={3}>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                    DURATION
                  </Text>
                  <Text fontSize="md">{booking.priceBreakdown.days} Days</Text>
                </VStack>
              </SimpleGrid>

              <Divider />

              {/* Guest Information */}
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>
                  Guest Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <HStack>
                    <Icon as={FiUser} color="gray.500" />
                    <Text fontSize="sm" color="gray.600">
                      {booking.guestName}
                    </Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiMail} color="gray.500" />
                    <Text fontSize="sm" color="gray.600">
                      {booking.guestEmail}
                    </Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiPhone} color="gray.500" />
                    <Text fontSize="sm" color="gray.600">
                      {booking.guestPhone}
                    </Text>
                  </HStack>
                </SimpleGrid>
              </Box>

              {booking.specialRequests && (
                <>
                  <Divider />
                  <Box>
                    <Text fontSize="lg" fontWeight="semibold" mb={2}>
                      Special Requests
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {booking.specialRequests}
                    </Text>
                  </Box>
                </>
              )}
            </VStack>
          </Card>

          {/* Payment Summary */}
          <Card p={8} borderRadius="8px">
            <VStack spacing={4} align="stretch">
              <Heading fontSize="2xl" fontWeight="semibold">
                Payment Summary
              </Heading>

              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="md" color="gray.600">
                    Subtotal
                  </Text>
                  <Text fontSize="md" fontWeight="medium">
                    {formatPrice(booking.priceBreakdown.subtotal)}
                  </Text>
                </HStack>

                <HStack justify="space-between">
                  <Text fontSize="md" color="gray.600">
                    Service Fee (5%)
                  </Text>
                  <Text fontSize="md" fontWeight="medium">
                    {formatPrice(booking.priceBreakdown.serviceFee)}
                  </Text>
                </HStack>

                <Divider />

                <HStack justify="space-between">
                  <Text fontSize="xl" fontWeight="bold">
                    Total Paid
                  </Text>
                  <Text fontSize="xl" fontWeight="bold" color="green.600">
                    {formatPrice(booking.totalAmount)}
                  </Text>
                </HStack>

                <Box bg="green.50" p={3} borderRadius="8px" textAlign="center">
                  <Text fontSize="sm" color="green.700" fontWeight="medium">
                    ✓ Payment Completed Successfully
                  </Text>
                </Box>
              </VStack>
            </VStack>
          </Card>

          {/* Next Steps */}
          <Card p={8} borderRadius="8px" bg="blue.50" borderLeft="4px" borderColor="primary.600">
            <VStack spacing={4} align="stretch">
              <Heading fontSize="xl" fontWeight="semibold" color="gray.900">
                What's Next?
              </Heading>
              <VStack spacing={3} align="start">
                <HStack>
                  <Icon as={FiCheckCircle} color="primary.600" />
                  <Text fontSize="sm" color="gray.700">
                    A confirmation email has been sent to {booking.guestEmail}
                  </Text>
                </HStack>
                <HStack>
                  <Icon as={FiCheckCircle} color="primary.600" />
                  <Text fontSize="sm" color="gray.700">
                    The property owner will contact you within 24 hours
                  </Text>
                </HStack>
                <HStack>
                  <Icon as={FiCheckCircle} color="primary.600" />
                  <Text fontSize="sm" color="gray.700">
                    You can view your booking details anytime in "My Bookings"
                  </Text>
                </HStack>
                <HStack>
                  <Icon as={FiCheckCircle} color="primary.600" />
                  <Text fontSize="sm" color="gray.700">
                    Download your receipt for your records
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </Card>

          {/* Action Buttons */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Button
              leftIcon={<Icon as={FiDownload} />}
              variant="outline"
              size="lg"
              borderRadius="8px"
              onClick={handleDownloadReceipt}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
              transition="all 0.2s"
            >
              Download Receipt
            </Button>
            <Button
              rightIcon={<Icon as={FiArrowRight} />}
              colorScheme="primary"
              size="lg"
              borderRadius="8px"
              onClick={() => navigate('/my-bookings')}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              View My Bookings
            </Button>
          </SimpleGrid>

          {/* Back to Home */}
          <Box textAlign="center" pt={4}>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              _hover={{ bg: 'gray.100' }}
            >
              Back to Home
            </Button>
          </Box>
        </VStack>
      </Box>

      <style>
        {`
          @keyframes scaleIn {
            from {
              transform: scale(0);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default BookingConfirmationPage;
