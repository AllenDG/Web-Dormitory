import { useState } from 'react';
import { Box, SimpleGrid, Image, VStack, HStack, Text, Badge, Button, Input, InputGroup, InputLeftElement, Select, Icon } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiCheckCircle, FiXCircle, FiEye } from 'react-icons/fi';
import useRentalStore from '../../../../shared/stores/useRentalStore';
import useAuditLogStore from '../../../../shared/stores/useAuditLogStore';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { useContextMenu } from '../../../../shared/hooks/useContextMenu';
import ContextMenu from '../../../../shared/components/ContextMenu';
import { useMinDisplayTime } from '../../../../shared/hooks/useMinDisplayTime';
import { PropertyCardSkeleton } from '../../../../shared/components/LoadingState';
import { useAppToast } from '../../../../shared/hooks/useAppToast';
import { confirmAction } from '../../../../shared/utils/confirm';

const STATUS_COLORS = { approved: 'green', rejected: 'red', pending: 'yellow' };

/**
 * Property Moderation grid — kebab menu replaced with right-click/long-press
 * context menu. "Report Issue" (previously dead, no onClick) is removed
 * rather than faked — no coherent workflow exists for an admin to report a
 * property from inside their own moderation queue (that's what Reported
 * Issues is for). "View Details" wires to the real listing page.
 */
export function PropertyModerationGrid({ status = 'all' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useAppToast();
  const navigate = useNavigate();
  const { user: actor } = useAuth();
  const isLoading = useMinDisplayTime();

  const rentals = useRentalStore((state) => state.rentals);
  const approveProperty = useRentalStore((state) => state.approveProperty);
  const rejectProperty = useRentalStore((state) => state.rejectProperty);
  const logAction = useAuditLogStore((state) => state.logAction);
  const { isOpen, position, activeItem, close, handlers } = useContextMenu();

  const properties = rentals
    .map((r) => ({
      id: r.id,
      title: r.title,
      owner: r.ownerName,
      price: r.price,
      location: r.city,
      status: r.moderationStatus || 'approved',
      submitted: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—',
      image: r.imageUrl?.[0] || 'https://via.placeholder.com/300x200',
    }))
    .filter((property) => {
      const matchesSearch = !searchQuery || property.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = status === 'all' || property.status === status;
      return matchesSearch && matchesStatus;
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

  const getRowActions = (property) => [
    { label: 'View Details', icon: FiEye, onClick: () => navigate(`/listing/${property.id}`) },
    ...(property.status === 'pending'
      ? [
          { label: 'Approve', icon: FiCheckCircle, onClick: () => handleApprove(property) },
          { label: 'Reject', icon: FiXCircle, isDestructive: true, onClick: () => handleReject(property) },
        ]
      : []),
  ];

  return (
    <Box>
      <InputGroup mb={6} w="full">
        <InputLeftElement pointerEvents="none"><Icon as={FiSearch} color="gray.400" /></InputLeftElement>
        <Input placeholder="Search properties..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </InputGroup>

      {isLoading ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <PropertyCardSkeleton count={3} />
        </SimpleGrid>
      ) : properties.length === 0 ? (
        <Text textAlign="center" color="gray.500" py={12}>No properties match this filter.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {properties.map((property) => (
            <Box
              key={property.id}
              bg="white"
              borderRadius="lg"
              border="1px"
              borderColor="gray.200"
              overflow="hidden"
              transition="all 0.2s"
              _hover={{ boxShadow: 'md' }}
              cursor="context-menu"
              onContextMenu={(e) => handlers.onContextMenu(e, property)}
              onTouchStart={(e) => handlers.onTouchStart(e, property)}
              onTouchMove={handlers.onTouchMove}
              onTouchEnd={handlers.onTouchEnd}
            >
              <Image src={property.image} alt={property.title} h="200px" w="100%" objectFit="cover" />
              <VStack align="stretch" p={4} spacing={3}>
                <HStack justify="space-between">
                  <Badge colorScheme={STATUS_COLORS[property.status] || 'gray'} borderRadius="md">{property.status}</Badge>
                  <Text fontSize="xs" color="gray.500">{property.submitted}</Text>
                </HStack>
                <Text fontWeight="bold" fontSize="md" noOfLines={2}>{property.title}</Text>
                <HStack justify="space-between" fontSize="sm">
                  <Text color="gray.600">Owner:</Text>
                  <Text fontWeight="medium">{property.owner}</Text>
                </HStack>
                <HStack justify="space-between" fontSize="sm">
                  <Text color="gray.600">Location:</Text>
                  <Text fontWeight="medium">{property.location}</Text>
                </HStack>
                <Text fontSize="lg" fontWeight="bold" color="primary.600">₱{property.price.toLocaleString()}/month</Text>
                {property.status === 'pending' && (
                  <HStack spacing={2}>
                    <Button size="sm" colorScheme="green" leftIcon={<FiCheckCircle />} flex={1} onClick={() => handleApprove(property)}>Approve</Button>
                    <Button size="sm" colorScheme="red" leftIcon={<FiXCircle />} flex={1} onClick={() => handleReject(property)}>Reject</Button>
                  </HStack>
                )}
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      )}

      <ContextMenu isOpen={isOpen} position={position} items={activeItem ? getRowActions(activeItem) : []} onClose={close} />
    </Box>
  );
}

export default PropertyModerationGrid;
