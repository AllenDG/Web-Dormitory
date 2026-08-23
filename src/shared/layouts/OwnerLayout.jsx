import {
  Box,
  Flex,
  Container,
  useDisclosure,
  IconButton,
  Icon,
  Drawer,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import OwnerSidebar from './OwnerSidebar';
import OwnerHeader from './OwnerHeader';
import AnnouncementBannerHost from '../../domains/notifications/components/AnnouncementBannerHost';

const CONTENT_MAX_W = { base: '100%', xl: '1400px', '2xl': '1680px' };

/**
 * Owner Layout
 * Sidebar navigation + header shell for the owner portal.
 * Header and content share one Container maxW so their edges always align.
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
        <OwnerSidebar />
      </Box>

      {/* Sidebar - Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <OwnerSidebar onClose={onClose} />
        </DrawerContent>
      </Drawer>

      {/* Main Content Area */}
      <Flex flex="1" direction="column" overflow="hidden">
        {/* Header */}
        <Box h="64px" bg="white" borderBottom="1px" borderColor="gray.200">
          <Container maxW={CONTENT_MAX_W} h="full" display="flex" alignItems="center" gap={4} px={{ base: 4, md: 6, xl: 8 }}>
            {/* Mobile Menu Button */}
            <IconButton
              display={{ base: 'flex', lg: 'none' }}
              icon={<Icon as={FiMenu} />}
              variant="ghost"
              onClick={onOpen}
              aria-label="Open menu"
            />
            <OwnerHeader />
          </Container>
        </Box>

        {/* Page Content */}
        <Box flex="1" overflowY="auto">
          <AnnouncementBannerHost />
          <Container maxW={CONTENT_MAX_W} px={{ base: 4, md: 6, xl: 8 }} py={6}>
            <Outlet />
          </Container>
        </Box>
      </Flex>
    </Flex>
  );
};

export default OwnerLayout;
