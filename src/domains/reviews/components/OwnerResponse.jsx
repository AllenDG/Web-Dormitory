import { useState } from 'react';
import {
  Box,
  VStack,
  Textarea,
  Button,
  HStack,
  Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

/**
 * Owner Response Component
 * Form for owners to respond to reviews
 * 
 * @component
 * @param {Object} props
 * @param {string} props.reviewId - Review ID
 * @param {string} props.initialValue - Initial response text (for editing)
 * @param {Function} props.onSubmit - Callback for submitting response
 * @param {Function} props.onCancel - Callback for canceling
 */
const OwnerResponse = ({
  reviewId,
  initialValue = '',
  onSubmit,
  onCancel,
}) => {
  const [responseText, setResponseText] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (responseText.trim().length < 10) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(responseText.trim());
      setResponseText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <VStack spacing={3} align="stretch">
        <Text fontSize="sm" fontWeight="semibold" color="blue.600">
          {initialValue ? 'Edit Your Response' : 'Respond to this Review'}
        </Text>
        <Textarea
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          placeholder="Thank the reviewer and address any concerns..."
          rows={4}
          resize="vertical"
        />
        <Text fontSize="xs" color="gray.500">
          Minimum 10 characters ({responseText.length}/10)
        </Text>
        <HStack justify="flex-end" spacing={2}>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancel}
            isDisabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={responseText.trim().length < 10}
          >
            {initialValue ? 'Update Response' : 'Post Response'}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

OwnerResponse.propTypes = {
  reviewId: PropTypes.string.isRequired,
  initialValue: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default OwnerResponse;
