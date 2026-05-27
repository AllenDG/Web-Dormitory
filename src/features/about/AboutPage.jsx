import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Avatar,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiTarget, FiEye, FiAward } from 'react-icons/fi';
import { Section, Card, Container } from '../../shared/components';

const MotionBox = motion(Box);

const team = [
  {
    name: 'Maria Santos',
    role: 'CEO & Founder',
    image: 'https://i.pravatar.cc/150?img=1',
    bio: 'Passionate about making student housing accessible and affordable.',
  },
  {
    name: 'Juan Dela Cruz',
    role: 'CTO',
    image: 'https://i.pravatar.cc/150?img=2',
    bio: 'Tech enthusiast building innovative solutions for students.',
  },
  {
    name: 'Ana Reyes',
    role: 'Head of Operations',
    image: 'https://i.pravatar.cc/150?img=3',
    bio: 'Ensuring smooth operations and excellent customer service.',
  },
  {
    name: 'Carlos Mendoza',
    role: 'Marketing Director',
    image: 'https://i.pravatar.cc/150?img=4',
    bio: 'Connecting students with their perfect homes.',
  },
];

const values = [
  {
    icon: FiTarget,
    title: 'Our Mission',
    description:
      'To simplify the student housing search process and connect students with safe, affordable, and comfortable accommodations near their campuses.',
    color: 'blue.500',
  },
  {
    icon: FiEye,
    title: 'Our Vision',
    description:
      'To become the leading platform for student accommodation in the Philippines, making quality housing accessible to every student.',
    color: 'purple.500',
  },
  {
    icon: FiAward,
    title: 'Our Values',
    description:
      'Transparency, trust, and student-first approach guide everything we do. We believe every student deserves a great place to call home.',
    color: 'green.500',
  },
];

/**
 * Modern About Us Page
 */
const AboutPage = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box>
      {/* Hero Section */}
      <Section
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        _dark={{ bg: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)' }}
        py={{ base: 16, md: 20 }}
      >
        <VStack spacing={6} textAlign="center" color="white">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heading
              as="h1"
              fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
              fontWeight="bold"
            >
              About Dormy
            </Heading>
          </MotionBox>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Text fontSize={{ base: 'lg', md: 'xl' }} maxW="3xl" opacity={0.9}>
              We're on a mission to make finding student accommodation as easy as
              possible. Founded by students, for students.
            </Text>
          </MotionBox>
        </VStack>
      </Section>

      {/* Story Section */}
      <Section>
        <Container size="lg">
          <VStack spacing={8} textAlign="center">
            <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }}>
              Our Story
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color="gray.600"
              _dark={{ color: 'gray.400' }}
              maxW="3xl"
              lineHeight="tall"
            >
              Dormy was born from a simple frustration: finding student housing
              shouldn't be this hard. As students ourselves, we experienced the
              stress of searching through countless listings, dealing with
              unresponsive landlords, and worrying about safety and affordability.
              <br />
              <br />
              In 2024, we decided to build the platform we wished existed. Today,
              Dormy connects thousands of students with verified, quality
              accommodations across the Philippines. We've made it our mission to
              ensure every student can find a safe, comfortable, and affordable
              place to call home during their academic journey.
            </Text>
          </VStack>
        </Container>
      </Section>

      {/* Values Section */}
      <Section bg={bgColor}>
        <VStack spacing={12}>
          <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }} textAlign="center">
            What Drives Us
          </Heading>
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={{ base: 6, md: 8 }}
            w="full"
          >
            {values.map((value, index) => (
              <MotionBox
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hover padding={8} h="full">
                  <VStack align="start" spacing={4}>
                    <Box
                      p={3}
                      borderRadius="lg"
                      bg={`${value.color.split('.')[0]}.50`}
                      _dark={{ bg: `${value.color.split('.')[0]}.900` }}
                    >
                      <Icon as={value.icon} boxSize={6} color={value.color} />
                    </Box>
                    <Heading as="h3" size="md">
                      {value.title}
                    </Heading>
                    <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                      {value.description}
                    </Text>
                  </VStack>
                </Card>
              </MotionBox>
            ))}
          </SimpleGrid>
        </VStack>
      </Section>

      {/* Team Section */}
      <Section>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }}>
              Meet Our Team
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color="gray.600"
              _dark={{ color: 'gray.400' }}
              maxW="2xl"
            >
              A passionate group of individuals dedicated to revolutionizing
              student housing.
            </Text>
          </VStack>

          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 4 }}
            spacing={{ base: 6, md: 8 }}
            w="full"
          >
            {team.map((member, index) => (
              <MotionBox
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hover padding={6} textAlign="center">
                  <VStack spacing={4}>
                    <Avatar src={member.image} size="2xl" name={member.name} />
                    <VStack spacing={1}>
                      <Heading as="h3" size="md">
                        {member.name}
                      </Heading>
                      <Text
                        fontSize="sm"
                        color="primary.500"
                        fontWeight="medium"
                      >
                        {member.role}
                      </Text>
                    </VStack>
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      _dark={{ color: 'gray.400' }}
                    >
                      {member.bio}
                    </Text>
                  </VStack>
                </Card>
              </MotionBox>
            ))}
          </SimpleGrid>
        </VStack>
      </Section>

      {/* Stats Section */}
      <Section bg={bgColor}>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
          {[
            { label: 'Active Listings', value: '500+' },
            { label: 'Happy Students', value: '2,000+' },
            { label: 'Partner Universities', value: '50+' },
            { label: 'Cities Covered', value: '25+' },
          ].map((stat, index) => (
            <MotionBox
              key={stat.label}
              textAlign="center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Heading
                as="h3"
                fontSize={{ base: '3xl', md: '4xl' }}
                color="primary.500"
                mb={2}
              >
                {stat.value}
              </Heading>
              <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                {stat.label}
              </Text>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Section>
    </Box>
  );
};

export default AboutPage;
