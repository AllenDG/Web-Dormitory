// src/components/PaypalForm.js

import {
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Field, Form, ErrorMessage } from "formik";

const PaypalForm = ({ handleSubmit, isSubmitting }) => {
  return (
    <Form onSubmit={handleSubmit}>
      {/* PayPal Number Field */}
      <FormControl isRequired>
        <FormLabel>PayPal Number</FormLabel>
        <Field as={Input} name="paypalNumber" placeholder="PayPal Number" />
        <ErrorMessage name="paypalNumber" component={FormErrorMessage} />
      </FormControl>

      {/* PayPal Account Name Field */}
      <FormControl isRequired mt={4}>
        <FormLabel>PayPal Account Name</FormLabel>
        <Field as={Input} name="paypalAccountName" placeholder="Account Name" />
        <ErrorMessage name="paypalAccountName" component={FormErrorMessage} />
      </FormControl>

      {/* Submit Button */}
      <Button type="submit" colorScheme="blue" mt={4} isLoading={isSubmitting}>
        Submit
      </Button>
    </Form>
  );
};

export default PaypalForm;
