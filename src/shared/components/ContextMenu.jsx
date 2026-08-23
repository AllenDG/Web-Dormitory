import { useLayoutEffect, useRef, useState } from 'react';
import { Box, Portal, Icon, Text, useOutsideClick } from '@chakra-ui/react';

/**
 * Right-click / long-press context menu, positioned at arbitrary x/y
 * viewport coordinates. Chakra's Menu has no arbitrary-placement API, so
 * this is a small custom Portal-based popover instead — same visual
 * language (white surface, boxShadow, rounded), clamped to stay on-screen.
 *
 * Props: { isOpen, position: {x,y}, items: [{label, icon, onClick,
 * isDestructive}], onClose }
 */
const ContextMenu = ({ isOpen, position, items = [], onClose }) => {
  const menuRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useOutsideClick({ ref: menuRef, handler: onClose, enabled: isOpen });

  useLayoutEffect(() => {
    if (!isOpen || !menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    const handleScrollOrResize = () => onClose();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const padding = 8;
  const left = size.width
    ? Math.min(position.x, Math.max(padding, window.innerWidth - size.width - padding))
    : position.x;
  const top = size.height
    ? Math.min(position.y, Math.max(padding, window.innerHeight - size.height - padding))
    : position.y;

  return (
    <Portal>
      <Box
        ref={menuRef}
        position="fixed"
        top={`${top}px`}
        left={`${left}px`}
        zIndex="popover"
        bg="white"
        borderRadius="md"
        boxShadow="lg"
        border="1px"
        borderColor="gray.200"
        py={1}
        minW="200px"
      >
        {items.map((item, index) => (
          <Box
            key={index}
            as="button"
            type="button"
            display="flex"
            alignItems="center"
            gap={3}
            width="100%"
            textAlign="left"
            px={4}
            py={2}
            fontSize="sm"
            color={item.isDestructive ? 'error.600' : 'gray.700'}
            _hover={{ bg: item.isDestructive ? 'error.50' : 'gray.100' }}
            disabled={item.isDisabled}
            opacity={item.isDisabled ? 0.5 : 1}
            cursor={item.isDisabled ? 'not-allowed' : 'pointer'}
            onClick={() => {
              if (item.isDisabled) return;
              onClose();
              item.onClick?.();
            }}
          >
            {item.icon && <Icon as={item.icon} boxSize={4} />}
            <Text>{item.label}</Text>
          </Box>
        ))}
      </Box>
    </Portal>
  );
};

export default ContextMenu;
