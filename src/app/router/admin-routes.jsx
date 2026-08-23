import { lazy } from 'react';

// Admin Module Pages
export const AdminDashboardPage = lazy(() => import('../../modules/admin/dashboard/AdminDashboardPage'));
export const UsersPage = lazy(() => import('../../modules/admin/users/UsersPage'));
export const PropertyModerationPage = lazy(() => import('../../modules/admin/properties/PropertyModerationPage'));
export const ReportedIssuesPage = lazy(() => import('../../modules/admin/reports/ReportedIssuesPage'));
export const RevenuePage = lazy(() => import('../../modules/admin/revenue/RevenuePage'));
export const AuditLogPage = lazy(() => import('../../modules/admin/audit-log/AuditLogPage'));
export const BroadcastPage = lazy(() => import('../../modules/admin/notifications/BroadcastPage'));
export const ProfileSettingsPage = lazy(() => import('../../modules/admin/settings/ProfileSettingsPage'));
export const PlatformSettingsPage = lazy(() => import('../../modules/admin/settings/PlatformSettingsPage'));
export const BusinessProfileSettingsPage = lazy(() => import('../../modules/admin/settings/BusinessProfilePage'));
export const AdvancedSettingsPage = lazy(() => import('../../modules/admin/settings/AdvancedSettingsPage'));
