import { useState } from 'react';
import { Flex, Wrap, WrapItem } from '@chakra-ui/react';
import FilterChip from './FilterChip';
import { spacing } from '../styles/tokens';

/**
 * QuickFilters Component
 * Displays a collection of quick filter chips for common search criteria
 */
const QuickFilters = ({ onFilterChange, initialFilters = [], ...props }) => {
  const [activeFilters, setActiveFilters] = useState(initialFilters);

  const filterOptions = [
    { id: 'near-universities', label: 'Near Universities', icon: '🎓' },
    { id: 'budget-friendly', label: 'Budget Friendly', icon: '💰' },
    { id: 'solo-room', label: 'Solo Room', icon: '🚪' },
    { id: 'female-only', label: 'Female Only', icon: '👩' },
    { id: 'with-wifi', label: 'With WiFi', icon: '📶' },
    { id: 'near-mrt-lrt', label: 'Near MRT/LRT', icon: '🚇' },
    { id: 'pet-friendly', label: 'Pet Friendly', icon: '🐾' },
    { id: 'newly-renovated', label: 'Newly Renovated', icon: '✨' },
    { id: '24-7-security', label: '24/7 Security', icon: '🔒' },
    { id: 'with-parking', label: 'With Parking', icon: '🚗' },
    { id: 'with-laundry', label: 'With Laundry', icon: '🧺' },
    { id: 'cooking-allowed', label: 'Cooking Allowed', icon: '🍳' },
  ];

  const handleFilterToggle = (filterId) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter((id) => id !== filterId)
      : [...activeFilters, filterId];

    setActiveFilters(newFilters);

    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  return (
    <Wrap spacing={spacing[2]} {...props}>
      {filterOptions.map((filter) => (
        <WrapItem key={filter.id}>
          <FilterChip
            label={filter.label}
            icon={filter.icon}
            isActive={activeFilters.includes(filter.id)}
            onClick={() => handleFilterToggle(filter.id)}
          />
        </WrapItem>
      ))}
    </Wrap>
  );
};

export default QuickFilters;
