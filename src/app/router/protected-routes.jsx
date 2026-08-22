import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { Center, Spinner, Box, Text, Button, VStack } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { hasPermission, hasAnyPermission } from '../config/permissions';

/**
 * Protected Route Component
 * Ensures user is authenticated and, optionally, has an allowed role and/or
 * required permission(s). `allowedRoles` and `requiredPermission(s)` are
 * independent checks — a route can use either, both, or neither.
 */
const ProtectedRoute = ({
  children,
  allowedRoles = [],
  requiredPermission = null,
  requiredPermissions = null,
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="primary.500" thickness="4px" />
      </Center>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasRequiredRole =
    allowedRoles.length === 0 || allowedRoles.includes(user?.role);
  const hasRequiredPermission =
    !requiredPermission || hasPermission(user?.role, requiredPermission);
  const hasRequiredPermissions =
    !requiredPermissions || hasAnyPermission(user?.role, requiredPermissions);

  if (!hasRequiredRole || !hasRequiredPermission || !hasRequiredPermissions) {
    return (
      <Center h="100vh">
        <Box textAlign="center" p={8}>
          <VStack spacing={4}>
            <Text fontSize="4xl">🚫</Text>
            <Text fontSize="2xl" fontWeight="bold">
              Access Denied
            </Text>
            <Text color="gray.600">
              You don't have permission to access this page.
            </Text>
            <Button
              colorScheme="primary"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </VStack>
        </Box>
      </Center>
    );
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  requiredPermission: PropTypes.string,
  requiredPermissions: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
