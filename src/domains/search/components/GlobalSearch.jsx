import { useMemo, useState } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  VStack,
  HStack,
  Text,
  Badge,
} from '@chakra-ui/react';
import { FiSearch, FiHome, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useRentalStore from '../../../shared/stores/useRentalStore';
import useBookingStore from '../../../shared/stores/useBookingStore';
import useInquiryStore from '../../../shared/stores/useInquiryStore';
import { useAuth } from '../../../app/providers/AuthProvider';

const matches = (query, ...fields) =>
  fields.some((field) => field && field.toLowerCase().includes(query));

/**
 * Global Search
 * In-memory substring search across the owner's own properties, bookings,
 * and tenant inquiries — no separate index/persistence, just filters the
 * already-loaded store data as the owner types.
 */
const GlobalSearch = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const rentals = useRentalStore((state) => state.rentals);
  const bookings = useBookingStore((state) => state.bookings);
  const inquiries = useInquiryStore((state) => state.inquiries);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const propertyResults = rentals
      .filter((r) => r.ownerEmail === user?.email)
      .filter((r) => matches(q, r.title, r.city, r.address))
      .slice(0, 5)
      .map((r) => ({
        type: 'property',
        id: r.id,
        title: r.title,
        subtitle: r.city,
        path: `/owner/properties/edit/${r.id}`,
      }));

    const bookingResults = bookings
      .filter((b) => b.ownerEmail === user?.email)
      .filter((b) => matches(q, b.propertyTitle, b.guestName))
      .slice(0, 5)
      .map((b) => ({
        type: 'booking',
        id: b.id,
        title: b.propertyTitle || 'Booking',
        subtitle: b.guestName ? `Guest: ${b.guestName}` : b.status,
        path: '/owner/bookings',
      }));

    const inquiryResults = inquiries
      .filter((i) => i.ownerEmail === user?.email)
      .filter((i) => matches(q, i.tenantName, i.propertyTitle, i.message))
      .slice(0, 5)
      .map((i) => ({
        type: 'inquiry',
        id: i.id,
        title: i.tenantName,
        subtitle: i.propertyTitle,
        path: '/owner/tenants',
      }));

    return [...propertyResults, ...bookingResults, ...inquiryResults];
  }, [query, rentals, bookings, inquiries, user?.email]);

  const iconFor = (type) => {
    if (type === 'property') return FiHome;
    if (type === 'booking') return FiCalendar;
    return FiMessageSquare;
  };

  const handleSelect = (result) => {
    navigate(result.path);
    setQuery('');
    setIsFocused(false);
  };

  return (
    <Box position="relative" w="full" maxW="360px">
      <InputGroup size="sm">
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search properties, bookings, inquiries..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          borderRadius="lg"
          bg="gray.50"
        />
      </InputGroup>

      {isFocused && query.trim() && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          mt={2}
          bg="white"
          borderRadius="lg"
          boxShadow="lg"
          border="1px"
          borderColor="gray.200"
          zIndex="dropdown"
          maxH="360px"
          overflowY="auto"
        >
          {results.length === 0 ? (
            <Text fontSize="sm" color="gray.500" p={4}>
              No matches for &quot;{query}&quot;
            </Text>
          ) : (
            <VStack align="stretch" spacing={0} py={2}>
              {results.map((result) => (
                <HStack
                  key={`${result.type}-${result.id}`}
                  as="button"
                  type="button"
                  onClick={() => handleSelect(result)}
                  px={4}
                  py={2}
                  spacing={3}
                  textAlign="left"
                  _hover={{ bg: 'gray.50' }}
                >
                  <Icon as={iconFor(result.type)} color="primary.500" />
                  <VStack align="start" spacing={0} flex={1} minW={0}>
                    <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                      {result.title}
                    </Text>
                    {result.subtitle && (
                      <Text fontSize="xs" color="gray.500" noOfLines={1}>
                        {result.subtitle}
                      </Text>
                    )}
                  </VStack>
                  <Badge fontSize="2xs" colorScheme="gray" textTransform="capitalize">
                    {result.type}
                  </Badge>
                </HStack>
              ))}
            </VStack>
          )}
        </Box>
      )}
    </Box>
  );
};

export default GlobalSearch;
