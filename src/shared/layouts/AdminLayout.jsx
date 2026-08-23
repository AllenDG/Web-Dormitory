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
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const CONTENT_MAX_W = '1400px';

/**
 * Admin Layout — Super Admin portal shell, mirrors OwnerLayout exactly
 * (sidebar + header, one Container maxW shared by both so they align).
 */
const AdminLayout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex h="100vh" overflow="hidden" bg="gray.50">
      <Box
        display={{ base: 'none', lg: 'block' }}
        w="280px"
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        overflowY="auto"
      >
        <AdminSidebar />
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <AdminSidebar onClose={onClose} />
        </DrawerContent>
      </Drawer>

      <Flex flex="1" direction="column" overflow="hidden">
        <Box h="64px" bg="white" borderBottom="1px" borderColor="gray.200">
          <Container maxW={CONTENT_MAX_W} h="full" display="flex" alignItems="center" gap={4} px={{ base: 4, md: 6 }}>
            <IconButton
              display={{ base: 'flex', lg: 'none' }}
              icon={<Icon as={FiMenu} />}
              variant="ghost"
              onClick={onOpen}
              aria-label="Open menu"
            />
            <AdminHeader />
          </Container>
        </Box>

        <Box flex="1" overflowY="auto" bg="white">
          <Container maxW={CONTENT_MAX_W} px={{ base: 4, md: 6 }} py={6}>
            <Outlet />
          </Container>
        </Box>
      </Flex>
    </Flex>
  );
};

export default AdminLayout;
