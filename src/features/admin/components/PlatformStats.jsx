import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Icon,
  useColorModeValue,
  HStack,
  Text,
} from '@chakra-ui/react';
import {
  FiUsers,
  FiHome,
  FiDollarSign,
  FiTrendingUp,
  FiActivity,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
} from 'react-icons/fi';

/**
 * PlatformStats Component
 * Displays platform-wide statistics and metrics
 */
export function PlatformStats() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Mock data - will be replaced with API
  const stats = [
    {
      label: 'Total Users',
      value: '12,543',
      change: 12.5,
      icon: FiUsers,
      color: 'blue.500',
      helpText: 'vs last month',
    },
    {
      label: 'Active Properties',
      value: '1,234',
      change: 8.2,
      icon: FiHome,
      color: 'green.500',
      helpText: 'vs last month',
    },
    {
      label: 'Total Revenue',
      value: '₱2.4M',
      change: 15.3,
      icon: FiDollarSign,
      color: 'purple.500',
      helpText: 'this month',
    },
    {
      label: 'Platform Growth',
      value: '18.7%',
      change: 5.1,
      icon: FiTrendingUp,
      color: 'orange.500',
      helpText: 'year over year',
    },
    {
      label: 'Active Bookings',
      value: '847',
      change: 3.8,
      icon: FiActivity,
      color: 'cyan.500',
      helpText: 'this week',
    },
    {
      label: 'Verified Properties',
      value: '1,156',
      change: 6.4,
      icon: FiCheckCircle,
      color: 'teal.500',
      helpText: '93.7% verified',
    },
    {
      label: 'Pending Approvals',
      value: '28',
      change: -12.3,
      icon: FiClock,
      color: 'yellow.500',
      helpText: 'needs review',
      isDecrease: true,
    },
    {
      label: 'Reported Issues',
      value: '5',
      change: -45.5,
      icon: FiAlertCircle,
      color: 'red.500',
      helpText: 'vs last week',
      isDecrease: true,
    },
  ];

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
      {stats.map((stat, index) => (
        <Box
          key={index}
          bg={bgColor}
          p={6}
          borderRadius="8px"
          border="1px"
          borderColor={borderColor}
          transition="all 0.2s"
          _hover={{
            transform: 'translateY(-4px)',
            shadow: 'lg',
          }}
        >
          <Stat>
            <HStack justify="space-between" mb={3}>
              <StatLabel
                fontSize="sm"
                fontWeight="medium"
                color="gray.600"
              >
                {stat.label}
              </StatLabel>
              <Icon
                as={stat.icon}
                boxSize={5}
                color={stat.color}
              />
            </HStack>

            <StatNumber fontSize="2xl" fontWeight="bold" mb={2}>
              {stat.value}
            </StatNumber>

            <StatHelpText mb={0}>
              <HStack spacing={1}>
                <StatArrow
                  type={stat.isDecrease ? 'decrease' : 'increase'}
                />
                <Text fontSize="sm">
                  {Math.abs(stat.change)}%
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {stat.helpText}
                </Text>
              </HStack>
            </StatHelpText>
          </Stat>
        </Box>
      ))}
    </SimpleGrid>
  );
}
