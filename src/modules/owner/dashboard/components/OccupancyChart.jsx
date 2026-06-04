import { Box, Heading, Text, HStack, Badge } from '@chakra-ui/react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

/**
 * Occupancy Chart Component
 * Displays property occupancy distribution with pie chart
 */

const OccupancyChart = () => {
  // Mock data - replace with actual API data
  const data = [
    { name: 'Occupied', value: 42, color: '#10B981' },
    { name: 'Available', value: 18, color: '#2563EB' },
    { name: 'Maintenance', value: 5, color: '#F59E0B' },
    { name: 'Reserved', value: 8, color: '#8B5CF6' },
  ];

  const totalUnits = data.reduce((sum, item) => sum + item.value, 0);
  const occupancyRate = ((data[0].value / totalUnits) * 100).toFixed(1);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / totalUnits) * 100).toFixed(1);
      return (
        <Box bg="white" p={3} borderRadius="md" boxShadow="lg" border="1px" borderColor="gray.200">
          <Text fontWeight="semibold" mb={1}>{payload[0].name}</Text>
          <Text fontSize="sm" color="gray.600">
            {payload[0].value} units ({percentage}%)
          </Text>
        </Box>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="14"
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
      boxShadow="sm"
    >
      {/* Header */}
      <Box mb={6}>
        <Heading size="md" mb={1}>
          Occupancy Distribution
        </Heading>
        <Text fontSize="sm" color="gray.600">
          Current status of all units
        </Text>
      </Box>

      {/* Occupancy Rate Badge */}
      <HStack justify="center" mb={4}>
        <Badge
          colorScheme="green"
          fontSize="lg"
          px={4}
          py={2}
          borderRadius="full"
        >
          {occupancyRate}% Occupied
        </Badge>
      </HStack>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <HStack justify="space-around" mt={6} pt={6} borderTop="1px" borderColor="gray.200">
        {data.map((item) => (
          <Box key={item.name} textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color={item.color}>
              {item.value}
            </Text>
            <Text fontSize="xs" color="gray.600">
              {item.name}
            </Text>
          </Box>
        ))}
      </HStack>
    </Box>
  );
};

export default OccupancyChart;
