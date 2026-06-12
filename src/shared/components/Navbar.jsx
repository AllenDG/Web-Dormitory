import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Text,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Icon,
} from '@chakra-ui/react';
import { FiMenu, FiHeart, FiUser, FiSettings, FiLogOut, FiLogIn, FiCalendar, FiMessageSquare, FiBarChart2 } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container } from './index';
import useUIStore from '../stores/useUIStore';
import useRentalStore from '../stores/useRentalStore';
import useChatStore from '../stores/useChatStore';
import useCompareStore from '../stores/useCompareStore';
import { useAuth } from '../../app/providers/AuthProvider';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Find Rentals', path: '/find-rentals' },
  { name: 'How It Works', path: '/how-it-works' },
  { name: 'About Us', path: '/about-us' },
  { name: 'Contact', path: '/contact' },
];

/**
 * Modern Navbar Component - Light Mode Only
 */
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const { favorites = [] } = useRentalStore();
  const { unreadCount } = useChatStore();
  const compareList = useCompareStore((state) => state.compareList);
  const compareCount = compareList.length;
  const { user, isAuthenticated, logout } = useAuth();

  // Light mode colors only
  const bg = 'white';
  const borderColor = 'gray.200';
  const activeLinkColor = 'primary.500';

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={1000}
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <Container maxW="1400px">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          {/* Logo - Left Aligned */}
          <HStack spacing={8}>
            <Text
              fontSize="xl"
              fontWeight="semibold"
              bgGradient="linear(to-r, primary.500, purple.500)"
              bgClip="text"
              cursor="pointer"
              onClick={() => navigate('/')}
            >
              RentMe
            </Text>

            {/* Desktop Navigation - Next to Logo */}
            <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color={isActive(link.path) ? activeLinkColor : 'gray.600'}
                    _hover={{ color: activeLinkColor }}
                    transition="color 0.2s"
                    position="relative"
                    _after={
                      isActive(link.path)
                        ? {
                            content: '""',
                            position: 'absolute',
                            bottom: '-8px',
                            left: 0,
                            right: 0,
                            height: '2px',
                            bg: activeLinkColor,
                          }
                        : {}
                    }
                  >
                    {link.name}
                  </Text>
                </Link>
              ))}
            </HStack>
          </HStack>

          {/* Right Side Actions - Right Aligned */}
          <HStack spacing={2}>
            {/* Chat (Authenticated only) */}
            {isAuthenticated && (
              <IconButton
                icon={
                  <Box position="relative">
                    <FiMessageSquare />
                    {unreadCount > 0 && (
                      <Badge
                        position="absolute"
                        top="-8px"
                        right="-8px"
                        colorScheme="red"
                        borderRadius="full"
                        fontSize="xs"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Box>
                }
                variant="ghost"
                aria-label="Messages"
                onClick={() => navigate('/chat')}
                display={{ base: 'none', md: 'flex' }}
              />
            )}

            {/* Compare Properties */}
            <IconButton
              icon={
                <Box position="relative">
                  <FiBarChart2 />
                  {compareCount > 0 && (
                    <Badge
                      position="absolute"
                      top="-8px"
                      right="-8px"
                      colorScheme="blue"
                      borderRadius="full"
                      fontSize="xs"
                    >
                      {compareCount}
                    </Badge>
                  )}
                </Box>
              }
              variant="ghost"
              aria-label="Compare Properties"
              onClick={() => navigate('/compare')}
              display={{ base: 'none', md: 'flex' }}
            />

            {/* Favorites */}
            <IconButton
              icon={
                <Box position="relative">
                  <FiHeart />
                  {favorites.length > 0 && (
                    <Badge
                      position="absolute"
                      top="-8px"
                      right="-8px"
                      colorScheme="red"
                      borderRadius="full"
                      fontSize="xs"
                    >
                      {favorites.length}
                    </Badge>
                  )}
                </Box>
              }
              variant="ghost"
              aria-label="Favorites"
              onClick={() => navigate('/favorites')}
              display={{ base: 'none', md: 'flex' }}
            />

            {/* User Menu (Desktop) */}
            {isAuthenticated ? (
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  p={1}
                  borderRadius="full"
                  display={{ base: 'none', md: 'flex' }}
                >
                  <Avatar size="sm" name={user?.name} bg="primary.500" />
                </MenuButton>
                <MenuList>
                  <Box px={3} py={2}>
                    <Text fontWeight="600" fontSize="sm">
                      {user?.name}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {user?.email}
                    </Text>
                  </Box>
                  <MenuDivider />
                  <MenuItem icon={<Icon as={FiUser} />} onClick={() => navigate('/profile')}>
                    My Profile
                  </MenuItem>
                  <MenuItem icon={<Icon as={FiMessageSquare} />} onClick={() => navigate('/chat')}>
                    Messages
                    {unreadCount > 0 && (
                      <Badge ml={2} colorScheme="red" borderRadius="full">
                        {unreadCount}
                      </Badge>
                    )}
                  </MenuItem>
                  <MenuItem icon={<Icon as={FiBarChart2} />} onClick={() => navigate('/compare')}>
                    Compare
                    {compareCount > 0 && (
                      <Badge ml={2} colorScheme="blue" borderRadius="full">
                        {compareCount}
                      </Badge>
                    )}
                  </MenuItem>
                  <MenuItem icon={<Icon as={FiHeart} />} onClick={() => navigate('/favorites')}>
                    Favorites
                    {favorites.length > 0 && (
                      <Badge ml={2} colorScheme="red" borderRadius="full">
                        {favorites.length}
                      </Badge>
                    )}
                  </MenuItem>
                  <MenuItem icon={<Icon as={FiCalendar} />} onClick={() => navigate('/my-bookings')}>
                    My Bookings
                  </MenuItem>
                  <MenuItem icon={<Icon as={FiCalendar} />} onClick={() => navigate('/my-visits')}>
                    My Visits
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem icon={<Icon as={FiLogOut} />} onClick={handleLogout} color="red.500">
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button
                leftIcon={<Icon as={FiLogIn} />}
                colorScheme="primary"
                size="sm"
                onClick={() => navigate('/login')}
                display={{ base: 'none', md: 'flex' }}
                borderRadius="8px"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu Button */}
            <IconButton
              icon={<FiMenu />}
              onClick={toggleMobileMenu}
              variant="ghost"
              aria-label="Open menu"
              display={{ base: 'flex', md: 'none' }}
            />
          </HStack>
        </Flex>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isMobileMenuOpen}
        placement="right"
        onClose={closeMobileMenu}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              {/* User Info (Mobile) */}
              {isAuthenticated ? (
                <Box p={4} bg="primary.50" borderRadius="8px" mb={2}>
                  <HStack spacing={3}>
                    <Avatar size="sm" name={user?.name} bg="primary.500" />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="600" fontSize="sm">
                        {user?.name}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {user?.email}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              ) : (
                <Button
                  leftIcon={<Icon as={FiLogIn} />}
                  colorScheme="primary"
                  onClick={() => {
                    navigate('/login');
                    closeMobileMenu();
                  }}
                  borderRadius="8px"
                  mb={2}
                >
                  Sign In
                </Button>
              )}

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                >
                  <Box
                    p={3}
                    borderRadius="md"
                    bg={isActive(link.path) ? 'primary.50' : 'transparent'}
                    _hover={{ bg: 'gray.100' }}
                  >
                    <Text
                      fontWeight={isActive(link.path) ? 'bold' : 'medium'}
                      color={isActive(link.path) ? activeLinkColor : 'inherit'}
                    >
                      {link.name}
                    </Text>
                  </Box>
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  <Box h="1px" bg="gray.200" my={2} />

                  {/* Profile */}
                  <Box
                    p={3}
                    borderRadius="md"
                    _hover={{ bg: 'gray.100' }}
                    cursor="pointer"
                    onClick={() => {
                      navigate('/profile');
                      closeMobileMenu();
                    }}
                  >
                    <HStack>
                      <Icon as={FiUser} />
                      <Text fontWeight="medium">My Profile</Text>
                    </HStack>
                  </Box>

                  {/* Messages */}
                  <Box
                    p={3}
                    borderRadius="md"
                    _hover={{ bg: 'gray.100' }}
                    cursor="pointer"
                    onClick={() => {
                      navigate('/chat');
                      closeMobileMenu();
                    }}
                  >
                    <HStack justify="space-between">
                      <HStack>
                        <Icon as={FiMessageSquare} />
                        <Text fontWeight="medium">Messages</Text>
                      </HStack>
                      {unreadCount > 0 && (
                        <Badge colorScheme="red" borderRadius="full">
                          {unreadCount}
                        </Badge>
                      )}
                    </HStack>
                  </Box>

                  {/* Compare in Mobile */}
                  <Box
                    p={3}
                    borderRadius="md"
                    _hover={{ bg: 'gray.100' }}
                    cursor="pointer"
                    onClick={() => {
                      navigate('/compare');
                      closeMobileMenu();
                    }}
                  >
                    <HStack justify="space-between">
                      <HStack>
                        <Icon as={FiBarChart2} />
                        <Text fontWeight="medium">Compare</Text>
                      </HStack>
                      {compareCount > 0 && (
                        <Badge colorScheme="blue" borderRadius="full">
                          {compareCount}
                        </Badge>
                      )}
                    </HStack>
                  </Box>

                  {/* Favorites in Mobile */}
                  <Box
                    p={3}
                    borderRadius="md"
                    _hover={{ bg: 'gray.100' }}
                    cursor="pointer"
                    onClick={() => {
                      navigate('/favorites');
                      closeMobileMenu();
                    }}
                  >
                    <HStack justify="space-between">
                      <HStack>
                        <Icon as={FiHeart} />
                        <Text fontWeight="medium">Favorites</Text>
                      </HStack>
                      {favorites.length > 0 && (
                        <Badge colorScheme="red" borderRadius="full">
                          {favorites.length}
                        </Badge>
                      )}
                    </HStack>
                  </Box>

                  {/* My Bookings */}
                  <Box
                    p={3}
                    borderRadius="md"
                    _hover={{ bg: 'gray.100' }}
                    cursor="pointer"
                    onClick={() => {
                      navigate('/my-bookings');
                      closeMobileMenu();
                    }}
                  >
                    <HStack>
                      <Icon as={FiCalendar} />
                      <Text fontWeight="medium">My Bookings</Text>
                    </HStack>
                  </Box>

                  {/* My Visits */}
                  <Box
                    p={3}
                    borderRadius="md"
                    _hover={{ bg: 'gray.100' }}
                    cursor="pointer"
                    onClick={() => {
                      navigate('/my-visits');
                      closeMobileMenu();
                    }}
                  >
                    <HStack>
                      <Icon as={FiCalendar} />
                      <Text fontWeight="medium">My Visits</Text>
                    </HStack>
                  </Box>

                  <Box h="1px" bg="gray.200" my={2} />

                  {/* Logout */}
                  <Box
                    p={3}
                    borderRadius="md"
                    _hover={{ bg: 'red.50' }}
                    cursor="pointer"
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                  >
                    <HStack>
                      <Icon as={FiLogOut} color="red.500" />
                      <Text fontWeight="medium" color="red.500">
                        Logout
                      </Text>
                    </HStack>
                  </Box>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
