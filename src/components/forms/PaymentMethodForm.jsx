// src/components/PaymentMethodForm.js

import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  VStack,
  FormErrorMessage,
} from "@chakra-ui/react";
import { paymentMethodValidationSchema } from "../../utils/validationSchema";
import BankTransfer from "./BankTransfer"; // Import the BankTransfer component
import GcashForm from "./GcashForm"; // Import the GcashForm component

const countries = [
  { name: "Philippines", code: "+63" },
  { name: "USA", code: "+1" },
  { name: "Canada", code: "+1" },
  { name: "UK", code: "+44" },
  { name: "Australia", code: "+61" },
];

const paymentMethods = ["Bank Transfer", "GCash", "PayPal"];

export default function PaymentMethodForm({ handlenextstep }) {
  const initialValues = {
    phoneCode: "+63",
    phoneNumber: "",
    city: "",
    zipCode: "",
    country: "",
    paymentMethod: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    gcashNumber: "", // GCash fields
    gcashAccountName: "",
  };

  const handleSubmit = (values) => {
    console.log("Form Submitted:", values);
    handlenextstep(); // Handle the next step if needed
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={paymentMethodValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <Form>
          <Flex
            direction={{ base: "column", md: "row" }}
            maxW="800px"
            margin="auto"
            p={4}
          >
            <Box flex="1" p={4}>
              <Text fontSize="xl" mb={4} fontWeight="bold">
                Payment Details
              </Text>
              <VStack spacing={4} align="stretch">
                <Flex>
                  <FormControl isRequired flex="0.4" mr={2}>
                    <FormLabel>Phone Code</FormLabel>
                    <Field
                      as={Select}
                      name="phoneCode"
                      placeholder="Select Code"
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name} ({country.code})
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="phoneCode"
                      component={FormErrorMessage}
                    />
                  </FormControl>

                  <FormControl isRequired flex="0.6">
                    <FormLabel>Phone Number</FormLabel>
                    <Field
                      as={Input}
                      name="phoneNumber"
                      placeholder="Phone Number"
                    />
                    <ErrorMessage
                      name="phoneNumber"
                      component={FormErrorMessage}
                    />
                  </FormControl>
                </Flex>

                <Flex>
                  <FormControl isRequired flex="1" mr={2}>
                    <FormLabel>City</FormLabel>
                    <Field as={Input} name="city" placeholder="City" />
                    <ErrorMessage name="city" component={FormErrorMessage} />
                  </FormControl>

                  <FormControl isRequired flex="1">
                    <FormLabel>Zip Code</FormLabel>
                    <Field as={Input} name="zipCode" placeholder="Zip Code" />
                    <ErrorMessage name="zipCode" component={FormErrorMessage} />
                  </FormControl>
                </Flex>

                <FormControl isRequired>
                  <FormLabel>Country</FormLabel>
                  <Field
                    as={Select}
                    name="country"
                    placeholder="Select Country"
                  >
                    {countries.map((country) => (
                      <option key={country.name} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="country" component={FormErrorMessage} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Payment Method</FormLabel>
                  <Field
                    as={Select}
                    name="paymentMethod"
                    placeholder="Select Payment Method"
                  >
                    {paymentMethods.map((method,index) => (
                      <option key={index} value={method}>
                        {method}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="paymentMethod"
                    component={FormErrorMessage}
                  />
                </FormControl>

                {/* Conditional rendering of forms based on payment method */}
                {values.paymentMethod === "Bank Transfer" && <BankTransfer />}
                {values.paymentMethod === "GCash" && <GcashForm />}

                <Text fontSize="lg" mt={4}>
                  Registration Fee: <strong>₱50</strong>
                </Text>
                <Button type="submit" colorScheme="blue" mt={4}>
                  Confirm Payment
                </Button>
              </VStack>
            </Box>

            <Box
              flex="1"
              p={4}
              borderLeftWidth={{ base: 0, md: 1 }}
              borderColor="gray.200"
            >
              <Text fontSize="xl" mb={4} fontWeight="bold">
                Order Summary
              </Text>
              <Box p={4} bg="gray.50" borderRadius="md">
                <Text>
                  <strong>Item:</strong> Your Product Name
                </Text>
                <Text>
                  <strong>Price:</strong> ₱50
                </Text>
                <Text>
                  <strong>Total:</strong> ₱50
                </Text>
              </Box>
            </Box>
          </Flex>
        </Form>
      )}
    </Formik>
  );
}
