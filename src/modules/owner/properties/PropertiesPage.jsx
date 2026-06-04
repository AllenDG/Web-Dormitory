import {
  Box,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  SimpleGrid,
  Image,
  Badge,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useToast,
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiTrash2, FiMoreVertical, FiEye, FiEyeOff } from 'react-icons/fi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useRentalStore from '../../../shared/stores/useRentalStore';

/**
 * Properties Management Page
 * Owner can view, add, edit, delete, and toggle property status
 */

const PropertyCard = ({ property, onEdit, onDelete, onToggleStatus }) => {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Box
      bg="white"
      borderRadius="lg"
      overflow="hidden"
      border="1px"
      borderColor="gray.200"
      transition="all 0.2s"
      _hover={{ boxShadow: 'md' }}
    >
      {/* Image */}
      <Box position="relative" h="200px">
        <Image
          src={property.imageUrl[0]}
          alt={property.title}
          w="full"
          h="full"
          objectFit="cover"
        />
        <Badge
          position="absolute"
          top={3}
          left={3}
          colorScheme={property.status === 'active' ? 'green' : 'gray'}
          fontSize="xs"
          px={2}
          py={1}
        >
          {property.status || 'Active'}
        </Badge>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<Icon as={FiMoreVertical} />}
            position="absolute"
            top={3}
            right={3}
            size="sm"
            bg="whiteAlpha.900"
            _hover={{ bg: 'white' }}
          />
          <MenuList>
            <MenuItem icon={<Icon as={FiEye} />} onClick={() => navigate(`/listing/${property.id}`)}>
              View Listing
            </MenuItem>
            <MenuItem icon={<Icon as={FiEdit} />} onClick={() => onEdit(property)}>
              Edit Property
            </MenuItem>
            <MenuItem icon={<Icon as={FiEyeOff} />} onClick={() => onToggleStatus(property)}>
              {property.status === 'active' ? 'Deactivate' : 'Activate'}
            </MenuItem>
            <MenuItem icon={<Icon as={FiTrash2} />} color="error.500" onClick={() => onDelete(property)}>
              Delete Property
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>

      {/* Content */}
      <VStack align="start" spacing={3} p={5}>
        <Heading size="sm" noOfLines={1}>
          {property.title}
        </Heading>
        <Text fontSize="sm" color="gray.600" noOfLines={2}>
          {property.description}
        </Text>
        <HStack justify="space-between" w="full">
          <Text fontSize="lg" fontWeight="bold" color="primary.600">
            {formatPrice(property.price)}/mo
          </Text>
          <Badge colorScheme="blue">{property.bedType}</Badge>
        </HStack>
        <HStack spacing={4} fontSize="sm" color="gray.600">
          <Text>📍 {property.city}</Text>
          <Text>👥 {property.availablePerson}</Text>
        </HStack>
      </VStack>
    </Box>
  );
};

const PropertiesPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { rentals = [] } = useRentalStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Mock: Filter properties by owner (in real app, filter by logged-in owner)
  const ownerProperties = Array.isArray(rentals) ? rentals.slice(0, 5) : []; // Mock owner's properties

  const handleEdit = (property) => {
    navigate(`/owner/properties/edit/${property.id}`);
  };

  const handleDelete = (property) => {
    setSelectedProperty(property);
    onOpen();
  };

  const confirmDelete = () => {
    toast({
      title: 'Property Deleted',
      description: `${selectedProperty.title} has been removed.`,
      status: 'success',
      duration: 3000,
    });
    onClose();
    setSelectedProperty(null);
  };

  const handleToggleStatus = (property) => {
    const newStatus = property.status === 'active' ? 'inactive' : 'active';
    toast({
      title: 'Status Updated',
      description: `Property is now ${newStatus}.`,
      status: 'info',
      duration: 3000,
    });
  };

  return (
    <Box>
      {/* Page Header */}
      <HStack justify="space-between" mb={8}>
        <VStack align="start" spacing={2}>
          <Heading size="lg">My Properties</Heading>
          <Text color="gray.600">
            Manage your property listings
          </Text>
        </VStack>
        <Button
          leftIcon={<Icon as={FiPlus} />}
          colorScheme="primary"
          onClick={() => navigate('/owner/properties/add')}
        >
          Add Property
        </Button>
      </HStack>

      {/* Stats */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200">
          <Text fontSize="sm" color="gray.600" mb={1}>Total Properties</Text>
          <Text fontSize="3xl" fontWeight="bold">{ownerProperties.length}</Text>
        </Box>
        <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200">
          <Text fontSize="sm" color="gray.600" mb={1}>Active Listings</Text>
          <Text fontSize="3xl" fontWeight="bold" color="success.500">
            {ownerProperties.filter(p => p.status !== 'inactive').length}
          </Text>
        </Box>
        <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200">
          <Text fontSize="sm" color="gray.600" mb={1}>Total Views</Text>
          <Text fontSize="3xl" fontWeight="bold" color="primary.600">1,234</Text>
        </Box>
      </SimpleGrid>

      {/* Properties Grid */}
      {ownerProperties.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {ownerProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Box
          bg="white"
          p={12}
          borderRadius="lg"
          textAlign="center"
          border="1px"
          borderColor="gray.200"
        >
          <VStack spacing={4}>
            <Text fontSize="4xl">🏠</Text>
            <Heading size="md">No Properties Yet</Heading>
            <Text color="gray.600">
              Start by adding your first property listing
            </Text>
            <Button
              leftIcon={<Icon as={FiPlus} />}
              colorScheme="primary"
              onClick={() => navigate('/owner/properties/add')}
            >
              Add Property
            </Button>
          </VStack>
        </Box>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Property</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete <strong>{selectedProperty?.title}</strong>? 
              This action cannot be undone.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={confirmDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PropertiesPage;
