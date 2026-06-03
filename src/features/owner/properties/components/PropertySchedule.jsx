import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  Badge,
  SimpleGrid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import {
  FiCalendar,
  FiClock,
  FiPlus,
  FiEdit,
  FiTrash2,
} from 'react-icons/fi';
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';

/**
 * Property Schedule Component
 * Manage availability calendar and blocked dates
 */

const CalendarDay = ({ date, events, onDayClick }) => {
  const isCurrentDay = isToday(date);
  const dayEvents = events.filter((event) =>
    isSameDay(new Date(event.date), date)
  );

  const getEventColor = (type) => {
    switch (type) {
      case 'blocked':
        return 'red';
      case 'maintenance':
        return 'orange';
      case 'reserved':
        return 'purple';
      default:
        return 'gray';
    }
  };

  return (
    <Box
      p={2}
      borderRadius="md"
      border="1px"
      borderColor={isCurrentDay ? 'primary.500' : 'gray.200'}
      bg={isCurrentDay ? 'primary.50' : 'white'}
      cursor="pointer"
      minH="80px"
      onClick={() => onDayClick(date)}
      transition="all 0.2s"
      _hover={{ bg: 'gray.50', boxShadow: 'sm' }}
    >
      <Text
        fontSize="sm"
        fontWeight={isCurrentDay ? 'bold' : 'normal'}
        color={isCurrentDay ? 'primary.600' : 'gray.700'}
        mb={1}
      >
        {format(date, 'd')}
      </Text>
      <VStack spacing={1} align="stretch">
        {dayEvents.slice(0, 2).map((event) => (
          <Badge
            key={event.id}
            colorScheme={getEventColor(event.type)}
            fontSize="9px"
            px={1}
            py={0.5}
            borderRadius="sm"
            noOfLines={1}
          >
            {event.title}
          </Badge>
        ))}
        {dayEvents.length > 2 && (
          <Text fontSize="9px" color="gray.500">
            +{dayEvents.length - 2} more
          </Text>
        )}
      </VStack>
    </Box>
  );
};

const PropertySchedule = ({ propertyId }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Mock data - replace with actual API
  const [events, setEvents] = useState([
    {
      id: 1,
      date: '2026-06-05',
      type: 'blocked',
      title: 'Unit Inspection',
      notes: 'Annual inspection by building management',
    },
    {
      id: 2,
      date: '2026-06-10',
      type: 'maintenance',
      title: 'AC Maintenance',
      notes: 'Scheduled maintenance for air conditioning',
    },
    {
      id: 3,
      date: '2026-06-15',
      type: 'reserved',
      title: 'Reserved for Viewing',
      notes: 'Property viewing scheduled',
    },
    {
      id: 4,
      date: '2026-06-20',
      type: 'blocked',
      title: 'Repairs',
      notes: 'Plumbing repairs scheduled',
    },
  ]);

  const [formData, setFormData] = useState({
    type: 'blocked',
    title: '',
    notes: '',
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleDayClick = (date) => {
    setSelectedDate(date);
    const dayEvents = events.filter((event) =>
      isSameDay(new Date(event.date), date)
    );
    
    if (dayEvents.length > 0) {
      // Show existing events
      // For now, open form to add new event
      onOpen();
    } else {
      onOpen();
    }
  };

  const handleSubmit = () => {
    if (!formData.title) {
      toast({
        title: 'Error',
        description: 'Please enter an event title.',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    const newEvent = {
      id: events.length + 1,
      date: format(selectedDate, 'yyyy-MM-dd'),
      ...formData,
    };

    setEvents([...events, newEvent]);
    toast({
      title: 'Event Added',
      description: 'Calendar event has been created.',
      status: 'success',
      duration: 3000,
    });

    setFormData({ type: 'blocked', title: '', notes: '' });
    onClose();
  };

  const handleDelete = (eventId) => {
    setEvents(events.filter((e) => e.id !== eventId));
    toast({
      title: 'Event Deleted',
      description: 'Calendar event has been removed.',
      status: 'success',
      duration: 3000,
    });
  };

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'blocked':
        return 'red';
      case 'maintenance':
        return 'orange';
      case 'reserved':
        return 'purple';
      default:
        return 'gray';
    }
  };

  return (
    <Box>
      {/* Header */}
      <HStack justify="space-between" mb={6}>
        <Box>
          <Heading size="md" mb={1}>
            Availability Calendar
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Manage blocked dates and maintenance schedule
          </Text>
        </Box>
        <Button
          leftIcon={<Icon as={FiPlus} />}
          colorScheme="primary"
          size="sm"
          onClick={() => {
            setSelectedDate(new Date());
            onOpen();
          }}
        >
          Add Event
        </Button>
      </HStack>

      {/* Calendar Navigation */}
      <HStack justify="space-between" mb={4}>
        <Heading size="sm">
          {format(currentMonth, 'MMMM yyyy')}
        </Heading>
        <HStack spacing={2}>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))
            }
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))
            }
          >
            Next
          </Button>
        </HStack>
      </HStack>

      {/* Calendar Grid */}
      <Box mb={6}>
        {/* Week Days Header */}
        <SimpleGrid columns={7} gap={2} mb={2}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Text
              key={day}
              fontSize="sm"
              fontWeight="semibold"
              textAlign="center"
              color="gray.600"
            >
              {day}
            </Text>
          ))}
        </SimpleGrid>

        {/* Calendar Days */}
        <SimpleGrid columns={7} gap={2}>
          {/* Empty cells for days before month start */}
          {Array.from({ length: monthStart.getDay() }).map((_, index) => (
            <Box key={`empty-${index}`} />
          ))}
          
          {/* Actual days */}
          {daysInMonth.map((date) => (
            <CalendarDay
              key={date.toString()}
              date={date}
              events={events}
              onDayClick={handleDayClick}
            />
          ))}
        </SimpleGrid>
      </Box>

      {/* Legend */}
      <HStack spacing={4} mb={6} flexWrap="wrap">
        <HStack>
          <Badge colorScheme="red" px={2}>Blocked</Badge>
        </HStack>
        <HStack>
          <Badge colorScheme="orange" px={2}>Maintenance</Badge>
        </HStack>
        <HStack>
          <Badge colorScheme="purple" px={2}>Reserved</Badge>
        </HStack>
      </HStack>

      {/* Upcoming Events */}
      <Box
        bg="white"
        p={5}
        borderRadius="lg"
        border="1px"
        borderColor="gray.200"
      >
        <Heading size="sm" mb={4}>
          Upcoming Events
        </Heading>
        <VStack spacing={3} align="stretch">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <HStack
                key={event.id}
                justify="space-between"
                p={3}
                borderRadius="md"
                bg="gray.50"
              >
                <HStack spacing={3}>
                  <Icon as={FiCalendar} color="gray.600" />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="semibold" fontSize="sm">
                      {event.title}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {format(new Date(event.date), 'MMMM d, yyyy')}
                    </Text>
                  </VStack>
                </HStack>
                <HStack spacing={2}>
                  <Badge colorScheme={getEventTypeColor(event.type)} fontSize="xs">
                    {event.type}
                  </Badge>
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Icon as={FiTrash2} />
                  </Button>
                </HStack>
              </HStack>
            ))
          ) : (
            <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
              No upcoming events
            </Text>
          )}
        </VStack>
      </Box>

      {/* Add Event Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Add Calendar Event
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Date</FormLabel>
                <Input
                  type="text"
                  value={selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
                  isReadOnly
                  bg="gray.50"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm">Event Type</FormLabel>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <option value="blocked">Blocked</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="reserved">Reserved</option>
                </select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm">Title</FormLabel>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., AC Maintenance"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Notes</FormLabel>
                <Textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Additional details..."
                  rows={3}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="primary" onClick={handleSubmit}>
              Add Event
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PropertySchedule;
