import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
  VStack,
  Icon,
  useColorModeValue,
  LightMode,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createRental } from "../../features/rentals/rentalSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { amenityIcons } from "../../utils/amenityIcon";
import {
  propertyInitialValues,
  propertyValidationSchema,
} from "../../utils/formHelper";
import bedTypes from "../../data/bedTypes.json";

const placesLibrary = ["places"];

const generateUniqueId = () => {
  return `id_${new Date().getTime()}_${Math.floor(Math.random() * 1000)}`;
};

export default function AddPropertyForm() {
  const dispatch = useDispatch();
  const bgColor = useColorModeValue("bg.light", "bg.dark");
  const [autocomplete, setAutocomplete] = useState(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: placesLibrary,
  });

  const handleSubmit = (values, { resetForm }) => {
    const parsedValues = {
      ...values,
      id: generateUniqueId(),
      latitude: parseFloat(values.latitude),
      longitude: parseFloat(values.longitude),
      price: parseFloat(values.price),
      availablePerson: parseInt(values.availablePerson, 10),
    };
    dispatch(createRental(parsedValues));
    resetForm();
  };

  const onLoad = (autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = (setFieldValue) => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      const location = place.geometry.location;

      setFieldValue("address", place.formatted_address);
      setFieldValue("latitude", location.lat());
      setFieldValue("longitude", location.lng());
    }
  };

  const addImageUrl = (setFieldValue, values) => {
    const newImageUrl = "";
    setFieldValue("imageUrl", [...values.imageUrl, newImageUrl]);
  };

  const removeImageUrl = (setFieldValue, index, values) => {
    const updatedImageUrl = values.imageUrl.filter((_, idx) => idx !== index);
    setFieldValue("imageUrl", updatedImageUrl);
  };

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box
      w="60%"
      mx="auto"
      my="6"
      p="6"
      bgColor={bgColor}
      borderWidth={1}
      boxShadow="lg"
      borderRadius="md"
    >
      <Formik
        initialValues={propertyInitialValues}
        validationSchema={propertyValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <VStack spacing={5} align="stretch">
              {[
                { name: "title", label: "Title" },
                {
                  name: "description",
                  label: "Description",
                  type: "textarea",
                },
                { name: "city", label: "City" },
                { name: "price", label: "Price" },
                { name: "availablePerson", label: "Available Person" },
              ].map((field) => (
                <FormControl key={field.name}>
                  <FormLabel>{field.label}</FormLabel>
                  <Field
                    as={field.type === "textarea" ? Textarea : Input}
                    name={field.name}
                  />
                  <ErrorMessage
                    name={field.name}
                    component={Text}
                    color="red.500"
                  />
                </FormControl>
              ))}

              <FormControl>
                <FormLabel>Bed Type</FormLabel>
                <Field as={Select} name="bedType">
                  <option value="">Select a bed type</option>
                  {bedTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="bedType" component={Text} color="red.500" />
              </FormControl>

              <FormControl>
                <FormLabel>Image URLs</FormLabel>
                {values.imageUrl.map((imageUrl, index) => (
                  <Flex key={index} alignItems="center" mb={2}>
                    <Field
                      as={Input}
                      name={`imageUrl[${index}]`}
                      placeholder="Enter image URL"
                    />
                    <LightMode>
                      <Button
                        ml={2}
                        colorScheme="red"
                        onClick={() =>
                          removeImageUrl(setFieldValue, index, values)
                        }
                      >
                        Remove
                      </Button>
                    </LightMode>
                  </Flex>
                ))}
                <LightMode>
                  <Button
                    onClick={() => addImageUrl(setFieldValue, values)}
                    colorScheme="blue"
                  >
                    Add Image URL
                  </Button>
                </LightMode>
              </FormControl>

              <FormControl>
                <FormLabel>Address</FormLabel>
                <Autocomplete
                  onLoad={onLoad}
                  onPlaceChanged={() => onPlaceChanged(setFieldValue)}
                >
                  <Field
                    as={Input}
                    name="address"
                    placeholder="Search location"
                  />
                </Autocomplete>
                <ErrorMessage name="address" component={Text} color="red.500" />
              </FormControl>

              <FormControl>
                <FormLabel>Amenities</FormLabel>
                <Stack direction="row" wrap="wrap" spacing={4}>
                  {Object.keys(amenityIcons).map((amenity) => {
                    const IconComponent = amenityIcons[amenity];
                    return (
                      <Checkbox
                        key={amenity}
                        value={amenity}
                        isChecked={values.amenities.includes(amenity)}
                        onChange={() => {
                          const currentAmenities = values.amenities;
                          setFieldValue(
                            "amenities",
                            currentAmenities.includes(amenity)
                              ? currentAmenities.filter((a) => a !== amenity)
                              : [...currentAmenities, amenity]
                          );
                        }}
                      >
                        <Flex alignItems="center">
                          <Icon as={IconComponent} mr={2} />
                          {amenity}
                        </Flex>
                      </Checkbox>
                    );
                  })}
                </Stack>
              </FormControl>

              <LightMode>
                <Button type="submit" colorScheme="green" w="full">
                  Create Rental
                </Button>
              </LightMode>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
