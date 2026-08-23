import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import rentalListingData from '../../data/rentalListing.json';
import useNotificationStore from './useNotificationStore';
import { isTenantVisible } from '../utils/moderation';

/**
 * Modern Rental Store using Zustand
 * Replaces Redux with simpler, more performant state management
 */
const useRentalStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        rentals: rentalListingData,
        filters: {
          searchQuery: '',
          priceRange: [0, 10000],
          amenities: [],
          bedType: '',
          city: '',
        },
        selectedRental: null,
        favorites: [],

        // Actions
        setRentals: (rentals) => set({ rentals }),

        addRental: (rental) => {
          const newRental = { ...rental, id: crypto.randomUUID() };
          set((state) => ({ rentals: [...state.rentals, newRental] }));

          if (newRental.ownerEmail) {
            useNotificationStore.getState().addNotification({
              recipientEmail: newRental.ownerEmail,
              type: 'alert',
              title: 'New Listing Added',
              message: `${newRental.title} was added to your properties.`,
              actionUrl: '/owner/properties',
            });
          }
        },

        updateRental: (id, updates) =>
          set((state) => ({
            rentals: state.rentals.map((rental) =>
              rental.id === id ? { ...rental, ...updates } : rental
            ),
          })),

        deleteRental: (id) =>
          set((state) => ({
            rentals: state.rentals.filter((rental) => rental.id !== id),
          })),

        approveProperty: (id) => {
          set((state) => ({
            rentals: state.rentals.map((rental) =>
              rental.id === id ? { ...rental, moderationStatus: 'approved' } : rental
            ),
          }));

          const rental = get().getRentalById(id);
          if (rental?.ownerEmail) {
            useNotificationStore.getState().addNotification({
              recipientEmail: rental.ownerEmail,
              type: 'alert',
              title: 'Property Approved',
              message: `${rental.title} has been approved and is now live.`,
              actionUrl: '/owner/properties',
            });
          }
        },

        rejectProperty: (id, reason = '') => {
          set((state) => ({
            rentals: state.rentals.map((rental) =>
              rental.id === id
                ? { ...rental, moderationStatus: 'rejected', rejectionReason: reason }
                : rental
            ),
          }));

          const rental = get().getRentalById(id);
          if (rental?.ownerEmail) {
            useNotificationStore.getState().addNotification({
              recipientEmail: rental.ownerEmail,
              type: 'alert',
              title: 'Property Rejected',
              message: `${rental.title} was rejected.${reason ? ` Reason: ${reason}` : ''}`,
              actionUrl: '/owner/properties',
            });
          }
        },

        // Units — optional per-property sub-listings (e.g. a dorm building
        // with several rooms at different prices). A rental with no `units`
        // is treated as a single-unit property everywhere else in the app.
        addUnit: (rentalId, unit) =>
          set((state) => ({
            rentals: state.rentals.map((rental) =>
              rental.id === rentalId
                ? {
                    ...rental,
                    units: [...(rental.units || []), { ...unit, id: crypto.randomUUID() }],
                  }
                : rental
            ),
          })),

        updateUnit: (rentalId, unitId, updates) =>
          set((state) => ({
            rentals: state.rentals.map((rental) =>
              rental.id === rentalId
                ? {
                    ...rental,
                    units: (rental.units || []).map((unit) =>
                      unit.id === unitId ? { ...unit, ...updates } : unit
                    ),
                  }
                : rental
            ),
          })),

        deleteUnit: (rentalId, unitId) =>
          set((state) => ({
            rentals: state.rentals.map((rental) =>
              rental.id === rentalId
                ? { ...rental, units: (rental.units || []).filter((unit) => unit.id !== unitId) }
                : rental
            ),
          })),

        // Filters
        setFilters: (filters) =>
          set((state) => ({
            filters: { ...state.filters, ...filters },
          })),

        resetFilters: () =>
          set({
            filters: {
              searchQuery: '',
              priceRange: [0, 10000],
              amenities: [],
              bedType: '',
              city: '',
            },
          }),

        // Filtered rentals (computed)
        getFilteredRentals: () => {
          const { rentals, filters } = get();
          return rentals.filter((rental) => {
            const matchesSearch =
              !filters.searchQuery ||
              rental.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
              rental.city.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
              rental.address.toLowerCase().includes(filters.searchQuery.toLowerCase());

            const matchesPrice =
              rental.price >= filters.priceRange[0] &&
              rental.price <= filters.priceRange[1];

            const matchesAmenities =
              filters.amenities.length === 0 ||
              filters.amenities.every((amenity) =>
                rental.amenities.includes(amenity)
              );

            const matchesBedType =
              !filters.bedType || rental.bedType === filters.bedType;

            const matchesCity =
              !filters.city || rental.city.toLowerCase() === filters.city.toLowerCase();

            return (
              matchesSearch &&
              matchesPrice &&
              matchesAmenities &&
              matchesBedType &&
              matchesCity &&
              isTenantVisible(rental)
            );
          });
        },

        // All tenant-visible rentals, unfiltered by search/price/etc — for
        // components that read the raw `rentals` array directly instead of
        // going through getFilteredRentals (e.g. recommendation widgets).
        getVisibleRentals: () => {
          const { rentals } = get();
          return rentals.filter(isTenantVisible);
        },

        // Selected rental
        setSelectedRental: (rental) => set({ selectedRental: rental }),

        getRentalById: (id) => {
          const { rentals } = get();
          return rentals.find((rental) => rental.id === id);
        },

        // Favorites
        toggleFavorite: (id) =>
          set((state) => ({
            favorites: state.favorites.includes(id)
              ? state.favorites.filter((favId) => favId !== id)
              : [...state.favorites, id],
          })),

        isFavorite: (id) => {
          const { favorites } = get();
          return favorites.includes(id);
        },

        getFavoriteRentals: () => {
          const { rentals, favorites } = get();
          return rentals.filter((rental) => favorites.includes(rental.id));
        },
      }),
      {
        name: 'rental-storage',
        partialize: (state) => ({
          favorites: state.favorites,
          rentals: state.rentals,
        }),
      }
    ),
    { name: 'RentalStore' }
  )
);

export default useRentalStore;
