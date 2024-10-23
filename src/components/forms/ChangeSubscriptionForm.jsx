import { useState } from "react"; // Import React
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Text,
  Stack,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { TriangleDownIcon } from "@chakra-ui/icons"; // Import the triangle icon

const SubscriptionCard = ({ title, features, isSelected, onSelect }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={4}
      bg={isSelected ? "blue.50" : "#fff"} // Change background color if selected
      borderColor={isSelected ? "blue.500" : "gray.300"} // Change border color if selected
      boxShadow={isSelected ? "lg" : "md"} // Change shadow effect if selected
      w="full"
      h="300px" // Set a fixed height for the cards
      transition="0.2s"
      _hover={{ boxShadow: "lg", cursor: "pointer", transform: "scale(1.02)" }} // Add scale effect on hover
      onClick={onSelect}
    >
      <VStack spacing={2} align="start">
        <Checkbox isChecked={isSelected} onChange={onSelect}>
          <Text fontWeight="bold" fontSize="lg">
            {title}
          </Text>
        </Checkbox>
        {features.map((feature, index) => (
          <Text
            key={index}
            fontSize="sm"
            mb={2}
            display="flex"
            alignItems="center"
          >
            <TriangleDownIcon color="blue.500" boxSize={4} mr={2} />{" "}
            {/* Triangle icon */}
            {feature}
          </Text>
        ))}
      </VStack>
    </Box>
  );
};

export default function ChangeSubscriptionForm() {
  const [selectedPlan, setSelectedPlan] = useState(null); // Initialize state

  const standardFeatures = [
    "Permanent account",
    "Basic analytics",
    "Boost content (2 weeks)",
    "Expire 1 month",
  ];

  const premiumFeatures = [
    "Permanent account",
    "Advanced analytics",
    "Boost content (1 month)",
    "Chatbot support",
    "Email notification",
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  // Use responsive breakpoints to adjust layout
  const direction = useBreakpointValue({ base: "column", md: "row" });

  return (
    <Box maxW="600px" p={6} mt={8}>
      <FormControl>
        <FormLabel>Select Your Subscription Plan</FormLabel>
      </FormControl>
      <Stack spacing={4} mt={4} direction={direction}>
        {/* Standard Plan Card */}
        <SubscriptionCard
          title="Standard"
          features={standardFeatures}
          isSelected={selectedPlan === "standard"}
          onSelect={() => handleSelectPlan("standard")}
        />

        {/* Premium Plan Card */}
        <SubscriptionCard
          title="Premium"
          features={premiumFeatures}
          isSelected={selectedPlan === "premium"}
          onSelect={() => handleSelectPlan("premium")}
        />
      </Stack>

      {/* Save Changes Button */}
      <Button
        mt={10}
        colorScheme="blue"
        w="20%"
        isDisabled={!selectedPlan} // Disable button if no plan is selected
      >
        Save Changes
      </Button>
    </Box>
  );
}
