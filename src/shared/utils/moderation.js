// A rental is tenant-visible when explicitly approved, OR when it predates
// the moderationStatus field entirely — absence of the field must never be
// treated as "hidden" (all 10 seed rentalListing.json records have no field).
export const isTenantVisible = (rental) =>
  !rental.moderationStatus || rental.moderationStatus === 'approved';
