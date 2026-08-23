import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import usersData from '../../data/users.json';
import reportsData from '../../data/reports.json';

/**
 * Admin Store using Zustand
 * Manages platform user moderation, reported issues, and system settings.
 * Property moderation lives on useRentalStore instead of here, so property
 * data has a single source of truth.
 */

const DEFAULT_SETTINGS = {
  platformName: 'RentMe',
  supportEmail: 'support@rentme.ph',
  contactPhone: '+63 912 345 6789',
  platformDescription: 'Modern student accommodation platform in the Philippines',
  features: {
    userRegistration: true,
    propertyListings: true,
    onlineBooking: true,
    paymentProcessing: true,
    chatMessaging: true,
    reviewsRatings: true,
  },
  moderation: {
    autoApproveProperties: false,
    manualReviewRequired: true,
    approvalTimeLimit: '48',
  },
  email: {
    emailNotifications: true,
    marketingEmails: true,
  },
  business: {
    legalName: '',
    tradeName: 'RentMe',
    registrationNumber: '',
    taxId: '',
    businessAddress: '',
    supportPhone: '',
    logoUrl: '',
  },
  advanced: {
    maintenanceMode: false,
    maintenanceMessage: 'RentMe is undergoing scheduled maintenance. Please check back soon.',
    fileUploadMaxSizeMb: 10,
    maxImagesPerListing: 10,
    sessionTimeoutMinutes: 60,
    dataExportEnabled: true,
  },
};

const useAdminStore = create(
  devtools(
    persist(
      (set) => ({
        // State
        users: usersData,
        reports: reportsData,
        settings: DEFAULT_SETTINGS,

        // User moderation
        updateUserStatus: (userId, status) =>
          set((state) => ({
            users: state.users.map((user) =>
              user.id === userId ? { ...user, status } : user
            ),
          })),

        deleteUser: (userId) =>
          set((state) => ({
            users: state.users.filter((user) => user.id !== userId),
          })),

        // User bypass tier (direct create/edit, no owner-workflow gate)
        createUser: (user) =>
          set((state) => ({
            users: [
              {
                id: crypto.randomUUID(),
                status: 'active',
                joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                lastActive: 'Just now',
                ...user,
              },
              ...state.users,
            ],
          })),

        updateUser: (userId, updates) =>
          set((state) => ({
            users: state.users.map((u) => (u.id === userId ? { ...u, ...updates } : u)),
          })),

        // Report moderation
        resolveReport: (reportId) =>
          set((state) => ({
            reports: state.reports.map((report) =>
              report.id === reportId ? { ...report, status: 'resolved' } : report
            ),
          })),

        investigateReport: (reportId) =>
          set((state) => ({
            reports: state.reports.map((report) =>
              report.id === reportId ? { ...report, status: 'investigating' } : report
            ),
          })),

        deleteReport: (reportId) =>
          set((state) => ({
            reports: state.reports.filter((report) => report.id !== reportId),
          })),

        // Report buildup tier (admin-logged reports, e.g. phone/email support intake)
        addReport: (report) =>
          set((state) => ({
            reports: [
              { id: crypto.randomUUID(), status: 'open', created: new Date().toLocaleString(), ...report },
              ...state.reports,
            ],
          })),

        updateReport: (reportId, updates) =>
          set((state) => ({
            reports: state.reports.map((r) => (r.id === reportId ? { ...r, ...updates } : r)),
          })),

        // Settings
        updateSettings: (updates) =>
          set((state) => ({
            settings: { ...state.settings, ...updates },
          })),
      }),
      {
        name: 'admin-storage',
        partialize: (state) => ({
          users: state.users,
          reports: state.reports,
          settings: state.settings,
        }),
      }
    ),
    { name: 'AdminStore' }
  )
);

export default useAdminStore;
