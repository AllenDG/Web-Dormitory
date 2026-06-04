import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Image,
  useRadioGroup,
  useRadio,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  FiCreditCard,
  FiDollarSign,
  FiSmartphone,
} from 'react-icons/fi';
import { SiMastercard, SiVisa } from 'react-icons/si';
import PropTypes from 'prop-types';
import { PAYMENT_METHOD } from '../../../shared/stores/useBookingStore';

/**
 * Payment Method Radio Card Component
 */
const PaymentMethodCard = (props) => {
  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label" w="full">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="2px"
        borderRadius="8px"
        borderColor="gray.200"
        bg="white"
        p={4}
        transition="all 0.2s"
        _checked={{
          borderColor: 'primary.500',
          bg: 'primary.50',
          boxShadow: 'md',
        }}
        _hover={{
          borderColor: 'primary.300',
          transform: 'translateY(-2px)',
          boxShadow: 'md',
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
};

PaymentMethodCard.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Payment Method Selector Component
 * 
 * Allows users to select payment method
 * Shows available payment options with icons
 * 
 * @component
 */
const PaymentMethodSelector = ({ value, onChange }) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'paymentMethod',
    value,
    onChange,
  });

  const group = getRootProps();

  const paymentMethods = [
    {
      value: PAYMENT_METHOD.GCASH,
      label: 'GCash',
      icon: FiSmartphone,
      description: 'Pay via GCash mobile wallet',
      color: 'blue.500',
      popular: true,
    },
    {
      value: PAYMENT_METHOD.PAYMAYA,
      label: 'PayMaya',
      icon: FiSmartphone,
      description: 'Pay via PayMaya mobile wallet',
      color: 'green.500',
      popular: true,
    },
    {
      value: PAYMENT_METHOD.BANK_TRANSFER,
      label: 'Bank Transfer',
      icon: FiDollarSign,
      description: 'Direct bank transfer',
      color: 'purple.500',
      popular: false,
    },
    {
      value: PAYMENT_METHOD.CREDIT_CARD,
      label: 'Credit/Debit Card',
      icon: FiCreditCard,
      description: 'Visa, Mastercard, etc.',
      color: 'orange.500',
      popular: false,
    },
    {
      value: PAYMENT_METHOD.CASH,
      label: 'Cash Payment',
      icon: FiDollarSign,
      description: 'Pay in person (upon move-in)',
      color: 'gray.500',
      popular: false,
    },
  ];

  return (
    <Box>
      <VStack align="start" spacing={2} mb={4}>
        <Text fontSize="lg" fontWeight="600" color="gray.900">
          Select Payment Method
        </Text>
        <Text fontSize="sm" color="gray.600">
          Choose how you want to pay for your booking
        </Text>
      </VStack>

      <SimpleGrid {...group} columns={{ base: 1, md: 2 }} spacing={4}>
        {paymentMethods.map((method) => {
          const radio = getRadioProps({ value: method.value });
          return (
            <PaymentMethodCard key={method.value} {...radio}>
              <HStack justify="space-between" align="start">
                <HStack spacing={3} flex={1}>
                  <Box
                    bg={`${method.color.split('.')[0]}.100`}
                    p={2}
                    borderRadius="8px"
                    color={method.color}
                  >
                    <Icon as={method.icon} boxSize={5} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <HStack>
                      <Text fontSize="md" fontWeight="600" color="gray.900">
                        {method.label}
                      </Text>
                      {method.popular && (
                        <Text
                          fontSize="xs"
                          color="primary.600"
                          fontWeight="600"
                          bg="primary.50"
                          px={2}
                          py={0.5}
                          borderRadius="full"
                        >
                          Popular
                        </Text>
                      )}
                    </HStack>
                    <Text fontSize="xs" color="gray.600">
                      {method.description}
                    </Text>
                  </VStack>
                </HStack>
              </HStack>
            </PaymentMethodCard>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

PaymentMethodSelector.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PaymentMethodSelector;
