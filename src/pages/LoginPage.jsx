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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [showPinInput, setShowPinInput] = useState(false);
  const toast = useToast();
  const bgColor = useColorModeValue("#F4F4F4", "#1A202C");
  const secondaryColor = "#0084FF";

  const handleLogin = () => {
    if (email && password) {
      setShowPinInput(true);
      toast({
        title: "Login Successful",
        description: "Enter the verification code.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter both email and password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePinSubmit = () => {
    toast({
      title: "Verification Successful",
      description: "You have logged in successfully!",
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
        maxW="500px" // Increased card width to match RegisterPage
        bg="white"
        boxShadow="md"
        borderRadius="lg"
        p={8}
        border="1px"
        borderColor={secondaryColor}
      >
        <Heading textAlign="center" fontSize="2xl" mb={4}>
          Dormitory
        </Heading>
        <Text textAlign="center" fontSize="lg" color="gray.500" mb={6}>
          Login to continue
        </Text>

        <Input
          placeholder="Enter Your Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          mb={4}
          borderColor={secondaryColor}
          _placeholder={{ color: "gray.400" }}
          size="lg"
        />

        <Input
          placeholder="Enter Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mb={4}
          borderColor={secondaryColor}
          _placeholder={{ color: "gray.400" }}
          size="lg"
        />

        <Button
          onClick={handleLogin}
          colorScheme="blue"
          width="full"
          mb={4}
          size="lg"
          borderRadius="md"
        >
          Login
        </Button>

        {showPinInput && (
          <>
            <Input
              placeholder="Enter Verification Code"
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              mb={4}
              borderColor={secondaryColor}
              _placeholder={{ color: "gray.400" }}
              size="lg"
            />
            <Button
              onClick={handlePinSubmit}
              colorScheme="blue"
              width="full"
              size="lg"
              borderRadius="md"
            >
              Verify Code
            </Button>
          </>
        )}

        <Flex justify="space-between" mt={4}>
          <Link color={secondaryColor} fontSize="sm">
            Forgot Password?
          </Link>
          <Link
            as={RouterLink}
            to="/register"
            color={secondaryColor}
            fontSize="sm"
          >
            Sign Up
          </Link>
        </Flex>
      </Box>
    </Flex>
  );
}
