import { useState } from "react";
import {
  Box,
  Flex,
  useColorModeValue,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,

  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import RentalEditForm from "../components/forms/RentalEditForm"; // Import the RentalEditForm

const mockRentals = [
  {
    id: 1,
    type: "Solo",
    amenities: "WiFi, Air Conditioning",
    scheduleVisit: "2024-10-25",
    rating: 4.5,
    status: "Available",
  },
  {
    id: 2,
    type: "Double",
    amenities: "WiFi, Kitchen",
    scheduleVisit: "2024-10-26",
    rating: 4.0,
    status: "Not Available",
  },
  {
    id: 3,
    type: "Studio",
    amenities: "WiFi, Parking",
    scheduleVisit: "2024-10-27",
    rating: 5.0,
    status: "Available",
  },
  // Add more mock data as needed
];

const ITEMS_PER_PAGE = 3; // Number of items to display per page

export default function OwnerRentalsPage() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rentals, setRentals] = useState(mockRentals);

  // Filter rentals based on search term
  const filteredRentals = rentals.filter((rental) =>
    rental.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredRentals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRentals = filteredRentals.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Function to handle saving rental edits
  const handleSave = (editedRental) => {
    const updatedRentals = rentals.map((rental) =>
      rental.id === editedRental.id ? editedRental : rental
    );
    setRentals(updatedRentals);
  };

  return (
    <Box direction="column" minH="100vh" bgColor={bgColor} p={5}>
      <Flex justify="space-between" mb={4}>
        <h1>Rentals</h1>
        <Link to="/owner/add-rentals">
          <Button
            bg="#0084FF"
            color="white"
            _hover={{ bg: "#0073e6" }} // Optional: change color on hover
          >
            Add Rentals
          </Button>
        </Link>
      </Flex>

      {/* Search Filter and Pagination Controls */}
      <Flex mb={4} align="center" justify="space-between">
        <Input
          placeholder="Search by Type"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          width="300px" // Set a fixed width for the search input
          mr={4} // Margin to the right for spacing
        />

        {/* Pagination Controls */}
        <Flex align="center">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            isDisabled={currentPage === 1}
            mr={2} // Margin to the right for spacing
          >
            Previous
          </Button>
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            isDisabled={currentPage === totalPages}
            ml={2} // Margin to the left for spacing
          >
            Next
          </Button>
        </Flex>
      </Flex>

      {/* Rentals Table */}
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Type</Th>
            <Th>Amenities</Th>
            <Th>Schedule Visit</Th>
            <Th>Rating</Th>
            <Th>Status</Th>
            <Th>Edit</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentRentals.map((rental) => (
            <Tr key={rental.id}>
              <Td>{rental.type}</Td>
              <Td>{rental.amenities}</Td>
              <Td>{rental.scheduleVisit}</Td>
              <Td>{rental.rating}</Td>
              <Td>{rental.status}</Td>
              <Td>
                <RentalEditForm rental={rental} onSave={handleSave} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
