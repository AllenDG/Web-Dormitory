import { useToast } from '@chakra-ui/react';

const DEFAULTS = {
  position: 'top-right',
  duration: 4000,
  isClosable: true,
  variant: 'subtle',
};

/**
 * Thin wrapper around Chakra's useToast with standardized defaults, so
 * toasts look and behave consistently across the pages that use this
 * instead of calling useToast() directly.
 */
export function useAppToast() {
  const toast = useToast();
  return (options) => toast({ ...DEFAULTS, ...options });
}

export default useAppToast;
