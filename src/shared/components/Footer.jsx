import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Heading,
  Link,
  HStack,
  Icon,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin,
} from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

const footerLinks = {
  'For Students': [
    { name: 'Find Rentals', path: '/find-rentals' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Favorites', path: '/favorites' },
  ],
  Company: [
    { name: 'About Us', path: '/about-us' },
    { name: 'Contact', path: '/contact' },
    { name: 'Careers', path: '/careers' },
  ],
  Legal: [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookie Policy', path: '/cookies' },
  ],
};

const socialLinks = [
  { icon: FiFacebook, url: 'https://facebook.com', label: 'Facebook' },
  { icon: FiTwitter, url: 'https://twitter.com', label: 'Twitter' },
  { icon: FiInstagram, url: 'https://instagram.com', label: 'Instagram' },
  { icon: FiLinkedin, url: 'https://linkedin.com', label: 'LinkedIn' },
];

/**
 * Modern Footer Component
 */
const Footer = () => {
  const bg = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box bg={bg} borderTop="1px" borderColor={borderColor}>
      <Container as={Stack} maxW="container.xl" py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 5 }} spacing={8}>
          {/* Brand Column */}
          <Stack spacing={4} gridColumn={{ base: '1', md: 'span 2' }}>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              bgGradient="linear(to-r, primary.500, purple.500)"
              bgClip="text"
            >
              RentMe
            </Text>
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
              Making rental search simple, safe, and stress-free.
              Find your perfect home away from home.
            </Text>
            <Stack spacing={2}>
              <HStack>
                <Icon as={FiMail} color="primary.500" />
                <Text fontSize="sm">support@rentme.ph</Text>
              </HStack>
              <HStack>
                <Icon as={FiPhone} color="primary.500" />
                <Text fontSize="sm">+63 912 345 6789</Text>
              </HStack>
              <HStack>
                <Icon as={FiMapPin} color="primary.500" />
                <Text fontSize="sm">Dagupan City, Pangasinan</Text>
              </HStack>
            </Stack>
          </Stack>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <Stack key={title} spacing={4}>
              <Heading as="h4" size="sm">
                {title}
              </Heading>
              <Stack spacing={2}>
                {links.map((link) => (
                  <Link
                    key={link.path}
                    as={RouterLink}
                    to={link.path}
                    fontSize="sm"
                    color="gray.600"
                    _dark={{ color: 'gray.400' }}
                    _hover={{
                      color: 'primary.500',
                      textDecoration: 'none',
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Stack>
            </Stack>
          ))}
        </SimpleGrid>

        <Divider my={6} />

        {/* Bottom Section */}
        <Stack
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          spacing={4}
        >
          <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
            © {new Date().getFullYear()} RentMe. All rights reserved.
          </Text>

          {/* Social Links */}
          <HStack spacing={4}>
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.url}
                isExternal
                aria-label={social.label}
              >
                <Icon
                  as={social.icon}
                  boxSize={5}
                  color="gray.600"
                  _dark={{ color: 'gray.400' }}
                  _hover={{ color: 'primary.500' }}
                  transition="color 0.2s"
                />
              </Link>
            ))}
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
