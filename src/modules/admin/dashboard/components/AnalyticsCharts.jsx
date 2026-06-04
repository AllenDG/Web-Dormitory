import { useState } from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  HStack,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * AnalyticsCharts Component
 * Display platform analytics and metrics
 */
export function AnalyticsCharts() {
  const [timeRange, setTimeRange] = useState('monthly');
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Mock data - will be replaced with API
  const userGrowthData = [
    { month: 'Jan', tenants: 1200, owners: 150, total: 1350 },
    { month: 'Feb', tenants: 1450, owners: 180, total: 1630 },
    { month: 'Mar', tenants: 1800, owners: 220, total: 2020 },
    { month: 'Apr', tenants: 2100, owners: 250, total: 2350 },
    { month: 'May', tenants: 2500, owners: 290, total: 2790 },
    { month: 'Jun', tenants: 2850, owners: 320, total: 3170 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 850000, expenses: 320000, profit: 530000 },
    { month: 'Feb', revenue: 920000, expenses: 340000, profit: 580000 },
    { month: 'Mar', revenue: 1050000, expenses: 380000, profit: 670000 },
    { month: 'Apr', revenue: 1150000, expenses: 400000, profit: 750000 },
    { month: 'May', revenue: 1280000, expenses: 420000, profit: 860000 },
    { month: 'Jun', revenue: 1450000, expenses: 450000, profit: 1000000 },
  ];

  const propertyTypeData = [
    { name: 'Studio', value: 320, color: '#2563EB' },
    { name: 'Single Room', value: 450, color: '#10B981' },
    { name: 'Double Room', value: 280, color: '#F59E0B' },
    { name: 'Shared Room', value: 184, color: '#8B5CF6' },
  ];

  const bookingStatusData = [
    { status: 'Completed', count: 456 },
    { status: 'Active', count: 234 },
    { status: 'Pending', count: 89 },
    { status: 'Cancelled', count: 34 },
  ];

  return (
    <Box>
      {/* Time Range Selector */}
      <HStack spacing={2} mb={6}>
        <Button
          size="sm"
          variant={timeRange === 'weekly' ? 'solid' : 'outline'}
          onClick={() => setTimeRange('weekly')}
        >
          Weekly
        </Button>
        <Button
          size="sm"
          variant={timeRange === 'monthly' ? 'solid' : 'outline'}
          onClick={() => setTimeRange('monthly')}
        >
          Monthly
        </Button>
        <Button
          size="sm"
          variant={timeRange === 'yearly' ? 'solid' : 'outline'}
          onClick={() => setTimeRange('yearly')}
        >
          Yearly
        </Button>
      </HStack>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* User Growth Chart */}
        <Box
          bg={bgColor}
          p={6}
          borderRadius="8px"
          border="1px"
          borderColor={borderColor}
        >
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            User Growth
          </Text>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="tenants"
                stroke="#2563EB"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="owners"
                stroke="#8B5CF6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Revenue Chart */}
        <Box
          bg={bgColor}
          p={6}
          borderRadius="8px"
          border="1px"
          borderColor={borderColor}
        >
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Revenue & Profit
          </Text>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#2563EB" />
              <Bar dataKey="expenses" fill="#EF4444" />
              <Bar dataKey="profit" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Property Types Distribution */}
        <Box
          bg={bgColor}
          p={6}
          borderRadius="8px"
          border="1px"
          borderColor={borderColor}
        >
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Property Types Distribution
          </Text>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={propertyTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {propertyTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Booking Status Chart */}
        <Box
          bg={bgColor}
          p={6}
          borderRadius="8px"
          border="1px"
          borderColor={borderColor}
        >
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Booking Status
          </Text>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2563EB" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
