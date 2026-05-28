import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Select as ChakraSelect,
} from '@chakra-ui/react';
import { colors, borderRadius, spacing, typography } from '../styles/tokens';

/**
 * Select Component
 * Enhanced dropdown select with validation support
 */
const Select = ({
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Select an option',
  isRequired = false,
  ...props
}) => {
  return (
    <FormControl isInvalid={!!error} isRequired={isRequired}>
      {label && (
        <FormLabel
          fontSize={typography.fontSize.sm}
          fontWeight={typography.fontWeight.medium}
          color={colors.gray[700]}
          mb={spacing[2]}
        >
          {label}
        </FormLabel>
      )}
      <ChakraSelect
        bg="white"
        borderColor={error ? colors.error : colors.gray[200]}
        borderRadius={borderRadius.lg}
        fontSize={typography.fontSize.base}
        placeholder={placeholder}
        _hover={{
          borderColor: error ? colors.error : colors.gray[300],
        }}
        _focus={{
          borderColor: error ? colors.error : colors.primary[500],
          boxShadow: error
            ? `0 0 0 1px ${colors.error}`
            : `0 0 0 1px ${colors.primary[500]}`,
        }}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </ChakraSelect>
      {error && (
        <FormErrorMessage
          fontSize={typography.fontSize.xs}
          color={colors.error}
          mt={spacing[1]}
        >
          {error}
        </FormErrorMessage>
      )}
      {helperText && !error && (
        <FormHelperText
          fontSize={typography.fontSize.xs}
          color={colors.gray[500]}
          mt={spacing[1]}
        >
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default Select;
