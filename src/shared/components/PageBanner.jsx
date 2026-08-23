import { Box, Flex, Heading, Text, HStack } from '@chakra-ui/react';
import Breadcrumbs from './Breadcrumbs';

/**
 * Per-page Breadcrumbs + title/subtitle/actions region. Rendered as each
 * touched page's first element, replacing the old layout-global
 * <Breadcrumbs/> — kept per-page (not layout-global) since every page
 * needs its own title/subtitle/actions slot anyway.
 */
const PageBanner = ({ title, subtitle, actions }) => {
  return (
    <Box mb={6}>
      <Breadcrumbs />
      <Flex justify="space-between" align="start" flexWrap="wrap" gap={4}>
        <Box>
          <Heading size="lg">{title}</Heading>
          {subtitle && (
            <Text color="gray.600" mt={1}>
              {subtitle}
            </Text>
          )}
        </Box>
        {actions && <HStack spacing={3}>{actions}</HStack>}
      </Flex>
    </Box>
  );
};

export default PageBanner;
