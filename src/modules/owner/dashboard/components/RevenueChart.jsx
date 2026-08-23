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
} from 'recharts';
import { primaryColorHex } from '../../../../shared/theme/theme';
import { bucketRevenueByMonth } from '../utils/ownerAnalytics';

const RANGE_MONTHS = { monthly: 6, quarterly: 12, yearly: 24 };

/**
 * Revenue Chart — real data, bucketed from the owner's paid/confirmed
 * bookings. No expenses/profit series: no expense-tracking feature exists
 * anywhere in the app, so those would have to be fabricated.
 */
const RevenueChart = ({ bookings }) => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [chartType, setChartType] = useState('line');

  const data = bucketRevenueByMonth(bookings, RANGE_MONTHS[timeRange]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box bg="white" p={3} borderRadius="md" boxShadow="lg" border="1px" borderColor="gray.200">
          <Text fontWeight="semibold" mb={1}>{payload[0].payload.period}</Text>
          <Text fontSize="sm" color={primaryColorHex}>
            Revenue: ₱{payload[0].value.toLocaleString()}
          </Text>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200" boxShadow="sm">
      <HStack justify="space-between" mb={6} flexWrap="wrap" gap={3}>
        <Box>
          <Heading size="md" mb={1}>Revenue Overview</Heading>
          <Text fontSize="sm" color="gray.600">Payments collected over time</Text>
        </Box>
        <HStack spacing={3}>
          <Select size="sm" value={timeRange} onChange={(e) => setTimeRange(e.target.value)} w="140px">
            <option value="monthly">Last 6 Months</option>
            <option value="quarterly">Last 12 Months</option>
            <option value="yearly">Last 24 Months</option>
          </Select>
          <Select size="sm" value={chartType} onChange={(e) => setChartType(e.target.value)} w="120px">
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </Select>
        </HStack>
      </HStack>

      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="revenue" stroke={primaryColorHex} strokeWidth={2} name="Revenue" dot={{ fill: primaryColorHex, r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" fill={primaryColorHex} name="Revenue" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
};

export default RevenueChart;
