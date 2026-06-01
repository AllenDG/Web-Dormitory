import { Box, Flex, useDisclosure, IconButton, Icon } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import OwnerSidebar from './OwnerSidebar';
import OwnerHeader from './OwnerHeader';

/**
 * Owner Layout
 * Admin-style layout for property owners
 * Includes sidebar navigation and header
 */
const OwnerLayout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex h="100vh" overflow="hidden" bg="gray.50">
      {/* Sidebar - Desktop */}
      <Box
        display={{ base: 'none', lg: 'block' }}
        w="280px"
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        overflowY="auto"
      >
        <OwnerSidebar onClose={onClose} />
      </Box>

      {/* Sidebar - Mobile Drawer */}
      <Box
        display={{ base: isOpen ? 'block' : 'none', lg: 'none' }}
        position="fixed"
        top="0"
        left="0"
        w="280px"
        h="100vh"
        bg="white"
        zIndex="overlay"
        overflowY="auto"
        boxShadow="xl"
      >
        <OwnerSidebar onClose={onClose} />
      </Box>

      {/* Overlay for mobile */}
      {isOpen && (
        <Box
          display={{ base: 'block', lg: 'none' }}
          position="fixed"
          top="0"
          left="0"
          w="100vw"
          h="100vh"
          bg="blackAlpha.600"
          zIndex="modal"
          onClick={onClose}
        />
      )}

      {/* Main Content Area */}
      <Flex flex="1" direction="column" overflow="hidden">
        {/* Header */}
        <Box
          h="64px"
          bg="white"
          borderBottom="1px"
          borderColor="gray.200"
          px={6}
          display="flex"
          alignItems="center"
          gap={4}
        >
          {/* Mobile Menu Button */}
          <IconButton
            display={{ base: 'flex', lg: 'none' }}
            icon={<Icon as={FiMenu} />}
            variant="ghost"
            onClick={onOpen}
            aria-label="Open menu"
          />
          <OwnerHeader />
        </Box>

        {/* Page Content */}
        <Box flex="1" overflowY="auto" p={6}>
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default OwnerLayout;
