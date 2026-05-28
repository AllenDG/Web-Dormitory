import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Text,
  Flex,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import { FiMapPin, FiNavigation } from 'react-icons/fi';
import { colors, spacing, borderRadius, typography, shadows } from '../styles/tokens';

/**
 * LocationAutocomplete Component
 * Provides location search with autocomplete suggestions
 * TODO: Integrate with Mapbox or OpenStreetMap API
 */
const LocationAutocomplete = ({
  placeholder = 'Search location...',
  onSelect,
  showCurrentLocation = true,
  ...props
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Mock suggestions - Replace with actual API call
  const mockSuggestions = [
    { id: 1, name: 'Quezon City', type: 'City', coordinates: { lat: 14.6760, lng: 121.0437 } },
    { id: 2, name: 'Manila', type: 'City', coordinates: { lat: 14.5995, lng: 120.9842 } },
    { id: 3, name: 'Makati', type: 'City', coordinates: { lat: 14.5547, lng: 121.0244 } },
    { id: 4, name: 'Taguig', type: 'City', coordinates: { lat: 14.5176, lng: 121.0509 } },
    { id: 5, name: 'Pasig', type: 'City', coordinates: { lat: 14.5764, lng: 121.0851 } },
    { id: 6, name: 'University of the Philippines Diliman', type: 'University', coordinates: { lat: 14.6537, lng: 121.0685 } },
    { id: 7, name: 'Ateneo de Manila University', type: 'University', coordinates: { lat: 14.6392, lng: 121.0779 } },
    { id: 8, name: 'De La Salle University', type: 'University', coordinates: { lat: 14.5648, lng: 120.9932 } },
  ];

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const filtered = mockSuggestions.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered);
        setIsLoading(false);
        setIsOpen(true);
      }, 300);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleSelect = (suggestion) => {
    setQuery(suggestion.name);
    setIsOpen(false);
    if (onSelect) {
      onSelect(suggestion);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // TODO: Reverse geocode to get location name
          setQuery('Current Location');
          setIsLoading(false);
          if (onSelect) {
            onSelect({
              name: 'Current Location',
              type: 'Current',
              coordinates: { lat: latitude, lng: longitude },
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        }
      );
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <Box position="relative" width="100%" {...props}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={FiMapPin} color={colors.gray[400]} />
        </InputLeftElement>
        <Input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          bg="white"
          borderColor={colors.gray[200]}
          borderRadius={borderRadius.lg}
          fontSize={typography.fontSize.base}
          _focus={{
            borderColor: colors.primary[500],
            boxShadow: `0 0 0 1px ${colors.primary[500]}`,
          }}
          _placeholder={{
            color: colors.gray[400],
          }}
        />
      </InputGroup>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <Box
          ref={listRef}
          position="absolute"
          top="calc(100% + 8px)"
          left={0}
          right={0}
          bg="white"
          borderRadius={borderRadius.lg}
          boxShadow={shadows.lg}
          border={`1px solid ${colors.gray[200]}`}
          maxHeight="300px"
          overflowY="auto"
          zIndex={1000}
        >
          {showCurrentLocation && (
            <ListItem
              px={spacing[4]}
              py={spacing[3]}
              cursor="pointer"
              transition="background 0.2s"
              _hover={{ bg: colors.gray[50] }}
              onClick={handleCurrentLocation}
              borderBottom={`1px solid ${colors.gray[100]}`}
            >
              <Flex alignItems="center" gap={spacing[3]}>
                <Icon as={FiNavigation} color={colors.primary[500]} />
                <Box>
                  <Text
                    fontSize={typography.fontSize.sm}
                    fontWeight={typography.fontWeight.medium}
                    color={colors.primary[700]}
                  >
                    Use Current Location
                  </Text>
                </Box>
              </Flex>
            </ListItem>
          )}

          {isLoading ? (
            <Flex justifyContent="center" py={spacing[6]}>
              <Spinner size="sm" color={colors.primary[500]} />
            </Flex>
          ) : suggestions.length > 0 ? (
            <List>
              {suggestions.map((suggestion, index) => (
                <ListItem
                  key={suggestion.id}
                  px={spacing[4]}
                  py={spacing[3]}
                  cursor="pointer"
                  bg={selectedIndex === index ? colors.gray[50] : 'transparent'}
                  transition="background 0.2s"
                  _hover={{ bg: colors.gray[50] }}
                  onClick={() => handleSelect(suggestion)}
                >
                  <Flex alignItems="center" gap={spacing[3]}>
                    <Icon as={FiMapPin} color={colors.gray[400]} />
                    <Box flex="1">
                      <Text
                        fontSize={typography.fontSize.sm}
                        fontWeight={typography.fontWeight.medium}
                        color={colors.gray[900]}
                      >
                        {suggestion.name}
                      </Text>
                      <Text
                        fontSize={typography.fontSize.xs}
                        color={colors.gray[500]}
                      >
                        {suggestion.type}
                      </Text>
                    </Box>
                  </Flex>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box px={spacing[4]} py={spacing[6]} textAlign="center">
              <Text fontSize={typography.fontSize.sm} color={colors.gray[500]}>
                No locations found
              </Text>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default LocationAutocomplete;
