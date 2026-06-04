import { Suspense } from 'react';
import { Spinner, Center, Box } from '@chakra-ui/react';
import ProtectedRoute from './protected-routes';
import { ROLES } from '../providers/AuthProvider';

// Import layouts
import TenantLayout from '../../shared/layouts/TenantLayout';
import OwnerLayout from '../../shared/layouts/OwnerLayout';

// Import route modules
import * as TenantRoutes from './tenant-routes';
import * as OwnerRoutes from './owner-routes';
import * as AdminRoutes from './admin-routes';
import * as AuthRoutes from './auth-routes';

// Loading component
const PageLoader = () => (
  <Center h="80vh">
    <Spinner size="xl" color="primary.500" thickness="4px" />
  </Center>
);

// Wrapper for lazy loaded components
const LazyPage = ({ children }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

/**
 * Route Configuration v4.0 - Enterprise Structure
 * Clean separation: domains/ for business logic, modules/ for UI by role
 */
export const routes = [
  // ==========================================
  // TENANT/GUEST PORTAL ROUTES
  // ==========================================
  {
    path: '/',
    element: <TenantLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <TenantRoutes.LandingPage />
          </LazyPage>
        ),
      },
      {
        path: 'find-rentals',
        element: (
          <LazyPage>
            <TenantRoutes.FindRentalsPage />
          </LazyPage>
        ),
      },
      {
        path: 'listing/:id',
        element: (
          <LazyPage>
            <TenantRoutes.RentalDetailPage />
          </LazyPage>
        ),
      },
      {
        path: 'schedule-visit',
        element: (
          <LazyPage>
            <TenantRoutes.ScheduleVisitPage />
          </LazyPage>
        ),
      },
      {
        path: 'schedule-visit/:propertyId',
        element: (
          <LazyPage>
            <TenantRoutes.ScheduleVisitPage />
          </LazyPage>
        ),
      },
      {
        path: 'my-visits',
        element: (
          <LazyPage>
            <TenantRoutes.MyVisitsPage />
          </LazyPage>
        ),
      },
      {
        path: 'favorites',
        element: (
          <LazyPage>
            <TenantRoutes.FavoritesPage />
          </LazyPage>
        ),
      },
      {
        path: 'profile',
        element: (
          <LazyPage>
            <TenantRoutes.ProfilePage />
          </LazyPage>
        ),
      },
      {
        path: 'chat',
        element: (
          <LazyPage>
            <TenantRoutes.ChatPage />
          </LazyPage>
        ),
      },
      {
        path: 'compare',
        element: (
          <LazyPage>
            <TenantRoutes.ComparePropertiesPage />
          </LazyPage>
        ),
      },
      {
        path: 'booking/:propertyId',
        element: (
          <LazyPage>
            <TenantRoutes.BookingPage />
          </LazyPage>
        ),
      },
      {
        path: 'booking/:bookingId/payment',
        element: (
          <LazyPage>
            <TenantRoutes.PaymentPage />
          </LazyPage>
        ),
      },
      {
        path: 'booking/:bookingId/confirmation',
        element: (
          <LazyPage>
            <TenantRoutes.BookingConfirmationPage />
          </LazyPage>
        ),
      },
      {
        path: 'my-bookings',
        element: (
          <LazyPage>
            <TenantRoutes.MyBookingsPage />
          </LazyPage>
        ),
      },
      {
        path: 'booking/:bookingId/contract',
        element: (
          <LazyPage>
            <TenantRoutes.ContractPage />
          </LazyPage>
        ),
      },
      {
        path: 'how-it-works',
        element: (
          <LazyPage>
            <TenantRoutes.HowItWorksPage />
          </LazyPage>
        ),
      },
      {
        path: 'about-us',
        element: (
          <LazyPage>
            <TenantRoutes.AboutPage />
          </LazyPage>
        ),
      },
      {
        path: 'contact',
        element: (
          <LazyPage>
            <TenantRoutes.ContactPage />
          </LazyPage>
        ),
      },
    ],
  },

  // ==========================================
  // AUTH ROUTES (No layout)
  // ==========================================
  {
    path: '/login',
    element: (
      <LazyPage>
        <AuthRoutes.LoginPage />
      </LazyPage>
    ),
  },
  {
    path: '/signup',
    element: (
      <LazyPage>
        <AuthRoutes.SignUpPage />
      </LazyPage>
    ),
  },

  // Owner Auth Routes
  {
    path: '/owner/login',
    element: (
      <LazyPage>
        <AuthRoutes.LoginPage />
      </LazyPage>
    ),
  },
  {
    path: '/owner/signup',
    element: (
      <LazyPage>
        <AuthRoutes.SignUpPage />
      </LazyPage>
    ),
  },

  // Admin Auth Routes
  {
    path: '/admin/login',
    element: (
      <LazyPage>
        <AuthRoutes.LoginPage />
      </LazyPage>
    ),
  },

  // ==========================================
  // ADMIN PORTAL ROUTES (Protected)
  // ==========================================
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <Box minH="100vh">
          <LazyPage>
            <AdminRoutes.AdminDashboardEnhanced />
          </LazyPage>
        </Box>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <Box minH="100vh">
          <LazyPage>
            <AdminRoutes.AdminDashboardEnhanced />
          </LazyPage>
        </Box>
      </ProtectedRoute>
    ),
  },

  // ==========================================
  // OWNER PORTAL ROUTES (Protected)
  // ==========================================
  {
    path: '/owner',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.OWNER, ROLES.ADMIN]}>
        <OwnerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <OwnerRoutes.OwnerDashboard />
          </LazyPage>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <LazyPage>
            <OwnerRoutes.OwnerDashboard />
          </LazyPage>
        ),
      },
      {
        path: 'properties',
        element: (
          <LazyPage>
            <OwnerRoutes.PropertiesPage />
          </LazyPage>
        ),
      },
      {
        path: 'properties/add',
        element: (
          <LazyPage>
            <OwnerRoutes.AddPropertyPage />
          </LazyPage>
        ),
      },
      {
        path: 'properties/edit/:id',
        element: (
          <LazyPage>
            <OwnerRoutes.EditPropertyPage />
          </LazyPage>
        ),
      },
      {
        path: 'bookings',
        element: (
          <LazyPage>
            <OwnerRoutes.BookingsPage />
          </LazyPage>
        ),
      },
      {
        path: 'tenants',
        element: (
          <LazyPage>
            <OwnerRoutes.TenantsPage />
          </LazyPage>
        ),
      },
      {
        path: 'settings',
        element: (
          <LazyPage>
            <OwnerRoutes.SettingsPage />
          </LazyPage>
        ),
      },
    ],
  },

  // ==========================================
  // ERROR ROUTES
  // ==========================================
  {
    path: '*',
    element: (
      <LazyPage>
        <TenantRoutes.NotFoundPage />
      </LazyPage>
    ),
  },
];
