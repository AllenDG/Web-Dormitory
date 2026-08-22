import {
  Flex,
  Box,
  Text,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  HStack,
} from '@chakra-ui/react';
import { FiLogOut, FiUser, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import NotificationCenter from '../../domains/notifications/components/NotificationCenter';
import GlobalSearch from '../../domains/search/components/GlobalSearch';

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
    <Flex flex="1" justify="space-between" align="center" gap={4}>
      {/* Page Title - Can be dynamic based on route */}
      <Text
        fontSize="lg"
        fontWeight="semibold"
        color="gray.800"
        display={{ base: 'none', xl: 'block' }}
        whiteSpace="nowrap"
      >
        Welcome back, {user?.name?.split(' ')[0] || 'Owner'}!
      </Text>

      {/* Global Search */}
      <Box display={{ base: 'none', md: 'block' }} flex={1}>
        <GlobalSearch />
      </Box>

      {/* Right Side Actions */}
      <HStack spacing={2}>
        {/* Notifications */}
        <NotificationCenter />

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

export default OwnerHeader;
