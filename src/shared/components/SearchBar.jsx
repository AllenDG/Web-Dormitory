import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';

/**
 * Modern Search Bar Component
 * Minimalist design with accessible colors
 */
const SearchBar = ({
  placeholder = 'Search...',
  value,
  onChange,
  onSubmit,
  size = 'lg',
  ...props
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(value);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} w="full" {...props}>
      <InputGroup size={size}>
        <InputLeftElement pointerEvents="none" h="full">
          <Icon as={FiSearch} color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          bg={useColorModeValue('white', 'gray.800')}
          borderColor="gray.200"
          borderRadius="md"
          _hover={{
            borderColor: 'gray.300',
          }}
          _focus={{
            borderColor: 'primary.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
          }}
          _placeholder={{
            color: 'gray.400',
          }}
        />
      </InputGroup>
    </Box>
  );
};

export default SearchBar;
