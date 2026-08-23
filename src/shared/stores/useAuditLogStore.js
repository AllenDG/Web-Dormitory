import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Audit Log Store
 * Records admin/owner actions taken through the app (user status changes,
 * property moderation, report resolution, settings updates). Log writes
 * happen at the calling component's action handler, right after the real
 * store action — the acting user's identity lives in AuthProvider's React
 * context, not in a Zustand store, so stores shouldn't reach into it.
 */

const MAX_LOGS = 500;

const useAuditLogStore = create(
  devtools(
    persist(
      (set) => ({
        logs: [],

        logAction: ({ actorEmail, actorName, action, target, details }) =>
          set((state) => ({
            logs: [
              {
                id: crypto.randomUUID(),
                actorEmail,
                actorName,
                action,
                target,
                details,
                timestamp: new Date().toISOString(),
              },
              ...state.logs,
            ].slice(0, MAX_LOGS),
          })),

        clearLogs: () => set({ logs: [] }),
      }),
      { name: 'audit-log-storage' }
    ),
    { name: 'AuditLogStore' }
  )
);

export default useAuditLogStore;
