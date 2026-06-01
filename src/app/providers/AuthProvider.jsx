import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Authentication Context
 * Manages user authentication state and role-based access control (RBAC)
 */

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// User roles
export const ROLES = {
  TENANT: 'tenant',
  OWNER: 'owner',
  ADMIN: 'admin',
  GUEST: 'guest',
};

// Mock user data (replace with actual API calls)
const MOCK_USERS = {
  tenant: {
    id: '1',
    email: 'tenant@dormy.ph',
    name: 'Juan Dela Cruz',
    role: ROLES.TENANT,
    avatar: null,
    preferences: {
      location: 'Dagupan',
      budget: [2000, 5000],
      roomType: 'Studio',
    },
  },
  owner: {
    id: '2',
    email: 'owner@dormy.ph',
    name: 'Maria Santos',
    role: ROLES.OWNER,
    avatar: null,
    properties: [],
  },
  admin: {
    id: '3',
    email: 'admin@dormy.ph',
    name: 'Admin User',
    role: ROLES.ADMIN,
    avatar: null,
    permissions: ['all'],
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('dormy_user');
        const storedToken = localStorage.getItem('dormy_token');
        
        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('dormy_user');
        localStorage.removeItem('dormy_token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email, password, role = ROLES.TENANT) => {
    try {
      setLoading(true);
      
      // Mock API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication logic
      let mockUser;
      if (role === ROLES.OWNER) {
        mockUser = MOCK_USERS.owner;
      } else if (role === ROLES.ADMIN) {
        mockUser = MOCK_USERS.admin;
      } else {
        mockUser = MOCK_USERS.tenant;
      }
      
      const mockToken = `mock_token_${Date.now()}`;
      
      // Store in localStorage
      localStorage.setItem('dormy_user', JSON.stringify(mockUser));
      localStorage.setItem('dormy_token', mockToken);
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      setLoading(true);
      
      // Mock API call - replace with actual registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        role: userData.role || ROLES.TENANT,
      };
      
      const mockToken = `mock_token_${Date.now()}`;
      
      localStorage.setItem('dormy_user', JSON.stringify(newUser));
      localStorage.setItem('dormy_token', mockToken);
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('dormy_user');
    localStorage.removeItem('dormy_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('dormy_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  // Check if user is tenant
  const isTenant = () => hasRole(ROLES.TENANT);

  // Check if user is owner
  const isOwner = () => hasRole(ROLES.OWNER);

  // Check if user is admin
  const isAdmin = () => hasRole(ROLES.ADMIN);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
    hasRole,
    hasAnyRole,
    isTenant,
    isOwner,
    isAdmin,
    ROLES,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
