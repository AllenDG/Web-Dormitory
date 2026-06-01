import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Recommendation Store using Zustand
 * Manages user preferences, viewing history, and property recommendations
 * 
 * @module stores/useRecommendationStore
 */

// Property type constants
export const PROPERTY_TYPES = {
  DORM: 'dorm',
  APARTMENT: 'apartment',
  STUDIO: 'studio',
  CONDO: 'condo',
  BEDSPACE: 'bedspace',
  ROOM: 'room',
};

// Stay duration constants
export const STAY_DURATION = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  SIX_MONTHS: '6months',
  ONE_YEAR: '1year',
};

const useRecommendationStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        userPreferences: {
          propertyTypes: [],
          budgetMin: 0,
          budgetMax: 50000,
          preferredLocations: [],
          stayDuration: null,
          amenities: [],
          hasCompletedWizard: false,
        },
        viewingHistory: [],
        searchHistory: [],
        recommendations: [],
        similarProperties: {},
        
        // Actions

        /**
         * Set user preferences from wizard
         * @param {Object} preferences - User preferences object
         */
        setUserPreferences: (preferences) =>
          set((state) => ({
            userPreferences: {
              ...state.userPreferences,
              ...preferences,
              hasCompletedWizard: true,
              updatedAt: new Date().toISOString(),
            },
          })),

        /**
         * Update specific preference
         * @param {string} key - Preference key
         * @param {any} value - Preference value
         */
        updatePreference: (key, value) =>
          set((state) => ({
            userPreferences: {
              ...state.userPreferences,
              [key]: value,
              updatedAt: new Date().toISOString(),
            },
          })),

        /**
         * Add property to viewing history
         * @param {Object} property - Property object
         */
        addToViewingHistory: (property) =>
          set((state) => {
            const existingIndex = state.viewingHistory.findIndex(
              (item) => item.id === property.id
            );

            let newHistory;
            if (existingIndex !== -1) {
              // Update view count and timestamp
              newHistory = [...state.viewingHistory];
              newHistory[existingIndex] = {
                ...newHistory[existingIndex],
                viewCount: (newHistory[existingIndex].viewCount || 1) + 1,
                lastViewedAt: new Date().toISOString(),
              };
            } else {
              // Add new entry
              newHistory = [
                {
                  ...property,
                  viewCount: 1,
                  firstViewedAt: new Date().toISOString(),
                  lastViewedAt: new Date().toISOString(),
                },
                ...state.viewingHistory,
              ].slice(0, 50); // Keep last 50 viewed properties
            }

            return { viewingHistory: newHistory };
          }),

        /**
         * Add search query to history
         * @param {Object} searchQuery - Search query object
         */
        addToSearchHistory: (searchQuery) =>
          set((state) => ({
            searchHistory: [
              {
                ...searchQuery,
                timestamp: new Date().toISOString(),
              },
              ...state.searchHistory,
            ].slice(0, 20), // Keep last 20 searches
          })),

        /**
         * Generate recommendations based on user data
         * @param {Array} allProperties - All available properties
         * @returns {Array} Recommended properties
         */
        generateRecommendations: (allProperties) => {
          const { userPreferences, viewingHistory, searchHistory } = get();
          
          if (!allProperties || allProperties.length === 0) {
            return [];
          }

          // Score each property based on multiple factors
          const scoredProperties = allProperties.map((property) => {
            let score = 0;

            // Factor 1: Property type match (30 points)
            if (userPreferences.propertyTypes.includes(property.type)) {
              score += 30;
            }

            // Factor 2: Budget match (25 points)
            const price = property.price || 0;
            if (price >= userPreferences.budgetMin && price <= userPreferences.budgetMax) {
              score += 25;
              // Bonus for being in sweet spot (middle 50% of budget)
              const budgetRange = userPreferences.budgetMax - userPreferences.budgetMin;
              const sweetSpotMin = userPreferences.budgetMin + budgetRange * 0.25;
              const sweetSpotMax = userPreferences.budgetMax - budgetRange * 0.25;
              if (price >= sweetSpotMin && price <= sweetSpotMax) {
                score += 10;
              }
            }

            // Factor 3: Location match (20 points)
            if (userPreferences.preferredLocations.some(
              (loc) => property.location?.toLowerCase().includes(loc.toLowerCase())
            )) {
              score += 20;
            }

            // Factor 4: Amenities match (15 points)
            const matchingAmenities = userPreferences.amenities.filter((amenity) =>
              property.amenities?.some((a) => a.toLowerCase().includes(amenity.toLowerCase()))
            );
            score += Math.min(matchingAmenities.length * 3, 15);

            // Factor 5: Viewing history similarity (10 points)
            const viewedSimilar = viewingHistory.some(
              (viewed) =>
                viewed.type === property.type ||
                viewed.location === property.location ||
                Math.abs((viewed.price || 0) - price) < 2000
            );
            if (viewedSimilar) {
              score += 10;
            }

            // Factor 6: High rating bonus (5 points)
            if (property.rating >= 4.5) {
              score += 5;
            }

            // Factor 7: Availability bonus (5 points)
            if (property.isAvailable) {
              score += 5;
            }

            return {
              ...property,
              recommendationScore: score,
            };
          });

          // Sort by score and return top recommendations
          const recommendations = scoredProperties
            .filter((p) => p.recommendationScore > 20) // Minimum threshold
            .sort((a, b) => b.recommendationScore - a.recommendationScore)
            .slice(0, 12); // Top 12 recommendations

          set({ recommendations });
          return recommendations;
        },

        /**
         * Get similar properties based on a reference property
         * @param {Object} referenceProperty - Reference property
         * @param {Array} allProperties - All available properties
         * @param {number} limit - Number of similar properties to return
         * @returns {Array} Similar properties
         */
        getSimilarProperties: (referenceProperty, allProperties, limit = 6) => {
          if (!referenceProperty || !allProperties || allProperties.length === 0) {
            return [];
          }

          const scoredProperties = allProperties
            .filter((p) => p.id !== referenceProperty.id) // Exclude the reference property
            .map((property) => {
              let similarityScore = 0;

              // Same type (40 points)
              if (property.type === referenceProperty.type) {
                similarityScore += 40;
              }

              // Similar price (30 points)
              const priceDiff = Math.abs((property.price || 0) - (referenceProperty.price || 0));
              const priceRange = referenceProperty.price * 0.3; // 30% range
              if (priceDiff <= priceRange) {
                similarityScore += 30 * (1 - priceDiff / priceRange);
              }

              // Same location (20 points)
              if (property.location === referenceProperty.location) {
                similarityScore += 20;
              }

              // Similar amenities (10 points)
              const commonAmenities = property.amenities?.filter((a) =>
                referenceProperty.amenities?.includes(a)
              ).length || 0;
              const totalAmenities = Math.max(
                property.amenities?.length || 0,
                referenceProperty.amenities?.length || 0
              );
              if (totalAmenities > 0) {
                similarityScore += (commonAmenities / totalAmenities) * 10;
              }

              return {
                ...property,
                similarityScore,
              };
            });

          const similarProperties = scoredProperties
            .filter((p) => p.similarityScore > 30) // Minimum similarity threshold
            .sort((a, b) => b.similarityScore - a.similarityScore)
            .slice(0, limit);

          // Cache similar properties
          set((state) => ({
            similarProperties: {
              ...state.similarProperties,
              [referenceProperty.id]: similarProperties,
            },
          }));

          return similarProperties;
        },

        /**
         * Get recently viewed properties
         * @param {number} limit - Number of properties to return
         * @returns {Array} Recently viewed properties
         */
        getRecentlyViewed: (limit = 6) => {
          const { viewingHistory } = get();
          return viewingHistory
            .sort((a, b) => new Date(b.lastViewedAt) - new Date(a.lastViewedAt))
            .slice(0, limit);
        },

        /**
         * Get popular properties near user's preferred locations
         * @param {Array} allProperties - All available properties
         * @param {number} limit - Number of properties to return
         * @returns {Array} Popular nearby properties
         */
        getPopularNearby: (allProperties, limit = 6) => {
          const { userPreferences } = get();
          
          if (!userPreferences.preferredLocations.length) {
            // If no preferred locations, return top-rated properties
            return allProperties
              .filter((p) => p.rating >= 4.0)
              .sort((a, b) => b.rating - a.rating)
              .slice(0, limit);
          }

          const nearbyProperties = allProperties.filter((property) =>
            userPreferences.preferredLocations.some((loc) =>
              property.location?.toLowerCase().includes(loc.toLowerCase())
            )
          );

          return nearbyProperties
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, limit);
        },

        /**
         * Get budget-friendly matches
         * @param {Array} allProperties - All available properties
         * @param {number} limit - Number of properties to return
         * @returns {Array} Budget-friendly properties
         */
        getBudgetMatches: (allProperties, limit = 6) => {
          const { userPreferences } = get();
          
          const budgetProperties = allProperties.filter((property) => {
            const price = property.price || 0;
            return price >= userPreferences.budgetMin && price <= userPreferences.budgetMax;
          });

          return budgetProperties
            .sort((a, b) => (a.price || 0) - (b.price || 0))
            .slice(0, limit);
        },

        /**
         * Get new listings
         * @param {Array} allProperties - All available properties
         * @param {number} limit - Number of properties to return
         * @returns {Array} New listings
         */
        getNewListings: (allProperties, limit = 6) => {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          return allProperties
            .filter((property) => {
              const createdAt = property.createdAt ? new Date(property.createdAt) : null;
              return createdAt && createdAt >= thirtyDaysAgo;
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);
        },

        /**
         * Reset user preferences
         */
        resetPreferences: () =>
          set({
            userPreferences: {
              propertyTypes: [],
              budgetMin: 0,
              budgetMax: 50000,
              preferredLocations: [],
              stayDuration: null,
              amenities: [],
              hasCompletedWizard: false,
            },
          }),

        /**
         * Clear viewing history
         */
        clearViewingHistory: () => set({ viewingHistory: [] }),

        /**
         * Clear search history
         */
        clearSearchHistory: () => set({ searchHistory: [] }),

        /**
         * Clear all recommendation data
         */
        clearAllData: () =>
          set({
            userPreferences: {
              propertyTypes: [],
              budgetMin: 0,
              budgetMax: 50000,
              preferredLocations: [],
              stayDuration: null,
              amenities: [],
              hasCompletedWizard: false,
            },
            viewingHistory: [],
            searchHistory: [],
            recommendations: [],
            similarProperties: {},
          }),
      }),
      {
        name: 'recommendation-storage',
        partialize: (state) => ({
          userPreferences: state.userPreferences,
          viewingHistory: state.viewingHistory,
          searchHistory: state.searchHistory,
        }),
      }
    ),
    { name: 'RecommendationStore' }
  )
);

export default useRecommendationStore;
