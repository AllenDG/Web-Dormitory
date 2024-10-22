import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";

const countries = ["Philippines", "USA", "Canada", "UK", "Australia"];

export default function PaymentMethodForm() {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      maxW="800px"
      margin="auto"
      p={4}
     
      
    >
      <Box flex="1" p={4}>
        <Text fontSize="xl" mb={4} fontWeight="bold">
          Payment Details
        </Text>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>~
            <FormLabel>First Name</FormLabel>
            <Input placeholder="First Name" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input placeholder="Last Name" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Address</FormLabel>
            <Input placeholder="Address" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Phone Number</FormLabel>
            <Input placeholder="Phone Number" />
          </FormControl>
          <Flex>
            <FormControl isRequired flex="1" mr={2}>
              <FormLabel>City</FormLabel>
              <Input placeholder="City" />
            </FormControl>
            <FormControl isRequired flex="1">
              <FormLabel>Zip Code</FormLabel>
              <Input placeholder="Zip Code" />
            </FormControl>
          </Flex>
          <FormControl isRequired>
            <FormLabel>Country</FormLabel>
            <Select placeholder="Select Country">
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </Select>
          </FormControl>
          <Text fontSize="lg" mt={4}>
            Fixed Price: <strong>₱50</strong>
          </Text>
          <Button colorScheme="blue" mt={4}>
            Confirm Payment
          </Button>
        </VStack>
      </Box>

      {/* Add your order summary here */}
      <Box
        flex="1"
        p={4}
        borderLeftWidth={{ base: 0, md: 1 }}
        borderColor="gray.200"
      >
        <Text fontSize="xl" mb={4} fontWeight="bold">
          Order Summary
        </Text>
        <Box p={4} bg="gray.50" borderRadius="md">
          <Text>
            <strong>Item:</strong> Your Product Name
          </Text>
          <Text>
            <strong>Price:</strong> ₱50
          </Text>
          <Text>
            <strong>Total:</strong> ₱50
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}
