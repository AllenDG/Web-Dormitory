import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Select,
  useColorModeValue,
  useToast,
  Divider,
} from '@chakra-ui/react';
import {
  FiMoreVertical,
  FiCheckCircle,
  FiAlertTriangle,
  FiMessageSquare,
  FiTrash2,
} from 'react-icons/fi';

/**
 * ReportedIssues Component
 * Manage reported issues and complaints
 */
export function ReportedIssues() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('open');
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Mock data - will be replaced with API
  const reports = [
    {
      id: 1,
      type: 'property',
      title: 'Misleading Property Information',
      description: 'Property photos do not match actual condition.',
      reporter: 'Juan Dela Cruz',
      reportedItem: 'Cozy Studio Near University',
      status: 'open',
      priority: 'high',
      created: '2 hours ago',
    },
    {
      id: 2,
      type: 'user',
      title: 'Inappropriate Behavior',
      description: 'Owner was rude and unprofessional during visit.',
      reporter: 'Maria Santos',
      reportedItem: 'Pedro Garcia',
      status: 'investigating',
      priority: 'medium',
      created: '1 day ago',
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Issue',
      description: 'Payment was deducted but booking not confirmed.',
      reporter: 'Ana Reyes',
      reportedItem: 'Transaction #12345',
      status: 'open',
      priority: 'high',
      created: '3 hours ago',
    },
    {
      id: 4,
      type: 'property',
      title: 'Safety Concerns',
      description: 'Property has safety issues not mentioned in listing.',
      reporter: 'Carlos Ramos',
      reportedItem: 'Modern Apartment',
      status: 'resolved',
      priority: 'high',
      created: '2 days ago',
    },
  ];

  const handleResolve = (report) => {
    toast({
      title: 'Issue Resolved',
      description: `Report #${report.id} has been marked as resolved.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleInvestigate = (report) => {
    toast({
      title: 'Investigation Started',
      description: `Report #${report.id} is now under investigation.`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'property':
        return 'blue';
      case 'user':
        return 'purple';
      case 'payment':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'red';
      case 'investigating':
        return 'yellow';
      case 'resolved':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <Box>
      {/* Filters */}
      <HStack spacing={4} mb={6}>
        <Select
          maxW="150px"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="property">Property</option>
          <option value="user">User</option>
          <option value="payment">Payment</option>
        </Select>

        <Select
          maxW="150px"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
        </Select>
      </HStack>

      {/* Reports List */}
      <VStack spacing={4} align="stretch">
        {reports.map((report) => (
          <Box
            key={report.id}
            bg={bgColor}
            p={5}
            borderRadius="8px"
            border="1px"
            borderColor={borderColor}
          >
            <HStack justify="space-between" mb={3}>
              <HStack spacing={3}>
                <Badge colorScheme={getTypeColor(report.type)} borderRadius="8px">
                  {report.type}
                </Badge>
                <Badge
                  colorScheme={getStatusColor(report.status)}
                  borderRadius="8px"
                >
                  {report.status}
                </Badge>
                <Badge
                  colorScheme={getPriorityColor(report.priority)}
                  borderRadius="8px"
                >
                  {report.priority} priority
                </Badge>
              </HStack>

              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FiMoreVertical />}
                  variant="ghost"
                  size="sm"
                />
                <MenuList>
                  <MenuItem icon={<FiMessageSquare />}>Contact Reporter</MenuItem>
                  <MenuItem
                    icon={<FiCheckCircle />}
                    onClick={() => handleResolve(report)}
                  >
                    Mark as Resolved
                  </MenuItem>
                  <MenuItem
                    icon={<FiAlertTriangle />}
                    onClick={() => handleInvestigate(report)}
                  >
                    Start Investigation
                  </MenuItem>
                  <MenuItem icon={<FiTrash2 />} color="red.500">
                    Delete Report
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>

            <Text fontWeight="bold" fontSize="md" mb={2}>
              {report.title}
            </Text>

            <Text fontSize="sm" color="gray.600" mb={3}>
              {report.description}
            </Text>

            <Divider my={3} />

            <HStack justify="space-between" fontSize="sm">
              <HStack spacing={2}>
                <Avatar size="xs" name={report.reporter} />
                <Text color="gray.600">
                  Reported by <strong>{report.reporter}</strong>
                </Text>
              </HStack>

              <Text color="gray.500">{report.created}</Text>
            </HStack>

            <HStack mt={2} fontSize="sm">
              <Text color="gray.600">Against:</Text>
              <Text fontWeight="medium">{report.reportedItem}</Text>
            </HStack>

            {report.status === 'open' && (
              <HStack mt={4} spacing={2}>
                <Button
                  size="sm"
                  colorScheme="yellow"
                  leftIcon={<FiAlertTriangle />}
                  onClick={() => handleInvestigate(report)}
                >
                  Investigate
                </Button>
                <Button
                  size="sm"
                  colorScheme="green"
                  leftIcon={<FiCheckCircle />}
                  onClick={() => handleResolve(report)}
                >
                  Resolve
                </Button>
              </HStack>
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
