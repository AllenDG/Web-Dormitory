/**
 * Layout Constants v3.0
 * Standardized layout system for consistent spacing and sizing across all pages
 * Based on Find Rentals page layout
 */

export const LAYOUT = {
  // Container widths
  maxWidth: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
    full: '100%',
  },

  // Page padding (left and right margins)
  pagePadding: {
    base: '16px',  // Mobile: 16px
    md: '24px',    // Tablet: 24px
    lg: '32px',    // Desktop: 32px
    xl: '48px',    // Large: 48px
  },

  // Content padding (internal spacing)
  contentPadding: {
    base: '16px',
    md: '24px',
    lg: '32px',
  },

  // Section spacing (between major sections)
  sectionSpacing: {
    base: '32px',
    md: '48px',
    lg: '64px',
  },

  // Card spacing
  cardSpacing: {
    base: '16px',
    md: '20px',
    lg: '24px',
  },

  // Sidebar width (for pages with sidebars)
  sidebarWidth: '280px',

  // Top bar height
  topBarHeight: '64px',
};

/**
 * Typography Scale v3.0
 * Standardized font sizes following a consistent scale
 * Not too big, not too small - just right for readability
 */
export const TYPOGRAPHY = {
  // Display (for hero sections only)
  display: {
    base: '32px',  // 2xl
    md: '40px',    // 3xl
    lg: '48px',    // 4xl
  },

  // Headings
  h1: {
    base: '28px',  // xl
    md: '32px',    // 2xl
    lg: '36px',    // 3xl
  },

  h2: {
    base: '24px',  // lg
    md: '28px',    // xl
    lg: '30px',    // xl+
  },

  h3: {
    base: '20px',  // md+
    md: '22px',    // lg-
    lg: '24px',    // lg
  },

  h4: {
    base: '18px',  // md+
    md: '18px',
    lg: '20px',    // md+
  },

  // Body text
  body: {
    large: '18px',   // For important content
    regular: '16px', // Default body text
    small: '14px',   // Secondary text
  },

  // UI elements
  button: '16px',
  input: '16px',
  label: '14px',
  caption: '13px',
  tiny: '12px',
};

/**
 * Font Weights
 */
export const FONT_WEIGHTS = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

/**
 * Line Heights
 */
export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

/**
 * Standard Page Container Component Props
 */
export const PAGE_CONTAINER_PROPS = {
  maxW: LAYOUT.maxWidth['2xl'],
  mx: 'auto',
  px: LAYOUT.pagePadding,
  py: LAYOUT.contentPadding,
};

/**
 * Standard Section Props
 */
export const SECTION_PROPS = {
  py: LAYOUT.sectionSpacing,
};

/**
 * Standard Card Props
 */
export const CARD_PROPS = {
  bg: 'white',
  borderRadius: 'lg',
  p: LAYOUT.cardSpacing,
  border: '1px',
  borderColor: 'gray.200',
  boxShadow: 'sm',
};
