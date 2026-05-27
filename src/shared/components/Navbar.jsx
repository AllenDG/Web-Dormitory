import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useColorMode,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Text,
  Badge,
} from '@chakra-ui/react';
import { FiMenu, FiSun, FiMoon, FiHeart } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container } from './index';
import useUIStore from '../stores/useUIStore';
import useRentalStore from '../stores/useRentalStore';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Find Rentals', path: '/find-rentals' },
  { name: 'How It Works', path: '/how-it-works' },
  { name: 'About Us', path: '/about-us' },
  { name: 'Contact', path: '/contact' },
];

/**
 * Modern Navbar Component
 */
const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const { favorites } = useRentalStore();

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const activeLinkColor = useColorModeValue('primary.500', 'primary.300');

  const isActive = (path) => location.pathname === path;

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
      <Container size="xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Text
            fontSize="2xl"
            fontWeight="bold"
            bgGradient="linear(to-r, primary.500, purple.500)"
            bgClip="text"
            cursor="pointer"
            onClick={() => navigate('/')}
          >
            Dormy
          </Text>

          {/* Desktop Navigation */}
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Text
                  fontWeight="medium"
                  color={isActive(link.path) ? activeLinkColor : 'gray.600'}
                  _dark={{
                    color: isActive(link.path) ? activeLinkColor : 'gray.300',
                  }}
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

          {/* Right Side Actions */}
          <HStack spacing={2}>
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

            {/* Theme Toggle */}
            <IconButton
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
              variant="ghost"
              aria-label="Toggle theme"
            />

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
                    _dark={{
                      bg: isActive(link.path) ? 'primary.900' : 'transparent',
                    }}
                    _hover={{ bg: 'gray.100', _dark: { bg: 'gray.700' } }}
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

              {/* Favorites in Mobile */}
              <Box
                p={3}
                borderRadius="md"
                _hover={{ bg: 'gray.100', _dark: { bg: 'gray.700' } }}
                cursor="pointer"
                onClick={() => {
                  navigate('/favorites');
                  closeMobileMenu();
                }}
              >
                <HStack justify="space-between">
                  <Text fontWeight="medium">Favorites</Text>
                  {favorites.length > 0 && (
                    <Badge colorScheme="red" borderRadius="full">
                      {favorites.length}
                    </Badge>
                  )}
                </HStack>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
