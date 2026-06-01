import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Text,
  Icon,
  Box,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiMail, FiUser, FiPhone, FiMessageSquare, FiSend } from 'react-icons/fi';
import { Button } from '../../../shared/components';

// Validation schema
const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

// Quick message templates
const messageTemplates = [
  {
    title: 'General Inquiry',
    message: "Hi! I'm interested in this property. Could you provide more details about availability and viewing schedule?",
  },
  {
    title: 'Availability Check',
    message: "Hello! Is this property still available? I'd like to schedule a visit as soon as possible.",
  },
  {
    title: 'Price Negotiation',
    message: "Hi! I'm very interested in this property. Is there any flexibility on the monthly rent?",
  },
  {
    title: 'Move-in Date',
    message: "Hello! When is the earliest move-in date? I'm looking to relocate within the next few weeks.",
  },
];

/**
 * Send Inquiry Modal Component
 * 
 * Features:
 * - Quick message templates
 * - Real-time validation
 * - Clean, minimalist design
 * - Mobile-friendly
 * 
 * @component
 */
const SendInquiryModal = ({ isOpen, onClose, property }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(inquirySchema),
  });

  const messageValue = watch('message');

  const onSubmit = async (data) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const inquiryData = {
      ...data,
      propertyId: property?.id,
      propertyTitle: property?.title,
      ownerEmail: property?.ownerEmail,
      timestamp: new Date().toISOString(),
    };

    console.log('Inquiry data:', inquiryData);

    toast({
      title: 'Inquiry Sent!',
      description: `Your message has been sent to the property owner. They will contact you at ${data.email}.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    onClose();
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.title);
    setValue('message', template.message, { shouldValidate: true });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="8px" mx={4}>
        <ModalHeader>
          <HStack spacing={3}>
            <Box bg="primary.100" p={2} borderRadius="8px">
              <Icon as={FiMessageSquare} boxSize={5} color="primary.600" />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="lg" fontWeight="semibold">
                Send Inquiry
              </Text>
              <Text fontSize="sm" fontWeight="normal" color="gray.600">
                {property?.title}
              </Text>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton borderRadius="8px" />
        
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={5} align="stretch">
              {/* Quick Templates */}
              <Box>
                <Text fontSize="sm" fontWeight="500" mb={2} color="gray.700">
                  Quick Templates
                </Text>
                <SimpleGrid columns={2} spacing={2}>
                  {messageTemplates.map((template) => (
                    <Box
                      key={template.title}
                      as="button"
                      type="button"
                      p={3}
                      borderRadius="8px"
                      border="2px"
                      borderColor={selectedTemplate === template.title ? 'primary.600' : 'gray.200'}
                      bg={selectedTemplate === template.title ? 'primary.50' : 'white'}
                      textAlign="left"
                      transition="all 0.2s"
                      _hover={{ borderColor: 'primary.400', bg: 'primary.50' }}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <Text 
                        fontSize="xs" 
                        fontWeight="semibold" 
                        color={selectedTemplate === template.title ? 'primary.600' : 'gray.700'}
                      >
                        {template.title}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>

              {/* Contact Information */}
              <FormControl isInvalid={errors.name}>
                <FormLabel fontSize="sm" fontWeight="500">Your Name</FormLabel>
                <Input
                  {...register('name')}
                  placeholder="Juan Dela Cruz"
                  size="lg"
                  borderRadius="8px"
                />
                {errors.name && (
                  <Text color="red.500" fontSize="xs" mt={1}>
                    {errors.name.message}
                  </Text>
                )}
              </FormControl>

              <SimpleGrid columns={2} spacing={3}>
                <FormControl isInvalid={errors.email}>
                  <FormLabel fontSize="sm" fontWeight="500">Email</FormLabel>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="your@email.com"
                    size="lg"
                    borderRadius="8px"
                  />
                  {errors.email && (
                    <Text color="red.500" fontSize="xs" mt={1}>
                      {errors.email.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={errors.phone}>
                  <FormLabel fontSize="sm" fontWeight="500">Phone</FormLabel>
                  <Input
                    {...register('phone')}
                    type="tel"
                    placeholder="+63 912 345 6789"
                    size="lg"
                    borderRadius="8px"
                  />
                  {errors.phone && (
                    <Text color="red.500" fontSize="xs" mt={1}>
                      {errors.phone.message}
                    </Text>
                  )}
                </FormControl>
              </SimpleGrid>

              {/* Message */}
              <FormControl isInvalid={errors.message}>
                <FormLabel fontSize="sm" fontWeight="500">
                  Your Message
                  <Text as="span" fontSize="xs" color="gray.500" ml={2}>
                    ({messageValue?.length || 0} characters)
                  </Text>
                </FormLabel>
                <Textarea
                  {...register('message')}
                  placeholder="Type your message here or select a template above..."
                  rows={6}
                  borderRadius="8px"
                  resize="vertical"
                />
                {errors.message && (
                  <Text color="red.500" fontSize="xs" mt={1}>
                    {errors.message.message}
                  </Text>
                )}
              </FormControl>

              {/* Info Box */}
              <Box bg="blue.50" p={3} borderRadius="8px" borderLeft="4px" borderColor="primary.600">
                <Text fontSize="xs" color="gray.700">
                  <strong>Note:</strong> The property owner will receive your inquiry via email and will respond within 24 hours.
                </Text>
              </Box>

              {/* Action Buttons */}
              <HStack spacing={3} pt={2}>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onClose}
                  borderRadius="8px"
                  flex={1}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  loadingText="Sending..."
                  borderRadius="8px"
                  flex={1}
                  leftIcon={<Icon as={FiSend} />}
                >
                  Send Inquiry
                </Button>
              </HStack>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SendInquiryModal;
