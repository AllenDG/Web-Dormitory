import {
  Box,
  useColorModeValue,
  Flex,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
} from "@chakra-ui/react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiHeart,
  FiCalendar,
} from "react-icons/fi";
import dummyData from "../data/dummyData.json"; // Load JSON data

// Icon Mapping to fix dynamic icons from JSON
const iconMap = {
  FiUsers: FiUsers,
  FiCheckCircle: FiCheckCircle,
  FiClock: FiClock,
  FiXCircle: FiXCircle,
  FiHeart: FiHeart,
  FiCalendar: FiCalendar,
};

export default function OwnerDashboardPage() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.700");

  return (
    // Full Page Container
    <Flex direction="row" minH="100vh">
      {/* Sidebar (if you have a sidebar here, it would go in this Flex container) */}
      {/* <SidebarComponent /> */}

      {/* Scrollable Dashboard Content */}
      <Box
        direction="column"
        flex="1"
        p={4}
        overflowY="auto" // Enables vertical scrolling for dashboard content
        bgColor={bgColor}
        maxH="100vh" // Sets the max height to the full viewport
      >
        <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
          Owner Dashboard
        </Text>

        {/* Tenant & User Stats Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {dummyData.tenantStats.map((stat) => (
            <Box
              key={stat.label}
              bg={cardBgColor}
              boxShadow="md"
              borderRadius="lg"
              p={4}
              textAlign="center"
            >
              <Flex justifyContent="center" mb={4}>
                <Icon as={iconMap[stat.icon]} w={8} h={8} color={stat.color} />
              </Flex>
              <Stat>
                <StatLabel>{stat.label}</StatLabel>
                <StatNumber fontSize="2xl" color={stat.color}>
                  {stat.value}
                </StatNumber>
                <StatHelpText>Updated recently</StatHelpText>
              </Stat>
            </Box>
          ))}
        </SimpleGrid>

        {/* Charts Section */}
        <Flex
          mt={10}
          gap={6}
          direction={{ base: "column", md: "row" }}
          overflowX="auto" // Enables horizontal scrolling for charts section
        >
          {/* Pie Chart Box: Tenant Status */}
          <Box bg={cardBgColor} boxShadow="md" borderRadius="lg" p={6} flex="1">
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Tenant Status
            </Text>
            <Flex justify="center" align="center">
              <PieChart width={350} height={350}>
                <Pie
                  data={dummyData.dataPie}
                  cx={175}
                  cy={175}
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={120}
                  fill="#8884d8"
                >
                  {dummyData.dataPie.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? "#0084FF" : "#FF8042"}
                    />
                  ))}
                </Pie>
              </PieChart>
            </Flex>
          </Box>

          {/* Line Chart Box: Monthly Sales */}
          <Box bg={cardBgColor} boxShadow="md" borderRadius="lg" p={6} flex="1">
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Monthly Sales Data
            </Text>
            <LineChart width={500} height={300} data={dummyData.dataBar}>
              <XAxis
                dataKey="name"
                stroke={useColorModeValue("gray.600", "gray.200")}
              />
              <YAxis stroke={useColorModeValue("gray.600", "gray.200")} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#0084FF" />
            </LineChart>
          </Box>
        </Flex>

        {/* New: Listing Performance Chart */}
        <Box mt={10} bg={cardBgColor} boxShadow="md" borderRadius="lg" p={6}>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Listing Performance
          </Text>
          <BarChart
            width={600}
            height={300}
            data={dummyData.listingPerformance}
          >
            <XAxis
              dataKey="name"
              stroke={useColorModeValue("gray.600", "gray.200")}
            />
            <YAxis stroke={useColorModeValue("gray.600", "gray.200")} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#0084FF" />
          </BarChart>
        </Box>
      </Box>
    </Flex>
  );
}
