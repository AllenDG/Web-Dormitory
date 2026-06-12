import { useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Button,
  HStack,
  Icon,
  useBreakpointValue,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';
import PageContainer from '../../../shared/components/PageContainer';
import useCompareStore from '../../../shared/stores/useCompareStore';
import CompareTable from '../components/CompareTable';
import CompareCards from '../components/CompareCards';
import CompareEmptyState from '../components/CompareEmptyState';

/**
 * Compare Properties Page
 * Main page for comparing properties side-by-side
 */
const ComparePropertiesPage = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Get compare list to derive properties
  const compareList = useCompareStore((state) => state.compareList);
  const clearCompare = useCompareStore((state) => state.clearCompare);
  const cleanupDeletedProperties = useCompareStore((state) => state.cleanupDeletedProperties);

  const headerBg = 'white';
  const borderColor = 'gray.200';

  // Derive values from compareList
  const hasProperties = compareList.length > 0;
  const compareCount = compareList.length;

  // Determine layout based on screen size
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Cleanup deleted properties on mount only
  useEffect(() => {
    const removedCount = cleanupDeletedProperties();
    if (removedCount > 0) {
      toast({
        title: 'Properties updated',
        description: `${removedCount} unavailable ${removedCount === 1 ? 'property' : 'properties'} removed from comparison`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  const handleClearAll = () => {
    clearCompare();
    onClose();
    toast({
      title: 'Comparison cleared',
      description: 'All properties removed from comparison',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <PageContainer>
      <Container maxW="container.xl" py={8}>
        {/* Header */}
        <Box
          bg={headerBg}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
          p={6}
          mb={6}
        >
          <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <Box>
              <Heading size="lg" mb={2}>
                Compare Properties
              </Heading>
              {hasProperties && (
                <Box fontSize="sm" color="gray.600">
                  Comparing {compareCount} {compareCount === 1 ? 'property' : 'properties'}
                </Box>
              )}
            </Box>

            {hasProperties && compareCount >= 2 && (
              <Button
                leftIcon={<Icon as={FiTrash2} />}
                colorScheme="red"
                variant="outline"
                size="sm"
                onClick={onOpen}
              >
                Clear All
              </Button>
            )}
          </HStack>
        </Box>

        {/* Content */}
        {!hasProperties ? (
          <CompareEmptyState />
        ) : isMobile ? (
          <CompareCards />
        ) : (
          <CompareTable />
        )}

        {/* Clear All Confirmation Modal */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Clear Comparison</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to remove all properties from comparison?
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleClearAll}>
                Clear All
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </PageContainer>
  );
};

export default ComparePropertiesPage;
