import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

// Define Yup validation schema
const validationSchema = Yup.object().shape({
  bankName: Yup.string().required("Bank Name is required"),
  accountNumber: Yup.string()
    .required("Account Number is required")
    .matches(/^\d+$/, "Account Number must be numeric"),
  accountName: Yup.string().required("Account Name is required"),
});

const BankTransfer = () => {
  const handleSubmit = (values) => {
    console.log("Form Submitted:", values);
    // Handle form submission logic here
  };

  return (
    <Formik
      initialValues={{
        bankName: "",
        accountNumber: "",
        accountName: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <VStack spacing={4} mt={4}>
            <FormControl
              isRequired
              isInvalid={touched.bankName && errors.bankName}
            >
              <FormLabel>Bank Name</FormLabel>
              <Field as={Input} name="bankName" placeholder="Enter Bank Name" />
              <FormErrorMessage>{errors.bankName}</FormErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={touched.accountNumber && errors.accountNumber}
            >
              <FormLabel>Account Number</FormLabel>
              <Field
                as={Input}
                name="accountNumber"
                placeholder="Enter Account Number"
              />
              <FormErrorMessage>{errors.accountNumber}</FormErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={touched.accountName && errors.accountName}
            >
              <FormLabel>Account Name</FormLabel>
              <Field
                as={Input}
                name="accountName"
                placeholder="Enter Account Name"
              />
              <FormErrorMessage>{errors.accountName}</FormErrorMessage>
            </FormControl>
            <Button type="submit" colorScheme="blue">
              Submit
            </Button>
          </VStack>
        </Form>
      )}
    </Formik>
  );
};

export default BankTransfer;
