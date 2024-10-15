import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { IoCalendarOutline } from "react-icons/io5";

export default function ScheduleAVisitForm() {
  return (
    <>
      <Flex align="center" gap={2}>
        <IoCalendarOutline size={35} color="#0084FF" />
        <Box>
          <Heading as='h5' size='sm' color="primary.500">
            Book an On-Site Viewing
          </Heading>
          <Text color="primary.500" fontSize='xs'>Select your preferred viewing date</Text>
        </Box>
      </Flex>
    </>
  );
}
