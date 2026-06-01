import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  Image,
  Divider,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiCreditCard,
  FiCheckCircle,
  FiHome,
  FiMapPin,
  FiCalendar,
} from 'react-icons/fi';
import { Button, Card } from '../../shared/components';
import useBookingStore, { PAYMENT_METHOD } from '../../shared/stores/useBookingStore';
import { PaymentMethodSelector, PaymentInstructions } from './components';

/**
 * Payment Page Component
 * 
 * Handles payment processing for bookings with multiple payment methods
 * 
 * Features:
 * - Multiple payment methods (GCash, PayMaya, Bank Transfer, Card, Cash)
 * - Payment instructions per method
 * - QR code display
 * - Payment proof upload
 * - Secure payment processing
 * 
 * @component
 */
const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { getBookingById, processPayment } = useBookingStore();
  const booking = getBookingById(bookingId);
  
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD.GCASH);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentProof, setPaymentProof] = useState(null);

  const handleProofUpload = (file, referenceNumber) => {
    setPaymentProof({ file, referenceNumber });
  };

  const handleSubmitPayment = async () => {
    // Validate payment proof for digital wallets and bank transfer
    if (
      (paymentMethod === PAYMENT_METHOD.GCASH ||
        paymentMethod === PAYMENT_METHOD.PAYMAYA ||
        paymentMethod === PAYMENT_METHOD.BANK_TRANSFER) &&
      !paymentProof
    ) {
      toast({
        title: 'Payment Proof Required',
        description: 'Please upload your payment proof before proceeding',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsProcessing(true);

    try {
      const paymentData = {
        paymentMethod,
        amount: booking.totalWithDeposit || booking.totalAmount,
        currency: 'PHP',
        paymentProof: paymentProof?.file?.name,
        referenceNumber: paymentProof?.referenceNumber,
      };

      const result = await processPayment(bookingId, paymentData);

      if (result.success) {
        toast({
          title: 'Payment Submitted!',
          description: 'Your payment is being verified. You will receive confirmation soon.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        // Navigate to confirmation page
        navigate(`/booking/${bookingId}/confirmation`);
      }
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description: error.message || 'An error occurred during payment processing.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
      <Box maxW="1200px" mx="auto" px={4}>
        {/* Header */}
        <VStack spacing={6} mb={8}>
          <Box bg="primary.600" p={4} borderRadius="8px" boxShadow="lg">
            <Icon as={FiCreditCard} boxSize={8} color="white" />
          </Box>
          <VStack spacing={2}>
            <Heading fontSize="3xl" fontWeight="bold" color="gray.900">
              Complete Payment
            </Heading>
            <Text fontSize="md" color="gray.600">
              Secure payment processing
            </Text>
          </VStack>
        </VStack>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
          {/* Payment Form */}
          <Card p={8} borderRadius="8px">
            <VStack spacing={6} align="stretch">
              {/* Payment Method Selection */}
              <PaymentMethodSelector
                value={paymentMethod}
                onChange={setPaymentMethod}
              />

              <Divider />

              {/* Payment Instructions */}
              <PaymentInstructions
                paymentMethod={paymentMethod}
                amount={booking.totalWithDeposit || booking.totalAmount}
                onProofUpload={handleProofUpload}
              />

              <Divider />

              {/* Submit Button */}
              <Button
                colorScheme="primary"
                size="lg"
                isLoading={isProcessing}
                loadingText="Processing Payment..."
                borderRadius="8px"
                leftIcon={<Icon as={FiCheckCircle} />}
                w="full"
                onClick={handleSubmitPayment}
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.2s"
              >
                {paymentMethod === PAYMENT_METHOD.CASH
                  ? 'Confirm Booking'
                  : `Submit Payment ${formatPrice(booking.totalWithDeposit || booking.totalAmount)}`}
              </Button>
            </VStack>
          </Card>

          {/* Booking Summary */}
          <VStack spacing={6} align="stretch">
            {/* Property Info */}
            <Card p={6} borderRadius="8px">
              <VStack spacing={4} align="stretch">
                <Heading fontSize="lg" fontWeight="semibold">
                  Booking Summary
                </Heading>

                <Image
                  src={booking.propertyImage}
                  alt={booking.propertyTitle}
                  borderRadius="8px"
                  objectFit="cover"
                  h="150px"
                  w="full"
                />

                <VStack align="start" spacing={2}>
                  <HStack>
                    <Icon as={FiHome} color="primary.600" />
                    <Text fontSize="md" fontWeight="semibold">
                      {booking.propertyTitle}
                    </Text>
                  </HStack>

                  <HStack>
                    <Icon as={FiMapPin} color="gray.500" boxSize={4} />
                    <Text fontSize="sm" color="gray.600">
                      {booking.propertyAddress}
                    </Text>
                  </HStack>

                  <Divider />

                  <HStack w="full" justify="space-between">
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color="gray.500">Check-in</Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {formatDate(booking.checkIn)}
                      </Text>
                    </VStack>
                    <Icon as={FiCalendar} color="gray.400" />
                    <VStack align="end" spacing={0}>
                      <Text fontSize="xs" color="gray.500">Check-out</Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {formatDate(booking.checkOut)}
                      </Text>
                    </VStack>
                  </HStack>

                  <Divider />

                  <HStack w="full" justify="space-between">
                    <Text fontSize="sm" color="gray.600">Guests</Text>
                    <Text fontSize="sm" fontWeight="medium">{booking.guests}</Text>
                  </HStack>
                </VStack>
              </VStack>
            </Card>

            {/* Price Breakdown */}
            <Card p={6} borderRadius="8px">
              <VStack spacing={4} align="stretch">
                <Heading fontSize="lg" fontWeight="semibold">
                  Price Details
                </Heading>

                <VStack spacing={3} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.600">
                      Subtotal
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {formatPrice(booking.priceBreakdown?.subtotalAfterDiscount || booking.priceBreakdown?.subtotal || 0)}
                    </Text>
                  </HStack>

                  {booking.priceBreakdown?.discount > 0 && (
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="green.600">
                        Discount
                      </Text>
                      <Text fontSize="sm" fontWeight="medium" color="green.600">
                        -{formatPrice(booking.priceBreakdown.discount)}
                      </Text>
                    </HStack>
                  )}

                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.600">
                      Service Fee
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {formatPrice(booking.priceBreakdown?.serviceFee || 0)}
                    </Text>
                  </HStack>

                  {booking.depositAmount && (
                    <>
                      <Divider />
                      <HStack justify="space-between" bg="blue.50" p={2} borderRadius="8px">
                        <Text fontSize="sm" color="blue.900" fontWeight="600">
                          Security Deposit
                        </Text>
                        <Text fontSize="sm" fontWeight="600" color="blue.900">
                          {formatPrice(booking.depositAmount)}
                        </Text>
                      </HStack>
                    </>
                  )}

                  <Divider />

                  <HStack justify="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Total Due
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="primary.600">
                      {formatPrice(booking.totalWithDeposit || booking.totalAmount)}
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </Card>
          </VStack>
        </Grid>
      </Box>
    </Box>
  );
};

export default PaymentPage;
