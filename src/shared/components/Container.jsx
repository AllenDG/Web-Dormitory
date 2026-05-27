import { Container as ChakraContainer } from '@chakra-ui/react';

/**
 * Responsive Container Component
 */
const Container = ({ children, size = 'xl', ...props }) => {
  return (
    <ChakraContainer maxW={`container.${size}`} px={{ base: 4, md: 6, lg: 8 }} {...props}>
      {children}
    </ChakraContainer>
  );
};

export default Container;
