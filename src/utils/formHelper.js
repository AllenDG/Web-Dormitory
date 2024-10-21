import * as Yup from "yup";

export const propertyInitialValues = {
  title: "",
  description: "",
  city: "",
  address: "",
  latitude: "",
  longitude: "",
  price: "",
  availablePerson: "",
  bedType: "",
  imageUrl: [],
  amenities: [],
};

export const propertyValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  city: Yup.string().required("City is required"),
  address: Yup.string().required("Address is required"),
  latitude: Yup.number().required("Latitude is required"),
  longitude: Yup.number().required("Longitude is required"),
  price: Yup.number().required("Price is required"),
  availablePerson: Yup.number().required("Available Persons are required"),
  bedType: Yup.string().required("Bed Type is required"),
  imageUrl: Yup.array()
    .of(Yup.string())
    .min(1, "At least one image is required"),
  amenities: Yup.array()
    .of(Yup.string())
    .min(1, "At least one amenity is required"),
});
