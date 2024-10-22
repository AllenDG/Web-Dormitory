import {
  Box,
  useColorModeValue,
  Flex,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

// Data for the Pie Chart (Tenant Status)
const dataPie = [
  { name: "Approved", value: 400 },
  { name: "Pending", value: 300 },
  { name: "Rejected", value: 100 },
];

// Sample data for Monthly Sales
const dataBar = [
  { name: "Jan", value: 2400 },
  { name: "Feb", value: 2210 },
  { name: "Mar", value: 2290 },
  { name: "Apr", value: 2000 },
  { name: "May", value: 2181 },
  { name: "Jun", value: 2500 },
];

// Cards data
const tenantStats = [
  { label: "Total Tenants", value: 800 },
  { label: "Active Tenants", value: 700 },
  { label: "Pending Applications", value: 50 },
  { label: "Rejected Applications", value: 50 },
];

export default function OwnerDashboardPage() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");

  return (
    <Box direction="column" minH="100vh" bgColor={bgColor} p={4}>
      <h1>Dashboard</h1>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mt={6}>
        {/* Tenant Stats Cards */}
        {tenantStats.map((stat) => (
          <Box
            key={stat.label}
            bg="white"
            boxShadow="md"
            borderRadius="md"
            p={4}
            textAlign="center"
          >
            <Text fontSize="lg" fontWeight="bold">
              {stat.label}
            </Text>
            <Text fontSize="2xl" color="#0084FF">
              {stat.value}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      <Flex mt={6} gap={6} direction={{ base: "column", md: "row" }}>
        {/* Pie Chart Box */}
        <Box bg="white" boxShadow="md" borderRadius="md" p={4} flex="1">
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Tenant Status
          </Text>
          <Flex justify="center" align="center">
            <PieChart width={350} height={350}>
              {" "}
              {/* Increased size */}
              <Pie
                data={dataPie}
                cx={175} // Center adjusted for increased width
                cy={175} // Center adjusted for increased height
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={100} // Increased outer radius
                fill="#8884d8"
              >
                {dataPie.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index % 2 === 0 ? "#0084FF" : "#FF8042"}
                  />
                ))}
              </Pie>
            </PieChart>
          </Flex>
        </Box>

        {/* Bar Chart Box */}
        <Box bg="white" boxShadow="md" borderRadius="md" p={4} flex="1">
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Monthly Sales Data
          </Text>
          <BarChart width={600} height={300} data={dataBar}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#0084FF" />
          </BarChart>
        </Box>
      </Flex>
    </Box>
  );
}
