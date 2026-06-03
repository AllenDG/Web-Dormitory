import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  Badge,
  Progress,
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
  FiStar,
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
 * Detailed analytics for individual property performance
 */

const MetricCard = ({ label, value, change, trend, icon, color }) => {
  return (
    <Box
      bg="white"
      p={5}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
    >
      <HStack justify="space-between" mb={3}>
        <Box
          bg={`${color}.50`}
          p={2}
          borderRadius="lg"
        >
          <Icon as={icon} boxSize={5} color={`${color}.600`} />
        </Box>
        <Badge
          colorScheme={trend === 'up' ? 'green' : 'red'}
          fontSize="xs"
        >
          <HStack spacing={1}>
            <Icon
              as={trend === 'up' ? FiTrendingUp : FiTrendingDown}
              boxSize={3}
            />
            <Text>{change}</Text>
          </HStack>
        </Badge>
      </HStack>
      <VStack align="start" spacing={1}>
        <Text fontSize="xs" color="gray.600">
          {label}
        </Text>
        <Text fontSize="2xl" fontWeight="bold">
          {value}
        </Text>
      </VStack>
    </Box>
  );
};

const PropertyAnalytics = ({ propertyId }) => {
  const [timeRange, setTimeRange] = useState('7days');

  // Mock data - replace with actual API
  const metrics = {
    views: { value: 1247, change: '+23%', trend: 'up' },
    favorites: { value: 89, change: '+15%', trend: 'up' },
    bookings: { value: 12, change: '-5%', trend: 'down' },
    revenue: { value: '₱48,000', change: '+18%', trend: 'up' },
    inquiries: { value: 34, change: '+12%', trend: 'up' },
    avgRating: { value: '4.8', change: '+0.2', trend: 'up' },
  };

  const viewsData = [
    { date: 'Mon', views: 45, clicks: 12, bookings: 2 },
    { date: 'Tue', views: 52, clicks: 15, bookings: 3 },
    { date: 'Wed', views: 48, clicks: 14, bookings: 1 },
    { date: 'Thu', views: 61, clicks: 18, bookings: 4 },
    { date: 'Fri', views: 55, clicks: 16, bookings: 2 },
    { date: 'Sat', views: 72, clicks: 22, bookings: 5 },
    { date: 'Sun', views: 68, clicks: 20, bookings: 3 },
  };

  const performanceData = [
    { metric: 'Views', value: 92, color: '#2563EB' },
    { metric: 'Click Rate', value: 78, color: '#10B981' },
    { metric: 'Booking Rate', value: 65, color: '#F59E0B' },
    { metric: 'Response Rate', value: 88, color: '#8B5CF6' },
    { metric: 'Occupancy', value: 85, color: '#EF4444' },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box bg="white" p={3} borderRadius="md" boxShadow="lg" border="1px" borderColor="gray.200">
          <Text fontWeight="semibold" mb={2}>{payload[0].payload.date}</Text>
          {payload.map((entry, index) => (
            <HStack key={index} justify="space-between" spacing={4}>
              <Text fontSize="sm" color={entry.color}>{entry.name}:</Text>
              <Text fontSize="sm" fontWeight="semibold">{entry.value}</Text>
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
            Track performance and visitor engagement
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
          <option value="year">This Year</option>
        </Select>
      </HStack>

      {/* Key Metrics */}
      <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4} mb={6}>
        <MetricCard
          label="Total Views"
          value={metrics.views.value}
          change={metrics.views.change}
          trend={metrics.views.trend}
          icon={FiEye}
          color="primary"
        />
        <MetricCard
          label="Favorites"
          value={metrics.favorites.value}
          change={metrics.favorites.change}
          trend={metrics.favorites.trend}
          icon={FiHeart}
          color="error"
        />
        <MetricCard
          label="Bookings"
          value={metrics.bookings.value}
          change={metrics.bookings.change}
          trend={metrics.bookings.trend}
          icon={FiCalendar}
          color="success"
        />
        <MetricCard
          label="Revenue"
          value={metrics.revenue.value}
          change={metrics.revenue.change}
          trend={metrics.revenue.trend}
          icon={FiDollarSign}
          color="warning"
        />
        <MetricCard
          label="Inquiries"
          value={metrics.inquiries.value}
          change={metrics.inquiries.change}
          trend={metrics.inquiries.trend}
          icon={FiUsers}
          color="purple"
        />
        <MetricCard
          label="Avg. Rating"
          value={metrics.avgRating.value}
          change={metrics.avgRating.change}
          trend={metrics.avgRating.trend}
          icon={FiStar}
          color="warning"
        />
      </SimpleGrid>

      {/* Views Trend Chart */}
      <Box
        bg="white"
        p={6}
        borderRadius="lg"
        border="1px"
        borderColor="gray.200"
        mb={6}
      >
        <Heading size="sm" mb={4}>
          Visitor Engagement Trend
        </Heading>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={viewsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
            />
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
              dataKey="clicks"
              stroke="#10B981"
              strokeWidth={2}
              name="Clicks"
              dot={{ fill: '#10B981', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#F59E0B"
              strokeWidth={2}
              name="Bookings"
              dot={{ fill: '#F59E0B', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Performance Scores */}
      <Box
        bg="white"
        p={6}
        borderRadius="lg"
        border="1px"
        borderColor="gray.200"
      >
        <Heading size="sm" mb={4}>
          Performance Scores
        </Heading>
        <VStack spacing={4} align="stretch">
          {performanceData.map((item) => (
            <Box key={item.metric}>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" fontWeight="medium">
                  {item.metric}
                </Text>
                <Text fontSize="sm" fontWeight="bold" color={item.color}>
                  {item.value}%
                </Text>
              </HStack>
              <Progress
                value={item.value}
                size="sm"
                borderRadius="full"
                sx={{
                  '& > div': {
                    backgroundColor: item.color,
                  },
                }}
              />
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default PropertyAnalytics;
