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
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Section, Card, Container, Button } from '../../shared/components';

const MotionBox = motion(Box);

const contactInfo = [
  {
    icon: FiMail,
    title: 'Email Us',
    details: 'support@dormy.ph',
    description: 'Send us an email anytime',
    color: 'blue.500',
  },
  {
    icon: FiPhone,
    title: 'Call Us',
    details: '+63 912 345 6789',
    description: 'Mon-Fri from 8am to 6pm',
    color: 'green.500',
  },
  {
    icon: FiMapPin,
    title: 'Visit Us',
    details: 'Dagupan City, Pangasinan',
    description: 'Come say hello',
    color: 'purple.500',
  },
  {
    icon: FiClock,
    title: 'Working Hours',
    details: 'Mon-Fri: 8am - 6pm',
    description: 'Sat: 9am - 3pm',
    color: 'orange.500',
  },
];

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

/**
 * Modern Contact Us Page
 */
const ContactPage = () => {
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    console.log('Contact form submitted:', data);
    
    toast({
      title: 'Message sent!',
      description: "We'll get back to you as soon as possible.",
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    
    reset();
  };

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
              Get In Touch
            </Heading>
          </MotionBox>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Text fontSize={{ base: 'lg', md: 'xl' }} maxW="3xl" opacity={0.9}>
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </Text>
          </MotionBox>
        </VStack>
      </Section>

      {/* Contact Info Cards */}
      <Section>
        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: 6, md: 8 }}
        >
          {contactInfo.map((info, index) => (
            <MotionBox
              key={info.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card hover padding={6} textAlign="center" h="full">
                <VStack spacing={3}>
                  <Box
                    p={3}
                    borderRadius="lg"
                    bg={`${info.color.split('.')[0]}.50`}
                    _dark={{ bg: `${info.color.split('.')[0]}.900` }}
                  >
                    <Icon as={info.icon} boxSize={6} color={info.color} />
                  </Box>
                  <Heading as="h3" size="sm">
                    {info.title}
                  </Heading>
                  <Text fontWeight="medium" color="primary.500">
                    {info.details}
                  </Text>
                  <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                    {info.description}
                  </Text>
                </VStack>
              </Card>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Section>

      {/* Contact Form Section */}
      <Section bg={bgColor}>
        <Container size="lg">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12}>
            {/* Left Column - Info */}
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <VStack align="start" spacing={6} h="full" justify="center">
                <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }}>
                  Let's Talk
                </Heading>
                <Text
                  fontSize={{ base: 'md', md: 'lg' }}
                  color="gray.600"
                  _dark={{ color: 'gray.400' }}
                >
                  Whether you're a student looking for accommodation or a property
                  owner wanting to list your space, we're here to help. Fill out
                  the form and we'll get back to you within 24 hours.
                </Text>
                <VStack align="start" spacing={4} pt={4}>
                  <HStack>
                    <Icon as={FiMail} color="primary.500" />
                    <Text>support@dormy.ph</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiPhone} color="primary.500" />
                    <Text>+63 912 345 6789</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiMapPin} color="primary.500" />
                    <Text>Dagupan City, Pangasinan, Philippines</Text>
                  </HStack>
                </VStack>
              </VStack>
            </MotionBox>

            {/* Right Column - Form */}
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card padding={8} bg={cardBg}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <VStack spacing={6}>
                    <FormControl isInvalid={errors.name}>
                      <FormLabel>Name</FormLabel>
                      <Input
                        {...register('name')}
                        placeholder="Your full name"
                        size="lg"
                      />
                      {errors.name && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.name.message}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={errors.email}>
                      <FormLabel>Email</FormLabel>
                      <Input
                        {...register('email')}
                        type="email"
                        placeholder="your.email@example.com"
                        size="lg"
                      />
                      {errors.email && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.email.message}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={errors.subject}>
                      <FormLabel>Subject</FormLabel>
                      <Input
                        {...register('subject')}
                        placeholder="What is this about?"
                        size="lg"
                      />
                      {errors.subject && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.subject.message}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={errors.message}>
                      <FormLabel>Message</FormLabel>
                      <Textarea
                        {...register('message')}
                        placeholder="Tell us more..."
                        rows={6}
                        size="lg"
                      />
                      {errors.message && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.message.message}
                        </Text>
                      )}
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="primary"
                      size="lg"
                      w="full"
                      isLoading={isSubmitting}
                    >
                      Send Message
                    </Button>
                  </VStack>
                </form>
              </Card>
            </MotionBox>
          </SimpleGrid>
        </Container>
      </Section>
    </Box>
  );
};

export default ContactPage;
