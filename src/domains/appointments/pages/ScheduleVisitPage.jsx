import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  SimpleGrid,
  useToast,
  Image,
  Icon,
  Progress,
  Divider,
  Grid,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  FiCalendar, 
  FiClock, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMessageSquare,
  FiHome,
  FiCheckCircle,
  FiArrowRight,
  FiArrowLeft,
  FiMapPin
} from 'react-icons/fi';
import { Button, Card } from '../../../shared/components';
import useRentalStore from '../../../shared/stores/useRentalStore';
import useVisitStore from '../../../shared/stores/useVisitStore';
import { useAuth } from '../../../app/providers/AuthProvider';

// Validation schemas for each step
const step1Schema = z.object({
  visitorName: z.string().min(2, 'Name must be at least 2 characters'),
  visitorEmail: z.string().email('Invalid email address'),
  visitorPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

const step2Schema = z.object({
  preferredDate: z.string().min(1, 'Please select a date'),
  preferredTime: z.string().min(1, 'Please select a time'),
});

const step3Schema = z.object({
  reason: z.string().min(10, 'Please provide a reason (at least 10 characters)'),
  additionalNotes: z.string().optional(),
});

const appointmentSchema = step1Schema.merge(step2Schema).merge(step3Schema);

// Available time slots
const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM',
];

/**
 * Schedule Visit Page v3.0 - Enhanced with Visit Store
 * 
 * Features:
 * - 3-step wizard with progress indicator
 * - Interactive date & time selection
 * - Real-time validation
 * - Confirmation preview
 * - Visit store integration
 * - Better mobile experience
 * 
 * @component
 */
const ScheduleVisitPage = () => {
  const { propertyId } = useParams();
  const { getRentalById } = useRentalStore();
  const { createVisit } = useVisitStore();
  const { user } = useAuth();
  const rental = propertyId ? getRentalById(propertyId) : null;
  const [currentStep, setCurrentStep] = useState(1);
  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    mode: 'onChange',
  });

  const formData = watch();

  const onSubmit = async (data) => {
    const visitData = {
      propertyId: rental?.id,
      propertyTitle: rental?.title,
      propertyImage: rental?.imageUrl?.[0],
      tenantId: user?.id,
      tenantName: data.visitorName,
      tenantEmail: data.visitorEmail,
      tenantPhone: data.visitorPhone,
      ownerId: rental?.ownerId || 'owner_1',
      ownerName: rental?.ownerName || 'Property Owner',
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      reason: data.reason,
      additionalNotes: data.additionalNotes || '',
    };
    
    const result = await createVisit(visitData);
    
    if (result.success) {
      toast({
        title: 'Visit Request Sent!',
        description: `Your visit request${rental ? ` for ${rental.title}` : ''} has been sent to the owner. You will be notified once it's approved.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Navigate to my visits page
      navigate('/my-visits');
    } else {
      toast({
        title: 'Request Failed',
        description: result.error || 'Unable to send visit request',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleNext = async () => {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = await trigger(['visitorName', 'visitorEmail', 'visitorPhone']);
    } else if (currentStep === 2) {
      isValid = await trigger(['preferredDate', 'preferredTime']);
    }
    
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  // Get available dates (next 14 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const availableDates = getAvailableDates();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: FiUser },
    { number: 2, title: 'Date & Time', icon: FiCalendar },
    { number: 3, title: 'Confirm', icon: FiCheckCircle },
  ];

  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Box maxW="900px" mx="auto" px={4}>
        {/* Header */}
        <VStack spacing={6} mb={8}>
          <Box
            bg="primary.600"
            p={4}
            borderRadius="8px"
            boxShadow="lg"
          >
            <Icon as={FiCalendar} boxSize={8} color="white" />
          </Box>
          <VStack spacing={2}>
            <Heading fontSize="3xl" fontWeight="bold" color="gray.900">
              Schedule a Visit
            </Heading>
            <Text fontSize="md" color="gray.600">
              Book an appointment to view the property
            </Text>
          </VStack>
        </VStack>

        {/* Progress Steps */}
        <Card p={6} mb={6} borderRadius="8px">
          <VStack spacing={4}>
            {/* Progress Bar */}
            <Progress 
              value={(currentStep / 3) * 100} 
              w="full" 
              colorScheme="primary" 
              borderRadius="8px"
              h="2"
            />
            
            {/* Step Indicators */}
            <HStack spacing={4} w="full" justify="space-between">
              {steps.map((step) => (
                <HStack 
                  key={step.number} 
                  flex={1} 
                  justify="center"
                  opacity={currentStep >= step.number ? 1 : 0.5}
                >
                  <Box
                    bg={currentStep >= step.number ? 'primary.600' : 'gray.300'}
                    color="white"
                    w={10}
                    h={10}
                    borderRadius="8px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    transition="all 0.3s"
                  >
                    {currentStep > step.number ? (
                      <Icon as={FiCheckCircle} boxSize={5} />
                    ) : (
                      <Icon as={step.icon} boxSize={5} />
                    )}
                  </Box>
                  <VStack spacing={0} align="start" display={{ base: 'none', md: 'flex' }}>
                    <Text fontSize="xs" fontWeight="semibold" color="gray.900">
                      Step {step.number}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {step.title}
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </HStack>
          </VStack>
        </Card>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
          {/* Main Form */}
          <Card p={8} borderRadius="8px">
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={6} align="stretch">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <VStack spacing={4} align="stretch">
                    <Heading fontSize="xl" fontWeight="semibold" color="gray.900">
                      Your Information
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                      Please provide your contact details
                    </Text>

                    <FormControl isInvalid={errors.visitorName}>
                      <FormLabel fontSize="sm" fontWeight="500">Full Name</FormLabel>
                      <Input
                        {...register('visitorName')}
                        placeholder="Juan Dela Cruz"
                        size="lg"
                        borderRadius="8px"
                      />
                      {errors.visitorName && (
                        <Text color="red.500" fontSize="xs" mt={1}>
                          {errors.visitorName.message}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={errors.visitorEmail}>
                      <FormLabel fontSize="sm" fontWeight="500">Email Address</FormLabel>
                      <Input
                        {...register('visitorEmail')}
                        type="email"
                        placeholder="your@email.com"
                        size="lg"
                        borderRadius="8px"
                      />
                      {errors.visitorEmail && (
                        <Text color="red.500" fontSize="xs" mt={1}>
                          {errors.visitorEmail.message}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={errors.visitorPhone}>
                      <FormLabel fontSize="sm" fontWeight="500">Phone Number</FormLabel>
                      <Input
                        {...register('visitorPhone')}
                        type="tel"
                        placeholder="+63 912 345 6789"
                        size="lg"
                        borderRadius="8px"
                      />
                      {errors.visitorPhone && (
                        <Text color="red.500" fontSize="xs" mt={1}>
                          {errors.visitorPhone.message}
                        </Text>
                      )}
                    </FormControl>
                  </VStack>
                )}

                {/* Step 2: Date & Time Selection */}
                {currentStep === 2 && (
                  <VStack spacing={4} align="stretch">
                    <Heading fontSize="xl" fontWeight="semibold" color="gray.900">
                      Choose Date & Time
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                      Select your preferred visit schedule
                    </Text>

                    <FormControl isInvalid={errors.preferredDate}>
                      <FormLabel fontSize="sm" fontWeight="500">Preferred Date</FormLabel>
                      <Select
                        {...register('preferredDate')}
                        placeholder="Select a date"
                        size="lg"
                        borderRadius="8px"
                        icon={<FiCalendar />}
                      >
                        {availableDates.map((date) => (
                          <option key={date} value={date}>
                            {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </option>
                        ))}
                      </Select>
                      {errors.preferredDate && (
                        <Text color="red.500" fontSize="xs" mt={1}>
                          {errors.preferredDate.message}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={errors.preferredTime}>
                      <FormLabel fontSize="sm" fontWeight="500">Preferred Time</FormLabel>
                      <SimpleGrid columns={2} spacing={3}>
                        {timeSlots.map((time) => (
                          <Box
                            key={time}
                            as="label"
                            cursor="pointer"
                          >
                            <input
                              type="radio"
                              {...register('preferredTime')}
                              value={time}
                              style={{ display: 'none' }}
                            />
                            <Box
                              p={3}
                              borderRadius="8px"
                              border="2px"
                              borderColor={formData.preferredTime === time ? 'primary.600' : 'gray.200'}
                              bg={formData.preferredTime === time ? 'primary.50' : 'white'}
                              textAlign="center"
                              transition="all 0.2s"
                              _hover={{ borderColor: 'primary.400', bg: 'primary.50' }}
                            >
                              <HStack justify="center">
                                <Icon as={FiClock} boxSize={4} color={formData.preferredTime === time ? 'primary.600' : 'gray.600'} />
                                <Text fontSize="sm" fontWeight="medium" color={formData.preferredTime === time ? 'primary.600' : 'gray.700'}>
                                  {time}
                                </Text>
                              </HStack>
                            </Box>
                          </Box>
                        ))}
                      </SimpleGrid>
                      {errors.preferredTime && (
                        <Text color="red.500" fontSize="xs" mt={1}>
                          {errors.preferredTime.message}
                        </Text>
                      )}
                    </FormControl>
                  </VStack>
                )}

                {/* Step 3: Confirmation */}
                {currentStep === 3 && (
                  <VStack spacing={4} align="stretch">
                    <Heading fontSize="xl" fontWeight="semibold" color="gray.900">
                      Visit Details
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                      Add any additional information
                    </Text>

                    <FormControl isInvalid={errors.reason}>
                      <FormLabel fontSize="sm" fontWeight="500">Reason for Visit</FormLabel>
                      <Textarea
                        {...register('reason')}
                        placeholder="e.g., I'm a student looking for accommodation near the university..."
                        rows={4}
                        borderRadius="8px"
                      />
                      {errors.reason && (
                        <Text color="red.500" fontSize="xs" mt={1}>
                          {errors.reason.message}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="500">Additional Notes (Optional)</FormLabel>
                      <Textarea
                        {...register('additionalNotes')}
                        placeholder="Any special requests or questions..."
                        rows={3}
                        borderRadius="8px"
                      />
                    </FormControl>

                    <Divider />

                    {/* Summary */}
                    <Box bg="primary.50" p={4} borderRadius="8px">
                      <VStack align="start" spacing={2}>
                        <Text fontSize="sm" fontWeight="semibold" color="primary.900">
                          Appointment Summary
                        </Text>
                        <HStack>
                          <Icon as={FiUser} boxSize={4} color="primary.600" />
                          <Text fontSize="sm" color="gray.700">{formData.visitorName}</Text>
                        </HStack>
                        <HStack>
                          <Icon as={FiMail} boxSize={4} color="primary.600" />
                          <Text fontSize="sm" color="gray.700">{formData.visitorEmail}</Text>
                        </HStack>
                        <HStack>
                          <Icon as={FiCalendar} boxSize={4} color="primary.600" />
                          <Text fontSize="sm" color="gray.700">
                            {formData.preferredDate && new Date(formData.preferredDate + 'T00:00:00').toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })} at {formData.preferredTime}
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>
                  </VStack>
                )}

                {/* Navigation Buttons */}
                <HStack spacing={3} pt={4}>
                  {currentStep > 1 && (
                    <Button
                      leftIcon={<Icon as={FiArrowLeft} />}
                      variant="outline"
                      size="lg"
                      onClick={handleBack}
                      borderRadius="8px"
                      flex={1}
                    >
                      Back
                    </Button>
                  )}
                  
                  {currentStep < 3 ? (
                    <Button
                      rightIcon={<Icon as={FiArrowRight} />}
                      colorScheme="primary"
                      size="lg"
                      onClick={handleNext}
                      borderRadius="8px"
                      flex={1}
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      colorScheme="primary"
                      size="lg"
                      isLoading={isSubmitting}
                      loadingText="Scheduling..."
                      borderRadius="8px"
                      flex={1}
                      leftIcon={<Icon as={FiCheckCircle} />}
                    >
                      Send Visit Request
                    </Button>
                  )}
                </HStack>
              </VStack>
            </form>
          </Card>

          {/* Property Info Sidebar */}
          {rental && (
            <Card p={6} borderRadius="8px" h="fit-content" position="sticky" top="20px">
              <VStack spacing={4} align="stretch">
                <Heading fontSize="lg" fontWeight="semibold">
                  Property Details
                </Heading>
                
                <Image
                  src={rental.imageUrl[0]}
                  alt={rental.title}
                  borderRadius="8px"
                  objectFit="cover"
                  h="150px"
                  w="full"
                />
                
                <VStack align="start" spacing={2}>
                  <HStack>
                    <Icon as={FiHome} color="primary.600" />
                    <Text fontSize="md" fontWeight="semibold">
                      {rental.title}
                    </Text>
                  </HStack>
                  
                  <HStack>
                    <Icon as={FiMapPin} color="gray.500" boxSize={4} />
                    <Text fontSize="sm" color="gray.600">
                      {rental.address}, {rental.city}
                    </Text>
                  </HStack>
                  
                  <Text fontSize="lg" fontWeight="bold" color="primary.600">
                    {formatPrice(rental.price)}/month
                  </Text>
                </VStack>

                <Divider />

                <VStack align="start" spacing={1}>
                  <Text fontSize="xs" fontWeight="semibold" color="gray.700">
                    Owner Contact
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {rental.ownerName}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {rental.ownerPhone}
                  </Text>
                </VStack>
              </VStack>
            </Card>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default ScheduleVisitPage;
