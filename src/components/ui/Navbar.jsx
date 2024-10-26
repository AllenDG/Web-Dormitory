import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, Heading, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import ThemeController from "./ThemeController";
import NavbarList from "./NavbarList";
import { Link } from "react-router-dom";
import { useRef } from "react";

export default function Navbar() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  return (
   <>
    <Flex
      p="10px"
      justify="space-between"
      align="center"
      bg={bgColor}
      borderBottomWidth={1}
      sx={{
        position: "sticky",
        top: "0",
        zIndex: 50,
      }}
    >
      <aside>
        <Link to="/">
          <Heading as="h4" size="md" color="primary.500">
            Dormitory
          </Heading>
        </Link>
      </aside>
      <Flex align="center" gap="10px">
        <Flex display={{ base: "none", md: "flex" }} gap="10px" align="center">
          <NavbarList />
        </Flex>
        <ThemeController />
         <Button display={{ base: "block", md: "none" }} ref={btnRef} colorScheme='teal' onClick={onOpen}>
        Open
      </Button>
      </Flex>
    </Flex>

    <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}  
      
      >
        <DrawerOverlay  display={{ base: "block", md: "none" }}/>
        <DrawerContent  display={{ base: "block", md: "none" }}>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
          <NavbarList />
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
   </>
  );
}
