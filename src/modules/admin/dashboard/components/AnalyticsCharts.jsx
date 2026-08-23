import { Box, SimpleGrid, Text, VStack, Heading } from '@chakra-ui/react';
import {
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
import { primaryColorHex, errorColorHex, successColorHex } from '../../../../shared/theme/theme';
import {
  computeUsersByRole,
  computeRevenueByMonth,
  computePropertyTypeDistribution,
  computeBookingStatusCounts,
} from '../utils/adminAnalytics';

const PIE_COLORS = [primaryColorHex, successColorHex, '#DD6B20', '#8B5CF6', errorColorHex];

const ChartCard = ({ title, caption, children }) => (
  <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200">
    <Text fontSize="lg" fontWeight="bold" mb={1}>{title}</Text>
    {caption && <Text fontSize="xs" color="gray.600" mb={4}>{caption}</Text>}
    {children}
  </Box>
);

const ChartSection = ({ title, description, children }) => (
  <VStack spacing={6} align="stretch">
    <Box>
      <Heading size="md" mb={1}>{title}</Heading>
      <Text fontSize="sm" color="gray.600">{description}</Text>
    </Box>
    {children}
  </VStack>
);

export function AnalyticsCharts({ users, rentals, bookings, stats }) {
  const usersByRole = computeUsersByRole(users);
  const revenueByMonth = computeRevenueByMonth(bookings, 6);
  const propertyTypes = computePropertyTypeDistribution(rentals);
  const bookingStatus = computeBookingStatusCounts(bookings);

  const hasUsers = usersByRole.length > 0;
  const hasRevenue = revenueByMonth.length > 0 && revenueByMonth.some(r => r.revenue > 0);
  const hasProperties = propertyTypes.length > 0;
  const hasBookings = bookingStatus.length > 0;

  return (
    <VStack spacing={12} align="stretch">
      <ChartSection
        title="Platform Growth"
        description="Who's on the platform and what they're listing."
      >
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <ChartCard title="Users by Role">
            {!hasUsers ? (
              <Text color="gray.600" textAlign="center" py={16}>Not enough data yet.</Text>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usersByRole}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill={primaryColorHex} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Property Types">
            {!hasProperties ? (
              <Text color="gray.600" textAlign="center" py={16}>Not enough data yet.</Text>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={propertyTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {propertyTypes.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </SimpleGrid>
      </ChartSection>

      <ChartSection
        title="Revenue & Bookings"
        description="Money moving through the platform and booking demand."
      >
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <ChartCard title="Revenue by Month">
            {!hasRevenue ? (
              <Text color="gray.600" textAlign="center" py={16}>Not enough data yet.</Text>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill={successColorHex} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard
            title="Booking Activity"
            caption={stats ? `${stats.totalBookings} total · ${stats.activeBookings} active` : undefined}
          >
            {!hasBookings ? (
              <Text color="gray.600" textAlign="center" py={16}>Not enough data yet.</Text>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bookingStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill={primaryColorHex} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </SimpleGrid>
      </ChartSection>
    </VStack>
  );
}

export default AnalyticsCharts;
