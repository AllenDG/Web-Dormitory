import { describe, it, expect, beforeEach } from 'vitest';
import useCompareStore from './useCompareStore';
import useRentalStore from './useRentalStore';

const RENTAL_IDS = ['1', '2', '3', '4', '5'];

describe('useCompareStore', () => {
  beforeEach(() => {
    useCompareStore.setState({ compareList: [] });
  });

  it('starts empty with a max of 4', () => {
    const state = useCompareStore.getState();
    expect(state.compareList).toEqual([]);
    expect(state.maxCompare).toBe(4);
    expect(state.hasProperties()).toBe(false);
  });

  it('adds a valid property to the comparison list', () => {
    const added = useCompareStore.getState().addToCompare(RENTAL_IDS[0]);
    expect(added).toBe(true);
    expect(useCompareStore.getState().compareList).toEqual([RENTAL_IDS[0]]);
    expect(useCompareStore.getState().isInCompare(RENTAL_IDS[0])).toBe(true);
  });

  it('refuses to add a property id that does not exist in the rental store', () => {
    const added = useCompareStore.getState().addToCompare('does-not-exist');
    expect(added).toBe(false);
    expect(useCompareStore.getState().compareList).toEqual([]);
  });

  it('refuses to add the same property twice', () => {
    useCompareStore.getState().addToCompare(RENTAL_IDS[0]);
    const addedAgain = useCompareStore.getState().addToCompare(RENTAL_IDS[0]);
    expect(addedAgain).toBe(false);
    expect(useCompareStore.getState().compareList).toEqual([RENTAL_IDS[0]]);
  });

  it('enforces the max-of-4 cap', () => {
    RENTAL_IDS.forEach((id) => useCompareStore.getState().addToCompare(id));

    expect(useCompareStore.getState().compareList).toHaveLength(4);
    expect(useCompareStore.getState().canAddMore()).toBe(false);
    expect(useCompareStore.getState().isLimitReached()).toBe(true);

    const fifthAdded = useCompareStore.getState().addToCompare(RENTAL_IDS[4]);
    expect(fifthAdded).toBe(false);
    expect(useCompareStore.getState().compareList).toHaveLength(4);
  });

  it('removes a property from the comparison list', () => {
    useCompareStore.getState().addToCompare(RENTAL_IDS[0]);
    const removed = useCompareStore.getState().removeFromCompare(RENTAL_IDS[0]);
    expect(removed).toBe(true);
    expect(useCompareStore.getState().compareList).toEqual([]);
  });

  it('toggleCompare adds when absent and removes when present', () => {
    const first = useCompareStore.getState().toggleCompare(RENTAL_IDS[0]);
    expect(first).toBe(true);
    expect(useCompareStore.getState().isInCompare(RENTAL_IDS[0])).toBe(true);

    const second = useCompareStore.getState().toggleCompare(RENTAL_IDS[0]);
    expect(second).toBe(false);
    expect(useCompareStore.getState().isInCompare(RENTAL_IDS[0])).toBe(false);
  });

  it('clearCompare empties the list', () => {
    RENTAL_IDS.slice(0, 3).forEach((id) => useCompareStore.getState().addToCompare(id));
    useCompareStore.getState().clearCompare();
    expect(useCompareStore.getState().compareList).toEqual([]);
  });

  it('getCompareProperties resolves ids to real rental objects from useRentalStore', () => {
    useCompareStore.getState().addToCompare(RENTAL_IDS[0]);
    useCompareStore.getState().addToCompare(RENTAL_IDS[1]);

    const properties = useCompareStore.getState().getCompareProperties();
    expect(properties).toHaveLength(2);
    expect(properties.map((p) => p.id)).toEqual([RENTAL_IDS[0], RENTAL_IDS[1]]);
  });

  it('cleanupDeletedProperties drops ids no longer present in the rental store', () => {
    const rentals = useRentalStore.getState().rentals;
    useRentalStore.getState().addRental({ ...rentals[0], id: undefined, title: 'Temp for cleanup test' });
    const tempId = useRentalStore.getState().rentals.at(-1).id;

    useCompareStore.getState().addToCompare(tempId);
    useRentalStore.getState().deleteRental(tempId);

    const removedCount = useCompareStore.getState().cleanupDeletedProperties();
    expect(removedCount).toBe(1);
    expect(useCompareStore.getState().compareList).toEqual([]);
  });
});
