import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import RentalEditForm from "../forms/RentalEditForm";

export default function RentalsTable({
  currentRentals,
  handleSave,
  bgColor,
}) {
  return (
    <TableContainer>
      <Table
        variant="striped"
        bg={bgColor}
        borderRadius="md"
        boxShadow="md"
      >
        <Thead>
          <Tr>
            <Th>Type</Th>
            <Th>Amenities</Th>
            <Th>Schedule Visit</Th>
            <Th>Rating</Th>
            <Th>Status</Th>
            <Th>Edit</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentRentals.map((rental) => (
            <Tr key={rental.id}>
              <Td>{rental.type}</Td>
              <Td>{rental.amenities}</Td>
              <Td>{rental.scheduleVisit}</Td>
              <Td>{rental.rating}</Td>
              <Td>{rental.status}</Td>
              <Td>
                <RentalEditForm rental={rental} onSave={handleSave} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
