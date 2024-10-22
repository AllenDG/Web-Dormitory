import { useState } from "react";
import { Flex, Button, Box, IconButton } from "@chakra-ui/react";
import { ownerSidebarRoutes } from "../../routes/ownerSidebarRoutes";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi"; // Icons for toggling

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logged out");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Flex>
      {/* Sidebar container */}
      <Flex
        direction="column"
        minH="100vh"
        justifyContent="space-between"
        bg="gray.800"
        color="white"
        p={4}
        width={isCollapsed ? "80px" : "250px"} // Toggle width
        transition="width 0.3s"
        overflow="hidden"
      >
        {/* Sidebar header with collapse button */}
        <Box mb={4}>
          <IconButton
            aria-label="Toggle Sidebar"
            icon={isCollapsed ? <FiMenu /> : <FiX />}
            onClick={toggleSidebar}
            mb={4}
            colorScheme="teal"
            size="sm"
          />
          {!isCollapsed && <h1>Dormitory</h1>}
        </Box>

        {/* Sidebar links */}
        <ul>
          {ownerSidebarRoutes.map((item) => (
            <Link key={item.label} to={item.path}>
              <Flex gap={2} mt={4} alignItems="center">
                <item.icon size={30} />
                {!isCollapsed && <h1>{item.label}</h1>}
              </Flex>
            </Link>
          ))}
        </ul>

        {/* Logout button */}
        <Button colorScheme="red" onClick={handleLogout} mt={4} width="100%">
          {!isCollapsed && "Logout"}
        </Button>
      </Flex>

    
    </Flex>
  );
}
