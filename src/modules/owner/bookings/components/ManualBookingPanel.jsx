import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  Checkbox,
  Text,
  Divider,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import SidePanel from '../../../../shared/components/SidePanel';
import useBookingStore, { DURATION_TYPE } from '../../../../shared/stores/useBookingStore';
import { useAppToast } from '../../../../shared/hooks/useAppToast';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { FiCalendar } from 'react-icons/fi';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(price);

const EMPTY_FORM = {
  propertyId: '',
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  checkIn: '',
  checkOut: '',
  durationType: DURATION_TYPE.SIX_MONTHS,
  specialRequests: '',
  paymentReceived: false,
};

/**
 * Manual Booking side panel — lets an owner record a walk-in/offline
 * tenant directly (no owner-initiated booking entry point existed before).
 * Created bookings are auto-approved (the owner isn't waiting on their own
 * approval), and optionally marked paid/verified in the same step.
 */
const ManualBookingPanel = ({ isOpen, onClose, properties, ownerEmail, ownerName }) => {
  const toast = useAppToast();
  const { user } = useAuth();
  const createBooking = useBookingStore((state) => state.createBooking);
  const approveBooking = useBookingStore((state) => state.approveBooking);
  const verifyPayment = useBookingStore((state) => state.verifyPayment);
  const calculatePrice = useBookingStore((state) => state.calculatePrice);

  const [form, setForm] = useState(EMPTY_FORM);

  const selectedProperty = properties.find((p) => p.id === form.propertyId);

  const priceBreakdown = useMemo(() => {
    if (!selectedProperty || !form.checkIn || !form.checkOut) return null;
    const checkIn = new Date(form.checkIn);
    const checkOut = new Date(form.checkOut);
    if (checkOut <= checkIn) return null;
    return calculatePrice(selectedProperty, checkIn, checkOut, form.durationType);
  }, [selectedProperty, form.checkIn, form.checkOut, form.durationType, calculatePrice]);

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const resetAndClose = () => {
    setForm(EMPTY_FORM);
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedProperty) {
      toast({ title: 'Select a property', status: 'warning' });
      return;
    }
    if (!form.guestName || !form.guestEmail || !form.guestPhone) {
      toast({ title: 'Tenant name, email, and phone are required', status: 'warning' });
      return;
    }
    if (!priceBreakdown) {
      toast({ title: 'Enter valid check-in / check-out dates', status: 'warning' });
      return;
    }

    const booking = createBooking({
      propertyId: selectedProperty.id,
      propertyTitle: selectedProperty.title,
      propertyImage: selectedProperty.imageUrl?.[0],
      propertyAddress: `${selectedProperty.address}, ${selectedProperty.city}`,
      ownerEmail,
      ownerName,
      userId: null,
      guestName: form.guestName,
      guestEmail: form.guestEmail,
      guestPhone: form.guestPhone,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      specialRequests: form.specialRequests,
      durationType: form.durationType,
      priceBreakdown,
      totalAmount: priceBreakdown.total,
      depositAmount: priceBreakdown.depositAmount,
      totalWithDeposit: priceBreakdown.totalWithDeposit,
      source: 'manual',
    });

    approveBooking(booking.id, 'Added by owner (walk-in booking)');

    if (form.paymentReceived) {
      verifyPayment(booking.id, { verifiedBy: user?.name, verifiedAt: new Date().toISOString() });
    }

    toast({ title: 'Booking Added', description: `${form.guestName}'s booking has been recorded.`, status: 'success' });
    resetAndClose();
  };

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={resetAndClose}
      title="Add Manual Booking"
      icon={FiCalendar}
      footer={
        <HStack spacing={3} w="full">
          <Button variant="outline" onClick={resetAndClose} flex={1}>Cancel</Button>
          <Button colorScheme="primary" onClick={handleSubmit} flex={1}>Save Booking</Button>
        </HStack>
      }
    >
      <VStack spacing={5} align="stretch">
        <Text fontSize="sm" color="gray.600">
          For walk-in or offline tenants. This booking is created already approved.
        </Text>

        <FormControl isRequired>
          <FormLabel>Property</FormLabel>
          <Select placeholder="Select a property" value={form.propertyId} onChange={(e) => setField('propertyId', e.target.value)}>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </Select>
        </FormControl>

        <Divider />

        <FormControl isRequired>
          <FormLabel>Tenant Name</FormLabel>
          <Input value={form.guestName} onChange={(e) => setField('guestName', e.target.value)} placeholder="Juan Dela Cruz" />
        </FormControl>

        <HStack spacing={4} align="start">
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={form.guestEmail} onChange={(e) => setField('guestEmail', e.target.value)} placeholder="tenant@email.com" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Phone</FormLabel>
            <Input value={form.guestPhone} onChange={(e) => setField('guestPhone', e.target.value)} placeholder="+63 912 345 6789" />
          </FormControl>
        </HStack>

        <Divider />

        <HStack spacing={4} align="start">
          <FormControl isRequired>
            <FormLabel>Check-in</FormLabel>
            <Input type="date" value={form.checkIn} onChange={(e) => setField('checkIn', e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Check-out</FormLabel>
            <Input type="date" value={form.checkOut} onChange={(e) => setField('checkOut', e.target.value)} />
          </FormControl>
        </HStack>

        <FormControl>
          <FormLabel>Duration Type</FormLabel>
          <Select value={form.durationType} onChange={(e) => setField('durationType', e.target.value)}>
            <option value={DURATION_TYPE.DAILY}>Daily</option>
            <option value={DURATION_TYPE.SIX_MONTHS}>6 Months</option>
            <option value={DURATION_TYPE.ONE_YEAR}>1 Year</option>
          </Select>
        </FormControl>

        {priceBreakdown && (
          <Box bg="gray.50" p={4} borderRadius="lg">
            <HStack justify="space-between" mb={1}>
              <Text fontSize="sm" color="gray.600">Total (incl. deposit)</Text>
              <Text fontSize="lg" fontWeight="bold" color="primary.600">{formatPrice(priceBreakdown.totalWithDeposit)}</Text>
            </HStack>
            <Text fontSize="xs" color="gray.500">{priceBreakdown.days} days • {priceBreakdown.durationType}</Text>
          </Box>
        )}

        <FormControl>
          <FormLabel>Special Requests</FormLabel>
          <Textarea value={form.specialRequests} onChange={(e) => setField('specialRequests', e.target.value)} rows={3} />
        </FormControl>

        <Checkbox isChecked={form.paymentReceived} onChange={(e) => setField('paymentReceived', e.target.checked)}>
          Payment already received
        </Checkbox>
      </VStack>
    </SidePanel>
  );
};

export default ManualBookingPanel;
