import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Section, Button } from '../../../shared/components';

const MotionBox = motion(Box);

/**
 * Call-to-Action Section
 */
const CTASection = () => {
  const navigate = useNavigate();
  const bgGradient = useColorModeValue(
    'linear(to-r, primary.500, purple.500)',
    'linear(to-r, primary.600, purple.600)'
  );

  return (
    <Section bg="transparent" py={{ base: 16, md: 20 }}>
      <MotionBox
        bgGradient={bgGradient}
        borderRadius="2xl"
        p={{ base: 8, md: 12, lg: 16 }}
        position="relative"
        overflow="hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Pattern */}
        <Box
          position="absolute"
          top="-50%"
          right="-10%"
          w="400px"
          h="400px"
          borderRadius="full"
          bg="whiteAlpha.100"
          filter="blur(80px)"
        />
        <Box
          position="absolute"
          bottom="-50%"
          left="-10%"
          w="300px"
          h="300px"
          borderRadius="full"
          bg="whiteAlpha.100"
          filter="blur(80px)"
        />

        <VStack
          spacing={6}
          textAlign="center"
          color="white"
          position="relative"
          zIndex={1}
        >
          <Heading
            as="h2"
            fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
            fontWeight="bold"
          >
            Ready to Find Your Home?
          </Heading>
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            maxW="2xl"
            opacity={0.9}
          >
            Join thousands of students who have found their perfect accommodation
            through Dormy. Start your search today!
          </Text>
          <HStack spacing={4} pt={4} flexWrap="wrap" justify="center">
            <Button
              size="lg"
              colorScheme="whiteAlpha"
              bg="white"
              color="primary.600"
              _hover={{ bg: 'gray.100' }}
              rightIcon={<FiArrowRight />}
              onClick={() => navigate('/find-rentals')}
              px={8}
            >
              Browse Properties
            </Button>
            <Button
              size="lg"
              variant="outline"
              borderColor="white"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
              onClick={() => navigate('/how-it-works')}
              px={8}
            >
              Learn More
            </Button>
          </HStack>
        </VStack>
      </MotionBox>
    </Section>
  );
};

export default CTASection;
