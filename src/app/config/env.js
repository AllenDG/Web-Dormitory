/**
 * Environment Configuration
 * Centralized access to environment variables
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000;

// App Environment
export const APP_ENV = import.meta.env.VITE_ENV || 'development';
export const IS_DEV = APP_ENV === 'development';
export const IS_PROD = APP_ENV === 'production';
export const IS_TEST = APP_ENV === 'test';

// Feature Flags
export const ENABLE_AI_FEATURES = import.meta.env.VITE_ENABLE_AI_FEATURES === 'true';
export const ENABLE_AI_CHATBOT = import.meta.env.VITE_ENABLE_AI_CHATBOT === 'true';
export const ENABLE_AI_RECOMMENDATIONS = import.meta.env.VITE_ENABLE_AI_RECOMMENDATIONS === 'true';
export const USE_MOCK_AI = import.meta.env.VITE_USE_MOCK_AI === 'true';

// AI Configuration
export const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
export const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'claude-3-5-sonnet-20241022';
export const AI_MAX_TOKENS = parseInt(import.meta.env.VITE_AI_MAX_TOKENS) || 1024;
export const AI_TEMPERATURE = parseFloat(import.meta.env.VITE_AI_TEMPERATURE) || 0.7;

// Map Configuration
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

// Analytics
export const GOOGLE_ANALYTICS_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '';
export const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';

// Debug
export const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === 'true';
export const SHOW_DEV_TOOLS = import.meta.env.VITE_SHOW_DEV_TOOLS === 'true';

// Validate required environment variables
const validateEnv = () => {
  const warnings = [];

  if (IS_PROD && !MAPBOX_TOKEN) {
    warnings.push('VITE_MAPBOX_TOKEN is not set');
  }

  if (ENABLE_AI_FEATURES && !USE_MOCK_AI && !ANTHROPIC_API_KEY) {
    warnings.push('VITE_ANTHROPIC_API_KEY is not set but AI features are enabled');
  }

  if (warnings.length > 0 && IS_DEV) {
    console.warn('⚠️  Environment Configuration Warnings:');
    warnings.forEach((warning) => console.warn(`  - ${warning}`));
  }
};

// Run validation in development
if (IS_DEV) {
  validateEnv();
}

export default {
  API_BASE_URL,
  API_TIMEOUT,
  APP_ENV,
  IS_DEV,
  IS_PROD,
  ENABLE_AI_FEATURES,
  ANTHROPIC_API_KEY,
  MAPBOX_TOKEN,
  DEBUG_MODE,
};
