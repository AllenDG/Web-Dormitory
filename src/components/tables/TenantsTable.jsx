import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Button,
  Select,
  LightMode,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";

export default function TenantsTable({
  currentTenants,
  handleStatusChange,
  bgColor,
}) {
  return (
    <TableContainer>
      <Table variant="striped" bg={bgColor} borderRadius="md" boxShadow="md">
        <Thead>
          <Tr>
            <Th>Profile</Th>
            <Th>Last Name</Th>
            <Th>First Name</Th>
            <Th>Age</Th>
            <Th>Gender</Th>
            <Th>Hobbies (Amenities)</Th>
            <Th>Message</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentTenants.map((tenant, index) => (
            <Tr key={index}>
              {/* Profile Picture */}
              <Td>
                <Avatar size="sm" src={tenant.profilePic} />
              </Td>
              <Td>{tenant.lastName}</Td>
              <Td>{tenant.firstName}</Td>
              <Td>{tenant.age}</Td>
              <Td>{tenant.gender}</Td>
              <Td>{tenant.hobbies.join(", ")}</Td>
              <Td>
                <LightMode>
                  <Button
                    leftIcon={<ChatIcon />}
                    colorScheme="primary"
                    onClick={() => alert(`Chatting with ${tenant.firstName}`)}
                    size="sm"
                  >
                    Chat
                  </Button>
                </LightMode>
              </Td>
              <Td>
                <Select
                  value={tenant.status}
                  onChange={(e) => handleStatusChange(index, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </Select>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
