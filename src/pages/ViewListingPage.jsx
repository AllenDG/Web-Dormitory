import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Flex,
  Heading,
  Text,
  Tag,
  TagLabel,
  TagLeftIcon,
  Grid,
  GridItem,
  useColorModeValue,
  Box,
  Button,
  Wrap,
  WrapItem,
  LightMode,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { priceFormatter } from "../utils/priceFormatter";
import { amenityIcons } from "../utils/amenityIcon";
import { IoHeartOutline, IoShareOutline } from "react-icons/io5";
import InquireForm from "../components/forms/InquireForm";
import ScheduleAVisitForm from "../components/forms/ScheduleAVisitForm";

import Slider from "react-slick";

export default function ViewListingPage() {
  const { id } = useParams();
  const bgColor = useColorModeValue("bg.light", "bg.dark");
  const rentalListings = useSelector((state) => state.rentals.rentals);

  const listing = useMemo(() => {
    return rentalListings.find((item) => item.id === id);
  }, [rentalListings]);

  if (!listing) return "We couldn't this listing for you";

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  

  return (
    <Flex direction="column" minH="100vh" p="20px" bg={bgColor}>
      {listing.imageUrl.length > 0 ? (
        <Box mb={6} p={3}>
          <Slider {...settings}>
            {listing?.imageUrl.map((item, index) => (
              <Box key={index} w="100%" h="300px">
                <img
                  src={item}
                  alt={`Listing Image ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "10px",
                    objectFit: "cover",
                  }}
                />
              </Box>
            ))}
          </Slider>
        </Box>
      ) : <Text>No images about this listing</Text>}

      <Grid templateColumns={{ md: "repeat(3, 1fr)" }} gap={6}>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <Heading as="h3" size="lg" mb={2}>
            {listing?.title}
          </Heading>
          <Text fontSize="lg" mb={2}>
            {listing?.address}
          </Text>

          <Text fontWeight="bold" color="primary.500" mb={2}>
            Description:
          </Text>
          <Text fontSize="lg" mb={4}>
            {listing?.description}
          </Text>

          <Text fontWeight="bold" color="primary.500" mb={4}>
            Amenities:
          </Text>

          {listing.amenities.length > 0 ? (
            <>
              <Wrap gap={6}>
                {listing?.amenities.map((amenity) => (
                  <WrapItem key={amenity}>
                    <Tag size="lg" borderRadius="full">
                      <TagLeftIcon as={amenityIcons[amenity]} />
                      <TagLabel>{amenity}</TagLabel>
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </>
          ) : <Text>No amenities madamot hehe</Text>}
        </GridItem>
        <GridItem>
          <Flex
            px="20px"
            py="10px"
            mb="20px"
            justify="space-between"
            align="center"
            borderWidth={1}
            borderRadius={20}
          >
            <Box>
              <Text>starts at</Text>
              <Heading as="h4" size="md">
                {priceFormatter(listing?.price)} monthly
              </Heading>
            </Box>

            <Box w="fit-content">
              <Button variant="outline" borderRadius="20px" mr="8px">
                <IoShareOutline size={20} />
              </Button>
              <Button variant="outline" borderRadius="20px">
                <IoHeartOutline size={20} />
              </Button>
            </Box>
          </Flex>
          <Flex px="20px" py="10px" borderWidth={1} borderRadius={20}>
            <LightMode>
              <Tabs w="100%" isFitted>
                <TabList mb="1em">
                  <Tab>Inquire</Tab>
                  <Tab>Schedule a Visit</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <InquireForm />
                  </TabPanel>
                  <TabPanel>
                    <ScheduleAVisitForm />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </LightMode>
          </Flex>
        </GridItem>
      </Grid>
    </Flex>
  );
}
