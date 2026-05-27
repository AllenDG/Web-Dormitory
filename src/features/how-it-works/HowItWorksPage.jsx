import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiCalendar,
  FiCheckCircle,
  FiHome,
  FiUser,
  FiShield,
} from 'react-icons/fi';
import { Section, Card, Container, Button } from '../../shared/components';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

const steps = [
  {
    icon: FiSearch,
    title: 'Search & Filter',
    description:
      'Browse through hundreds of verified listings. Use our advanced filters to find properties that match your budget, location preferences, and amenities.',
    color: 'blue.500',
  },
  {
    icon: FiCalendar,
    title: 'Schedule a Visit',
    description:
      'Found something you like? Schedule a visit at your convenience. Our property owners are ready to show you around and answer your questions.',
    color: 'purple.500',
  },
  {
    icon: FiCheckCircle,
    title: 'Review & Decide',
    description:
      'Take your time to review the property, check amenities, and ensure it meets your needs. Read reviews from other students who have stayed there.',
    color: 'green.500',
  },
  {
    icon: FiHome,
    title: 'Move In',
    description:
      "Once you've made your decision, complete the booking process and get ready to move in. We'll guide you through every step of the way.",
    color: 'orange.500',
  },
];

const forStudents = [
  {
    icon: FiSearch,
    title: 'Easy Search',
    points: [
      'Filter by price, location, and amenities',
      'View properties on an interactive map',
      'Save your favorite listings',
      'Get instant notifications for new properties',
    ],
  },
  {
    icon: FiShield,
    title: 'Safe & Verified',
    points: [
      'All properties are verified by our team',
      'Read reviews from real students',
      'Transparent pricing with no hidden fees',
      'Secure booking process',
    ],
  },
];

const forOwners = [
  {
    icon: FiUser,
    title: 'List Your Property',
    points: [
      'Create detailed listings with photos',
      'Set your own pricing and availability',
      'Manage bookings through our dashboard',
      'Reach thousands of potential tenants',
    ],
  },
  {
    icon: FiHome,
    title: 'Manage Easily',
    points: [
      'Track inquiries and bookings in real-time',
      'Communicate directly with interested students',
      'Update property details anytime',
      'Access analytics and insights',
    ],
  },
];

const faqs = [
  {
    question: 'Is Dormy free to use?',
    answer:
      'Yes! Browsing and searching for properties on Dormy is completely free for students. Property owners pay a small fee to list their properties.',
  },
  {
    question: 'How do I schedule a property visit?',
    answer:
      'Simply click on any property listing and use the "Schedule a Visit" button. Choose your preferred date and time, and the property owner will confirm your appointment.',
  },
  {
    question: 'Are all properties verified?',
    answer:
      'Yes, our team verifies every property listing to ensure accuracy and quality. We check property details, photos, and owner credentials before approval.',
  },
  {
    question: 'What if I have issues with a property?',
    answer:
      "We have a dedicated support team ready to help. You can contact us through the platform, and we'll work with you and the property owner to resolve any issues.",
  },
  {
    question: 'Can I list multiple properties?',
    answer:
      'Absolutely! Property owners can list as many properties as they want through our owner portal. Each property gets its own dedicated listing page.',
  },
];

/**
 * Modern How It Works Page
 */
const HowItWorksPage = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box>
      {/* Hero Section */}
      <Section
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        _dark={{ bg: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)' }}
        py={{ base: 16, md: 20 }}
      >
        <VStack spacing={6} textAlign="center" color="white">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heading
              as="h1"
              fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
              fontWeight="bold"
            >
              How Dormy Works
            </Heading>
          </MotionBox>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Text fontSize={{ base: 'lg', md: 'xl' }} maxW="3xl" opacity={0.9}>
              Finding your perfect student accommodation is just four simple steps
              away. Let us guide you through the process.
            </Text>
          </MotionBox>
        </VStack>
      </Section>

      {/* Steps Section */}
      <Section>
        <VStack spacing={12}>
          <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }} textAlign="center">
            Your Journey to Finding Home
          </Heading>

          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 4 }}
            spacing={{ base: 8, md: 10 }}
            w="full"
          >
            {steps.map((step, index) => (
              <MotionBox
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <VStack spacing={4} textAlign="center">
                  {/* Step Number */}
                  <Box position="relative">
                    <Box
                      w="80px"
                      h="80px"
                      borderRadius="full"
                      bg={`${step.color.split('.')[0]}.50`}
                      _dark={{ bg: `${step.color.split('.')[0]}.900` }}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={step.icon} boxSize={8} color={step.color} />
                    </Box>
                    <Box
                      position="absolute"
                      top="-10px"
                      right="-10px"
                      w="30px"
                      h="30px"
                      borderRadius="full"
                      bg={step.color}
                      color="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                      fontSize="sm"
                    >
                      {index + 1}
                    </Box>
                  </Box>

                  <Heading as="h3" size="md">
                    {step.title}
                  </Heading>
                  <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                    {step.description}
                  </Text>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </VStack>
      </Section>

      {/* For Students Section */}
      <Section bg={bgColor}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }}>
              For Students
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color="gray.600"
              _dark={{ color: 'gray.400' }}
              maxW="2xl"
            >
              Everything you need to find your perfect student accommodation
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
            {forStudents.map((feature, index) => (
              <MotionBox
                key={feature.title}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card hover padding={8} h="full" bg={cardBg}>
                  <VStack align="start" spacing={4}>
                    <HStack spacing={3}>
                      <Icon as={feature.icon} boxSize={6} color="primary.500" />
                      <Heading as="h3" size="md">
                        {feature.title}
                      </Heading>
                    </HStack>
                    <VStack align="start" spacing={2} pl={9}>
                      {feature.points.map((point, i) => (
                        <HStack key={i} align="start">
                          <Icon
                            as={FiCheckCircle}
                            color="green.500"
                            mt={1}
                            flexShrink={0}
                          />
                          <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                            {point}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                  </VStack>
                </Card>
              </MotionBox>
            ))}
          </SimpleGrid>

          <Button
            size="lg"
            colorScheme="primary"
            onClick={() => navigate('/find-rentals')}
            px={8}
          >
            Start Searching
          </Button>
        </VStack>
      </Section>

      {/* For Property Owners Section */}
      <Section>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }}>
              For Property Owners
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color="gray.600"
              _dark={{ color: 'gray.400' }}
              maxW="2xl"
            >
              Reach thousands of students looking for accommodation
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
            {forOwners.map((feature, index) => (
              <MotionBox
                key={feature.title}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card hover padding={8} h="full" bg={cardBg}>
                  <VStack align="start" spacing={4}>
                    <HStack spacing={3}>
                      <Icon as={feature.icon} boxSize={6} color="purple.500" />
                      <Heading as="h3" size="md">
                        {feature.title}
                      </Heading>
                    </HStack>
                    <VStack align="start" spacing={2} pl={9}>
                      {feature.points.map((point, i) => (
                        <HStack key={i} align="start">
                          <Icon
                            as={FiCheckCircle}
                            color="green.500"
                            mt={1}
                            flexShrink={0}
                          />
                          <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                            {point}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                  </VStack>
                </Card>
              </MotionBox>
            ))}
          </SimpleGrid>

          <Text
            fontSize="sm"
            color="gray.600"
            _dark={{ color: 'gray.400' }}
            textAlign="center"
          >
            Property owner portal coming soon! Contact us to list your property.
          </Text>
        </VStack>
      </Section>

      {/* FAQ Section */}
      <Section bg={bgColor}>
        <Container size="lg">
          <VStack spacing={8}>
            <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }} textAlign="center">
              Frequently Asked Questions
            </Heading>

            <Accordion allowToggle w="full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} border="none" mb={4}>
                  <Card padding={0} hover={false}>
                    <AccordionButton p={6} _hover={{ bg: 'transparent' }}>
                      <Box flex="1" textAlign="left">
                        <Heading as="h3" size="sm">
                          {faq.question}
                        </Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={6} px={6}>
                      <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                        {faq.answer}
                      </Text>
                    </AccordionPanel>
                  </Card>
                </AccordionItem>
              ))}
            </Accordion>
          </VStack>
        </Container>
      </Section>
    </Box>
  );
};

export default HowItWorksPage;
