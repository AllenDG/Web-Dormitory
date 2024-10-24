import { FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";
import { Field } from "formik";

const BankTransfer = () => {
  return (
    <VStack spacing={4} mt={4}>
      <FormControl isRequired>
        <FormLabel>Bank Name</FormLabel>
        <Field as={Input} name="bankName" placeholder="Enter Bank Name" />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Account Number</FormLabel>
        <Field
          as={Input}
          name="accountNumber"
          placeholder="Enter Account Number"
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Account Name</FormLabel>
        <Field as={Input} name="accountName" placeholder="Enter Account Name" />
      </FormControl>
    </VStack>
  );
};

export default BankTransfer;
