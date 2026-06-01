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
  useToast,
  Icon,
  Image,
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiHome } from 'react-icons/fi';
import { Button, Card } from '../../shared/components';
import { useAuth, ROLES } from '../../app/providers/AuthProvider';
import GoogleAuthButton from './GoogleAuthButton';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Login Page v2.0 - Enhanced Minimalist Design
 * 
 * Features:
 * - Auto-detects user role from route (/login = tenant, /owner/login = owner)
 * - No radio buttons - cleaner interface
 * - Interactive animations and hover effects
 * - Better visual hierarchy
 * - Responsive design
 * 
 * @component
 */
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Auto-detect user role from route
  const isOwnerLogin = location.pathname.includes('/owner');
  const userRole = isOwnerLogin ? ROLES.OWNER : ROLES.TENANT;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    console.log('Login form submitted:', { email: data.email, role: userRole });
    setIsLoading(true);
    
    try {
      const result = await login(data.email, data.password, userRole);
      console.log('Login result:', result);
      
      if (result.success) {
        toast({
          title: 'Login successful!',
          description: `Welcome back to Dormy`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Small delay to show toast
        setTimeout(() => {
          // Redirect based on role
          if (userRole === ROLES.OWNER) {
            navigate('/owner/dashboard');
          } else {
            navigate('/');
          }
        }, 500);
      } else {
        toast({
          title: 'Login failed',
          description: result.error || 'Invalid credentials',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login error',
        description: error.message || 'An unexpected error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast({
      title: `${provider} Login`,
      description: `${provider} authentication will be implemented with backend`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box 
      bg="gray.50" 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
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
            <Icon as={isOwnerLogin ? FiHome : FiUser} boxSize={8} color="white" />
          </Box>
          <VStack spacing={2}>
            <Heading fontSize="3xl" fontWeight="bold" color="gray.900">
              {isOwnerLogin ? 'Owner Portal' : 'Welcome Back'}
            </Heading>
            <Text fontSize="md" color="gray.600">
              {isOwnerLogin ? 'Manage your properties' : 'Find your perfect home'}
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
            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4}>
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
                  <HStack justify="space-between" mb={2}>
                    <FormLabel fontWeight="500" color="gray.700" fontSize="sm" mb={0}>
                      Password
                    </FormLabel>
                    <Link to="/forgot-password">
                      <Text
                        fontSize="xs"
                        color="primary.600"
                        fontWeight="500"
                        _hover={{ textDecoration: 'underline' }}
                      >
                        Forgot?
                      </Text>
                    </Link>
                  </HStack>
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  w="full"
                  size="lg"
                  colorScheme="primary"
                  isLoading={isLoading}
                  loadingText="Signing in..."
                  mt={2}
                  borderRadius="8px"
                  fontWeight="semibold"
                  leftIcon={<Icon as={FiLock} />}
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  Sign In
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

            {/* Google Sign In */}
            <GoogleAuthButton mode="login" />

            {/* Sign Up Link */}
            <HStack justify="center">
              <Text fontSize="sm" color="gray.600">
                {isOwnerLogin ? "Don't have an account?" : "New to Dormy?"}
              </Text>
              <Link to={isOwnerLogin ? "/owner/signup" : "/signup"}>
                <Text
                  fontSize="sm"
                  color="primary.600"
                  fontWeight="600"
                  _hover={{ textDecoration: 'underline' }}
                >
                  Sign up
                </Text>
              </Link>
            </HStack>

            {/* Switch Account Type */}
            {!isOwnerLogin && (
              <Box textAlign="center" pt={2}>
                <Text fontSize="xs" color="gray.500">
                  Are you a property owner?{' '}
                  <Link to="/owner/login">
                    <Text
                      as="span"
                      color="primary.600"
                      fontWeight="600"
                      _hover={{ textDecoration: 'underline' }}
                    >
                      Login here
                    </Text>
                  </Link>
                </Text>
              </Box>
            )}
            {isOwnerLogin && (
              <Box textAlign="center" pt={2}>
                <Text fontSize="xs" color="gray.500">
                  Looking for a place?{' '}
                  <Link to="/login">
                    <Text
                      as="span"
                      color="primary.600"
                      fontWeight="600"
                      _hover={{ textDecoration: 'underline' }}
                    >
                      Tenant login
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

export default LoginPage;
