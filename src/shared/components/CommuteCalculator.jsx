import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Button,
  Divider,
  Badge,
} from '@chakra-ui/react';
import {
  FiNavigation,
  FiClock,
  FiTrendingUp,
  FiMapPin,
} from 'react-icons/fi';
import { LocationAutocomplete } from './index';
import { colors, spacing, borderRadius, typography } from '../styles/tokens';

/**
 * CommuteCalculator Component
 * Calculates commute time and routes to destinations
 */
const CommuteCalculator = ({ propertyLocation }) => {
  const [destination, setDestination] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Mock commute data
  const commuteOptions = [
    {
      id: 1,
      mode: 'Walking',
      icon: '🚶',
      duration: '15 mins',
      distance: '1.2 km',
      cost: 'Free',
      color: colors.success,
    },
    {
      id: 2,
      mode: 'Jeepney',
      icon: '🚌',
      duration: '8 mins',
      distance: '1.2 km',
      cost: '₱12',
      color: colors.primary[700],
    },
    {
      id: 3,
      mode: 'Tricycle',
      icon: '🛺',
      duration: '6 mins',
      distance: '1.2 km',
      cost: '₱20',
      color: colors.warning,
    },
    {
      id: 4,
      mode: 'Grab/Taxi',
      icon: '🚗',
      duration: '5 mins',
      distance: '1.2 km',
      cost: '₱50-80',
      color: colors.info,
    },
  ];

  const handleCalculate = () => {
    if (destination) {
      setShowResults(true);
    }
  };

  const handleDestinationSelect = (location) => {
    setDestination(location);
    setShowResults(false);
  };

  return (
    <Box
      bg="white"
      borderRadius={borderRadius.lg}
      border={`1px solid ${colors.gray[200]}`}
      p={spacing[6]}
    >
      <VStack align="stretch" spacing={spacing[4]}>
        <HStack spacing={spacing[2]}>
          <Icon as={FiNavigation} color={colors.primary[700]} boxSize={5} />
          <Text
            fontSize={typography.fontSize.lg}
            fontWeight={typography.fontWeight.semibold}
            color={colors.gray[900]}
          >
            Commute Calculator
          </Text>
        </HStack>

        <Divider />

        {/* From Location */}
        <Box>
          <Text
            fontSize={typography.fontSize.sm}
            fontWeight={typography.fontWeight.medium}
            color={colors.gray[700]}
            mb={spacing[2]}
          >
            From (Property Location)
          </Text>
          <HStack
            p={spacing[3]}
            bg={colors.gray[50]}
            borderRadius={borderRadius.md}
            spacing={spacing[2]}
          >
            <Icon as={FiMapPin} color={colors.gray[500]} />
            <Text fontSize={typography.fontSize.sm} color={colors.gray[700]}>
              {propertyLocation || 'Quezon City, Metro Manila'}
            </Text>
          </HStack>
        </Box>

        {/* To Location */}
        <Box>
          <Text
            fontSize={typography.fontSize.sm}
            fontWeight={typography.fontWeight.medium}
            color={colors.gray[700]}
            mb={spacing[2]}
          >
            To (Your Destination)
          </Text>
          <LocationAutocomplete
            placeholder="Enter destination (e.g., UP Diliman)"
            onSelect={handleDestinationSelect}
            showCurrentLocation={false}
          />
        </Box>

        {/* Calculate Button */}
        <Button
          bg={colors.primary[700]}
          color="white"
          onClick={handleCalculate}
          isDisabled={!destination}
          _hover={{
            bg: colors.primary[800],
          }}
          _disabled={{
            bg: colors.gray[300],
            cursor: 'not-allowed',
          }}
        >
          Calculate Commute
        </Button>

        {/* Results */}
        {showResults && destination && (
          <>
            <Divider />
            
            <Box>
              <HStack spacing={spacing[2]} mb={spacing[3]}>
                <Icon as={FiTrendingUp} color={colors.primary[700]} />
                <Text
                  fontSize={typography.fontSize.base}
                  fontWeight={typography.fontWeight.semibold}
                  color={colors.gray[900]}
                >
                  Commute Options to {destination.name}
                </Text>
              </HStack>

              <VStack align="stretch" spacing={spacing[3]}>
                {commuteOptions.map((option) => (
                  <Box
                    key={option.id}
                    p={spacing[4]}
                    borderRadius={borderRadius.md}
                    border={`1px solid ${colors.gray[200]}`}
                    transition="all 0.2s"
                    _hover={{
                      borderColor: option.color,
                      boxShadow: `0 0 0 1px ${option.color}`,
                    }}
                  >
                    <HStack justify="space-between" align="start">
                      <HStack spacing={spacing[3]} flex="1">
                        <Text fontSize="24px">{option.icon}</Text>
                        <VStack align="start" spacing={spacing[1]}>
                          <Text
                            fontSize={typography.fontSize.sm}
                            fontWeight={typography.fontWeight.semibold}
                            color={colors.gray[900]}
                          >
                            {option.mode}
                          </Text>
                          <HStack spacing={spacing[3]} flexWrap="wrap">
                            <HStack spacing={spacing[1]}>
                              <Icon as={FiClock} boxSize={3} color={colors.gray[500]} />
                              <Text fontSize={typography.fontSize.xs} color={colors.gray[600]}>
                                {option.duration}
                              </Text>
                            </HStack>
                            <Text fontSize={typography.fontSize.xs} color={colors.gray[500]}>
                              • {option.distance}
                            </Text>
                          </HStack>
                        </VStack>
                      </HStack>
                      <Badge
                        colorScheme="green"
                        px={spacing[2]}
                        py={spacing[1]}
                        borderRadius={borderRadius.sm}
                      >
                        {option.cost}
                      </Badge>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </Box>

            {/* Best Option Recommendation */}
            <Box
              p={spacing[4]}
              bg={colors.primary[50]}
              borderRadius={borderRadius.md}
              borderLeft={`4px solid ${colors.primary[700]}`}
            >
              <Text
                fontSize={typography.fontSize.sm}
                color={colors.gray[700]}
                lineHeight={typography.lineHeight.relaxed}
              >
                <Text as="span" fontWeight={typography.fontWeight.semibold}>
                  💡 Recommended:
                </Text>{' '}
                Take a jeepney for the best balance of cost and time. Walking is great
                for exercise and saves money!
              </Text>
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default CommuteCalculator;
