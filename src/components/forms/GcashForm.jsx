// src/components/GcashForm.js

import {
  FormControl,
  FormLabel,
  Input,
 
  FormErrorMessage,
} from "@chakra-ui/react";
import { Field, ErrorMessage } from "formik";

export default function GcashForm() {
  return (
    <>
     
      <FormControl isRequired>
        <FormLabel>GCash Number</FormLabel>
        <Field
          as={Input}
          name="gcashNumber"
          placeholder="Enter your GCash number"
        />
        <ErrorMessage name="gcashNumber" component={FormErrorMessage} />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>GCash Account Name</FormLabel>
        <Field
          as={Input}
          name="gcashAccountName"
          placeholder="Enter your GCash account name"
        />
        <ErrorMessage name="gcashAccountName" component={FormErrorMessage} />
      </FormControl>
    </>
  );
}
