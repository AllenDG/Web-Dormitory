import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Heading,
  Image,
  Icon,
  IconButton,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from '@chakra-ui/react';
import { FiX, FiCheck, FiMinus } from 'react-icons/fi';
import { colors, spacing, borderRadius, typography } from '../../../shared/styles/tokens';

/**
 * ComparisonPanel Component
 * Side-by-side property comparison
 */
const ComparisonPanel = ({ properties, onRemove, onClose }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const comparisonRows = [
    { label: 'Price', key: 'price', format: formatPrice },
    { label: 'Room Type', key: 'bedType' },
    { label: 'Capacity', key: 'availablePerson', suffix: ' persons' },
    { label: 'Location', key: 'city' },
    { label: 'WiFi', value: '50 Mbps' },
    { label: 'Air Conditioning', value: true },
    { label: 'Laundry', value: true },
    { label: 'Parking', value: false },
    { label: 'Kitchen', value: true },
    { label: 'Safety Score', value: '4.5/5' },
  ];

  if (properties.length === 0) {
    return null;
  }

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="white"
      borderTop={`2px solid ${colors.primary[700]}`}
      boxShadow="0 -4px 6px -1px rgba(0, 0, 0, 0.1)"
      zIndex={1000}
      maxH="70vh"
      overflowY="auto"
    >
      <Box p={spacing[6]}>
        {/* Header */}
        <Flex justifyContent="space-between" alignItems="center" mb={spacing[6]}>
          <Heading
            fontSize={typography.fontSize.xl}
            fontWeight={typography.fontWeight.semibold}
            color={colors.gray[900]}
          >
            Compare Properties ({properties.length}/3)
          </Heading>
          <IconButton
            icon={<Icon as={FiX} />}
            onClick={onClose}
            variant="ghost"
            size="sm"
            aria-label="Close comparison"
          />
        </Flex>

        {/* Comparison Table */}
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th
                  position="sticky"
                  left={0}
                  bg="white"
                  zIndex={1}
                  borderRight={`1px solid ${colors.gray[200]}`}
                  width="150px"
                >
                  Feature
                </Th>
                {properties.map((property) => (
                  <Th key={property.id} textAlign="center" minW="200px">
                    <VStack spacing={spacing[2]}>
                      <Image
                        src={property.imageUrl[0]}
                        alt={property.title}
                        w="full"
                        h="100px"
                        objectFit="cover"
                        borderRadius={borderRadius.md}
                      />
                      <Text
                        fontSize={typography.fontSize.sm}
                        fontWeight={typography.fontWeight.semibold}
                        noOfLines={1}
                      >
                        {property.title}
                      </Text>
                      <IconButton
                        icon={<Icon as={FiX} />}
                        size="xs"
                        variant="ghost"
                        onClick={() => onRemove(property.id)}
                        aria-label="Remove from comparison"
                      />
                    </VStack>
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {comparisonRows.map((row, index) => (
                <Tr key={index}>
                  <Td
                    position="sticky"
                    left={0}
                    bg="white"
                    zIndex={1}
                    borderRight={`1px solid ${colors.gray[200]}`}
                    fontWeight={typography.fontWeight.medium}
                    color={colors.gray[700]}
                  >
                    {row.label}
                  </Td>
                  {properties.map((property) => (
                    <Td key={property.id} textAlign="center">
                      {row.key ? (
                        <Text>
                          {row.format
                            ? row.format(property[row.key])
                            : property[row.key]}
                          {row.suffix || ''}
                        </Text>
                      ) : typeof row.value === 'boolean' ? (
                        <Icon
                          as={row.value ? FiCheck : FiMinus}
                          color={row.value ? colors.success : colors.gray[400]}
                          boxSize={5}
                        />
                      ) : (
                        <Text>{row.value}</Text>
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default ComparisonPanel;
