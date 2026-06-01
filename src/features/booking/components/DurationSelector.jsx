import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  useRadioGroup,
  useRadio,
} from '@chakra-ui/react';
import { FiCalendar, FiClock, FiTrendingUp } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { DURATION_TYPE } from '../../../shared/stores/useBookingStore';

/**
 * Duration Radio Card Component
 * Custom radio button styled as a card
 */
const DurationCard = (props) => {
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

DurationCard.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Duration Selector Component
 * 
 * Allows users to select booking duration type
 * Shows pricing and benefits for each duration
 * 
 * @component
 */
const DurationSelector = ({ value, onChange, property }) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'duration',
    value,
    onChange,
  });

  const group = getRootProps();

  // Calculate pricing for each duration
  const dailyRate = property?.dailyRate || property?.price / 30 || 0;
  const monthlyRate = property?.price || 0;

  const durations = [
    {
      value: DURATION_TYPE.DAILY,
      label: 'Daily',
      icon: FiClock,
      price: dailyRate,
      unit: 'day',
      description: 'Perfect for short stays',
      features: ['Flexible dates', 'No commitment', 'Ideal for travelers'],
      badge: null,
      serviceFee: '5%',
    },
    {
      value: DURATION_TYPE.SIX_MONTHS,
      label: '6 Months',
      icon: FiCalendar,
      price: monthlyRate,
      unit: 'month',
      description: 'Great for students',
      features: ['5% discount', '1 month deposit', 'Lower service fee (3%)'],
      badge: { text: 'Save 5%', color: 'green' },
      serviceFee: '3%',
    },
    {
      value: DURATION_TYPE.ONE_YEAR,
      label: '1 Year',
      icon: FiTrendingUp,
      price: monthlyRate,
      unit: 'month',
      description: 'Best value for long-term',
      features: ['10% discount', '2 months deposit', 'Lowest service fee (2%)'],
      badge: { text: 'Save 10%', color: 'blue' },
      serviceFee: '2%',
    },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Box>
      <VStack align="start" spacing={2} mb={4}>
        <Text fontSize="lg" fontWeight="600" color="gray.900">
          Select Booking Duration
        </Text>
        <Text fontSize="sm" color="gray.600">
          Choose the duration that best fits your needs
        </Text>
      </VStack>

      <VStack {...group} spacing={4}>
        {durations.map((duration) => {
          const radio = getRadioProps({ value: duration.value });
          return (
            <DurationCard key={duration.value} {...radio}>
              <HStack justify="space-between" align="start" mb={3}>
                <HStack spacing={3}>
                  <Box
                    bg="primary.100"
                    p={2}
                    borderRadius="8px"
                    color="primary.600"
                  >
                    <Icon as={duration.icon} boxSize={5} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <HStack>
                      <Text fontSize="lg" fontWeight="600" color="gray.900">
                        {duration.label}
                      </Text>
                      {duration.badge && (
                        <Badge
                          colorScheme={duration.badge.color}
                          borderRadius="full"
                          px={2}
                          fontSize="xs"
                        >
                          {duration.badge.text}
                        </Badge>
                      )}
                    </HStack>
                    <Text fontSize="sm" color="gray.600">
                      {duration.description}
                    </Text>
                  </VStack>
                </HStack>
                <VStack align="end" spacing={0}>
                  <Text fontSize="xl" fontWeight="bold" color="primary.600">
                    {formatPrice(duration.price)}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    per {duration.unit}
                  </Text>
                </VStack>
              </HStack>

              <VStack align="start" spacing={1}>
                {duration.features.map((feature, index) => (
                  <HStack key={index} spacing={2}>
                    <Box
                      w="4px"
                      h="4px"
                      borderRadius="full"
                      bg="primary.500"
                    />
                    <Text fontSize="xs" color="gray.600">
                      {feature}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </DurationCard>
          );
        })}
      </VStack>
    </Box>
  );
};

DurationSelector.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  property: PropTypes.object.isRequired,
};

export default DurationSelector;
