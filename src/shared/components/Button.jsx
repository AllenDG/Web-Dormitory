import { Button as ChakraButton } from '@chakra-ui/react';
import { forwardRef } from 'react';

/**
 * Modern Button Component
 * Extends Chakra UI Button with custom variants
 */
const Button = forwardRef(
  (
    {
      variant = 'solid',
      size = 'md',
      colorScheme = 'primary',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <ChakraButton
        ref={ref}
        variant={variant}
        size={size}
        colorScheme={colorScheme}
        isLoading={isLoading}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        transition="all 0.2s"
        _hover={{
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
        }}
        _active={{
          transform: 'translateY(0)',
        }}
        {...props}
      >
        {children}
      </ChakraButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;
