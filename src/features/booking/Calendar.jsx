import { useEffect, useState } from "react";
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";

export default function Calendar({ selectedMonth, selectedYear }) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [daysInMonth, setDaysInMonth] = useState([]);

  useEffect(() => {
    const daysArray = [];
    const date = new Date(selectedYear, selectedMonth, 1);
    const daysInCurrentMonth = new Date(
      selectedYear,
      selectedMonth + 1,
      0
    ).getDate();
    const startDay = date.getDay();

    for (let i = 0; i < startDay; i++) {
      daysArray.push(null);
    }

    for (let i = 1; i <= daysInCurrentMonth; i++) {
      daysArray.push(i);
    }

    setDaysInMonth(daysArray);
  }, [selectedMonth, selectedYear]);

  return (
    <Box flex={1} p={4} bg="white" borderRadius="md" boxShadow="lg">
      <Grid templateColumns="repeat(7, 1fr)" gap={2}>
        {daysOfWeek.map((day) => (
          <GridItem
            key={day}
            bg="#0084FF" // Secondary color
            color="white"
            p={3}
            textAlign="center"
            borderRadius="md"
            boxShadow="md"
          >
            <Text fontSize="sm" fontWeight="bold">
              {day}
            </Text>
          </GridItem>
        ))}

        {daysInMonth.map((day, index) => (
          <GridItem
            key={index}
            p={3}
            bg={day ? "white" : "gray.50"}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            textAlign="center"
            boxShadow="sm"
           
          >
            {day && (
              <Text fontWeight="bold" color="blue.600">
                {day}
              </Text>
            )}
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
