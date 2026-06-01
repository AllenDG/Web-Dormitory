import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Button,
  useToast,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiFileText,
  FiDownload,
  FiCheckCircle,
  FiArrowLeft,
} from 'react-icons/fi';
import { Card } from '../../shared/components';
import useBookingStore from '../../shared/stores/useBookingStore';
import useRentalStore from '../../shared/stores/useRentalStore';
import { ContractPreview } from './components';

/**
 * Contract Page Component
 * 
 * Displays rental contract for a booking
 * Allows viewing and downloading contract
 * 
 * @component
 */
const ContractPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { getBookingById } = useBookingStore();
  const { getRentalById } = useRentalStore();
  
  const booking = getBookingById(bookingId);
  const property = booking ? getRentalById(booking.propertyId) : null;
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    // Simulate PDF generation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: 'Contract Downloaded',
      description: 'Your rental contract has been downloaded successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    setIsDownloading(false);
  };

  const handleAgree = () => {
    setHasAgreed(true);
    toast({
      title: 'Contract Accepted',
      description: 'You have agreed to the terms and conditions.',
      status: 'success',
      duration: 3000,
      isClosable: true,
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
            <Button mt={4} onClick={() => navigate('/my-bookings')}>
              Back to Bookings
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
            <Icon as={FiFileText} boxSize={8} color="white" />
          </Box>
          <VStack spacing={2}>
            <Heading fontSize="3xl" fontWeight="bold" color="gray.900">
              Rental Contract
            </Heading>
            <Text fontSize="md" color="gray.600">
              Review and download your rental agreement
            </Text>
          </VStack>
        </VStack>

        {/* Alert */}
        <Alert status="info" borderRadius="8px" mb={6}>
          <AlertIcon />
          <AlertDescription fontSize="sm">
            Please review the contract carefully. You can download a PDF copy for your
            records.
          </AlertDescription>
        </Alert>

        {/* Contract Preview */}
        <Card p={0} borderRadius="8px" overflow="hidden" mb={6}>
          <ContractPreview booking={booking} property={property} />
        </Card>

        {/* Actions */}
        <Card p={6} borderRadius="8px">
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between" flexWrap="wrap" gap={4}>
              <Button
                leftIcon={<Icon as={FiArrowLeft} />}
                variant="outline"
                onClick={() => navigate('/my-bookings')}
                borderRadius="8px"
              >
                Back to Bookings
              </Button>

              <HStack spacing={3}>
                {!hasAgreed && (
                  <Button
                    leftIcon={<Icon as={FiCheckCircle} />}
                    colorScheme="green"
                    onClick={handleAgree}
                    borderRadius="8px"
                  >
                    I Agree to Terms
                  </Button>
                )}

                <Button
                  leftIcon={<Icon as={FiDownload} />}
                  colorScheme="primary"
                  onClick={handleDownload}
                  isLoading={isDownloading}
                  loadingText="Downloading..."
                  borderRadius="8px"
                >
                  Download PDF
                </Button>
              </HStack>
            </HStack>

            {hasAgreed && (
              <Alert status="success" borderRadius="8px">
                <AlertIcon />
                <AlertDescription fontSize="sm">
                  You have agreed to the terms and conditions of this rental contract.
                </AlertDescription>
              </Alert>
            )}

            <Box bg="blue.50" p={4} borderRadius="8px">
              <VStack align="start" spacing={2}>
                <HStack>
                  <Icon as={FiFileText} color="blue.600" />
                  <Text fontSize="sm" fontWeight="600" color="blue.900">
                    Important Information
                  </Text>
                </HStack>
                <VStack align="start" spacing={1} pl={6}>
                  <Text fontSize="xs" color="blue.900">
                    • Keep a copy of this contract for your records
                  </Text>
                  <Text fontSize="xs" color="blue.900">
                    • Both parties must sign the contract before move-in
                  </Text>
                  <Text fontSize="xs" color="blue.900">
                    • Contact the property owner for any clarifications
                  </Text>
                  <Text fontSize="xs" color="blue.900">
                    • Review the security deposit refund conditions carefully
                  </Text>
                </VStack>
              </VStack>
            </Box>
          </VStack>
        </Card>
      </Box>
    </Box>
  );
};

export default ContractPage;
