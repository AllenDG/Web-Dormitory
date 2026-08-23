import { Flex, Icon, Text } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

/**
 * Single sidebar nav row, shared by OwnerSidebar and AdminSidebar. Active
 * state uses a left accent bar + tint (replacing the old flat-tint-only
 * style) so the current section reads clearly at a glance.
 */
const SidebarNavItem = ({ icon, label, path, onClick, end = false }) => {
  return (
    <NavLink to={path} end={end} onClick={onClick} style={{ textDecoration: 'none' }}>
      {({ isActive }) => (
        <Flex
          align="center"
          gap={3}
          pl={4}
          pr={4}
          py={3}
          borderLeftWidth="3px"
          borderLeftColor={isActive ? 'primary.500' : 'transparent'}
          borderRadius="0 8px 8px 0"
          bg={isActive ? 'primary.50' : 'transparent'}
          color={isActive ? 'primary.700' : 'gray.700'}
          fontWeight={isActive ? 'semibold' : 'medium'}
          cursor="pointer"
          transition="all 0.15s"
          _hover={{
            bg: isActive ? 'primary.50' : 'gray.100',
          }}
        >
          <Icon as={icon} boxSize={5} />
          <Text fontSize="sm">{label}</Text>
        </Flex>
      )}
    </NavLink>
  );
};

export default SidebarNavItem;
