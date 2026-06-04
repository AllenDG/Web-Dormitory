import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Alert,
  AlertIcon,
  AlertDescription,
  Code,
  Divider,
  Image,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  FiCopy,
  FiCheckCircle,
  FiUpload,
  FiAlertCircle,
} from 'react-icons/fi';
import PropTypes from 'prop-types';
import { PAYMENT_METHOD } from '../../../shared/stores/useBookingStore';

/**
 * Payment Instructions Component
 * 
 * Displays payment instructions based on selected method
 * Shows QR codes, account details, and upload proof
 * 
 * @component
 */
const PaymentInstructions = ({ paymentMethod, amount, onProofUpload }) => {
  const toast = useToast();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState('');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      if (onProofUpload) {
        onProofUpload(file, referenceNumber);
      }
    }
  };

  // GCash Instructions
  if (paymentMethod === PAYMENT_METHOD.GCASH) {
    return (
      <Box>
        <Alert status="info" borderRadius="8px" mb={4}>
          <AlertIcon />
          <AlertDescription fontSize="sm">
            Send <strong>{formatPrice(amount)}</strong> to the GCash number below
          </AlertDescription>
        </Alert>

        <VStack spacing={4} align="stretch">
          <Box bg="gray.50" p={4} borderRadius="8px">
            <VStack spacing={3}>
              <Text fontSize="sm" color="gray.600" fontWeight="500">
                GCash Number
              </Text>
              <HStack>
                <Code fontSize="xl" fontWeight="bold" p={3} borderRadius="8px">
                  0917 123 4567
                </Code>
                <Button
                  size="sm"
                  leftIcon={<Icon as={FiCopy} />}
                  onClick={() => copyToClipboard('09171234567', 'GCash number')}
                  borderRadius="8px"
                >
                  Copy
                </Button>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                Account Name: <strong>Dormitory Platform</strong>
              </Text>
            </VStack>
          </Box>

          <Box textAlign="center" p={4} bg="white" borderRadius="8px" borderWidth="1px">
            <Text fontSize="sm" color="gray.600" mb={3}>
              Or scan this QR code
            </Text>
            <Box
              w="200px"
              h="200px"
              bg="gray.100"
              mx="auto"
              borderRadius="8px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="sm" color="gray.500">
                [QR Code Here]
              </Text>
            </Box>
          </Box>

          <Divider />

          <VStack spacing={3} align="stretch">
            <Text fontSize="sm" fontWeight="600" color="gray.900">
              Upload Payment Proof
            </Text>
            
            <FormControl>
              <FormLabel fontSize="sm">Reference Number (Optional)</FormLabel>
              <Input
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="Enter GCash reference number"
                borderRadius="8px"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Screenshot</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                borderRadius="8px"
                p={1}
              />
            </FormControl>

            {uploadedFile && (
              <HStack p={3} bg="green.50" borderRadius="8px">
                <Icon as={FiCheckCircle} color="green.600" />
                <Text fontSize="sm" color="green.900">
                  {uploadedFile.name} uploaded
                </Text>
              </HStack>
            )}
          </VStack>
        </VStack>
      </Box>
    );
  }

  // PayMaya Instructions
  if (paymentMethod === PAYMENT_METHOD.PAYMAYA) {
    return (
      <Box>
        <Alert status="info" borderRadius="8px" mb={4}>
          <AlertIcon />
          <AlertDescription fontSize="sm">
            Send <strong>{formatPrice(amount)}</strong> to the PayMaya number below
          </AlertDescription>
        </Alert>

        <VStack spacing={4} align="stretch">
          <Box bg="gray.50" p={4} borderRadius="8px">
            <VStack spacing={3}>
              <Text fontSize="sm" color="gray.600" fontWeight="500">
                PayMaya Number
              </Text>
              <HStack>
                <Code fontSize="xl" fontWeight="bold" p={3} borderRadius="8px">
                  0918 765 4321
                </Code>
                <Button
                  size="sm"
                  leftIcon={<Icon as={FiCopy} />}
                  onClick={() => copyToClipboard('09187654321', 'PayMaya number')}
                  borderRadius="8px"
                >
                  Copy
                </Button>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                Account Name: <strong>Dormitory Platform</strong>
              </Text>
            </VStack>
          </Box>

          <Box textAlign="center" p={4} bg="white" borderRadius="8px" borderWidth="1px">
            <Text fontSize="sm" color="gray.600" mb={3}>
              Or scan this QR code
            </Text>
            <Box
              w="200px"
              h="200px"
              bg="gray.100"
              mx="auto"
              borderRadius="8px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="sm" color="gray.500">
                [QR Code Here]
              </Text>
            </Box>
          </Box>

          <Divider />

          <VStack spacing={3} align="stretch">
            <Text fontSize="sm" fontWeight="600" color="gray.900">
              Upload Payment Proof
            </Text>
            
            <FormControl>
              <FormLabel fontSize="sm">Reference Number (Optional)</FormLabel>
              <Input
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="Enter PayMaya reference number"
                borderRadius="8px"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Screenshot</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                borderRadius="8px"
                p={1}
              />
            </FormControl>

            {uploadedFile && (
              <HStack p={3} bg="green.50" borderRadius="8px">
                <Icon as={FiCheckCircle} color="green.600" />
                <Text fontSize="sm" color="green.900">
                  {uploadedFile.name} uploaded
                </Text>
              </HStack>
            )}
          </VStack>
        </VStack>
      </Box>
    );
  }

  // Bank Transfer Instructions
  if (paymentMethod === PAYMENT_METHOD.BANK_TRANSFER) {
    return (
      <Box>
        <Alert status="info" borderRadius="8px" mb={4}>
          <AlertIcon />
          <AlertDescription fontSize="sm">
            Transfer <strong>{formatPrice(amount)}</strong> to the bank account below
          </AlertDescription>
        </Alert>

        <VStack spacing={4} align="stretch">
          <Box bg="gray.50" p={4} borderRadius="8px">
            <VStack spacing={3} align="start">
              <HStack justify="space-between" w="full">
                <Text fontSize="sm" color="gray.600">
                  Bank Name:
                </Text>
                <Text fontSize="sm" fontWeight="600">
                  BDO Unibank
                </Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text fontSize="sm" color="gray.600">
                  Account Number:
                </Text>
                <HStack>
                  <Code fontSize="sm" fontWeight="600">
                    1234-5678-9012
                  </Code>
                  <Button
                    size="xs"
                    leftIcon={<Icon as={FiCopy} boxSize={3} />}
                    onClick={() => copyToClipboard('123456789012', 'Account number')}
                    borderRadius="8px"
                  >
                    Copy
                  </Button>
                </HStack>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text fontSize="sm" color="gray.600">
                  Account Name:
                </Text>
                <Text fontSize="sm" fontWeight="600">
                  Dormitory Platform Inc.
                </Text>
              </HStack>
            </VStack>
          </Box>

          <Alert status="warning" borderRadius="8px">
            <AlertIcon />
            <AlertDescription fontSize="xs">
              Bank transfers may take 1-2 business days to process
            </AlertDescription>
          </Alert>

          <Divider />

          <VStack spacing={3} align="stretch">
            <Text fontSize="sm" fontWeight="600" color="gray.900">
              Upload Payment Proof
            </Text>
            
            <FormControl>
              <FormLabel fontSize="sm">Reference Number</FormLabel>
              <Input
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="Enter bank reference number"
                borderRadius="8px"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Bank Receipt</FormLabel>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                borderRadius="8px"
                p={1}
              />
            </FormControl>

            {uploadedFile && (
              <HStack p={3} bg="green.50" borderRadius="8px">
                <Icon as={FiCheckCircle} color="green.600" />
                <Text fontSize="sm" color="green.900">
                  {uploadedFile.name} uploaded
                </Text>
              </HStack>
            )}
          </VStack>
        </VStack>
      </Box>
    );
  }

  // Credit Card Instructions
  if (paymentMethod === PAYMENT_METHOD.CREDIT_CARD) {
    return (
      <Box>
        <Alert status="info" borderRadius="8px" mb={4}>
          <AlertIcon />
          <AlertDescription fontSize="sm">
            Credit/Debit card payment integration coming soon
          </AlertDescription>
        </Alert>

        <Box bg="gray.50" p={8} borderRadius="8px" textAlign="center">
          <Icon as={FiAlertCircle} boxSize={12} color="gray.400" mb={4} />
          <Text fontSize="sm" color="gray.600">
            Online card payment will be available soon. Please use other payment methods for now.
          </Text>
        </Box>
      </Box>
    );
  }

  // Cash Payment Instructions
  if (paymentMethod === PAYMENT_METHOD.CASH) {
    return (
      <Box>
        <Alert status="info" borderRadius="8px" mb={4}>
          <AlertIcon />
          <AlertDescription fontSize="sm">
            Pay <strong>{formatPrice(amount)}</strong> in cash upon move-in
          </AlertDescription>
        </Alert>

        <VStack spacing={4} align="stretch">
          <Box bg="blue.50" p={4} borderRadius="8px">
            <VStack align="start" spacing={2}>
              <HStack>
                <Icon as={FiCheckCircle} color="blue.600" />
                <Text fontSize="sm" fontWeight="600" color="blue.900">
                  How it works
                </Text>
              </HStack>
              <VStack align="start" spacing={1} pl={6}>
                <Text fontSize="sm" color="blue.900">
                  1. Your booking will be marked as "Pending Payment"
                </Text>
                <Text fontSize="sm" color="blue.900">
                  2. Coordinate with the property owner for move-in
                </Text>
                <Text fontSize="sm" color="blue.900">
                  3. Pay in cash when you arrive at the property
                </Text>
                <Text fontSize="sm" color="blue.900">
                  4. Owner will confirm payment and complete booking
                </Text>
              </VStack>
            </VStack>
          </Box>

          <Alert status="warning" borderRadius="8px">
            <AlertIcon />
            <AlertDescription fontSize="xs">
              Make sure to get a receipt from the property owner upon payment
            </AlertDescription>
          </Alert>
        </VStack>
      </Box>
    );
  }

  return null;
};

PaymentInstructions.propTypes = {
  paymentMethod: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  onProofUpload: PropTypes.func,
};

export default PaymentInstructions;
