import { VStack, HStack, Box, Text, Badge, Avatar, Divider } from '@chakra-ui/react';
import SidePanel from '../../../../shared/components/SidePanel';
import { FiFlag } from 'react-icons/fi';

const TYPE_COLORS = { property: 'blue', user: 'purple', payment: 'orange' };
const STATUS_COLORS = { open: 'red', investigating: 'yellow', resolved: 'green' };
const PRIORITY_COLORS = { high: 'red', medium: 'yellow', low: 'green' };

const DetailRow = ({ label, value }) => (
  <Box>
    <Text fontSize="xs" color="gray.600" mb={1}>{label}</Text>
    <Text fontSize="sm" fontWeight="medium">{value || '—'}</Text>
  </Box>
);

/** Read-only report detail — the table row truncates title/description to one line, this is where the full text lives. */
const ReportDetailPanel = ({ isOpen, onClose, report }) => {
  if (!report) return null;

  return (
    <SidePanel isOpen={isOpen} onClose={onClose} title="Report Details" icon={FiFlag} size="md">
      <VStack spacing={6} align="stretch">
        <HStack spacing={2}>
          <Badge colorScheme={TYPE_COLORS[report.type] || 'gray'} borderRadius="md">{report.type}</Badge>
          <Badge colorScheme={STATUS_COLORS[report.status] || 'gray'} borderRadius="md">{report.status}</Badge>
          <Badge colorScheme={PRIORITY_COLORS[report.priority] || 'gray'} borderRadius="md">{report.priority} priority</Badge>
        </HStack>

        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={2}>{report.title}</Text>
          <Text fontSize="sm" color="gray.700">{report.description}</Text>
        </Box>

        <Divider />

        <DetailRow label="Reported Item" value={report.reportedItem} />

        <HStack spacing={3} align="start">
          <Avatar size="sm" name={report.reporter} />
          <Box>
            <Text fontSize="xs" color="gray.600" mb={1}>Reported By</Text>
            <Text fontSize="sm" fontWeight="medium">{report.reporter}</Text>
          </Box>
        </HStack>

        <DetailRow label="Reported" value={report.created} />
      </VStack>
    </SidePanel>
  );
};

export default ReportDetailPanel;
