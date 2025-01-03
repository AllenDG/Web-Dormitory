import {
  Box,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Avatar,
  Button,
  Text,
  useColorModeValue,
  Flex,
  Heading,
  TableContainer,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatIcon } from "@chakra-ui/icons";

// Sample data for tenants
const tenantsData = [
  {
    lastName: "Doe",
    firstName: "John",
    age: 25,
    gender: "Male",
    hobbies: ["Wifi / Internet", "Fitness Gym"],
    status: "Pending",
    profilePic: "https://via.placeholder.com/40",
  },
  {
    lastName: "Smith",
    firstName: "Jane",
    age: 28,
    gender: "Female",
    hobbies: ["Swimming Pool", "Pet Friendly"],
    status: "Approved",
    profilePic: "https://via.placeholder.com/40",
  },
  {
    lastName: "Lee",
    firstName: "Kevin",
    age: 22,
    gender: "Male",
    hobbies: ["KTV Room", "Recreational Area"],
    status: "Rejected",
    profilePic: "https://via.placeholder.com/40",
  },
  // Add more tenants for testing pagination
];

export default function OwnerTenantsPage() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const [searchTerm, setSearchTerm] = useState("");
  const [tenants, setTenants] = useState(tenantsData);
  const [currentPage, setCurrentPage] = useState(1);
  const tenantsPerPage = 2;

  // Handle search filtering
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status change
  const handleStatusChange = (index, newStatus) => {
    const updatedTenants = tenants.map((tenant, i) =>
      i === index ? { ...tenant, status: newStatus } : tenant
    );
    setTenants(updatedTenants);
  };

  // Filter tenants based on search
  const filteredTenants = tenants.filter((tenant) =>
    tenant.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastTenant = currentPage * tenantsPerPage;
  const indexOfFirstTenant = indexOfLastTenant - tenantsPerPage;
  const currentTenants = filteredTenants.slice(
    indexOfFirstTenant,
    indexOfLastTenant
  );

  const totalPages = Math.ceil(filteredTenants.length / tenantsPerPage);

  return (
    <Box direction="column" minH="100vh" bgColor={bgColor} p={8}>
      {/* Page Heading and Add Rentals Button */}
      <Flex justify="space-between" mb={6} align="center">
        <Heading size="lg" fontWeight="bold">
          Manage Tenants
        </Heading>
      </Flex>

      {/* Search Filter and Pagination Controls */}
      <Flex mb={6} align="center" justify="space-between" wrap="wrap">
        <Input
          placeholder="Search by Rental Type"
          value={searchTerm}
          onChange={handleSearch}
          width={{ base: "100%", md: "300px" }} // Responsive width
          mr={4} // Margin to the right for spacing
          mb={{ base: 4, md: 0 }} // Add bottom margin on mobile
        />

        {/* Pagination Controls */}
        <Flex align="center" flexDirection={{ base: "column", sm: "row" }}>
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
              <Th>Profile</Th>
              <Th>Last Name</Th>
              <Th>First Name</Th>
              <Th>Age</Th>
              <Th>Gender</Th>
              <Th>Hobbies (Amenities)</Th>
              <Th>Message</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentTenants.map((tenant, index) => (
              <Tr key={index}>
                {/* Profile Picture */}
                <Td>
                  <Avatar size="sm" src={tenant.profilePic} />
                </Td>
                <Td>{tenant.lastName}</Td>
                <Td>{tenant.firstName}</Td>
                <Td>{tenant.age}</Td>
                <Td>{tenant.gender}</Td>
                <Td>{tenant.hobbies.join(", ")}</Td>
                <Td>
                  {/* Message Icon */}
                  <Button
                    leftIcon={<ChatIcon />}
                    colorScheme="blue"
                    onClick={() => alert(`Chatting with ${tenant.firstName}`)}
                    size="sm"
                  >
                    Chat
                  </Button>
                </Td>
                <Td>
                  <Select
                    value={tenant.status}
                    onChange={(e) => handleStatusChange(index, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </Select>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
