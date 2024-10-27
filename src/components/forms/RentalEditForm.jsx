import { useState } from "react";
import {
  Box,
  Button,
  FormLabel,
  Input,
  Select,
  HStack,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  Checkbox,
  CheckboxGroup,
  LightMode,
} from "@chakra-ui/react";

const amenitiesOptions = [
  "Wifi / Internet",
  "Aircon",
  "Refrigerator",
  "Kitchen",
  "Parking",
  "Elevator",
  "Study Hub",
  "KTV Room",
  "Community Area",
  "Swimming Pool",
  "Fitness Gym",
  "Meeting Room",
  "Commercial Spaces",
  "Roof Deck",
  "Recreational Area",
  "Pet Friendly",
];

const RentalEditForm = ({ rental, onSave }) => {
  const [editedRental, setEditedRental] = useState(rental);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRental((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checkedValues) => {
    setEditedRental((prev) => ({
      ...prev,
      amenities: checkedValues,
    }));
  };

  const handleSave = () => {
    onSave(editedRental);
    onClose();
  };

  return (
    <>
      <Popover
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        placement="top-start"
      >
        <PopoverTrigger>
          <LightMode>
            <Button colorScheme="primary" onClick={onOpen}>
              Edit
            </Button>
          </LightMode>
        </PopoverTrigger>
        <PopoverContent
          maxW="400px"
          boxShadow="lg"
          borderRadius="md"
          zIndex={10}
          m={0}
          transform="translateY(-8px) translateX(-8px)"
        >
          <PopoverArrow />
          <PopoverHeader fontWeight="bold">Edit Rental</PopoverHeader>
          <PopoverBody maxH="300px" overflowY="auto">
            <Box>
              <HStack spacing={4} mb={4}>
                <FormLabel>Type</FormLabel>
                <Select
                  name="type"
                  value={editedRental.type}
                  onChange={handleChange}
                >
                  <option value="Solo">Solo</option>
                  <option value="Double">Double</option>
                  <option value="Studio">Studio</option>
                  <option value="Family Room">Family Room</option>
                  <option value="Couple Room">Couple Room</option>
                </Select>
              </HStack>
              <FormLabel>Amenities</FormLabel>
              <CheckboxGroup
                value={editedRental.amenities}
                onChange={handleCheckboxChange}
              >
                <Box
                  maxH="200px" // Set maximum height for amenities box
                  overflowY="auto" // Enable vertical scrolling for amenities
                  border="1px"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={2}
                  bg="white"
                  boxShadow="sm"
                >
                  {amenitiesOptions.map((option) => (
                    <Checkbox key={option} value={option}>
                      {option}
                    </Checkbox>
                  ))}
                </Box>
              </CheckboxGroup>
              <HStack spacing={4} mb={4}>
                <FormLabel>Schedule Visit</FormLabel>
                <Input
                  type="date"
                  name="scheduleVisit"
                  value={editedRental.scheduleVisit}
                  onChange={handleChange}
                />
              </HStack>

              <HStack spacing={4}>
                <FormLabel>Status</FormLabel>
                <Select
                  name="status"
                  value={editedRental.status}
                  onChange={handleChange}
                >
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </Select>
              </HStack>
              <Button
                mt={4}
                bg="#0084FF" // Set the background color to #0084FF
                color="white" // Set text color to white for better visibility
                onClick={handleSave}
              >
                Save
              </Button>
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default RentalEditForm;
