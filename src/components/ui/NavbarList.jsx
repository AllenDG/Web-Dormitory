import { Link, useLocation } from "react-router-dom";
import { navbarRoutes } from "../../routes/navbarRoutes";
import { Text, Box } from "@chakra-ui/react";

export default function NavbarList() {
  const location = useLocation();

  return (
    <>
      {navbarRoutes.map((route) => (
        <Link key={route.path} to={route.path}>
          <Box
            position="relative"
            display="inline-block" // Ensure the box takes only necessary space
            mx={2} // Margin for spacing between items
            _hover={{
              color: "primary.500", // Change color on hover
              _after: {
                transform: "scaleX(1)", // Show the line on hover
                transformOrigin: "bottom left",
              },
            }}
            _after={{
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "2px", // Thickness of the line
              bg: "primary.500", // Color of the line
              transform: "scaleX(0)", // Start hidden
              transition: "transform 0.3s ease-in-out",
              transformOrigin: "bottom right",
            }}
          >
            <Text
              color={
                location.pathname === route.path
                  ? "primary.500"
                  : "secondary.500"
              }
              fontWeight={location.pathname === route.path ? "bold" : "normal"} // Make active text bold
              textDecoration={
                location.pathname === route.path ? "underline" : "none"
              } // Underline active link
            >
              {route.label}
            </Text>
          </Box>
        </Link>
      ))}
    </>
  );
}
