import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input as ChakraInput,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { colors, borderRadius, spacing, typography } from '../styles/tokens';

/**
 * Input Component
 * Enhanced input field with validation support
 */
const Input = ({
  label,
  error,
  helperText,
  leftElement,
  rightElement,
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
      <InputGroup>
        {leftElement && <InputLeftElement>{leftElement}</InputLeftElement>}
        <ChakraInput
          bg="white"
          borderColor={error ? colors.error : colors.gray[200]}
          borderRadius={borderRadius.lg}
          fontSize={typography.fontSize.base}
          _hover={{
            borderColor: error ? colors.error : colors.gray[300],
          }}
          _focus={{
            borderColor: error ? colors.error : colors.primary[500],
            boxShadow: error
              ? `0 0 0 1px ${colors.error}`
              : `0 0 0 1px ${colors.primary[500]}`,
          }}
          _placeholder={{
            color: colors.gray[400],
          }}
          {...props}
        />
        {rightElement && <InputRightElement>{rightElement}</InputRightElement>}
      </InputGroup>
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

export default Input;
