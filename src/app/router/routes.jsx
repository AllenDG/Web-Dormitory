import { lazy, Suspense } from 'react';
import { Spinner, Center, Box } from '@chakra-ui/react';
import TenantLayout from '../../shared/layouts/TenantLayout';
import OwnerLayout from '../../shared/layouts/OwnerLayout';
import ProtectedRoute from './ProtectedRoute';
import { ROLES } from '../providers/AuthProvider';

// Tenant Pages (Lazy loaded)
const LandingPage = lazy(() => import('../../features/home/LandingPage'));
const AboutPage = lazy(() => import('../../features/about/AboutPage'));
const HowItWorksPage = lazy(() => import('../../features/how-it-works/HowItWorksPage'));
const ContactPage = lazy(() => import('../../features/contact/ContactPage'));
const FindRentalsPage = lazy(() => import('../../features/rentals/FindRentalsPage'));
const RentalDetailPage = lazy(() => import('../../features/rentals/RentalDetailPage'));
const FavoritesPage = lazy(() => import('../../features/favorites/FavoritesPage'));
const ScheduleVisitPage = lazy(() => import('../../features/appointments/ScheduleVisitPage'));
const MyVisitsPage = lazy(() => import('../../features/appointments/MyVisitsPage'));
const ProfilePage = lazy(() => import('../../features/profile/ProfilePage'));
const ChatPage = lazy(() => import('../../features/chat/ChatPage'));

// Booking Pages (Lazy loaded)
const BookingPage = lazy(() => import('../../features/booking/BookingPage'));
const PaymentPage = lazy(() => import('../../features/booking/PaymentPage'));
const BookingConfirmationPage = lazy(() => import('../../features/booking/BookingConfirmationPage'));
const MyBookingsPage = lazy(() => import('../../features/booking/MyBookingsPage'));
const ContractPage = lazy(() => import('../../features/booking/ContractPage'));

// Compare Page (Lazy loaded)
const ComparePropertiesPage = lazy(() => import('../../features/compare/ComparePropertiesPage'));

// Auth Pages
const LoginPage = lazy(() => import('../../features/auth/LoginPage'));
const SignUpPage = lazy(() => import('../../features/auth/SignUpPage'));

// Owner Pages (Lazy loaded)
const OwnerDashboard = lazy(() => import('../../features/owner/dashboard/DashboardPage'));
const PropertiesPage = lazy(() => import('../../features/owner/properties/PropertiesPage'));
const AddPropertyPage = lazy(() => import('../../features/owner/properties/AddPropertyPage'));
const EditPropertyPage = lazy(() => import('../../features/owner/properties/EditPropertyPage'));
const BookingsPage = lazy(() => import('../../features/owner/bookings/BookingsPage'));
const TenantsPage = lazy(() => import('../../features/owner/tenants/TenantsPage'));
const SettingsPage = lazy(() => import('../../features/owner/settings/SettingsPage'));

// Admin Pages (Lazy loaded)
const AdminDashboard = lazy(() => import('../../features/admin/AdminDashboard'));
const AdminDashboardEnhanced = lazy(() => import('../../features/admin/AdminDashboardEnhanced'));

// Error Pages
const NotFoundPage = lazy(() => import('../../features/error/NotFoundPage'));

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
 * Route Configuration v3.0
 * Separated Tenant and Owner portals with RBAC
 */
export const routes = [
  // Tenant Portal Routes
  {
    path: '/',
    element: <TenantLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <LandingPage />
          </LazyPage>
        ),
      },
      {
        path: 'find-rentals',
        element: (
          <LazyPage>
            <FindRentalsPage />
          </LazyPage>
        ),
      },
      {
        path: 'listing/:id',
        element: (
          <LazyPage>
            <RentalDetailPage />
          </LazyPage>
        ),
      },
      {
        path: 'schedule-visit',
        element: (
          <LazyPage>
            <ScheduleVisitPage />
          </LazyPage>
        ),
      },
      {
        path: 'schedule-visit/:propertyId',
        element: (
          <LazyPage>
            <ScheduleVisitPage />
          </LazyPage>
        ),
      },
      {
        path: 'my-visits',
        element: (
          <LazyPage>
            <MyVisitsPage />
          </LazyPage>
        ),
      },
      {
        path: 'favorites',
        element: (
          <LazyPage>
            <FavoritesPage />
          </LazyPage>
        ),
      },
      {
        path: 'profile',
        element: (
          <LazyPage>
            <ProfilePage />
          </LazyPage>
        ),
      },
      {
        path: 'chat',
        element: (
          <LazyPage>
            <ChatPage />
          </LazyPage>
        ),
      },
      {
        path: 'compare',
        element: (
          <LazyPage>
            <ComparePropertiesPage />
          </LazyPage>
        ),
      },
      {
        path: 'booking/:propertyId',
        element: (
          <LazyPage>
            <BookingPage />
          </LazyPage>
        ),
      },
      {
        path: 'booking/:bookingId/payment',
        element: (
          <LazyPage>
            <PaymentPage />
          </LazyPage>
        ),
      },
      {
        path: 'booking/:bookingId/confirmation',
        element: (
          <LazyPage>
            <BookingConfirmationPage />
          </LazyPage>
        ),
      },
      {
        path: 'my-bookings',
        element: (
          <LazyPage>
            <MyBookingsPage />
          </LazyPage>
        ),
      },
      {
        path: 'booking/:bookingId/contract',
        element: (
          <LazyPage>
            <ContractPage />
          </LazyPage>
        ),
      },
      {
        path: 'how-it-works',
        element: (
          <LazyPage>
            <HowItWorksPage />
          </LazyPage>
        ),
      },
      {
        path: 'about-us',
        element: (
          <LazyPage>
            <AboutPage />
          </LazyPage>
        ),
      },
      {
        path: 'contact',
        element: (
          <LazyPage>
            <ContactPage />
          </LazyPage>
        ),
      },
    ],
  },
  
  // Auth Routes (No layout)
  {
    path: '/login',
    element: (
      <LazyPage>
        <LoginPage />
      </LazyPage>
    ),
  },
  {
    path: '/signup',
    element: (
      <LazyPage>
        <SignUpPage />
      </LazyPage>
    ),
  },
  
  // Owner Auth Routes (No layout)
  {
    path: '/owner/login',
    element: (
      <LazyPage>
        <LoginPage />
      </LazyPage>
    ),
  },
  {
    path: '/owner/signup',
    element: (
      <LazyPage>
        <SignUpPage />
      </LazyPage>
    ),
  },
  
  // Admin Auth Routes (No layout)
  {
    path: '/admin/login',
    element: (
      <LazyPage>
        <LoginPage />
      </LazyPage>
    ),
  },
  
  // Admin Portal Routes (Protected)
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <Box minH="100vh">
          <LazyPage>
            <AdminDashboardEnhanced />
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
            <AdminDashboardEnhanced />
          </LazyPage>
        </Box>
      </ProtectedRoute>
    ),
  },
  
  // Owner Portal Routes (Protected)
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
            <OwnerDashboard />
          </LazyPage>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <LazyPage>
            <OwnerDashboard />
          </LazyPage>
        ),
      },
      {
        path: 'properties',
        element: (
          <LazyPage>
            <PropertiesPage />
          </LazyPage>
        ),
      },
      {
        path: 'properties/add',
        element: (
          <LazyPage>
            <AddPropertyPage />
          </LazyPage>
        ),
      },
      {
        path: 'properties/edit/:id',
        element: (
          <LazyPage>
            <EditPropertyPage />
          </LazyPage>
        ),
      },
      {
        path: 'bookings',
        element: (
          <LazyPage>
            <BookingsPage />
          </LazyPage>
        ),
      },
      {
        path: 'tenants',
        element: (
          <LazyPage>
            <TenantsPage />
          </LazyPage>
        ),
      },
      {
        path: 'settings',
        element: (
          <LazyPage>
            <SettingsPage />
          </LazyPage>
        ),
      },
    ],
  },
  
  // 404 Not Found
  {
    path: '*',
    element: (
      <LazyPage>
        <NotFoundPage />
      </LazyPage>
    ),
  },
];

