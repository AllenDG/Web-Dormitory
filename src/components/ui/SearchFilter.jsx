import { Flex, Input, Button, Text } from "@chakra-ui/react";

export default function SearchFilter({
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  return (
    <Flex mb={6} align="center" justify="space-between" wrap="wrap">
      <Input
        placeholder="Search by Rental Type"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        focusBorderColor="primary.500"
        width={{ base: "100%", md: "300px" }}
        mr={4}
        mb={{ base: 4, md: 0 }}
      />

      <Flex direction={{ base: "column", sm: "row" }}>
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
  );
}
