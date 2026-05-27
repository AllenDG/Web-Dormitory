import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import rentalListingData from '../../data/rentalListing.json';

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

        addRental: (rental) =>
          set((state) => ({
            rentals: [...state.rentals, { ...rental, id: Date.now().toString() }],
          })),

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
              matchesCity
            );
          });
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
        }),
      }
    ),
    { name: 'RentalStore' }
  )
);

export default useRentalStore;
