import { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, HStack, VStack, Flex, Text, Select, IconButton, Icon } from '@chakra-ui/react';
import { FiChevronUp, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useSort } from '../hooks/useSort';
import { useContextMenu } from '../hooks/useContextMenu';
import ContextMenu from './ContextMenu';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/**
 * Generic sortable, paginated, grid-lined data table — the standard list
 * view for every admin/owner table (Users, Properties, Reports, Revenue,
 * Audit Log). Pagination and "entries per page" are self-contained so no
 * page has to reimplement them.
 *
 * Props:
 * - columns: [{ key, label, sortable?, render?(row), width? }]
 * - data: row objects (already search/filtered by the caller)
 * - getRowKey(row): unique key
 * - getRowActions?(row): [{label, icon, onClick, isDestructive}] — when
 *   provided, right-click (desktop) / long-press (touch) on a row opens a
 *   ContextMenu built from these. No visible ellipsis column is rendered.
 * - emptyState: node shown when data is empty
 * - pageSizeOptions / defaultPageSize: override the "Show X entries" choices
 */
const DataTable = ({
  columns,
  data,
  getRowKey,
  getRowActions,
  emptyState,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  defaultPageSize = 10,
}) => {
  const { sorted, sortKey, sortDir, toggleSort } = useSort(data);
  const { isOpen, position, activeItem, close, handlers } = useContextMenu();
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [page, setPage] = useState(1);

  // A genuinely new filtered/search result set should always start back at
  // page 1 — otherwise a narrower filter can land the viewer on a blank page.
  useEffect(() => {
    setPage(1);
  }, [data]);

  const hasActions = typeof getRowActions === 'function';
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, total);
  const pageRows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Box>
      <Flex justify="flex-start" align="center" mb={3} gap={2}>
        <Text fontSize="sm" color="gray.600">Show</Text>
        <Select
          size="sm"
          w="80px"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </Select>
        <Text fontSize="sm" color="gray.600">entries</Text>
      </Flex>

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
                  <HStack justify="space-between" w="full" spacing={2}>
                    <Box>{column.label}</Box>
                    {column.sortable && (
                      <VStack spacing={0}>
                        <Icon
                          as={FiChevronUp}
                          boxSize={3}
                          mb="-3px"
                          color={sortKey === column.key && sortDir === 'asc' ? 'primary.600' : 'gray.400'}
                        />
                        <Icon
                          as={FiChevronDown}
                          boxSize={3}
                          mt="-3px"
                          color={sortKey === column.key && sortDir === 'desc' ? 'primary.600' : 'gray.400'}
                        />
                      </VStack>
                    )}
                  </HStack>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {pageRows.length === 0 ? (
              <Tr>
                <Td colSpan={columns.length} textAlign="center" py={10} color="gray.600">
                  {emptyState || 'Nothing here yet — try a different search or clear your filters.'}
                </Td>
              </Tr>
            ) : (
              pageRows.map((row) => (
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

      <Flex justify="space-between" align="center" mt={4} wrap="wrap" gap={3}>
        <Text fontSize="sm" color="gray.600">
          {total === 0 ? 'No entries' : `Showing ${startIdx} to ${endIdx} of ${total} entries`}
        </Text>

        {totalPages > 1 && (
          <HStack spacing={1}>
            <IconButton
              aria-label="Previous page"
              icon={<Icon as={FiChevronLeft} />}
              size="sm"
              variant="outline"
              isDisabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            />
            {pageNumbers.map((n) => (
              <IconButton
                key={n}
                aria-label={`Page ${n}`}
                size="sm"
                variant={n === currentPage ? 'solid' : 'outline'}
                colorScheme={n === currentPage ? 'primary' : 'gray'}
                onClick={() => setPage(n)}
              >
                {n}
              </IconButton>
            ))}
            <IconButton
              aria-label="Next page"
              icon={<Icon as={FiChevronRight} />}
              size="sm"
              variant="outline"
              isDisabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
            />
          </HStack>
        )}
      </Flex>
    </Box>
  );
};

export default DataTable;
