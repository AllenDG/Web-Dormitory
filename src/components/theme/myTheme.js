import { extendTheme } from "@chakra-ui/react";

// Dormy Design System v2.0
// Minimalist, accessible, student-centered

export const myTheme = extendTheme({
  fonts: {
    heading: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    body: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  colors: {
    // Primary - Accessible Light Blue
    primary: {
      50: "#EFF6FF",
      100: "#DBEAFE",
      200: "#BFDBFE",
      300: "#93C5FD",
      400: "#60A5FA",
      500: "#4DA8DA", // Main Primary
      600: "#2563EB",
      700: "#1D4ED8", // Secondary/Buttons
      800: "#1E40AF",
      900: "#1E3A8A",
    },
    // Neutral Colors
    gray: {
      50: "#F8FAFC",  // Background
      100: "#F1F5F9",
      200: "#E2E8F0", // Borders
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569", // Secondary Text
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A", // Primary Text
    },
    // Semantic Colors
    success: {
      500: "#10B981",
      600: "#059669",
    },
    warning: {
      500: "#F59E0B",
      600: "#D97706",
    },
    error: {
      500: "#EF4444",
      600: "#DC2626",
    },
    info: {
      500: "#3B82F6",
      600: "#2563EB",
    },
  },
  radii: {
    none: "0",
    sm: "4px",
    md: "6px",
    lg: "8px", // Maximum border radius
    xl: "8px", // Capped at 8px
    "2xl": "8px", // Capped at 8px
    "3xl": "8px", // Capped at 8px
    full: "9999px",
  },
  space: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
    20: "80px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", // Capped
    "2xl": "0 10px 15px -3px rgba(0, 0, 0, 0.1)", // Capped
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "500",
        borderRadius: "md",
        transition: "all 0.2s",
      },
      variants: {
        solid: {
          bg: "primary.700",
          color: "white",
          _hover: {
            bg: "primary.800",
            transform: "translateY(-1px)",
            boxShadow: "md",
          },
          _active: {
            bg: "primary.900",
            transform: "translateY(0)",
          },
        },
        outline: {
          borderColor: "primary.700",
          color: "primary.700",
          _hover: {
            bg: "primary.50",
          },
        },
        ghost: {
          color: "primary.700",
          _hover: {
            bg: "primary.50",
          },
        },
      },
      defaultProps: {
        colorScheme: "primary",
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: "lg",
          boxShadow: "sm",
          bg: "white",
          _dark: {
            bg: "gray.800",
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: "md",
        },
      },
      variants: {
        outline: {
          field: {
            borderColor: "gray.200",
            _hover: {
              borderColor: "gray.300",
            },
            _focus: {
              borderColor: "primary.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-primary-500)",
            },
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.900",
        fontSize: "16px",
        lineHeight: "1.5",
      },
      "*::placeholder": {
        color: "gray.400",
      },
    },
  },
});
