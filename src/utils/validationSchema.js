// utils/validationSchema.js
import * as Yup from "yup";

const phoneNumberRegex = /^639\d{9}$/;

// Helper function to calculate age
const calculateAge = (birthdate) => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export const registerOwnerValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  gender: Yup.string().required("Gender is required"),
  birthdate: Yup.date()
    .required("Birthdate is required")
    .test("age", "You must be between 18 and 27 years old", (value) => {
      const age = calculateAge(value);
      return age >= 18 && age <= 27;
    }),
  address: Yup.string().required("Address is required"),
  governmentIdType: Yup.string().required("Government ID type is required"),
  governmentIdImage: Yup.mixed().required("Government ID image is required"),
  profileImage: Yup.mixed().required("Profile verification image is required"),
});

export const paymentMethodValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  address: Yup.string().required("Address is required"),
  phoneNumber: Yup.string()
    .matches(
      /^639\d{10}$/,
      "Phone number must start with 639 and contain 13 digits"
    )
    .required("Phone Number is required"),
  city: Yup.string().required("City is required"),
  zipCode: Yup.string().required("Zip Code is required"),
  country: Yup.string().required("Country is required"),
});

export const gcashValidationSchema = Yup.object({
  gcashNumber: Yup.string()
    .matches(
      phoneNumberRegex,
      "GCash number must start with 639 and contain 11 digits"
    )
    .required("GCash number is required"),
  gcashAccountName: Yup.string().required("GCash account name is required"),
});

export const paypalValidationSchema = Yup.object({
  paypalNumber: Yup.string()
    .required("PayPal number is required")
    .min(10, "PayPal number should be at least 10 characters long"),
  paypalAccountName: Yup.string()
    .required("PayPal account name is required")
    .min(3, "Account name should be at least 3 characters long"),
});
