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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiHeart, FiMessageSquare, FiCalendar, FiCreditCard } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '../../../shared/components';

/**
 * Login Prompt Modal
 * 
 * Shown to guests when they try to access restricted features
 * 
 * Features:
 * - Clear explanation of why login is needed
 * - Google OAuth button
 * - List of features requiring authentication
 * - Option to continue as guest
 * 
 * @component
 */
const LoginPromptModal = ({ isOpen, onClose, feature = 'this feature', redirectTo = null }) => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // Store redirect path for after login
    if (redirectTo) {
      sessionStorage.setItem('dormy_redirect_after_login', redirectTo);
    }
    
    // Navigate to login page
    navigate('/login');
    onClose();
  };

  const handleSignup = () => {
    // Store redirect path for after signup
    if (redirectTo) {
      sessionStorage.setItem('dormy_redirect_after_login', redirectTo);
    }
    
    // Navigate to signup page
    navigate('/signup');
    onClose();
  };

  const features = [
    {
      icon: FiHeart,
      title: 'Save Favorites',
      description: 'Keep track of properties you love',
    },
    {
      icon: FiMessageSquare,
      title: 'Chat with Owners',
      description: 'Ask questions and get instant responses',
    },
    {
      icon: FiCalendar,
      title: 'Schedule Visits',
      description: 'Book property viewings at your convenience',
    },
    {
      icon: FiCreditCard,
      title: 'Book Properties',
      description: 'Secure your rental with easy booking',
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="8px" mx={4}>
        <ModalHeader>
          <HStack spacing={3}>
            <Box bg="primary.100" p={2} borderRadius="8px">
              <Icon as={FiLock} boxSize={5} color="primary.600" />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="lg" fontWeight="semibold">
                Sign In Required
              </Text>
              <Text fontSize="sm" fontWeight="normal" color="gray.600">
                To use {feature}
              </Text>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton borderRadius="8px" />

        <ModalBody pb={6}>
          <VStack spacing={5} align="stretch">
            {/* Google Sign In Button */}
            <Button
              size="lg"
              leftIcon={<Icon as={FcGoogle} boxSize={5} />}
              onClick={handleGoogleLogin}
              borderRadius="8px"
              bg="white"
              border="2px"
              borderColor="gray.300"
              color="gray.700"
              fontWeight="semibold"
              _hover={{ 
                bg: 'gray.50', 
                transform: 'translateY(-2px)', 
                boxShadow: 'md' 
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
              borderRadius="8px"
              fontWeight="semibold"
            >
              Sign In with Email
            </Button>

            <Divider />

            {/* Features List */}
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={3}>
                What you can do with an account:
              </Text>
              <VStack spacing={3} align="stretch">
                {features.map((item, index) => (
                  <HStack key={index} spacing={3}>
                    <Box
                      bg="primary.50"
                      p={2}
                      borderRadius="8px"
                      flexShrink={0}
                    >
                      <Icon as={item.icon} boxSize={4} color="primary.600" />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="medium" color="gray.900">
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

            <Divider />

            {/* Sign Up Link */}
            <Box textAlign="center">
              <Text fontSize="sm" color="gray.600">
                Don't have an account?{' '}
                <Text
                  as="span"
                  color="primary.600"
                  fontWeight="600"
                  cursor="pointer"
                  _hover={{ textDecoration: 'underline' }}
                  onClick={handleSignup}
                >
                  Sign up free
                </Text>
              </Text>
            </Box>

            {/* Continue as Guest */}
            <Box textAlign="center" pt={2}>
              <Text
                fontSize="xs"
                color="gray.500"
                cursor="pointer"
                _hover={{ color: 'gray.700', textDecoration: 'underline' }}
                onClick={onClose}
              >
                Continue browsing as guest
              </Text>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoginPromptModal;
