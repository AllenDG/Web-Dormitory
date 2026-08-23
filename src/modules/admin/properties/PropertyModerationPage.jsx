import { useEffect, useState } from 'react';
import { Box, Icon } from '@chakra-ui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import PageBanner from '../../../shared/components/PageBanner';
import Button from '../../../shared/components/Button';
import PropertyModerationGrid from './components/PropertyModerationGrid';
import AdminPropertyFormPanel from './components/AdminPropertyFormPanel';

const STATUS_TITLES = { all: 'All Listings', pending: 'Pending', approved: 'Approved', rejected: 'Rejected' };

const PropertyModerationPage = ({ status = 'all' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: routePropertyId } = useParams();
  const [panel, setPanel] = useState({ isOpen: false, mode: 'add', propertyId: null });

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
        title={STATUS_TITLES[status]}
        subtitle="Review and approve new property listings"
        actions={
          <Button leftIcon={<Icon as={FiPlus} />} onClick={() => setPanel({ isOpen: true, mode: 'add', propertyId: null })}>
            Add Property
          </Button>
        }
      />
      <PropertyModerationGrid status={status} onEditProperty={openEdit} />
      <AdminPropertyFormPanel isOpen={panel.isOpen} mode={panel.mode} propertyId={panel.propertyId} onClose={closePanel} />
    </Box>
  );
};

export default PropertyModerationPage;
