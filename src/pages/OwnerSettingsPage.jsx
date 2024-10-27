import {
  VStack,
  Button,
  Heading,
  Icon,
  useColorModeValue,
  Divider,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaUserEdit, FaEnvelope, FaLock, FaDollarSign } from "react-icons/fa";
import EditDetailsForm from "../components/forms/EditDetailsForm";
import ChangeEmailForm from "../components/forms/ChangeEmailForm";
import ChangePasswordForm from "../components/forms/ChangePasswordForm";
import ChangeSubscriptionForm from "../components/forms/ChangeSubscriptionForm";

export default function OwnerSettingsPage() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");
  const [activeForm, setActiveForm] = useState("editDetails");

  const primaryColor = "#F4F4F4";
  const secondaryColor = "#0084FF";

  const renderForm = () => {
    switch (activeForm) {
      case "editDetails":
        return <EditDetailsForm />;
      case "changeEmail":
        return <ChangeEmailForm />;
      case "changePassword":
        return <ChangePasswordForm />;
      case "changeSubscription":
        return <ChangeSubscriptionForm />;
      default:
        return <EditDetailsForm />;
    }
  };

  return (
    <Grid
      grid
      minH="100vh"
      templateColumns={{ md: "repeat(3, 1fr)" }}
      bgColor={bgColor}
      p={4}
    >
      {/* Left-side Menu */}
      <GridItem
        w="100%"
        maxW={300}
        borderRight="1px solid"
        borderColor="gray.300"
        p={4}
      >
        {" "}
        {/* Added larger bottom margin */}
        <Heading as="h1" size="md" textAlign="left" mb={5}>
          Account Settings
        </Heading>
        <Divider />
        <VStack align="left" spacing={4}>
          {" "}
          {/* Reduced spacing */}
          {/* Menu Items with Icons */}
          <Button
            variant="ghost"
            onClick={() => setActiveForm("editDetails")}
            leftIcon={<Icon as={FaUserEdit} />}
            isActive={activeForm === "editDetails"}
            justifyContent="flex-start"
            fontSize="md"
            fontWeight="medium"
            w="100%"
            _hover={{ bg: primaryColor, color: secondaryColor }}
            _active={{ bg: secondaryColor, color: "white" }}
          >
            Edit Personal Details
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveForm("changeEmail")}
            leftIcon={<Icon as={FaEnvelope} />}
            isActive={activeForm === "changeEmail"}
            justifyContent="flex-start"
            fontSize="md"
            fontWeight="medium"
            w="100%"
            _hover={{ bg: primaryColor, color: secondaryColor }}
            _active={{ bg: secondaryColor, color: "white" }}
          >
            Change Email
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveForm("changePassword")}
            leftIcon={<Icon as={FaLock} />}
            isActive={activeForm === "changePassword"}
            justifyContent="flex-start"
            fontSize="md"
            fontWeight="medium"
            w="100%"
            _hover={{ bg: primaryColor, color: secondaryColor }}
            _active={{ bg: secondaryColor, color: "white" }}
          >
            Change Password
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveForm("changeSubscription")}
            leftIcon={<Icon as={FaDollarSign} />}
            isActive={activeForm === "changeSubscription"}
            justifyContent="flex-start"
            fontSize="md"
            fontWeight="medium"
            w="100%"
            _hover={{ bg: primaryColor, color: secondaryColor }}
            _active={{ bg: secondaryColor, color: "white" }}
          >
            Change Subscription
          </Button>
        </VStack>
      </GridItem>

      {/* Main Content Area */}
      <GridItem minWidth={300} w="100%" p={4}>
        {/* Render Selected Form */}
        {renderForm()}
      </GridItem>
    </Grid>
  );
}
