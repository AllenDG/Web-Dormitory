import { extendTheme } from '@chakra-ui/react';

/**
 * Dormitory Platform Theme Configuration
 * 
 * Brand Colors:
 * - Primary: #2563EB (Blue)
 * - Border Radius: 8px
 * - Font: Poppins
 */

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const colors = {
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB', // Main brand color
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
};

const fonts = {
  heading: `'Poppins', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
  body: `'Poppins', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
};

const styles = {
  global: {
    body: {
      bg: 'gray.50',
      color: 'gray.900',
    },
  },
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: '600',
      borderRadius: '8px',
    },
    variants: {
      solid: (props) => ({
        bg: props.colorScheme === 'primary' ? 'primary.600' : undefined,
        color: props.colorScheme === 'primary' ? 'white' : undefined,
        _hover: {
          bg: props.colorScheme === 'primary' ? 'primary.700' : undefined,
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
        },
        _active: {
          bg: props.colorScheme === 'primary' ? 'primary.800' : undefined,
          transform: 'translateY(0)',
        },
        transition: 'all 0.2s',
      }),
      outline: (props) => ({
        borderColor: props.colorScheme === 'primary' ? 'primary.600' : undefined,
        color: props.colorScheme === 'primary' ? 'primary.600' : undefined,
        _hover: {
          bg: props.colorScheme === 'primary' ? 'primary.50' : undefined,
        },
      }),
      ghost: (props) => ({
        color: props.colorScheme === 'primary' ? 'primary.600' : undefined,
        _hover: {
          bg: props.colorScheme === 'primary' ? 'primary.50' : undefined,
        },
      }),
    },
    defaultProps: {
      colorScheme: 'primary',
    },
  },
  Input: {
    baseStyle: {
      field: {
        borderRadius: '8px',
      },
    },
    variants: {
      outline: {
        field: {
          borderColor: 'gray.300',
          _hover: {
            borderColor: 'primary.500',
          },
          _focus: {
            borderColor: 'primary.600',
            boxShadow: '0 0 0 1px #2563EB',
          },
        },
      },
    },
  },
  Select: {
    baseStyle: {
      field: {
        borderRadius: '8px',
      },
    },
    variants: {
      outline: {
        field: {
          borderColor: 'gray.300',
          _hover: {
            borderColor: 'primary.500',
          },
          _focus: {
            borderColor: 'primary.600',
            boxShadow: '0 0 0 1px #2563EB',
          },
        },
      },
    },
  },
  Textarea: {
    baseStyle: {
      borderRadius: '8px',
    },
    variants: {
      outline: {
        borderColor: 'gray.300',
        _hover: {
          borderColor: 'primary.500',
        },
        _focus: {
          borderColor: 'primary.600',
          boxShadow: '0 0 0 1px #2563EB',
        },
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: '8px',
        boxShadow: 'sm',
        bg: 'white',
      },
    },
  },
  Badge: {
    baseStyle: {
      borderRadius: '8px',
      fontWeight: '600',
    },
  },
  Modal: {
    baseStyle: {
      dialog: {
        borderRadius: '8px',
      },
    },
  },
  Drawer: {
    baseStyle: {
      dialog: {
        borderRadius: '8px',
      },
    },
  },
  Tabs: {
    variants: {
      line: {
        tab: {
          borderColor: 'transparent',
          _selected: {
            color: 'primary.600',
            borderColor: 'primary.600',
          },
          _hover: {
            color: 'primary.500',
          },
        },
      },
      enclosed: {
        tab: {
          borderRadius: '8px 8px 0 0',
          _selected: {
            color: 'primary.600',
            borderColor: 'gray.200',
            borderBottomColor: 'white',
          },
        },
      },
    },
  },
  Link: {
    baseStyle: {
      color: 'primary.600',
      _hover: {
        color: 'primary.700',
        textDecoration: 'underline',
      },
    },
  },
  Checkbox: {
    baseStyle: {
      control: {
        borderRadius: '4px',
        _checked: {
          bg: 'primary.600',
          borderColor: 'primary.600',
          _hover: {
            bg: 'primary.700',
            borderColor: 'primary.700',
          },
        },
      },
    },
  },
  Radio: {
    baseStyle: {
      control: {
        _checked: {
          bg: 'primary.600',
          borderColor: 'primary.600',
          _hover: {
            bg: 'primary.700',
            borderColor: 'primary.700',
          },
        },
      },
    },
  },
  Switch: {
    baseStyle: {
      track: {
        _checked: {
          bg: 'primary.600',
        },
      },
    },
  },
  Progress: {
    baseStyle: {
      filledTrack: {
        bg: 'primary.600',
      },
    },
  },
  Slider: {
    baseStyle: {
      filledTrack: {
        bg: 'primary.600',
      },
      thumb: {
        bg: 'primary.600',
      },
    },
  },
};

const radii = {
  none: '0',
  sm: '4px',
  base: '8px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',
};

const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  outline: '0 0 0 3px rgba(37, 99, 235, 0.5)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
};

const theme = extendTheme({
  config,
  colors,
  fonts,
  styles,
  components,
  radii,
  shadows,
});

export default theme;