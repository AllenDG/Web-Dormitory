import {
  Box,
  Heading,
  Text,
  Stack,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  Badge,
  SimpleGrid,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiTrendingUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button, Container } from '../../../shared/components';

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

/**
 * Modern Hero Section with Search
 */
const HeroSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/find-rentals?q=${encodeURIComponent(searchQuery)}`);
  };

  const popularLocations = ['Dagupan', 'Manila', 'Quezon City', 'Makati'];
  const stats = [
    { label: 'Properties', value: '500+' },
    { label: 'Happy Tenants', value: '2,000+' },
    { label: 'Cities', value: '50+' },
  ];

  return (
    <Box
      position="relative"
      minH={{ base: '90vh', md: '85vh' }}
      display="flex"
      alignItems="center"
      overflow="hidden"
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      _dark={{
        bg: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
      }}
    >
      {/* Animated Background Elements */}
      <MotionBox
        position="absolute"
        top="-10%"
        right="-5%"
        w="500px"
        h="500px"
        borderRadius="full"
        bg="whiteAlpha.100"
        filter="blur(80px)"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <MotionBox
        position="absolute"
        bottom="-10%"
        left="-5%"
        w="400px"
        h="400px"
        borderRadius="full"
        bg="whiteAlpha.100"
        filter="blur(80px)"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <Container size="xl" position="relative" zIndex={1}>
        <Stack spacing={8} align="center" textAlign="center" color="white">
          {/* Main Heading */}
          <MotionHeading
            as="h1"
            fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
            fontWeight="bold"
            lineHeight="shorter"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Find Your Perfect
            <Text as="span" display="block" color="yellow.300">
              Student Home
            </Text>
          </MotionHeading>

          {/* Subtitle */}
          <MotionText
            fontSize={{ base: 'lg', md: 'xl' }}
            maxW="2xl"
            opacity={0.9}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover comfortable, affordable dormitories and apartments near your
            campus. Your ideal student living space is just a search away.
          </MotionText>

          {/* Search Bar */}
          <MotionBox
            as="form"
            onSubmit={handleSearch}
            w="full"
            maxW="2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <HStack spacing={3}>
              <InputGroup size="lg" flex={1}>
                <InputLeftElement pointerEvents="none">
                  <FiSearch color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search by location, university, or property name..."
                  bg="white"
                  color="gray.800"
                  border="none"
                  _placeholder={{ color: 'gray.500' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  borderRadius="xl"
                  boxShadow="xl"
                />
              </InputGroup>
              <Button
                type="submit"
                size="lg"
                colorScheme="yellow"
                px={8}
                borderRadius="xl"
                boxShadow="xl"
              >
                Search
              </Button>
            </HStack>
          </MotionBox>

          {/* Popular Locations */}
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <HStack spacing={2} flexWrap="wrap" justify="center">
              <Text fontSize="sm" opacity={0.8}>
                Popular:
              </Text>
              {popularLocations.map((location) => (
                <Badge
                  key={location}
                  colorScheme="whiteAlpha"
                  px={3}
                  py={1}
                  borderRadius="full"
                  cursor="pointer"
                  onClick={() => navigate(`/find-rentals?city=${location}`)}
                  _hover={{ bg: 'whiteAlpha.300' }}
                  transition="all 0.2s"
                >
                  <HStack spacing={1}>
                    <FiMapPin size={12} />
                    <Text>{location}</Text>
                  </HStack>
                </Badge>
              ))}
            </HStack>
          </MotionBox>

          {/* Stats */}
          <SimpleGrid
            columns={{ base: 3, md: 3 }}
            spacing={{ base: 4, md: 8 }}
            w="full"
            maxW="2xl"
            pt={8}
          >
            {stats.map((stat, index) => (
              <MotionBox
                key={stat.label}
                textAlign="center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <HStack justify="center" mb={2}>
                  <FiTrendingUp />
                  <Heading size="lg">{stat.value}</Heading>
                </HStack>
                <Text fontSize="sm" opacity={0.8}>
                  {stat.label}
                </Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;
