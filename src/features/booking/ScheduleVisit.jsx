import { Box, Heading, VStack, Text, Button } from "@chakra-ui/react";

export default function ScheduledVisits({ onConfirmBooking }) {
  const sampleEvents = [
    { date: "2024-01-10", event: "On-site Visit at Dormitory A" },
    { date: "2024-01-15", event: "Visit to Apartment B" },
  ];

  return (
    <Box w="300px" p={4} bg="white" borderRadius="md" boxShadow="lg">
      <Heading as="h2" size="md" mb={4} color="blue.500">
        Scheduled Visits
      </Heading>
      <VStack spacing={4} align="stretch">
        {sampleEvents.map((event, index) => (
          <Box
            key={index}
            p={4}
            bg="gray.100"
            borderRadius="md"
            border="1px solid"
            borderColor="gray.300"
            transition="all 0.2s"
            _hover={{ bg: "gray.200", boxShadow: "md" }}
          >
            <Text fontWeight="bold" fontSize="lg" color="blue.700">
              {event.date}
            </Text>
            <Text fontSize="md" color="gray.700">
              {event.event}
            </Text>
            <Button
              size="sm"
              mt={3}
              bg="#0084FF"
              color="white"
              _hover={{ bg: "#0074D9" }} // Darker shade for hover effect
              onClick={() => onConfirmBooking(event.date)}
            >
              Book Now
            </Button>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
