import { lazy } from 'react';

// Owner Module Pages
export const OwnerDashboard = lazy(() => import('../../modules/owner/dashboard/DashboardPage'));
export const ReportsPage = lazy(() => import('../../modules/owner/dashboard/ReportsPage'));
export const PropertiesPage = lazy(() => import('../../modules/owner/properties/PropertiesPage'));
export const AddPropertyPage = lazy(() => import('../../modules/owner/properties/AddPropertyPage'));
export const EditPropertyPage = lazy(() => import('../../modules/owner/properties/EditPropertyPage'));
export const BookingRequestsPage = lazy(() => import('../../modules/owner/bookings/BookingRequestsPage'));
export const TransactionHistoryPage = lazy(() => import('../../domains/payments/pages/TransactionHistoryPage'));
export const TenantsPage = lazy(() => import('../../modules/owner/tenants/TenantsPage'));
export const SettingsPage = lazy(() => import('../../modules/owner/settings/SettingsPage'));
