import {
  Box,
  VStack,
  HStack,
  Text,
  Radio,
  RadioGroup,
  Icon,
  Image,
  Badge,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  FiCreditCard,
  FiSmartphone,
  FiDollarSign,
} from 'react-icons/fi';
import { useState } from 'react';

/**
 * Payment Method Selector Component
 * Allows users to choose payment method
 * Week 14 - Payments & Transactions
 */

const PaymentOption = ({ value, icon, label, description, logos, isPopular, isSelected, onClick }) => {
  return (
    <Box
      p={5}
      borderRadius="lg"
      border="2px"
      borderColor={isSelected ? 'primary.500' : 'gray.200'}
      bg={isSelected ? 'primary.50' : 'white'}
      cursor="pointer"
      onClick={onClick}
      transition="all 0.2s"
      _hover={{
        borderColor: 'primary.500',
        transform: 'translateY(-2px)',
        boxShadow: 'md',
      }}
      position="relative"
    >
      {isPopular && (
        <Badge
          position="absolute"
          top={-2}
          right={-2}
          colorScheme="green"
          fontSize="xs"
        >
          Popular
        </Badge>
      )}

      <HStack spacing={4}>
        {/* Icon */}
        <Box
          bg={isSelected ? 'primary.100' : 'gray.100'}
          p={3}
          borderRadius="lg"
        >
          <Icon
            as={icon}
            boxSize={6}
            color={isSelected ? 'primary.600' : 'gray.600'}
          />
        </Box>

        {/* Content */}
        <VStack align="start" flex={1} spacing={1}>
          <Text fontWeight="semibold" fontSize="md">
            {label}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {description}
          </Text>
          
          {/* Logos */}
          {logos && logos.length > 0 && (
            <HStack spacing={2} mt={2}>
              {logos.map((logo, index) => (
                <Box
                  key={index}
                  bg="white"
                  px={2}
                  py={1}
                  borderRadius="md"
                  border="1px"
                  borderColor="gray.200"
                >
                  <Text fontSize="xs" fontWeight="semibold">
                    {logo}
                  </Text>
                </Box>
              ))}
            </HStack>
          )}
        </VStack>

        {/* Radio */}
        <Radio
          value={value}
          isChecked={isSelected}
          colorScheme="primary"
        />
      </HStack>
    </Box>
  );
};

const PaymentMethodSelector = ({ value, onChange }) => {
  const paymentMethods = [
    {
      value: 'credit_card',
      icon: FiCreditCard,
      label: 'Credit / Debit Card',
      description: 'Visa, Mastercard, JCB, Amex',
      logos: ['VISA', 'Mastercard', 'JCB'],
      isPopular: true,
    },
    {
      value: 'gcash',
      icon: FiSmartphone,
      label: 'GCash',
      description: 'Pay using your GCash wallet',
      logos: ['GCash'],
      isPopular: true,
    },
    {
      value: 'paymaya',
      icon: FiSmartphone,
      label: 'PayMaya',
      description: 'Pay using your PayMaya account',
      logos: ['PayMaya'],
      isPopular: false,
    },
    {
      value: 'bank_transfer',
      icon: FiDollarSign,
      label: 'Bank Transfer',
      description: 'Direct bank transfer (manual verification)',
      logos: ['BPI', 'BDO', 'UnionBank'],
      isPopular: false,
    },
  ];

  return (
    <Box>
      <VStack align="stretch" spacing={4}>
        <Box>
          <Text fontWeight="semibold" mb={1}>
            Select Payment Method
          </Text>
          <Text fontSize="sm" color="gray.600">
            Choose how you want to pay for your booking
          </Text>
        </Box>

        <RadioGroup value={value} onChange={onChange}>
          <VStack align="stretch" spacing={3}>
            {paymentMethods.map((method) => (
              <PaymentOption
                key={method.value}
                {...method}
                isSelected={value === method.value}
                onClick={() => onChange(method.value)}
              />
            ))}
          </VStack>
        </RadioGroup>

        {/* Security Notice */}
        <Box
          bg="gray.50"
          p={4}
          borderRadius="lg"
          border="1px"
          borderColor="gray.200"
        >
          <HStack spacing={2}>
            <Text fontSize="xs" color="gray.600">
              🔒 Your payment information is encrypted and secure. We use industry-standard
              security measures to protect your data.
            </Text>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default PaymentMethodSelector;
