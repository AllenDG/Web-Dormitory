import { SimpleGrid } from '@chakra-ui/react';
import {
  FiUsers,
  FiHome,
  FiDollarSign,
  FiAlertCircle,
} from 'react-icons/fi';
import StatCard from '../../../../shared/components/StatCard';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0, notation: 'compact' }).format(value);

export function PlatformStats({ stats }) {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
      <StatCard label="Total Users" value={stats.totalUsers} icon={FiUsers} color="primary" />
      <StatCard label="Active Properties" value={stats.activeProperties} icon={FiHome} color="success" />
      <StatCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={FiDollarSign} color="warning" />
      <StatCard label="Open Issues" value={stats.openReports} icon={FiAlertCircle} color="error" />
    </SimpleGrid>
  );
}

export default PlatformStats;
