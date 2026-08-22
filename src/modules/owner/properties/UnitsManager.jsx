import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Icon,
  IconButton,
  Input,
  Select,
  useToast,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import useRentalStore from '../../../shared/stores/useRentalStore';

const emptyDraft = { label: '', price: '', availablePerson: '', status: 'available' };

/**
 * Manages a property's optional sub-units (e.g. individual rooms in a
 * dormitory building priced separately). Each add/edit/delete persists
 * immediately via the store — it doesn't wait on the parent form's Save.
 */
const UnitsManager = ({ rentalId }) => {
  const toast = useToast();
  const rental = useRentalStore((state) => state.getRentalById(rentalId));
  const addUnit = useRentalStore((state) => state.addUnit);
  const updateUnit = useRentalStore((state) => state.updateUnit);
  const deleteUnit = useRentalStore((state) => state.deleteUnit);

  const units = rental?.units || [];
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [isAdding, setIsAdding] = useState(false);

  const startAdd = () => {
    setDraft(emptyDraft);
    setEditingId(null);
    setIsAdding(true);
  };

  const startEdit = (unit) => {
    setDraft({
      label: unit.label,
      price: unit.price,
      availablePerson: unit.availablePerson,
      status: unit.status || 'available',
    });
    setEditingId(unit.id);
    setIsAdding(false);
  };

  const cancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setDraft(emptyDraft);
  };

  const save = () => {
    if (!draft.label.trim() || !draft.price) {
      toast({ title: 'Label and price are required', status: 'warning', duration: 3000 });
      return;
    }

    const payload = {
      label: draft.label.trim(),
      price: parseFloat(draft.price),
      availablePerson: draft.availablePerson ? parseInt(draft.availablePerson, 10) : undefined,
      status: draft.status,
    };

    if (editingId) {
      updateUnit(rentalId, editingId, payload);
    } else {
      addUnit(rentalId, payload);
    }
    cancel();
  };

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Box>
          <Text fontWeight="medium">Units (Optional)</Text>
          <Text fontSize="xs" color="gray.500">
            Add individual rooms/units with their own price and occupancy.
          </Text>
        </Box>
        {!isAdding && !editingId && (
          <Button size="sm" leftIcon={<Icon as={FiPlus} />} onClick={startAdd}>
            Add Unit
          </Button>
        )}
      </HStack>

      <VStack align="stretch" spacing={2}>
        {units.map((unit) =>
          editingId === unit.id ? (
            <UnitEditRow key={unit.id} draft={draft} setDraft={setDraft} onSave={save} onCancel={cancel} />
          ) : (
            <HStack
              key={unit.id}
              justify="space-between"
              p={3}
              bg="gray.50"
              borderRadius="md"
              border="1px"
              borderColor="gray.200"
            >
              <HStack spacing={3}>
                <Text fontWeight="medium" fontSize="sm">{unit.label}</Text>
                <Text fontSize="sm" color="gray.600">₱{unit.price?.toLocaleString()}/mo</Text>
                {unit.availablePerson && (
                  <Text fontSize="xs" color="gray.500">Up to {unit.availablePerson}</Text>
                )}
                <Badge colorScheme={unit.status === 'occupied' ? 'red' : 'green'} fontSize="2xs">
                  {unit.status || 'available'}
                </Badge>
              </HStack>
              <HStack spacing={1}>
                <IconButton
                  icon={<Icon as={FiEdit2} />}
                  size="xs"
                  variant="ghost"
                  aria-label={`Edit ${unit.label}`}
                  onClick={() => startEdit(unit)}
                />
                <IconButton
                  icon={<Icon as={FiTrash2} />}
                  size="xs"
                  variant="ghost"
                  colorScheme="red"
                  aria-label={`Delete ${unit.label}`}
                  onClick={() => deleteUnit(rentalId, unit.id)}
                />
              </HStack>
            </HStack>
          )
        )}

        {isAdding && <UnitEditRow draft={draft} setDraft={setDraft} onSave={save} onCancel={cancel} />}

        {units.length === 0 && !isAdding && (
          <Text fontSize="sm" color="gray.500">
            No units added — this property is listed as a single unit.
          </Text>
        )}
      </VStack>
    </Box>
  );
};

const UnitEditRow = ({ draft, setDraft, onSave, onCancel }) => (
  <HStack p={3} bg="primary.50" borderRadius="md" border="1px" borderColor="primary.200" spacing={2} wrap="wrap">
    <Input
      size="sm"
      placeholder="Label (e.g. Room 101)"
      value={draft.label}
      onChange={(e) => setDraft({ ...draft, label: e.target.value })}
      maxW="180px"
    />
    <Input
      size="sm"
      type="number"
      placeholder="Price/mo"
      value={draft.price}
      onChange={(e) => setDraft({ ...draft, price: e.target.value })}
      maxW="120px"
    />
    <Input
      size="sm"
      type="number"
      placeholder="Max occupancy"
      value={draft.availablePerson}
      onChange={(e) => setDraft({ ...draft, availablePerson: e.target.value })}
      maxW="130px"
    />
    <Select
      size="sm"
      value={draft.status}
      onChange={(e) => setDraft({ ...draft, status: e.target.value })}
      maxW="130px"
    >
      <option value="available">Available</option>
      <option value="occupied">Occupied</option>
    </Select>
    <IconButton icon={<Icon as={FiCheck} />} size="sm" colorScheme="green" aria-label="Save unit" onClick={onSave} />
    <IconButton icon={<Icon as={FiX} />} size="sm" variant="ghost" aria-label="Cancel" onClick={onCancel} />
  </HStack>
);

export default UnitsManager;
