import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Icon,
  Box,
  Divider,
  Heading,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiMessageSquare, FiCalendar, FiCreditCard, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '../../../shared/components';

/**
 * Login Prompt Modal v2.0
 * 
 * User-friendly authentication prompt with clear benefits and actions
 * 
 * Features:
 * - Removed lock icon for friendlier appearance
 * - Clear action-oriented text
 * - Emphasis on benefits
 * - Simplified UI
 * 
 * @component
 */
const LoginPromptModal = ({ isOpen, onClose, feature = 'this feature', redirectTo = null }) => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // Store redirect path for after login
    if (redirectTo) {
      sessionStorage.setItem('rentme_redirect_after_login', redirectTo);
    }
    
    // Navigate to login page
    navigate('/login');
    onClose();
  };

  const handleSignup = () => {
    // Store redirect path for after signup
    if (redirectTo) {
      sessionStorage.setItem('rentme_redirect_after_login', redirectTo);
    }
    
    // Navigate to signup page
    navigate('/signup');
    onClose();
  };

  const features = [
    {
      icon: FiHeart,
      title: 'Save your favorites',
      description: 'Never lose track of properties you love',
    },
    {
      icon: FiMessageSquare,
      title: 'Message property owners',
      description: 'Get answers to your questions instantly',
    },
    {
      icon: FiCalendar,
      title: 'Schedule property visits',
      description: 'Book viewings at your convenience',
    },
    {
      icon: FiCreditCard,
      title: 'Book and pay securely',
      description: 'Reserve your perfect home with ease',
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(8px)" />
      <ModalContent borderRadius="16px" mx={4}>
        <ModalHeader pt={8} pb={4}>
          <VStack align="center" spacing={3}>
            <Box
              bg="linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)"
              p={4}
              borderRadius="16px"
            >
              <Text fontSize="3xl">👋</Text>
            </Box>
            <VStack spacing={1}>
              <Heading fontSize="2xl" fontWeight="700" textAlign="center">
                Welcome to RentMe!
              </Heading>
              <Text fontSize="md" fontWeight="normal" color="gray.600" textAlign="center">
                Sign in to {feature}
              </Text>
            </VStack>
          </VStack>
        </ModalHeader>
        <ModalCloseButton borderRadius="8px" top={4} right={4} />

        <ModalBody pb={8} px={8}>
          <VStack spacing={6} align="stretch">
            {/* Google Sign In Button */}
            <Button
              size="lg"
              leftIcon={<Icon as={FcGoogle} boxSize={5} />}
              onClick={handleGoogleLogin}
              borderRadius="12px"
              bg="white"
              border="2px"
              borderColor="gray.300"
              color="gray.700"
              fontWeight="600"
              h="56px"
              _hover={{ 
                bg: 'gray.50', 
                transform: 'translateY(-2px)', 
                boxShadow: 'lg' 
              }}
              transition="all 0.2s"
            >
              Continue with Google
            </Button>

            <HStack spacing={4}>
              <Divider />
              <Text fontSize="xs" color="gray.500" fontWeight="medium" whiteSpace="nowrap">
                OR
              </Text>
              <Divider />
            </HStack>

            {/* Email Sign In */}
            <Button
              size="lg"
              variant="outline"
              onClick={handleGoogleLogin}
              borderRadius="12px"
              fontWeight="600"
              h="56px"
              borderWidth="2px"
              rightIcon={<Icon as={FiArrowRight} />}
            >
              Sign in with Email
            </Button>

            {/* Benefits Section */}
            <Box bg="gray.50" p={5} borderRadius="12px" mt={2}>
              <Text fontSize="sm" fontWeight="600" color="gray.900" mb={3}>
                ✨ What you'll unlock:
              </Text>
              <VStack spacing={3} align="stretch">
                {features.map((item, index) => (
                  <HStack key={index} spacing={3} align="start">
                    <Box
                      bg="white"
                      p={2}
                      borderRadius="8px"
                      flexShrink={0}
                      boxShadow="sm"
                    >
                      <Icon as={item.icon} boxSize={4} color="primary.500" />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="600" color="gray.900">
                        {item.title}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {item.description}
                      </Text>
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            </Box>

            {/* Sign Up Link */}
            <Box textAlign="center" pt={2}>
              <Text fontSize="sm" color="gray.600">
                New here?{' '}
                <Text
                  as="span"
                  color="primary.600"
                  fontWeight="700"
                  cursor="pointer"
                  _hover={{ textDecoration: 'underline' }}
                  onClick={handleSignup}
                >
                  Create a free account
                </Text>
              </Text>
            </Box>

            {/* Continue as Guest */}
            <Box textAlign="center">
              <Text
                fontSize="xs"
                color="gray.500"
                cursor="pointer"
                _hover={{ color: 'gray.700' }}
                onClick={onClose}
              >
                I'll do this later
              </Text>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoginPromptModal;
