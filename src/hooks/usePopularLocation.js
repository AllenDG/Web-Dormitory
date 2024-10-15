import { useMemo } from "react";
import rentalListing from "../data/rentalListing.json";

export default function usePopularLocations(topNigga = 5) {
  return useMemo(() => {
    const locationCount = {};

    rentalListing.forEach((listing) => {
      const location = listing.city;
      if (location) {
        locationCount[location] = (locationCount[location] || 0) + 1;
      }
    });

    const sortedLocations = Object.entries(locationCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topNigga);

    return sortedLocations.map(([location, count]) => ({
      location,
      count,
    }));
  }, [topNigga]);
}
