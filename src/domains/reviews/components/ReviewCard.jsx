import { useState } from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Avatar,
  Badge,
  Button,
  Icon,
  Collapse,
  Divider,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
} from '@chakra-ui/react';
import {
  FaThumbsUp,
  FaThumbsDown,
  FaFlag,
  FaCheckCircle,
  FaEllipsisV,
  FaReply,
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
import RatingStars from './RatingStars';
import OwnerResponse from './OwnerResponse';
import { REVIEW_CATEGORIES } from '../../../shared/stores/useReviewStore';

/**
 * Review Card Component
 * Displays a single review with ratings, text, and actions
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.review - Review object
 * @param {boolean} props.isOwner - Whether current user is the property owner
 * @param {Function} props.onHelpful - Callback for helpful vote
 * @param {Function} props.onNotHelpful - Callback for not helpful vote
 * @param {Function} props.onFlag - Callback for flagging review
 * @param {Function} props.onAddResponse - Callback for adding owner response
 * @param {Function} props.onEditResponse - Callback for editing owner response
 * @param {Function} props.onDeleteResponse - Callback for deleting owner response
 * @param {Function} props.onDelete - Callback for deleting review (admin only)
 */
const ReviewCard = ({
  review,
  isOwner = false,
  onHelpful,
  onNotHelpful,
  onFlag,
  onAddResponse,
  onEditResponse,
  onDeleteResponse,
  onDelete,
}) => {
  const { isOpen: showCategories, onToggle: toggleCategories } = useDisclosure();
  const { isOpen: showResponse, onToggle: toggleResponse } = useDisclosure();
  const [hasVoted, setHasVoted] = useState(false);

  const categoryLabels = {
    [REVIEW_CATEGORIES.CLEANLINESS]: 'Cleanliness',
    [REVIEW_CATEGORIES.ACCURACY]: 'Accuracy',
    [REVIEW_CATEGORIES.COMMUNICATION]: 'Communication',
    [REVIEW_CATEGORIES.LOCATION]: 'Location',
    [REVIEW_CATEGORIES.VALUE]: 'Value',
    [REVIEW_CATEGORIES.AMENITIES]: 'Amenities',
  };

  const handleHelpful = () => {
    if (!hasVoted) {
      onHelpful(review.id);
      setHasVoted(true);
    }
  };

  const handleNotHelpful = () => {
    if (!hasVoted) {
      onNotHelpful(review.id);
      setHasVoted(true);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(review.createdAt), { addSuffix: true });

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="8px"
      borderWidth="1px"
      borderColor="gray.200"
      _hover={{ borderColor: 'gray.300', shadow: 'sm' }}
      transition="all 0.2s"
    >
      <VStack spacing={4} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="start">
          <HStack spacing={3}>
            <Avatar
              name={review.userName}
              src={review.userAvatar}
              size="md"
            />
            <VStack align="start" spacing={0}>
              <HStack>
                <Text fontWeight="semibold">{review.userName}</Text>
                {review.isVerifiedTenant && (
                  <Badge colorScheme="green" fontSize="xs">
                    <HStack spacing={1}>
                      <Icon as={FaCheckCircle} boxSize={2} />
                      <Text>Verified Tenant</Text>
                    </HStack>
                  </Badge>
                )}
              </HStack>
              <Text fontSize="xs" color="gray.500">
                {timeAgo}
              </Text>
            </VStack>
          </HStack>

          {/* Actions Menu */}
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FaEllipsisV />}
              variant="ghost"
              size="sm"
            />
            <MenuList>
              {!isOwner && (
                <MenuItem icon={<FaFlag />} onClick={() => onFlag(review.id)}>
                  Report Review
                </MenuItem>
              )}
              {onDelete && (
                <MenuItem
                  icon={<FaFlag />}
                  onClick={() => onDelete(review.id)}
                  color="red.500"
                >
                  Delete Review
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </HStack>

        {/* Overall Rating */}
        <HStack>
          <RatingStars rating={review.overallRating} size={18} />
        </HStack>

        {/* Review Text */}
        <Text color="gray.700" lineHeight="tall">
          {review.reviewText}
        </Text>

        {/* Category Ratings Toggle */}
        {review.categoryRatings && Object.keys(review.categoryRatings).length > 0 && (
          <Box>
            <Button
              variant="link"
              size="sm"
              onClick={toggleCategories}
              colorScheme="blue"
            >
              {showCategories ? 'Hide' : 'Show'} detailed ratings
            </Button>
            <Collapse in={showCategories} animateOpacity>
              <Box mt={3} p={4} bg="gray.50" borderRadius="8px">
                <VStack spacing={2} align="stretch">
                  {Object.entries(review.categoryRatings).map(([category, rating]) => (
                    rating > 0 && (
                      <HStack key={category} justify="space-between">
                        <Text fontSize="sm" color="gray.600">
                          {categoryLabels[category]}
                        </Text>
                        <RatingStars rating={rating} size={14} />
                      </HStack>
                    )
                  ))}
                </VStack>
              </Box>
            </Collapse>
          </Box>
        )}

        {/* Helpful Votes */}
        <HStack spacing={4}>
          <HStack spacing={2}>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<FaThumbsUp />}
              onClick={handleHelpful}
              isDisabled={hasVoted}
              colorScheme={hasVoted ? 'blue' : 'gray'}
            >
              Helpful ({review.helpful})
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<FaThumbsDown />}
              onClick={handleNotHelpful}
              isDisabled={hasVoted}
            >
              ({review.notHelpful})
            </Button>
          </HStack>

          {/* Owner Response Button */}
          {isOwner && !review.ownerResponse && (
            <Button
              size="sm"
              variant="outline"
              colorScheme="blue"
              leftIcon={<FaReply />}
              onClick={toggleResponse}
            >
              Respond
            </Button>
          )}
        </HStack>

        {/* Owner Response Form */}
        {isOwner && !review.ownerResponse && showResponse && (
          <>
            <Divider />
            <OwnerResponse
              reviewId={review.id}
              onSubmit={(response) => {
                onAddResponse(review.id, response);
                toggleResponse();
              }}
              onCancel={toggleResponse}
            />
          </>
        )}

        {/* Existing Owner Response */}
        {review.ownerResponse && (
          <>
            <Divider />
            <Box pl={4} borderLeftWidth="3px" borderLeftColor="blue.500">
              <VStack align="stretch" spacing={2}>
                <HStack justify="space-between">
                  <HStack>
                    <Text fontSize="sm" fontWeight="semibold" color="blue.600">
                      Response from Owner
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {formatDistanceToNow(new Date(review.ownerResponse.createdAt), {
                        addSuffix: true,
                      })}
                    </Text>
                  </HStack>
                  {isOwner && (
                    <HStack spacing={2}>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => {
                          // Toggle edit mode
                          toggleResponse();
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => onDeleteResponse(review.id)}
                      >
                        Delete
                      </Button>
                    </HStack>
                  )}
                </HStack>
                <Text fontSize="sm" color="gray.700">
                  {review.ownerResponse.text}
                </Text>
              </VStack>
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
};

ReviewCard.propTypes = {
  review: PropTypes.object.isRequired,
  isOwner: PropTypes.bool,
  onHelpful: PropTypes.func,
  onNotHelpful: PropTypes.func,
  onFlag: PropTypes.func,
  onAddResponse: PropTypes.func,
  onEditResponse: PropTypes.func,
  onDeleteResponse: PropTypes.func,
  onDelete: PropTypes.func,
};

export default ReviewCard;
