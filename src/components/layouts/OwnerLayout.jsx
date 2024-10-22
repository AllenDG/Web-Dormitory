import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Sidebar from "../ui/Sidebar";

export default function OwnerLayout() {
  return (
    <Flex>
      <Sidebar />
      <Box w="100%">
        <Outlet />
      </Box>
    </Flex>
  );
}
