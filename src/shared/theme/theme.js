import { extendTheme } from '@chakra-ui/react';

/**
 * Dormy - Chakra UI Theme Configuration
 * Custom theme with brand colors and component overrides
 */

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    primary: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3', // Main primary color
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
    },
    secondary: {
      50: '#fce4ec',
      100: '#f8bbd0',
      200: '#f48fb1',
      300: '#f06292',
      400: '#ec407a',
      500: '#e91e63',
      600: '#d81b60',
      700: '#c2185b',
      800: '#ad1457',
      900: '#880e4f',
    },
    brand: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3',
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
    },
  },
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`,
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem',
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'primary',
      },
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'md',
      },
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === 'primary' ? 'primary.500' : undefined,
          color: 'white',
          _hover: {
            bg: props.colorScheme === 'primary' ? 'primary.600' : undefined,
            _disabled: {
              bg: props.colorScheme === 'primary' ? 'primary.500' : undefined,
            },
          },
        }),
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'primary.500',
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: 'primary.500',
      },
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: 'primary.500',
      },
    },
    Checkbox: {
      defaultProps: {
        colorScheme: 'primary',
      },
    },
    Radio: {
      defaultProps: {
        colorScheme: 'primary',
      },
    },
    Switch: {
      defaultProps: {
        colorScheme: 'primary',
      },
    },
    Badge: {
      baseStyle: {
        textTransform: 'none',
        fontWeight: '600',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
          boxShadow: 'sm',
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
      '*::placeholder': {
        color: 'gray.400',
      },
    },
  },
  shadows: {
    outline: '0 0 0 3px rgba(33, 150, 243, 0.6)',
  },
});

export default theme;
