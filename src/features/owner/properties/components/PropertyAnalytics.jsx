import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  Progress,
  Badge,
  Select,
} from '@chakra-ui/react';
import {
  FiEye,
  FiHeart,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiMessageSquare,
} from 'react-icons/fi';
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
import { useState } from 'react';

/**
 * Property Analytics Component
 * Detailed metrics for individual property performance
 */

const MetricCard = ({ label, value, change, changeType, icon, color }) => {
  return (
    <Box
      bg="white"
      p={5}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
    >
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between">
          <Box
            p={2}
            borderRadius="lg"
            bg={`${color}.50`}
          >
            <Icon as={icon} boxSize={5} color={`${color}.600`} />
          </Box>
          {change && (
            <Badge
              colorScheme={changeType === 'up' ? 'green' : 'red'}
              fontSize="xs"
            >
              <HStack spacing={1}>
                <Icon
                  as={changeType === 'up' ? FiTrendingUp : FiTrendingDown}
                  boxSize={3}
                />
                <Text>{change}</Text>
              </HStack>
            </Badge>
          )}
        </HStack>
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" color="gray.600">
            {label}
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {value}
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
};

const PropertyAnalytics = ({ propertyId }) => {
  const [timeRange, setTimeRange] = useState('30days');

  // Mock data - replace with actual API
  const metrics = {
    views: { value: '1,234', change: '+15%', changeType: 'up' },
    favorites: { value: '89', change: '+8%', changeType: 'up' },
    inquiries: { value: '45', change: '+12%', changeType: 'up' },
    bookings: { value: '12', change: '-5%', changeType: 'down' },
    revenue: { value: '₱96,000', change: '+18%', changeType: 'up' },
    occupancy: { value: '92%', change: '+3%', changeType: 'up' },
    avgStay: { value: '8.5 mo', change: '+2%', changeType: 'up' },
    rating: { value: '4.8/5', change: '+0.2', changeType: 'up' },
  };

  const viewsData = [
    { date: 'Jun 1', views: 45, inquiries: 5 },
    { date: 'Jun 5', views: 52, inquiries: 7 },
    { date: 'Jun 10', views: 48, inquiries: 6 },
    { date: 'Jun 15', views: 65, inquiries: 8 },
    { date: 'Jun 20', views: 58, inquiries: 7 },
    { date: 'Jun 25', views: 72, inquiries: 9 },
    { date: 'Jun 30', views: 68, inquiries: 8 },
  ];

  const bookingData = [
    { month: 'Jan', bookings: 8, revenue: 64000 },
    { month: 'Feb', bookings: 10, revenue: 80000 },
    { month: 'Mar', bookings: 7, revenue: 56000 },
    { month: 'Apr', bookings: 12, revenue: 96000 },
    { month: 'May', bookings: 9, revenue: 72000 },
    { month: 'Jun', bookings: 11, revenue: 88000 },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box bg="white" p={3} borderRadius="md" boxShadow="lg" border="1px" borderColor="gray.200">
          <Text fontWeight="semibold" mb={2}>{payload[0].payload.date || payload[0].payload.month}</Text>
          {payload.map((entry, index) => (
            <HStack key={index} justify="space-between" spacing={4}>
              <Text fontSize="sm" color={entry.color}>{entry.name}:</Text>
              <Text fontSize="sm" fontWeight="semibold">
                {entry.name === 'revenue' ? `₱${entry.value.toLocaleString()}` : entry.value}
              </Text>
            </HStack>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box>
      {/* Header */}
      <HStack justify="space-between" mb={6}>
        <Box>
          <Heading size="md" mb={1}>
            Property Analytics
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Performance metrics and trends
          </Text>
        </Box>
        <Select
          size="sm"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          w="150px"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="1year">Last Year</option>
        </Select>
      </HStack>

      {/* Key Metrics */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
        <MetricCard
          label="Total Views"
          value={metrics.views.value}
          change={metrics.views.change}
          changeType={metrics.views.changeType}
          icon={FiEye}
          color="primary"
        />
        <MetricCard
          label="Favorites"
          value={metrics.favorites.value}
          change={metrics.favorites.change}
          changeType={metrics.favorites.changeType}
          icon={FiHeart}
          color="error"
        />
        <MetricCard
          label="Inquiries"
          value={metrics.inquiries.value}
          change={metrics.inquiries.change}
          changeType={metrics.inquiries.changeType}
          icon={FiMessageSquare}
          color="info"
        />
        <MetricCard
          label="Bookings"
          value={metrics.bookings.value}
          change={metrics.bookings.change}
          changeType={metrics.bookings.changeType}
          icon={FiCalendar}
          color="success"
        />
      </SimpleGrid>

      {/* Revenue & Performance Metrics */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
        <MetricCard
          label="Total Revenue"
          value={metrics.revenue.value}
          change={metrics.revenue.change}
          changeType={metrics.revenue.changeType}
          icon={FiDollarSign}
          color="warning"
        />
        <MetricCard
          label="Occupancy Rate"
          value={metrics.occupancy.value}
          change={metrics.occupancy.change}
          changeType={metrics.occupancy.changeType}
          icon={FiTrendingUp}
          color="purple"
        />
        <MetricCard
          label="Avg. Stay"
          value={metrics.avgStay.value}
          change={metrics.avgStay.change}
          changeType={metrics.avgStay.changeType}
          icon={FiUsers}
          color="info"
        />
        <MetricCard
          label="Rating"
          value={metrics.rating.value}
          change={metrics.rating.change}
          changeType={metrics.rating.changeType}
          icon={FiTrendingUp}
          color="warning"
        />
      </SimpleGrid>

      {/* Charts */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Views & Inquiries Chart */}
        <Box
          bg="white"
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor="gray.200"
        >
          <Heading size="sm" mb={4}>
            Views & Inquiries
          </Heading>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#2563EB"
                strokeWidth={2}
                name="Views"
                dot={{ fill: '#2563EB', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="inquiries"
                stroke="#10B981"
                strokeWidth={2}
                name="Inquiries"
                dot={{ fill: '#10B981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Bookings & Revenue Chart */}
        <Box
          bg="white"
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor="gray.200"
        >
          <Heading size="sm" mb={4}>
            Bookings & Revenue
          </Heading>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
              <Bar dataKey="bookings" fill="#10B981" name="Bookings" radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="revenue"
                fill="#2563EB"
                name="Revenue"
                radius={[4, 4, 0, 0]}
                yAxisId="right"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </SimpleGrid>

      {/* Conversion Funnel */}
      <Box
        bg="white"
        p={6}
        borderRadius="lg"
        border="1px"
        borderColor="gray.200"
        mt={6}
      >
        <Heading size="sm" mb={4}>
          Conversion Funnel
        </Heading>
        <VStack spacing={3} align="stretch">
          <Box>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" color="gray.600">Views</Text>
              <Text fontSize="sm" fontWeight="semibold">1,234 (100%)</Text>
            </HStack>
            <Progress value={100} colorScheme="blue" borderRadius="full" />
          </Box>
          <Box>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" color="gray.600">Favorites</Text>
              <Text fontSize="sm" fontWeight="semibold">89 (7.2%)</Text>
            </HStack>
            <Progress value={7.2} colorScheme="red" borderRadius="full" />
          </Box>
          <Box>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" color="gray.600">Inquiries</Text>
              <Text fontSize="sm" fontWeight="semibold">45 (3.6%)</Text>
            </HStack>
            <Progress value={3.6} colorScheme="purple" borderRadius="full" />
          </Box>
          <Box>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" color="gray.600">Bookings</Text>
              <Text fontSize="sm" fontWeight="semibold">12 (1.0%)</Text>
            </HStack>
            <Progress value={1.0} colorScheme="green" borderRadius="full" />
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default PropertyAnalytics;
