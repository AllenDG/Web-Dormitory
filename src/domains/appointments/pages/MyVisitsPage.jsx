import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Icon,
  Image,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Textarea,
  useToast,
  Card,
  CardBody,
  SimpleGrid,
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiStar,
  FiMessageSquare,
} from 'react-icons/fi';
import { format } from 'date-fns';
import useVisitStore, { VISIT_STATUS } from '../../../shared/stores/useVisitStore';
import { useAuth } from '../../../app/providers/AuthProvider';

/**
 * My Visits Page
 * 
 * Tenant view of all visit requests
 * Tabs: Pending, Approved, Past
 * 
 * Features:
 * - View visit requests
 * - Accept alternative schedules
 * - Cancel visits
 * - Rate completed visits
 * - Chat with owner
 * 
 * @component
 */
const MyVisitsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const {
    getVisitsByStatus,
    getUpcomingVisits,
    getPastVisits,
    acceptAlternativeSchedule,
    cancelVisit,
    completeVisit,
  } = useVisitStore();

  const [selectedVisit, setSelectedVisit] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const { isOpen: isCancelOpen, onOpen: onCancelOpen, onClose: onCancelClose } = useDisclosure();
  const { isOpen: isFeedbackOpen, onOpen: onFeedbackOpen, onClose: onFeedbackClose } = useDisclosure();

  const pendingVisits = getVisitsByStatus(VISIT_STATUS.PENDING, user?.id, 'tenant');
  const rescheduledVisits = getVisitsByStatus(VISIT_STATUS.RESCHEDULED, user?.id, 'tenant');
  const upcomingVisits = getUpcomingVisits(user?.id, 'tenant');
  const pastVisits = getPastVisits(user?.id, 'tenant');

  // Handle cancel visit
  const handleCancelVisit = async () => {
    if (!cancelReason.trim()) {
      toast({
        title: 'Reason Required',
        description: 'Please provide a reason for cancellation',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const result = await cancelVisit(selectedVisit.id, cancelReason);
    
    if (result.success) {
      toast({
        title: 'Visit Cancelled',
        description: 'Your visit request has been cancelled',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onCancelClose();
      setCancelReason('');
      setSelectedVisit(null);
    }
  };

  // Handle accept alternative
  const handleAcceptAlternative = async (visitId, alternativeId) => {
    const result = await acceptAlternativeSchedule(visitId, alternativeId);
    
    if (result.success) {
      toast({
        title: 'Schedule Accepted',
        description: 'Alternative schedule has been accepted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle submit feedback
  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please provide a rating',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const result = await completeVisit(selectedVisit.id, rating, feedback);
    
    if (result.success) {
      toast({
        title: 'Feedback Submitted',
        description: 'Thank you for your feedback!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onFeedbackClose();
      setRating(0);
      setFeedback('');
      setSelectedVisit(null);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      [VISIT_STATUS.PENDING]: { color: 'yellow', icon: FiAlertCircle, label: 'Pending' },
      [VISIT_STATUS.APPROVED]: { color: 'green', icon: FiCheckCircle, label: 'Approved' },
      [VISIT_STATUS.REJECTED]: { color: 'red', icon: FiXCircle, label: 'Rejected' },
      [VISIT_STATUS.RESCHEDULED]: { color: 'blue', icon: FiCalendar, label: 'Rescheduled' },
      [VISIT_STATUS.COMPLETED]: { color: 'purple', icon: FiCheckCircle, label: 'Completed' },
      [VISIT_STATUS.CANCELLED]: { color: 'gray', icon: FiXCircle, label: 'Cancelled' },
    };

    const config = statusConfig[status] || statusConfig[VISIT_STATUS.PENDING];

    return (
      <Badge colorScheme={config.color} borderRadius="full" px={3} py={1}>
        <HStack spacing={1}>
          <Icon as={config.icon} boxSize={3} />
          <Text fontSize="xs">{config.label}</Text>
        </HStack>
      </Badge>
    );
  };

  // Render visit card
  const renderVisitCard = (visit, showActions = true) => (
    <Card key={visit.id} borderRadius="8px">
      <CardBody>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {/* Property Info */}
          <HStack spacing={4} align="start">
            <Image
              src={visit.propertyImage}
              alt={visit.propertyTitle}
              boxSize="100px"
              objectFit="cover"
              borderRadius="8px"
            />
            <VStack align="start" spacing={2} flex={1}>
              <Text fontWeight="600" fontSize="md">
                {visit.propertyTitle}
              </Text>
              {getStatusBadge(visit.status)}
              <HStack fontSize="sm" color="gray.600">
                <Icon as={FiCalendar} />
                <Text>
                  {format(new Date(visit.preferredDate), 'MMM d, yyyy')} at {visit.preferredTime}
                </Text>
              </HStack>
            </VStack>
          </HStack>

          {/* Actions */}
          {showActions && (
            <VStack align="stretch" spacing={2}>
              {visit.status === VISIT_STATUS.PENDING && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="red"
                    onClick={() => {
                      setSelectedVisit(visit);
                      onCancelOpen();
                    }}
                    borderRadius="8px"
                  >
                    Cancel Request
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<Icon as={FiMessageSquare} />}
                    variant="outline"
                    onClick={() => navigate(`/chat?property=${visit.propertyId}`)}
                    borderRadius="8px"
                  >
                    Chat with Owner
                  </Button>
                </>
              )}

              {visit.status === VISIT_STATUS.RESCHEDULED && visit.alternativeSchedules.length > 0 && (
                <VStack align="stretch" spacing={2}>
                  <Text fontSize="sm" fontWeight="500">
                    Alternative Schedules:
                  </Text>
                  {visit.alternativeSchedules.map((alt) => (
                    <Box key={alt.id} p={3} bg="blue.50" borderRadius="8px">
                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" fontWeight="500">
                            {format(new Date(alt.date), 'MMM d, yyyy')} at {alt.time}
                          </Text>
                          {alt.notes && (
                            <Text fontSize="xs" color="gray.600">
                              {alt.notes}
                            </Text>
                          )}
                        </VStack>
                        <Button
                          size="xs"
                          colorScheme="blue"
                          onClick={() => handleAcceptAlternative(visit.id, alt.id)}
                          borderRadius="8px"
                        >
                          Accept
                        </Button>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              )}

              {visit.status === VISIT_STATUS.APPROVED && (
                <>
                  <Button
                    size="sm"
                    colorScheme="green"
                    leftIcon={<Icon as={FiCheckCircle} />}
                    borderRadius="8px"
                  >
                    Confirmed
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<Icon as={FiMessageSquare} />}
                    variant="outline"
                    onClick={() => navigate(`/chat?property=${visit.propertyId}`)}
                    borderRadius="8px"
                  >
                    Chat with Owner
                  </Button>
                </>
              )}

              {visit.status === VISIT_STATUS.COMPLETED && !visit.rating && (
                <Button
                  size="sm"
                  leftIcon={<Icon as={FiStar} />}
                  colorScheme="primary"
                  onClick={() => {
                    setSelectedVisit(visit);
                    onFeedbackOpen();
                  }}
                  borderRadius="8px"
                >
                  Rate Visit
                </Button>
              )}

              {visit.status === VISIT_STATUS.COMPLETED && visit.rating && (
                <HStack>
                  <Icon as={FiStar} color="yellow.400" />
                  <Text fontSize="sm" fontWeight="500">
                    Rated {visit.rating}/5
                  </Text>
                </HStack>
              )}
            </VStack>
          )}
        </SimpleGrid>

        {/* Additional Info */}
        {visit.ownerNotes && (
          <>
            <Divider my={4} />
            <Box p={3} bg="gray.50" borderRadius="8px">
              <Text fontSize="xs" fontWeight="500" color="gray.700" mb={1}>
                Owner's Note:
              </Text>
              <Text fontSize="sm" color="gray.600">
                {visit.ownerNotes}
              </Text>
            </Box>
          </>
        )}
      </CardBody>
    </Card>
  );

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={8}>
      <Container maxW="1200px">
        {/* Header */}
        <VStack spacing={6} mb={8}>
          <VStack spacing={2}>
            <Heading size="lg" color="gray.900">
              My Visit Requests
            </Heading>
            <Text color="gray.600" fontSize="sm">
              Manage your property visit schedules
            </Text>
          </VStack>
        </VStack>

        {/* Tabs */}
        <Tabs colorScheme="primary" isLazy>
          <TabList>
            <Tab>
              Pending
              {(pendingVisits.length + rescheduledVisits.length) > 0 && (
                <Badge ml={2} colorScheme="yellow" borderRadius="full">
                  {pendingVisits.length + rescheduledVisits.length}
                </Badge>
              )}
            </Tab>
            <Tab>
              Upcoming
              {upcomingVisits.length > 0 && (
                <Badge ml={2} colorScheme="green" borderRadius="full">
                  {upcomingVisits.length}
                </Badge>
              )}
            </Tab>
            <Tab>Past</Tab>
          </TabList>

          <TabPanels>
            {/* Pending Tab */}
            <TabPanel px={0} pt={6}>
              <VStack spacing={4} align="stretch">
                {[...pendingVisits, ...rescheduledVisits].length === 0 ? (
                  <Card>
                    <CardBody>
                      <VStack py={8} spacing={4}>
                        <Icon as={FiCalendar} boxSize={16} color="gray.300" />
                        <VStack spacing={1}>
                          <Text fontWeight="500" color="gray.600">
                            No Pending Requests
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            Schedule a visit to view properties
                          </Text>
                        </VStack>
                        <Button
                          colorScheme="primary"
                          onClick={() => navigate('/find-rentals')}
                          borderRadius="8px"
                        >
                          Browse Properties
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ) : (
                  [...pendingVisits, ...rescheduledVisits].map((visit) => renderVisitCard(visit))
                )}
              </VStack>
            </TabPanel>

            {/* Upcoming Tab */}
            <TabPanel px={0} pt={6}>
              <VStack spacing={4} align="stretch">
                {upcomingVisits.length === 0 ? (
                  <Card>
                    <CardBody>
                      <VStack py={8} spacing={4}>
                        <Icon as={FiCheckCircle} boxSize={16} color="gray.300" />
                        <VStack spacing={1}>
                          <Text fontWeight="500" color="gray.600">
                            No Upcoming Visits
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            Your approved visits will appear here
                          </Text>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                ) : (
                  upcomingVisits.map((visit) => renderVisitCard(visit))
                )}
              </VStack>
            </TabPanel>

            {/* Past Tab */}
            <TabPanel px={0} pt={6}>
              <VStack spacing={4} align="stretch">
                {pastVisits.length === 0 ? (
                  <Card>
                    <CardBody>
                      <VStack py={8} spacing={4}>
                        <Icon as={FiCalendar} boxSize={16} color="gray.300" />
                        <VStack spacing={1}>
                          <Text fontWeight="500" color="gray.600">
                            No Past Visits
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            Your visit history will appear here
                          </Text>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                ) : (
                  pastVisits.map((visit) => renderVisitCard(visit, false))
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Cancel Modal */}
        <Modal isOpen={isCancelOpen} onClose={onCancelClose}>
          <ModalOverlay />
          <ModalContent borderRadius="8px">
            <ModalHeader>Cancel Visit Request</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <Text fontSize="sm" color="gray.600">
                  Please provide a reason for cancelling this visit request.
                </Text>
                <Textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Reason for cancellation..."
                  rows={4}
                  borderRadius="8px"
                />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onCancelClose} borderRadius="8px">
                Close
              </Button>
              <Button colorScheme="red" onClick={handleCancelVisit} borderRadius="8px">
                Cancel Visit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Feedback Modal */}
        <Modal isOpen={isFeedbackOpen} onClose={onFeedbackClose}>
          <ModalOverlay />
          <ModalContent borderRadius="8px">
            <ModalHeader>Rate Your Visit</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <Text fontSize="sm" color="gray.600">
                  How was your visit experience?
                </Text>
                
                {/* Star Rating */}
                <HStack spacing={2} justify="center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      as={FiStar}
                      boxSize={8}
                      color={star <= rating ? 'yellow.400' : 'gray.300'}
                      fill={star <= rating ? 'yellow.400' : 'none'}
                      cursor="pointer"
                      onClick={() => setRating(star)}
                      transition="all 0.2s"
                      _hover={{ transform: 'scale(1.1)' }}
                    />
                  ))}
                </HStack>

                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your experience (optional)..."
                  rows={4}
                  borderRadius="8px"
                />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onFeedbackClose} borderRadius="8px">
                Close
              </Button>
              <Button colorScheme="primary" onClick={handleSubmitFeedback} borderRadius="8px">
                Submit Feedback
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default MyVisitsPage;
