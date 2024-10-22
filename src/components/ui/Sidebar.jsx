import { useState } from "react";
import { Flex, Button, Box, IconButton } from "@chakra-ui/react";
import { ownerSidebarRoutes } from "../../routes/ownerSidebarRoutes";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi"; // Icons for toggling and logout

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation(); // Get the current location

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
        bg="#f4f4f4" // Updated background color
        color="black" // Updated text color for contrast
        p={4}
        width={isCollapsed ? "80px" : "250px"} // Toggle width
        transition="width 0.3s"
        overflow="hidden"
        borderRight="1px solid #000" // Added border line
      >
        {/* Sidebar header with collapse button */}
        <Box mb={2}>
          <IconButton
            aria-label="Toggle Sidebar"
            icon={isCollapsed ? <FiMenu /> : <FiX />}
            onClick={toggleSidebar}
            mb={2} // Adjusted margin bottom
            bg="#0084FF" // Set background color of the button
            color="white" // Set icon color to white for contrast
            _hover={{ bg: "#0071cc" }} // Darker shade on hover
            size="sm"
          />
          {!isCollapsed && (
            <h1
              style={{ color: "#0084FF", fontSize: "20px", fontWeight: "bold" }}
            >
              Dormitory
            </h1>
          )}
        </Box>

        {/* Sidebar links */}
        <ul style={{ padding: 0 }}>
          {" "}
          {/* Remove default padding */}
          {ownerSidebarRoutes.map((item) => {
            const isActive = location.pathname === item.path; // Check if the route is active
            const textColor = isActive ? "#0084FF" : "black"; // Set text color based on active state
            const iconColor = isActive ? "#0084FF" : "black"; // Set icon color based on active state

            return (
              <Link key={item.label} to={item.path}>
                <Flex
                  gap={3}
                  mt={1} // Reduced margin top to bring links closer to the logo
                  alignItems="center"
                  p={2} // Padding for hover effect
                  borderRadius="md" // Rounded corners for the hover effect
                  _hover={{
                    bg: "#cfe8ff", // Light blue background on hover
                    color: "#0084FF", // Change text color on hover
                  }} // Hover effect
                  style={{
                    textDecoration: "none", // Remove underline from text
                    color: textColor,
                  }}
                >
                  <item.icon size={30} color={iconColor} />{" "}
                  {/* Set icon color based on active state */}
                  {!isCollapsed && (
                    <h1
                      style={{ textDecoration: "none", fontWeight: "normal" }}
                    >
                      {item.label}
                    </h1>
                  )}
                </Flex>
              </Link>
            );
          })}
        </ul>

        {/* Logout button */}
        <Button
          colorScheme="red"
          onClick={handleLogout}
          mt={4}
          width="100%"
          leftIcon={isCollapsed ? <FiLogOut /> : null} // Add icon when collapsed
        >
          {!isCollapsed && "Logout"}
        </Button>
      </Flex>
    </Flex>
  );
}
