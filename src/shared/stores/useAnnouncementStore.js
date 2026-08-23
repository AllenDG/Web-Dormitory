import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import useAdminStore from './useAdminStore';
import useNotificationStore from './useNotificationStore';

/**
 * Announcement Store using Zustand
 * Admin-authored platform-wide broadcasts (maintenance/incident/enhancement
 * notices) fanned out to Owners and/or Tenants. Each broadcast writes one
 * useNotificationStore entry per matching recipient (same cross-store call
 * convention useRentalStore.approveProperty already uses for single-user
 * notifications), so the existing bell-icon NotificationCenter needs no
 * changes to render them. Only warning/error severities are surfaced as a
 * dismissible banner (see getActiveBannerAnnouncement) — info/success still
 * create bell notifications but don't interrupt the page.
 */

const audienceMatchesRole = (audience, role) => {
  if (audience === 'all') return role === 'owner' || role === 'tenant';
  if (audience === 'owners') return role === 'owner';
  if (audience === 'tenants') return role === 'tenant';
  return false;
};

const useAnnouncementStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        announcements: [],
        dismissedBy: {}, // { [announcementId]: string[] recipientEmails }

        // Actions
        broadcastAnnouncement: ({ title, message, severity, audience, expiresAt, createdByEmail, createdByName }) => {
          const announcement = {
            id: crypto.randomUUID(),
            title,
            message,
            severity,
            audience,
            createdAt: new Date().toISOString(),
            createdByEmail,
            createdByName,
            expiresAt: expiresAt || null,
          };

          set((state) => ({
            announcements: [announcement, ...state.announcements],
          }));

          const targets = useAdminStore
            .getState()
            .users.filter((u) => audienceMatchesRole(audience, u.role));

          targets.forEach((user) => {
            useNotificationStore.getState().addNotification({
              recipientEmail: user.email,
              type: 'alert',
              title,
              message,
              actionUrl: null,
            });
          });

          return { announcement, recipientCount: targets.length };
        },

        dismissAnnouncement: (announcementId, recipientEmail) =>
          set((state) => ({
            dismissedBy: {
              ...state.dismissedBy,
              [announcementId]: [...(state.dismissedBy[announcementId] || []), recipientEmail],
            },
          })),

        getActiveBannerAnnouncement: (recipientEmail, role) => {
          const { announcements, dismissedBy } = get();
          const now = Date.now();

          return (
            announcements
              .filter((a) => a.severity === 'warning' || a.severity === 'error')
              .filter((a) => audienceMatchesRole(a.audience, role))
              .filter((a) => !a.expiresAt || new Date(a.expiresAt).getTime() > now)
              .filter((a) => !(dismissedBy[a.id] || []).includes(recipientEmail))
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null
          );
        },
      }),
      {
        name: 'announcement-storage',
        partialize: (state) => ({
          announcements: state.announcements,
          dismissedBy: state.dismissedBy,
        }),
      }
    ),
    { name: 'AnnouncementStore' }
  )
);

export default useAnnouncementStore;
