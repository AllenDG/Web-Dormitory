import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  Checkbox,
  Button,
  Heading,
  SimpleGrid,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import SidePanel from '../../../../shared/components/SidePanel';
import useHouseRulesStore, { DEFAULT_RULES } from '../../../../shared/stores/useHouseRulesStore';
import { useAppToast } from '../../../../shared/hooks/useAppToast';
import { FiFileText } from 'react-icons/fi';

const buildDefaultDraft = () => ({
  checkInTime: '14:00',
  checkOutTime: '12:00',
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  guestPolicy: { allowed: true, maxGuests: 2, overnightAllowed: false },
  petPolicy: { allowed: false, deposit: 0 },
  smokingPolicy: { allowed: false },
  parkingPolicy: { available: false, spaces: 0, fee: 0 },
  additionalPolicies: '',
  do: [...DEFAULT_RULES.DO],
  dont: [...DEFAULT_RULES.DONT],
});

/**
 * Per-property house rules editor — useHouseRulesStore's write actions
 * (setPropertyRules etc.) existed with zero owner-facing UI before this;
 * every property silently used the hardcoded DEFAULT_RULES forever.
 * Kept as its own panel rather than folded into PropertyFormPanel, which
 * is already a large form.
 */
const HouseRulesPanel = ({ isOpen, onClose, propertyId, propertyTitle }) => {
  const toast = useAppToast();
  const getPropertyRules = useHouseRulesStore((state) => state.getPropertyRules);
  const setPropertyRules = useHouseRulesStore((state) => state.setPropertyRules);

  const [draft, setDraft] = useState(buildDefaultDraft());

  useEffect(() => {
    if (!isOpen || !propertyId) return;
    const existing = getPropertyRules(propertyId);
    setDraft(
      existing
        ? {
            ...buildDefaultDraft(),
            ...existing,
            guestPolicy: { ...buildDefaultDraft().guestPolicy, ...existing.guestPolicy },
            petPolicy: { ...buildDefaultDraft().petPolicy, ...existing.petPolicy },
            smokingPolicy: { ...buildDefaultDraft().smokingPolicy, ...existing.smokingPolicy },
            parkingPolicy: { ...buildDefaultDraft().parkingPolicy, ...existing.parkingPolicy },
          }
        : buildDefaultDraft()
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, propertyId]);

  const setField = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));
  const setNested = (group, field, value) =>
    setDraft((prev) => ({ ...prev, [group]: { ...prev[group], [field]: value } }));

  const handleSave = () => {
    setPropertyRules(propertyId, {
      ...draft,
      do: draft.do.filter(Boolean),
      dont: draft.dont.filter(Boolean),
    });
    toast({ title: 'House Rules Saved', description: `Updated rules for ${propertyTitle}.`, status: 'success' });
    onClose();
  };

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="House Rules"
      icon={FiFileText}
      size="lg"
      footer={
        <HStack spacing={3} w="full">
          <Button variant="outline" onClick={onClose} flex={1}>Cancel</Button>
          <Button colorScheme="primary" onClick={handleSave} flex={1}>Save Rules</Button>
        </HStack>
      }
    >
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="sm" mb={4}>Check-in / Check-out</Heading>
          <SimpleGrid columns={2} spacing={4}>
            <FormControl>
              <FormLabel fontSize="sm">Check-in Time</FormLabel>
              <Input type="time" value={draft.checkInTime} onChange={(e) => setField('checkInTime', e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Check-out Time</FormLabel>
              <Input type="time" value={draft.checkOutTime} onChange={(e) => setField('checkOutTime', e.target.value)} />
            </FormControl>
          </SimpleGrid>
        </Box>

        <Box>
          <Heading size="sm" mb={4}>Quiet Hours</Heading>
          <SimpleGrid columns={2} spacing={4}>
            <FormControl>
              <FormLabel fontSize="sm">Starts</FormLabel>
              <Input type="time" value={draft.quietHoursStart} onChange={(e) => setField('quietHoursStart', e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Ends</FormLabel>
              <Input type="time" value={draft.quietHoursEnd} onChange={(e) => setField('quietHoursEnd', e.target.value)} />
            </FormControl>
          </SimpleGrid>
        </Box>

        <Box>
          <Heading size="sm" mb={4}>Guest Policy</Heading>
          <VStack align="stretch" spacing={3}>
            <Checkbox isChecked={draft.guestPolicy.allowed} onChange={(e) => setNested('guestPolicy', 'allowed', e.target.checked)}>
              Guests allowed
            </Checkbox>
            {draft.guestPolicy.allowed && (
              <>
                <FormControl>
                  <FormLabel fontSize="sm">Max Guests</FormLabel>
                  <NumberInput min={0} value={draft.guestPolicy.maxGuests} onChange={(val) => setNested('guestPolicy', 'maxGuests', Number(val))}>
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <Checkbox isChecked={draft.guestPolicy.overnightAllowed} onChange={(e) => setNested('guestPolicy', 'overnightAllowed', e.target.checked)}>
                  Overnight guests allowed
                </Checkbox>
              </>
            )}
          </VStack>
        </Box>

        <SimpleGrid columns={2} spacing={6}>
          <Box>
            <Heading size="sm" mb={4}>Pet Policy</Heading>
            <VStack align="stretch" spacing={3}>
              <Checkbox isChecked={draft.petPolicy.allowed} onChange={(e) => setNested('petPolicy', 'allowed', e.target.checked)}>
                Pets allowed
              </Checkbox>
              {draft.petPolicy.allowed && (
                <FormControl>
                  <FormLabel fontSize="sm">Pet Deposit (₱)</FormLabel>
                  <NumberInput min={0} value={draft.petPolicy.deposit} onChange={(val) => setNested('petPolicy', 'deposit', Number(val))}>
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              )}
            </VStack>
          </Box>

          <Box>
            <Heading size="sm" mb={4}>Smoking Policy</Heading>
            <Checkbox isChecked={draft.smokingPolicy.allowed} onChange={(e) => setNested('smokingPolicy', 'allowed', e.target.checked)}>
              Smoking allowed
            </Checkbox>
          </Box>
        </SimpleGrid>

        <Box>
          <Heading size="sm" mb={4}>Parking Policy</Heading>
          <VStack align="stretch" spacing={3}>
            <Checkbox isChecked={draft.parkingPolicy.available} onChange={(e) => setNested('parkingPolicy', 'available', e.target.checked)}>
              Parking available
            </Checkbox>
            {draft.parkingPolicy.available && (
              <SimpleGrid columns={2} spacing={4}>
                <FormControl>
                  <FormLabel fontSize="sm">Spaces</FormLabel>
                  <NumberInput min={0} value={draft.parkingPolicy.spaces} onChange={(val) => setNested('parkingPolicy', 'spaces', Number(val))}>
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm">Fee (₱/month)</FormLabel>
                  <NumberInput min={0} value={draft.parkingPolicy.fee} onChange={(val) => setNested('parkingPolicy', 'fee', Number(val))}>
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </SimpleGrid>
            )}
          </VStack>
        </Box>

        <Box>
          <Heading size="sm" mb={4}>Do&apos;s (one per line)</Heading>
          <Textarea rows={4} value={draft.do.join('\n')} onChange={(e) => setField('do', e.target.value.split('\n'))} />
        </Box>

        <Box>
          <Heading size="sm" mb={4}>Don&apos;ts (one per line)</Heading>
          <Textarea rows={4} value={draft.dont.join('\n')} onChange={(e) => setField('dont', e.target.value.split('\n'))} />
        </Box>

        <FormControl>
          <FormLabel fontSize="sm">Additional Policies</FormLabel>
          <Textarea rows={3} value={draft.additionalPolicies} onChange={(e) => setField('additionalPolicies', e.target.value)} />
        </FormControl>
      </VStack>
    </SidePanel>
  );
};

export default HouseRulesPanel;
