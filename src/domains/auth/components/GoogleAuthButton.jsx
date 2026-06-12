import { Button, Icon, useToast } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';

/**
 * Google OAuth Button Component
 * 
 * Handles Google OAuth authentication flow
 * Currently uses mock authentication, ready for backend integration
 * 
 * Backend Integration Points:
 * 1. Replace handleGoogleLogin with actual OAuth flow
 * 2. Add Google OAuth SDK
 * 3. Configure OAuth credentials
 * 4. Handle token exchange with backend
 * 
 * @component
 */
const GoogleAuthButton = ({ 
  mode = 'login', // 'login' or 'signup'
  size = 'lg',
  fullWidth = true,
  onSuccess = null,
  redirectTo = null,
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { login, signup } = useAuth();

  /**
   * Handle Google OAuth Login
   * 
   * TODO: Replace with actual Google OAuth flow
   * 
   * Real Implementation Steps:
   * 1. Initialize Google OAuth SDK
   * 2. Trigger Google sign-in popup
   * 3. Get authorization code
   * 4. Send code to backend
   * 5. Backend exchanges code for tokens
   * 6. Backend returns user data + JWT
   * 7. Store JWT and user data
   * 8. Redirect to intended page
   */
  const handleGoogleLogin = async () => {
    try {
      // Mock Google OAuth flow
      // In production, this will be replaced with:
      // const googleUser = await googleAuth.signIn();
      // const response = await api.post('/auth/google', { token: googleUser.credential });
      
      const mockGoogleUser = {
        email: 'user@gmail.com',
        name: 'Google User',
        avatar: 'https://via.placeholder.com/150',
        googleId: 'google_' + Date.now(),
      };

      let result;
      if (mode === 'signup') {
        result = await signup({
          ...mockGoogleUser,
          role: 'tenant',
          authProvider: 'google',
        });
      } else {
        result = await login(mockGoogleUser.email, 'google_auth', 'tenant');
      }

      if (result.success) {
        toast({
          title: mode === 'signup' ? 'Account Created!' : 'Welcome Back!',
          description: `Signed in with Google as ${mockGoogleUser.name}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Handle redirect
        const redirect = redirectTo || sessionStorage.getItem('rentme_redirect_after_login');
        sessionStorage.removeItem('rentme_redirect_after_login');

        if (onSuccess) {
          onSuccess(result.user);
        } else if (redirect) {
          navigate(redirect);
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Google auth error:', error);
      toast({
        title: 'Authentication Failed',
        description: error.message || 'Unable to sign in with Google',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Button
      size={size}
      w={fullWidth ? 'full' : 'auto'}
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
        boxShadow: 'md',
        borderColor: 'gray.400',
      }}
      _active={{
        transform: 'translateY(0)',
        boxShadow: 'sm',
      }}
      transition="all 0.2s"
    >
      {mode === 'signup' ? 'Sign up with Google' : 'Continue with Google'}
    </Button>
  );
};

export default GoogleAuthButton;
