import { lazy } from 'react';

// Admin Module Pages
export const AdminDashboardPage = lazy(() => import('../../modules/admin/dashboard/AdminDashboardPage'));
export const UsersPage = lazy(() => import('../../modules/admin/users/UsersPage'));
export const PropertyModerationPage = lazy(() => import('../../modules/admin/properties/PropertyModerationPage'));
export const ReportedIssuesPage = lazy(() => import('../../modules/admin/reports/ReportedIssuesPage'));
export const RevenuePage = lazy(() => import('../../modules/admin/revenue/RevenuePage'));
export const AuditLogPage = lazy(() => import('../../modules/admin/audit-log/AuditLogPage'));
export const ProfileSettingsPage = lazy(() => import('../../modules/admin/settings/ProfileSettingsPage'));
export const PlatformSettingsPage = lazy(() => import('../../modules/admin/settings/PlatformSettingsPage'));
