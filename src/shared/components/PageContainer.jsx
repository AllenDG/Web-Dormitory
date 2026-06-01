import { Box } from '@chakra-ui/react';
import { LAYOUT } from '../styles/layoutConstants';

/**
 * PageContainer Component
 * Standardized container for all pages with consistent margins and max-width
 * Based on Find Rentals page layout
 */
const PageContainer = ({ children, maxW = '2xl', noPadding = false, ...props }) => {
  return (
    <Box
      maxW={LAYOUT.maxWidth[maxW]}
      mx="auto"
      px={noPadding ? 0 : LAYOUT.pagePadding}
      {...props}
    >
      {children}
    </Box>
  );
};

export default PageContainer;
