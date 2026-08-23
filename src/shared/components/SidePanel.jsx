import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  HStack,
  Icon,
  Text,
  Badge,
} from '@chakra-ui/react';

/**
 * Generic right-side panel for add/edit/view actions, replacing full-page
 * navigation. Generalizes NotificationCenter's Drawer template.
 *
 * Props: { isOpen, onClose, title, icon, badge?, size='md', children,
 * footer?, headerActions? }
 * - footer: form Save/Cancel buttons; omit for read-only panels.
 * - headerActions: extra node next to the title (e.g. a kebab menu).
 */
const SidePanel = ({
  isOpen,
  onClose,
  title,
  icon,
  badge,
  size = 'md',
  children,
  footer,
  headerActions,
}) => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={size}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          <HStack justify="space-between">
            <HStack spacing={2}>
              {icon && <Icon as={icon} boxSize={5} />}
              <Text>{title}</Text>
              {badge != null && (
                <Badge colorScheme="primary" variant="solid" borderRadius="full">
                  {badge}
                </Badge>
              )}
            </HStack>
            {headerActions}
          </HStack>
        </DrawerHeader>

        <DrawerBody>{children}</DrawerBody>

        {footer && <DrawerFooter borderTopWidth="1px">{footer}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  );
};

export default SidePanel;
