import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiSliders,
  FiMap,
  FiCalendar,
  FiCheckCircle,
  FiHome,
  FiUser,
  FiShield,
} from 'react-icons/fi';
import { Section, Card, Container, Button } from '../../shared/components';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, borderRadius, typography } from '../../shared/styles/tokens';

const MotionBox = motion(Box);

const steps = [
  {
    icon: FiSearch,
    title: 'Search Dorms',
    description:
      'Browse verified listings using our advanced search. Filter by location, budget, and amenities to find your perfect match.',
  },
  {
    icon: FiSliders,
    title: 'Apply Filters',
    description:
      'Use quick filters or advanced options to narrow down results. Sort by price, rating, or distance from your school.',
  },
  {
    icon: FiMap,
    title: 'Explore & Compare',
    description:
      'View properties on an interactive map, check nearby places, calculate commute times, and compare up to 3 properties.',
  },
  {
    icon: FiCalendar,
    title: 'Schedule Visit',
    description:
      'Found something you like? Schedule a visit at your convenience. Property owners respond quickly to inquiries.',
  },
  {
    icon: FiCheckCircle,
    title: 'Review Details',
    description:
      'Check amenities, read reviews from other students, view photos, and ensure the property meets all your needs.',
  },
  {
    icon: FiHome,
    title: 'Reserve & Move In',
    description:
      "Complete the booking process and get ready to move in. We'll guide you through every step of the way.",
  },
];

const forStudents = [
  {
    icon: FiSearch,
    title: 'Smart Search',
    points: [
      'Advanced filters for precise results',
      'Budget Finder for best value recommendations',
      'Interactive map with property markers',
      'Save favorites and compare properties',
    ],
  },
  {
    icon: FiShield,
    title: 'Safe & Verified',
    points: [
      'All properties verified by our team',
      'Real reviews from actual students',
      'Transparent pricing, no hidden fees',
      'Secure booking and payment process',
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
      'Manage bookings through dashboard',
      'Reach thousands of potential tenants',
    ],
  },
  {
    icon: FiHome,
    title: 'Manage Easily',
    points: [
      'Track inquiries and bookings in real-time',
      'Communicate directly with students',
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
  {
    question: 'How does the Budget Finder work?',
    answer:
      'Enter your budget range, location preferences, and lifestyle needs. Our algorithm scores properties based on value, amenities, and your preferences to recommend the best matches.',
  },
];

/**
 * Redesigned How It Works Page - Phase 7
 * Clean, minimalist design with step-by-step guide
 */
const HowItWorksPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Section
        bg="white"
        borderBottom={`1px solid ${colors.gray[200]}`}
        py={{ base: spacing[12], md: spacing[16] }}
      >
        <VStack spacing={spacing[6]} textAlign="center">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heading
              as="h1"
              fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
              fontWeight={typography.fontWeight.bold}
              color={colors.gray[900]}
            >
              How Dormy Works
            </Heading>
          </MotionBox>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              maxW="3xl"
              color={colors.gray[600]}
              lineHeight={typography.lineHeight.relaxed}
            >
              Finding your perfect student accommodation is simple with Dormy.
              Follow these steps to discover, compare, and book your ideal dorm.
            </Text>
          </MotionBox>
        </VStack>
      </Section>

      {/* Steps Section */}
      <Section bg={colors.gray[50]}>
        <VStack spacing={spacing[12]}>
          <Heading
            as="h2"
            fontSize={{ base: '3xl', md: '4xl' }}
            textAlign="center"
            fontWeight={typography.fontWeight.bold}
            color={colors.gray[900]}
          >
            Your Journey to Finding Home
          </Heading>

          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={{ base: spacing[6], md: spacing[8] }}
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
                <Box
                  bg="white"
                  borderRadius={borderRadius.lg}
                  p={spacing[6]}
                  h="full"
                  border={`1px solid ${colors.gray[200]}`}
                  transition="all 0.3s"
                  _hover={{
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-4px)',
                  }}
                >
                  <VStack spacing={spacing[4]} align="start">
                    {/* Step Number and Icon */}
                    <HStack spacing={spacing[3]}>
                      <Box
                        w="48px"
                        h="48px"
                        borderRadius={borderRadius.md}
                        bg={colors.primary[50]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={step.icon} boxSize={6} color={colors.primary[700]} />
                      </Box>
                      <Box
                        w="32px"
                        h="32px"
                        borderRadius="full"
                        bg={colors.primary[700]}
                        color="white"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontWeight={typography.fontWeight.bold}
                        fontSize={typography.fontSize.sm}
                      >
                        {index + 1}
                      </Box>
                    </HStack>

                    <Heading
                      as="h3"
                      fontSize={typography.fontSize.lg}
                      fontWeight={typography.fontWeight.semibold}
                      color={colors.gray[900]}
                    >
                      {step.title}
                    </Heading>
                    <Text
                      fontSize={typography.fontSize.sm}
                      color={colors.gray[600]}
                      lineHeight={typography.lineHeight.relaxed}
                    >
                      {step.description}
                    </Text>
                  </VStack>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </VStack>
      </Section>

      {/* For Students Section */}
      <Section bg="white">
        <VStack spacing={spacing[12]}>
          <VStack spacing={spacing[4]} textAlign="center">
            <Heading
              as="h2"
              fontSize={{ base: '3xl', md: '4xl' }}
              fontWeight={typography.fontWeight.bold}
              color={colors.gray[900]}
            >
              For Students
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color={colors.gray[600]}
              maxW="2xl"
            >
              Everything you need to find your perfect student accommodation
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={spacing[8]} w="full">
            {forStudents.map((feature, index) => (
              <MotionBox
                key={feature.title}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  bg={colors.gray[50]}
                  borderRadius={borderRadius.lg}
                  p={spacing[6]}
                  h="full"
                  border={`1px solid ${colors.gray[200]}`}
                >
                  <VStack align="start" spacing={spacing[4]}>
                    <HStack spacing={spacing[3]}>
                      <Icon as={feature.icon} boxSize={6} color={colors.primary[700]} />
                      <Heading
                        as="h3"
                        fontSize={typography.fontSize.lg}
                        fontWeight={typography.fontWeight.semibold}
                        color={colors.gray[900]}
                      >
                        {feature.title}
                      </Heading>
                    </HStack>
                    <VStack align="start" spacing={spacing[2]} pl={spacing[9]}>
                      {feature.points.map((point, i) => (
                        <HStack key={i} align="start">
                          <Icon
                            as={FiCheckCircle}
                            color={colors.success}
                            mt="2px"
                            flexShrink={0}
                          />
                          <Text
                            fontSize={typography.fontSize.sm}
                            color={colors.gray[600]}
                          >
                            {point}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                  </VStack>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>

          <Button
            size="lg"
            bg={colors.primary[700]}
            color="white"
            onClick={() => navigate('/find-rentals')}
            px={spacing[8]}
            _hover={{
              bg: colors.primary[800],
            }}
          >
            Start Searching
          </Button>
        </VStack>
      </Section>

      {/* For Property Owners Section */}
      <Section bg={colors.gray[50]}>
        <VStack spacing={spacing[12]}>
          <VStack spacing={spacing[4]} textAlign="center">
            <Heading
              as="h2"
              fontSize={{ base: '3xl', md: '4xl' }}
              fontWeight={typography.fontWeight.bold}
              color={colors.gray[900]}
            >
              For Property Owners
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color={colors.gray[600]}
              maxW="2xl"
            >
              Reach thousands of students looking for accommodation
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={spacing[8]} w="full">
            {forOwners.map((feature, index) => (
              <MotionBox
                key={feature.title}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  bg="white"
                  borderRadius={borderRadius.lg}
                  p={spacing[6]}
                  h="full"
                  border={`1px solid ${colors.gray[200]}`}
                >
                  <VStack align="start" spacing={spacing[4]}>
                    <HStack spacing={spacing[3]}>
                      <Icon as={feature.icon} boxSize={6} color={colors.primary[700]} />
                      <Heading
                        as="h3"
                        fontSize={typography.fontSize.lg}
                        fontWeight={typography.fontWeight.semibold}
                        color={colors.gray[900]}
                      >
                        {feature.title}
                      </Heading>
                    </HStack>
                    <VStack align="start" spacing={spacing[2]} pl={spacing[9]}>
                      {feature.points.map((point, i) => (
                        <HStack key={i} align="start">
                          <Icon
                            as={FiCheckCircle}
                            color={colors.success}
                            mt="2px"
                            flexShrink={0}
                          />
                          <Text
                            fontSize={typography.fontSize.sm}
                            color={colors.gray[600]}
                          >
                            {point}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                  </VStack>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>

          <Text
            fontSize={typography.fontSize.sm}
            color={colors.gray[600]}
            textAlign="center"
          >
            Property owner portal coming soon! Contact us to list your property.
          </Text>
        </VStack>
      </Section>

      {/* FAQ Section */}
      <Section bg="white">
        <Container size="lg">
          <VStack spacing={spacing[8]}>
            <Heading
              as="h2"
              fontSize={{ base: '3xl', md: '4xl' }}
              textAlign="center"
              fontWeight={typography.fontWeight.bold}
              color={colors.gray[900]}
            >
              Frequently Asked Questions
            </Heading>

            <Accordion allowToggle w="full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} border="none" mb={spacing[4]}>
                  <Box
                    bg={colors.gray[50]}
                    borderRadius={borderRadius.lg}
                    border={`1px solid ${colors.gray[200]}`}
                  >
                    <AccordionButton
                      p={spacing[6]}
                      _hover={{ bg: 'transparent' }}
                      borderRadius={borderRadius.lg}
                    >
                      <Box flex="1" textAlign="left">
                        <Heading
                          as="h3"
                          fontSize={typography.fontSize.base}
                          fontWeight={typography.fontWeight.semibold}
                          color={colors.gray[900]}
                        >
                          {faq.question}
                        </Heading>
                      </Box>
                      <AccordionIcon color={colors.primary[700]} />
                    </AccordionButton>
                    <AccordionPanel pb={spacing[6]} px={spacing[6]}>
                      <Text
                        fontSize={typography.fontSize.sm}
                        color={colors.gray[600]}
                        lineHeight={typography.lineHeight.relaxed}
                      >
                        {faq.answer}
                      </Text>
                    </AccordionPanel>
                  </Box>
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
