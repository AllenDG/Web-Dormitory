// src/components/GcashForm.js

import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Flex,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Field, ErrorMessage } from "formik";

// List of country codes (you can add more as needed)
const countries = [
  { name: "Philippines", code: "+639" },
  { name: "USA", code: "+1" },
  { name: "Canada", code: "+1" },
  { name: "UK", code: "+44" },
  { name: "Australia", code: "+61" },
];

export default function GcashForm() {
  return (
    <>
      <Flex>
        {/* Dropdown for phone code */}
        <FormControl isRequired flex="0.4" mr={2}>
          <FormLabel>Phone Code</FormLabel>
          <Field as={Select} name="phoneCode">
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.code}
              </option>
            ))}
          </Field>
          <ErrorMessage name="phoneCode" component={FormErrorMessage} />
        </FormControl>

        {/* GCash number field */}
        <FormControl isRequired flex="0.6">
          <FormLabel>Number</FormLabel>
          <Field
            as={Input}
            name="gcashNumber"
            placeholder="Enter your number"
          />
          <ErrorMessage name="gcashNumber" component={FormErrorMessage} />
        </FormControl>
      </Flex>

      {/* GCash account name field */}
      <FormControl isRequired mt={4}>
        <FormLabel>Account Name</FormLabel>
        <Field as={Input} name="gcashAccountName" placeholder="Enter name" />
        <ErrorMessage name="gcashAccountName" component={FormErrorMessage} />
      </FormControl>
    </>
  );
}
