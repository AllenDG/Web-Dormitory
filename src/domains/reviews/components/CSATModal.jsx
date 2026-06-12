import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Textarea,
  Icon,
  Box,
  useToast,
} from '@chakra-ui/react';
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import Swal from 'sweetalert2';
import useReviewStore from '../../../shared/stores/useReviewStore';
import { useAuth } from '../../../app/providers/AuthProvider';

/**
 * CSAT (Customer Satisfaction) Modal
 * Simple satisfaction rating with like/unlike and optional comment
 * Supports both authenticated and guest users
 * 
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close modal handler
 * @param {string} props.propertyId - Property ID to rate
 * @param {string} props.propertyTitle - Property title for display
 */
const CSATModal = ({ isOpen, onClose, propertyId, propertyTitle }) => {
  const toast = useToast();
  const { user } = useAuth();
  const { addReview } = useReviewStore();
  
  const [rating, setRating] = useState(null); // 'like' or 'dislike'
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal closes
  const handleClose = () => {
    setRating(null);
    setComment('');
    onClose();
  };

  // Submit CSAT feedback
  const handleSubmit = async () => {
    if (!rating) {
      toast({
        title: 'Rating required',
        description: 'Please select whether you like or dislike this property',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert like/dislike to 1-5 star rating
      // Like = 5 stars, Dislike = 1 star
      const starRating = rating === 'like' ? 5 : 1;

      // Generate guest user data if not authenticated
      const guestUser = {
        id: `guest_${Date.now()}`,
        name: 'Anonymous Guest',
        avatar: 'https://ui-avatars.com/api/?name=Guest&background=cbd5e0&color=1a202c',
      };

      const reviewer = user || guestUser;

      // Create review object - FIXED: use overallRating instead of rating
      const reviewData = {
        propertyId,
        userId: reviewer.id,
        userName: reviewer.name,
        userAvatar: reviewer.avatar || 'https://ui-avatars.com/api/?name=User&background=cbd5e0&color=1a202c',
        overallRating: starRating, // FIXED: Changed from 'rating' to 'overallRating'
        comment: comment.trim() || (rating === 'like' ? 'I like this property' : 'I dislike this property'),
        // Optional: Add satisfaction type for tracking
        satisfactionType: rating,
        isGuest: !user, // Track if this is a guest review
      };

      // Add review to store
      addReview(reviewData);

      // Close modal first, then show SweetAlert2
      handleClose();
      
      // Small delay to ensure modal is fully closed
      setTimeout(async () => {
        // Show SweetAlert2 confirmation
        await Swal.fire({
          title: 'Thank You! 🎉',
          html: `
            <p>Your rating has been submitted successfully!</p>
            <p style="font-size: 14px; color: #666; margin-top: 10px;">
              We appreciate your feedback about <strong>${propertyTitle}</strong>
            </p>
            ${!user ? '<p style="font-size: 12px; color: #999; margin-top: 8px;"><em>Sign in to manage your reviews</em></p>' : ''}
          `,
          icon: 'success',
          confirmButtonText: 'Great!',
          confirmButtonColor: '#1e88e5',
          timer: 3000,
          timerProgressBar: true,
        });
      }, 100);

    } catch (error) {
      console.error('Failed to submit CSAT:', error);
      
      // Close modal first
      handleClose();
      
      // Small delay before showing error
      setTimeout(async () => {
        // Show error with SweetAlert2
        await Swal.fire({
          title: 'Oops!',
          text: 'Failed to submit your rating. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#1e88e5',
        });
      }, 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
      <ModalContent mx={4}>
        <ModalHeader>
          <Text fontSize="xl" fontWeight="bold">
            Rate Your Experience
          </Text>
          <Text fontSize="sm" fontWeight="normal" color="gray.600" mt={1}>
            {propertyTitle}
          </Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Rating Question */}
            <Box>
              <Text fontSize="md" fontWeight="medium" mb={4} textAlign="center">
                How do you feel about this property?
              </Text>

              {/* Like/Dislike Buttons */}
              <HStack spacing={4} justify="center">
                {/* Like Button */}
                <Button
                  size="lg"
                  variant={rating === 'like' ? 'solid' : 'outline'}
                  colorScheme="green"
                  onClick={() => setRating('like')}
                  leftIcon={<Icon as={FiThumbsUp} boxSize={6} />}
                  px={8}
                  py={6}
                  fontSize="md"
                  borderWidth={2}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  Like
                </Button>

                {/* Dislike Button */}
                <Button
                  size="lg"
                  variant={rating === 'dislike' ? 'solid' : 'outline'}
                  colorScheme="red"
                  onClick={() => setRating('dislike')}
                  leftIcon={<Icon as={FiThumbsDown} boxSize={6} />}
                  px={8}
                  py={6}
                  fontSize="md"
                  borderWidth={2}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  Dislike
                </Button>
              </HStack>
            </Box>

            {/* Optional Comment */}
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
                Additional Comments (Optional)
              </Text>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us more about your experience..."
                rows={4}
                resize="none"
                bg="white"
                borderColor="gray.300"
                _hover={{ borderColor: 'gray.400' }}
                _focus={{
                  borderColor: 'primary.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                }}
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                {comment.length}/500 characters
              </Text>
              {comment.length > 500 && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  Maximum 500 characters exceeded
                </Text>
              )}
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={handleClose} isDisabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              colorScheme="primary"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText="Submitting..."
              isDisabled={!rating || comment.length > 500}
            >
              Submit Feedback
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CSATModal;
