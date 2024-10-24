import { useState } from "react";
import {
  Box,
  Flex,
  useColorModeValue,
  Input,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Text,
  Heading,
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
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
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
    <Box direction="column" minH="100vh" bgColor={bgColor} p={8}>
      {/* Page Heading and Add Rentals Button */}
      <Flex justify="space-between" mb={6} align="center">
        <Heading size="lg" fontWeight="bold">
          Manage Rentals
        </Heading>
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
      <Flex mb={6} align="center" justify="space-between" wrap="wrap">
        <Input
          placeholder="Search by Rental Type"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          width={{ base: "100%", md: "300px" }} // Responsive width
          mr={4} // Margin to the right for spacing
          mb={{ base: 4, md: 0 }} // Add bottom margin on mobile
        />

        {/* Pagination Controls */}
        <Flex align="center">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            isDisabled={currentPage === 1}
            mr={2}
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
            ml={2}
          >
            Next
          </Button>
        </Flex>
      </Flex>

      {/* Rentals Table */}
      <TableContainer>
        <Table
          variant="striped"
          bg={cardBgColor}
          borderRadius="md"
          boxShadow="md"
        >
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
      </TableContainer>
    </Box>
  );
}
