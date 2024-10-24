import { useState } from "react";
import {
  Flex,
  Button,
  IconButton,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { ownerSidebarRoutes } from "../../routes/ownerSidebarRoutes";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation(); // Get the current location
  const bgColor = useColorModeValue("gray.50", "gray.800"); // Light/Dark mode support
  const textColor = useColorModeValue("gray.700", "white");

  const handleLogout = () => {
    console.log("Logged out");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Flex minH="100vh" bg={bgColor} color={textColor}>
      {/* Sidebar container */}
      <Flex
        direction="column"
        justifyContent="space-between"
        bg="#fff"
        p={4}
        width={isCollapsed ? "80px" : "220px"} // Slightly reduced width for a minimalist feel
        transition="width 0.3s ease-in-out"
        overflow="hidden"
        borderRight="1px solid"
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        {/* Sidebar header with collapse button */}
        <Flex align="center">
          <IconButton
            aria-label="Toggle Sidebar"
            icon={isCollapsed ? <FiMenu /> : <FiX />}
            onClick={toggleSidebar}
            bg="blue.500"
            color="white"
            _hover={{ bg: "blue.400" }}
            size="sm"
          />
          {!isCollapsed && (
            <Text
              ml={3} // Margin for spacing between logo and button
              color="blue.500"
              fontSize="lg"
              fontWeight="bold"
            >
              Dormitory
            </Text>
          )}
        </Flex>

        {/* Sidebar links */}
        <VStack as="nav" spacing={1} align="stretch">
          {ownerSidebarRoutes.map((item) => {
            const isActive = location.pathname === item.path;
            const activeStyles = {
              bg: "blue.100",
              color: "blue.500",
              borderLeft: "4px solid blue.500",
            };

            return (
              <Link key={item.label} to={item.path}>
                <Flex
                  alignItems="center"
                  p={3}
                  borderRadius="md"
                  transition="background-color 0.2s ease-in-out"
                  bg={isActive ? "blue.100" : "transparent"}
                  _hover={{
                    bg: "blue.50",
                    color: "blue.500",
                  }}
                  {...(isActive ? activeStyles : null)}
                >
                  <item.icon
                    size={20} // Slightly smaller icon for a minimalist look
                    color={isActive ? "blue.500" : textColor}
                  />
                  {!isCollapsed && (
                    <Text fontWeight="medium" ml={2}>
                      {item.label}
                    </Text>
                  )}
                </Flex>
              </Link>
            );
          })}
        </VStack>

        {/* Logout button */}
        <Button
          colorScheme="red"
          onClick={handleLogout}
          mt={6}
          size="md"
          width="100%"
          leftIcon={<FiLogOut />}
        >
          {!isCollapsed && "Logout"}
        </Button>
      </Flex>
    </Flex>
  );
}
