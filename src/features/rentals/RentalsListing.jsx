import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
  Tag,
  TagLabel,
  TagRightIcon,
  Divider,
  useColorModeValue,
  LightMode,
  Input,
  VStack,
} from "@chakra-ui/react";
import { amenityIcons } from "../../utils/amenityIcon";
import amenities from "../../data/amenities.json";
import usePopularLocations from "../../hooks/usePopularLocation";

export default function RentalsListing() {
  const popularLocations = usePopularLocations(5);
  const bgColor = useColorModeValue("bg.light", "bg.dark");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const rentalListings = useSelector((state) => state.rentals.rentals);

  const filteredListings = useMemo(() => {
    return rentalListings.filter((listing) => {
      const searchMatch =
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.address.toLowerCase().includes(searchQuery.toLowerCase());

      const amenityMatch = selectedAmenities.every((amenity) =>
        listing.amenities.includes(amenity)
      );

      return searchMatch && amenityMatch;
    });
  }, [selectedAmenities, searchQuery]);

  const handleAmenityClick = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <>
      <Input
        maxW="xl"
        mb="20px"
        placeholder="Search for listings..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        focusBorderColor="primary.500"
      />

      <LightMode>
        <Wrap spacing="10px" align="center" justify="center">
          {amenities.map((amenity) => (
            <WrapItem key={amenity}>
              <Tag
                size="lg"
                colorScheme="primary"
                borderRadius="full"
                onClick={() => handleAmenityClick(amenity)}
                variant={
                  selectedAmenities.includes(amenity) ? "solid" : "outline"
                }
              >
                <TagLabel>{amenity}</TagLabel>
                <TagRightIcon as={amenityIcons[amenity]} />
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      </LightMode>

      <Divider my="20px" />

      <VStack w="100%" spacing={4} align="start">
        <Heading as="h4" size="md">
          Popular Locations
        </Heading>
        <Wrap spacing="10px">
          {popularLocations.map(({ location, count }) => (
            <WrapItem key={location}>
              <Link to={`/find-rentals?location=${location}`}>
                <Text
                  p={2}
                  color="white"
                  bg="primary.500"
                  borderRadius="md"
                  _hover={{ bg: "primary.400" }}
                >
                  ({count}) {location}
                </Text>
              </Link>
            </WrapItem>
          ))}
        </Wrap>
      </VStack>

      <Divider my="20px" />

      <Wrap spacing="10px" align="center" justify="center">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <WrapItem key={listing.id}>
              <Link to={`/listing/${listing.id}`}>
                <Center maxW="300px" h="auto">
                  <Card maxW="sm" bg={bgColor}>
                    <CardBody>
                      <Image
                        src={listing.imageUrl[0]}
                        alt={listing.title}
                        borderRadius="lg"
                        objectFit="cover"
                        w="100%"
                        h="250px"
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
                    </CardBody>
                  </Card>
                </Center>
              </Link>
            </WrapItem>
          ))
        ) : (
          <Text>No rentals match the selected amenities or search query.</Text>
        )}
      </Wrap>
    </>
  );
}
