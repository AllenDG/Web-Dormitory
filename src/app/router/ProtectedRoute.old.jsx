import { Navigate, useLocation } from 'react-router-dom';
import { Center, Spinner, Text, VStack } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useAuth } from '../providers/AuthProvider';

/**
 * Protected Route Component
 * Handles role-based access control (RBAC)
 * Redirects unauthorized users to appropriate pages
 */

const ProtectedRoute = ({ children, allowedRoles = [], requireAuth = true }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Center h="100vh" bg="gray.50">
        <VStack spacing={4}>
          <Spinner size="xl" color="primary.500" thickness="4px" />
          <Text color="gray.600">Loading...</Text>
        </VStack>
      </Center>
    );
  }

  // If route requires authentication and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, check if user has the required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect based on user role
    if (user?.role === 'owner') {
      return <Navigate to="/owner/dashboard" replace />;
    }
    if (user?.role === 'tenant') {
      return <Navigate to="/" replace />;
    }
    // If no role or guest, redirect to login
    return <Navigate to="/login" replace />;
  }

  // User is authorized, render the protected content
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  requireAuth: PropTypes.bool,
};

export default ProtectedRoute;
