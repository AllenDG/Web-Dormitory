// validationSchema.js
import * as Yup from "yup";

export const paymentMethodValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  address: Yup.string().required("Address is required"),
  phoneNumber: Yup.string()
    .matches(/^639\d{10}$/, "Phone number must start with 639 and contain 13 digits")
    .required("Phone Number is required"),
  city: Yup.string().required("City is required"),
  zipCode: Yup.string().required("Zip Code is required"),
  country: Yup.string().required("Country is required"),
});
