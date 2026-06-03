import {
  Box,
  SimpleGrid,
  VStack,
  Text,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiPlus,
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiFileText,
  FiSettings,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

/**
 * Quick Actions Component
 * Provides quick access to common owner tasks
 */

const QuickActionCard = ({ icon, label, description, onClick, color }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box
      bg={bgColor}
      p={5}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
      cursor="pointer"
      onClick={onClick}
      transition="all 0.2s"
      _hover={{
        bg: hoverBg,
        transform: 'translateY(-4px)',
        boxShadow: 'lg',
      }}
    >
      <VStack spacing={3}>
        <Box
          bg={`${color}.50`}
          p={3}
          borderRadius="lg"
          w="fit-content"
        >
          <Icon as={icon} boxSize={6} color={`${color}.600`} />
        </Box>
        <VStack spacing={1}>
          <Text fontWeight="semibold" fontSize="sm" textAlign="center">
            {label}
          </Text>
          <Text fontSize="xs" color="gray.600" textAlign="center">
            {description}
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
};

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: FiPlus,
      label: 'Add Property',
      description: 'List a new rental',
      color: 'primary',
      onClick: () => navigate('/owner/properties/add'),
    },
    {
      icon: FiCalendar,
      label: 'Manage Bookings',
      description: 'View reservations',
      color: 'success',
      onClick: () => navigate('/owner/bookings'),
    },
    {
      icon: FiUsers,
      label: 'View Tenants',
      description: 'Manage tenants',
      color: 'purple',
      onClick: () => navigate('/owner/tenants'),
    },
    {
      icon: FiDollarSign,
      label: 'Payments',
      description: 'Track revenue',
      color: 'warning',
      onClick: () => navigate('/owner/payments'),
    },
    {
      icon: FiFileText,
      label: 'Reports',
      description: 'View analytics',
      color: 'info',
      onClick: () => navigate('/owner/reports'),
    },
    {
      icon: FiSettings,
      label: 'Settings',
      description: 'Account settings',
      color: 'gray',
      onClick: () => navigate('/owner/settings'),
    },
  ];

  return (
    <Box>
      <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
        {actions.map((action, index) => (
          <QuickActionCard key={index} {...action} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default QuickActions;
