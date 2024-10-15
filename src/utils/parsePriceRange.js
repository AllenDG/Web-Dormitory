export const parsePriceRange = (priceRangeString) => {
  if (priceRangeString.startsWith("below")) {
    return [0, 5000];
  } else if (priceRangeString.startsWith("above")) {
    return [30000, Infinity];
  } else {
    const [min, max] = priceRangeString.match(/\d+/g).map(Number);
    return [min, max];
  }
};
