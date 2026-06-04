import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Alert,
  AlertIcon,
  AlertDescription,
  Divider,
} from '@chakra-ui/react';
import { FiInfo, FiShield, FiCheckCircle } from 'react-icons/fi';
import PropTypes from 'prop-types';

/**
 * Deposit Info Component
 * 
 * Displays deposit information and terms
 * 
 * @component
 */
const DepositInfo = ({ depositAmount, durationType }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDepositTerms = (durationType) => {
    if (durationType === 'daily') {
      return {
        amount: '1 day rent',
        refundable: 'Yes, within 7 days after checkout',
        conditions: [
          'No property damage',
          'All keys returned',
          'Room left in good condition',
        ],
      };
    } else if (durationType === '6months') {
      return {
        amount: '1 month rent',
        refundable: 'Yes, within 30 days after lease ends',
        conditions: [
          'No property damage',
          'All utilities paid',
          'Proper notice given (30 days)',
          'Room left in good condition',
        ],
      };
    } else {
      return {
        amount: '2 months rent',
        refundable: 'Yes, within 30 days after lease ends',
        conditions: [
          'No property damage',
          'All utilities paid',
          'Proper notice given (60 days)',
          'Room left in good condition',
          'No outstanding dues',
        ],
      };
    }
  };

  const terms = getDepositTerms(durationType);

  return (
    <Box>
      <Alert status="info" borderRadius="8px" mb={4}>
        <AlertIcon />
        <AlertDescription fontSize="sm">
          A security deposit of <strong>{formatPrice(depositAmount)}</strong> ({terms.amount}) is
          required. This is fully refundable upon checkout if all conditions are met.
        </AlertDescription>
      </Alert>

      <VStack align="stretch" spacing={4}>
        <Box>
          <HStack mb={3}>
            <Icon as={FiShield} color="primary.600" boxSize={5} />
            <Text fontWeight="600" color="gray.900">
              Deposit Protection
            </Text>
          </HStack>
          <Text fontSize="sm" color="gray.600">
            Your deposit is held securely and will be refunded according to the terms below.
          </Text>
        </Box>

        <Divider />

        <Box>
          <HStack mb={3}>
            <Icon as={FiInfo} color="primary.600" boxSize={5} />
            <Text fontWeight="600" color="gray.900">
              Refund Conditions
            </Text>
          </HStack>
          <VStack align="start" spacing={2}>
            {terms.conditions.map((condition, index) => (
              <HStack key={index} spacing={2} align="start">
                <Icon as={FiCheckCircle} color="green.500" boxSize={4} mt={0.5} />
                <Text fontSize="sm" color="gray.600">
                  {condition}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>

        <Box bg="green.50" p={3} borderRadius="8px" borderLeft="4px" borderColor="green.500">
          <Text fontSize="sm" color="gray.700">
            <strong>Refund Timeline:</strong> {terms.refundable}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

DepositInfo.propTypes = {
  depositAmount: PropTypes.number.isRequired,
  durationType: PropTypes.string.isRequired,
};

export default DepositInfo;
