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
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import useRentalStore from '../../../shared/stores/useRentalStore';
import { useAuth } from '../../../app/providers/AuthProvider';
import PageBanner from '../../../shared/components/PageBanner';
import { useContextMenu } from '../../../shared/hooks/useContextMenu';
import ContextMenu from '../../../shared/components/ContextMenu';
import { useMinDisplayTime } from '../../../shared/hooks/useMinDisplayTime';
import { PropertyCardSkeleton } from '../../../shared/components/LoadingState';
import { useAppToast } from '../../../shared/hooks/useAppToast';
import { confirmAction } from '../../../shared/utils/confirm';
import PropertyFormPanel from './components/PropertyFormPanel';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(price);

const PropertyCard = ({ property, contextMenuHandlers }) => (
  <Box
    bg="white"
    borderRadius="lg"
    overflow="hidden"
    border="1px"
    borderColor="gray.200"
    cursor="context-menu"
    onContextMenu={(e) => contextMenuHandlers.onContextMenu(e, property)}
    onTouchStart={(e) => contextMenuHandlers.onTouchStart(e, property)}
    onTouchMove={contextMenuHandlers.onTouchMove}
    onTouchEnd={contextMenuHandlers.onTouchEnd}
  >
    <Box position="relative" h="200px">
      <Image src={property.imageUrl?.[0]} alt={property.title} w="full" h="full" objectFit="cover" />
      <Badge
        position="absolute"
        top={3}
        left={3}
        colorScheme={(property.status || 'active') === 'active' ? 'green' : 'gray'}
        fontSize="xs"
        px={2}
        py={1}
      >
        {property.status || 'active'}
      </Badge>
    </Box>

    <VStack align="start" spacing={3} p={5}>
      <Heading size="sm" noOfLines={1}>{property.title}</Heading>
      <Text fontSize="sm" color="gray.600" noOfLines={2}>{property.description}</Text>
      <HStack justify="space-between" w="full">
        <Text fontSize="lg" fontWeight="bold" color="primary.600">{formatPrice(property.price)}/mo</Text>
        <Badge colorScheme="blue">{property.bedType}</Badge>
      </HStack>
      <HStack spacing={4} fontSize="sm" color="gray.600">
        <Text>📍 {property.city}</Text>
        <Text>👥 {property.availablePerson}</Text>
      </HStack>
    </VStack>
  </Box>
);

const PropertiesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: routePropertyId } = useParams();
  const toast = useAppToast();
  const { user } = useAuth();
  const rentals = useRentalStore((state) => state.rentals) || [];
  const deleteRental = useRentalStore((state) => state.deleteRental);
  const updateRental = useRentalStore((state) => state.updateRental);
  const isLoading = useMinDisplayTime();

  const [panel, setPanel] = useState({ isOpen: false, mode: 'add', propertyId: null });
  const { isOpen: menuOpen, position, activeItem, close: closeMenu, handlers } = useContextMenu();

  const ownerProperties = rentals.filter((r) => r.ownerEmail === user?.email);

  // Deep-linking: /owner/properties/add and /owner/properties/edit/:id
  // auto-open the panel in the right mode, then normalize the URL back to
  // /owner/properties once the panel is closed.
  useEffect(() => {
    if (location.pathname.endsWith('/add')) {
      setPanel({ isOpen: true, mode: 'add', propertyId: null });
    } else if (location.pathname.includes('/edit/') && routePropertyId) {
      setPanel({ isOpen: true, mode: 'edit', propertyId: routePropertyId });
    }
  }, [location.pathname, routePropertyId]);

  const closePanel = () => {
    setPanel((prev) => ({ ...prev, isOpen: false }));
    if (location.pathname !== '/owner/properties') {
      navigate('/owner/properties', { replace: true });
    }
  };

  const openAddPanel = () => setPanel({ isOpen: true, mode: 'add', propertyId: null });
  const openEditPanel = (property) => setPanel({ isOpen: true, mode: 'edit', propertyId: property.id });

  const handleDelete = async (property) => {
    const confirmed = await confirmAction({
      title: 'Delete Property',
      text: `Are you sure you want to delete "${property.title}"? This action cannot be undone.`,
      isDestructive: true,
      confirmButtonText: 'Delete',
    });
    if (!confirmed) return;

    deleteRental(property.id);
    toast({ title: 'Property Deleted', description: `${property.title} has been removed.`, status: 'success' });
  };

  const handleToggleStatus = (property) => {
    const newStatus = (property.status || 'active') === 'active' ? 'inactive' : 'active';
    updateRental(property.id, { status: newStatus });
    toast({ title: 'Status Updated', description: `Property is now ${newStatus}.`, status: 'info' });
  };

  const getRowActions = (property) => [
    { label: 'View Listing', icon: FiEye, onClick: () => navigate(`/listing/${property.id}`) },
    { label: 'Edit Property', icon: FiEdit, onClick: () => openEditPanel(property) },
    {
      label: (property.status || 'active') === 'active' ? 'Deactivate' : 'Activate',
      icon: FiEyeOff,
      onClick: () => handleToggleStatus(property),
    },
    { label: 'Delete Property', icon: FiTrash2, isDestructive: true, onClick: () => handleDelete(property) },
  ];

  return (
    <Box>
      <PageBanner
        title="My Properties"
        subtitle="Manage your property listings"
        actions={
          <Button leftIcon={<Icon as={FiPlus} />} colorScheme="primary" onClick={openAddPanel}>
            Add Property
          </Button>
        }
      />

      {isLoading ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <PropertyCardSkeleton count={3} />
        </SimpleGrid>
      ) : ownerProperties.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {ownerProperties.map((property) => (
            <PropertyCard key={property.id} property={property} contextMenuHandlers={handlers} />
          ))}
        </SimpleGrid>
      ) : (
        <Box bg="white" p={12} borderRadius="lg" textAlign="center" border="1px" borderColor="gray.200">
          <VStack spacing={4}>
            <Text fontSize="4xl">🏠</Text>
            <Heading size="md">No Properties Yet</Heading>
            <Text color="gray.600">Start by adding your first property listing</Text>
            <Button leftIcon={<Icon as={FiPlus} />} colorScheme="primary" onClick={openAddPanel}>
              Add Property
            </Button>
          </VStack>
        </Box>
      )}

      <ContextMenu isOpen={menuOpen} position={position} items={activeItem ? getRowActions(activeItem) : []} onClose={closeMenu} />

      <PropertyFormPanel
        key={`${panel.mode}:${panel.propertyId || 'new'}`}
        mode={panel.mode}
        propertyId={panel.propertyId}
        isOpen={panel.isOpen}
        onClose={closePanel}
      />
    </Box>
  );
};

export default PropertiesPage;
