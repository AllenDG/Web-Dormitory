import { Flex } from "@chakra-ui/react";
import { ownerSidebarRoutes } from "../../routes/ownerSidebarRoutes";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div>
      <Flex>
        <h1>Dormitory</h1>
      </Flex>
      <ul>
        {ownerSidebarRoutes.map((item) => (
          <Link key={item.label} to={item.path}>
            <Flex gap={2}>
              <item.icon size={30} />
              <h1>{item.label}</h1>
            </Flex>
          </Link>
        ))}
      </ul>
    </div>
  );
}
