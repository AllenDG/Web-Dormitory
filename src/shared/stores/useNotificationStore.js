import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Notification Store using Zustand
 * Central place for in-app notifications. Other stores push into this one via
 * `useNotificationStore.getState().addNotification(...)` when a real event
 * happens (booking approved, payment verified, property moderated, etc.),
 * so notifications are event-driven instead of a disconnected mock list.
 */

const useNotificationStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        notifications: [],

        // Actions
        addNotification: ({ recipientEmail, type, title, message, actionUrl }) =>
          set((state) => ({
            notifications: [
              {
                id: crypto.randomUUID(),
                recipientEmail,
                type,
                title,
                message,
                actionUrl,
                timestamp: new Date().toISOString(),
                read: false,
              },
              ...state.notifications,
            ],
          })),

        markAsRead: (id) =>
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
          })),

        markAllAsRead: (recipientEmail) =>
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.recipientEmail === recipientEmail ? { ...n, read: true } : n
            ),
          })),

        deleteNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          })),

        clearAll: (recipientEmail) =>
          set((state) => ({
            notifications: state.notifications.filter(
              (n) => n.recipientEmail !== recipientEmail
            ),
          })),

        getNotificationsForUser: (recipientEmail) => {
          const { notifications } = get();
          return notifications.filter((n) => n.recipientEmail === recipientEmail);
        },
      }),
      {
        name: 'notification-storage',
        partialize: (state) => ({
          notifications: state.notifications,
        }),
      }
    ),
    { name: 'NotificationStore' }
  )
);

export default useNotificationStore;
