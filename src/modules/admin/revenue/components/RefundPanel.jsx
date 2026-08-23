import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Textarea,
  Button,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import SidePanel from '../../../../shared/components/SidePanel';
import useBookingStore from '../../../../shared/stores/useBookingStore';
import useAuditLogStore from '../../../../shared/stores/useAuditLogStore';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { useAppToast } from '../../../../shared/hooks/useAppToast';
import { FiDollarSign } from 'react-icons/fi';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(price);

/**
 * Refund side panel — the bypass tier for Revenue. Admin unilaterally
 * refunds a booking; owners can't even do this themselves today (no
 * refund action was surfaced anywhere before this).
 *
 * Props: { booking, isOpen, onClose }
 */
const RefundPanel = ({ booking, isOpen, onClose }) => {
  const toast = useAppToast();
  const { user: actor } = useAuth();
  const refundBooking = useBookingStore((state) => state.refundBooking);
  const logAction = useAuditLogStore((state) => state.logAction);

  const defaultAmount = booking ? (booking.totalWithDeposit ?? booking.totalAmount ?? 0) : 0;
  const [refundAmount, setRefundAmount] = useState(defaultAmount);
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    if (isOpen && booking) {
      setRefundAmount(booking.totalWithDeposit ?? booking.totalAmount ?? 0);
      setRefundReason('');
    }
  }, [isOpen, booking]);

  const handleSubmit = () => {
    if (!refundReason) {
      toast({ title: 'A refund reason is required', status: 'warning' });
      return;
    }

    refundBooking(booking.id, { refundAmount: Number(refundAmount), refundReason });
    logAction({ actorEmail: actor?.email, actorName: actor?.name, action: 'revenue.refunded', target: booking.propertyTitle || booking.id, details: `Refunded ${formatPrice(refundAmount)}` });
    toast({ title: 'Refund Issued', description: `${formatPrice(refundAmount)} refunded for ${booking.propertyTitle || 'this booking'}.`, status: 'success' });
    onClose();
  };

  if (!booking) return null;

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="Issue Refund"
      icon={FiDollarSign}
      footer={
        <HStack spacing={3} w="full">
          <Button variant="outline" onClick={onClose} flex={1}>Cancel</Button>
          <Button colorScheme="primary" onClick={handleSubmit} flex={1}>Issue Refund</Button>
        </HStack>
      }
    >
      <VStack spacing={5} align="stretch">
        <Text fontSize="sm" color="gray.600">
          Refunding booking for <strong>{booking.propertyTitle}</strong> ({booking.guestName}).
        </Text>

        <FormControl isRequired>
          <FormLabel>Refund Amount (₱)</FormLabel>
          <NumberInput min={0} value={refundAmount} onChange={(_, val) => setRefundAmount(val)}>
            <NumberInputField />
          </NumberInput>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Reason</FormLabel>
          <Textarea value={refundReason} onChange={(e) => setRefundReason(e.target.value)} rows={4} placeholder="Why is this booking being refunded?" />
        </FormControl>
      </VStack>
    </SidePanel>
  );
};

export default RefundPanel;
