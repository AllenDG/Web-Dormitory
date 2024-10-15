import { extendTheme } from "@chakra-ui/react";

export const myTheme = extendTheme({
  colors: {
    primary: {
      50: "#e0f4ff", // Lighter shades
      100: "#b3e0ff",
      200: "#80ccff",
      300: "#4db8ff",
      400: "#1aa3ff",
      500: "#0084FF", // Base primary color (for buttons, etc.)
      600: "#0074e6",
      700: "#0061cc",
      800: "#0052b3",
      900: "#003d80", // Darker shades
    },
    secondary: {
      50: "#f5f5f5",
      100: "#e0e0e0",
      200: "#cccccc",
      300: "#b8b8b8",
      400: "#a3a3a3",
      500: "#707070",
      600: "#5e5e5e",
      700: "#4d4d4d",
      800: "#3b3b3b",
      900: "#2a2a2a",
    },
    accent: {
      500: "#191919", 
    },
    error: {
      500: "#E41E3F",
    },
    text: {
      100: "#191919",
      200: "#707070",
    },
    bg: {
      light: "#F4F4F4",
      dark: "#191919",  
    },
  },
});
