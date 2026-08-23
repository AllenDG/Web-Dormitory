import { BOOKING_STATUS } from '../../../../shared/stores/useBookingStore';

// Bookings that represent a currently-occupied/reserved unit.
const ACTIVE_STATUSES = [BOOKING_STATUS.APPROVED, BOOKING_STATUS.PAID, BOOKING_STATUS.CONFIRMED];
// Bookings that represent money actually collected.
const REVENUE_STATUSES = [BOOKING_STATUS.PAID, BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.COMPLETED];
// Bookings that represent a settled/finished lease (for completion rate).
const SETTLED_STATUSES = [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED];

const monthLabel = (date) => date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

const bookingAmount = (booking) => booking.totalWithDeposit ?? booking.totalAmount ?? 0;

/**
 * Buckets revenue-generating bookings into the last `months` calendar
 * months, keyed off paidAt/paymentVerifiedAt (whichever is set).
 */
export function bucketRevenueByMonth(bookings, months = 6) {
  const now = new Date();
  const buckets = [];
  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, period: monthLabel(d), revenue: 0 });
  }
  const byKey = Object.fromEntries(buckets.map((b) => [b.key, b]));

  bookings
    .filter((b) => REVENUE_STATUSES.includes(b.status))
    .forEach((b) => {
      const dateStr = b.paidAt || b.paymentVerifiedAt || b.updatedAt;
      if (!dateStr) return;
      const d = new Date(dateStr);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (byKey[key]) byKey[key].revenue += bookingAmount(b);
    });

  return buckets.map((b) => ({ period: b.period, revenue: Math.round(b.revenue) }));
}

function revenueInMonth(bookings, monthsAgo) {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  return bookings
    .filter((b) => REVENUE_STATUSES.includes(b.status))
    .filter((b) => {
      const dateStr = b.paidAt || b.paymentVerifiedAt || b.updatedAt;
      if (!dateStr) return false;
      const d = new Date(dateStr);
      return d.getFullYear() === target.getFullYear() && d.getMonth() === target.getMonth();
    })
    .reduce((sum, b) => sum + bookingAmount(b), 0);
}

/** Total unit count for a property — occupied-unit math cares about units, not properties. */
function unitCount(property) {
  return property.units?.length > 0 ? property.units.length : 1;
}

export function computeOwnerStats({ ownerProperties, ownerBookings, propertyRatings }) {
  const activeBookings = ownerBookings.filter((b) => ACTIVE_STATUSES.includes(b.status));
  const thisMonthRevenue = revenueInMonth(ownerBookings, 0);

  const totalUnits = ownerProperties.reduce((sum, p) => sum + unitCount(p), 0);
  const occupiedProperties = new Set(activeBookings.map((b) => b.propertyId));
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedProperties.size / totalUnits) * 100) : 0;

  const tenantEmails = new Set(
    ownerBookings
      .filter((b) => [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.COMPLETED].includes(b.status))
      .map((b) => b.guestEmail)
      .filter(Boolean)
  );

  const ratings = ownerProperties.map((p) => propertyRatings[p.id]?.overallRating).filter((r) => typeof r === 'number');
  const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null;

  const settled = ownerBookings.filter((b) => SETTLED_STATUSES.includes(b.status));
  const completedCount = ownerBookings.filter((b) => b.status === BOOKING_STATUS.COMPLETED || b.status === BOOKING_STATUS.CONFIRMED).length;
  const completionRate = settled.length > 0 ? Math.round((completedCount / settled.length) * 100) : null;

  const pendingRequests = ownerBookings.filter((b) => b.status === BOOKING_STATUS.PENDING).length;

  return {
    totalProperties: ownerProperties.length,
    activeBookings: activeBookings.length,
    monthlyRevenue: thisMonthRevenue,
    occupancyRate,
    totalTenants: tenantEmails.size,
    pendingRequests,
    avgRating,
    completionRate,
  };
}

export function computeOccupancyBreakdown(ownerProperties, ownerBookings) {
  let occupied = 0;
  let reserved = 0;
  let inactive = 0;
  let available = 0;

  ownerProperties.forEach((property) => {
    if ((property.status || 'active') === 'inactive') {
      inactive += 1;
      return;
    }
    const propertyBookings = ownerBookings.filter((b) => b.propertyId === property.id);
    if (propertyBookings.some((b) => [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.PAID].includes(b.status))) {
      occupied += 1;
    } else if (propertyBookings.some((b) => [BOOKING_STATUS.PENDING, BOOKING_STATUS.APPROVED].includes(b.status))) {
      reserved += 1;
    } else {
      available += 1;
    }
  });

  return [
    { name: 'Occupied', value: occupied, color: '#38A169' },
    { name: 'Available', value: available, color: '#1e88e5' },
    { name: 'Reserved', value: reserved, color: '#8B5CF6' },
    { name: 'Inactive', value: inactive, color: '#DD6B20' },
  ];
}

const ACTIVITY_LABELS = {
  paidAt: (b) => `Payment received for ${b.propertyTitle || 'a property'}`,
  paymentVerifiedAt: (b) => `Booking confirmed for ${b.propertyTitle || 'a property'}`,
  approvedAt: (b) => `Booking approved for ${b.propertyTitle || 'a property'}`,
  rejectedAt: (b) => `Booking rejected for ${b.propertyTitle || 'a property'}`,
  cancelledAt: (b) => `Booking cancelled for ${b.propertyTitle || 'a property'}`,
  createdAt: (b) => `New booking request for ${b.propertyTitle || 'a property'}`,
};

const ACTIVITY_STATUS_FOR_FIELD = {
  paidAt: 'confirmed',
  paymentVerifiedAt: 'confirmed',
  approvedAt: 'confirmed',
  rejectedAt: 'cancelled',
  cancelledAt: 'cancelled',
  createdAt: 'pending',
};

export function computeRecentActivity(ownerBookings, limit = 6) {
  const fields = ['paidAt', 'paymentVerifiedAt', 'approvedAt', 'rejectedAt', 'cancelledAt', 'createdAt'];

  const events = ownerBookings.flatMap((booking) => {
    const field = fields.find((f) => booking[f]);
    if (!field) return [];
    return [
      {
        id: booking.id,
        tenant: booking.guestName || 'Guest',
        action: ACTIVITY_LABELS[field](booking),
        property: booking.propertyTitle,
        date: booking[field],
        status: ACTIVITY_STATUS_FOR_FIELD[field],
      },
    ];
  });

  return events.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);
}

export function computePropertyPerformance(ownerProperties, ownerBookings, propertyRatings, limit = 5) {
  const rows = ownerProperties.map((property) => {
    const propertyBookings = ownerBookings.filter((b) => b.propertyId === property.id);
    const revenueBookings = propertyBookings.filter((b) => REVENUE_STATUSES.includes(b.status));
    const revenue = revenueBookings.reduce((sum, b) => sum + bookingAmount(b), 0);

    const units = unitCount(property);
    const occupiedUnits = propertyBookings.filter((b) => ACTIVE_STATUSES.includes(b.status)).length;
    const occupancy = units > 0 ? Math.min(100, Math.round((occupiedUnits / units) * 100)) : 0;

    const rating = propertyRatings[property.id]?.overallRating ?? null;

    const thisMonth = revenueInMonth(propertyBookings, 0);
    const lastMonth = revenueInMonth(propertyBookings, 1);
    const change = lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : thisMonth > 0 ? 100 : 0;

    return {
      id: property.id,
      name: property.title,
      location: property.city,
      bookings: propertyBookings.length,
      revenue: Math.round(revenue),
      rating,
      occupancy,
      trend: change >= 0 ? 'up' : 'down',
      change: Math.abs(change),
    };
  });

  return rows.sort((a, b) => b.revenue - a.revenue).slice(0, limit);
}
