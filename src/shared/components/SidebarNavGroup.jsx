import { useState, useEffect } from 'react';
import { Box, VStack, HStack, Icon, IconButton, Text } from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const SidebarNavGroup = ({ icon: GroupIcon, label, basePath, children = [] }) => {
  const { pathname } = useLocation();
  const isGroupActive = pathname.startsWith(basePath);
  const [isOpen, setIsOpen] = useState(isGroupActive);

  useEffect(() => {
    if (isGroupActive && !isOpen) {
      setIsOpen(true);
    }
  }, [isGroupActive, isOpen]);

  return (
    <Box>
      <HStack
        w="full"
        px={4}
        py={3}
        spacing={0}
        borderLeft="3px"
        borderColor={isGroupActive ? 'primary.500' : 'transparent'}
        bg={isGroupActive ? 'primary.50' : 'transparent'}
        _hover={{ bg: isGroupActive ? 'primary.50' : 'gray.100' }}
        transition="all 0.2s"
      >
        <NavLink to={basePath} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          {GroupIcon && <Icon as={GroupIcon} boxSize={5} color="gray.600" />}
          <Text fontSize="sm" fontWeight="500" color="gray.700">
            {label}
          </Text>
        </NavLink>

        <IconButton
          icon={<Icon as={isOpen ? FiChevronUp : FiChevronDown} boxSize={4} />}
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          aria-label="Toggle group"
        />
      </HStack>

      {isOpen && (
        <VStack spacing={0} align="stretch" pl={4} py={1}>
          {children.map((child) => (
            <NavLink
              key={child.path}
              to={child.path}
              end={child.end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                borderLeft: isActive ? '3px solid' : '3px solid transparent',
                borderColor: isActive ? 'var(--chakra-colors-primary-500)' : 'transparent',
                backgroundColor: isActive ? 'var(--chakra-colors-primary-50)' : 'transparent',
                color: isActive ? 'var(--chakra-colors-gray-900)' : 'var(--chakra-colors-gray-600)',
                fontWeight: isActive ? '500' : '400',
                transition: 'all 0.2s',
                textDecoration: 'none',
              })}
            >
              {child.label}
            </NavLink>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default SidebarNavGroup;
