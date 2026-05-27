import {
  Box,
  Heading,
  Text,
  VStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiAlertCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Section, Container, Button } from '../../shared/components';

/**
 * 404 Not Found Page
 */
const NotFoundPage = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="80vh" display="flex" alignItems="center" bg={bgColor}>
      <Section>
        <Container>
          <VStack spacing={8} textAlign="center">
            <Icon as={FiAlertCircle} boxSize={24} color="primary.500" />
            <VStack spacing={4}>
              <Heading
                as="h1"
                fontSize={{ base: '6xl', md: '8xl' }}
                fontWeight="bold"
                bgGradient="linear(to-r, primary.500, purple.500)"
                bgClip="text"
              >
                404
              </Heading>
              <Heading as="h2" fontSize={{ base: '2xl', md: '3xl' }}>
                Page Not Found
              </Heading>
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                color="gray.600"
                _dark={{ color: 'gray.400' }}
                maxW="md"
              >
                Oops! The page you're looking for doesn't exist. It might have
                been moved or deleted.
              </Text>
            </VStack>
            <VStack spacing={3}>
              <Button
                colorScheme="primary"
                size="lg"
                onClick={() => navigate('/')}
              >
                Go to Homepage
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
            </VStack>
          </VStack>
        </Container>
      </Section>
    </Box>
  );
};

export default NotFoundPage;
