/**
 * Role-Based Access Control (RBAC) Permissions
 * Define what each role can do
 */

// User Roles
export const ROLES = {
  GUEST: 'guest',
  TENANT: 'tenant',
  OWNER: 'owner',
  ADMIN: 'admin',
};

// Permissions
export const PERMISSIONS = {
  // Properties
  VIEW_PROPERTIES: 'view_properties',
  CREATE_PROPERTY: 'create_property',
  EDIT_PROPERTY: 'edit_property',
  DELETE_PROPERTY: 'delete_property',
  MODERATE_PROPERTY: 'moderate_property',

  // Bookings
  CREATE_BOOKING: 'create_booking',
  VIEW_OWN_BOOKINGS: 'view_own_bookings',
  VIEW_ALL_BOOKINGS: 'view_all_bookings',
  CANCEL_BOOKING: 'cancel_booking',
  APPROVE_BOOKING: 'approve_booking',

  // Users
  VIEW_OWN_PROFILE: 'view_own_profile',
  EDIT_OWN_PROFILE: 'edit_own_profile',
  VIEW_ALL_USERS: 'view_all_users',
  EDIT_USER: 'edit_user',
  DELETE_USER: 'delete_user',
  SUSPEND_USER: 'suspend_user',

  // Payments
  MAKE_PAYMENT: 'make_payment',
  VIEW_OWN_TRANSACTIONS: 'view_own_transactions',
  VIEW_ALL_TRANSACTIONS: 'view_all_transactions',
  PROCESS_PAYOUT: 'process_payout',

  // Reviews
  WRITE_REVIEW: 'write_review',
  DELETE_OWN_REVIEW: 'delete_own_review',
  DELETE_ANY_REVIEW: 'delete_any_review',

  // Chat
  SEND_MESSAGE: 'send_message',
  VIEW_OWN_MESSAGES: 'view_own_messages',
  VIEW_ALL_MESSAGES: 'view_all_messages',

  // Admin
  ACCESS_ADMIN_PANEL: 'access_admin_panel',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_AUDIT_LOGS: 'view_audit_logs',
};

// Role -> Permissions mapping
export const ROLE_PERMISSIONS = {
  [ROLES.GUEST]: [
    PERMISSIONS.VIEW_PROPERTIES,
  ],

  [ROLES.TENANT]: [
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.CREATE_BOOKING,
    PERMISSIONS.VIEW_OWN_BOOKINGS,
    PERMISSIONS.CANCEL_BOOKING,
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.EDIT_OWN_PROFILE,
    PERMISSIONS.MAKE_PAYMENT,
    PERMISSIONS.VIEW_OWN_TRANSACTIONS,
    PERMISSIONS.WRITE_REVIEW,
    PERMISSIONS.DELETE_OWN_REVIEW,
    PERMISSIONS.SEND_MESSAGE,
    PERMISSIONS.VIEW_OWN_MESSAGES,
  ],

  [ROLES.OWNER]: [
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.CREATE_PROPERTY,
    PERMISSIONS.EDIT_PROPERTY,
    PERMISSIONS.DELETE_PROPERTY,
    PERMISSIONS.VIEW_ALL_BOOKINGS,
    PERMISSIONS.APPROVE_BOOKING,
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.EDIT_OWN_PROFILE,
    PERMISSIONS.VIEW_OWN_TRANSACTIONS,
    PERMISSIONS.PROCESS_PAYOUT,
    PERMISSIONS.SEND_MESSAGE,
    PERMISSIONS.VIEW_OWN_MESSAGES,
  ],

  [ROLES.ADMIN]: [
    // Admin has all permissions
    ...Object.values(PERMISSIONS),
  ],
};

/**
 * Check if a role has a specific permission
 */
export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
};

/**
 * Check if a role has any of the specified permissions
 */
export const hasAnyPermission = (role, permissions) => {
  if (!role || !permissions || !Array.isArray(permissions)) return false;
  return permissions.some((permission) => hasPermission(role, permission));
};

/**
 * Check if a role has all of the specified permissions
 */
export const hasAllPermissions = (role, permissions) => {
  if (!role || !permissions || !Array.isArray(permissions)) return false;
  return permissions.every((permission) => hasPermission(role, permission));
};

/**
 * Get all permissions for a role
 */
export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

export default {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
};
