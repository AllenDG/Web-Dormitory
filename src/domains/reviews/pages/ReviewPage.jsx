import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardBody,
  Heading,
  Text,
  VStack,
  Button,
  Icon,
} from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';
import { ReviewForm } from '../components';
import useRentalStore from '../../../shared/stores/useRentalStore';
import { PageContainer } from '../../../shared/components';
import { useAuth } from '../../../app/providers/AuthProvider';

/**
 * Review Page
 * Dedicated page for writing property reviews
 * 
 * @component
 */
const ReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getRentalById } = useRentalStore();
  
  const property = getRentalById(id);

  // Redirect if not authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  // Handle property not found
  if (!property) {
    return (
      <Box py={12}>
        <PageContainer>
          <Card>
            <CardBody>
              <VStack spacing={4}>
                <Heading size="md">Property Not Found</Heading>
                <Text color="gray.600">
                  The property you're trying to review doesn't exist.
                </Text>
                <Button onClick={() => navigate('/find-rentals')} colorScheme="primary">
                  Browse Properties
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </PageContainer>
      </Box>
    );
  }

  const handleSuccess = () => {
    // Navigate back to property detail page after successful review
    navigate(`/listing/${id}`);
  };

  const handleCancel = () => {
    // Navigate back to property detail page
    navigate(`/listing/${id}`);
  };

  return (
    <Box>
      {/* Header */}
      <Box bg="gray.50" py={4}>
        <PageContainer>
          <Button
            leftIcon={<Icon as={FiArrowLeft} />}
            variant="ghost"
            onClick={() => navigate(`/listing/${id}`)}
            size="sm"
          >
            Back to Property
          </Button>
        </PageContainer>
      </Box>

      {/* Main Content */}
      <Box py={8}>
        <Container maxW="container.md">
          <Card>
            <CardBody p={8}>
              <ReviewForm
                propertyId={id}
                propertyTitle={property.title}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </CardBody>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default ReviewPage;
