import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { priceFormatter } from "../../utils/priceFormatter";
import {
  Wrap,
  WrapItem,
  Center,
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  Radio,
  RadioGroup,
  Button,
  Flex,
  Input,
  Grid,
  GridItem,
  Icon,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { FaFilter, FaSearch, FaHome } from "react-icons/fa"; // Import icons
import Map from "../../components/ui/Map";
import priceRange from "../../data/priceRange.json";
import amenities from "../../data/amenities.json";
import bedTypes from "../../data/bedTypes.json";
import useFilteredListings from "../../hooks/useFilteredListings";

export default function FindRentalsListing({
  searchFor,
  priceRg,
  amenity,
  bedType,
}) {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("bg.light", "bg.dark");
  const [searchQuery, setSearchQuery] = useState(searchFor || "");
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRg || "");
  const [selectedAmenities, setSelectedAmenities] = useState(
    amenity ? [amenity] : []
  );
  const [selectedBedType, setSelectedBedType] = useState(
    bedType ? [bedType] : []
  );

  const filteredListings = useFilteredListings(
    searchQuery,
    selectedPriceRange,
    selectedAmenities,
    selectedBedType
  );

  const handlePriceChange = (value) => {
    setSelectedPriceRange(value);
  };

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleBedTypeChange = (bedType) => {
    setSelectedBedType((prev) =>
      prev.includes(bedType)
        ? prev.filter((b) => b !== bedType)
        : [...prev, bedType]
    );
  };

  const handleMarkerClick = (id) => {
    navigate(`/listing/${id}`);
  };

  return (
    <Grid width="100%" templateColumns={{ md: "repeat(3, 1fr)" }} gap={6}>
      <GridItem colSpan={{ base: 1, md: 2 }}>
        <Flex w="100%" flexWrap="wrap" p="20px" gap="10px" justify="start">
          <Input
            maxW="lg"
            placeholder="Search for listings..."
            onChange={(e) => setSearchQuery(e.target.value)}
            focusBorderColor="primary.500"
            rightElement={
              <Button
                bg="primary.500"
                color="white"
                _hover={{ bg: "primary.600" }}
                onClick={() => {
                  // Handle search button click
                  console.log("Searching for:", searchQuery);
                }}
              >
                <Icon as={FaSearch} />
              </Button>
            }
          />
          <Flex w="100%" flexWrap="wrap" gap="10px" justify="start">
            <Menu closeOnSelect={false}>
              <MenuButton as={Button} leftIcon={<FaFilter />}>
                Select Price Range
              </MenuButton>
              <MenuList bg={bgColor}>
                <RadioGroup
                  onChange={handlePriceChange}
                  value={selectedPriceRange}
                  bg={bgColor}
                >
                  {priceRange.map((price) => (
                    <MenuItem key={price} bg={bgColor}>
                      <Radio value={price}>{price}</Radio>
                    </MenuItem>
                  ))}
                  <MenuItem
                    onClick={() => setSelectedPriceRange("")}
                    justifyContent="center"
                    bg={bgColor}
                  >
                    Clear Filter
                  </MenuItem>
                </RadioGroup>
              </MenuList>
            </Menu>

            <Menu closeOnSelect={false} isLazy>
              <MenuButton as={Button} leftIcon={<FaHome />}>
                Select Amenities
              </MenuButton>
              <MenuList bg={bgColor}>
                {amenities.map((amenity) => (
                  <MenuItem key={amenity} bg={bgColor}>
                    <Checkbox
                      isChecked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                    >
                      {amenity}
                    </Checkbox>
                  </MenuItem>
                ))}
                <MenuItem
                  onClick={() => setSelectedAmenities([])}
                  justifyContent="center"
                  bg={bgColor}
                >
                  Clear Filter
                </MenuItem>
              </MenuList>
            </Menu>

            <Menu closeOnSelect={false}>
              <MenuButton as={Button} leftIcon={<FaHome />}>
                Select Bed Type
              </MenuButton>
              <MenuList bg={bgColor}>
                {bedTypes.map((bed) => (
                  <MenuItem key={bed} bg={bgColor}>
                    <Checkbox
                      isChecked={selectedBedType.includes(bed)}
                      onChange={() => handleBedTypeChange(bed)}
                    >
                      {bed}
                    </Checkbox>
                  </MenuItem>
                ))}
                <MenuItem
                  onClick={() => setSelectedBedType([])}
                  justifyContent="center"
                  bg={bgColor}
                >
                  Clear Filter
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        <Wrap
          spacing="10px"
          align="center"
          h="70vh"
          overflowY="auto"
          justify="center"
        >
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
              <WrapItem key={listing.id}>
                <Link to={`/listing/${listing.id}`}>
                  <Center maxW={{ base: "300px", md: "250px" }} h="auto">
                    <Card
                      maxW="sm"
                      bg={bgColor}
                      borderRadius="md"
                      boxShadow="lg"
                    >
                      <CardBody>
                        <Image
                          src={listing.imageUrl[0]}
                          alt={listing.title}
                          borderRadius="lg"
                          objectFit="cover"
                          w="100%"
                          h="200px"
                        />
                        <Stack mt="6" spacing="3">
                          <Heading size="md" noOfLines={1}>
                            {listing.title}
                          </Heading>
                          <Text noOfLines={2}>{listing.address}</Text>
                          <Heading
                            color="primary.500"
                            as="h4"
                            fontSize="lg"
                            noOfLines={1}
                          >
                            {priceFormatter(listing.price)} monthly
                          </Heading>
                        </Stack>
                        <Divider />
                        <Flex justify="space-between" mt={3}>
                          <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={() => handleMarkerClick(listing.id)}
                          >
                            View Details
                          </Button>
                          <Badge colorScheme="green">New</Badge>
                        </Flex>
                      </CardBody>
                    </Card>
                  </Center>
                </Link>
              </WrapItem>
            ))
          ) : (
            <Text>No rentals match the selected filters.</Text>
          )}
        </Wrap>
      </GridItem>

      <GridItem colSpan={{ base: 1, md: 1 }}>
        <Map
          filteredListings={filteredListings}
          onMarkerClick={handleMarkerClick}
        />
      </GridItem>
    </Grid>
  );
}
