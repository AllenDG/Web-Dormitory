import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  Divider,
  Badge,
} from '@chakra-ui/react';
import {
  FaCheck,
  FaTimes,
  FaClock,
  FaUsers,
  FaDog,
  FaSmoking,
  FaParking,
} from 'react-icons/fa';
import PropTypes from 'prop-types';

/**
 * House Rules Display Component
 * Displays property house rules and policies
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.rules - House rules object
 * @param {boolean} props.compact - Compact display mode
 */
const HouseRulesDisplay = ({ rules, compact = false }) => {
  if (!rules) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">No house rules set for this property</Text>
      </Box>
    );
  }

  const RuleItem = ({ icon, text, type = 'do' }) => (
    <HStack spacing={3} align="start">
      <Icon
        as={type === 'do' ? FaCheck : FaTimes}
        color={type === 'do' ? 'green.500' : 'red.500'}
        boxSize={4}
        mt={1}
      />
      <Text fontSize="sm" color="gray.700">
        {text}
      </Text>
    </HStack>
  );

  const PolicyCard = ({ icon, title, children }) => (
    <Box p={4} bg="gray.50" borderRadius="8px">
      <HStack spacing={2} mb={3}>
        <Icon as={icon} color="blue.500" boxSize={5} />
        <Text fontWeight="semibold" fontSize="sm">
          {title}
        </Text>
      </HStack>
      {children}
    </Box>
  );

  if (compact) {
    return (
      <VStack spacing={4} align="stretch">
        {/* Quick Summary */}
        <SimpleGrid columns={[2, 4]} spacing={3}>
          {rules.checkInTime && (
            <HStack spacing={2}>
              <Icon as={FaClock} color="gray.500" boxSize={4} />
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" color="gray.500">
                  Check-in
                </Text>
                <Text fontSize="sm" fontWeight="medium">
                  {rules.checkInTime}
                </Text>
              </VStack>
            </HStack>
          )}
          {rules.checkOutTime && (
            <HStack spacing={2}>
              <Icon as={FaClock} color="gray.500" boxSize={4} />
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" color="gray.500">
                  Check-out
                </Text>
                <Text fontSize="sm" fontWeight="medium">
                  {rules.checkOutTime}
                </Text>
              </VStack>
            </HStack>
          )}
          {rules.petPolicy && (
            <HStack spacing={2}>
              <Icon as={FaDog} color="gray.500" boxSize={4} />
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" color="gray.500">
                  Pets
                </Text>
                <Text fontSize="sm" fontWeight="medium">
                  {rules.petPolicy.allowed ? 'Allowed' : 'Not Allowed'}
                </Text>
              </VStack>
            </HStack>
          )}
          {rules.smokingPolicy && (
            <HStack spacing={2}>
              <Icon as={FaSmoking} color="gray.500" boxSize={4} />
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" color="gray.500">
                  Smoking
                </Text>
                <Text fontSize="sm" fontWeight="medium">
                  {rules.smokingPolicy.allowed ? 'Allowed' : 'Not Allowed'}
                </Text>
              </VStack>
            </HStack>
          )}
        </SimpleGrid>
      </VStack>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Do's and Don'ts */}
        <SimpleGrid columns={[1, 2]} spacing={6}>
          {/* Do's */}
          {rules.do && rules.do.length > 0 && (
            <Box>
              <Heading size="sm" mb={4} color="green.600">
                Do's
              </Heading>
              <VStack spacing={3} align="stretch">
                {rules.do.map((rule, index) => (
                  <RuleItem key={index} text={rule} type="do" />
                ))}
              </VStack>
            </Box>
          )}

          {/* Don'ts */}
          {rules.dont && rules.dont.length > 0 && (
            <Box>
              <Heading size="sm" mb={4} color="red.600">
                Don'ts
              </Heading>
              <VStack spacing={3} align="stretch">
                {rules.dont.map((rule, index) => (
                  <RuleItem key={index} text={rule} type="dont" />
                ))}
              </VStack>
            </Box>
          )}
        </SimpleGrid>

        <Divider />

        {/* Check-in/Check-out */}
        {(rules.checkInTime || rules.checkOutTime) && (
          <PolicyCard icon={FaClock} title="Check-in & Check-out">
            <VStack spacing={2} align="stretch">
              {rules.checkInTime && (
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Check-in time:
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {rules.checkInTime}
                  </Text>
                </HStack>
              )}
              {rules.checkOutTime && (
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Check-out time:
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {rules.checkOutTime}
                  </Text>
                </HStack>
              )}
            </VStack>
          </PolicyCard>
        )}

        {/* Quiet Hours */}
        {(rules.quietHoursStart || rules.quietHoursEnd) && (
          <PolicyCard icon={FaClock} title="Quiet Hours">
            <Text fontSize="sm" color="gray.700">
              {rules.quietHoursStart} - {rules.quietHoursEnd}
            </Text>
          </PolicyCard>
        )}

        {/* Guest Policy */}
        {rules.guestPolicy && (
          <PolicyCard icon={FaUsers} title="Guest Policy">
            <VStack spacing={2} align="stretch">
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  Guests allowed:
                </Text>
                <Badge colorScheme={rules.guestPolicy.allowed ? 'green' : 'red'}>
                  {rules.guestPolicy.allowed ? 'Yes' : 'No'}
                </Badge>
              </HStack>
              {rules.guestPolicy.allowed && (
                <>
                  {rules.guestPolicy.maxGuests && (
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        Maximum guests:
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {rules.guestPolicy.maxGuests}
                      </Text>
                    </HStack>
                  )}
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.600">
                      Overnight guests:
                    </Text>
                    <Badge
                      colorScheme={rules.guestPolicy.overnightAllowed ? 'green' : 'red'}
                    >
                      {rules.guestPolicy.overnightAllowed ? 'Allowed' : 'Not Allowed'}
                    </Badge>
                  </HStack>
                </>
              )}
            </VStack>
          </PolicyCard>
        )}

        {/* Pet Policy */}
        {rules.petPolicy && (
          <PolicyCard icon={FaDog} title="Pet Policy">
            <VStack spacing={2} align="stretch">
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  Pets allowed:
                </Text>
                <Badge colorScheme={rules.petPolicy.allowed ? 'green' : 'red'}>
                  {rules.petPolicy.allowed ? 'Yes' : 'No'}
                </Badge>
              </HStack>
              {rules.petPolicy.allowed && (
                <>
                  {rules.petPolicy.types && rules.petPolicy.types.length > 0 && (
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        Allowed types:
                      </Text>
                      <HStack spacing={2} flexWrap="wrap">
                        {rules.petPolicy.types.map((type, index) => (
                          <Badge key={index}>{type}</Badge>
                        ))}
                      </HStack>
                    </Box>
                  )}
                  {rules.petPolicy.deposit > 0 && (
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        Pet deposit:
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        ₱{rules.petPolicy.deposit.toLocaleString()}
                      </Text>
                    </HStack>
                  )}
                </>
              )}
            </VStack>
          </PolicyCard>
        )}

        {/* Smoking Policy */}
        {rules.smokingPolicy && (
          <PolicyCard icon={FaSmoking} title="Smoking Policy">
            <VStack spacing={2} align="stretch">
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  Smoking allowed:
                </Text>
                <Badge colorScheme={rules.smokingPolicy.allowed ? 'yellow' : 'green'}>
                  {rules.smokingPolicy.allowed ? 'In Designated Areas' : 'No Smoking'}
                </Badge>
              </HStack>
              {rules.smokingPolicy.allowed &&
                rules.smokingPolicy.designatedAreas &&
                rules.smokingPolicy.designatedAreas.length > 0 && (
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      Designated areas:
                    </Text>
                    <VStack spacing={1} align="start">
                      {rules.smokingPolicy.designatedAreas.map((area, index) => (
                        <Text key={index} fontSize="sm">
                          • {area}
                        </Text>
                      ))}
                    </VStack>
                  </Box>
                )}
            </VStack>
          </PolicyCard>
        )}

        {/* Parking Policy */}
        {rules.parkingPolicy && (
          <PolicyCard icon={FaParking} title="Parking">
            <VStack spacing={2} align="stretch">
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  Parking available:
                </Text>
                <Badge colorScheme={rules.parkingPolicy.available ? 'green' : 'red'}>
                  {rules.parkingPolicy.available ? 'Yes' : 'No'}
                </Badge>
              </HStack>
              {rules.parkingPolicy.available && (
                <>
                  {rules.parkingPolicy.spaces > 0 && (
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        Available spaces:
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {rules.parkingPolicy.spaces}
                      </Text>
                    </HStack>
                  )}
                  {rules.parkingPolicy.fee > 0 && (
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        Parking fee:
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        ₱{rules.parkingPolicy.fee.toLocaleString()}/month
                      </Text>
                    </HStack>
                  )}
                </>
              )}
            </VStack>
          </PolicyCard>
        )}

        {/* Additional Policies */}
        {rules.additionalPolicies && rules.additionalPolicies.trim() && (
          <Box>
            <Heading size="sm" mb={3}>
              Additional Policies
            </Heading>
            <Text fontSize="sm" color="gray.700" whiteSpace="pre-wrap">
              {rules.additionalPolicies}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

HouseRulesDisplay.propTypes = {
  rules: PropTypes.object,
  compact: PropTypes.bool,
};

export default HouseRulesDisplay;
