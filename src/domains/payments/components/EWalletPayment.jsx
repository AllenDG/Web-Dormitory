import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  FormControl,
  FormLabel,
  Button,
  Icon,
  Image,
  Alert,
  AlertIcon,
  Code,
  Divider,
} from '@chakra-ui/react';
import { FiSmartphone, FiCopy, FiCheck } from 'react-icons/fi';
import { useState } from 'react';

/**
 * E-Wallet Payment Component
 * GCash and PayMaya payment interface
 * Week 14 - Payments & Transactions
 */

const EWalletPayment = ({ method, amount, onDataChange }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [step, setStep] = useState(1); // 1: Enter number, 2: QR/Instructions
  const [copied, setCopied] = useState(false);

  const walletConfig = {
    gcash: {
      name: 'GCash',
      color: 'blue.500',
      logo: '💳',
      instructions: [
        'Open your GCash app',
        'Tap "Send Money" or "Pay QR"',
        'Scan the QR code or enter the merchant number',
        'Enter the exact amount shown',
        'Complete the payment',
        'Take a screenshot of the confirmation',
      ],
      merchantNumber: '09171234567',
      merchantName: 'Dormy Philippines',
    },
    paymaya: {
      name: 'PayMaya',
      color: 'green.500',
      logo: '💚',
      instructions: [
        'Open your PayMaya app',
        'Tap "Pay" or "Scan QR"',
        'Scan the QR code below',
        'Verify the amount and merchant',
        'Confirm the payment',
        'Save your receipt',
      ],
      merchantNumber: '09187654321',
      merchantName: 'Dormy Philippines',
    },
  };

  const config = walletConfig[method] || walletConfig.gcash;

  const handleMobileChange = (value) => {
    // Format mobile number: 09XXXXXXXXX
    let formatted = value.replace(/\D/g, '');
    if (!formatted.startsWith('09') && formatted.length > 0) {
      formatted = '09' + formatted;
    }
    formatted = formatted.substring(0, 11);
    setMobileNumber(formatted);
    
    if (onDataChange) {
      onDataChange({ mobileNumber: formatted });
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProceed = () => {
    if (mobileNumber.length === 11) {
      setStep(2);
    }
  };

  if (step === 1) {
    return (
      <Box>
        <VStack align="stretch" spacing={4}>
          {/* Header */}
          <HStack spacing={3}>
            <Box fontSize="3xl">{config.logo}</Box>
            <VStack align="start" spacing={0}>
              <Text fontWeight="semibold" fontSize="lg">
                Pay with {config.name}
              </Text>
              <Text fontSize="sm" color="gray.600">
                Enter your {config.name} mobile number
              </Text>
            </VStack>
          </HStack>

          {/* Amount Display */}
          <Box
            bg="gray.50"
            p={4}
            borderRadius="lg"
            textAlign="center"
          >
            <Text fontSize="sm" color="gray.600" mb={1}>
              Amount to Pay
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color={config.color}>
              ₱{amount?.toLocaleString()}
            </Text>
          </Box>

          {/* Mobile Number Input */}
          <FormControl isRequired>
            <FormLabel fontSize="sm">{config.name} Mobile Number</FormLabel>
            <Input
              type="tel"
              placeholder="09XX XXX XXXX"
              value={mobileNumber}
              onChange={(e) => handleMobileChange(e.target.value)}
              fontSize="lg"
              textAlign="center"
              letterSpacing="wide"
            />
            <Text fontSize="xs" color="gray.600" mt={2}>
              This should be the mobile number linked to your {config.name} account
            </Text>
          </FormControl>

          {/* Proceed Button */}
          <Button
            colorScheme="primary"
            size="lg"
            onClick={handleProceed}
            isDisabled={mobileNumber.length !== 11}
          >
            Proceed to Payment
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box>
      <VStack align="stretch" spacing={5}>
        {/* Header */}
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Box fontSize="2xl">{config.logo}</Box>
            <VStack align="start" spacing={0}>
              <Text fontWeight="semibold">
                {config.name} Payment
              </Text>
              <Text fontSize="sm" color="gray.600">
                {mobileNumber}
              </Text>
            </VStack>
          </HStack>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setStep(1)}
          >
            Change
          </Button>
        </HStack>

        {/* QR Code Placeholder */}
        <Box
          bg="white"
          p={6}
          borderRadius="lg"
          border="2px"
          borderColor="gray.200"
          textAlign="center"
        >
          <VStack spacing={3}>
            <Box
              w="200px"
              h="200px"
              bg="gray.100"
              borderRadius="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="4xl">📱</Text>
            </Box>
            <Text fontWeight="semibold">Scan this QR Code</Text>
            <Text fontSize="sm" color="gray.600">
              Use your {config.name} app to scan
            </Text>
          </VStack>
        </Box>

        {/* Merchant Info */}
        <Box
          bg="gray.50"
          p={4}
          borderRadius="lg"
        >
          <VStack align="stretch" spacing={2}>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">Merchant:</Text>
              <Text fontSize="sm" fontWeight="semibold">
                {config.merchantName}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">Number:</Text>
              <HStack>
                <Code fontSize="sm">{config.merchantNumber}</Code>
                <Button
                  size="xs"
                  leftIcon={<Icon as={copied ? FiCheck : FiCopy} />}
                  onClick={() => handleCopy(config.merchantNumber)}
                  colorScheme={copied ? 'green' : 'gray'}
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </HStack>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">Amount:</Text>
              <Text fontSize="sm" fontWeight="bold" color={config.color}>
                ₱{amount?.toLocaleString()}
              </Text>
            </HStack>
          </VStack>
        </Box>

        <Divider />

        {/* Instructions */}
        <Box>
          <Text fontWeight="semibold" mb={3} fontSize="sm">
            Payment Instructions:
          </Text>
          <VStack align="stretch" spacing={2}>
            {config.instructions.map((instruction, index) => (
              <HStack key={index} align="start">
                <Box
                  bg={config.color}
                  color="white"
                  minW="24px"
                  h="24px"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xs"
                  fontWeight="bold"
                >
                  {index + 1}
                </Box>
                <Text fontSize="sm" pt="2px">
                  {instruction}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>

        {/* Alert */}
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <Box fontSize="sm">
            <Text fontWeight="semibold" mb={1}>
              Important:
            </Text>
            <Text fontSize="xs">
              After completing the payment, please wait for the confirmation page.
              Do not close this window until payment is confirmed.
            </Text>
          </Box>
        </Alert>

        {/* Action Button */}
        <Button
          colorScheme="primary"
          size="lg"
          leftIcon={<Icon as={FiCheck} />}
        >
          I've Completed the Payment
        </Button>
      </VStack>
    </Box>
  );
};

export default EWalletPayment;
