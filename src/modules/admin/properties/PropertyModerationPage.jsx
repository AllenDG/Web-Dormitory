import { useEffect, useMemo, useState } from 'react';
import { Box, Icon, SimpleGrid } from '@chakra-ui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FiPlus, FiGrid, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import PageBanner from '../../../shared/components/PageBanner';
import Button from '../../../shared/components/Button';
import StatCard from '../../../shared/components/StatCard';
import useRentalStore from '../../../shared/stores/useRentalStore';
import PropertyModerationGrid from './components/PropertyModerationGrid';
import AdminPropertyFormPanel from './components/AdminPropertyFormPanel';

const PropertyModerationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: routePropertyId } = useParams();
  const [panel, setPanel] = useState({ isOpen: false, mode: 'add', propertyId: null });

  const rentals = useRentalStore((state) => state.rentals);
  const statusCounts = useMemo(
    () =>
      rentals.reduce(
        (acc, r) => {
          const key = r.moderationStatus || 'approved';
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        },
        { pending: 0, approved: 0, rejected: 0 }
      ),
    [rentals]
  );

  // Deep-linking: /admin/properties/add and /admin/properties/edit/:id
  // auto-open the panel in the right mode (matches the owner properties
  // deep-link idiom), then normalize the URL back to /admin/properties
  // once the panel is closed.
  useEffect(() => {
    if (location.pathname.endsWith('/add')) {
      setPanel({ isOpen: true, mode: 'add', propertyId: null });
    } else if (location.pathname.includes('/edit/') && routePropertyId) {
      setPanel({ isOpen: true, mode: 'edit', propertyId: routePropertyId });
    }
  }, [location.pathname, routePropertyId]);

  const closePanel = () => {
    setPanel((prev) => ({ ...prev, isOpen: false }));
    if (location.pathname !== '/admin/properties') {
      navigate('/admin/properties', { replace: true });
    }
  };

  const openEdit = (propertyId) => setPanel({ isOpen: true, mode: 'edit', propertyId });

  return (
    <Box>
      <PageBanner
        title="Property Management"
        subtitle="Review, approve, and manage every listing on the platform"
        actions={
          <Button leftIcon={<Icon as={FiPlus} />} onClick={() => setPanel({ isOpen: true, mode: 'add', propertyId: null })}>
            Add Property
          </Button>
        }
      />

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard label="Total Listings" value={rentals.length} icon={FiGrid} color="primary" />
        <StatCard label="Pending Review" value={statusCounts.pending} icon={FiClock} color="warning" />
        <StatCard label="Approved" value={statusCounts.approved} icon={FiCheckCircle} color="success" />
        <StatCard label="Rejected" value={statusCounts.rejected} icon={FiXCircle} color="error" />
      </SimpleGrid>

      <PropertyModerationGrid onEditProperty={openEdit} />
      <AdminPropertyFormPanel isOpen={panel.isOpen} mode={panel.mode} propertyId={panel.propertyId} onClose={closePanel} />
    </Box>
  );
};

export default PropertyModerationPage;
