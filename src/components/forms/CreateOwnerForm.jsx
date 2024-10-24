import { Formik, Field, Form } from "formik";
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  FormErrorMessage,
} from "@chakra-ui/react";
import governmentIdTypes from "../../data/governmentId.json"; // Adjust the path as needed
import { registerOwnerValidationSchema } from "../../utils/validationSchema";

export default function CustomForm({ handleNextStep}) {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    birthdate: "",
    address: "",
    governmentIdType: "",
    governmentIdImage: null,
    profileImage: null,
  };

  const handleSubmit = (values) => {
    console.log("Form Submitted:", values);
    handleNextStep();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerOwnerValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, setFieldValue }) => (
        <Form>
          <Flex
            direction="column"
            width="100%"
            maxWidth="600px"
            margin="auto"
            spacing={4}
          >
            <FormControl
              isInvalid={errors.firstName && touched.firstName}
              mb={4}
              isRequired
            >
              <FormLabel>First Name</FormLabel>
              <Field name="firstName" as={Input} placeholder="First name" />
              <FormErrorMessage>{errors.firstName}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.lastName && touched.lastName}
              mb={4}
              isRequired
            >
              <FormLabel>Last Name</FormLabel>
              <Field name="lastName" as={Input} placeholder="Last name" />
              <FormErrorMessage>{errors.lastName}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.email && touched.email}
              mb={4}
              isRequired
            >
              <FormLabel>Email</FormLabel>
              <Field name="email" as={Input} placeholder="Email" />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.gender && touched.gender}
              mb={4}
              isRequired
            >
              <FormLabel>Gender</FormLabel>
              <Field as={Select} name="gender" placeholder="Select gender">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Field>
              <FormErrorMessage>{errors.gender}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.birthdate && touched.birthdate}
              mb={4}
              isRequired
            >
              <FormLabel>Birthdate</FormLabel>
              <Field name="birthdate" type="date" as={Input} />
              <FormErrorMessage>{errors.birthdate}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.address && touched.address}
              mb={4}
              isRequired
            >
              <FormLabel>Address</FormLabel>
              <Field name="address" as={Input} placeholder="Address" />
              <FormErrorMessage>{errors.address}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.governmentIdType && touched.governmentIdType}
              mb={4}
              isRequired
            >
              <FormLabel>Government ID Type</FormLabel>
              <Field
                as={Select}
                name="governmentIdType"
                placeholder="Select government ID type"
              >
                {governmentIdTypes.map((id) => (
                  <option key={id.value} value={id.value}>
                    {id.label}
                  </option>
                ))}
              </Field>
              <FormErrorMessage>{errors.governmentIdType}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.governmentIdImage && touched.governmentIdImage}
              mb={4}
              isRequired
            >
              <FormLabel>Upload Government ID Image</FormLabel>
              <Input
                name="governmentIdImage"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFieldValue("governmentIdImage", e.currentTarget.files[0])
                }
              />
              <FormErrorMessage>{errors.governmentIdImage}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.profileImage && touched.profileImage}
              mb={4}
              isRequired
            >
              <FormLabel>Upload Profile Verification Image</FormLabel>
              <Input
                name="profileImage"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFieldValue("profileImage", e.currentTarget.files[0])
                }
              />
              <FormErrorMessage>{errors.profileImage}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              bg="#0084FF"
              color="white"
              size="lg"
              _hover={{ bg: "#005FCC" }}
            >
              Submit
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
}
