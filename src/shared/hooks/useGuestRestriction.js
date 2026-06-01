import { useDisclosure } from '@chakra-ui/react';
import { useAuth } from '../../app/providers/AuthProvider';

/**
 * Custom hook for handling guest restrictions
 * 
 * Provides a simple way to check if user is authenticated
 * and show login prompt if they're a guest
 * 
 * @param {string} feature - Name of the feature being accessed
 * @param {string} redirectTo - Path to redirect after login
 * @returns {Object} - { checkAuth, isOpen, onClose, feature, redirectTo }
 * 
 * @example
 * const { checkAuth, ...modalProps } = useGuestRestriction('save favorites', '/favorites');
 * 
 * const handleSaveFavorite = () => {
 *   if (!checkAuth()) return;
 *   // Proceed with save favorite logic
 * };
 * 
 * <LoginPromptModal {...modalProps} />
 */
const useGuestRestriction = (feature = 'this feature', redirectTo = null) => {
  const { isAuthenticated } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  /**
   * Check if user is authenticated
   * If not, show login prompt
   * 
   * @returns {boolean} - true if authenticated, false if guest
   */
  const checkAuth = () => {
    if (!isAuthenticated) {
      onOpen();
      return false;
    }
    return true;
  };

  /**
   * Wrapper for actions that require authentication
   * 
   * @param {Function} callback - Function to execute if authenticated
   * @returns {Function} - Wrapped function
   */
  const requireAuth = (callback) => {
    return (...args) => {
      if (checkAuth()) {
        return callback(...args);
      }
    };
  };

  return {
    checkAuth,
    requireAuth,
    isOpen,
    onOpen,
    onClose,
    feature,
    redirectTo,
    isAuthenticated,
  };
};

export default useGuestRestriction;
