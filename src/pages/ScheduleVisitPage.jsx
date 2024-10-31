import { useState } from "react";
import { Box, Flex, Heading, Select, HStack } from "@chakra-ui/react";
import Calendar from "../features/booking/Calendar";
import ScheduledVisits from "../features/booking/ScheduleVisit";
import BookingSummary from "../features/booking/BookingSummary";

export default function ScheduleVisitPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [bookingStatus, setBookingStatus] = useState(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleBookDate = (day) => {
    const date = `${selectedYear}-${selectedMonth + 1}-${day}`;
    setBookingStatus(`Pending confirmation for ${date}`);
  };

  const handleConfirmBooking = (date) => {
    setBookingStatus(`Confirmed for ${date}`);
  };

  return (
    <Flex direction="column" p={6} bg="#F4F4F4" minH="100vh" align="center">
      <Box mb={6}>
        <Heading as="h1" size="xl" color="#0084FF" textAlign="center">
          Schedule a Visit - Calendar
        </Heading>
      </Box>

      <Flex mb={6} justify="center" gap={6}>
        <HStack spacing={4}>
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            width="150px"
            borderColor="gray.300"
            _focus={{ borderColor: "#0084FF" }} // Focus effect
            variant="outline"
            placeholder="Select Month"
          >
            {months.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </Select>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            width="100px"
            borderColor="gray.300"
            _focus={{ borderColor: "#0084FF" }} // Focus effect
            variant="outline"
            placeholder="Select Year"
          >
            {[2023, 2024, 2025].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </HStack>
      </Flex>

      <Flex gap={8} justify="space-between" width="100%">
        <Calendar
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onBookDate={handleBookDate}
        />
        <ScheduledVisits onConfirmBooking={handleConfirmBooking} />
      </Flex>

      <Box mt={8} width="100%">
        <BookingSummary bookingStatus={bookingStatus} />
      </Box>
    </Flex>
  );
}
