import { Box, Heading, Text, HStack, Badge } from '@chakra-ui/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { computeOccupancyBreakdown } from '../utils/ownerAnalytics';

/**
 * Occupancy Chart — real breakdown from the owner's properties + bookings
 * (Occupied/Available/Reserved/Inactive), using fields that already exist
 * on the data (no fabricated "maintenance" flag).
 */
const OccupancyChart = ({ properties, bookings }) => {
  const data = computeOccupancyBreakdown(properties, bookings);
  const totalUnits = data.reduce((sum, item) => sum + item.value, 0);
  const occupancyRate = totalUnits > 0 ? ((data[0].value / totalUnits) * 100).toFixed(1) : '0.0';

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percentage = totalUnits > 0 ? ((payload[0].value / totalUnits) * 100).toFixed(1) : '0.0';
      return (
        <Box bg="white" p={3} borderRadius="md" boxShadow="lg" border="1px" borderColor="gray.200">
          <Text fontWeight="semibold" mb={1}>{payload[0].name}</Text>
          <Text fontSize="sm" color="gray.600">{payload[0].value} properties ({percentage}%)</Text>
        </Box>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (!percent) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="14" fontWeight="600">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200" boxShadow="sm">
      <Box mb={6}>
        <Heading size="md" mb={1}>Occupancy Distribution</Heading>
        <Text fontSize="sm" color="gray.600">Current status of all properties</Text>
      </Box>

      <HStack justify="center" mb={4}>
        <Badge colorScheme="green" fontSize="lg" px={4} py={2} borderRadius="full">
          {occupancyRate}% Occupied
        </Badge>
      </HStack>

      {totalUnits === 0 ? (
        <Text textAlign="center" color="gray.500" py={10}>
          Add a property to see occupancy data.
        </Text>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" labelLine={false} label={renderCustomLabel} outerRadius={100} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
            </PieChart>
          </ResponsiveContainer>

          <HStack justify="space-around" mt={6} pt={6} borderTop="1px" borderColor="gray.200">
            {data.map((item) => (
              <Box key={item.name} textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color={item.color}>{item.value}</Text>
                <Text fontSize="xs" color="gray.600">{item.name}</Text>
              </Box>
            ))}
          </HStack>
        </>
      )}
    </Box>
  );
};

export default OccupancyChart;
