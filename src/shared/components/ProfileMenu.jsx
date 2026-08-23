import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Text,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';

/**
 * Owner/Admin header profile menu — generalizes the public site Navbar's
 * richer avatar menu (identity block + grouped items) instead of the bare,
 * dead-link avatar menu the portals used to have.
 *
 * Both "Profile" and "Settings" route to `settingsPath`, since the
 * portal's Settings page already opens with a Profile tab first — no
 * separate ProfilePage exists for owner/admin.
 */
const ProfileMenu = ({ settingsPath }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
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
        <Avatar size="sm" name={user?.name} bg="primary.500" color="white" />
      </MenuButton>
      <MenuList>
        <Box px={3} py={2}>
          <Text fontWeight="600" fontSize="sm" noOfLines={1}>
            {user?.name}
          </Text>
          <Text fontSize="xs" color="gray.600" noOfLines={1}>
            {user?.email}
          </Text>
        </Box>
        <MenuDivider />
        <MenuItem icon={<Icon as={FiUser} />} fontSize="sm" onClick={() => navigate(settingsPath)}>
          Profile
        </MenuItem>
        <MenuItem icon={<Icon as={FiSettings} />} fontSize="sm" onClick={() => navigate(settingsPath)}>
          Settings
        </MenuItem>
        <MenuDivider />
        <MenuItem icon={<Icon as={FiLogOut} />} fontSize="sm" color="error.500" onClick={handleLogout}>
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
