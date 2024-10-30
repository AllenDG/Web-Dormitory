import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { IoCalendarOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function ScheduleAVisitForm() {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleClick = () => {
    navigate("/schedule-visit"); // Navigate to the ScheduleVisitPage
  };

  return (
    <Flex align="center" gap={2} onClick={handleClick} cursor="pointer">
      <IoCalendarOutline size={35} color="#0084FF" />
      <Box>
        <Heading as="h5" size="sm" color="primary.500">
          Book an On-Site Viewing
        </Heading>
        <Text color="primary.500" fontSize="xs">
          Select your preferred viewing date
        </Text>
      </Box>
    </Flex>
  );
}
