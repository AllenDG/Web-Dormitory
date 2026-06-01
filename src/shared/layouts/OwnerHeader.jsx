import { 
  Flex, 
  Text, 
  IconButton, 
  Icon, 
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { FiBell, FiLogOut, FiUser, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';

/**
 * Owner Header
 * Top header bar for owner portal
 */
const OwnerHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Flex flex="1" justify="space-between" align="center">
      {/* Page Title - Can be dynamic based on route */}
      <Text fontSize="lg" fontWeight="semibold" color="gray.800">
        Welcome back, {user?.name?.split(' ')[0] || 'Owner'}!
      </Text>

      {/* Right Side Actions */}
      <HStack spacing={2}>
        {/* Notifications */}
        <Menu>
          <MenuButton
            as={IconButton}
            icon={
              <Box position="relative">
                <Icon as={FiBell} boxSize={5} />
                <Badge
                  position="absolute"
                  top="-4px"
                  right="-4px"
                  colorScheme="red"
                  borderRadius="full"
                  fontSize="xs"
                  minW="18px"
                  h="18px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  3
                </Badge>
              </Box>
            }
            variant="ghost"
            aria-label="Notifications"
          />
          <MenuList>
            <MenuItem fontSize="sm">
              <VStack align="start" spacing={0}>
                <Text fontWeight="semibold">New booking request</Text>
                <Text fontSize="xs" color="gray.600">2 hours ago</Text>
              </VStack>
            </MenuItem>
            <MenuItem fontSize="sm">
              <VStack align="start" spacing={0}>
                <Text fontWeight="semibold">Property inquiry</Text>
                <Text fontSize="xs" color="gray.600">5 hours ago</Text>
              </VStack>
            </MenuItem>
            <MenuItem fontSize="sm">
              <VStack align="start" spacing={0}>
                <Text fontWeight="semibold">Payment received</Text>
                <Text fontSize="xs" color="gray.600">1 day ago</Text>
              </VStack>
            </MenuItem>
            <MenuDivider />
            <MenuItem fontSize="sm" color="primary.600">
              View all notifications
            </MenuItem>
          </MenuList>
        </Menu>

        {/* User Menu */}
        <Menu>
          <MenuButton
            as={Flex}
            align="center"
            gap={2}
            cursor="pointer"
            px={2}
            py={1}
            borderRadius="lg"
            _hover={{ bg: 'gray.100' }}
            transition="all 0.2s"
          >
            <Avatar 
              size="sm" 
              name={user?.name} 
              bg="primary.500"
              color="white"
            />
          </MenuButton>
          <MenuList>
            <MenuItem icon={<Icon as={FiUser} />} fontSize="sm">
              Profile
            </MenuItem>
            <MenuItem 
              icon={<Icon as={FiSettings} />} 
              fontSize="sm"
              onClick={() => navigate('/owner/settings')}
            >
              Settings
            </MenuItem>
            <MenuDivider />
            <MenuItem 
              icon={<Icon as={FiLogOut} />} 
              fontSize="sm"
              color="error.500"
              onClick={handleLogout}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};

// Import Box and VStack for notifications
import { Box, VStack } from '@chakra-ui/react';

export default OwnerHeader;
