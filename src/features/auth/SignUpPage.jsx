import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Checkbox,
  useToast,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiEye, FiEyeOff, FiMail, FiUser, FiLock, FiHome, FiUserPlus } from 'react-icons/fi';
import { Button, Card } from '../../shared/components';
import { useAuth, ROLES } from '../../app/providers/AuthProvider';
import GoogleAuthButton from './GoogleAuthButton';

// Validation schema
const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

/**
 * Sign Up Page v2.0 - Enhanced Minimalist Design
 * 
 * Features:
 * - Auto-detects user role from route (/signup = tenant, /owner/signup = owner)
 * - No radio buttons - cleaner interface
 * - Interactive animations and hover effects
 * - Better visual hierarchy
 * - Responsive design
 * 
 * @component
 */
const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { signup } = useAuth();

  // Auto-detect user role from route
  const isOwnerSignup = location.pathname.includes('/owner');
  const userRole = isOwnerSignup ? ROLES.OWNER : ROLES.TENANT;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      const result = await signup({
        name: data.fullName,
        email: data.email,
        password: data.password,
        role: userRole,
      });
      
      if (result.success) {
        toast({
          title: 'Account created!',
          description: 'Welcome to Dormy',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        setTimeout(() => {
          if (userRole === ROLES.OWNER) {
            navigate('/owner/dashboard');
          } else {
            navigate('/');
          }
        }, 500);
      } else {
        toast({
          title: 'Sign up failed',
          description: result.error || 'Unable to create account',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Sign up error',
        description: error.message || 'An unexpected error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      bg="gray.50" 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      py={8}
      position="relative"
      overflow="hidden"
    >
      {/* Background Decoration */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        w="400px"
        h="400px"
        bg="primary.50"
        borderRadius="full"
        opacity="0.3"
        filter="blur(80px)"
      />
      <Box
        position="absolute"
        bottom="-10%"
        left="-5%"
        w="400px"
        h="400px"
        bg="primary.100"
        borderRadius="full"
        opacity="0.2"
        filter="blur(80px)"
      />

      <Box w="full" maxW="440px" px={4} position="relative" zIndex={1}>
        {/* Logo/Brand */}
        <VStack spacing={6} mb={6}>
          <Box
            bg="primary.600"
            p={4}
            borderRadius="8px"
            boxShadow="lg"
            transition="all 0.3s"
            _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
          >
            <Icon as={isOwnerSignup ? FiHome : FiUserPlus} boxSize={8} color="white" />
          </Box>
          <VStack spacing={2}>
            <Heading fontSize="3xl" fontWeight="bold" color="gray.900">
              {isOwnerSignup ? 'List Your Property' : 'Join Dormy'}
            </Heading>
            <Text fontSize="md" color="gray.600">
              {isOwnerSignup ? 'Start earning from your property' : 'Find your perfect student home'}
            </Text>
          </VStack>
        </VStack>

        <Card 
          p={8} 
          borderRadius="8px" 
          boxShadow="xl"
          border="1px"
          borderColor="gray.200"
          bg="white"
        >
          <VStack spacing={6} align="stretch">
            {/* Sign Up Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                <FormControl isInvalid={errors.fullName}>
                  <FormLabel fontWeight="500" color="gray.700" fontSize="sm">
                    Full Name
                  </FormLabel>
                  <InputGroup size="lg">
                    <Input
                      {...register('fullName')}
                      type="text"
                      placeholder="Juan Dela Cruz"
                      borderRadius="8px"
                      bg="gray.50"
                      border="1px"
                      borderColor="gray.200"
                      _hover={{ borderColor: 'gray.300' }}
                      _focus={{ 
                        borderColor: 'primary.500', 
                        boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                        bg: 'white'
                      }}
                      transition="all 0.2s"
                    />
                    <InputRightElement>
                      <Icon as={FiUser} color="gray.400" boxSize={5} />
                    </InputRightElement>
                  </InputGroup>
                  {errors.fullName && (
                    <Text color="red.500" fontSize="xs" mt={1}>
                      {errors.fullName.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={errors.email}>
                  <FormLabel fontWeight="500" color="gray.700" fontSize="sm">
                    Email Address
                  </FormLabel>
                  <InputGroup size="lg">
                    <Input
                      {...register('email')}
                      type="email"
                      placeholder="your@email.com"
                      borderRadius="8px"
                      bg="gray.50"
                      border="1px"
                      borderColor="gray.200"
                      _hover={{ borderColor: 'gray.300' }}
                      _focus={{ 
                        borderColor: 'primary.500', 
                        boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                        bg: 'white'
                      }}
                      transition="all 0.2s"
                    />
                    <InputRightElement>
                      <Icon as={FiMail} color="gray.400" boxSize={5} />
                    </InputRightElement>
                  </InputGroup>
                  {errors.email && (
                    <Text color="red.500" fontSize="xs" mt={1}>
                      {errors.email.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={errors.password}>
                  <FormLabel fontWeight="500" color="gray.700" fontSize="sm">
                    Password
                  </FormLabel>
                  <InputGroup size="lg">
                    <Input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      borderRadius="8px"
                      bg="gray.50"
                      border="1px"
                      borderColor="gray.200"
                      _hover={{ borderColor: 'gray.300' }}
                      _focus={{ 
                        borderColor: 'primary.500', 
                        boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                        bg: 'white'
                      }}
                      transition="all 0.2s"
                    />
                    <InputRightElement>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        icon={<Icon as={showPassword ? FiEyeOff : FiEye} boxSize={5} />}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        _hover={{ bg: 'gray.100' }}
                      />
                    </InputRightElement>
                  </InputGroup>
                  {errors.password && (
                    <Text color="red.500" fontSize="xs" mt={1}>
                      {errors.password.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={errors.confirmPassword}>
                  <FormLabel fontWeight="500" color="gray.700" fontSize="sm">
                    Confirm Password
                  </FormLabel>
                  <InputGroup size="lg">
                    <Input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      borderRadius="8px"
                      bg="gray.50"
                      border="1px"
                      borderColor="gray.200"
                      _hover={{ borderColor: 'gray.300' }}
                      _focus={{ 
                        borderColor: 'primary.500', 
                        boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                        bg: 'white'
                      }}
                      transition="all 0.2s"
                    />
                    <InputRightElement>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        icon={<Icon as={showConfirmPassword ? FiEyeOff : FiEye} boxSize={5} />}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        _hover={{ bg: 'gray.100' }}
                      />
                    </InputRightElement>
                  </InputGroup>
                  {errors.confirmPassword && (
                    <Text color="red.500" fontSize="xs" mt={1}>
                      {errors.confirmPassword.message}
                    </Text>
                  )}
                </FormControl>

                {/* Terms Checkbox */}
                <FormControl isInvalid={errors.agreeToTerms}>
                  <Checkbox
                    {...register('agreeToTerms')}
                    colorScheme="primary"
                    size="sm"
                  >
                    <Text fontSize="xs" color="gray.600">
                      I agree to the{' '}
                      <Text as="span" color="primary.600" fontWeight="600">
                        Terms of Service
                      </Text>
                      {' '}and{' '}
                      <Text as="span" color="primary.600" fontWeight="600">
                        Privacy Policy
                      </Text>
                    </Text>
                  </Checkbox>
                  {errors.agreeToTerms && (
                    <Text color="red.500" fontSize="xs" mt={1}>
                      {errors.agreeToTerms.message}
                    </Text>
                  )}
                </FormControl>

                {/* Submit Button */}
                <Button
                  type="submit"
                  w="full"
                  size="lg"
                  colorScheme="primary"
                  isLoading={isLoading}
                  loadingText="Creating account..."
                  mt={2}
                  borderRadius="8px"
                  fontWeight="semibold"
                  leftIcon={<Icon as={FiUserPlus} />}
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  Create Account
                </Button>
              </VStack>
            </form>

            {/* Divider */}
            <HStack spacing={4}>
              <Box flex={1} h="1px" bg="gray.200" />
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                OR
              </Text>
              <Box flex={1} h="1px" bg="gray.200" />
            </HStack>

            {/* Google Sign Up */}
            <GoogleAuthButton mode="signup" />

            {/* Login Link */}
            <HStack justify="center">
              <Text fontSize="sm" color="gray.600">
                Already have an account?
              </Text>
              <Link to={isOwnerSignup ? "/owner/login" : "/login"}>
                <Text
                  fontSize="sm"
                  color="primary.600"
                  fontWeight="600"
                  _hover={{ textDecoration: 'underline' }}
                >
                  Sign in
                </Text>
              </Link>
            </HStack>

            {/* Switch Account Type */}
            {!isOwnerSignup && (
              <Box textAlign="center" pt={2}>
                <Text fontSize="xs" color="gray.500">
                  Want to list your property?{' '}
                  <Link to="/owner/signup">
                    <Text
                      as="span"
                      color="primary.600"
                      fontWeight="600"
                      _hover={{ textDecoration: 'underline' }}
                    >
                      Sign up as owner
                    </Text>
                  </Link>
                </Text>
              </Box>
            )}
            {isOwnerSignup && (
              <Box textAlign="center" pt={2}>
                <Text fontSize="xs" color="gray.500">
                  Looking for a place?{' '}
                  <Link to="/signup">
                    <Text
                      as="span"
                      color="primary.600"
                      fontWeight="600"
                      _hover={{ textDecoration: 'underline' }}
                    >
                      Sign up as tenant
                    </Text>
                  </Link>
                </Text>
              </Box>
            )}
          </VStack>
        </Card>
      </Box>
    </Box>
  );
};

export default SignUpPage;
