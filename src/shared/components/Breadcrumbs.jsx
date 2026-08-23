import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';

// Static route segment -> label map. Dynamic segments (ids) are skipped
// rather than guessed at, since we don't have the underlying record's name
// available at this layer.
const SEGMENT_LABELS = {
  owner: 'Dashboard',
  dashboard: 'Dashboard',
  properties: 'Properties',
  add: 'Add Property',
  edit: 'Edit Property',
  bookings: 'Bookings',
  tenants: 'Tenants',
  payments: 'Payments',
  settings: 'Settings',
  admin: 'Admin',
  users: 'Users',
  new: 'Add User',
  owners: 'Owners',
  admins: 'Admins',
  revenue: 'Revenue',
  transactions: 'Transactions',
  refunds: 'Refunds & Disputes',
  'audit-log': 'Audit Log',
  'user-actions': 'User Actions',
  'property-actions': 'Property Actions',
  'report-actions': 'Report Actions',
  'settings-actions': 'Settings & Broadcasts',
  reports: 'Reported Issues',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  open: 'Open',
  investigating: 'Investigating',
  resolved: 'Resolved',
  'property-reports': 'Property Reports',
  'user-reports': 'User Reports',
  'payment-reports': 'Payment Reports',
  profile: 'My Profile',
  platform: 'Platform Settings',
};

const isDynamicSegment = (segment) => /^[0-9a-fA-F-]{8,}$/.test(segment) || /^\d+$/.test(segment);

/**
 * Breadcrumb trail derived from the current route path, using a static
 * segment -> label map (no route-tree introspection library involved).
 */
const Breadcrumbs = () => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length <= 1) return null;

  let pathSoFar = '';
  const crumbs = segments
    .filter((segment) => !isDynamicSegment(segment))
    .map((segment) => {
      pathSoFar += `/${segment}`;
      return {
        label: SEGMENT_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        path: pathSoFar,
      };
    });

  return (
    <Breadcrumb fontSize="sm" color="gray.600" mb={4}>
      {crumbs.map((crumb, index) => (
        <BreadcrumbItem key={crumb.path} isCurrentPage={index === crumbs.length - 1}>
          <BreadcrumbLink
            as={Link}
            to={crumb.path}
            fontWeight={index === crumbs.length - 1 ? 'semibold' : 'normal'}
            color={index === crumbs.length - 1 ? 'gray.800' : 'gray.600'}
          >
            {crumb.label}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
