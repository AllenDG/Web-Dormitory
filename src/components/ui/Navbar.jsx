import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  useColorModeValue,
  useDisclosure,
  
} from "@chakra-ui/react";
import ThemeController from "./ThemeController";
import NavbarList from "./NavbarList";
import { Link } from "react-router-dom";
import { useRef } from "react";

export default function Navbar() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  return (
    <>
      <Flex
        p="15px 30px" // More padding for a spacious look
        justify="space-between"
        align="center"
        bg={bgColor}
        borderBottomWidth={1}
        borderColor={bgColor === "bg.light" ? "gray.200" : "gray.700"}
       
        sx={{
          position: "sticky",
          top: "0",
          zIndex: 50,
        }}
      >
        <Link to="/">
          <Heading as="h4" size="lg" color="#0084FF" fontWeight="bold">
            Dormitory
          </Heading>
        </Link>

        <Flex align="center" paddingLeft={20} gap="20px" display={{ base: "none", md: "flex" }}>
          <NavbarList />
        </Flex>

        <Flex align="center" gap="15px">
          <ThemeController />
          <Button
            colorScheme="blue"
            as={Link}
            to="/login"
            variant="solid"
            borderRadius="30px"
            _hover={{ bg: "#005BB5" }} // Darker blue on hover
            _focus={{ boxShadow: "outline" }}
          >
            Login
          </Button>
          <Button
            colorScheme="teal"
            as={Link}
            to="/register"
            variant="solid"
            borderRadius="30px"
            _hover={{ bg: "#006B5F" }} // Darker green on hover
            _focus={{ boxShadow: "outline" }}
          >
            Register
          </Button>
          <Button
            display={{ base: "block", md: "none" }}
            ref={btnRef}
            colorScheme="teal"
            borderRadius="30px"
            onClick={onOpen}
            _hover={{ bg: "#006B5F" }} // Darker green on hover
          >
            Open
          </Button>
        </Flex>
      </Flex>

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay display={{ base: "block", md: "none" }} />
        <DrawerContent display={{ base: "block", md: "none" }} bg="#F4F4F4">
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <NavbarList />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
