import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Container,
  useToast,
} from '@chakra-ui/react';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiMessageSquare,
  FiSend,
  FiSearch,
  FiHome,
} from 'react-icons/fi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Contact Page v4.0
 * Enhanced UX matching home page design
 * Full-width CTA, gradient hero, Container maxW="1200px"
 */

const contactInfo = [
  {
    icon: FiMail,
    title: 'Email',
    value: 'support@dormy.ph',
    link: 'mailto:support@dormy.ph',
  },
  {
    icon: FiPhone,
    title: 'Phone',
    value: '+63 912 345 6789',
    link: 'tel:+639123456789',
  },
  {
    icon: FiMapPin,
    title: 'Address',
    value: 'Dagupan City, Pangasinan, Philippines',
    link: null,
  },
];

const faqs = [
  {
    question: 'How do I list my property?',
    answer: 'Sign up as a property owner, verify your account, and click "Add Property" in your dashboard. Fill in the details, upload photos, and submit for review.',
  },
  {
    question: 'Are all properties verified?',
    answer: 'Yes, our team verifies every property listing to ensure legitimacy and safety for our users.',
  },
  {
    question: 'How do I schedule a property visit?',
    answer: 'Click "Schedule Visit" on any property detail page, select your preferred date and time, and the owner will confirm your appointment.',
  },
  {
    question: 'Is there a booking fee?',
    answer: 'Dormy is free to use for tenants. Property owners pay a small commission only when they successfully rent out their property.',
  },
];

const ContactPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: 'Message Sent!',
      description: "We'll get back to you within 24 hours.",
      status: 'success',
      duration: 5000,
    });

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    setIsSubmitting(false);
  };

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
              Contact Us
            </Heading>
            <Text
              fontSize="md"
              color="gray.600"
              lineHeight="1.6"
            >
              Have questions? We're here to help. Send us a message and we'll respond as soon as possible.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="1200px" py={{ base: 8, md: 12 }}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Contact Form */}
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            border="1px"
            borderColor="gray.200"
          >
            <VStack spacing={4} align="stretch">
              <VStack align="start" spacing={1}>
                <HStack spacing={2}>
                  <Icon as={FiMessageSquare} color="primary.600" boxSize={5} />
                  <Heading fontSize="xl" fontWeight="semibold">
                    Send us a Message
                  </Heading>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  Fill out the form below and we'll get back to you within 24 hours
                </Text>
              </VStack>

              <form onSubmit={handleSubmit}>
                <VStack spacing={3}>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Name</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      fontSize="sm"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Email</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      fontSize="sm"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Subject</FormLabel>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this about?"
                      fontSize="sm"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Message</FormLabel>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more..."
                      rows={6}
                      fontSize="sm"
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="primary"
                    size="md"
                    w="full"
                    leftIcon={<Icon as={FiSend} />}
                    isLoading={isSubmitting}
                    fontSize="sm"
                  >
                    Send Message
                  </Button>
                </VStack>
              </form>
            </VStack>
          </Box>

          {/* Contact Info & FAQ */}
          <VStack spacing={4} align="stretch">
            {/* Contact Info */}
            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              border="1px"
              borderColor="gray.200"
            >
              <VStack spacing={4} align="stretch">
                <Heading fontSize="xl" fontWeight="semibold">
                  Get in Touch
                </Heading>

                {contactInfo.map((info, index) => (
                  <HStack key={index} spacing={3} align="start">
                    <Box bg="primary.50" p={2} borderRadius="lg">
                      <Icon as={info.icon} boxSize={4} color="primary.600" />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        color="gray.700"
                      >
                        {info.title}
                      </Text>
                      {info.link ? (
                        <Text
                          as="a"
                          href={info.link}
                          fontSize="sm"
                          color="primary.600"
                          _hover={{ textDecoration: 'underline' }}
                        >
                          {info.value}
                        </Text>
                      ) : (
                        <Text fontSize="sm" color="gray.600">
                          {info.value}
                        </Text>
                      )}
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            </Box>

            {/* FAQ */}
            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              border="1px"
              borderColor="gray.200"
            >
              <VStack spacing={4} align="stretch">
                <Heading fontSize="xl" fontWeight="semibold">
                  Frequently Asked Questions
                </Heading>

                {faqs.map((faq, index) => (
                  <VStack key={index} align="start" spacing={1}>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.900"
                    >
                      {faq.question}
                    </Text>
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      lineHeight="1.5"
                    >
                      {faq.answer}
                    </Text>
                  </VStack>
                ))}
              </VStack>
            </Box>
          </VStack>
        </SimpleGrid>
      </Container>

      {/* CTA Section - Full Width */}
      <Box
        bgGradient="linear(to-r, primary.600, primary.700)"
        py={{ base: 12, md: 16 }}
        position="relative"
        overflow="hidden"
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
                _hover={{
                  bg: 'whiteAlpha.900',
                  transform: 'translateY(-1px)',
                  boxShadow: 'lg',
                }}
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
                _hover={{
                  bg: 'whiteAlpha.200',
                  transform: 'translateY(-1px)',
                }}
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

export default ContactPage;
