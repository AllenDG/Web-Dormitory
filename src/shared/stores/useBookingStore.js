import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import useNotificationStore from './useNotificationStore';

/**
 * Booking Store using Zustand
 * Manages booking state, payment flow, and booking history
 * 
 * @module stores/useBookingStore
 */

// Booking status constants
export const BOOKING_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PAID: 'paid',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

// Payment status constants
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Booking duration types
export const DURATION_TYPE = {
  DAILY: 'daily',
  SIX_MONTHS: '6months',
  ONE_YEAR: '1year',
};

// Payment methods
export const PAYMENT_METHOD = {
  GCASH: 'gcash',
  PAYMAYA: 'paymaya',
  BANK_TRANSFER: 'bank_transfer',
  CREDIT_CARD: 'credit_card',
  CASH: 'cash',
};

const useBookingStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        bookings: [],
        currentBooking: null,
        paymentInfo: null,

        // Actions
        
        /**
         * Create a new booking
         * @param {Object} bookingData - Booking information
         * @returns {Object} Created booking
         */
        createBooking: (bookingData) => {
          const newBooking = {
            id: `BK-${crypto.randomUUID()}`,
            ...bookingData,
            status: BOOKING_STATUS.PENDING,
            paymentStatus: PAYMENT_STATUS.PENDING,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            bookings: [...state.bookings, newBooking],
            currentBooking: newBooking,
          }));

          return newBooking;
        },

        /**
         * Update booking status
         * @param {string} bookingId - Booking ID
         * @param {string} status - New status
         */
        updateBookingStatus: (bookingId, status) =>
          set((state) => ({
            bookings: state.bookings.map((booking) =>
              booking.id === bookingId
                ? { ...booking, status, updatedAt: new Date().toISOString() }
                : booking
            ),
          })),

        /**
         * Update payment status
         * @param {string} bookingId - Booking ID
         * @param {string} paymentStatus - New payment status
         */
        updatePaymentStatus: (bookingId, paymentStatus) =>
          set((state) => ({
            bookings: state.bookings.map((booking) =>
              booking.id === bookingId
                ? { ...booking, paymentStatus, updatedAt: new Date().toISOString() }
                : booking
            ),
          })),

        /**
         * Process payment for booking
         * @param {string} bookingId - Booking ID
         * @param {Object} paymentData - Payment information
         */
        processPayment: async (bookingId, paymentData) => {
          // Update payment status to processing
          get().updatePaymentStatus(bookingId, PAYMENT_STATUS.PROCESSING);

          // Simulate payment processing (replace with actual payment gateway)
          await new Promise((resolve) => setTimeout(resolve, 2000));

          const transactionId = `TXN-${crypto.randomUUID()}`;
          const completedAt = new Date().toISOString();

          // Update payment status to completed
          get().updatePaymentStatus(bookingId, PAYMENT_STATUS.COMPLETED);
          get().updateBookingStatus(bookingId, BOOKING_STATUS.PAID);

          set((state) => ({
            bookings: state.bookings.map((booking) =>
              booking.id === bookingId
                ? {
                    ...booking,
                    paymentMethod: paymentData.method,
                    transactionId,
                    paidAt: completedAt,
                  }
                : booking
            ),
            paymentInfo: {
              bookingId,
              ...paymentData,
              transactionId,
              completedAt,
            },
          }));

          const booking = get().getBookingById(bookingId);
          if (booking?.guestEmail) {
            useNotificationStore.getState().addNotification({
              recipientEmail: booking.guestEmail,
              type: 'payment',
              title: 'Payment Successful',
              message: `Your payment for ${booking.propertyTitle || 'the property'} has been processed successfully.`,
              actionUrl: `/bookings/${bookingId}`,
            });
          }

          return {
            success: true,
            transactionId,
          };
        },

        /**
         * Cancel a booking
         * @param {string} bookingId - Booking ID
         * @param {string} reason - Cancellation reason
         */
        cancelBooking: (bookingId, reason) =>
          set((state) => ({
            bookings: state.bookings.map((booking) =>
              booking.id === bookingId
                ? {
                    ...booking,
                    status: BOOKING_STATUS.CANCELLED,
                    cancellationReason: reason,
                    cancelledAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  }
                : booking
            ),
          })),

        /**
         * Approve a booking (Owner action)
         * @param {string} bookingId - Booking ID
         * @param {string} ownerNotes - Optional notes from owner
         */
        approveBooking: (bookingId, ownerNotes = '') => {
          set((state) => ({
            bookings: state.bookings.map((booking) =>
              booking.id === bookingId
                ? {
                    ...booking,
                    status: BOOKING_STATUS.APPROVED,
                    ownerNotes,
                    approvedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  }
                : booking
            ),
          }));

          const booking = get().getBookingById(bookingId);
          if (booking?.guestEmail) {
            useNotificationStore.getState().addNotification({
              recipientEmail: booking.guestEmail,
              type: 'booking',
              title: 'Booking Approved',
              message: `Your booking for ${booking.propertyTitle || 'the property'} has been approved.`,
              actionUrl: `/bookings/${bookingId}`,
            });
          }
        },

        /**
         * Reject a booking (Owner action)
         * @param {string} bookingId - Booking ID
         * @param {string} rejectionReason - Reason for rejection
         */
        rejectBooking: (bookingId, rejectionReason) => {
          set((state) => ({
            bookings: state.bookings.map((booking) =>
              booking.id === bookingId
                ? {
                    ...booking,
                    status: BOOKING_STATUS.REJECTED,
                    rejectionReason,
                    rejectedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  }
                : booking
            ),
          }));

          const booking = get().getBookingById(bookingId);
          if (booking?.guestEmail) {
            useNotificationStore.getState().addNotification({
              recipientEmail: booking.guestEmail,
              type: 'alert',
              title: 'Booking Rejected',
              message: `Your booking for ${booking.propertyTitle || 'the property'} was rejected.${rejectionReason ? ` Reason: ${rejectionReason}` : ''}`,
              actionUrl: `/bookings/${bookingId}`,
            });
          }
        },

        /**
         * Verify payment (Owner action)
         * @param {string} bookingId - Booking ID
         * @param {Object} verificationData - Payment verification details
         */
        verifyPayment: (bookingId, verificationData) => {
          set((state) => ({
            bookings: state.bookings.map((booking) =>
              booking.id === bookingId
                ? {
                    ...booking,
                    paymentStatus: PAYMENT_STATUS.COMPLETED,
                    status: BOOKING_STATUS.CONFIRMED,
                    paymentVerification: verificationData,
                    paymentVerifiedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  }
                : booking
            ),
          }));

          const booking = get().getBookingById(bookingId);
          if (booking?.guestEmail) {
            useNotificationStore.getState().addNotification({
              recipientEmail: booking.guestEmail,
              type: 'payment',
              title: 'Payment Verified',
              message: `Your payment for ${booking.propertyTitle || 'the property'} has been verified. Your booking is confirmed.`,
              actionUrl: `/bookings/${bookingId}`,
            });
          }
        },

        /**
         * Get booking by ID
         * @param {string} bookingId - Booking ID
         * @returns {Object|undefined} Booking object
         */
        getBookingById: (bookingId) => {
          const { bookings } = get();
          return bookings.find((booking) => booking.id === bookingId);
        },

        /**
         * Get bookings by user ID
         * @param {string} userId - User ID
         * @returns {Array} Array of bookings
         */
        getBookingsByUser: (userId) => {
          const { bookings } = get();
          return bookings.filter((booking) => booking.userId === userId);
        },

        /**
         * Get bookings by property ID
         * @param {string} propertyId - Property ID
         * @returns {Array} Array of bookings
         */
        getBookingsByProperty: (propertyId) => {
          const { bookings } = get();
          return bookings.filter((booking) => booking.propertyId === propertyId);
        },

        /**
         * Get bookings by owner ID
         * @param {string} ownerId - Owner ID
         * @returns {Array} Array of bookings
         */
        getBookingsByOwner: (ownerId) => {
          const { bookings } = get();
          return bookings.filter((booking) => booking.ownerId === ownerId);
        },

        /**
         * Get bookings by owner email. Bookings are only ever created with
         * a real ownerEmail (property.ownerEmail); ownerId falls back to a
         * placeholder string since no property record sets a real one, so
         * this is the selector that actually matches real data — mirrors
         * how Properties/Tenants/Search already filter by owner email.
         * @param {string} ownerEmail - Owner email
         * @returns {Array} Array of bookings
         */
        getBookingsByOwnerEmail: (ownerEmail) => {
          const { bookings } = get();
          return bookings.filter((booking) => booking.ownerEmail === ownerEmail);
        },

        /**
         * Get bookings by status
         * @param {string} status - Booking status
         * @returns {Array} Array of bookings
         */
        getBookingsByStatus: (status) => {
          const { bookings } = get();
          return bookings.filter((booking) => booking.status === status);
        },

        /**
         * Set current booking
         * @param {Object} booking - Booking object
         */
        setCurrentBooking: (booking) => set({ currentBooking: booking }),

        /**
         * Clear current booking
         */
        clearCurrentBooking: () => set({ currentBooking: null }),

        /**
         * Calculate total price for booking with duration-based pricing
         * @param {Object} property - Property object with pricing
         * @param {Date} checkIn - Check-in date
         * @param {Date} checkOut - Check-out date
         * @param {string} durationType - Duration type (daily, 6months, 1year)
         * @returns {Object} Price breakdown
         */
        calculatePrice: (property, checkIn, checkOut, durationType = DURATION_TYPE.DAILY) => {
          const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
          
          let subtotal = 0;
          let discount = 0;
          let serviceFeeRate = 0.05; // Default 5%
          let depositAmount = 0;
          let pricePerUnit = 0;
          let unit = 'day';

          // Calculate based on duration type
          if (durationType === DURATION_TYPE.DAILY) {
            pricePerUnit = property.dailyRate || property.price / 30;
            subtotal = pricePerUnit * days;
            depositAmount = pricePerUnit; // 1 day deposit
            serviceFeeRate = 0.05; // 5%
            unit = 'day';
          } else if (durationType === DURATION_TYPE.SIX_MONTHS) {
            pricePerUnit = property.price; // Monthly rate
            subtotal = pricePerUnit * 6;
            discount = subtotal * 0.05; // 5% discount
            depositAmount = pricePerUnit; // 1 month deposit
            serviceFeeRate = 0.03; // 3%
            unit = 'month';
          } else if (durationType === DURATION_TYPE.ONE_YEAR) {
            pricePerUnit = property.price; // Monthly rate
            subtotal = pricePerUnit * 12;
            discount = subtotal * 0.10; // 10% discount
            depositAmount = pricePerUnit * 2; // 2 months deposit
            serviceFeeRate = 0.02; // 2%
            unit = 'month';
          }

          const subtotalAfterDiscount = subtotal - discount;
          const serviceFee = subtotalAfterDiscount * serviceFeeRate;
          const total = subtotalAfterDiscount + serviceFee;
          const totalWithDeposit = total + depositAmount;

          return {
            days,
            durationType,
            pricePerUnit: Math.round(pricePerUnit),
            unit,
            subtotal: Math.round(subtotal),
            discount: Math.round(discount),
            subtotalAfterDiscount: Math.round(subtotalAfterDiscount),
            serviceFee: Math.round(serviceFee),
            serviceFeeRate: (serviceFeeRate * 100).toFixed(0) + '%',
            depositAmount: Math.round(depositAmount),
            total: Math.round(total),
            totalWithDeposit: Math.round(totalWithDeposit),
          };
        },

        /**
         * Check if dates are available for property
         * @param {string} propertyId - Property ID
         * @param {Date} checkIn - Check-in date
         * @param {Date} checkOut - Check-out date
         * @returns {boolean} True if available
         */
        checkAvailability: (propertyId, checkIn, checkOut) => {
          const { bookings } = get();
          const propertyBookings = bookings.filter(
            (booking) =>
              booking.propertyId === propertyId &&
              (booking.status === BOOKING_STATUS.CONFIRMED ||
                booking.status === BOOKING_STATUS.PAID ||
                booking.status === BOOKING_STATUS.APPROVED)
          );

          // Check for date conflicts
          return !propertyBookings.some((booking) => {
            const bookingCheckIn = new Date(booking.checkIn);
            const bookingCheckOut = new Date(booking.checkOut);
            return (
              (checkIn >= bookingCheckIn && checkIn < bookingCheckOut) ||
              (checkOut > bookingCheckIn && checkOut <= bookingCheckOut) ||
              (checkIn <= bookingCheckIn && checkOut >= bookingCheckOut)
            );
          });
        },

        /**
         * Clear all bookings (for testing)
         */
        clearAllBookings: () => set({ bookings: [], currentBooking: null }),
      }),
      {
        name: 'booking-storage',
        partialize: (state) => ({
          bookings: state.bookings,
        }),
      }
    ),
    { name: 'BookingStore' }
  )
);

export default useBookingStore;
