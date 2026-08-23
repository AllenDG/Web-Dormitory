import { Box, Table, Thead, Tbody, Tr, Th, Td, HStack, Icon } from '@chakra-ui/react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { useSort } from '../hooks/useSort';
import { useContextMenu } from '../hooks/useContextMenu';
import ContextMenu from './ContextMenu';

/**
 * Generic sortable, grid-lined data table.
 *
 * Props:
 * - columns: [{ key, label, sortable?, render?(row), width? }]
 * - data: row objects
 * - getRowKey(row): unique key
 * - getRowActions?(row): [{label, icon, onClick, isDestructive}] — when
 *   provided, right-click (desktop) / long-press (touch) on a row opens a
 *   ContextMenu built from these. No visible ellipsis column is rendered.
 * - emptyState: node shown when data is empty
 */
const DataTable = ({ columns, data, getRowKey, getRowActions, emptyState }) => {
  const { sorted, sortKey, sortDir, toggleSort } = useSort(data);
  const { isOpen, position, activeItem, close, handlers } = useContextMenu();

  const hasActions = typeof getRowActions === 'function';

  return (
    <Box overflowX="auto" borderRadius="lg" border="1px" borderColor="gray.200">
      <Table variant="bordered" size="sm">
        <Thead>
          <Tr>
            {columns.map((column) => (
              <Th
                key={column.key}
                width={column.width}
                cursor={column.sortable ? 'pointer' : 'default'}
                userSelect="none"
                onClick={column.sortable ? () => toggleSort(column.key) : undefined}
              >
                <HStack spacing={1}>
                  <Box>{column.label}</Box>
                  {column.sortable && sortKey === column.key && (
                    <Icon as={sortDir === 'asc' ? FiChevronUp : FiChevronDown} boxSize={3} />
                  )}
                </HStack>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {sorted.length === 0 ? (
            <Tr>
              <Td colSpan={columns.length} textAlign="center" py={10} color="gray.600">
                {emptyState || 'No records found.'}
              </Td>
            </Tr>
          ) : (
            sorted.map((row) => (
              <Tr
                key={getRowKey(row)}
                _hover={hasActions ? { bg: 'gray.50' } : undefined}
                cursor={hasActions ? 'context-menu' : 'default'}
                onContextMenu={hasActions ? (e) => handlers.onContextMenu(e, row) : undefined}
                onTouchStart={hasActions ? (e) => handlers.onTouchStart(e, row) : undefined}
                onTouchMove={hasActions ? handlers.onTouchMove : undefined}
                onTouchEnd={hasActions ? handlers.onTouchEnd : undefined}
              >
                {columns.map((column) => (
                  <Td key={column.key}>{column.render ? column.render(row) : row[column.key]}</Td>
                ))}
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {hasActions && (
        <ContextMenu
          isOpen={isOpen}
          position={position}
          items={activeItem ? getRowActions(activeItem) : []}
          onClose={close}
        />
      )}
    </Box>
  );
};

export default DataTable;
