import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * UI State Store
 * Manages global UI state like modals, drawers, loading states
 */
const useUIStore = create(
  devtools(
    (set) => ({
      // Mobile menu
      isMobileMenuOpen: false,
      toggleMobileMenu: () =>
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),

      // Modals
      activeModal: null,
      modalData: null,
      openModal: (modalName, data = null) =>
        set({ activeModal: modalName, modalData: data }),
      closeModal: () => set({ activeModal: null, modalData: null }),

      // Loading states
      isLoading: false,
      loadingMessage: '',
      setLoading: (isLoading, message = '') =>
        set({ isLoading, loadingMessage: message }),

      // Toast notifications
      toasts: [],
      addToast: (toast) =>
        set((state) => ({
          toasts: [
            ...state.toasts,
            { id: Date.now(), ...toast, timestamp: Date.now() },
          ],
        })),
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),

      // Sidebar (for owner/admin portals)
      isSidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

      // Search overlay
      isSearchOpen: false,
      toggleSearch: () =>
        set((state) => ({ isSearchOpen: !state.isSearchOpen })),
      closeSearch: () => set({ isSearchOpen: false }),
    }),
    { name: 'UIStore' }
  )
);

export default useUIStore;
