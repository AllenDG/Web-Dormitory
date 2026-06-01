import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Divider,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

/**
 * Contract Preview Component
 * 
 * Displays rental contract preview with all terms and conditions
 * 
 * @component
 */
const ContractPreview = ({ booking, property }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const getDurationLabel = (durationType) => {
    switch (durationType) {
      case 'daily':
        return 'Daily';
      case '6months':
        return 'Six (6) Months';
      case '1year':
        return 'One (1) Year';
      default:
        return durationType;
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Box
      bg="white"
      p={8}
      borderRadius="8px"
      borderWidth="1px"
      borderColor="gray.200"
      maxW="800px"
      mx="auto"
    >
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <VStack spacing={2}>
          <Heading size="lg" textAlign="center" color="gray.900">
            RENTAL AGREEMENT
          </Heading>
          <Text fontSize="sm" color="gray.600" textAlign="center">
            Dormitory Platform - Philippines
          </Text>
          <Badge colorScheme="blue" fontSize="xs" px={3} py={1}>
            Contract ID: {booking.id}
          </Badge>
        </VStack>

        <Divider />

        {/* Date */}
        <Text fontSize="sm" color="gray.700">
          This Rental Agreement is made and entered into this <strong>{today}</strong>
        </Text>

        {/* Parties */}
        <Box>
          <Heading size="sm" mb={3} color="gray.900">
            BETWEEN:
          </Heading>
          
          <VStack spacing={3} align="stretch" pl={4}>
            <Box>
              <Text fontSize="sm" fontWeight="600" color="gray.900">
                LESSOR (Property Owner):
              </Text>
              <Text fontSize="sm" color="gray.700" pl={4}>
                {booking.ownerName || 'Property Owner'}
              </Text>
              <Text fontSize="sm" color="gray.600" pl={4}>
                Email: {booking.ownerEmail || 'owner@dormy.ph'}
              </Text>
            </Box>

            <Text fontSize="sm" fontWeight="600" color="gray.700">
              AND
            </Text>

            <Box>
              <Text fontSize="sm" fontWeight="600" color="gray.900">
                LESSEE (Tenant):
              </Text>
              <Text fontSize="sm" color="gray.700" pl={4}>
                {booking.guestName}
              </Text>
              <Text fontSize="sm" color="gray.600" pl={4}>
                Email: {booking.guestEmail}
              </Text>
              <Text fontSize="sm" color="gray.600" pl={4}>
                Phone: {booking.guestPhone}
              </Text>
            </Box>
          </VStack>
        </Box>

        <Divider />

        {/* Property Details */}
        <Box>
          <Heading size="sm" mb={3} color="gray.900">
            1. PROPERTY DESCRIPTION
          </Heading>
          <VStack spacing={2} align="stretch" pl={4}>
            <Text fontSize="sm" color="gray.700">
              <strong>Property:</strong> {booking.propertyTitle}
            </Text>
            <Text fontSize="sm" color="gray.700">
              <strong>Address:</strong> {booking.propertyAddress}
            </Text>
            <Text fontSize="sm" color="gray.700">
              <strong>Type:</strong> {property?.type || 'Dormitory'}
            </Text>
          </VStack>
        </Box>

        {/* Rental Period */}
        <Box>
          <Heading size="sm" mb={3} color="gray.900">
            2. RENTAL PERIOD
          </Heading>
          <VStack spacing={2} align="stretch" pl={4}>
            <Text fontSize="sm" color="gray.700">
              <strong>Duration:</strong> {getDurationLabel(booking.durationType)}
            </Text>
            <Text fontSize="sm" color="gray.700">
              <strong>Start Date:</strong> {formatDate(booking.checkIn)}
            </Text>
            <Text fontSize="sm" color="gray.700">
              <strong>End Date:</strong> {formatDate(booking.checkOut)}
            </Text>
            <Text fontSize="sm" color="gray.700">
              <strong>Total Days:</strong> {booking.priceBreakdown?.days || 0} days
            </Text>
          </VStack>
        </Box>

        {/* Rental Payment */}
        <Box>
          <Heading size="sm" mb={3} color="gray.900">
            3. RENTAL PAYMENT
          </Heading>
          <VStack spacing={2} align="stretch" pl={4}>
            <SimpleGrid columns={2} spacing={2}>
              <Text fontSize="sm" color="gray.700">
                Rental Amount:
              </Text>
              <Text fontSize="sm" color="gray.700" fontWeight="600">
                {formatPrice(booking.priceBreakdown?.subtotal || 0)}
              </Text>

              {booking.priceBreakdown?.discount > 0 && (
                <>
                  <Text fontSize="sm" color="green.600">
                    Discount:
                  </Text>
                  <Text fontSize="sm" color="green.600" fontWeight="600">
                    -{formatPrice(booking.priceBreakdown.discount)}
                  </Text>
                </>
              )}

              <Text fontSize="sm" color="gray.700">
                Service Fee:
              </Text>
              <Text fontSize="sm" color="gray.700" fontWeight="600">
                {formatPrice(booking.priceBreakdown?.serviceFee || 0)}
              </Text>

              <Text fontSize="sm" color="gray.900" fontWeight="600">
                Total Rent:
              </Text>
              <Text fontSize="sm" color="gray.900" fontWeight="600">
                {formatPrice(booking.totalAmount)}
              </Text>

              <Text fontSize="sm" color="blue.700" fontWeight="600">
                Security Deposit:
              </Text>
              <Text fontSize="sm" color="blue.700" fontWeight="600">
                {formatPrice(booking.depositAmount || 0)}
              </Text>

              <Divider gridColumn="1 / -1" />

              <Text fontSize="md" color="gray.900" fontWeight="700">
                TOTAL DUE:
              </Text>
              <Text fontSize="md" color="primary.600" fontWeight="700">
                {formatPrice(booking.totalWithDeposit || booking.totalAmount)}
              </Text>
            </SimpleGrid>
          </VStack>
        </Box>

        {/* Security Deposit */}
        <Box>
          <Heading size="sm" mb={3} color="gray.900">
            4. SECURITY DEPOSIT
          </Heading>
          <VStack spacing={2} align="stretch" pl={4}>
            <Text fontSize="sm" color="gray.700">
              The LESSEE shall pay a security deposit of{' '}
              <strong>{formatPrice(booking.depositAmount || 0)}</strong> to the LESSOR.
              This deposit shall be refundable upon termination of this agreement, subject
              to the following conditions:
            </Text>
            <VStack spacing={1} align="stretch" pl={4}>
              <Text fontSize="sm" color="gray.700">
                • No damage to the property
              </Text>
              <Text fontSize="sm" color="gray.700">
                • All keys and access cards returned
              </Text>
              <Text fontSize="sm" color="gray.700">
                • Property left in good condition
              </Text>
              <Text fontSize="sm" color="gray.700">
                • All utilities paid in full
              </Text>
              <Text fontSize="sm" color="gray.700">
                • Proper notice given as per agreement
              </Text>
            </VStack>
          </VStack>
        </Box>

        {/* Terms and Conditions */}
        <Box>
          <Heading size="sm" mb={3} color="gray.900">
            5. TERMS AND CONDITIONS
          </Heading>
          <VStack spacing={2} align="stretch" pl={4}>
            <Text fontSize="sm" color="gray.700" fontWeight="600">
              5.1 Use of Property
            </Text>
            <Text fontSize="sm" color="gray.700" pl={4}>
              The property shall be used solely for residential purposes. The LESSEE
              agrees to maintain the property in good condition and comply with all
              building rules and regulations.
            </Text>

            <Text fontSize="sm" color="gray.700" fontWeight="600">
              5.2 Utilities
            </Text>
            <Text fontSize="sm" color="gray.700" pl={4}>
              The LESSEE shall be responsible for payment of utilities including but not
              limited to electricity, water, and internet (if applicable).
            </Text>

            <Text fontSize="sm" color="gray.700" fontWeight="600">
              5.3 Maintenance
            </Text>
            <Text fontSize="sm" color="gray.700" pl={4}>
              The LESSOR shall be responsible for major repairs. The LESSEE shall
              immediately notify the LESSOR of any needed repairs.
            </Text>

            <Text fontSize="sm" color="gray.700" fontWeight="600">
              5.4 Termination
            </Text>
            <Text fontSize="sm" color="gray.700" pl={4}>
              Either party may terminate this agreement with proper written notice as
              specified in the rental period terms.
            </Text>

            <Text fontSize="sm" color="gray.700" fontWeight="600">
              5.5 House Rules
            </Text>
            <Text fontSize="sm" color="gray.700" pl={4}>
              The LESSEE agrees to comply with all house rules and community policies
              established by the LESSOR.
            </Text>
          </VStack>
        </Box>

        {/* Special Requests */}
        {booking.specialRequests && (
          <Box>
            <Heading size="sm" mb={3} color="gray.900">
              6. SPECIAL PROVISIONS
            </Heading>
            <Text fontSize="sm" color="gray.700" pl={4}>
              {booking.specialRequests}
            </Text>
          </Box>
        )}

        {/* Signatures */}
        <Box>
          <Heading size="sm" mb={3} color="gray.900">
            SIGNATURES
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} pt={8}>
            <VStack spacing={2} align="start">
              <Box borderTop="2px" borderColor="gray.900" w="200px" pt={2}>
                <Text fontSize="sm" fontWeight="600" color="gray.900">
                  LESSOR
                </Text>
                <Text fontSize="xs" color="gray.600">
                  {booking.ownerName || 'Property Owner'}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  Date: _______________
                </Text>
              </Box>
            </VStack>

            <VStack spacing={2} align="start">
              <Box borderTop="2px" borderColor="gray.900" w="200px" pt={2}>
                <Text fontSize="sm" fontWeight="600" color="gray.900">
                  LESSEE
                </Text>
                <Text fontSize="xs" color="gray.600">
                  {booking.guestName}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  Date: _______________
                </Text>
              </Box>
            </VStack>
          </SimpleGrid>
        </Box>

        {/* Footer */}
        <Box bg="gray.50" p={4} borderRadius="8px" mt={4}>
          <Text fontSize="xs" color="gray.600" textAlign="center">
            This contract is generated through Dormitory Platform and is legally binding
            upon signing by both parties. For questions or concerns, please contact
            support@dormy.ph
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

ContractPreview.propTypes = {
  booking: PropTypes.object.isRequired,
  property: PropTypes.object,
};

export default ContractPreview;
