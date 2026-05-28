import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { colors, borderRadius, spacing, typography } from '../styles/tokens';

/**
 * Modal Component
 * Reusable modal dialog with consistent styling
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  ...props
}) => {
  return (
    <ChakraModal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      closeOnOverlayClick={closeOnOverlayClick}
      isCentered
      {...props}
    >
      <ModalOverlay bg="rgba(0, 0, 0, 0.4)" backdropFilter="blur(4px)" />
      <ModalContent
        borderRadius={borderRadius.lg}
        boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1)"
        mx={spacing[4]}
      >
        {title && (
          <ModalHeader
            fontSize={typography.fontSize.xl}
            fontWeight={typography.fontWeight.semibold}
            color={colors.gray[900]}
            borderBottom={`1px solid ${colors.gray[200]}`}
            pb={spacing[4]}
          >
            {title}
          </ModalHeader>
        )}
        <ModalCloseButton
          color={colors.gray[500]}
          _hover={{
            bg: colors.gray[100],
            color: colors.gray[700],
          }}
          borderRadius={borderRadius.md}
        />
        <ModalBody py={spacing[6]}>{children}</ModalBody>
        {footer && (
          <ModalFooter
            borderTop={`1px solid ${colors.gray[200]}`}
            pt={spacing[4]}
          >
            {footer}
          </ModalFooter>
        )}
      </ModalContent>
    </ChakraModal>
  );
};

export default Modal;
