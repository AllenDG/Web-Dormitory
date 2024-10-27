import { useState, useEffect } from "react";
import {
  Flex,
  useColorModeValue,
  Box,
  Text,
  useToast,
  Progress,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import { FaUser, FaCreditCard, FaCheckCircle } from "react-icons/fa";
import CreateOwnerForm from "../components/forms/CreateOwnerForm";
import PaymentMethodForm from "../components/forms/PaymentMethodForm";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function PostMyPropertyPage() {
  const [currentStep, setCurrentStep] = useState(1); // Track the current step
  const [isFormValid, setIsFormValid] = useState(false); // Track form validation
  const toast = useToast();
  const navigate = useNavigate(); // Initialize navigate function
  const bgColor = useColorModeValue("bg.light", "bg.dark");

  // Validate form (this function can be customized with actual form validation logic)
  const validateForm = (step) => {
    if (step === 1) {
      // Custom validation for CreateOwnerForm
      const formIsValid = true; // Replace with actual validation logic
      setIsFormValid(formIsValid);
    }
  };

  useEffect(() => {
    validateForm(currentStep); // Validate the form whenever step changes
  }, [currentStep]);

  // Function to handle next step
  const handleNextStep = () => {
    if (!isFormValid) {
      toast({
        title: "Form Incomplete",
        description: "Please complete the form before proceeding.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (currentStep === 2) {
      // If it's the last step, navigate to OwnerLayout
      navigate("/owner"); // Change to your route for OwnerLayout
      return;
    }
    setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev)); // Limit to 3 steps
  };

  // Render component based on the current step
  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <CreateOwnerForm validateForm={validateForm} handleNextStep={handleNextStep}/>;
      case 2:
        return <PaymentMethodForm  handleNextStep={handleNextStep} />;
      case 3:
        return (
          <Text fontSize="2xl" color="green.400">
            You&apos;re All Set! 🎉
          </Text>
        );
      default:
        return <CreateOwnerForm validateForm={validateForm} />;
    }
  };

  // Render step indicator
  const renderStepIndicator = () => {
    return (
      <SimpleGrid columns={3} spacing={4} mb={6} alignItems="center">
        <Flex direction="column" align="center">
          <Icon
            as={FaUser}
            w={8}
            h={8}
            color={currentStep >= 1 ? "blue.500" : "gray.300"}
          />
          <Text
            mt={2}
            fontSize="md"
            color={currentStep >= 1 ? "blue.500" : "gray.300"}
          >
            Create Account
          </Text>
        </Flex>
        <Flex direction="column" align="center">
          <Icon
            as={FaCreditCard}
            w={8}
            h={8}
            color={currentStep >= 2 ? "blue.500" : "gray.300"}
          />
          <Text
            mt={2}
            fontSize="md"
            color={currentStep >= 2 ? "blue.500" : "gray.300"}
          >
            Payment Method
          </Text>
        </Flex>
        <Flex direction="column" align="center">
          <Icon
            as={FaCheckCircle}
            w={8}
            h={8}
            color={currentStep === 3 ? "blue.500" : "gray.300"}
          />
          <Text
            mt={2}
            fontSize="md"
            color={currentStep === 3 ? "blue.500" : "gray.300"}
          >
            Start
          </Text>
        </Flex>
      </SimpleGrid>
    );
  };

  return (
    <Flex
      direction="column"
      minH="100vh"
      justify="center"
      align="center"
      bg={bgColor}
      
      p={8}
    >
      <Box
        w="100%"
        maxW="800px"
        borderWidth={1}
        bg={bgColor}
        boxShadow="lg"
        borderRadius="lg"
        p={8}
      >
        {/* Step Progress Indicator */}
        {renderStepIndicator()}

        {/* Render the form component based on the current step */}
        {renderStepComponent()}

        {/* Progress Bar */}
        <Progress
          value={(currentStep / 3) * 100}
          colorScheme="blue"
          size="sm"
          mt={6}
        />
       
      </Box>
    </Flex>
  );
}
