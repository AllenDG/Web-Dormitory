import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Visit Store
 * 
 * Manages visit requests and scheduling
 * Uses Zustand for state management with persistence
 * 
 * Features:
 * - Visit request management
 * - Status tracking (pending, approved, rejected, completed, cancelled)
 * - Owner approval workflow
 * - Alternative schedule suggestions
 * - Visit history
 * 
 * @store
 */

// Visit statuses
export const VISIT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RESCHEDULED: 'rescheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Mock visits for development
const MOCK_VISITS = [
  {
    id: 'visit_1',
    propertyId: '1',
    propertyTitle: 'Cozy Studio near University',
    propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    tenantId: '1',
    tenantName: 'Juan Dela Cruz',
    tenantEmail: 'juan@email.com',
    tenantPhone: '+63 912 345 6789',
    ownerId: '2',
    ownerName: 'Maria Santos',
    preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    preferredTime: '10:00 AM',
    reason: 'I am a student looking for accommodation near the university',
    additionalNotes: 'I would like to see the room and common areas',
    status: VISIT_STATUS.PENDING,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    alternativeSchedules: [],
    ownerNotes: null,
    completionNotes: null,
    rating: null,
  },
];

const useVisitStore = create(
  persist(
    (set, get) => ({
      // State
      visits: MOCK_VISITS,
      isLoading: false,
      error: null,

      // Actions

      /**
       * Get all visits for current user
       */
      getVisits: (userId, role = 'tenant') => {
        const { visits } = get();
        if (role === 'tenant') {
          return visits.filter((v) => v.tenantId === userId);
        } else if (role === 'owner') {
          return visits.filter((v) => v.ownerId === userId);
        }
        return visits;
      },

      /**
       * Get visit by ID
       */
      getVisitById: (visitId) => {
        const { visits } = get();
        return visits.find((v) => v.id === visitId);
      },

      /**
       * Get visits by property
       */
      getVisitsByProperty: (propertyId) => {
        const { visits } = get();
        return visits.filter((v) => v.propertyId === propertyId);
      },

      /**
       * Get visits by status
       */
      getVisitsByStatus: (status, userId, role = 'tenant') => {
        const { visits } = get();
        let filtered = visits.filter((v) => v.status === status);
        
        if (role === 'tenant') {
          filtered = filtered.filter((v) => v.tenantId === userId);
        } else if (role === 'owner') {
          filtered = filtered.filter((v) => v.ownerId === userId);
        }
        
        return filtered;
      },

      /**
       * Create visit request
       */
      createVisit: async (visitData) => {
        try {
          set({ isLoading: true, error: null });

          // Mock API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          const newVisit = {
            id: `visit_${Date.now()}`,
            ...visitData,
            status: VISIT_STATUS.PENDING,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            alternativeSchedules: [],
            ownerNotes: null,
            completionNotes: null,
            rating: null,
          };

          set((state) => ({
            visits: [newVisit, ...state.visits],
            isLoading: false,
          }));

          return { success: true, visit: newVisit };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      /**
       * Update visit status (Owner action)
       */
      updateVisitStatus: async (visitId, status, ownerNotes = null) => {
        try {
          set({ isLoading: true, error: null });

          // Mock API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          set((state) => ({
            visits: state.visits.map((v) =>
              v.id === visitId
                ? {
                    ...v,
                    status,
                    ownerNotes,
                    updatedAt: new Date().toISOString(),
                  }
                : v
            ),
            isLoading: false,
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      /**
       * Suggest alternative schedule (Owner action)
       */
      suggestAlternativeSchedule: async (visitId, alternativeDate, alternativeTime, notes) => {
        try {
          set({ isLoading: true, error: null });

          // Mock API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          const alternative = {
            id: `alt_${Date.now()}`,
            date: alternativeDate,
            time: alternativeTime,
            notes,
            createdAt: new Date().toISOString(),
          };

          set((state) => ({
            visits: state.visits.map((v) =>
              v.id === visitId
                ? {
                    ...v,
                    status: VISIT_STATUS.RESCHEDULED,
                    alternativeSchedules: [...v.alternativeSchedules, alternative],
                    updatedAt: new Date().toISOString(),
                  }
                : v
            ),
            isLoading: false,
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      /**
       * Accept alternative schedule (Tenant action)
       */
      acceptAlternativeSchedule: async (visitId, alternativeId) => {
        try {
          set({ isLoading: true, error: null });

          // Mock API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          set((state) => ({
            visits: state.visits.map((v) => {
              if (v.id === visitId) {
                const alternative = v.alternativeSchedules.find((a) => a.id === alternativeId);
                if (alternative) {
                  return {
                    ...v,
                    preferredDate: alternative.date,
                    preferredTime: alternative.time,
                    status: VISIT_STATUS.APPROVED,
                    updatedAt: new Date().toISOString(),
                  };
                }
              }
              return v;
            }),
            isLoading: false,
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      /**
       * Cancel visit (Tenant action)
       */
      cancelVisit: async (visitId, reason) => {
        try {
          set({ isLoading: true, error: null });

          // Mock API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          set((state) => ({
            visits: state.visits.map((v) =>
              v.id === visitId
                ? {
                    ...v,
                    status: VISIT_STATUS.CANCELLED,
                    completionNotes: reason,
                    updatedAt: new Date().toISOString(),
                  }
                : v
            ),
            isLoading: false,
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      /**
       * Complete visit with feedback (Tenant action)
       */
      completeVisit: async (visitId, rating, notes) => {
        try {
          set({ isLoading: true, error: null });

          // Mock API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          set((state) => ({
            visits: state.visits.map((v) =>
              v.id === visitId
                ? {
                    ...v,
                    status: VISIT_STATUS.COMPLETED,
                    rating,
                    completionNotes: notes,
                    updatedAt: new Date().toISOString(),
                  }
                : v
            ),
            isLoading: false,
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      /**
       * Get upcoming visits
       */
      getUpcomingVisits: (userId, role = 'tenant') => {
        const { visits } = get();
        const now = new Date();
        
        let filtered = visits.filter((v) => {
          const visitDate = new Date(v.preferredDate);
          return visitDate >= now && v.status === VISIT_STATUS.APPROVED;
        });

        if (role === 'tenant') {
          filtered = filtered.filter((v) => v.tenantId === userId);
        } else if (role === 'owner') {
          filtered = filtered.filter((v) => v.ownerId === userId);
        }

        return filtered.sort((a, b) => new Date(a.preferredDate) - new Date(b.preferredDate));
      },

      /**
       * Get past visits
       */
      getPastVisits: (userId, role = 'tenant') => {
        const { visits } = get();
        const now = new Date();
        
        let filtered = visits.filter((v) => {
          const visitDate = new Date(v.preferredDate);
          return visitDate < now || v.status === VISIT_STATUS.COMPLETED;
        });

        if (role === 'tenant') {
          filtered = filtered.filter((v) => v.tenantId === userId);
        } else if (role === 'owner') {
          filtered = filtered.filter((v) => v.ownerId === userId);
        }

        return filtered.sort((a, b) => new Date(b.preferredDate) - new Date(a.preferredDate));
      },

      /**
       * Get pending visits count
       */
      getPendingCount: (userId, role = 'owner') => {
        const { visits } = get();
        return visits.filter(
          (v) => v.status === VISIT_STATUS.PENDING && v.ownerId === userId
        ).length;
      },

      /**
       * Clear all visits
       */
      clearVisits: () => {
        set({ visits: [], error: null });
      },
    }),
    {
      name: 'rentme-visit-storage',
      partialize: (state) => ({
        visits: state.visits,
      }),
    }
  )
);

export default useVisitStore;
