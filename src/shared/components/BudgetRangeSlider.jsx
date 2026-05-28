import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Input,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';
import { colors, spacing, borderRadius, typography } from '../styles/tokens';

/**
 * BudgetRangeSlider Component
 * Allows users to select a budget range for dormitory search
 */
const BudgetRangeSlider = ({
  min = 1000,
  max = 20000,
  step = 500,
  defaultValue = [3000, 10000],
  onChange,
  ...props
}) => {
  const [range, setRange] = useState(defaultValue);

  const handleSliderChange = (value) => {
    setRange(value);
    if (onChange) {
      onChange(value);
    }
  };

  const handleMinInputChange = (e) => {
    const value = parseInt(e.target.value) || min;
    const newRange = [Math.min(value, range[1] - step), range[1]];
    setRange(newRange);
    if (onChange) {
      onChange(newRange);
    }
  };

  const handleMaxInputChange = (e) => {
    const value = parseInt(e.target.value) || max;
    const newRange = [range[0], Math.max(value, range[0] + step)];
    setRange(newRange);
    if (onChange) {
      onChange(newRange);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Box width="100%" {...props}>
      <Text
        fontSize={typography.fontSize.sm}
        fontWeight={typography.fontWeight.medium}
        color={colors.gray[700]}
        mb={spacing[3]}
      >
        Budget Range
      </Text>

      {/* Range Slider */}
      <Box px={spacing[2]} mb={spacing[4]}>
        <RangeSlider
          min={min}
          max={max}
          step={step}
          value={range}
          onChange={handleSliderChange}
          focusThumbOnChange={false}
        >
          <RangeSliderTrack bg={colors.gray[200]} height="6px">
            <RangeSliderFilledTrack bg={colors.primary[700]} />
          </RangeSliderTrack>
          <RangeSliderThumb
            index={0}
            boxSize="20px"
            bg={colors.primary[700]}
            _focus={{
              boxShadow: `0 0 0 3px ${colors.primary[200]}`,
            }}
          />
          <RangeSliderThumb
            index={1}
            boxSize="20px"
            bg={colors.primary[700]}
            _focus={{
              boxShadow: `0 0 0 3px ${colors.primary[200]}`,
            }}
          />
        </RangeSlider>
      </Box>

      {/* Input Fields */}
      <Flex gap={spacing[3]} alignItems="center">
        <InputGroup size="sm" flex="1">
          <InputLeftAddon
            bg={colors.gray[100]}
            borderColor={colors.gray[200]}
            fontSize={typography.fontSize.sm}
          >
            Min
          </InputLeftAddon>
          <Input
            type="number"
            value={range[0]}
            onChange={handleMinInputChange}
            min={min}
            max={range[1] - step}
            step={step}
            borderColor={colors.gray[200]}
            borderRadius={borderRadius.md}
            fontSize={typography.fontSize.sm}
            _focus={{
              borderColor: colors.primary[500],
              boxShadow: `0 0 0 1px ${colors.primary[500]}`,
            }}
          />
        </InputGroup>

        <Text color={colors.gray[400]} fontSize={typography.fontSize.sm}>
          -
        </Text>

        <InputGroup size="sm" flex="1">
          <InputLeftAddon
            bg={colors.gray[100]}
            borderColor={colors.gray[200]}
            fontSize={typography.fontSize.sm}
          >
            Max
          </InputLeftAddon>
          <Input
            type="number"
            value={range[1]}
            onChange={handleMaxInputChange}
            min={range[0] + step}
            max={max}
            step={step}
            borderColor={colors.gray[200]}
            borderRadius={borderRadius.md}
            fontSize={typography.fontSize.sm}
            _focus={{
              borderColor: colors.primary[500],
              boxShadow: `0 0 0 1px ${colors.primary[500]}`,
            }}
          />
        </InputGroup>
      </Flex>

      {/* Display Selected Range */}
      <Flex justifyContent="space-between" mt={spacing[2]}>
        <Text fontSize={typography.fontSize.xs} color={colors.gray[600]}>
          {formatCurrency(range[0])}
        </Text>
        <Text fontSize={typography.fontSize.xs} color={colors.gray[600]}>
          {formatCurrency(range[1])}
        </Text>
      </Flex>
    </Box>
  );
};

export default BudgetRangeSlider;
