import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  Button,
  Container,
} from '@chakra-ui/react';
import {
  FiTarget,
  FiEye,
  FiHeart,
  FiShield,
  FiUsers,
  FiTrendingUp,
  FiSearch,
  FiHome,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

/**
 * About Us Page v6.0
 * Enhanced UX with cleaner layout and interactive design
 * 100% width CTA, 8px border radius, better visual hierarchy
 */

const values = [
  {
    icon: FiShield,
    title: 'Trust & Safety',
    description: 'All properties are verified. We prioritize the safety and security of our community.',
  },
  {
    icon: FiHeart,
    title: 'Student-First',
    description: 'Built by students, for students. We understand your needs and challenges.',
  },
  {
    icon: FiUsers,
    title: 'Community',
    description: 'Creating connections between students and property owners for mutual benefit.',
  },
  {
    icon: FiTrendingUp,
    title: 'Innovation',
    description: 'Using technology to make finding accommodation easier and more efficient.',
  },
];

const stats = [
  { number: '1,000+', label: 'Properties Listed' },
  { number: '5,000+', label: 'Happy Students' },
  { number: '500+', label: 'Property Owners' },
  { number: '50+', label: 'Cities Covered' },
];

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <Box bg="gray.50" minH="100vh">
      {/* Hero Section */}
      <Box
        bgGradient="linear(to-br, primary.50, white)"
        borderBottom="1px"
        borderColor="gray.200"
        py={{ base: 12, md: 16 }}
      >
        <Container maxW="1200px">
          <VStack spacing={3} textAlign="center" maxW="3xl" mx="auto">
            <Heading
              fontSize={{ base: '3xl', md: '4xl' }}
              fontWeight="semibold"
              color="gray.900"
            >
              About RentMe
            </Heading>
            <Text
              fontSize="md"
              color="gray.600"
              lineHeight="1.6"
            >
              Making student accommodation search simple, safe, and stress-free
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="1200px" py={{ base: 8, md: 12 }}>
        <VStack spacing={10}>
          {/* Mission & Vision - Featured Cards */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
            <Box
              bg="white"
              p={8}
              borderRadius="8px"
              border="1px"
              borderColor="gray.200"
              position="relative"
              overflow="hidden"
              transition="all 0.3s"
              _hover={{ 
                boxShadow: 'xl', 
                transform: 'translateY(-4px)',
                borderColor: 'primary.400'
              }}
            >
              {/* Decorative Element */}
              <Box
                position="absolute"
                top="-20px"
                right="-20px"
                w="100px"
                h="100px"
                bg="primary.50"
                borderRadius="full"
                opacity="0.5"
              />
              <VStack align="start" spacing={4} position="relative">
                <Box bg="primary.100" p={3} borderRadius="8px">
                  <Icon as={FiTarget} boxSize={8} color="primary.600" />
                </Box>
                <Heading fontSize="xl" fontWeight="semibold" color="gray.900">
                  Our Mission
                </Heading>
                <Text fontSize="sm" color="gray.700" lineHeight="1.7">
                  To provide Filipino students with a safe, reliable, and efficient platform
                  to find quality accommodation near their schools, while helping property
                  owners connect with responsible tenants.
                </Text>
              </VStack>
            </Box>

            <Box
              bg="white"
              p={8}
              borderRadius="8px"
              border="1px"
              borderColor="gray.200"
              position="relative"
              overflow="hidden"
              transition="all 0.3s"
              _hover={{ 
                boxShadow: 'xl', 
                transform: 'translateY(-4px)',
                borderColor: 'primary.400'
              }}
            >
              {/* Decorative Element */}
              <Box
                position="absolute"
                top="-20px"
                right="-20px"
                w="100px"
                h="100px"
                bg="primary.50"
                borderRadius="full"
                opacity="0.5"
              />
              <VStack align="start" spacing={4} position="relative">
                <Box bg="primary.100" p={3} borderRadius="8px">
                  <Icon as={FiEye} boxSize={8} color="primary.600" />
                </Box>
                <Heading fontSize="xl" fontWeight="semibold" color="gray.900">
                  Our Vision
                </Heading>
                <Text fontSize="sm" color="gray.700" lineHeight="1.7">
                  To become the most trusted student accommodation platform in the Philippines,
                  where every student can easily find their perfect home away from home.
                </Text>
              </VStack>
            </Box>
          </SimpleGrid>

          {/* Values */}
          <Box w="full">
            <VStack spacing={6} mb={8}>
              <Heading fontSize="2xl" fontWeight="semibold" textAlign="center" color="gray.900">
                Our Core Values
              </Heading>
              <Text
                fontSize="sm"
                color="gray.600"
                textAlign="center"
                maxW="2xl"
              >
                The principles that guide everything we do
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5}>
              {values.map((value, index) => (
                <Box
                  key={index}
                  bg="white"
                  p={6}
                  borderRadius="8px"
                  border="1px"
                  borderColor="gray.200"
                  transition="all 0.3s"
                  _hover={{ 
                    boxShadow: 'lg', 
                    borderColor: 'primary.400',
                    transform: 'translateY(-4px)',
                    bg: 'primary.50'
                  }}
                  cursor="pointer"
                  h="full"
                >
                  <VStack align="start" spacing={4} h="full">
                    <Box bg="primary.100" p={3} borderRadius="8px">
                      <Icon as={value.icon} boxSize={6} color="primary.600" />
                    </Box>
                    <VStack align="start" spacing={2} flex="1">
                      <Heading fontSize="md" fontWeight="semibold" color="gray.900">
                        {value.title}
                      </Heading>
                      <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                        {value.description}
                      </Text>
                    </VStack>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* Stats - Enhanced Design */}
          <Box
            bg="primary.600"
            w="full"
            py={12}
            px={8}
            borderRadius="8px"
            position="relative"
            overflow="hidden"
            boxShadow="xl"
          >
            {/* Background Pattern */}
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              opacity="0.1"
              bgImage="radial-gradient(circle, white 2px, transparent 2px)"
              bgSize="30px 30px"
              pointerEvents="none"
            />
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} position="relative">
              {stats.map((stat, index) => (
                <VStack key={index} spacing={2}>
                  <Text
                    fontSize={{ base: '3xl', md: '4xl' }}
                    fontWeight="bold"
                    color="white"
                    lineHeight="1"
                  >
                    {stat.number}
                  </Text>
                  <Text
                    fontSize="sm"
                    color="primary.100"
                    textAlign="center"
                    fontWeight="medium"
                  >
                    {stat.label}
                  </Text>
                </VStack>
              ))}
            </SimpleGrid>
          </Box>

          {/* Why Choose Us - Enhanced Layout */}
          <Box w="full" bg="white" p={8} borderRadius="8px" border="1px" borderColor="gray.200">
            <VStack spacing={6} align="start">
              <Heading fontSize="2xl" fontWeight="semibold" color="gray.900">
                Why Choose RentMe?
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                <HStack align="start" spacing={4} p={4} borderRadius="8px" transition="all 0.2s" _hover={{ bg: 'gray.50' }}>
                  <Box bg="primary.100" p={2.5} borderRadius="8px" flexShrink={0}>
                    <Icon as={FiShield} boxSize={5} color="primary.600" />
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" fontSize="md" color="gray.900" mb={1}>
                      Verified Properties
                    </Text>
                    <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                      Every listing is verified by our team to ensure legitimacy and safety.
                    </Text>
                  </Box>
                </HStack>

                <HStack align="start" spacing={4} p={4} borderRadius="8px" transition="all 0.2s" _hover={{ bg: 'gray.50' }}>
                  <Box bg="primary.100" p={2.5} borderRadius="8px" flexShrink={0}>
                    <Icon as={FiUsers} boxSize={5} color="primary.600" />
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" fontSize="md" color="gray.900" mb={1}>
                      Real Reviews
                    </Text>
                    <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                      Read honest reviews from actual students who have stayed at the properties.
                    </Text>
                  </Box>
                </HStack>

                <HStack align="start" spacing={4} p={4} borderRadius="8px" transition="all 0.2s" _hover={{ bg: 'gray.50' }}>
                  <Box bg="primary.100" p={2.5} borderRadius="8px" flexShrink={0}>
                    <Icon as={FiTrendingUp} boxSize={5} color="primary.600" />
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" fontSize="md" color="gray.900" mb={1}>
                      Smart Search
                    </Text>
                    <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                      Advanced filters, budget finder, and AI-powered recommendations help you find the perfect match.
                    </Text>
                  </Box>
                </HStack>

                <HStack align="start" spacing={4} p={4} borderRadius="8px" transition="all 0.2s" _hover={{ bg: 'gray.50' }}>
                  <Box bg="primary.100" p={2.5} borderRadius="8px" flexShrink={0}>
                    <Icon as={FiHeart} boxSize={5} color="primary.600" />
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" fontSize="md" color="gray.900" mb={1}>
                      Student-Focused
                    </Text>
                    <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                      Built specifically for Filipino students with features that matter to you.
                    </Text>
                  </Box>
                </HStack>
              </SimpleGrid>
            </VStack>
          </Box>
        </VStack>
      </Container>

      {/* CTA Section - 100% Width Outside Container */}
      <Box
        bgGradient="linear(to-r, primary.600, primary.700)"
        py={{ base: 12, md: 16 }}
        position="relative"
        overflow="hidden"
        mt={8}
      >
        {/* Background Pattern */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity="0.1"
          bgImage="radial-gradient(circle, white 1px, transparent 1px)"
          bgSize="24px 24px"
          pointerEvents="none"
        />

        <Container maxW="1200px" position="relative">
          <VStack spacing={6} textAlign="center">
            <VStack spacing={3} maxW="700px">
              <Heading
                as="h2"
                fontSize={{ base: '2xl', md: '3xl' }}
                fontWeight="semibold"
                color="white"
              >
                Ready to Find Your Next Home?
              </Heading>
              <Text
                fontSize="md"
                color="whiteAlpha.900"
              >
                Join thousands of students
              </Text>
            </VStack>

            <HStack spacing={3} flexWrap="wrap" justify="center">
              <Button
                leftIcon={<Icon as={FiSearch} />}
                size="md"
                bg="white"
                color="primary.600"
                borderRadius="8px"
                _hover={{
                  bg: 'whiteAlpha.900',
                  transform: 'translateY(-2px)',
                  boxShadow: 'xl',
                }}
                transition="all 0.2s"
                onClick={() => navigate('/find-rentals')}
              >
                Search Rentals
              </Button>
              <Button
                leftIcon={<Icon as={FiHome} />}
                size="md"
                variant="outline"
                borderColor="white"
                color="white"
                borderRadius="8px"
                _hover={{
                  bg: 'whiteAlpha.200',
                  transform: 'translateY(-2px)',
                }}
                transition="all 0.2s"
                onClick={() => navigate('/owner/dashboard')}
              >
                Post My Listing
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage;
