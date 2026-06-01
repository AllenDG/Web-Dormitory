import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Select,
  Divider,
  SimpleGrid,
  Progress,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import PropTypes from 'prop-types';
import ReviewCard from './ReviewCard';
import RatingStars from './RatingStars';
import useReviewStore from '../../../shared/stores/useReviewStore';

/**
 * Reviews List Component
 * Displays list of reviews with filtering and sorting
 * 
 * @component
 * @param {Object} props
 * @param {string} props.propertyId - Property ID
 * @param {boolean} props.isOwner - Whether current user is the property owner
 * @param {Function} props.onWriteReview - Callback for write review button
 */
const ReviewsList = ({ propertyId, isOwner = false, onWriteReview }) => {
  const toast = useToast();
  const {
    getReviewsByProperty,
    getPropertyRatings,
    markHelpful,
    markNotHelpful,
    addOwnerResponse,
    deleteOwnerResponse,
    flagReview,
  } = useReviewStore();

  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState('all');

  const reviews = getReviewsByProperty(propertyId, true);
  const ratings = getPropertyRatings(propertyId);

  // Filter reviews
  let filteredReviews = [...reviews];
  if (filterRating !== 'all') {
    const rating = parseInt(filterRating);
    filteredReviews = filteredReviews.filter(
      (r) => Math.round(r.overallRating) === rating
    );
  }

  // Sort reviews
  filteredReviews.sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'highest':
        return b.overallRating - a.overallRating;
      case 'lowest':
        return a.overallRating - b.overallRating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  const handleHelpful = (reviewId) => {
    markHelpful(reviewId, 'current-user');
  };

  const handleNotHelpful = (reviewId) => {
    markNotHelpful(reviewId, 'current-user');
  };

  const handleFlag = (reviewId) => {
    const reason = prompt('Please provide a reason for flagging this review:');
    if (reason) {
      flagReview(reviewId, reason, 'current-user');
      toast({
        title: 'Review flagged',
        description: 'Thank you for reporting. We will review this shortly.',
        status: 'success',
        duration: 3000,
      });
    }
  };

  const handleAddResponse = (reviewId, response) => {
    addOwnerResponse(reviewId, response, 'current-owner');
    toast({
      title: 'Response posted',
      status: 'success',
      duration: 3000,
    });
  };

  const handleDeleteResponse = (reviewId) => {
    if (window.confirm('Are you sure you want to delete your response?')) {
      deleteOwnerResponse(reviewId);
      toast({
        title: 'Response deleted',
        status: 'success',
        duration: 3000,
      });
    }
  };

  if (!ratings && reviews.length === 0) {
    return (
      <Box textAlign="center" py={12}>
        <VStack spacing={4}>
          <Icon as={FaStar} boxSize={12} color="gray.300" />
          <Heading size="md" color="gray.600">
            No Reviews Yet
          </Heading>
          <Text color="gray.500">
            Be the first to review this property
          </Text>
          {onWriteReview && (
            <Button colorScheme="blue" onClick={onWriteReview}>
              Write a Review
            </Button>
          )}
        </VStack>
      </Box>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Rating Summary */}
        {ratings && (
          <Box>
            <HStack spacing={8} mb={6}>
              {/* Overall Rating */}
              <VStack align="start" spacing={2}>
                <Heading size="2xl">{ratings.overallRating}</Heading>
                <RatingStars
                  rating={ratings.overallRating}
                  size={20}
                  count={ratings.totalReviews}
                  showCount
                />
              </VStack>

              {/* Rating Distribution */}
              <Box flex="1">
                <VStack spacing={2} align="stretch">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <HStack key={star} spacing={3}>
                      <Text fontSize="sm" w="20px">
                        {star}
                      </Text>
                      <Icon as={FaStar} boxSize={3} color="yellow.400" />
                      <Progress
                        value={
                          (ratings.ratingDistribution[star] / ratings.totalReviews) *
                          100
                        }
                        size="sm"
                        colorScheme="yellow"
                        flex="1"
                        borderRadius="full"
                      />
                      <Text fontSize="sm" w="40px" textAlign="right">
                        {ratings.ratingDistribution[star]}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </HStack>

            {/* Category Ratings */}
            {ratings.categoryRatings && Object.keys(ratings.categoryRatings).length > 0 && (
              <SimpleGrid columns={[2, 3]} spacing={4} mb={6}>
                {Object.entries(ratings.categoryRatings).map(([category, rating]) => (
                  <Box key={category}>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                    <RatingStars rating={rating} size={16} />
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </Box>
        )}

        <Divider />

        {/* Controls */}
        <HStack justify="space-between" flexWrap="wrap" gap={3}>
          <HStack spacing={3}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              size="sm"
              w="180px"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </Select>

            <Select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              size="sm"
              w="150px"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </Select>
          </HStack>

          {onWriteReview && !isOwner && (
            <Button colorScheme="blue" size="sm" onClick={onWriteReview}>
              Write a Review
            </Button>
          )}
        </HStack>

        {/* Reviews List */}
        <VStack spacing={4} align="stretch">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isOwner={isOwner}
                onHelpful={handleHelpful}
                onNotHelpful={handleNotHelpful}
                onFlag={handleFlag}
                onAddResponse={handleAddResponse}
                onDeleteResponse={handleDeleteResponse}
              />
            ))
          ) : (
            <Box textAlign="center" py={8}>
              <Text color="gray.500">
                No reviews match your filter criteria
              </Text>
            </Box>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

ReviewsList.propTypes = {
  propertyId: PropTypes.string.isRequired,
  isOwner: PropTypes.bool,
  onWriteReview: PropTypes.func,
};

export default ReviewsList;
