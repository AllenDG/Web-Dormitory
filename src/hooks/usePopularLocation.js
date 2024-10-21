import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function usePopularLocations(topNigga = 5) {
  const rentalListings = useSelector((state) => state.rentals.rentals);

  return useMemo(() => {
    const locationCount = {};

    rentalListings.forEach((listing) => {
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
