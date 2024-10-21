import { useMemo } from "react";
import { useSelector } from "react-redux";
import { parsePriceRange } from "../utils/parsePriceRange";

export default function useFilteredListings(
  searchQuery,
  selectedPriceRange,
  selectedAmenities,
  selectedBedType
) {
  const rentalListings = useSelector((state) => state.rentals.rentals);

  return useMemo(() => {
    return rentalListings.filter((listing) => {
      const priceBounds = selectedPriceRange
        ? parsePriceRange(selectedPriceRange)
        : [0, Infinity];

      const amenitiesMatch =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((amenity) =>
          listing.amenities.includes(amenity)
        );

      const bedTypeMatch =
        selectedBedType.length === 0 ||
        selectedBedType.includes(listing.bedType);

      const priceMatch =
        selectedPriceRange === "" ||
        (listing.price >= priceBounds[0] && listing.price <= priceBounds[1]);

      const searchMatch =
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (listing.address &&
          listing.address.toLowerCase().includes(searchQuery.toLowerCase()));

      return amenitiesMatch && bedTypeMatch && priceMatch && searchMatch;
    });
  }, [selectedAmenities, selectedBedType, selectedPriceRange, searchQuery]);
}
