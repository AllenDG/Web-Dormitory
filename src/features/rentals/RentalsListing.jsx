import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { priceFormatter } from "../../utils/priceFormatter";
import {
  Wrap,
  WrapItem,
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
  Button,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { amenityIcons } from "../../utils/amenityIcon";
import amenities from "../../data/amenities.json";
import usePopularLocations from "../../hooks/usePopularLocation";

export default function RentalsListing() {
  const popularLocations = usePopularLocations(5);
  const bgColor = useColorModeValue("#F4F4F4", "gray.700");
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
        focusBorderColor="#0084FF"
      />

      <LightMode>
        <Wrap spacing="10px" align="center" justify="center">
          {amenities.map((amenity) => (
            <WrapItem key={amenity}>
              <Tag
                size="lg"
                colorScheme="blue"
                borderRadius="full"
                cursor="pointer"
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
                  bg="#0084FF"
                  borderRadius="md"
                  _hover={{ bg: "blue.600" }}
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
              <Card maxW="sm" bg={bgColor} boxShadow="lg" borderRadius="md">
                <CardBody>
                  <Image
                    src={listing.imageUrl[0]}
                    alt={listing.title}
                    borderRadius="lg"
                    objectFit="cover"
                    w="100%"
                    h="250px"
                  />
                  <Stack mt="4" spacing="3">
                    <Heading size="md" noOfLines={1}>
                      {listing.title}
                    </Heading>
                    <Text noOfLines={2}>{listing.address}</Text>
                    <Heading
                      color="#0084FF"
                      as="h4"
                      fontSize="lg"
                      noOfLines={1}
                    >
                      {priceFormatter(listing.price)} monthly
                    </Heading>
                    <HStack spacing={1} align="center">
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={i}
                          as={StarIcon}
                          color={i < listing.rating ? "#0084FF" : "gray.300"}
                        />
                      ))}
                    </HStack>
                    <Button
                      as={Link}
                      to={`/listing/${listing.id}`}
                      colorScheme="blue"
                      variant="outline"
                    >
                      View
                    </Button>
                  </Stack>
                </CardBody>
              </Card>
            </WrapItem>
          ))
        ) : (
          <Text>No rentals match the selected amenities or search query.</Text>
        )}
      </Wrap>
    </>
  );
}
