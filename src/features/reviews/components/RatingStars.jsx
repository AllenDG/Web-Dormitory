import { HStack, Icon, Text, Box } from '@chakra-ui/react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import PropTypes from 'prop-types';

/**
 * Rating Stars Component
 * Displays star rating with optional count
 * 
 * @component
 * @param {Object} props
 * @param {number} props.rating - Rating value (0-5)
 * @param {number} props.size - Star size in pixels
 * @param {number} props.count - Number of reviews (optional)
 * @param {boolean} props.showCount - Whether to show review count
 * @param {string} props.color - Star color
 */
const RatingStars = ({
  rating = 0,
  size = 16,
  count = 0,
  showCount = false,
  color = 'yellow.400',
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <HStack spacing={1}>
      {/* Full Stars */}
      {[...Array(fullStars)].map((_, i) => (
        <Icon key={`full-${i}`} as={FaStar} color={color} boxSize={`${size}px`} />
      ))}

      {/* Half Star */}
      {hasHalfStar && (
        <Icon as={FaStarHalfAlt} color={color} boxSize={`${size}px`} />
      )}

      {/* Empty Stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <Icon key={`empty-${i}`} as={FaRegStar} color={color} boxSize={`${size}px`} />
      ))}

      {/* Rating Number */}
      <Text fontSize="sm" fontWeight="semibold" ml={1}>
        {rating.toFixed(1)}
      </Text>

      {/* Review Count */}
      {showCount && count > 0 && (
        <Text fontSize="sm" color="gray.600">
          ({count} {count === 1 ? 'review' : 'reviews'})
        </Text>
      )}
    </HStack>
  );
};

RatingStars.propTypes = {
  rating: PropTypes.number,
  size: PropTypes.number,
  count: PropTypes.number,
  showCount: PropTypes.bool,
  color: PropTypes.string,
};

export default RatingStars;
