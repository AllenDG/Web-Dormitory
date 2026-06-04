import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Textarea,
  Button,
  Icon,
  SimpleGrid,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import PropTypes from 'prop-types';
import useReviewStore, { REVIEW_CATEGORIES } from '../../../shared/stores/useReviewStore';
import { useAuth } from '../../../app/providers/AuthProvider';

/**
 * Review Form Component
 * Form for submitting property reviews with ratings
 * 
 * @component
 * @param {Object} props
 * @param {string} props.propertyId - Property ID
 * @param {string} props.propertyTitle - Property title
 * @param {Function} props.onSuccess - Callback after successful submission
 * @param {Function} props.onCancel - Callback for cancel action
 */
const ReviewForm = ({ propertyId, propertyTitle, onSuccess, onCancel }) => {
  const toast = useToast();
  const { user } = useAuth();
  const { addReview } = useReviewStore();

  const [overallRating, setOverallRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState({
    [REVIEW_CATEGORIES.CLEANLINESS]: 0,
    [REVIEW_CATEGORIES.ACCURACY]: 0,
    [REVIEW_CATEGORIES.COMMUNICATION]: 0,
    [REVIEW_CATEGORIES.LOCATION]: 0,
    [REVIEW_CATEGORIES.VALUE]: 0,
    [REVIEW_CATEGORIES.AMENITIES]: 0,
  });
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryLabels = {
    [REVIEW_CATEGORIES.CLEANLINESS]: 'Cleanliness',
    [REVIEW_CATEGORIES.ACCURACY]: 'Accuracy',
    [REVIEW_CATEGORIES.COMMUNICATION]: 'Communication',
    [REVIEW_CATEGORIES.LOCATION]: 'Location',
    [REVIEW_CATEGORIES.VALUE]: 'Value for Money',
    [REVIEW_CATEGORIES.AMENITIES]: 'Amenities',
  };

  const handleCategoryRating = (category, rating) => {
    setCategoryRatings((prev) => ({
      ...prev,
      [category]: rating,
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (overallRating === 0) {
      toast({
        title: 'Please provide an overall rating',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    if (reviewText.trim().length < 20) {
      toast({
        title: 'Please write at least 20 characters',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create review
      const review = addReview({
        propertyId,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar || null,
        overallRating,
        categoryRatings,
        reviewText: reviewText.trim(),
        isVerifiedTenant: true, // Mock - should check if user actually stayed
      });

      toast({
        title: 'Review submitted successfully!',
        description: 'Thank you for your feedback.',
        status: 'success',
        duration: 3000,
      });

      // Reset form
      setOverallRating(0);
      setCategoryRatings({
        [REVIEW_CATEGORIES.CLEANLINESS]: 0,
        [REVIEW_CATEGORIES.ACCURACY]: 0,
        [REVIEW_CATEGORIES.COMMUNICATION]: 0,
        [REVIEW_CATEGORIES.LOCATION]: 0,
        [REVIEW_CATEGORIES.VALUE]: 0,
        [REVIEW_CATEGORIES.AMENITIES]: 0,
      });
      setReviewText('');

      if (onSuccess) {
        onSuccess(review);
      }
    } catch (error) {
      toast({
        title: 'Failed to submit review',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange, size = 32 }) => (
    <HStack spacing={1}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          as={star <= (hoveredRating || value) ? FaStar : FaRegStar}
          boxSize={`${size}px`}
          color={star <= (hoveredRating || value) ? 'yellow.400' : 'gray.300'}
          cursor="pointer"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
          transition="all 0.2s"
          _hover={{ transform: 'scale(1.1)' }}
        />
      ))}
    </HStack>
  );

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="md" mb={2}>
            Write a Review
          </Heading>
          <Text color="gray.600" fontSize="sm">
            Share your experience at {propertyTitle}
          </Text>
        </Box>

        {/* Overall Rating */}
        <FormControl isRequired>
          <FormLabel fontWeight="semibold">Overall Rating</FormLabel>
          <HStack spacing={4}>
            <StarRating value={overallRating} onChange={setOverallRating} />
            {overallRating > 0 && (
              <Text fontSize="lg" fontWeight="semibold" color="blue.500">
                {overallRating} / 5
              </Text>
            )}
          </HStack>
        </FormControl>

        {/* Category Ratings */}
        <Box>
          <FormLabel fontWeight="semibold" mb={3}>
            Rate by Category
          </FormLabel>
          <SimpleGrid columns={[1, 2]} spacing={4}>
            {Object.entries(categoryLabels).map(([category, label]) => (
              <Box key={category}>
                <Text fontSize="sm" mb={2}>
                  {label}
                </Text>
                <StarRating
                  value={categoryRatings[category]}
                  onChange={(rating) => handleCategoryRating(category, rating)}
                  size={24}
                />
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Review Text */}
        <FormControl isRequired>
          <FormLabel fontWeight="semibold">Your Review</FormLabel>
          <Textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience... What did you like? What could be improved?"
            rows={6}
            resize="vertical"
          />
          <Text fontSize="xs" color="gray.500" mt={1}>
            Minimum 20 characters ({reviewText.length}/20)
          </Text>
        </FormControl>

        {/* Actions */}
        <HStack justify="flex-end" spacing={3}>
          {onCancel && (
            <Button variant="ghost" onClick={onCancel} isDisabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Submitting..."
          >
            Submit Review
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

ReviewForm.propTypes = {
  propertyId: PropTypes.string.isRequired,
  propertyTitle: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

export default ReviewForm;
