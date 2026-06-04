import { lazy } from 'react';

// Auth Domain Pages
export const LoginPage = lazy(() => import('../../domains/auth/pages/LoginPage'));
export const SignUpPage = lazy(() => import('../../domains/auth/pages/SignUpPage'));
