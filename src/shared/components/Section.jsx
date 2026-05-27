import { Box } from '@chakra-ui/react';
import Container from './Container';

/**
 * Section Component for page layouts
 */
const Section = ({
  children,
  bg,
  py = { base: 12, md: 16, lg: 20 },
  containerSize = 'xl',
  ...props
}) => {
  return (
    <Box as="section" bg={bg} py={py} {...props}>
      <Container size={containerSize}>{children}</Container>
    </Box>
  );
};

export default Section;
