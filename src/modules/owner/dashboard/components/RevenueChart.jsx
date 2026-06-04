import { Box, Heading, Text, HStack, Select } from '@chakra-ui/react';
import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

/**
 * Revenue Chart Component
 * Displays revenue trends with monthly/quarterly/yearly views
 */

const RevenueChart = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [chartType, setChartType] = useState('line');

  // Mock data - replace with actual API data
  const monthlyData = [
    { period: 'Jan', revenue: 35000, expenses: 12000, profit: 23000 },
    { period: 'Feb', revenue: 42000, expenses: 15000, profit: 27000 },
    { period: 'Mar', revenue: 38000, expenses: 13000, profit: 25000 },
    { period: 'Apr', revenue: 45000, expenses: 16000, profit: 29000 },
    { period: 'May', revenue: 52000, expenses: 18000, profit: 34000 },
    { period: 'Jun', revenue: 48000, expenses: 17000, profit: 31000 },
  ];

  const quarterlyData = [
    { period: 'Q1 2026', revenue: 115000, expenses: 40000, profit: 75000 },
    { period: 'Q2 2026', revenue: 145000, expenses: 51000, profit: 94000 },
  ];

  const yearlyData = [
    { period: '2024', revenue: 450000, expenses: 155000, profit: 295000 },
    { period: '2025', revenue: 520000, expenses: 180000, profit: 340000 },
    { period: '2026', revenue: 260000, expenses: 91000, profit: 169000 },
  ];

  const getDataByTimeRange = () => {
    switch (timeRange) {
      case 'monthly':
        return monthlyData;
      case 'quarterly':
        return quarterlyData;
      case 'yearly':
        return yearlyData;
      default:
        return monthlyData;
    }
  };

  const data = getDataByTimeRange();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box bg="white" p={3} borderRadius="md" boxShadow="lg" border="1px" borderColor="gray.200">
          <Text fontWeight="semibold" mb={2}>{payload[0].payload.period}</Text>
          {payload.map((entry, index) => (
            <HStack key={index} justify="space-between" spacing={4}>
              <Text fontSize="sm" color={entry.color}>{entry.name}:</Text>
              <Text fontSize="sm" fontWeight="semibold">
                ₱{entry.value.toLocaleString()}
              </Text>
            </HStack>
          ))}
        </Box>
      );
    }
    return null;
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
      <HStack justify="space-between" mb={6}>
        <Box>
          <Heading size="md" mb={1}>
            Revenue Overview
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Track your earnings and expenses
          </Text>
        </Box>
        <HStack spacing={3}>
          <Select
            size="sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            w="140px"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </Select>
          <Select
            size="sm"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            w="120px"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </Select>
        </HStack>
      </HStack>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2563EB"
              strokeWidth={2}
              name="Revenue"
              dot={{ fill: '#2563EB', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#EF4444"
              strokeWidth={2}
              name="Expenses"
              dot={{ fill: '#EF4444', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#10B981"
              strokeWidth={2}
              name="Profit"
              dot={{ fill: '#10B981', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
            />
            <Bar dataKey="revenue" fill="#2563EB" name="Revenue" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" fill="#10B981" name="Profit" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
};

export default RevenueChart;
