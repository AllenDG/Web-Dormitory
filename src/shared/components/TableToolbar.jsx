import { Box, Flex, Input, InputGroup, InputLeftElement, Icon } from '@chakra-ui/react';
import { FiSearch, FiFilter, FiPlus } from 'react-icons/fi';
import Button from './Button';

/**
 * Standard table toolbar — shared by every admin/owner DataTable page.
 * Row 1: search (grows to fill) + Filters toggle + primary Add action.
 * Row 2 (collapsible): the page's own filter controls, passed as children,
 * shown only while `filtersOpen` is true so the page reads clean by default.
 */
const TableToolbar = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  hasFilters = true,
  filtersOpen,
  onToggleFilters,
  addLabel,
  onAdd,
  children,
}) => {
  return (
    <Box mb={6}>
      <Flex gap={3} wrap="wrap">
        <InputGroup flex="1" minW={{ base: '100%', sm: '220px' }}>
          <InputLeftElement pointerEvents="none"><Icon as={FiSearch} color="gray.500" /></InputLeftElement>
          <Input placeholder={searchPlaceholder} value={searchValue} onChange={(e) => onSearchChange(e.target.value)} />
        </InputGroup>

        {hasFilters && (
          <Button
            variant={filtersOpen ? 'solid' : 'outline'}
            leftIcon={<Icon as={FiFilter} />}
            onClick={onToggleFilters}
            flexShrink={0}
          >
            Filters
          </Button>
        )}

        {addLabel && (
          <Button leftIcon={<Icon as={FiPlus} />} onClick={onAdd} flexShrink={0}>
            {addLabel}
          </Button>
        )}
      </Flex>

      {hasFilters && filtersOpen && (
        <Box mt={4} pt={4} borderTop="1px" borderColor="gray.200">
          {children}
        </Box>
      )}
    </Box>
  );
};

export default TableToolbar;
