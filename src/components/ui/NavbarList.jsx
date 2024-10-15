import { Link, useLocation } from "react-router-dom";
import { navbarRoutes } from "../../routes/navbarRoutes";
import { Text } from "@chakra-ui/react";

export default function NavbarList() {
  const location = useLocation();

  return (
    <>
      {navbarRoutes.map((route) => (
        <Link key={route.path} to={route.path}>
          <Text
            color={
              location.pathname === route.path ? "primary.500" : "secondary.500"
            }
          >
            {route.label}
          </Text>
        </Link>
      ))}
    </>
  );
}
