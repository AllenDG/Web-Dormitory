import { useState } from "react";
import {
  Flex,
  Box,
  Heading,
  Text,
  Input,
  Button,
  useToast,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom"; // Ensure you're using react-router for navigation

export default function RegisterPage() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useToast();
  const bgColor = useColorModeValue("#F4F4F4", "#1A202C"); // Light and Dark mode background
  const secondaryColor = "#0084FF"; // Your secondary color

  const handleRegister = () => {
    // Basic validation
    if (
      !lastName ||
      !firstName ||
      !ownerName ||
      !birthday ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      toast({
        title: "Registration Failed",
        description: "Please fill out all fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Registration Failed",
        description: "Passwords do not match.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Handle registration logic here (e.g., API call)
    toast({
      title: "Registration Successful",
      description: "You have registered successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
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
        maxW="500px" // Increased maximum width
        bg="white"
        boxShadow="md"
        borderRadius="lg"
        p={10} // Increased padding
        border="1px"
        borderColor={secondaryColor}
      >
        <Heading textAlign="center" fontSize="2xl" mb={4}>
          Register
        </Heading>
        <Text textAlign="center" fontSize="lg" color="gray.500" mb={6}>
          Create your account
        </Text>

        <Input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          mb={4}
          borderColor={secondaryColor}
          _placeholder={{ color: "gray.400" }}
          size="lg"
        />

        <Input
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          mb={4}
          borderColor={secondaryColor}
          _placeholder={{ color: "gray.400" }}
          size="lg"
        />

        <Input
          placeholder="Owner Name/Nickname"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          mb={4}
          borderColor={secondaryColor}
          _placeholder={{ color: "gray.400" }}
          size="lg"
        />

        <Input
          placeholder="Birthday (YYYY-MM-DD)"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          mb={4}
          borderColor={secondaryColor}
          _placeholder={{ color: "gray.400" }}
          size="lg"
          type="date"
        />

        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          mb={4}
          borderColor={secondaryColor}
          _placeholder={{ color: "gray.400" }}
          size="lg"
        />

        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mb={4}
          borderColor={secondaryColor}
          _placeholder={{ color: "gray.400" }}
          size="lg"
        />

        <Input
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          mb={4}
          borderColor={secondaryColor}
          _placeholder={{ color: "gray.400" }}
          size="lg"
        />

        <Button
          onClick={handleRegister}
          colorScheme="blue"
          width="full"
          mb={4}
          size="lg"
          borderRadius="md"
        >
          Register
        </Button>

        <Text textAlign="center" fontSize="sm" color="gray.500">
          Already have an account?{" "}
          <Link as={RouterLink} to="/login" color={secondaryColor}>
            Login
          </Link>
        </Text>
      </Box>
    </Flex>
  );
}
