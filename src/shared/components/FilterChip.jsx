import { Tag, TagLabel, TagCloseButton, useColorModeValue } from '@chakra-ui/react';

/**
 * Filter Chip Component
 * Used for quick filters and selected filter display
 */
const FilterChip = ({
  label,
  onRemove,
  isActive = false,
  onClick,
  closable = false,
  ...props
}) => {
  const activeBg = useColorModeValue('primary.700', 'primary.600');
  const activeColor = 'white';
  const inactiveBg = useColorModeValue('gray.100', 'gray.700');
  const inactiveColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Tag
      size="lg"
      borderRadius="md"
      bg={isActive ? activeBg : inactiveBg}
      color={isActive ? activeColor : inactiveColor}
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      transition="all 0.2s"
      _hover={
        onClick
          ? {
              transform: 'translateY(-1px)',
              boxShadow: 'sm',
            }
          : {}
      }
      fontWeight="500"
      {...props}
    >
      <TagLabel>{label}</TagLabel>
      {closable && <TagCloseButton onClick={onRemove} />}
    </Tag>
  );
};

export default FilterChip;
