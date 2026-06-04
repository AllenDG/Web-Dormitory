import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Container,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiSliders,
  FiMap,
  FiCalendar,
  FiCheckCircle,
  FiHome,
  FiUser,
  FiShield,
  FiDollarSign,
  FiMessageSquare,
  FiTrendingUp,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

/**
 * How It Works Page v5.0
 * Enhanced UX with cleaner layout and interactive design
 * 100% width CTA, 8px border radius, better visual hierarchy
 */

const tenantSteps = [
  {
    icon: FiSearch,
    number: '1',
    title: 'Search Properties',
    description: 'Browse verified listings using our smart search. Filter by location, budget, and amenities.',
  },
  {
    icon: FiSliders,
    number: '2',
    title: 'Apply Filters',
    description: 'Use advanced filters to narrow down results. Sort by price, rating, or distance.',
  },
  {
    icon: FiMap,
    number: '3',
    title: 'Explore & Compare',
    description: 'View properties on map, check nearby places, and compare up to 3 properties.',
  },
  {
    icon: FiCalendar,
    number: '4',
    title: 'Schedule Visit',
    description: 'Found something you like? Schedule a visit at your convenience.',
  },
  {
    icon: FiCheckCircle,
    number: '5',
    title: 'Review Details',
    description: 'Check amenities, read reviews, view photos, and ensure it meets your needs.',
  },
  {
    icon: FiHome,
    number: '6',
    title: 'Move In',
    description: 'Complete the booking and get ready to move in. We guide you every step.',
  },
];

const ownerSteps = [
  {
    icon: FiUser,
    number: '1',
    title: 'Create Account',
    description: 'Sign up as a property owner and verify your account.',
  },
  {
    icon: FiHome,
    number: '2',
    title: 'List Property',
    description: 'Add your property with photos, amenities, and pricing details.',
  },
  {
    icon: FiMessageSquare,
    number: '3',
    title: 'Receive Inquiries',
    description: 'Get notified when tenants are interested in your property.',
  },
  {
    icon: FiCalendar,
    number: '4',
    title: 'Manage Bookings',
    description: 'Approve visit requests and manage your booking calendar.',
  },
  {
    icon: FiDollarSign,
    number: '5',
    title: 'Get Paid',
    description: 'Receive payments securely through our platform.',
  },
  {
    icon: FiTrendingUp,
    number: '6',
    title: 'Track Performance',
    description: 'Monitor views, inquiries, and optimize your listings.',
  },
];

const StepCard = ({ step }) => (
  <Box
    bg="white"
    p={5}
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
      <HStack spacing={3} w="full" justify="space-between">
        <Box
          bg="primary.100"
          p={2.5}
          borderRadius="8px"
          transition="all 0.3s"
          _groupHover={{ bg: 'primary.200' }}
        >
          <Icon as={step.icon} boxSize={6} color="primary.600" />
        </Box>
        <Box
          bg="primary.600"
          color="white"
          w={9}
          h={9}
          borderRadius="8px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight="bold"
          fontSize="md"
          boxShadow="sm"
        >
          {step.number}
        </Box>
      </HStack>
      <VStack align="start" spacing={2} flex="1">
        <Heading fontSize="md" fontWeight="semibold" color="gray.900">
          {step.title}
        </Heading>
        <Text fontSize="sm" color="gray.600" lineHeight="1.6">
          {step.description}
        </Text>
      </VStack>
    </VStack>
  </Box>
);

const HowItWorksPage = () => {
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
              How It Works
            </Heading>
            <Text
              fontSize="md"
              color="gray.600"
              lineHeight="1.6"
            >
              Simple steps to find your perfect home or list your property
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="1200px" py={{ base: 8, md: 12 }}>
        <Tabs colorScheme="primary" size="md" variant="soft-rounded">
          <Box display="flex" justifyContent="center" mb={8}>
            <TabList bg="white" p={1.5} borderRadius="8px" boxShadow="sm" border="1px" borderColor="gray.200">
              <Tab
                fontSize="sm"
                fontWeight="medium"
                px={8}
                py={2}
                borderRadius="8px"
                _selected={{ color: 'white', bg: 'primary.600', boxShadow: 'sm' }}
                transition="all 0.2s"
              >
                For Tenants
              </Tab>
              <Tab
                fontSize="sm"
                fontWeight="medium"
                px={8}
                py={2}
                borderRadius="8px"
                _selected={{ color: 'white', bg: 'primary.600', boxShadow: 'sm' }}
                transition="all 0.2s"
              >
                For Property Owners
              </Tab>
            </TabList>
          </Box>

          <TabPanels>
            {/* Tenants Tab */}
            <TabPanel px={0} pt={0}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5} w="full">
                {tenantSteps.map((step, index) => (
                  <StepCard key={index} step={step} />
                ))}
              </SimpleGrid>
            </TabPanel>

            {/* Owners Tab */}
            <TabPanel px={0} pt={0}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5} w="full">
                {ownerSteps.map((step, index) => (
                  <StepCard key={index} step={step} />
                ))}
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
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
              <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight="semibold" color="white">
                Ready to Find Your Next Home?
              </Heading>
              <Text fontSize="md" color="whiteAlpha.900">
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

export default HowItWorksPage;
