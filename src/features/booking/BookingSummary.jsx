import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  IconButton,

} from "@chakra-ui/react";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const BookingSummary = ({ bookings = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Items per page

  // Paginated bookings
  const paginatedBookings = bookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Function to handle page change
  const handlePageChange = (direction) => {
    if (
      direction === "next" &&
      currentPage < Math.ceil(bookings.length / itemsPerPage)
    ) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Box w="100%" p={4} bg="white" borderRadius="md" boxShadow="lg" mt={35}>
      <Heading as="h2" size="md" mb={4} color="blue.500">
        Booking Summary
      </Heading>

      {/* Pagination */}
      <HStack spacing={4} justify="center" mb={4}>
        <IconButton
          icon={<ChevronLeftIcon />}
          onClick={() => handlePageChange("prev")}
          isDisabled={currentPage === 1}
          aria-label="Previous Page"
          variant="outline"
          colorScheme="blue"
        />
        <Button variant="link" colorScheme="blue" isDisabled>
          {`${currentPage} / ${Math.ceil(bookings.length / itemsPerPage)}`}
        </Button>
        <IconButton
          icon={<ChevronRightIcon />}
          onClick={() => handlePageChange("next")}
          isDisabled={currentPage === Math.ceil(bookings.length / itemsPerPage)}
          aria-label="Next Page"
          variant="outline"
          colorScheme="blue"
        />
      </HStack>

      {/* Table for Booking Summary */}
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Status</Th>
            <Th>Date and Time</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedBookings.length > 0 ? (
            paginatedBookings.map((booking, index) => (
              <Tr key={index}>
                <Td>
                  <Button
                    width="full"
                    colorScheme={
                      booking.status === "Pending"
                        ? "yellow"
                        : booking.status === "Approved"
                        ? "green"
                        : "red"
                    }
                    cursor="default"
                    _hover={{
                      bg:
                        booking.status === "Pending"
                          ? "yellow.400"
                          : booking.status === "Approved"
                          ? "green.400"
                          : "red.400",
                    }}
                    _active={{
                      bg:
                        booking.status === "Pending"
                          ? "yellow.400"
                          : booking.status === "Approved"
                          ? "green.400"
                          : "red.400",
                    }}
                    isDisabled
                  >
                    {booking.status}
                  </Button>
                </Td>
                <Td>{booking.dateTime}</Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={2} textAlign="center">
                No bookings available.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default BookingSummary;
