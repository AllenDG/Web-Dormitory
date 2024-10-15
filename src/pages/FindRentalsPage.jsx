import { Flex, useColorModeValue } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import FindRentalsListing from "../features/rentals/FindRentalListing";

export default function FindRentalsPage() {
  const [searchParams] = useSearchParams();
  const bgColor = useColorModeValue("bg.light", "bg.dark");

  const location = searchParams.get("location");
  const priceRange = searchParams.get("priceRange");
  const amenity = searchParams.get("amenity");
  const bedType = searchParams.get("bedType");

  return (
    <Flex direction="column" minH="100vh" align="center" bg={bgColor}>
      <FindRentalsListing
        searchFor={location}
        priceRg={priceRange}
        amenity={amenity}
        bedType={bedType}
      />
    </Flex>
  );
}
