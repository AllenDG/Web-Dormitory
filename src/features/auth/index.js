/**
 * Authentication Feature - Barrel Export
 * 
 * Handles user authentication for both tenants and owners
 * Route-based user type detection:
 * - /login → Tenant
 * - /owner/login → Owner
 * 
 * @module features/auth
 */

export { default as LoginPage } from './LoginPage';
export { default as SignUpPage } from './SignUpPage';
export { default as LoginPromptModal } from './LoginPromptModal';
export { default as GoogleAuthButton } from './GoogleAuthButton';
