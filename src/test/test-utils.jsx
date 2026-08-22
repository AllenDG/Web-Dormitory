import { render } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import theme from '../shared/theme/theme';

/**
 * Renders a component wrapped in the app's real ChakraProvider (+ theme) and
 * a MemoryRouter, since Chakra's styled-system relies on theme context
 * (`theme.__isStyleProp`) that only exists once extendTheme has run inside a
 * provider.
 */
export function renderWithProviders(ui, { route = '/', ...options } = {}) {
  function Wrapper({ children }) {
    return (
      <ChakraProvider theme={theme}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </ChakraProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react';
