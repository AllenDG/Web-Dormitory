import { useState } from "react";
import {
  Box,
  Flex,
  useColorModeValue,
  Button,
  Heading,
  LightMode,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import SearchFilter from "../components/ui/SearchFilter";
import RentalsTable from "../components/tables/RentalsTable";
import rentalsData from "../data/rentals.json";

export default function OwnerRentalsPage() {
  const ITEMS_PER_PAGE = 3;
  const bgColor = useColorModeValue("bg.light", "bg.dark");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rentals, setRentals] = useState(rentalsData);

  const filteredRentals = rentals.filter((rental) =>
    rental.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRentals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRentals = filteredRentals.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSave = (editedRental) => {
    const updatedRentals = rentals.map((rental) =>
      rental.id === editedRental.id ? editedRental : rental
    );
    setRentals(updatedRentals);
  };

  return (
    <Box direction="column" minH="100vh" bgColor={bgColor} p={8}>
      <Flex justify="space-between" flexWrap="wrap" mb={6} align="center">
        <Heading size="lg" fontWeight="bold">
          Manage Rentals
        </Heading>
        <Link to="/owner/add-rentals">
          <LightMode>
            <Button colorScheme="primary" color="white">
              Add Rentals
            </Button>
          </LightMode>
        </Link>
      </Flex>
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
      <RentalsTable
        currentRentals={currentRentals}
        handleSave={handleSave}
        bgColor={bgColor}
      />
    </Box>
  );
}
