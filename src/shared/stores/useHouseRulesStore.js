import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * House Rules Store using Zustand
 * Manages property house rules and policies
 * 
 * @module stores/useHouseRulesStore
 */

// Default house rules templates
export const DEFAULT_RULES = {
  DO: [
    'Maintain cleanliness in your room and common areas',
    'Respect quiet hours (10 PM - 7 AM)',
    'Report maintenance issues promptly',
    'Follow community policies and guidelines',
    'Treat property and facilities with care',
    'Be considerate of other tenants',
  ],
  DONT: [
    'No smoking inside the property',
    'No illegal activities',
    'No unauthorized guests overnight',
    'No loud noise during quiet hours',
    'No pets (unless specified)',
    'No property damage or alterations',
  ],
};

// Rule categories
export const RULE_CATEGORIES = {
  GENERAL: 'general',
  GUESTS: 'guests',
  NOISE: 'noise',
  CLEANLINESS: 'cleanliness',
  SAFETY: 'safety',
  PETS: 'pets',
  SMOKING: 'smoking',
  PARKING: 'parking',
};

const useHouseRulesStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        propertyRules: {}, // Rules per property

        // Actions

        /**
         * Set house rules for a property
         * @param {string} propertyId - Property ID
         * @param {Object} rules - House rules object
         */
        setPropertyRules: (propertyId, rules) =>
          set((state) => ({
            propertyRules: {
              ...state.propertyRules,
              [propertyId]: {
                ...rules,
                updatedAt: new Date().toISOString(),
              },
            },
          })),

        /**
         * Update specific rule category
         * @param {string} propertyId - Property ID
         * @param {string} category - Rule category
         * @param {Array} rules - Array of rules
         */
        updateRuleCategory: (propertyId, category, rules) =>
          set((state) => {
            const currentRules = state.propertyRules[propertyId] || {};
            return {
              propertyRules: {
                ...state.propertyRules,
                [propertyId]: {
                  ...currentRules,
                  [category]: rules,
                  updatedAt: new Date().toISOString(),
                },
              },
            };
          }),

        /**
         * Add a rule to a category
         * @param {string} propertyId - Property ID
         * @param {string} category - Rule category (do/dont)
         * @param {string} rule - Rule text
         */
        addRule: (propertyId, category, rule) =>
          set((state) => {
            const currentRules = state.propertyRules[propertyId] || { do: [], dont: [] };
            const categoryRules = currentRules[category] || [];
            
            return {
              propertyRules: {
                ...state.propertyRules,
                [propertyId]: {
                  ...currentRules,
                  [category]: [...categoryRules, rule],
                  updatedAt: new Date().toISOString(),
                },
              },
            };
          }),

        /**
         * Remove a rule from a category
         * @param {string} propertyId - Property ID
         * @param {string} category - Rule category (do/dont)
         * @param {number} index - Rule index
         */
        removeRule: (propertyId, category, index) =>
          set((state) => {
            const currentRules = state.propertyRules[propertyId] || { do: [], dont: [] };
            const categoryRules = currentRules[category] || [];
            
            return {
              propertyRules: {
                ...state.propertyRules,
                [propertyId]: {
                  ...currentRules,
                  [category]: categoryRules.filter((_, i) => i !== index),
                  updatedAt: new Date().toISOString(),
                },
              },
            };
          }),

        /**
         * Update a specific rule
         * @param {string} propertyId - Property ID
         * @param {string} category - Rule category (do/dont)
         * @param {number} index - Rule index
         * @param {string} newRule - New rule text
         */
        updateRule: (propertyId, category, index, newRule) =>
          set((state) => {
            const currentRules = state.propertyRules[propertyId] || { do: [], dont: [] };
            const categoryRules = currentRules[category] || [];
            
            return {
              propertyRules: {
                ...state.propertyRules,
                [propertyId]: {
                  ...currentRules,
                  [category]: categoryRules.map((rule, i) =>
                    i === index ? newRule : rule
                  ),
                  updatedAt: new Date().toISOString(),
                },
              },
            };
          }),

        /**
         * Set check-in/check-out times
         * @param {string} propertyId - Property ID
         * @param {Object} times - Check-in and check-out times
         */
        setCheckInOutTimes: (propertyId, times) =>
          set((state) => {
            const currentRules = state.propertyRules[propertyId] || {};
            return {
              propertyRules: {
                ...state.propertyRules,
                [propertyId]: {
                  ...currentRules,
                  checkInTime: times.checkIn,
                  checkOutTime: times.checkOut,
                  updatedAt: new Date().toISOString(),
                },
              },
            };
          }),

        /**
         * Set quiet hours
         * @param {string} propertyId - Property ID
         * @param {Object} hours - Quiet hours start and end
         */
        setQuietHours: (propertyId, hours) =>
          set((state) => {
            const currentRules = state.propertyRules[propertyId] || {};
            return {
              propertyRules: {
                ...state.propertyRules,
                [propertyId]: {
                  ...currentRules,
                  quietHoursStart: hours.start,
                  quietHoursEnd: hours.end,
                  updatedAt: new Date().toISOString(),
                },
              },
            };
          }),

        /**
         * Set guest policy
         * @param {string} propertyId - Property ID
         * @param {Object} policy - Guest policy details
         */
        setGuestPolicy: (propertyId, policy) =>
          set((state) => {
            const currentRules = state.propertyRules[propertyId] || {};
            return {
              propertyRules: {
                ...state.propertyRules,
                [propertyId]: {
                  ...currentRules,
                  guestPolicy: policy,
                  updatedAt: new Date().toISOString(),
                },
              },
            };
          }),

        /**
         * Set pet policy
         * @param {string} propertyId - Property ID
         * @param {Object} policy - Pet policy details
         */
        setPetPolicy: (propertyId, policy) =>
          set((state) => {
            const currentRules = state.propertyRules[propertyId] || {};
            return {
              propertyRules: {
                ...state.propertyRules,
                [propertyId]: {
                  ...currentRules,
                  petPolicy: policy,
                  updatedAt: new Date().toISOString(),
                },
              },
            };
          }),

        /**
         * Set smoking policy
         * @param {string} propertyId - Property ID
         * @param {Object} policy - Smoking policy details
         */
        setSmokingPolicy: (propertyId, policy) =>
          set((state) => {
            const currentRules = state.propertyRules[propertyId] || {};
            return {
              propertyRules: {
                ...state.propertyRules,
                [propertyId]: {
                  ...currentRules,
                  smokingPolicy: policy,
                  updatedAt: new Date().toISOString(),
                },
              },
            };
          }),

        /**
         * Set parking policy
         * @param {string} propertyId - Property ID
         * @param {Object} policy - Parking policy details
         */
        setParkingPolicy: (propertyId, policy) =>
          set((state) => {
            const currentRules = state.propertyRules[propertyId] || {};
            return {
              propertyRules: {
                ...state.propertyRules,
                [propertyId]: {
                  ...currentRules,
                  parkingPolicy: policy,
                  updatedAt: new Date().toISOString(),
                },
              },
            };
          }),

        /**
         * Set additional policies
         * @param {string} propertyId - Property ID
         * @param {string} policies - Additional policies text
         */
        setAdditionalPolicies: (propertyId, policies) =>
          set((state) => {
            const currentRules = state.propertyRules[propertyId] || {};
            return {
              propertyRules: {
                ...state.propertyRules,
                [propertyId]: {
                  ...currentRules,
                  additionalPolicies: policies,
                  updatedAt: new Date().toISOString(),
                },
              },
            };
          }),

        /**
         * Get house rules for a property
         * @param {string} propertyId - Property ID
         * @returns {Object|null} House rules object
         */
        getPropertyRules: (propertyId) => {
          const { propertyRules } = get();
          return propertyRules[propertyId] || null;
        },

        /**
         * Initialize default rules for a property
         * @param {string} propertyId - Property ID
         */
        initializeDefaultRules: (propertyId) =>
          set((state) => ({
            propertyRules: {
              ...state.propertyRules,
              [propertyId]: {
                do: [...DEFAULT_RULES.DO],
                dont: [...DEFAULT_RULES.DONT],
                checkInTime: '14:00',
                checkOutTime: '12:00',
                quietHoursStart: '22:00',
                quietHoursEnd: '07:00',
                guestPolicy: {
                  allowed: true,
                  maxGuests: 2,
                  overnightAllowed: false,
                  advanceNotice: true,
                },
                petPolicy: {
                  allowed: false,
                  types: [],
                  deposit: 0,
                },
                smokingPolicy: {
                  allowed: false,
                  designatedAreas: [],
                },
                parkingPolicy: {
                  available: false,
                  spaces: 0,
                  fee: 0,
                },
                additionalPolicies: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            },
          })),

        /**
         * Delete property rules
         * @param {string} propertyId - Property ID
         */
        deletePropertyRules: (propertyId) =>
          set((state) => {
            const { [propertyId]: removed, ...rest } = state.propertyRules;
            return { propertyRules: rest };
          }),

        /**
         * Clear all rules (for testing)
         */
        clearAllRules: () => set({ propertyRules: {} }),
      }),
      {
        name: 'house-rules-storage',
        partialize: (state) => ({
          propertyRules: state.propertyRules,
        }),
      }
    ),
    { name: 'HouseRulesStore' }
  )
);

export default useHouseRulesStore;
