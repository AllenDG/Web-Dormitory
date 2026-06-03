import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  Badge,
  SimpleGrid,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from '@chakra-ui/react';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiMoreVertical,
  FiHome,
  FiUser,
} from 'react-icons/fi';
import { useState } from 'react';

/**
 * Property Units Manager Component
 * Manage individual units within a property (rooms, beds, spaces)
 */

const UnitCard = ({ unit, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'green';
      case 'occupied':
        return 'blue';
      case 'maintenance':
        return 'orange';
      case 'reserved':
        return 'purple';
      default:
        return 'gray';
    }
  };

  return (
    <Box
      bg="white"
      p={5}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
      transition="all 0.2s"
      _hover={{ boxShadow: 'md' }}
    >
      <HStack justify="space-between" mb={3}>
        <HStack spacing={3}>
          <Box
            bg="primary.50"
            p={2}
            borderRadius="lg"
          >
            <Icon as={FiHome} boxSize={5} color="primary.600" />
          </Box>
          <VStack align="start" spacing={0}>
            <Text fontWeight="semibold">{unit.name}</Text>
            <Text fontSize="xs" color="gray.600">{unit.type}</Text>
          </VStack>
        </HStack>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<Icon as={FiMoreVertical} />}
            size="sm"
            variant="ghost"
          />
          <MenuList>
            <MenuItem icon={<Icon as={FiEdit} />} onClick={() => onEdit(unit)}>
              Edit Unit
            </MenuItem>
            <MenuItem
              icon={<Icon as={FiTrash2} />}
              color="error.500"
              onClick={() => onDelete(unit)}
            >
              Delete Unit
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      <VStack align="stretch" spacing={2}>
        <HStack justify="space-between">
          <Text fontSize="sm" color="gray.600">Status:</Text>
          <Badge colorScheme={getStatusColor(unit.status)} fontSize="xs">
            {unit.status}
          </Badge>
        </HStack>

        {unit.tenant && (
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.600">Tenant:</Text>
            <HStack spacing={1}>
              <Icon as={FiUser} boxSize={3} color="gray.500" />
              <Text fontSize="sm">{unit.tenant}</Text>
            </HStack>
          </HStack>
        )}

        <HStack justify="space-between">
          <Text fontSize="sm" color="gray.600">Price:</Text>
          <Text fontSize="sm" fontWeight="semibold" color="primary.600">
            ₱{unit.price.toLocaleString()}/mo
          </Text>
        </HStack>

        <HStack justify="space-between">
          <Text fontSize="sm" color="gray.600">Floor:</Text>
          <Text fontSize="sm">{unit.floor}</Text>
        </HStack>
      </VStack>
    </Box>
  );
};

const PropertyUnitsManager = ({ propertyId }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Mock data - replace with actual API
  const [units, setUnits] = useState([
    {
      id: 1,
      name: 'Unit 101',
      type: 'Single Room',
      status: 'occupied',
      tenant: 'Juan Dela Cruz',
      price: 8000,
      floor: '1st Floor',
    },
    {
      id: 2,
      name: 'Unit 102',
      type: 'Single Room',
      status: 'available',
      tenant: null,
      price: 8000,
      floor: '1st Floor',
    },
    {
      id: 3,
      name: 'Unit 201',
      type: 'Double Room',
      status: 'occupied',
      tenant: 'Maria Santos',
      price: 12000,
      floor: '2nd Floor',
    },
    {
      id: 4,
      name: 'Unit 202',
      type: 'Double Room',
      status: 'maintenance',
      tenant: null,
      price: 12000,
      floor: '2nd Floor',
    },
    {
      id: 5,
      name: 'Unit 301',
      type: 'Studio',
      status: 'reserved',
      tenant: 'Pedro Garcia',
      price: 15000,
      floor: '3rd Floor',
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: 'available',
    price: '',
    floor: '',
  });

  const handleAdd = () => {
    setSelectedUnit(null);
    setFormData({
      name: '',
      type: '',
      status: 'available',
      price: '',
      floor: '',
    });
    setIsEditing(false);
    onOpen();
  };

  const handleEdit = (unit) => {
    setSelectedUnit(unit);
    setFormData({
      name: unit.name,
      type: unit.type,
      status: unit.status,
      price: unit.price,
      floor: unit.floor,
    });
    setIsEditing(true);
    onOpen();
  };

  const handleDelete = (unit) => {
    if (window.confirm(`Delete ${unit.name}?`)) {
      setUnits(units.filter((u) => u.id !== unit.id));
      toast({
        title: 'Unit Deleted',
        description: `${unit.name} has been removed.`,
        status: 'success',
        duration: 3000,
      });
    }
  };

  const handleSubmit = () => {
    if (isEditing) {
      setUnits(
        units.map((u) =>
          u.id === selectedUnit.id ? { ...u, ...formData } : u
        )
      );
      toast({
        title: 'Unit Updated',
        description: `${formData.name} has been updated.`,
        status: 'success',
        duration: 3000,
      });
    } else {
      const newUnit = {
        id: units.length + 1,
        ...formData,
        price: parseInt(formData.price),
        tenant: null,
      };
      setUnits([...units, newUnit]);
      toast({
        title: 'Unit Added',
        description: `${formData.name} has been created.`,
        status: 'success',
        duration: 3000,
      });
    }
    onClose();
  };

  const statusCounts = {
    available: units.filter((u) => u.status === 'available').length,
    occupied: units.filter((u) => u.status === 'occupied').length,
    maintenance: units.filter((u) => u.status === 'maintenance').length,
    reserved: units.filter((u) => u.status === 'reserved').length,
  };

  return (
    <Box>
      {/* Header */}
      <HStack justify="space-between" mb={6}>
        <Box>
          <Heading size="md" mb={1}>
            Property Units
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Manage individual rooms and spaces
          </Text>
        </Box>
        <Button
          leftIcon={<Icon as={FiPlus} />}
          colorScheme="primary"
          size="sm"
          onClick={handleAdd}
        >
          Add Unit
        </Button>
      </HStack>

      {/* Summary Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
        <Box bg="green.50" p={4} borderRadius="lg" textAlign="center">
          <Text fontSize="2xl" fontWeight="bold" color="green.600">
            {statusCounts.available}
          </Text>
          <Text fontSize="xs" color="gray.600">Available</Text>
        </Box>
        <Box bg="blue.50" p={4} borderRadius="lg" textAlign="center">
          <Text fontSize="2xl" fontWeight="bold" color="blue.600">
            {statusCounts.occupied}
          </Text>
          <Text fontSize="xs" color="gray.600">Occupied</Text>
        </Box>
        <Box bg="orange.50" p={4} borderRadius="lg" textAlign="center">
          <Text fontSize="2xl" fontWeight="bold" color="orange.600">
            {statusCounts.maintenance}
          </Text>
          <Text fontSize="xs" color="gray.600">Maintenance</Text>
        </Box>
        <Box bg="purple.50" p={4} borderRadius="lg" textAlign="center">
          <Text fontSize="2xl" fontWeight="bold" color="purple.600">
            {statusCounts.reserved}
          </Text>
          <Text fontSize="xs" color="gray.600">Reserved</Text>
        </Box>
      </SimpleGrid>

      {/* Units Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {units.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </SimpleGrid>

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditing ? 'Edit Unit' : 'Add New Unit'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Unit Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Unit 101"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm">Unit Type</FormLabel>
                <Select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option value="">Select type</option>
                  <option value="Single Room">Single Room</option>
                  <option value="Double Room">Double Room</option>
                  <option value="Studio">Studio</option>
                  <option value="Shared Room">Shared Room</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm">Status</FormLabel>
                <Select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="reserved">Reserved</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm">Price (Monthly)</FormLabel>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="8000"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm">Floor</FormLabel>
                <Input
                  value={formData.floor}
                  onChange={(e) =>
                    setFormData({ ...formData, floor: e.target.value })
                  }
                  placeholder="e.g., 1st Floor"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="primary" onClick={handleSubmit}>
              {isEditing ? 'Update' : 'Add'} Unit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PropertyUnitsManager;
