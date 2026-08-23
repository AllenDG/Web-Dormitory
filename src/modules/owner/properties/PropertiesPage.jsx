import { Box, Image, HStack, Text, Badge, Icon, Select } from '@chakra-ui/react';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff, FiFileText } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import useRentalStore from '../../../shared/stores/useRentalStore';
import { useAuth } from '../../../app/providers/AuthProvider';
import PageBanner from '../../../shared/components/PageBanner';
import Button from '../../../shared/components/Button';
import DataTable from '../../../shared/components/DataTable';
import TableToolbar from '../../../shared/components/TableToolbar';
import { useMinDisplayTime } from '../../../shared/hooks/useMinDisplayTime';
import { TableSkeleton } from '../../../shared/components/LoadingState';
import { useAppToast } from '../../../shared/hooks/useAppToast';
import { confirmAction } from '../../../shared/utils/confirm';
import PropertyFormPanel from './components/PropertyFormPanel';
import HouseRulesPanel from './components/HouseRulesPanel';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(price);

const STATUS_COLORS = { active: 'green', inactive: 'gray' };
const MODERATION_LABELS = { approved: 'Approved', rejected: 'Rejected', pending: 'Pending Review' };
const MODERATION_COLORS = { approved: 'green', rejected: 'red', pending: 'yellow' };

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

  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [moderationFilter, setModerationFilter] = useState('all');
  const [panel, setPanel] = useState({ isOpen: false, mode: 'add', propertyId: null });
  const [rulesPanel, setRulesPanel] = useState({ isOpen: false, propertyId: null, propertyTitle: '' });

  const ownerProperties = rentals
    .filter((r) => r.ownerEmail === user?.email)
    .map((r) => ({
      ...r,
      status: r.status || 'active',
      moderationStatus: r.moderationStatus || 'approved',
    }))
    .filter((property) => {
      const matchesSearch = !searchQuery || property.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
      const matchesModeration = moderationFilter === 'all' || property.moderationStatus === moderationFilter;
      return matchesSearch && matchesStatus && matchesModeration;
    });

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
  const openRulesPanel = (property) => setRulesPanel({ isOpen: true, propertyId: property.id, propertyTitle: property.title });
  const closeRulesPanel = () => setRulesPanel((prev) => ({ ...prev, isOpen: false }));

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
    const newStatus = property.status === 'active' ? 'inactive' : 'active';
    updateRental(property.id, { status: newStatus });
    toast({ title: 'Status Updated', description: `Property is now ${newStatus}.`, status: 'info' });
  };

  const columns = [
    {
      key: 'title',
      label: 'Property',
      sortable: true,
      render: (p) => (
        <HStack>
          <Image src={p.imageUrl?.[0]} alt={p.title} boxSize="40px" borderRadius="md" objectFit="cover" />
          <Text fontWeight="semibold" fontSize="sm" noOfLines={1} maxW="240px">{p.title}</Text>
        </HStack>
      ),
    },
    { key: 'city', label: 'Location', sortable: true },
    { key: 'price', label: 'Price', sortable: true, render: (p) => `${formatPrice(p.price)}/mo` },
    { key: 'status', label: 'Status', sortable: true, render: (p) => <Badge colorScheme={STATUS_COLORS[p.status]} borderRadius="md">{p.status}</Badge> },
    {
      key: 'moderationStatus',
      label: 'Listing Status',
      sortable: true,
      render: (p) => (
        <Box>
          <Badge colorScheme={MODERATION_COLORS[p.moderationStatus]} borderRadius="md">{MODERATION_LABELS[p.moderationStatus]}</Badge>
          {p.moderationStatus === 'rejected' && p.rejectionReason && (
            <Text fontSize="xs" color="error.600" mt={1} noOfLines={1} maxW="200px">{p.rejectionReason}</Text>
          )}
        </Box>
      ),
    },
  ];

  const getRowActions = (property) => [
    { label: 'View Listing', icon: FiEye, onClick: () => navigate(`/listing/${property.id}`) },
    { label: 'Edit Property', icon: FiEdit, onClick: () => openEditPanel(property) },
    { label: 'House Rules', icon: FiFileText, onClick: () => openRulesPanel(property) },
    {
      label: property.status === 'active' ? 'Deactivate' : 'Activate',
      icon: FiEyeOff,
      onClick: () => handleToggleStatus(property),
    },
    { label: 'Delete Property', icon: FiTrash2, isDestructive: true, onClick: () => handleDelete(property) },
  ];

  return (
    <Box>
      <PageBanner title="My Properties" subtitle="Manage your property listings" />

      <TableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by property title..."
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen((prev) => !prev)}
        addLabel="Add Property"
        onAdd={openAddPanel}
      >
        <HStack spacing={4} wrap="wrap">
          <Select flex="1" minW={{ base: '100%', sm: '160px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
          <Select flex="1" minW={{ base: '100%', sm: '160px' }} value={moderationFilter} onChange={(e) => setModerationFilter(e.target.value)}>
            <option value="all">All Listing Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending Review</option>
            <option value="rejected">Rejected</option>
          </Select>
        </HStack>
      </TableToolbar>

      {isLoading ? (
        <TableSkeleton rows={5} columns={5} />
      ) : (
        <DataTable
          columns={columns}
          data={ownerProperties}
          getRowKey={(p) => p.id}
          getRowActions={getRowActions}
          emptyState={
            <Box textAlign="center" py={4}>
              <Text mb={4} color="gray.600">No properties match your search or filters.</Text>
              <Button leftIcon={<Icon as={FiPlus} />} onClick={openAddPanel}>Add Property</Button>
            </Box>
          }
        />
      )}

      <PropertyFormPanel
        key={`${panel.mode}:${panel.propertyId || 'new'}`}
        mode={panel.mode}
        propertyId={panel.propertyId}
        isOpen={panel.isOpen}
        onClose={closePanel}
      />

      <HouseRulesPanel
        isOpen={rulesPanel.isOpen}
        propertyId={rulesPanel.propertyId}
        propertyTitle={rulesPanel.propertyTitle}
        onClose={closeRulesPanel}
      />
    </Box>
  );
};

export default PropertiesPage;
