import { BOOKING_STATUS } from '../../../../shared/stores/useBookingStore';
import { isTenantVisible } from '../../../../shared/utils/moderation';

const ACTIVE_STATUSES = [BOOKING_STATUS.APPROVED, BOOKING_STATUS.PAID, BOOKING_STATUS.CONFIRMED];
const REVENUE_STATUSES = [BOOKING_STATUS.PAID, BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.COMPLETED];

const bookingAmount = (booking) => booking.totalWithDeposit ?? booking.totalAmount ?? 0;
const monthLabel = (date) => date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

/** Platform-wide stat tiles — real derivations, no fabricated trend deltas. */
export function computeAdminStats({ users, rentals, bookings, reports }) {
  const activeProperties = rentals.filter((r) => (r.status || 'active') === 'active');
  const verifiedProperties = rentals.filter((r) => isTenantVisible(r));
  const pendingApprovals = rentals.filter((r) => r.moderationStatus === 'pending');
  const activeBookings = bookings.filter((b) => ACTIVE_STATUSES.includes(b.status));
  const totalRevenue = bookings
    .filter((b) => REVENUE_STATUSES.includes(b.status))
    .reduce((sum, b) => sum + bookingAmount(b), 0);
  const openReports = reports.filter((r) => r.status === 'open');

  return {
    totalUsers: users.length,
    activeProperties: activeProperties.length,
    totalRevenue: Math.round(totalRevenue),
    totalBookings: bookings.length,
    activeBookings: activeBookings.length,
    verifiedPercent: rentals.length > 0 ? Math.round((verifiedProperties.length / rentals.length) * 100) : 0,
    pendingApprovals: pendingApprovals.length,
    openReports: openReports.length,
  };
}

export function computeUsersByRole(users) {
  const counts = { tenant: 0, owner: 0, admin: 0 };
  users.forEach((u) => {
    if (counts[u.role] !== undefined) counts[u.role] += 1;
  });
  return [
    { name: 'Tenants', value: counts.tenant },
    { name: 'Owners', value: counts.owner },
    { name: 'Admins', value: counts.admin },
  ];
}

export function computeRevenueByMonth(bookings, months = 6) {
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

export function computePropertyTypeDistribution(rentals) {
  const counts = {};
  rentals.forEach((r) => {
    const type = r.bedType || 'Other';
    counts[type] = (counts[type] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export function computeBookingStatusCounts(bookings) {
  const counts = {};
  bookings.forEach((b) => {
    counts[b.status] = (counts[b.status] || 0) + 1;
  });
  return Object.entries(counts).map(([status, count]) => ({ status, count }));
}
