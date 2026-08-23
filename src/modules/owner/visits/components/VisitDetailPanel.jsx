import { VStack, HStack, Box, Text, Badge, Divider } from '@chakra-ui/react';
import SidePanel from '../../../../shared/components/SidePanel';
import { FiCalendar } from 'react-icons/fi';

const STATUS_COLORS = { pending: 'yellow', approved: 'green', rejected: 'red', rescheduled: 'blue', completed: 'gray', cancelled: 'red' };

const DetailRow = ({ label, value }) => (
  <Box>
    <Text fontSize="xs" color="gray.600" mb={1}>{label}</Text>
    <Text fontSize="sm" fontWeight="medium">{value || '—'}</Text>
  </Box>
);

/** Read-only visit-request detail, including any alternative schedules already proposed. */
const VisitDetailPanel = ({ isOpen, onClose, visit }) => {
  if (!visit) return null;

  return (
    <SidePanel isOpen={isOpen} onClose={onClose} title="Visit Request" icon={FiCalendar} size="md">
      <VStack spacing={6} align="stretch">
        <HStack>
          <Badge colorScheme={STATUS_COLORS[visit.status] || 'gray'} borderRadius="md">{visit.status}</Badge>
        </HStack>

        <DetailRow label="Property" value={visit.propertyTitle} />
        <DetailRow label="Tenant" value={visit.tenantName} />
        <DetailRow label="Tenant Email" value={visit.tenantEmail} />
        <DetailRow label="Tenant Phone" value={visit.tenantPhone} />

        <Divider />

        <DetailRow label="Preferred Date" value={visit.preferredDate} />
        <DetailRow label="Preferred Time" value={visit.preferredTime} />
        <DetailRow label="Reason" value={visit.reason} />
        <DetailRow label="Additional Notes" value={visit.additionalNotes} />
        {visit.ownerNotes && <DetailRow label="Your Notes" value={visit.ownerNotes} />}

        {visit.alternativeSchedules?.length > 0 && (
          <>
            <Divider />
            <Box>
              <Text fontSize="xs" color="gray.600" mb={2}>Alternative Schedules Proposed</Text>
              <VStack align="stretch" spacing={2}>
                {visit.alternativeSchedules.map((alt) => (
                  <Box key={alt.id} bg="gray.50" p={3} borderRadius="md">
                    <Text fontSize="sm" fontWeight="medium">{alt.date} at {alt.time}</Text>
                    {alt.notes && <Text fontSize="xs" color="gray.600">{alt.notes}</Text>}
                  </Box>
                ))}
              </VStack>
            </Box>
          </>
        )}
      </VStack>
    </SidePanel>
  );
};

export default VisitDetailPanel;
