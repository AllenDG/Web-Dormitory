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
  Select,
  IconButton,
  HStack,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { MdMessage } from "react-icons/md"; // Import message icon

const mockRentals = [
  {
    id: 1,
    profile: "User1",
    lastName: "Doe",
    firstName: "John",
    gender: "Male",
    age: 30,
    status: "Pending",
  },
  {
    id: 2,
    profile: "User2",
    lastName: "Smith",
    firstName: "Jane",
    gender: "Female",
    age: 25,
    status: "Approved",
  },
  {
    id: 3,
    profile: "User3",
    lastName: "Brown",
    firstName: "Mike",
    gender: "Male",
    age: 28,
    status: "Pending",
  },
  {
    id: 4,
    profile: "User4",
    lastName: "Taylor",
    firstName: "Sarah",
    gender: "Female",
    age: 22,
    status: "Rejected",
  },
  {
    id: 5,
    profile: "User5",
    lastName: "Wilson",
    firstName: "Anna",
    gender: "Female",
    age: 31,
    status: "Approved",
  },
  {
    id: 6,
    profile: "User6",
    lastName: "Moore",
    firstName: "David",
    gender: "Male",
    age: 26,
    status: "Pending",
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
  const filteredRentals = rentals.filter(
    (rental) =>
      rental.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredRentals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRentals = filteredRentals.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Function to get the color for the option based on status
  const getOptionColor = (status) => {
    switch (status) {
      case "Pending":
        return "blue.500"; // Blue for Pending
      case "Approved":
        return "green.500"; // Green for Approved
      case "Rejected":
        return "red.500"; // Red for Rejected
      default:
        return "gray.500"; // Default color
    }
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
          placeholder="Search by First Name or Last Name"
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
            <Th>Profile</Th>
            <Th>Last Name</Th>
            <Th>First Name</Th>
            <Th>Gender</Th>
            <Th>Age</Th>
            <Th>Action</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentRentals.map((rental) => (
            <Tr key={rental.id}>
              <Td>{rental.profile}</Td>
              <Td>{rental.lastName}</Td>
              <Td>{rental.firstName}</Td>
              <Td>{rental.gender}</Td>
              <Td>{rental.age}</Td>
              <Td>
                <HStack>
                  <IconButton
                    icon={<MdMessage />}
                    aria-label="Send Message"
                    colorScheme="blue"
                    onClick={() =>
                      console.log(`Send message to ${rental.firstName}`)
                    }
                  />
                </HStack>
              </Td>
              <Td>
                <Select
                  placeholder="Select Status"
                  value={rental.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setRentals((prev) =>
                      prev.map((r) =>
                        r.id === rental.id ? { ...r, status: newStatus } : r
                      )
                    );
                  }}
                >
                  <option
                    style={{ color: getOptionColor("Pending") }}
                    value="Pending"
                  >
                    Pending
                  </option>
                  <option
                    style={{ color: getOptionColor("Approved") }}
                    value="Approved"
                  >
                    Approved
                  </option>
                  <option
                    style={{ color: getOptionColor("Rejected") }}
                    value="Rejected"
                  >
                    Rejected
                  </option>
                </Select>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
