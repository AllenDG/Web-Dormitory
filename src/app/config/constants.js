/**
 * Application Constants
 * Central location for all app-wide constants
 */

// App Info
export const APP_NAME = 'Dormy';
export const APP_VERSION = '2.0.0';
export const APP_DESCRIPTION = 'Modern Student Accommodation Platform';

// Contact Info
export const SUPPORT_EMAIL = 'support@dormy.ph';
export const CONTACT_PHONE = '+63 912 345 6789';
export const OFFICE_ADDRESS = 'Dagupan City, Pangasinan, Philippines';

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 100;

// Search
export const SEARCH_DEBOUNCE_MS = 300;
export const MIN_SEARCH_LENGTH = 2;

// Files
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
export const MAX_IMAGES_PER_PROPERTY = 10;

// Booking
export const MIN_BOOKING_DAYS = 30; // 1 month minimum
export const MAX_BOOKING_DAYS = 365; // 1 year maximum
export const BOOKING_ADVANCE_DAYS = 90; // Can book up to 3 months in advance

// Payment
export const PAYMENT_METHODS = {
  CARD: 'credit_card',
  GCASH: 'gcash',
  PAYMAYA: 'paymaya',
  BANK_TRANSFER: 'bank_transfer',
};

// Currency
export const CURRENCY_CODE = 'PHP';
export const CURRENCY_SYMBOL = '₱';

// Map
export const DEFAULT_MAP_CENTER = {
  lat: 16.0433,
  lng: 120.3326,
}; // Dagupan City

export const MAP_DEFAULT_ZOOM = 13;
export const MAP_SEARCH_RADIUS_KM = 5;

// Compare
export const MAX_COMPARE_PROPERTIES = 4;

// Reviews
export const MIN_REVIEW_LENGTH = 10;
export const MAX_REVIEW_LENGTH = 500;
export const MIN_RATING = 1;
export const MAX_RATING = 5;

// Chat
export const MAX_MESSAGE_LENGTH = 1000;
export const CHAT_POLL_INTERVAL_MS = 5000;

// Notifications
export const NOTIFICATION_AUTO_DISMISS_MS = 5000;
export const MAX_NOTIFICATIONS_DISPLAY = 10;

// API
export const API_TIMEOUT_MS = 30000;
export const API_RETRY_ATTEMPTS = 3;

// Storage Keys
export const STORAGE_KEYS = {
  USER: 'dormy_user',
  TOKEN: 'dormy_token',
  THEME: 'dormy_theme',
  FAVORITES: 'dormy_favorites',
  COMPARE: 'dormy_compare',
  SEARCH_HISTORY: 'dormy_search_history',
};

// Feature Flags
export const FEATURES = {
  AI_RECOMMENDATIONS: true,
  CHAT: true,
  REVIEWS: true,
  PAYMENTS: true,
  NOTIFICATIONS: true,
  COMPARE: true,
};

// External Links
export const EXTERNAL_LINKS = {
  FACEBOOK: 'https://facebook.com/dormy',
  TWITTER: 'https://twitter.com/dormy',
  INSTAGRAM: 'https://instagram.com/dormy',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
};

export default {
  APP_NAME,
  APP_VERSION,
  APP_DESCRIPTION,
  SUPPORT_EMAIL,
  CONTACT_PHONE,
  DEFAULT_PAGE_SIZE,
  PAYMENT_METHODS,
  CURRENCY_SYMBOL,
  STORAGE_KEYS,
  FEATURES,
};
