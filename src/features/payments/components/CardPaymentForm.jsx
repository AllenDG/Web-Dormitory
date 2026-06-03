import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  InputGroup,
  InputLeftElement,
  Icon,
  SimpleGrid,
  Image,
  Checkbox,
} from '@chakra-ui/react';
import { FiCreditCard, FiLock } from 'react-icons/fi';
import { useState } from 'react';

/**
 * Card Payment Form Component
 * Credit/Debit card input form
 * Week 14 - Payments & Transactions
 */

const CardPaymentForm = ({ onDataChange }) => {
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    saveCard: false,
  });

  const [cardType, setCardType] = useState('');

  const handleChange = (field, value) => {
    let processedValue = value;

    // Format card number with spaces
    if (field === 'cardNumber') {
      processedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .substring(0, 19); // Max 16 digits + 3 spaces

      // Detect card type
      const firstDigit = value.charAt(0);
      if (firstDigit === '4') setCardType('visa');
      else if (firstDigit === '5') setCardType('mastercard');
      else if (firstDigit === '3') setCardType('amex');
      else setCardType('');
    }

    // Format expiry month (01-12)
    if (field === 'expiryMonth') {
      processedValue = value.replace(/\D/g, '').substring(0, 2);
      if (parseInt(processedValue) > 12) processedValue = '12';
    }

    // Format expiry year (last 2 digits)
    if (field === 'expiryYear') {
      processedValue = value.replace(/\D/g, '').substring(0, 2);
    }

    // Format CVV (3-4 digits)
    if (field === 'cvv') {
      const maxLength = cardType === 'amex' ? 4 : 3;
      processedValue = value.replace(/\D/g, '').substring(0, maxLength);
    }

    const newData = { ...cardData, [field]: processedValue };
    setCardData(newData);
    
    if (onDataChange) {
      onDataChange(newData);
    }
  };

  const getCardLogo = () => {
    switch (cardType) {
      case 'visa':
        return 'VISA';
      case 'mastercard':
        return 'Mastercard';
      case 'amex':
        return 'AMEX';
      default:
        return null;
    }
  };

  return (
    <Box>
      <VStack align="stretch" spacing={4}>
        {/* Card Number */}
        <FormControl isRequired>
          <FormLabel fontSize="sm">Card Number</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Icon as={FiCreditCard} color="gray.400" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardData.cardNumber}
              onChange={(e) => handleChange('cardNumber', e.target.value)}
              fontSize="md"
              letterSpacing="wider"
            />
          </InputGroup>
          {cardType && (
            <HStack mt={2} spacing={2}>
              <Box
                bg="gray.100"
                px={3}
                py={1}
                borderRadius="md"
                fontSize="xs"
                fontWeight="semibold"
              >
                {getCardLogo()}
              </Box>
            </HStack>
          )}
        </FormControl>

        {/* Cardholder Name */}
        <FormControl isRequired>
          <FormLabel fontSize="sm">Cardholder Name</FormLabel>
          <Input
            type="text"
            placeholder="JUAN DELA CRUZ"
            value={cardData.cardName}
            onChange={(e) => handleChange('cardName', e.target.value.toUpperCase())}
            textTransform="uppercase"
          />
          <FormHelperText fontSize="xs">
            Name as it appears on your card
          </FormHelperText>
        </FormControl>

        {/* Expiry Date and CVV */}
        <SimpleGrid columns={3} spacing={4}>
          <FormControl isRequired>
            <FormLabel fontSize="sm">Month</FormLabel>
            <Input
              type="text"
              placeholder="MM"
              value={cardData.expiryMonth}
              onChange={(e) => handleChange('expiryMonth', e.target.value)}
              textAlign="center"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="sm">Year</FormLabel>
            <Input
              type="text"
              placeholder="YY"
              value={cardData.expiryYear}
              onChange={(e) => handleChange('expiryYear', e.target.value)}
              textAlign="center"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="sm">CVV</FormLabel>
            <InputGroup>
              <InputLeftElement>
                <Icon as={FiLock} color="gray.400" boxSize={4} />
              </InputLeftElement>
              <Input
                type="password"
                placeholder={cardType === 'amex' ? '1234' : '123'}
                value={cardData.cvv}
                onChange={(e) => handleChange('cvv', e.target.value)}
                textAlign="center"
                maxLength={cardType === 'amex' ? 4 : 3}
              />
            </InputGroup>
          </FormControl>
        </SimpleGrid>

        {/* Save Card Checkbox */}
        <Checkbox
          isChecked={cardData.saveCard}
          onChange={(e) => handleChange('saveCard', e.target.checked)}
          colorScheme="primary"
        >
          <Text fontSize="sm">
            Save this card for future payments
          </Text>
        </Checkbox>

        {/* Security Notice */}
        <Box
          bg="blue.50"
          p={3}
          borderRadius="md"
          border="1px"
          borderColor="blue.200"
        >
          <HStack spacing={2}>
            <Icon as={FiLock} color="blue.600" />
            <Text fontSize="xs" color="blue.700">
              Your card information is encrypted and never stored on our servers.
              We use PCI-DSS compliant payment processing.
            </Text>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default CardPaymentForm;
