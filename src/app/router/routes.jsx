import { Suspense } from 'react';
import ProtectedRoute from './protected-routes';
import { ROLES } from '../providers/AuthProvider';
import { PERMISSIONS } from '../config/permissions';
import { FullPageLoader } from '../../shared/components/LoadingState';

// Import layouts
import TenantLayout from '../../shared/layouts/TenantLayout';
import OwnerLayout from '../../shared/layouts/OwnerLayout';
import AdminLayout from '../../shared/layouts/AdminLayout';

// Import route modules
import * as TenantRoutes from './tenant-routes';
import * as OwnerRoutes from './owner-routes';
import * as AdminRoutes from './admin-routes';
import * as AuthRoutes from './auth-routes';

// Wrapper for lazy loaded components
const LazyPage = ({ children }) => (
  <Suspense fallback={<FullPageLoader />}>{children}</Suspense>
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
        path: 'listing/:id/review',
        element: (
          <LazyPage>
            <TenantRoutes.ReviewPage />
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
          <ProtectedRoute allowedRoles={[ROLES.TENANT, ROLES.OWNER, ROLES.ADMIN]}>
            <LazyPage>
              <TenantRoutes.FavoritesPage />
            </LazyPage>
          </ProtectedRoute>
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
          <ProtectedRoute allowedRoles={[ROLES.TENANT, ROLES.OWNER, ROLES.ADMIN]}>
            <LazyPage>
              <TenantRoutes.ComparePropertiesPage />
            </LazyPage>
          </ProtectedRoute>
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
      <ProtectedRoute
        allowedRoles={[ROLES.ADMIN]}
        requiredPermission={PERMISSIONS.ACCESS_ADMIN_PANEL}
      >
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <AdminRoutes.AdminDashboardPage />
          </LazyPage>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <LazyPage>
            <AdminRoutes.AdminDashboardPage />
          </LazyPage>
        ),
      },
      {
        path: 'users',
        children: [
          {
            index: true,
            element: (
              <LazyPage>
                <AdminRoutes.UsersPage role="all" />
              </LazyPage>
            ),
          },
          {
            path: 'tenants',
            element: (
              <LazyPage>
                <AdminRoutes.UsersPage role="tenant" />
              </LazyPage>
            ),
          },
          {
            path: 'owners',
            element: (
              <LazyPage>
                <AdminRoutes.UsersPage role="owner" />
              </LazyPage>
            ),
          },
          {
            path: 'admins',
            element: (
              <LazyPage>
                <AdminRoutes.UsersPage role="admin" />
              </LazyPage>
            ),
          },
          {
            path: 'new',
            element: (
              <LazyPage>
                <AdminRoutes.UsersPage role="all" />
              </LazyPage>
            ),
          },
        ],
      },
      {
        path: 'properties',
        children: [
          {
            index: true,
            element: (
              <LazyPage>
                <AdminRoutes.PropertyModerationPage status="all" />
              </LazyPage>
            ),
          },
          {
            path: 'pending',
            element: (
              <LazyPage>
                <AdminRoutes.PropertyModerationPage status="pending" />
              </LazyPage>
            ),
          },
          {
            path: 'approved',
            element: (
              <LazyPage>
                <AdminRoutes.PropertyModerationPage status="approved" />
              </LazyPage>
            ),
          },
          {
            path: 'rejected',
            element: (
              <LazyPage>
                <AdminRoutes.PropertyModerationPage status="rejected" />
              </LazyPage>
            ),
          },
          {
            path: 'add',
            element: (
              <LazyPage>
                <AdminRoutes.PropertyModerationPage status="all" />
              </LazyPage>
            ),
          },
          {
            path: 'edit/:id',
            element: (
              <LazyPage>
                <AdminRoutes.PropertyModerationPage status="all" />
              </LazyPage>
            ),
          },
        ],
      },
      {
        path: 'reports',
        children: [
          {
            index: true,
            element: (
              <LazyPage>
                <AdminRoutes.ReportedIssuesPage status="all" />
              </LazyPage>
            ),
          },
          {
            path: 'open',
            element: (
              <LazyPage>
                <AdminRoutes.ReportedIssuesPage status="open" />
              </LazyPage>
            ),
          },
          {
            path: 'investigating',
            element: (
              <LazyPage>
                <AdminRoutes.ReportedIssuesPage status="investigating" />
              </LazyPage>
            ),
          },
          {
            path: 'resolved',
            element: (
              <LazyPage>
                <AdminRoutes.ReportedIssuesPage status="resolved" />
              </LazyPage>
            ),
          },
          {
            path: 'property-reports',
            element: (
              <LazyPage>
                <AdminRoutes.ReportedIssuesPage type="property" />
              </LazyPage>
            ),
          },
          {
            path: 'user-reports',
            element: (
              <LazyPage>
                <AdminRoutes.ReportedIssuesPage type="user" />
              </LazyPage>
            ),
          },
          {
            path: 'payment-reports',
            element: (
              <LazyPage>
                <AdminRoutes.ReportedIssuesPage type="payment" />
              </LazyPage>
            ),
          },
        ],
      },
      {
        path: 'revenue',
        children: [
          {
            index: true,
            element: (
              <LazyPage>
                <AdminRoutes.RevenuePage view="overview" />
              </LazyPage>
            ),
          },
          {
            path: 'transactions',
            element: (
              <LazyPage>
                <AdminRoutes.RevenuePage view="transactions" />
              </LazyPage>
            ),
          },
          {
            path: 'refunds',
            element: (
              <LazyPage>
                <AdminRoutes.RevenuePage view="refunds" />
              </LazyPage>
            ),
          },
        ],
      },
      {
        path: 'audit-log',
        children: [
          {
            index: true,
            element: (
              <LazyPage>
                <AdminRoutes.AuditLogPage category="all" />
              </LazyPage>
            ),
          },
          {
            path: 'user-actions',
            element: (
              <LazyPage>
                <AdminRoutes.AuditLogPage category="user-actions" />
              </LazyPage>
            ),
          },
          {
            path: 'property-actions',
            element: (
              <LazyPage>
                <AdminRoutes.AuditLogPage category="property-actions" />
              </LazyPage>
            ),
          },
          {
            path: 'report-actions',
            element: (
              <LazyPage>
                <AdminRoutes.AuditLogPage category="report-actions" />
              </LazyPage>
            ),
          },
          {
            path: 'settings-actions',
            element: (
              <LazyPage>
                <AdminRoutes.AuditLogPage category="settings-actions" />
              </LazyPage>
            ),
          },
        ],
      },
      {
        path: 'settings',
        children: [
          {
            index: true,
            element: (
              <LazyPage>
                <AdminRoutes.ProfileSettingsPage />
              </LazyPage>
            ),
          },
          {
            path: 'profile',
            element: (
              <LazyPage>
                <AdminRoutes.ProfileSettingsPage />
              </LazyPage>
            ),
          },
          {
            path: 'platform',
            element: (
              <LazyPage>
                <AdminRoutes.PlatformSettingsPage />
              </LazyPage>
            ),
          },
        ],
      },
    ],
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
            <OwnerRoutes.PropertiesPage />
          </LazyPage>
        ),
      },
      {
        path: 'properties/edit/:id',
        element: (
          <LazyPage>
            <OwnerRoutes.PropertiesPage />
          </LazyPage>
        ),
      },
      {
        path: 'bookings',
        element: (
          <LazyPage>
            <OwnerRoutes.BookingRequestsPage />
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
        path: 'payments',
        element: (
          <LazyPage>
            <OwnerRoutes.TransactionHistoryPage />
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
