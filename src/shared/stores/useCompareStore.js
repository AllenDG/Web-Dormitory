import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import useRentalStore from './useRentalStore';

/**
 * Compare Store using Zustand
 * Manages property comparison list and operations
 * 
 * @module stores/useCompareStore
 */

const useCompareStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        compareList: [], // Array of property IDs (max 4)
        maxCompare: 4,

        // Computed Getters

        /**
         * Get count of properties in comparison
         * @returns {number} Number of properties
         */
        getCompareCount: () => {
          const { compareList } = get();
          return compareList.length;
        },

        /**
         * Check if can add more properties
         * @returns {boolean} True if can add more
         */
        canAddMore: () => {
          const { compareList, maxCompare } = get();
          return compareList.length < maxCompare;
        },

        /**
         * Check if has any properties
         * @returns {boolean} True if has properties
         */
        hasProperties: () => {
          const { compareList } = get();
          return compareList.length > 0;
        },

        /**
         * Get full property objects from rental store
         * @returns {Array} Array of property objects
         */
        getCompareProperties: () => {
          const { compareList } = get();
          const rentalStore = useRentalStore.getState();
          
          return compareList
            .map((id) => rentalStore.getRentalById(id))
            .filter(Boolean); // Filter out any null/undefined (deleted properties)
        },

        // Actions

        /**
         * Add property to comparison
         * @param {string} propertyId - Property ID to add
         * @returns {boolean} True if added successfully
         */
        addToCompare: (propertyId) => {
          const { compareList, maxCompare, isInCompare } = get();

          // Check if already in comparison
          if (isInCompare(propertyId)) {
            return false;
          }

          // Check if limit reached
          if (compareList.length >= maxCompare) {
            return false;
          }

          // Verify property exists
          const rentalStore = useRentalStore.getState();
          const property = rentalStore.getRentalById(propertyId);
          if (!property) {
            return false;
          }

          set((state) => ({
            compareList: [...state.compareList, propertyId],
          }));

          return true;
        },

        /**
         * Remove property from comparison
         * @param {string} propertyId - Property ID to remove
         * @returns {boolean} True if removed successfully
         */
        removeFromCompare: (propertyId) => {
          const { compareList } = get();

          if (!compareList.includes(propertyId)) {
            return false;
          }

          set((state) => ({
            compareList: state.compareList.filter((id) => id !== propertyId),
          }));

          return true;
        },

        /**
         * Toggle property in/out of comparison
         * @param {string} propertyId - Property ID to toggle
         * @returns {boolean} True if added, false if removed
         */
        toggleCompare: (propertyId) => {
          const { isInCompare, addToCompare, removeFromCompare } = get();

          if (isInCompare(propertyId)) {
            removeFromCompare(propertyId);
            return false;
          } else {
            return addToCompare(propertyId);
          }
        },

        /**
         * Clear all properties from comparison
         */
        clearCompare: () => {
          set({ compareList: [] });
        },

        /**
         * Check if property is in comparison
         * @param {string} propertyId - Property ID to check
         * @returns {boolean} True if in comparison
         */
        isInCompare: (propertyId) => {
          const { compareList } = get();
          return compareList.includes(propertyId);
        },

        /**
         * Get property position in comparison (0-indexed)
         * @param {string} propertyId - Property ID
         * @returns {number} Position or -1 if not found
         */
        getPropertyPosition: (propertyId) => {
          const { compareList } = get();
          return compareList.indexOf(propertyId);
        },

        /**
         * Check if limit is reached
         * @returns {boolean} True if limit reached
         */
        isLimitReached: () => {
          const { compareList, maxCompare } = get();
          return compareList.length >= maxCompare;
        },

        /**
         * Get remaining slots
         * @returns {number} Number of remaining slots
         */
        getRemainingSlots: () => {
          const { compareList, maxCompare } = get();
          return maxCompare - compareList.length;
        },

        /**
         * Clean up deleted properties from comparison
         * Removes property IDs that no longer exist in rental store
         * @returns {number} Number of properties removed
         */
        cleanupDeletedProperties: () => {
          const { compareList } = get();
          const rentalStore = useRentalStore.getState();
          
          const validProperties = compareList.filter((id) => {
            const property = rentalStore.getRentalById(id);
            return property !== undefined;
          });

          const removedCount = compareList.length - validProperties.length;

          if (removedCount > 0) {
            set({ compareList: validProperties });
          }

          return removedCount;
        },

        /**
         * Replace property in comparison
         * @param {string} oldPropertyId - Property ID to replace
         * @param {string} newPropertyId - New property ID
         * @returns {boolean} True if replaced successfully
         */
        replaceProperty: (oldPropertyId, newPropertyId) => {
          const { compareList, isInCompare } = get();

          // Check if old property is in comparison
          if (!isInCompare(oldPropertyId)) {
            return false;
          }

          // Check if new property already in comparison
          if (isInCompare(newPropertyId)) {
            return false;
          }

          // Verify new property exists
          const rentalStore = useRentalStore.getState();
          const property = rentalStore.getRentalById(newPropertyId);
          if (!property) {
            return false;
          }

          set((state) => ({
            compareList: state.compareList.map((id) =>
              id === oldPropertyId ? newPropertyId : id
            ),
          }));

          return true;
        },

        /**
         * Get comparison statistics
         * @returns {Object} Statistics object
         */
        getCompareStats: () => {
          const { compareList, maxCompare } = get();
          const properties = get().getCompareProperties();

          if (properties.length === 0) {
            return null;
          }

          // Calculate price range
          const prices = properties.map((p) => p.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);

          // Calculate average rating (if reviews exist)
          const ratings = properties
            .map((p) => p.rating)
            .filter((r) => r !== undefined && r !== null);
          const avgRating = ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
            : null;

          // Get unique cities
          const cities = [...new Set(properties.map((p) => p.city))];

          // Get unique bed types
          const bedTypes = [...new Set(properties.map((p) => p.bedType))];

          return {
            count: compareList.length,
            maxCompare,
            remainingSlots: maxCompare - compareList.length,
            priceRange: { min: minPrice, max: maxPrice },
            avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
            cities,
            bedTypes,
          };
        },
      }),
      {
        name: 'compare-storage',
        partialize: (state) => ({
          compareList: state.compareList,
        }),
      }
    ),
    { name: 'CompareStore' }
  )
);

export default useCompareStore;
