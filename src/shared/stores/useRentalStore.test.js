import { describe, it, expect, beforeEach } from 'vitest';
import rentalListingData from '../../data/rentalListing.json';
import useRentalStore from './useRentalStore';

describe('useRentalStore', () => {
  beforeEach(() => {
    useRentalStore.setState({
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
    });
  });

  describe('CRUD', () => {
    it('addRental appends a new rental with a generated id', () => {
      const before = useRentalStore.getState().rentals.length;
      const created = useRentalStore.getState().addRental({ title: 'New Listing', price: 4000 });

      expect(useRentalStore.getState().rentals).toHaveLength(before + 1);
      const stored = useRentalStore.getState().rentals.at(-1);
      expect(stored.title).toBe('New Listing');
      expect(stored.id).toBeTruthy();
      expect(created).toBeUndefined(); // addRental does not currently return the created rental
    });

    it('updateRental merges updates into the matching rental by id', () => {
      const targetId = useRentalStore.getState().rentals[0].id;
      useRentalStore.getState().updateRental(targetId, { price: 9999 });

      const updated = useRentalStore.getState().getRentalById(targetId);
      expect(updated.price).toBe(9999);
    });

    it('updateRental leaves other rentals untouched', () => {
      const [first, second] = useRentalStore.getState().rentals;
      useRentalStore.getState().updateRental(first.id, { price: 1 });

      expect(useRentalStore.getState().getRentalById(second.id).price).toBe(second.price);
    });

    it('deleteRental removes the rental with the matching id', () => {
      const before = useRentalStore.getState().rentals.length;
      const targetId = useRentalStore.getState().rentals[0].id;
      useRentalStore.getState().deleteRental(targetId);

      expect(useRentalStore.getState().rentals).toHaveLength(before - 1);
      expect(useRentalStore.getState().getRentalById(targetId)).toBeUndefined();
    });
  });

  describe('getFilteredRentals', () => {
    it('filters by searchQuery across title/city/address', () => {
      useRentalStore.getState().setFilters({ searchQuery: 'Dagupan' });
      const results = useRentalStore.getState().getFilteredRentals();
      expect(results.length).toBeGreaterThan(0);
      results.forEach((r) => {
        const haystack = `${r.title} ${r.city} ${r.address}`.toLowerCase();
        expect(haystack).toContain('dagupan');
      });
    });

    it('filters by priceRange inclusively', () => {
      useRentalStore.getState().setFilters({ priceRange: [2800, 2800] });
      const results = useRentalStore.getState().getFilteredRentals();
      expect(results.every((r) => r.price === 2800)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    it('filters by required amenities (every, not some)', () => {
      useRentalStore.getState().setFilters({ amenities: ['Wifi / Internet', 'Parking'] });
      const results = useRentalStore.getState().getFilteredRentals();
      results.forEach((r) => {
        expect(r.amenities).toEqual(expect.arrayContaining(['Wifi / Internet', 'Parking']));
      });
    });

    it('filters by bedType exact match', () => {
      useRentalStore.getState().setFilters({ bedType: 'Double Bed' });
      const results = useRentalStore.getState().getFilteredRentals();
      expect(results.every((r) => r.bedType === 'Double Bed')).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    it('filters by city case-insensitively', () => {
      useRentalStore.getState().setFilters({ city: 'dagupan' });
      const results = useRentalStore.getState().getFilteredRentals();
      expect(results.every((r) => r.city.toLowerCase() === 'dagupan')).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    it('resetFilters restores the default filter shape', () => {
      useRentalStore.getState().setFilters({ city: 'Dagupan', searchQuery: 'studio' });
      useRentalStore.getState().resetFilters();

      expect(useRentalStore.getState().filters).toEqual({
        searchQuery: '',
        priceRange: [0, 10000],
        amenities: [],
        bedType: '',
        city: '',
      });
    });
  });

  describe('favorites', () => {
    it('toggleFavorite adds then removes a rental id', () => {
      const id = useRentalStore.getState().rentals[0].id;

      useRentalStore.getState().toggleFavorite(id);
      expect(useRentalStore.getState().isFavorite(id)).toBe(true);

      useRentalStore.getState().toggleFavorite(id);
      expect(useRentalStore.getState().isFavorite(id)).toBe(false);
    });

    it('getFavoriteRentals returns full rental objects for favorited ids', () => {
      const id = useRentalStore.getState().rentals[0].id;
      useRentalStore.getState().toggleFavorite(id);

      const favorites = useRentalStore.getState().getFavoriteRentals();
      expect(favorites).toHaveLength(1);
      expect(favorites[0].id).toBe(id);
    });
  });

  describe('units', () => {
    it('addUnit appends a unit with a generated id to a rental with no prior units', () => {
      const rentalId = useRentalStore.getState().rentals[0].id;
      useRentalStore.getState().addUnit(rentalId, { label: 'Room A', price: 3000, availablePerson: 2 });

      const units = useRentalStore.getState().getRentalById(rentalId).units;
      expect(units).toHaveLength(1);
      expect(units[0]).toMatchObject({ label: 'Room A', price: 3000, availablePerson: 2 });
      expect(units[0].id).toBeTruthy();
    });

    it('addUnit appends to existing units rather than replacing them', () => {
      const rentalId = useRentalStore.getState().rentals[0].id;
      useRentalStore.getState().addUnit(rentalId, { label: 'Room A', price: 3000 });
      useRentalStore.getState().addUnit(rentalId, { label: 'Room B', price: 3500 });

      const units = useRentalStore.getState().getRentalById(rentalId).units;
      expect(units).toHaveLength(2);
      expect(units.map((u) => u.label)).toEqual(['Room A', 'Room B']);
    });

    it('updateUnit merges updates into the matching unit only', () => {
      const rentalId = useRentalStore.getState().rentals[0].id;
      useRentalStore.getState().addUnit(rentalId, { label: 'Room A', price: 3000 });
      useRentalStore.getState().addUnit(rentalId, { label: 'Room B', price: 3500 });
      const [unitA, unitB] = useRentalStore.getState().getRentalById(rentalId).units;

      useRentalStore.getState().updateUnit(rentalId, unitA.id, { price: 3200 });

      const units = useRentalStore.getState().getRentalById(rentalId).units;
      expect(units.find((u) => u.id === unitA.id).price).toBe(3200);
      expect(units.find((u) => u.id === unitB.id).price).toBe(3500);
    });

    it('deleteUnit removes only the matching unit', () => {
      const rentalId = useRentalStore.getState().rentals[0].id;
      useRentalStore.getState().addUnit(rentalId, { label: 'Room A', price: 3000 });
      useRentalStore.getState().addUnit(rentalId, { label: 'Room B', price: 3500 });
      const [unitA] = useRentalStore.getState().getRentalById(rentalId).units;

      useRentalStore.getState().deleteUnit(rentalId, unitA.id);

      const units = useRentalStore.getState().getRentalById(rentalId).units;
      expect(units).toHaveLength(1);
      expect(units[0].label).toBe('Room B');
    });

    it('leaves other rentals untouched when managing one rental\'s units', () => {
      const [first, second] = useRentalStore.getState().rentals;
      useRentalStore.getState().addUnit(first.id, { label: 'Room A', price: 3000 });

      expect(useRentalStore.getState().getRentalById(second.id).units).toBeUndefined();
    });
  });
});
