import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Badge,
  Divider,
} from '@chakra-ui/react';
import {
  FiMapPin,
  FiBook,
  FiActivity,
  FiShoppingCart,
  FiCoffee,
} from 'react-icons/fi';
import { colors, spacing, borderRadius, typography } from '../styles/tokens';

/**
 * NearbyPlaces Component
 * Displays nearby establishments and points of interest
 */
const NearbyPlaces = ({ location, radius = 2 }) => {
  // Mock nearby places data
  const nearbyPlaces = [
    {
      id: 1,
      name: 'University of the Philippines Diliman',
      type: 'university',
      distance: '0.5 km',
      walkTime: '6 mins',
      icon: FiBook,
      color: colors.primary[700],
    },
    {
      id: 2,
      name: 'Ateneo de Manila University',
      type: 'university',
      distance: '1.2 km',
      walkTime: '15 mins',
      icon: FiBook,
      color: colors.primary[700],
    },
    {
      id: 3,
      name: 'SM North EDSA',
      type: 'mall',
      distance: '2.5 km',
      walkTime: '8 mins by jeep',
      icon: FiShoppingCart,
      color: colors.success,
    },
    {
      id: 4,
      name: 'Quezon Memorial Circle',
      type: 'park',
      distance: '1.8 km',
      walkTime: '22 mins',
      icon: FiActivity,
      color: colors.info,
    },
    {
      id: 5,
      name: 'Starbucks Katipunan',
      type: 'cafe',
      distance: '0.8 km',
      walkTime: '10 mins',
      icon: FiCoffee,
      color: colors.warning,
    },
    {
      id: 6,
      name: 'Veterans Memorial Medical Center',
      type: 'hospital',
      distance: '3.0 km',
      walkTime: '10 mins by jeep',
      icon: FiActivity,
      color: colors.error,
    },
  ];

  const getCategoryLabel = (type) => {
    const labels = {
      university: 'University',
      mall: 'Shopping',
      park: 'Recreation',
      cafe: 'Food & Drink',
      hospital: 'Healthcare',
    };
    return labels[type] || type;
  };

  return (
    <Box
      bg="white"
      borderRadius={borderRadius.lg}
      border={`1px solid ${colors.gray[200]}`}
      p={spacing[6]}
    >
      <VStack align="stretch" spacing={spacing[4]}>
        <HStack justify="space-between">
          <Text
            fontSize={typography.fontSize.lg}
            fontWeight={typography.fontWeight.semibold}
            color={colors.gray[900]}
          >
            Nearby Places
          </Text>
          <Badge
            colorScheme="blue"
            px={spacing[2]}
            py={spacing[1]}
            borderRadius={borderRadius.sm}
          >
            Within {radius} km
          </Badge>
        </HStack>

        <Divider />

        <VStack align="stretch" spacing={spacing[3]}>
          {nearbyPlaces.map((place, index) => (
            <Box key={place.id}>
              <HStack spacing={spacing[3]} align="start">
                <Box
                  p={spacing[2]}
                  borderRadius={borderRadius.md}
                  bg={`${place.color}15`}
                  flexShrink={0}
                >
                  <Icon as={place.icon} color={place.color} boxSize={5} />
                </Box>

                <VStack align="start" spacing={spacing[1]} flex="1">
                  <Text
                    fontSize={typography.fontSize.sm}
                    fontWeight={typography.fontWeight.medium}
                    color={colors.gray[900]}
                  >
                    {place.name}
                  </Text>
                  <HStack spacing={spacing[2]} flexWrap="wrap">
                    <Badge
                      fontSize="xs"
                      colorScheme="gray"
                      variant="subtle"
                    >
                      {getCategoryLabel(place.type)}
                    </Badge>
                    <HStack spacing={spacing[1]}>
                      <Icon as={FiMapPin} boxSize={3} color={colors.gray[500]} />
                      <Text fontSize={typography.fontSize.xs} color={colors.gray[600]}>
                        {place.distance}
                      </Text>
                    </HStack>
                    <Text fontSize={typography.fontSize.xs} color={colors.gray[500]}>
                      • {place.walkTime}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
              {index < nearbyPlaces.length - 1 && <Divider mt={spacing[3]} />}
            </Box>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default NearbyPlaces;
