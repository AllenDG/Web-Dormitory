import { describe, it, expect, beforeEach, vi } from 'vitest';
import useBookingStore, {
  BOOKING_STATUS,
  PAYMENT_STATUS,
  DURATION_TYPE,
} from './useBookingStore';

const baseBookingData = {
  userId: 'tenant-1',
  ownerId: 'owner-1',
  propertyId: '1',
  checkIn: '2026-09-01',
  checkOut: '2026-09-05',
};

describe('useBookingStore', () => {
  beforeEach(() => {
    useBookingStore.getState().clearAllBookings();
  });

  it('createBooking creates a pending, unpaid booking with a generated id', () => {
    const booking = useBookingStore.getState().createBooking(baseBookingData);

    expect(booking.id).toMatch(/^BK/);
    expect(booking.status).toBe(BOOKING_STATUS.PENDING);
    expect(booking.paymentStatus).toBe(PAYMENT_STATUS.PENDING);
    expect(useBookingStore.getState().bookings).toHaveLength(1);
    expect(useBookingStore.getState().currentBooking.id).toBe(booking.id);
  });

  it('approveBooking transitions status to approved and records owner notes', () => {
    const booking = useBookingStore.getState().createBooking(baseBookingData);
    useBookingStore.getState().approveBooking(booking.id, 'Welcome!');

    const updated = useBookingStore.getState().getBookingById(booking.id);
    expect(updated.status).toBe(BOOKING_STATUS.APPROVED);
    expect(updated.ownerNotes).toBe('Welcome!');
  });

  it('rejectBooking transitions status to rejected and records the reason', () => {
    const booking = useBookingStore.getState().createBooking(baseBookingData);
    useBookingStore.getState().rejectBooking(booking.id, 'Fully booked');

    const updated = useBookingStore.getState().getBookingById(booking.id);
    expect(updated.status).toBe(BOOKING_STATUS.REJECTED);
    expect(updated.rejectionReason).toBe('Fully booked');
  });

  it('processPayment moves paymentStatus to completed and status to paid', async () => {
    vi.useFakeTimers();
    try {
      const booking = useBookingStore.getState().createBooking(baseBookingData);

      const resultPromise = useBookingStore.getState().processPayment(booking.id, {
        method: 'gcash',
      });
      await vi.advanceTimersByTimeAsync(2000);
      const result = await resultPromise;

      expect(result.success).toBe(true);
      const updated = useBookingStore.getState().getBookingById(booking.id);
      expect(updated.paymentStatus).toBe(PAYMENT_STATUS.COMPLETED);
      expect(updated.status).toBe(BOOKING_STATUS.PAID);
    } finally {
      vi.useRealTimers();
    }
  });

  it('verifyPayment confirms the booking', () => {
    const booking = useBookingStore.getState().createBooking(baseBookingData);
    useBookingStore.getState().verifyPayment(booking.id, { verifiedBy: 'owner-1' });

    const updated = useBookingStore.getState().getBookingById(booking.id);
    expect(updated.paymentStatus).toBe(PAYMENT_STATUS.COMPLETED);
    expect(updated.status).toBe(BOOKING_STATUS.CONFIRMED);
  });

  describe('calculatePrice', () => {
    const property = { price: 3000, dailyRate: 150 };

    it('daily: charges per day with a 5% service fee and 1-day deposit', () => {
      const checkIn = new Date('2026-09-01');
      const checkOut = new Date('2026-09-05'); // 4 days
      const result = useBookingStore
        .getState()
        .calculatePrice(property, checkIn, checkOut, DURATION_TYPE.DAILY);

      expect(result.days).toBe(4);
      expect(result.subtotal).toBe(600); // 150 * 4
      expect(result.discount).toBe(0);
      expect(result.serviceFee).toBe(30); // 5% of 600
      expect(result.depositAmount).toBe(150);
      expect(result.total).toBe(630);
      expect(result.totalWithDeposit).toBe(780);
    });

    it('6 months: applies a 5% discount and 3% service fee', () => {
      const result = useBookingStore
        .getState()
        .calculatePrice(property, new Date(), new Date(), DURATION_TYPE.SIX_MONTHS);

      expect(result.subtotal).toBe(18000); // 3000 * 6
      expect(result.discount).toBe(900); // 5%
      const afterDiscount = 17100;
      expect(result.subtotalAfterDiscount).toBe(afterDiscount);
      expect(result.serviceFee).toBe(Math.round(afterDiscount * 0.03));
      expect(result.depositAmount).toBe(3000);
    });

    it('1 year: applies a 10% discount, 2% service fee, and 2-month deposit', () => {
      const result = useBookingStore
        .getState()
        .calculatePrice(property, new Date(), new Date(), DURATION_TYPE.ONE_YEAR);

      expect(result.subtotal).toBe(36000); // 3000 * 12
      expect(result.discount).toBe(3600); // 10%
      const afterDiscount = 32400;
      expect(result.subtotalAfterDiscount).toBe(afterDiscount);
      expect(result.serviceFee).toBe(Math.round(afterDiscount * 0.02));
      expect(result.depositAmount).toBe(6000); // 2 months
    });
  });

  describe('checkAvailability', () => {
    it('returns true when the property has no conflicting bookings', () => {
      const available = useBookingStore
        .getState()
        .checkAvailability('1', new Date('2026-09-01'), new Date('2026-09-05'));
      expect(available).toBe(true);
    });

    it('returns false when the requested range overlaps an approved booking', () => {
      const booking = useBookingStore.getState().createBooking({
        ...baseBookingData,
        checkIn: '2026-09-01',
        checkOut: '2026-09-10',
      });
      useBookingStore.getState().approveBooking(booking.id);

      const available = useBookingStore
        .getState()
        .checkAvailability('1', new Date('2026-09-05'), new Date('2026-09-08'));
      expect(available).toBe(false);
    });

    it('ignores bookings that are only pending (not approved/paid/confirmed)', () => {
      useBookingStore.getState().createBooking({
        ...baseBookingData,
        checkIn: '2026-09-01',
        checkOut: '2026-09-10',
      });

      const available = useBookingStore
        .getState()
        .checkAvailability('1', new Date('2026-09-05'), new Date('2026-09-08'));
      expect(available).toBe(true);
    });
  });

  describe('query helpers', () => {
    it('getBookingsByUser/Owner/Property/Status filter correctly', () => {
      const b1 = useBookingStore.getState().createBooking(baseBookingData);
      useBookingStore.getState().createBooking({
        ...baseBookingData,
        userId: 'tenant-2',
        propertyId: '2',
      });
      useBookingStore.getState().approveBooking(b1.id);

      expect(useBookingStore.getState().getBookingsByUser('tenant-1')).toHaveLength(1);
      expect(useBookingStore.getState().getBookingsByOwner('owner-1')).toHaveLength(2);
      expect(useBookingStore.getState().getBookingsByProperty('2')).toHaveLength(1);
      expect(useBookingStore.getState().getBookingsByStatus(BOOKING_STATUS.APPROVED)).toHaveLength(1);
    });
  });
});
