import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
  Icon,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiEye, FiEyeOff, FiMail, FiMapPin, FiShield, FiTrendingUp } from 'react-icons/fi';
import { Button } from '../../../shared/components';
import { useAuth, ROLES } from '../../../app/providers/AuthProvider';
import GoogleAuthButton from '../components/GoogleAuthButton';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Login Page v3.0 - Split Screen Design
 * 
 * Features:
 * - Split screen layout (onboarding left, form right)
 * - Google Sign In prominent
 * - Email/password secondary option
 * - Modern gradient background
 * - Auto-detects user role from route
 * 
 * @component
 */
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Auto-detect user role from route
  const isOwnerLogin = location.pathname.includes('/owner');
  const userRole = isOwnerLogin ? ROLES.OWNER : ROLES.TENANT;

  // Carousel slides content
  const slides = isOwnerLogin ? [
    {
      title: 'List Your Properties',
      subtitle: 'Reach thousands of potential tenants looking for their perfect home',
      icon: FiTrendingUp,
      features: ['Zero listing fees', 'Unlimited property listings', 'Advanced analytics dashboard']
    },
    {
      title: 'Manage with Ease',
      subtitle: 'Track bookings, payments, and tenant communications all in one place',
      icon: FiShield,
      features: ['Real-time notifications', 'Secure payment processing', 'Digital contract management']
    },
    {
      title: 'Grow Your Business',
      subtitle: 'Join thousands of successful property owners across the Philippines',
      icon: FiMapPin,
      features: ['Verified tenant profiles', 'Flexible pricing tools', '24/7 customer support']
    }
  ] : [
    {
      title: 'Find Your Perfect Home',
      subtitle: 'Browse thousands of verified rental properties across the Philippines',
      icon: FiMapPin,
      features: ['Advanced search filters', 'Virtual property tours', 'Instant booking available']
    },
    {
      title: 'Safe & Secure',
      subtitle: 'All properties are verified and owners are screened for your safety',
      icon: FiShield,
      features: ['Verified property listings', 'Secure payment gateway', 'Tenant protection policy']
    },
    {
      title: 'Move In Hassle-Free',
      subtitle: 'Digital contracts, online payments, and seamless communication',
      icon: FiTrendingUp,
      features: ['E-signature contracts', 'Flexible payment options', 'Direct owner messaging']
    }
  ];

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

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
          description: `Welcome back to RentMe`,
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

  const currentSlideData = slides[currentSlide];

  return (
    <Box minH="100vh" display="flex">
      {/* Left Side - Onboarding Carousel */}
      <Box
        display={{ base: 'none', lg: 'flex' }}
        flex="1"
        bg="linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)"
        position="relative"
        overflow="hidden"
        alignItems="center"
        justifyContent="center"
      >
        {/* House Pattern Background */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity="0.08"
          backgroundImage={`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M30 5l10 10v15H20V15l10-10zm0 3.5L23 15v12h14V15l-7-6.5z'/%3E%3C/g%3E%3C/svg%3E")`}
          backgroundSize="60px 60px"
          backgroundRepeat="repeat"
        />
        
        {/* Decorative Gradient Orbs */}
        <Box
          position="absolute"
          top="-10%"
          left="-5%"
          w="400px"
          h="400px"
          bg="whiteAlpha.200"
          borderRadius="full"
          filter="blur(80px)"
        />
        <Box
          position="absolute"
          bottom="-10%"
          right="-5%"
          w="500px"
          h="500px"
          bg="whiteAlpha.100"
          borderRadius="full"
          filter="blur(100px)"
        />

        {/* Carousel Content */}
        <VStack spacing={10} zIndex={1} px={12} maxW="600px" position="relative">
          {/* Animated Slide Content */}
          <VStack
            spacing={6}
            textAlign="center"
            key={currentSlide}
            animation="fadeIn 0.6s ease-in-out"
            sx={{
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(20px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
              }
            }}
          >
            {/* Icon */}
            <Box
              bg="whiteAlpha.200"
              backdropFilter="blur(10px)"
              p={5}
              borderRadius="24px"
              border="2px solid"
              borderColor="whiteAlpha.300"
            >
              <Icon as={currentSlideData.icon} boxSize={16} color="white" />
            </Box>
            
            {/* Title */}
            <Heading fontSize="5xl" fontWeight="800" color="white" letterSpacing="-0.02em">
              {currentSlideData.title}
            </Heading>
            
            {/* Subtitle */}
            <Text fontSize="xl" color="whiteAlpha.900" fontWeight="500" maxW="500px" lineHeight="tall">
              {currentSlideData.subtitle}
            </Text>
          </VStack>

          {/* Features List */}
          <VStack spacing={4} align="stretch" pt={4} w="full" maxW="500px">
            {currentSlideData.features.map((feature, index) => (
              <HStack
                key={index}
                spacing={3}
                bg="whiteAlpha.100"
                backdropFilter="blur(10px)"
                px={5}
                py={3}
                borderRadius="16px"
                border="1px solid"
                borderColor="whiteAlpha.200"
                animation={`slideIn 0.5s ease-out ${index * 0.1}s backwards`}
                sx={{
                  '@keyframes slideIn': {
                    from: { opacity: 0, transform: 'translateX(-20px)' },
                    to: { opacity: 1, transform: 'translateX(0)' }
                  }
                }}
              >
                <Box
                  w="8px"
                  h="8px"
                  bg="white"
                  borderRadius="full"
                  flexShrink={0}
                />
                <Text color="white" fontSize="lg" fontWeight="500">
                  {feature}
                </Text>
              </HStack>
            ))}
          </VStack>

          {/* Pagination Dots */}
          <HStack spacing={3} pt={6}>
            {slides.map((_, index) => (
              <Box
                key={index}
                w={currentSlide === index ? '32px' : '12px'}
                h="12px"
                bg={currentSlide === index ? 'white' : 'whiteAlpha.400'}
                borderRadius="full"
                cursor="pointer"
                transition="all 0.3s ease"
                onClick={() => setCurrentSlide(index)}
                _hover={{ bg: 'white', transform: 'scale(1.1)' }}
              />
            ))}
          </HStack>
        </VStack>
      </Box>

      {/* Right Side - Form */}
      <Box
        flex={{ base: '1', lg: '0 0 500px' }}
        bg="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={{ base: 6, md: 12 }}
      >
        <VStack spacing={8} w="full" maxW="400px">
          {/* Header */}
          <VStack spacing={3} w="full">
            <Heading fontSize="3xl" fontWeight="700" color="gray.900">
              Sign In
            </Heading>
            <Text fontSize="md" color="gray.600" textAlign="center">
              To keep connected with us please login with your personal information
            </Text>
          </VStack>

          {/* Google Sign In Button */}
          <GoogleAuthButton mode="login" />

          {/* Divider */}
          <HStack w="full" spacing={4}>
            <Box flex={1} h="1px" bg="gray.200" />
            <Text fontSize="sm" color="gray.500" fontWeight="600">
              OR
            </Text>
            <Box flex={1} h="1px" bg="gray.200" />
          </HStack>

          {/* Email/Password Toggle */}
          {!showEmailForm ? (
            <Button
              w="full"
              size="lg"
              variant="outline"
              borderColor="gray.300"
              color="gray.700"
              fontWeight="600"
              h="54px"
              borderRadius="12px"
              leftIcon={<Icon as={FiMail} />}
              onClick={() => setShowEmailForm(true)}
              _hover={{ bg: 'gray.50', borderColor: 'gray.400' }}
            >
              Sign in with Email
            </Button>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
              <VStack spacing={4} w="full">
                <FormControl isInvalid={errors.email}>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="Email"
                    size="lg"
                    borderRadius="12px"
                    bg="gray.50"
                    border="1px"
                    borderColor="gray.300"
                    h="54px"
                    _hover={{ borderColor: 'gray.400' }}
                    _focus={{ 
                      borderColor: 'primary.500', 
                      boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                      bg: 'white'
                    }}
                  />
                  {errors.email && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.email.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={errors.password}>
                  <InputGroup size="lg">
                    <Input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      borderRadius="12px"
                      bg="gray.50"
                      border="1px"
                      borderColor="gray.300"
                      h="54px"
                      _hover={{ borderColor: 'gray.400' }}
                      _focus={{ 
                        borderColor: 'primary.500', 
                        boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                        bg: 'white'
                      }}
                    />
                    <InputRightElement h="54px">
                      <IconButton
                        size="sm"
                        variant="ghost"
                        icon={<Icon as={showPassword ? FiEyeOff : FiEye} />}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      />
                    </InputRightElement>
                  </InputGroup>
                  {errors.password && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.password.message}
                    </Text>
                  )}
                </FormControl>

                <HStack w="full" justify="space-between">
                  <Text fontSize="sm" color="gray.600" />
                  <Link to="/forgot-password">
                    <Text
                      fontSize="sm"
                      color="primary.600"
                      fontWeight="600"
                      _hover={{ textDecoration: 'underline' }}
                    >
                      Forgot Password?
                    </Text>
                  </Link>
                </HStack>

                <Button
                  type="submit"
                  w="full"
                  size="lg"
                  colorScheme="primary"
                  isLoading={isLoading}
                  loadingText="Signing in..."
                  h="54px"
                  borderRadius="12px"
                  fontWeight="700"
                  fontSize="md"
                  bg="primary.600"
                  _hover={{ bg: 'primary.700' }}
                >
                  Sign In
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmailForm(false)}
                  color="gray.600"
                >
                  Use another method
                </Button>
              </VStack>
            </form>
          )}

          {/* Sign Up Link */}
          <HStack pt={4}>
            <Text fontSize="sm" color="gray.600">
              {isOwnerLogin ? "Don't have an account?" : "New to RentMe?"}
            </Text>
            <Link to={isOwnerLogin ? "/owner/signup" : "/signup"}>
              <Text
                fontSize="sm"
                color="primary.600"
                fontWeight="700"
                _hover={{ textDecoration: 'underline' }}
              >
                Create Account
              </Text>
            </Link>
          </HStack>

          {/* Switch Account Type */}
          <Box textAlign="center">
            <Text fontSize="sm" color="gray.500">
              {isOwnerLogin ? 'Looking for a place?' : 'Are you a property owner?'}{' '}
              <Link to={isOwnerLogin ? "/login" : "/owner/login"}>
                <Text
                  as="span"
                  color="primary.600"
                  fontWeight="700"
                  _hover={{ textDecoration: 'underline' }}
                >
                  {isOwnerLogin ? 'Tenant login' : 'Owner login'}
                </Text>
              </Link>
            </Text>
          </Box>

          {/* Footer Links */}
          <HStack spacing={6} fontSize="xs" color="gray.500" pt={4}>
            <Text cursor="pointer" _hover={{ color: 'gray.700' }}>Help</Text>
            <Text cursor="pointer" _hover={{ color: 'gray.700' }}>Privacy Policy</Text>
            <Text cursor="pointer" _hover={{ color: 'gray.700' }}>Terms & Conditions</Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default LoginPage;
