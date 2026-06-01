import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Review Store using Zustand
 * Manages property reviews, ratings, and owner responses
 * 
 * @module stores/useReviewStore
 */

// Review status constants
export const REVIEW_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  FLAGGED: 'flagged',
};

// Review categories for detailed ratings
export const REVIEW_CATEGORIES = {
  CLEANLINESS: 'cleanliness',
  ACCURACY: 'accuracy',
  COMMUNICATION: 'communication',
  LOCATION: 'location',
  VALUE: 'value',
  AMENITIES: 'amenities',
};

const useReviewStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        reviews: [],
        propertyRatings: {}, // Aggregated ratings per property

        // Actions

        /**
         * Add a new review
         * @param {Object} reviewData - Review information
         * @returns {Object} Created review
         */
        addReview: (reviewData) => {
          const newReview = {
            id: `REV${Date.now()}`,
            ...reviewData,
            status: REVIEW_STATUS.APPROVED, // Auto-approve for now
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            helpful: 0,
            notHelpful: 0,
            ownerResponse: null,
          };

          set((state) => ({
            reviews: [...state.reviews, newReview],
          }));

          // Update property ratings
          get().updatePropertyRatings(reviewData.propertyId);

          return newReview;
        },

        /**
         * Update a review
         * @param {string} reviewId - Review ID
         * @param {Object} updates - Fields to update
         */
        updateReview: (reviewId, updates) =>
          set((state) => ({
            reviews: state.reviews.map((review) =>
              review.id === reviewId
                ? { ...review, ...updates, updatedAt: new Date().toISOString() }
                : review
            ),
          })),

        /**
         * Delete a review
         * @param {string} reviewId - Review ID
         */
        deleteReview: (reviewId) => {
          const review = get().reviews.find((r) => r.id === reviewId);
          
          set((state) => ({
            reviews: state.reviews.filter((r) => r.id !== reviewId),
          }));

          // Update property ratings after deletion
          if (review) {
            get().updatePropertyRatings(review.propertyId);
          }
        },

        /**
         * Add owner response to a review
         * @param {string} reviewId - Review ID
         * @param {string} response - Owner's response text
         * @param {string} ownerId - Owner ID
         */
        addOwnerResponse: (reviewId, response, ownerId) =>
          set((state) => ({
            reviews: state.reviews.map((review) =>
              review.id === reviewId
                ? {
                    ...review,
                    ownerResponse: {
                      text: response,
                      ownerId,
                      createdAt: new Date().toISOString(),
                    },
                    updatedAt: new Date().toISOString(),
                  }
                : review
            ),
          })),

        /**
         * Update owner response
         * @param {string} reviewId - Review ID
         * @param {string} response - Updated response text
         */
        updateOwnerResponse: (reviewId, response) =>
          set((state) => ({
            reviews: state.reviews.map((review) =>
              review.id === reviewId && review.ownerResponse
                ? {
                    ...review,
                    ownerResponse: {
                      ...review.ownerResponse,
                      text: response,
                      updatedAt: new Date().toISOString(),
                    },
                    updatedAt: new Date().toISOString(),
                  }
                : review
            ),
          })),

        /**
         * Delete owner response
         * @param {string} reviewId - Review ID
         */
        deleteOwnerResponse: (reviewId) =>
          set((state) => ({
            reviews: state.reviews.map((review) =>
              review.id === reviewId
                ? {
                    ...review,
                    ownerResponse: null,
                    updatedAt: new Date().toISOString(),
                  }
                : review
            ),
          })),

        /**
         * Mark review as helpful
         * @param {string} reviewId - Review ID
         * @param {string} userId - User ID
         */
        markHelpful: (reviewId, userId) =>
          set((state) => ({
            reviews: state.reviews.map((review) =>
              review.id === reviewId
                ? { ...review, helpful: review.helpful + 1 }
                : review
            ),
          })),

        /**
         * Mark review as not helpful
         * @param {string} reviewId - Review ID
         * @param {string} userId - User ID
         */
        markNotHelpful: (reviewId, userId) =>
          set((state) => ({
            reviews: state.reviews.map((review) =>
              review.id === reviewId
                ? { ...review, notHelpful: review.notHelpful + 1 }
                : review
            ),
          })),

        /**
         * Flag a review for moderation
         * @param {string} reviewId - Review ID
         * @param {string} reason - Reason for flagging
         * @param {string} userId - User ID who flagged
         */
        flagReview: (reviewId, reason, userId) =>
          set((state) => ({
            reviews: state.reviews.map((review) =>
              review.id === reviewId
                ? {
                    ...review,
                    status: REVIEW_STATUS.FLAGGED,
                    flagReason: reason,
                    flaggedBy: userId,
                    flaggedAt: new Date().toISOString(),
                  }
                : review
            ),
          })),

        /**
         * Update review status (for moderation)
         * @param {string} reviewId - Review ID
         * @param {string} status - New status
         */
        updateReviewStatus: (reviewId, status) =>
          set((state) => ({
            reviews: state.reviews.map((review) =>
              review.id === reviewId
                ? { ...review, status, updatedAt: new Date().toISOString() }
                : review
            ),
          })),

        /**
         * Get reviews by property ID
         * @param {string} propertyId - Property ID
         * @param {boolean} approvedOnly - Only return approved reviews
         * @returns {Array} Array of reviews
         */
        getReviewsByProperty: (propertyId, approvedOnly = true) => {
          const { reviews } = get();
          let propertyReviews = reviews.filter((r) => r.propertyId === propertyId);
          
          if (approvedOnly) {
            propertyReviews = propertyReviews.filter(
              (r) => r.status === REVIEW_STATUS.APPROVED
            );
          }

          return propertyReviews.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        },

        /**
         * Get reviews by user ID
         * @param {string} userId - User ID
         * @returns {Array} Array of reviews
         */
        getReviewsByUser: (userId) => {
          const { reviews } = get();
          return reviews
            .filter((r) => r.userId === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        },

        /**
         * Get review by ID
         * @param {string} reviewId - Review ID
         * @returns {Object|undefined} Review object
         */
        getReviewById: (reviewId) => {
          const { reviews } = get();
          return reviews.find((r) => r.id === reviewId);
        },

        /**
         * Check if user has reviewed a property
         * @param {string} userId - User ID
         * @param {string} propertyId - Property ID
         * @returns {boolean} True if user has reviewed
         */
        hasUserReviewed: (userId, propertyId) => {
          const { reviews } = get();
          return reviews.some(
            (r) => r.userId === userId && r.propertyId === propertyId
          );
        },

        /**
         * Update property ratings (aggregated)
         * @param {string} propertyId - Property ID
         */
        updatePropertyRatings: (propertyId) => {
          const reviews = get().getReviewsByProperty(propertyId, true);
          
          if (reviews.length === 0) {
            set((state) => ({
              propertyRatings: {
                ...state.propertyRatings,
                [propertyId]: null,
              },
            }));
            return;
          }

          // Calculate overall rating
          const overallRating =
            reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length;

          // Calculate category ratings
          const categoryRatings = {};
          Object.values(REVIEW_CATEGORIES).forEach((category) => {
            const categoryReviews = reviews.filter((r) => r.categoryRatings?.[category]);
            if (categoryReviews.length > 0) {
              categoryRatings[category] =
                categoryReviews.reduce((sum, r) => sum + r.categoryRatings[category], 0) /
                categoryReviews.length;
            }
          });

          // Calculate rating distribution
          const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
          reviews.forEach((r) => {
            const rating = Math.round(r.overallRating);
            ratingDistribution[rating]++;
          });

          set((state) => ({
            propertyRatings: {
              ...state.propertyRatings,
              [propertyId]: {
                overallRating: Math.round(overallRating * 10) / 10,
                totalReviews: reviews.length,
                categoryRatings,
                ratingDistribution,
                updatedAt: new Date().toISOString(),
              },
            },
          }));
        },

        /**
         * Get property ratings
         * @param {string} propertyId - Property ID
         * @returns {Object|null} Property ratings object
         */
        getPropertyRatings: (propertyId) => {
          const { propertyRatings } = get();
          return propertyRatings[propertyId] || null;
        },

        /**
         * Get flagged reviews (for moderation)
         * @returns {Array} Array of flagged reviews
         */
        getFlaggedReviews: () => {
          const { reviews } = get();
          return reviews
            .filter((r) => r.status === REVIEW_STATUS.FLAGGED)
            .sort((a, b) => new Date(b.flaggedAt) - new Date(a.flaggedAt));
        },

        /**
         * Get pending reviews (for moderation)
         * @returns {Array} Array of pending reviews
         */
        getPendingReviews: () => {
          const { reviews } = get();
          return reviews
            .filter((r) => r.status === REVIEW_STATUS.PENDING)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        },

        /**
         * Clear all reviews (for testing)
         */
        clearAllReviews: () =>
          set({
            reviews: [],
            propertyRatings: {},
          }),
      }),
      {
        name: 'review-storage',
        partialize: (state) => ({
          reviews: state.reviews,
          propertyRatings: state.propertyRatings,
        }),
      }
    ),
    { name: 'ReviewStore' }
  )
);

export default useReviewStore;
