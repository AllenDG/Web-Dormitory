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
import dummyData from "../data/dummyData.json";

const iconMap = {
  FiUsers: FiUsers,
  FiCheckCircle: FiCheckCircle,
  FiClock: FiClock,
  FiXCircle: FiXCircle,
  FiHeart: FiHeart,
  FiCalendar: FiCalendar,
};

export default function OwnerDashboardPage() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");

  return (
    <Flex direction="row" minH="100vh">
      <Box
        direction="column"
        flex="1"
        p={4}
        overflowY="auto" 
        bgColor={bgColor}
        maxH="100vh" 
      >
        <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
          Owner Dashboard
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {dummyData.tenantStats.map((stat) => (
            <Box
              key={stat.label}
              bg={bgColor}
              borderWidth={1}
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

        <Flex
          mt={10}
          gap={6}
          direction={{ base: "column", md: "row" }}
          overflowX="auto"
        >
          <Box bg={bgColor} borderWidth={1} boxShadow="md" borderRadius="lg" p={6} flex="1">
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
          <Box bg={bgColor} borderWidth={1} boxShadow="md" borderRadius="lg" p={6} flex="1">
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

        <Box mt={10} bg={bgColor} borderWidth={1} boxShadow="md" borderRadius="lg" p={6}>
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
