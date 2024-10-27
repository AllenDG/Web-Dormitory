import { useState } from "react";
import {
  Flex,
  Button,
  IconButton,
  Text,
  useColorModeValue,
  VStack,
  Box,
  LightMode,
} from "@chakra-ui/react";
import { ownerSidebarRoutes } from "../../routes/ownerSidebarRoutes";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation(); // Get the current location
  const bgColor = useColorModeValue("bg.light", "bg.dark");
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
        p={4}
        width={isCollapsed ? "80px" : "220px"}
        transition="width 0.3s ease-in-out"
        overflow="hidden"
        borderRight="1px solid"
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Box>
          <Flex
            align="center"
            justifyContent={{ base: "center", sm: "start" }}
            mb={2}
          >
            <LightMode>
              <IconButton
                aria-label="Toggle Sidebar"
                icon={isCollapsed ? <FiMenu /> : <FiX />}
                onClick={toggleSidebar}
                colorScheme="primary"
                color="white"
                _hover={{ bg: "blue.400" }}
                size="sm"
              />
            </LightMode>
            {!isCollapsed && (
              <Text ml={3} color="primary.500" fontSize="lg" fontWeight="bold">
                Dormitory
              </Text>
            )}
          </Flex>

          <VStack as="nav" spacing={1} align="stretch">
            {ownerSidebarRoutes.map((item) => {
              const isActive = location.pathname === item.path;
              const activeStyles = {
                bg: "blue.500",
                color: "bg.light",
                borderLeft: "4px solid primary.500",
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
                      bg: "blue.500",
                      color: "bg.light",
                    }}
                    {...(isActive ? activeStyles : null)}
                  >
                    <item.icon
                      size={20}
                      color={isActive ? "primary.500" : textColor}
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
        </Box>

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
