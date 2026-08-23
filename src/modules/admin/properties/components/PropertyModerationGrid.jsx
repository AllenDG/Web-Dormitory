import { useState, useMemo } from 'react';
import { Box, Image, Flex, HStack, Text, Badge, Select, NumberInput, NumberInputField } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import useRentalStore from '../../../../shared/stores/useRentalStore';
import useAuditLogStore from '../../../../shared/stores/useAuditLogStore';
import { useAuth } from '../../../../app/providers/AuthProvider';
import DataTable from '../../../../shared/components/DataTable';
import TableToolbar from '../../../../shared/components/TableToolbar';
import { TableSkeleton } from '../../../../shared/components/LoadingState';
import { useMinDisplayTime } from '../../../../shared/hooks/useMinDisplayTime';
import { useAppToast } from '../../../../shared/hooks/useAppToast';
import { confirmAction } from '../../../../shared/utils/confirm';

const STATUS_COLORS = { approved: 'green', rejected: 'red', pending: 'yellow' };

const getCities = (rentals) => [...new Set(rentals.map((r) => r.city))].sort();

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(price);

/**
 * Property Management table — same DataTable/right-click-context-menu
 * idiom as User Management, replacing the earlier card grid. "Report
 * Issue" is intentionally absent (no coherent workflow exists for an
 * admin to report a property from inside their own moderation queue —
 * that's what Reported Issues is for). "View Details" wires to the real
 * listing page.
 */
export function PropertyModerationGrid({ onEditProperty, addLabel, onAdd }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const toast = useAppToast();
  const navigate = useNavigate();
  const { user: actor } = useAuth();
  const isLoading = useMinDisplayTime();

  const rentals = useRentalStore((state) => state.rentals);
  const approveProperty = useRentalStore((state) => state.approveProperty);
  const rejectProperty = useRentalStore((state) => state.rejectProperty);
  const deleteRental = useRentalStore((state) => state.deleteRental);
  const logAction = useAuditLogStore((state) => state.logAction);

  const cities = useMemo(() => getCities(rentals), [rentals]);

  const properties = rentals
    .map((r) => ({
      id: r.id,
      title: r.title,
      owner: r.ownerName,
      price: r.price,
      location: r.city,
      status: r.moderationStatus || 'approved',
      submittedAt: r.createdAt ? new Date(r.createdAt).getTime() : 0,
      submitted: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—',
      image: r.imageUrl?.[0] || 'https://via.placeholder.com/60x60',
    }))
    .filter((property) => {
      const matchesSearch = !searchQuery || property.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
      const matchesCity = cityFilter === 'all' || property.location === cityFilter;
      const minPrice = priceMin ? parseInt(priceMin, 10) : 0;
      const maxPrice = priceMax ? parseInt(priceMax, 10) : Infinity;
      const matchesPrice = property.price >= minPrice && property.price <= maxPrice;
      return matchesSearch && matchesStatus && matchesCity && matchesPrice;
    });

  const handleApprove = async (property) => {
    const confirmed = await confirmAction({ title: 'Approve Property', text: `Approve "${property.title}" and publish it?`, confirmButtonText: 'Approve' });
    if (!confirmed) return;
    approveProperty(property.id);
    logAction({ actorEmail: actor?.email, actorName: actor?.name, action: 'property.approved', target: property.title });
    toast({ title: 'Property Approved', description: `${property.title} has been approved and published.`, status: 'success' });
  };

  const handleReject = async (property) => {
    const confirmed = await confirmAction({ title: 'Reject Property', text: `Reject "${property.title}"?`, isDestructive: true, confirmButtonText: 'Reject' });
    if (!confirmed) return;
    rejectProperty(property.id);
    logAction({ actorEmail: actor?.email, actorName: actor?.name, action: 'property.rejected', target: property.title });
    toast({ title: 'Property Rejected', description: `${property.title} has been rejected.`, status: 'error' });
  };

  const handleDelete = async (property) => {
    const confirmed = await confirmAction({ title: 'Delete Property', text: `Permanently delete "${property.title}"? This cannot be undone.`, isDestructive: true, confirmButtonText: 'Delete' });
    if (!confirmed) return;
    deleteRental(property.id);
    logAction({ actorEmail: actor?.email, actorName: actor?.name, action: 'property.deleted', target: property.title });
    toast({ title: 'Property Deleted', description: `${property.title} has been removed.`, status: 'info' });
  };

  const columns = [
    {
      key: 'title',
      label: 'Property',
      sortable: true,
      render: (p) => (
        <HStack>
          <Image src={p.image} alt={p.title} boxSize="40px" borderRadius="md" objectFit="cover" />
          <Text fontWeight="semibold" fontSize="sm" noOfLines={1} maxW="240px">{p.title}</Text>
        </HStack>
      ),
    },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'price', label: 'Price', sortable: true, render: (p) => `${formatPrice(p.price)}/mo` },
    { key: 'status', label: 'Status', sortable: true, render: (p) => <Badge colorScheme={STATUS_COLORS[p.status] || 'gray'} borderRadius="md">{p.status}</Badge> },
    { key: 'submittedAt', label: 'Submitted', sortable: true, render: (p) => p.submitted },
  ];

  const getRowActions = (property) => [
    { label: 'View Details', icon: FiEye, onClick: () => navigate(`/listing/${property.id}`) },
    { label: 'Edit Property', icon: FiEdit, onClick: () => onEditProperty?.(property.id) },
    ...(property.status === 'pending'
      ? [
          { label: 'Approve', icon: FiCheckCircle, onClick: () => handleApprove(property) },
          { label: 'Reject', icon: FiXCircle, isDestructive: true, onClick: () => handleReject(property) },
        ]
      : []),
    { label: 'Delete Property', icon: FiTrash2, isDestructive: true, onClick: () => handleDelete(property) },
  ];

  return (
    <Box>
      <TableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by property title..."
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen((prev) => !prev)}
        addLabel={addLabel}
        onAdd={onAdd}
      >
        <Flex wrap="wrap" gap={4}>
          <Select flex="1" minW={{ base: '100%', sm: '160px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Select>
          <Select flex="1" minW={{ base: '100%', sm: '160px' }} value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
            <option value="all">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </Select>
          <NumberInput flex="1" minW={{ base: '100%', sm: '140px' }} min={0} value={priceMin} onChange={(val) => setPriceMin(val)}>
            <NumberInputField placeholder="Min Price" />
          </NumberInput>
          <NumberInput flex="1" minW={{ base: '100%', sm: '140px' }} min={0} value={priceMax} onChange={(val) => setPriceMax(val)}>
            <NumberInputField placeholder="Max Price" />
          </NumberInput>
        </Flex>
      </TableToolbar>

      {isLoading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : (
        <DataTable
          columns={columns}
          data={properties}
          getRowKey={(p) => p.id}
          getRowActions={getRowActions}
          emptyState="No properties match your search or filters."
        />
      )}
    </Box>
  );
}

export default PropertyModerationGrid;
